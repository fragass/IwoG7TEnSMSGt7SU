async function enviarPost() {
  const formData = new FormData();

  formData.append("nome", document.getElementById("nome").value);
  formData.append("titulo", document.getElementById("titulo").value);
  formData.append("conteudo", document.getElementById("conteudo").value);

  formData.append("file1", document.getElementById("file1").files[0]);
  formData.append("file2", document.getElementById("file2").files[0]);
  formData.append("file3", document.getElementById("file3").files[0]);

  const res = await fetch("/api/supabase", {
    method: "POST",
    body: formData
  });

  if (res.ok) {
    alert("Post criado!");
  } else {
    alert("Erro ao criar post.");
  }
}
