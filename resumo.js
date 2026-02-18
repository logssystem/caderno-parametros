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
      <section class="resumo-bloco">
        <h2>🏢 Dados do Cliente</h2>
        <div class="resumo-card">
          <div><strong>Empresa:</strong> ${dados.cliente.empresa}</div>
          <div><strong>Domínio:</strong> ${dados.cliente.dominio}</div>
          <div><strong>CNPJ:</strong> ${dados.cliente.cnpj}</div>
        </div>
      </section>
    `;
  }

  const voz = dados.voz || {};

  /* ===== USUÁRIOS WEB ===== */
  if (voz.usuarios?.length) {
    resumo.innerHTML += `
      <section class="resumo-bloco">
        <h2>👤 Usuários Web</h2>
        <div class="resumo-grid">
          ${voz.usuarios.map(u => `
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

  /* ===== RAMAIS ===== */
  if (voz.ramais?.length) {
    resumo.innerHTML += `
      <section class="resumo-bloco">
        <h2>📞 Ramais</h2>
        <div class="resumo-grid">
          ${voz.ramais.map(r => `
            <div class="resumo-card">
              <strong>Ramal ${r.ramal}</strong>
              <div class="linha">🔐 ${r.senha}</div>
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

  /* ===== FILAS ===== */
  if (voz.filas?.length) {
    resumo.innerHTML += `
      <section class="resumo-bloco">
        <h2>👥 Filas</h2>
        <div class="resumo-grid">
          ${voz.filas.map(f => `
            <div class="resumo-card">
              <strong>${f.nome}</strong>
              <div class="linha">
                <strong>Agentes:</strong><br>
                ${f.agentes.join(", ")}
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
              <strong>${g.nome}</strong>
              <div class="linha"><strong>Estratégia:</strong> ${g.estrategia}</div>
              <div class="linha"><strong>Ramais:</strong> ${g.ramais.join(", ")}</div>
            </div>
          `).join("")}
        </div>
      </section>
    `;
  }

  /* ===== URAS ===== */
  if (voz.uras?.length) {
    resumo.innerHTML += `
      <section class="resumo-bloco">
        <h2>☎️ URAs</h2>
        <div class="resumo-grid">
          ${voz.uras.map(u => `
            <div class="resumo-card">
              <strong>${u.nome}</strong>
              ${u.mensagem ? `<div class="linha"><strong>Mensagem:</strong> ${u.mensagem}</div>` : ""}
              <div class="linha">
                <strong>Opções:</strong><br>
                ${u.opcoes.map(o =>
                  `• Tecla ${o.tecla} — ${o.descricao || "Sem descrição"} → ${o.destino}`
                ).join("<br>")}
              </div>
            </div>
          `).join("")}
        </div>
      </section>
    `;
  }

  /* ===== PAUSAS ===== */
  if (voz.pausas?.itens?.length) {
    resumo.innerHTML += `
      <section class="resumo-bloco">
        <h2>⏸️ Pausas do Call Center</h2>
        <div class="resumo-card">
          <div class="linha"><strong>Grupo:</strong> ${voz.pausas.grupo}</div>
          <div class="linha">
            <strong>Pausas:</strong><br>
            ${voz.pausas.itens.map(p => `• ${p.nome} — ${p.tempo}`).join("<br>")}
          </div>
        </div>
      </section>
    `;
  }

  /* ===== PESQUISA DE SATISFAÇÃO ===== */
  if (voz.pesquisaSatisfacao?.ativa) {
    const p = voz.pesquisaSatisfacao;
    resumo.innerHTML += `
      <section class="resumo-bloco">
        <h2>⭐ Pesquisa de Satisfação</h2>
        <div class="resumo-card">
          <div class="linha"><strong>Nome:</strong> ${p.nome}</div>
          ${p.introducao ? `<div class="linha"><strong>Mensagem inicial:</strong> ${p.introducao}</div>` : ""}
          <div class="linha"><strong>Pergunta:</strong> ${p.pergunta}</div>
          <div class="linha">
            <strong>Respostas:</strong><br>
            ${p.respostas.map(r => `• ${r.nota} — ${r.descricao}`).join("<br>")}
          </div>
          ${p.encerramento ? `<div class="linha"><strong>Mensagem final:</strong> ${p.encerramento}</div>` : ""}
        </div>
      </section>
    `;
  }

  /* ===== CHAT ===== */
  if (dados.chat) {
    const chat = dados.chat;
    resumo.innerHTML += `
      <section class="resumo-bloco">
        <h2>💬 Atendimento por Chat</h2>
        <div class="resumo-card">
          <div><strong>Tipo:</strong> ${chat.tipo}</div>
          <div><strong>API:</strong> ${chat.api}</div>
          <div><strong>Conta:</strong> ${chat.conta}</div>
          <div><strong>Canais:</strong> ${(chat.canais || []).join(", ")}</div>
        </div>
      </section>
    `;
  }
});

/* ===== VOLTAR ===== */
window.voltar = () => {
  window.location.href = "index.html";
};
