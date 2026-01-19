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
