const form = document.getElementById("postForm");
const popup = document.getElementById("popup");
const ok = document.getElementById("ok");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const texto = document.getElementById("texto").value;

  const img1 = document.getElementById("img1").files[0];
  const img2 = document.getElementById("img2").files[0];
  const img3 = document.getElementById("img3").files[0];

  function toBase64(file) {
    return new Promise((resolve) => {
      if (!file) return resolve(null);
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  }

  const body = {
    nome,
    texto,
    img1: await toBase64(img1),
    img2: await toBase64(img2),
    img3: await toBase64(img3)
  };

  await fetch("/api/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  form.reset();
  popup.classList.add("show");
});

ok.onclick = () => popup.classList.remove("show");
