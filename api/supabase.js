import { createClient } from "@supabase/supabase-js";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      try {
        if (err) return res.status(500).json({ error: "Erro no form" });

        const nome = fields.nome;
        const titulo = fields.titulo;
        const conteudo = fields.conteudo;

        async function upload(file) {
          if (!file) return null;

          const buffer = fs.readFileSync(file.filepath);

          const { data, error } = await supabase.storage
            .from("posts")
            .upload(`${Date.now()}-${file.originalFilename}`, buffer, {
              contentType: file.mimetype,
            });

          if (error) throw error;

          return `${process.env.SUPABASE_URL}/storage/v1/object/public/posts/${data.path}`;
        }

        const arquivo1 = await upload(files.file1);
        const arquivo2 = await upload(files.file2);
        const arquivo3 = await upload(files.file3);

        const { error } = await supabase.from("posts").insert([
          {
            nome,
            titulo,
            conteudo,
            arquivo1,
            arquivo2,
            arquivo3,
          },
        ]);

        if (error) throw error;

        res.status(200).json({ ok: true });
      } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Erro interno" });
      }
    });
  }

  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return res.status(500).json(error);
    return res.status(200).json(data);
  }
}
