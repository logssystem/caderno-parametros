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

  /* =====================================================
     🏢 CLIENTE
  ====================================================== */
  if (dados.cliente) {
    resumo.innerHTML += `
      <section class="resumo-bloco">
        <h2>🏢 Dados do Cliente</h2>
        <div class="resumo-card">
          <div class="info-linha"><span>Empresa:</span> ${dados.cliente.empresa}</div>
          <div class="info-linha"><span>Domínio:</span> ${dados.cliente.dominio}</div>
          <div class="info-linha"><span>CNPJ:</span> ${dados.cliente.cnpj}</div>
        </div>
      </section>
    `;
  }

  /* =====================================================
     🎧 VOZ
  ====================================================== */
  if (!dados.voz) {
    resumo.innerHTML += `
      <section class="resumo-bloco">
        <h2>⚠️ Voz</h2>
        <div class="resumo-card">
          Nenhuma configuração de voz foi preenchida.
        </div>
      </section>
    `;
  } else {

    /* ================= USUÁRIOS WEB ================= */
    if (dados.voz.usuarios?.length) {
      resumo.innerHTML += `
        <section class="resumo-bloco">
          <h2>👤 Usuários Web</h2>
          <div class="resumo-grid">
            ${dados.voz.usuarios.map(u => `
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

    /* ================= RAMAIS ================= */
    if (dados.voz.ramais?.length) {
    resumo.innerHTML += `
      <section class="resumo-bloco">
        <h2>📞 Ramais</h2>
        <div class="resumo-grid">
          ${dados.voz.ramais.map(r => {
            const usuario = dados.voz.usuarios?.find(u => u.ramal === r.ramal);
            return `
              <div class="resumo-card">
                <div class="titulo">Ramal ${r.ramal}</div>
                <div class="info-linha">🔐 Senha: ${r.senha}</div>
                <div class="info-linha">👤 Usuário: ${usuario ? usuario.nome : "—"}</div>
              </div>
            `;
          }).join("")}
        </div>
      </section>
    `;
  }

    /* ================= AGENTES ================= */
    if (dados.voz.agentes?.length) {
    resumo.innerHTML += `
      <section class="resumo-bloco">
        <h2>🎧 Agentes</h2>
        <div class="resumo-grid">
          ${dados.voz.agentes.map(a => `
            <div class="resumo-card">
              <div class="titulo">
                ${a.nome}
                ${a.multiskill ? `<span class="badge">Multiskill</span>` : ""}
              </div>
              <div class="info-linha">📞 Ramal: <strong>${a.ramal}</strong></div>
            </div>
          `).join("")}
        </div>
      </section>
    `;
  }

    /* ================= FILAS ================= */
    if (dados.voz.filas?.length) {
      resumo.innerHTML += `
        <section class="resumo-bloco">
          <h2>👥 Filas</h2>
          <div class="resumo-grid">
            ${dados.voz.filas.map(f => `
              <div class="resumo-card">
                <div class="titulo">${f.nome}</div>
                <div class="lista">
                  ${f.agentes.map(a => `<span class="chip">${a}</span>`).join("")}
                </div>
              </div>
            `).join("")}
          </div>
        </section>
      `;
    }

    /* ================= GRUPO DE RING ================= */
    if (dados.voz.grupo_ring?.length) {
      resumo.innerHTML += `
        <section class="resumo-bloco">
          <h2>🔔 Grupo de Ring</h2>
          <div class="resumo-grid">
            ${dados.voz.grupo_ring.map(g => `
              <div class="resumo-card">
                <div class="titulo">${g.nome}</div>
                <div class="info-linha">Estratégia: ${g.estrategia}</div>
                <div class="lista">
                  ${g.ramais.map(r => `<span class="chip">${r}</span>`).join("")}
                </div>
              </div>
            `).join("")}
          </div>
        </section>
      `;
    }

    /* ================= URAS ================= */
    if (dados.voz.uras?.length) {
    resumo.innerHTML += `
      <section class="resumo-bloco">
        <h2>☎️ URAs</h2>
        <div class="resumo-grid">
          ${dados.voz.uras.map(u => `
            <div class="resumo-card">
              <div class="titulo">${u.nome}</div>
  
              <div class="info-linha"><strong>📢 Mensagem da URA</strong></div>
              <div class="info-linha destaque">${u.mensagem}</div>
  
              <div class="info-linha"><strong>🎯 Opções</strong></div>
              ${u.opcoes.map(o => `
                <div class="info-linha">
                  Tecla <strong>${o.tecla}</strong> →
                  <span class="badge">${o.tipo}</span>
                  ${o.destino}
                </div>
              `).join("")}
            </div>
          `).join("")}
        </div>
      </section>
    `;
  }

    if (dados.voz.regras_tempo?.length) {
  resumo.innerHTML += `
    <section class="resumo-bloco">
      <h2>⏰ Regras de Tempo</h2>
      <div class="resumo-grid">
        ${dados.voz.regras_tempo.map(r => `
          <div class="resumo-card">
            <div class="titulo">${r.nome}</div>
            <div class="info-linha">📅 Dias: ${r.dias.join(", ")}</div>
            <div class="info-linha">⏱ Horário: ${r.inicio} → ${r.fim}</div>
            <div class="info-linha">Destino: ${r.destino}</div>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

    if (dados.voz.pausas?.itens?.length) {
    resumo.innerHTML += `
      <section class="resumo-bloco">
        <h2>⏸️ Pausas do Call Center</h2>
        <div class="resumo-card">
          <div class="titulo">Grupo: ${dados.voz.pausas.grupo}</div>
          ${dados.voz.pausas.itens.map(p => `
            <div class="info-linha">
              <strong>${p.nome}</strong> — Tempo: ${p.tempo}
            </div>
          `).join("")}
        </div>
      </section>
    `;
  }

    if (dados.voz.pesquisaSatisfacao?.ativa) {
    const p = dados.voz.pesquisaSatisfacao;
    resumo.innerHTML += `
      <section class="resumo-bloco">
        <h2>⭐ Pesquisa de Satisfação</h2>
        <div class="resumo-card">
          <div class="info-linha"><strong>Nome:</strong> ${p.nome}</div>
          <div class="info-linha"><strong>Introdução:</strong> ${p.introducao}</div>
          <div class="info-linha"><strong>Pergunta:</strong> ${p.pergunta}</div>
          <div class="info-linha"><strong>Respostas:</strong></div>
          ${p.respostas.map(r => `
            <div class="info-linha">Nota ${r.nota} — ${r.descricao}</div>
          `).join("")}
        </div>
      </section>
    `;
  }

    
  /* =====================================================
     💬 CHAT
  ====================================================== */
  if (dados.chat) {
    resumo.innerHTML += `
      <section class="resumo-bloco">
        <h2>💬 Atendimento por Chat</h2>
        <div class="resumo-card">
          <div class="info-linha">Tipo: ${dados.chat.tipo}</div>
          <div class="info-linha">API: ${dados.chat.api}</div>
          <div class="info-linha">Conta: ${dados.chat.conta}</div>
          <div class="info-linha">Canais: ${(dados.chat.canais || []).join(", ")}</div>
        </div>
      </section>
    `;
  }
});

/* ===== VOLTAR ===== */
window.voltar = () => {
  window.location.href = "index.html";
};
