const raw = localStorage.getItem("CONFIG_CADERNO");

if (!raw) {
  document.body.innerHTML = "<h2>Configuração não encontrada.</h2>";
  throw new Error("Sem dados salvos");
}

const config = JSON.parse(raw);
const resumo = document.getElementById("resumo");

/* ========= HELPERS ========= */

function card(titulo, conteudo) {
  const c = document.createElement("section");
  c.className = "card";
  c.innerHTML = `<h2>${titulo}</h2>`;
  c.append(conteudo);
  return c;
}

function lista(arr, render) {
  const ul = document.createElement("ul");
  ul.style.lineHeight = "1.8";
  arr.forEach(i => {
    const li = document.createElement("li");
    li.innerHTML = render(i);
    ul.appendChild(li);
  });
  return ul;
}

/* ========= CLIENTE ========= */

const cliente = document.createElement("div");
cliente.innerHTML = `
<b>Empresa:</b> ${config.cliente?.empresa || "-"}<br>
<b>Domínio:</b> ${config.cliente?.dominio || "-"}
`;

resumo.append(card("Dados do Cliente", cliente));

/* ========= USUÁRIOS ========= */

resumo.append(card(
  `Usuários (${config.voz.usuarios.length})`,
  lista(config.voz.usuarios, u =>
    `${u.nome} - ${u.email} ${u.agente ? "<b>(Agente)</b>" : ""}`
  )
));

/* ========= AGENTES ========= */

resumo.append(card(
  `Agentes (${config.voz.agentes.length})`,
  lista(config.voz.agentes, a =>
    `${a.nome} → Ramal: <b>${a.ramal}</b>`
  )
));

/* ========= RAMAIS ========= */

resumo.append(card(
  `Ramais (${config.voz.ramais.length})`,
  lista(config.voz.ramais, r =>
    `Ramal ${r.ramal}`
  )
));

/* ========= JSON FINAL ========= */

const pre = document.createElement("pre");
pre.textContent = JSON.stringify(config, null, 2);
pre.style.maxHeight = "400px";
pre.style.overflow = "auto";

resumo.append(card("JSON Gerado", pre));

/* ========= VOLTAR ========= */

function voltar() {
  history.back();
}

window.voltar = voltar;

/* ================= DARK MODE (RESUMO) ================= */

(function aplicarTemaResumo() {
  const tema = localStorage.getItem("tema_caderno") || "light";
  if (tema === "dark") {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
})();

const dados = JSON.parse(localStorage.getItem("CONFIG_CADERNO") || "{}");

const resumo = document.getElementById("resumo");

/* ================= RESUMO CHAT ================= */

if (dados.chat) {
  const chat = dados.chat;

  const canais = (chat.canais || []).length
    ? chat.canais.join(", ")
    : "Nenhum canal selecionado";

  let htmlChat = `
    <div class="card">
      <h2>💬 Resumo do Atendimento por Chat</h2>

      <p><b>Empresa:</b> ${dados.cliente?.empresa || "-"}</p>
      <p><b>Domínio:</b> ${dados.cliente?.dominio || "-"}</p>
      <p><b>Tipo de integração:</b> ${chat.tipo || "-"}</p>
  `;

  if (chat.tipo === "api") {
    htmlChat += `
      <p><b>API oficial:</b> ${chat.api || "-"}</p>
      <p><b>Conta:</b> ${chat.conta || "-"}</p>
      <p><b>Canais:</b> ${canais}</p>
    `;
  }

  if (chat.tipo === "qr") {
    htmlChat += `
      <p><b>Integração via QR Code</b></p>
    `;
  }

  htmlChat += `</div>`;

  resumo.innerHTML += htmlChat;
}
