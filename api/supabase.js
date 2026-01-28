import formidable from "formidable";
import fs from "fs";

export const config = {
  api: { bodyParser: false }
};

export default async function handler(req, res) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

  if (req.method === "POST") {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      try {
        if (err) throw err;

        const nome = fields.nome;
        const titulo = fields.titulo;
        const conteudo = fields.conteudo;

        async function upload(file) {
          if (!file) return null;

          const buffer = fs.readFileSync(file.filepath);
          const filename = `${Date.now()}-${file.originalFilename}`;

          const uploadRes = await fetch(
            `${SUPABASE_URL}/storage/v1/object/posts/${filename}`,
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

          if (!uploadRes.ok) {
            const t = await uploadRes.text();
            throw new Error("Upload falhou: " + t);
          }

          return `${SUPABASE_URL}/storage/v1/object/public/posts/${filename}`;
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

        if (!response.ok) {
          const t = await response.text();
          throw new Error("Insert falhou: " + t);
        }

        return res.status(200).json({ ok: true });
      } catch (e) {
        console.error("API ERROR:", e);
        return res.status(500).json({ error: e.message });
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
