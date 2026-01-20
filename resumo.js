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

  const resumo = document.getElementById("resumo");
  if (!resumo) return;

  resumo.innerHTML = "";

  /* ================= DADOS DO CLIENTE ================= */

  if (dados.cliente) {
    resumo.innerHTML += `
      <div class="card">
        <h2>🏢 Dados do Cliente</h2>
        <p><b>Empresa:</b> ${dados.cliente.empresa || "-"}</p>
        <p><b>Domínio:</b> ${dados.cliente.dominio || "-"}</p>
      </div>
    `;
  }

  /* ================= VOZ ================= */

  const voz = dados.voz || {};

  // 👉 Usuários
  if (voz.usuarios?.length) {
    resumo.innerHTML += `
      <div class="card">
        <h2>👤 Usuários Web</h2>
        ${voz.usuarios.map(u => `
          <p>
            <b>Nome:</b> ${u.nome || "-"} <br>
            <b>Email:</b> ${u.email || "-"} <br>
            <b>Senha:</b> <code>${u.senha || "-"}</code><br>
            <b>Permissão:</b> ${u.permissao || "-"} <br>
            <b>Agente:</b> ${u.agente ? "Sim" : "Não"}
          </p>
          <hr>
        `).join("")}
      </div>
    `;
  }

  // 👉 Ramais
  if (voz.ramais?.length) {
    resumo.innerHTML += `
      <div class="card">
        <h2>📞 Ramais</h2>
        ${voz.ramais.map(r => `
          <p>
            <b>Ramal:</b> ${r.ramal || "-"} <br>
            <b>Senha:</b> <code>${r.senha || "-"}</code>
          </p>
          <hr>
        `).join("")}
      </div>
    `;
  }

  // 👉 Agentes
  if (voz.agentes?.length) {
    resumo.innerHTML += `
      <div class="card">
        <h2>🎧 Agentes</h2>
        ${voz.agentes.map(a => `
          <p>
            <b>Nome:</b> ${a.nome || "-"} <br>
            <b>Ramal:</b> ${a.ramal || "-"}
          </p>
          <hr>
        `).join("")}
      </div>
    `;
  }

  // 👉 Filas
  if (voz.filas?.length) {
    resumo.innerHTML += `
      <div class="card">
        <h2>👥 Filas</h2>
        ${voz.filas.map(f => `
          <p>
            <b>Fila:</b> ${f.nome || "-"} <br>
            <b>Agentes:</b> ${f.agentes?.length ? f.agentes.join(", ") : "Nenhum"}
          </p>
          <hr>
        `).join("")}
      </div>
    `;
  }

  // 👉 Regras de tempo
  if (voz.regras_tempo?.length) {
    resumo.innerHTML += `
      <div class="card">
        <h2>⏰ Regras de Tempo</h2>
        ${voz.regras_tempo.map(r => `
          <p>
            <b>Nome:</b> ${r.nome || "-"} <br>
            <b>Dias:</b> ${r.dias?.join(", ") || "-"} <br>
            <b>Horário:</b> ${r.hora_inicio || "--:--"} até ${r.hora_fim || "--:--"}
          </p>
          <hr>
        `).join("")}
      </div>
    `;
  }

  /* ================= CHAT ================= */

  if (dados.chat) {
    const chat = dados.chat;
    const canais = chat.canais?.length ? chat.canais.join(", ") : "Nenhum";

    const tipo =
      chat.tipo === "api" ? "API Oficial" :
      chat.tipo === "qr" ? "QR Code" :
      "Não definido";

    resumo.innerHTML += `
      <div class="card">
        <h2>💬 Atendimento por Chat</h2>
        <p><b>Tipo de integração:</b> ${tipo}</p>
        <p><b>API oficial:</b> ${chat.api || "-"}</p>
        <p><b>Conta:</b> ${chat.conta || "-"}</p>
        <p><b>Canais:</b> ${canais}</p>
      </div>
    `;
  }
});

/* ================= VOLTAR ================= */

function voltar() {
  window.location.href = "index.html";
}
