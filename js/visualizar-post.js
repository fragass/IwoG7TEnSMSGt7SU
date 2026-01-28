const container = document.getElementById("tickets");

const popup = document.getElementById("popup");
const popupTitulo = document.getElementById("popupTitulo");
const popupTipo = document.getElementById("popupTipo");
const popupConteudo = document.getElementById("popupConteudo");
const fecharPopup = document.getElementById("fecharPopup");

container.innerHTML = "<p>Carregando posts...</p>";

function formatarData(dataISO) {
  const d = new Date(dataISO);
  d.setHours(d.getHours() - 3);

  return `${d.getDate().toString().padStart(2,"0")}/${(d.getMonth()+1)
    .toString().padStart(2,"0")}/${d.getFullYear()}`;
}

async function carregarPosts() {
  const res = await fetch("/api/posts");
  const data = await res.json();
  container.innerHTML = "";

  data.forEach(p => {
    const card = document.createElement("div");
    card.className = "ticket-card";

    card.innerHTML = `
      <div>
        <span class="ticket-tipo" style="color:white">${p.nome}</span>
        <div class="ticket-data">${formatarData(p.created_at)}</div>
      </div>
      <button class="ticket-btn">+</button>
    `;

    card.querySelector(".ticket-btn").onclick = () => {
      popupTitulo.textContent = p.nome;
      popupTipo.textContent = "POST";
      popupConteudo.innerHTML = `
        <p>${p.texto}</p>
        ${p.img1 ? `<a href="${p.img1}" download>📥 Imagem 1</a><br>` : ""}
        ${p.img2 ? `<a href="${p.img2}" download>📥 Imagem 2</a><br>` : ""}
        ${p.img3 ? `<a href="${p.img3}" download>📥 Imagem 3</a>` : ""}
      `;
      popup.classList.add("show");
    };

    container.appendChild(card);
  });
}

fecharPopup.onclick = () => popup.classList.remove("show");
popup.onclick = e => { if (e.target === popup) popup.classList.remove("show"); };

carregarPosts();
