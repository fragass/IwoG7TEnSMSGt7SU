async function uploadFile(file) {
  if (!file) return null;

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("https://YOUR_PROJECT_ID.supabase.co/storage/v1/object/posts/" + file.name, {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + SUPABASE_ANON_KEY
    },
    body: file
  });

  return "https://YOUR_PROJECT_ID.supabase.co/storage/v1/object/public/posts/" + file.name;
}

async function enviarPost() {
  const nome = document.getElementById("nome").value;
  const titulo = document.getElementById("titulo").value;
  const conteudo = document.getElementById("conteudo").value;

  const file1 = document.getElementById("file1").files[0];
  const file2 = document.getElementById("file2").files[0];
  const file3 = document.getElementById("file3").files[0];

  const arquivos = [
    await uploadFile(file1),
    await uploadFile(file2),
    await uploadFile(file3)
  ];

  await fetch("/api/supabase", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, titulo, conteudo, arquivos })
  });

  alert("Post criado!");
}
