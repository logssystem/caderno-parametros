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
    <section class="resumo-bloco">
      <h2>👤 Usuários Web</h2>
      <div class="resumo-grid">
        ${dados.voz.usuarios.map(u => `
          <div class="resumo-card">
            <strong>${u.nome}</strong>
            <div class="linha">📧 ${u.email}</div>
            <div class="linha">🔐 ${u.senha}</div>
            <div class="linha">
              ${u.permissao}
              ${u.agente ? `<span class="badge">Agente</span>` : ""}
            </div>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

    // Ramais
    if (dados.voz.ramais?.length) {
  resumo.innerHTML += `
    <section class="resumo-bloco">
      <h2>📞 Ramais</h2>
      <div class="resumo-grid">
        ${dados.voz.ramais.map(r => `
          <div class="resumo-card">
            <strong>Ramal ${r.ramal}</strong>
            <div class="linha">🔐 ${r.senha}</div>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

    // Agentes
   if (dados.voz.agentes?.length) {
  resumo.innerHTML += `
    <section class="resumo-bloco">
      <h2>🎧 Agentes</h2>
      <div class="resumo-grid">
        ${dados.voz.agentes.map(a => `
          <div class="resumo-card">
            <strong>
              ${a.nome}
              ${a.multiskill ? `<span class="badge">Multiskill</span>` : ""}
            </strong>
            <div class="linha">📞 Ramal ${a.ramal}</div>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}
    
    // Filas
   if (dados.voz.filas?.length) {
  resumo.innerHTML += `
    <section class="resumo-bloco">
      <h2>👥 Filas</h2>
      <div class="resumo-grid">
        ${dados.voz.filas.map(f => `
          <div class="resumo-card">
            <strong>${f.nome}</strong>
            <div class="linha">
              Agentes:
              <br>${f.agentes.join(", ")}
            </div>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}
  
   if (dados.voz.grupo_ring?.length) {
  resumo.innerHTML += `
    <section class="resumo-bloco">
      <h2>🔔 Grupo de Ring</h2>
      <div class="resumo-grid">
        ${dados.voz.grupo_ring.map(g => `
          <div class="resumo-card">
            <strong>${g.nome}</strong>
            <div class="linha">Estratégia: ${g.estrategia}</div>
            <div class="linha">Ramais: ${g.ramais.join(", ")}</div>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}
    
    // URAs
    if (dados.voz.uras?.length) {
  resumo.innerHTML += `
    <section class="resumo-bloco">
      <h2>☎️ URAs</h2>
      <div class="resumo-grid">
        ${dados.voz.uras.map(u => `
          <div class="resumo-card">
            <strong>${u.nome}</strong>
            ${u.opcoes.map(o => `
              <div class="linha">Tecla ${o.tecla} → ${o.destino}</div>
            `).join("")}
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

  
  if (dados.voz.pausas?.itens?.length) {
  resumo.innerHTML += `
    <section class="resumo-section">
      <h2>⏸️ Pausas do Call Center</h2>
      <div class="resumo-list">
        ${dados.voz.pausas.itens.map(p => `
          <div class="resumo-item">
            ${p.nome} — ${p.tempo}
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

  if (dados.voz.pesquisaSatisfacao?.ativa) {
  const p = dados.voz.pesquisaSatisfacao;

  resumo.innerHTML += `
    <section class="resumo-section">
      <h2>⭐ Pesquisa de Satisfação</h2>
      <div class="resumo-item">
        <strong>${p.pergunta}</strong>
        <div class="resumo-sub">
          ${p.respostas.map(r => `${r.nota} — ${r.descricao}`).join("<br>")}
        </div>
      </div>
    </section>
  `;
}

  if (dados.voz.uras?.length) {
  resumo.innerHTML += `
    <section class="resumo-section">
      <h2>☎️ URAs</h2>
      <div class="resumo-list">
        ${dados.voz.uras.map(u => `
          <div class="resumo-item">
            <strong>${u.nome}</strong>
            <div class="resumo-sub">
              ${u.opcoes.map(o => `
                <div>Tecla ${o.tecla} → ${o.destino}</div>
              `).join("")}
            </div>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

  if (dados.voz.agentes?.length) {
  resumo.innerHTML += `
    <section class="resumo-section">
      <h2>🎧 Agentes</h2>
      <div class="resumo-list">
        ${dados.voz.agentes.map(a => `
          <div class="resumo-item">
            <strong>${a.nome}
              ${a.multiskill ? `<span class="badge">Multiskill</span>` : ""}
            </strong>
            <div class="resumo-sub">Ramal: ${a.ramal}</div>
          </div>
        `).join("")}
      </div>
    </section>
  `;
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
