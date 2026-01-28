async function carregarPosts() {
  const res = await fetch("/api/supabase");
  const posts = await res.json();

  const container = document.getElementById("posts");

  posts.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>${p.nome}</h3>
      <p>${p.titulo}</p>
      <small>${new Date(p.created_at).toLocaleString()}</small>
      <br>
      <button onclick='abrirPopup(${JSON.stringify(p)})'>+</button>
    `;

    container.appendChild(card);
  });
}

function abrirPopup(post) {
  document.getElementById("popup").style.display = "block";

  document.getElementById("popup-body").innerHTML = `
    <h2>${post.nome}</h2>
    <p>${post.conteudo}</p>
    ${post.arquivo1 ? `<a href="${post.arquivo1}" download>Arquivo 1</a>` : ""}
    ${post.arquivo2 ? `<a href="${post.arquivo2}" download>Arquivo 2</a>` : ""}
    ${post.arquivo3 ? `<a href="${post.arquivo3}" download>Arquivo 3</a>` : ""}
  `;
}

function fecharPopup() {
  document.getElementById("popup").style.display = "none";
}

carregarPosts();
