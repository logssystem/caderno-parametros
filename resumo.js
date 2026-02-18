document.addEventListener("DOMContentLoaded", () => {
  /* ================= TEMA ================= */
  const temaSalvo = localStorage.getItem("tema");
  document.body.classList.toggle("dark", temaSalvo === "dark");

  /* ================= DADOS ================= */
  const raw = localStorage.getItem("CONFIG_CADERNO");
  if (!raw) return;

  let dados;
  try {
    dados = JSON.parse(raw);
  } catch {
    console.error("JSON inválido");
    return;
  }

  const resumo = document.getElementById("resumo");
  if (!resumo) return;
  resumo.innerHTML = "";

  /* ================= CLIENTE ================= */
  if (dados.cliente) {
    resumo.innerHTML += `
      <div class="card">
        <h2>🏢 Dados do Cliente</h2>
        <p><b>Empresa:</b> ${dados.cliente.empresa || "-"}</p>
        <p><b>Domínio:</b> ${dados.cliente.dominio || "-"}</p>
        <p><b>CNPJ:</b> ${dados.cliente.cnpj || "-"}</p>
      </div>
    `;
  }

  const voz = dados.voz || {};

  /* ================= USUÁRIOS ================= */
  if (voz.usuarios?.length) {
    resumo.innerHTML += `
      <div class="card">
        <h2>👤 Usuários Web</h2>
        ${voz.usuarios.map(u => `
          <p>
            <b>Nome:</b> ${u.nome}<br>
            <b>Email:</b> ${u.email}<br>
            <b>Permissão:</b> ${u.permissao}<br>
            <b>Agente:</b> ${u.agente ? "Sim" : "Não"}
          </p><hr>
        `).join("")}
      </div>
    `;
  }

  /* ================= RAMAIS ================= */
  if (voz.ramais?.length) {
    resumo.innerHTML += `
      <div class="card">
        <h2>📞 Ramais</h2>
        ${voz.ramais.map(r => `
          <p><b>Ramal:</b> ${r.ramal}<br><b>Senha:</b> <code>${r.senha}</code></p><hr>
        `).join("")}
      </div>
    `;
  }

  /* ================= AGENTES ================= */
  if (voz.agentes?.length) {
    resumo.innerHTML += `
      <div class="card">
        <h2>🎧 Agentes</h2>
        ${voz.agentes.map(a => `
          <p>
            <b>Nome:</b> ${a.nome}<br>
            <b>Ramal:</b> ${a.ramal}
          </p><hr>
        `).join("")}
      </div>
    `;
  }

  /* ================= CHAT ================= */
  if (dados.chat) {
    const chat = dados.chat;
    let html = `
      <div class="card chat-card">
        <h2>💬 Atendimento por Chat</h2>
        <p><b>Tipo:</b> ${chat.tipo}</p>
        <p><b>API:</b> ${chat.api}</p>
        <p><b>Conta:</b> ${chat.conta}</p>
        <p><b>Canais:</b> ${(chat.canais || []).join(", ")}</p>
    `;

    if (chat.departamentos?.length) {
      html += `<hr><h3>🏷️ Departamentos</h3>`;
      chat.departamentos.forEach(d => {
        html += `
          <div>
            <strong>${d.nome}</strong>
            <ul>${(d.agentes || []).map(a => `<li>${a}</li>`).join("")}</ul>
          </div>
        `;
      });
    }

    if (chat.agentes?.length) {
      html += `<hr><h3>🎧 Agentes</h3>`;
      chat.agentes.forEach(a => {
        html += `
          <div>
            <strong>${a.nome}</strong><br>
            Usuário: ${a.usuario}<br>
            Departamentos: ${(a.departamentos || []).join(", ")}
          </div>
        `;
      });
    }

    html += `</div>`;
    resumo.innerHTML += html;
  }
});

/* ================= VOLTAR ================= */
window.voltar = function () {
  window.location.href = "index.html";
};
