document.addEventListener("DOMContentLoaded", () => {
  /* ===== TEMA ===== */
  const temaSalvo = localStorage.getItem("tema");
  document.body.classList.toggle("dark", temaSalvo === "dark");

  /* ===== DADOS ===== */
  const raw = localStorage.getItem("CONFIG_CADERNO");
  if (!raw) {
    console.warn("CONFIG_CADERNO não encontrado");
    return;
  }

  let dados;
  try {
    dados = JSON.parse(raw);
  } catch (e) {
    console.error("JSON inválido", e);
    return;
  }

  const resumo = document.getElementById("resumo");
  if (!resumo) {
    console.error("Elemento #resumo não encontrado");
    return;
  }

  resumo.innerHTML = "";

  /* ================= CLIENTE ================= */
  if (dados.cliente) {
    resumo.innerHTML += `
      <section class="resumo-bloco">
        <h2>🏢 Dados do Cliente</h2>
        <div class="resumo-card">
          <div class="info-linha"><strong>Empresa:</strong> ${dados.cliente.empresa}</div>
          <div class="info-linha"><strong>Domínio:</strong> ${dados.cliente.dominio}</div>
          <div class="info-linha"><strong>CNPJ:</strong> ${dados.cliente.cnpj}</div>
        </div>
      </section>
    `;
  }

  /* ================= VOZ ================= */
  if (!dados.voz) {
    resumo.innerHTML += `
      <section class="resumo-bloco">
        <h2>⚠️ Voz</h2>
        <div class="resumo-card">Nenhuma configuração de voz encontrada.</div>
      </section>
    `;
  } else {
    const voz = dados.voz;

    if (voz.usuarios?.length) {
      resumo.innerHTML += `
        <section class="resumo-bloco">
          <h2>👤 Usuários Web</h2>
          <div class="resumo-grid">
            ${voz.usuarios.map(u => `
              <div class="resumo-card">
                <div class="titulo">${u.nome}</div>
                <div class="info-linha">📧 ${u.email}</div>
                <div class="info-linha">🔐 ${u.senha}</div>
                <div class="info-linha">
                  ${u.permissao}
                  ${u.agente ? `<span class="badge">Agente</span>` : ""}
                </div>
              </div>
            `).join("")}
          </div>
        </section>
      `;
    }

    if (voz.ramais?.length) {
      resumo.innerHTML += `
        <section class="resumo-bloco">
          <h2>📞 Ramais</h2>
          <div class="resumo-grid">
            ${voz.ramais.map(r => `
              <div class="resumo-card">
                <div class="titulo">Ramal ${r.ramal}</div>
                <div class="info-linha">🔐 ${r.senha}</div>
              </div>
            `).join("")}
          </div>
        </section>
      `;
    }
  }

  /* ================= CHAT ================= */
  if (dados.chat) {
    const chat = dados.chat;
    resumo.innerHTML += `
      <section class="resumo-bloco">
        <h2>💬 Atendimento por Chat</h2>
        <div class="resumo-card">
          <div class="info-linha"><strong>Tipo:</strong> ${chat.tipo}</div>
          <div class="info-linha"><strong>API:</strong> ${chat.api}</div>
          <div class="info-linha"><strong>Conta:</strong> ${chat.conta}</div>
          <div class="info-linha"><strong>Canais:</strong> ${(chat.canais || []).join(", ")}</div>
        </div>
      </section>
    `;
  }
});

/* ===== VOLTAR ===== */
window.voltar = () => {
  window.location.href = "index.html";
};
