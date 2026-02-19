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
  // mantém o resto do código normalmente
}

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
            ${dados.voz.ramais.map(r => `
              <div class="resumo-card">
                <div class="titulo">Ramal ${r.ramal}</div>
                <div class="info-linha">🔐 ${r.senha}</div>
              </div>
            `).join("")}
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
                <div class="info-linha">📞 Ramal ${a.ramal}</div>
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
                <div class="info-linha">Agentes</div>
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
                <div class="info-linha">Estratégia: <span>${g.estrategia}</span></div>
                <div class="info-linha">Ramais</div>
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
                <div class="info-linha">Mensagem</div>
                <div class="info-linha"><span>${u.mensagem}</span></div>
                <div class="info-linha">Opções</div>
                ${u.opcoes.map(o =>
                  `<div class="info-linha">Tecla ${o.tecla} → ${o.destino}</div>`
                ).join("")}
              </div>
            `).join("")}
          </div>
        </section>
      `;
    }

    /* ================= PAUSAS ================= */
    if (dados.voz.pausas?.itens?.length) {
      resumo.innerHTML += `
        <section class="resumo-bloco">
          <h2>⏸️ Pausas do Call Center</h2>
          <div class="resumo-card">
            <div class="titulo">${dados.voz.pausas.grupo}</div>
            ${dados.voz.pausas.itens.map(p =>
              `<div class="info-linha">${p.nome} — <span>${p.tempo}</span></div>`
            ).join("")}
          </div>
        </section>
      `;
    }

    /* ================= PESQUISA ================= */
    if (dados.voz.pesquisaSatisfacao?.ativa) {
      const p = dados.voz.pesquisaSatisfacao;
      resumo.innerHTML += `
        <section class="resumo-bloco">
          <h2>⭐ Pesquisa de Satisfação</h2>
          <div class="resumo-card">
            <div class="titulo">${p.nome}</div>
            <div class="info-linha"><span>${p.introducao}</span></div>
            <div class="info-linha"><span>${p.pergunta}</span></div>
            ${p.respostas.map(r =>
              `<div class="info-linha">${r.nota} — ${r.descricao}</div>`
            ).join("")}
          </div>
        </section>
      `;
    }

  } // 👈 FECHA O else { DO if (!dados.voz)

  /* =====================================================
     💬 CHAT
  ====================================================== */
  if (dados.chat) {
    const chat = dados.chat;
    resumo.innerHTML += `
      <section class="resumo-bloco">
        <h2>💬 Atendimento por Chat</h2>
        <div class="resumo-card">
          <div class="info-linha">Tipo: <span>${chat.tipo}</span></div>
          <div class="info-linha">API: <span>${chat.api}</span></div>
          <div class="info-linha">Conta: <span>${chat.conta}</span></div>
          <div class="info-linha">Canais: <span>${chat.canais.join(", ")}</span></div>
        </div>
      </section>
    `;
  }

}); // 👈 FECHA DOMContentLoaded

/* ===== VOLTAR ===== */
window.voltar = () => {
  window.location.href = "index.html";
};
