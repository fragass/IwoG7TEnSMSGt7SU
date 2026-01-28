import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

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

          const uploadRes = await fetch(
            `${SUPABASE_URL}/storage/v1/object/posts/${Date.now()}-${file.originalFilename}`,
            {
              method: "POST",
              headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": `Bearer ${SUPABASE_KEY}`,
                "Content-Type": file.mimetype
              },
              body: buffer
            }
          );

          if (!uploadRes.ok) throw new Error("Erro no upload");

          return `${SUPABASE_URL}/storage/v1/object/public/posts/${Date.now()}-${file.originalFilename}`;
        }

        const arquivo1 = await upload(files.file1);
        const arquivo2 = await upload(files.file2);
        const arquivo3 = await upload(files.file3);

        const response = await fetch(`${SUPABASE_URL}/rest/v1/posts`, {
          method: "POST",
          headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${SUPABASE_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            nome,
            titulo,
            conteudo,
            arquivo1,
            arquivo2,
            arquivo3
          })
        });

        if (!response.ok) throw new Error("Erro ao inserir no banco");

        return res.status(200).json({ ok: true });
      } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Erro interno" });
      }
    });
  }

  if (req.method === "GET") {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/posts?select=*`, {
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`
      }
    });

    const data = await response.json();
    return res.status(200).json(data);
  }
}
