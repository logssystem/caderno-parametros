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

function voltar() {
  window.location.href = "index.html"; // ou o nome do arquivo principal do caderno
}

// ================= RESUMO CHAT DEFINITIVO =================

document.addEventListener("DOMContentLoaded", () => {
  const raw = localStorage.getItem("CONFIG_CADERNO");
  if (!raw) return;

  let dados;
  try {
    dados = JSON.parse(raw);
  } catch (e) {
    console.error("Erro ao ler CONFIG_CADERNO", e);
    return;
  }

  const chat = dados.chat || {};

  const empresa = dados.cliente?.empresa || "-";
  const dominio = dados.cliente?.dominio || "-";

  const tipo =
    chat.tipo === "api" ? "API Oficial" :
    chat.tipo === "qr" ? "QR Code" :
    "Não definido";

  const api = chat.api || "Não definido";
  const conta = chat.conta || "Não definido";
  const canais = chat.canais?.length ? chat.canais.join(", ") : "Nenhum";

  const box = document.getElementById("resumoChat");
  if (!box) return;

  box.innerHTML = `
    <h3>💬 Resumo do Atendimento por Chat</h3>
    <p><b>Empresa:</b> ${empresa}</p>
    <p><b>Domínio:</b> ${dominio}</p>
    <p><b>Tipo de integração:</b> ${tipo}</p>
    <p><b>API oficial:</b> ${api}</p>
    <p><b>Conta:</b> ${conta}</p>
    <p><b>Canais:</b> ${canais}</p>
  `;
});

document.addEventListener("DOMContentLoaded", () => {
  const raw = localStorage.getItem("CONFIG_CADERNO");
  if (!raw) return;

  const dados = JSON.parse(raw);
  const chat = dados.chat || {};

  const tipo =
    chat.tipo === "api" ? "API Oficial" :
    chat.tipo === "qr" ? "QR Code" :
    "Não definido";

  document.getElementById("resumoChat").innerHTML = `
    <h3>💬 Resumo do Atendimento por Chat</h3>
    <p><b>Empresa:</b> ${dados.cliente?.empresa || "-"}</p>
    <p><b>Domínio:</b> ${dados.cliente?.dominio || "-"}</p>
    <p><b>Tipo de integração:</b> ${tipo}</p>
    <p><b>API oficial:</b> ${chat.api || "-"}</p>
    <p><b>Conta:</b> ${chat.conta || "-"}</p>
    <p><b>Canais:</b> ${chat.canais?.join(", ") || "-"}</p>
  `;
});
