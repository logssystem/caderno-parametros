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

    /* ===== MAPA RAMAL → USUÁRIO (VEM DOS AGENTES) ===== */
    const mapaRamalUsuario = {};
    (voz.agentes || []).forEach(a => {
      if (a.ramal && a.nome) {
        mapaRamalUsuario[a.ramal] = a.nome;
      }
    });

    /* ===== USUÁRIOS WEB ===== */
    if (voz.usuarios?.length) {
      resumo.innerHTML += `
        <section class="resumo-bloco">
          <h2>👤 Usuários Web</h2>
          <div class="resumo-grid">
            ${voz.usuarios.map(u => `
              <div class="resumo-card">
                <div class="titulo">Usuário: ${u.nome}</div>
                <div class="info-linha">Email: 📧 ${u.email}</div>
                <div class="info-linha">Senha: 🔐 ${u.senha}</div>
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
  
  /* ===== AGENTES ===== */
  if (voz.agentes?.length) {
    resumo.innerHTML += `
      <section class="resumo-bloco">
        <h2>🎧 Agentes</h2>
        <div class="resumo-grid">
          ${voz.agentes.map(a => `
            <div class="resumo-card">
              <div class="titulo">Nome Do Agente: ${a.nome}</div>
              <div class="info-linha">📞 Ramal: ${a.ramal || "Não vinculado"}</div>
              ${
                a.multiskill
                  ? `<span class="badge">Multiskill</span>`
                  : ""
              }
            </div>
          `).join("")}
        </div>
      </section>
    `;
  }

  /* ===== FILAS ===== */
  if (voz.filas?.length) {
    resumo.innerHTML += `
      <section class="resumo-bloco">
        <h2>👥 Filas</h2>
        <div class="resumo-grid">
          ${voz.filas.map(f => `
            <div class="resumo-card">
              <div class="titulo">Nome Da Fila: ${f.nome}</div>
              <div class="lista">
                ${(f.agentes || []).map(a =>
                  `<span class="chip">${a}</span>`
                ).join("")}
              </div>
            </div>
          `).join("")}
        </div>
      </section>
    `;
  }
  
  /* ===== GRUPO DE RING ===== */
  if (voz.grupo_ring?.length) {
    resumo.innerHTML += `
      <section class="resumo-bloco">
        <h2>🔔 Grupo de Ring</h2>
        <div class="resumo-grid">
          ${voz.grupo_ring.map(g => `
            <div class="resumo-card">
              <div class="titulo">Nome: ${g.nome}</div>
              <div class="info-linha">
                Estratégia: <strong>${g.estrategia}</strong>
              </div>
              <div class="lista">
                ${(g.ramais || []).map(r =>
                  `<span class="chip">${r}</span>`
                ).join("")}
              </div>
            </div>
          `).join("")}
        </div>
      </section>
    `;
  }
  
    /* ===== RAMAIS ===== */
    if (voz.ramais?.length) {
      resumo.innerHTML += `
        <section class="resumo-bloco">
          <h2>📞 Ramais</h2>
          <div class="resumo-grid">
            ${voz.ramais.map(r => `
              <div class="resumo-card">
                <div class="titulo">Ramal: ${r.ramal}</div>
                <div class="info-linha">🔐 ${r.senha}</div>
                <div class="info-linha">
                  👤 Usuário:
                  <span>${mapaRamalUsuario[r.ramal] || "Não vinculado"}</span>
                </div>
              </div>
            `).join("")}
          </div>
        </section>
      `;
    }
  } // ← FECHA VOZ CORRETAMENTE

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
