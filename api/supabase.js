import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { nome, titulo, conteudo, arquivos } = req.body;

    const { data, error } = await supabase
      .from("posts")
      .insert([
        {
          nome,
          titulo,
          conteudo,
          arquivo1: arquivos[0] || null,
          arquivo2: arquivos[1] || null,
          arquivo3: arquivos[2] || null,
        },
      ]);

    if (error) return res.status(500).json(error);
    return res.status(200).json(data);
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
