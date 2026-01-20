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

  /* ================= RESUMO CLIENTE ================= */

  const empresa = dados.cliente?.empresa || "-";
  const dominio = dados.cliente?.dominio || "-";

  const boxCliente = document.getElementById("resumoCliente");
  if (boxCliente) {
    boxCliente.innerHTML = `
      <div class="card">
        <h3>🏢 Dados do Cliente</h3>
        <p><b>Empresa:</b> ${empresa}</p>
        <p><b>Domínio:</b> ${dominio}</p>
      </div>
    `;
  }

  /* ================= RESUMO VOZ ================= */

  const voz = dados.voz || {};

  const boxVoz = document.getElementById("resumoVoz");
  if (boxVoz) {
    boxVoz.innerHTML = `
      <div class="card">
        <h3>📞 Resumo da Voz</h3>
        <p><b>Usuários:</b> ${voz.usuarios?.length || 0}</p>
        <p><b>Ramais:</b> ${voz.ramais?.length || 0}</p>
        <p><b>Agentes:</b> ${voz.agentes?.length || 0}</p>
      </div>
    `;
  }

  /* ================= RESUMO CHAT ================= */

  const chat = dados.chat || {};

  const tipo =
    chat.tipo === "api" ? "API Oficial" :
    chat.tipo === "qr" ? "QR Code" :
    "Não definido";

  const api = chat.api || "Não definido";
  const conta = chat.conta || "Não definido";
  const canais = chat.canais?.length ? chat.canais.join(", ") : "Nenhum";

  const boxChat = document.getElementById("resumoChat");
  if (boxChat) {
    boxChat.innerHTML = `
      <div class="card">
        <h3>💬 Resumo do Atendimento por Chat</h3>
        <p><b>Empresa:</b> ${empresa}</p>
        <p><b>Domínio:</b> ${dominio}</p>
        <p><b>Tipo de integração:</b> ${tipo}</p>
        <p><b>API oficial:</b> ${api}</p>
        <p><b>Conta:</b> ${conta}</p>
        <p><b>Canais:</b> ${canais}</p>
      </div>
    `;
  }
});

/* ================= BOTÃO VOLTAR ================= */

function voltar() {
  window.location.href = "index.html";
}
