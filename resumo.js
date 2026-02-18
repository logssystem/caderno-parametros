document.addEventListener("DOMContentLoaded", () => {
  /* ===== TEMA ===== */
  const temaSalvo = localStorage.getItem("tema");
  document.body.classList.toggle("dark", temaSalvo === "dark");

  /* ===== DADOS ===== */
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

  /* ===== CLIENTE ===== */
  if (dados.cliente) {
    resumo.innerHTML += `
      <div class="card">
        <h2>🏢 Dados do Cliente</h2>
        <div><strong>Empresa:</strong> ${dados.cliente.empresa}</div>
        <div><strong>Domínio:</strong> ${dados.cliente.dominio}</div>
        <div><strong>CNPJ:</strong> ${dados.cliente.cnpj}</div>
      </div>
    `;
  }

    /* ===== VOZ ===== */
  if (dados.voz) {

    // Usuários Web
    if (dados.voz.usuarios?.length) {
      resumo.innerHTML += `
        <div class="card">
          <h2>👤 Usuários Web</h2>
          ${dados.voz.usuarios.map(u => `
            <div>
              <strong>${u.nome}</strong> — ${u.permissao}
            </div>
          `).join("")}
        </div>
      `;
    }

    // Ramais
    if (dados.voz.ramais?.length) {
      resumo.innerHTML += `
        <div class="card">
          <h2>☎️ Ramais</h2>
          ${dados.voz.ramais.map(r => `
            <div>
              <strong>Ramal:</strong> ${r.ramal}
            </div>
          `).join("")}
        </div>
      `;
    }

    // Agentes
    if (dados.voz.agentes?.length) {
      resumo.innerHTML += `
        <div class="card">
          <h2>🎧 Agentes</h2>
          ${dados.voz.agentes.map(a => `
            <div>
              <strong>${a.nome}</strong> — Ramal: ${a.ramal}
            </div>
          `).join("")}
        </div>
      `;
    }

    // Filas
    if (dados.voz.filas?.length) {
      resumo.innerHTML += `
        <div class="card">
          <h2>👥 Filas</h2>
          ${dados.voz.filas.map(f => `
            <div>
              <strong>${f.nome}</strong><br>
              Agentes: ${(f.agentes || []).join(", ")}
            </div>
          `).join("")}
        </div>
      `;
    }

    // URAs
    if (dados.voz.uras?.length) {
      resumo.innerHTML += `
        <div class="card">
          <h2>📞 URAs</h2>
          ${dados.voz.uras.map(u => `
            <div>
              <strong>${u.nome}</strong>
            </div>
          `).join("")}
        </div>
      `;
    }

  }
  
  /* ===== CHAT ===== */
  if (dados.chat) {
    const chat = dados.chat;

    resumo.innerHTML += `
      <div class="card chat-card">
        <h2>💬 Atendimento por Chat</h2>

        <div class="chat-grid">
          <div><span>Tipo</span>${chat.tipo}</div>
          <div><span>API</span>${chat.api}</div>
          <div><span>Conta</span>${chat.conta}</div>
          <div><span>Canais</span>${(chat.canais || []).join(", ")}</div>
        </div>

        ${
          chat.departamentos?.length
            ? `
            <h3>🏷️ Departamentos</h3>
            ${chat.departamentos.map(dep => `
              <div class="chat-box">
                <strong>${dep.nome}</strong>
                <div class="chat-users">
                  ${(dep.agentes || []).map(a => `<span class="chip-user">${a}</span>`).join("")}
                </div>
              </div>
            `).join("")}
          `
            : ""
        }

        ${
          chat.agentes?.length
            ? `
            <h3>🎧 Agentes</h3>
            ${chat.agentes.map(a => `
              <div class="chat-box">
                <div><strong>Usuário:</strong> ${a.nome}</div>
                <div><strong>Email:</strong> ${a.usuario}</div>
                <div><strong>Departamentos:</strong> ${(a.departamentos || []).join(", ")}</div>
              </div>
            `).join("")}
          `
            : ""
        }
      </div>
    `;
  }
});

/* ===== VOLTAR ===== */
window.voltar = () => {
  window.location.href = "index.html";
};
