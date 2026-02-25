/* ======================================================
   RESUMO – CHAT (ISOLADO)
   ====================================================== */
window.renderResumoChat = function (container, data) {
  if (!container || !data?.chat) return;

  const chat = data.chat;
  const usuarios = chat.usuarios || [];
  const agentes = chat.agentes || [];
  const departamentos = chat.departamentos || [];
  const canais = chat.canais || [];

  if (!chat.tipo && !usuarios.length && !agentes.length) return;

  const section = document.createElement("section");
  section.className = "resumo-bloco";

  let html = `
    <h2>💬 Chat / Omnichannel</h2>
    <div class="resumo-card">
      <div><strong>Tipo:</strong> ${chat.tipo || "-"}</div>
      <div><strong>API:</strong> ${chat.api || "-"}</div>
      <div><strong>Conta:</strong> ${chat.conta || "-"}</div>
      ${
        canais.length
          ? `<div class="lista">${canais.map(c => `<span class="chip">${c}</span>`).join("")}</div>`
          : ""
      }
    </div>
  `;

  if (usuarios.length) {
    html += `
      <h3>👤 Usuários do Chat</h3>
      <div class="resumo-grid">
        ${usuarios.map(u => `
          <div class="resumo-card">
            <div class="titulo">${u.nome}</div>
            <div>${u.email}</div>
            <div>${u.permissao}</div>
          </div>
        `).join("")}
      </div>
    `;
  }

  if (agentes.length) {
    html += `
      <h3>🎧 Agentes do Chat</h3>
      <div class="resumo-grid">
        ${agentes.map(a => `
          <div class="resumo-card">
            <div class="titulo">${a.nome}</div>
            ${
              a.departamentos?.length
                ? `<div class="lista">${a.departamentos.map(d => `<span class="chip">${d}</span>`).join("")}</div>`
                : ""
            }
          </div>
        `).join("")}
      </div>
    `;
  }

  section.innerHTML = html;
  container.appendChild(section);
};

/* ======================================================
   RESUMO – PRINCIPAL (VOZ + CHAT)
   ====================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const resumo = document.getElementById("resumo");
  if (!resumo) return;

  const raw = localStorage.getItem("CONFIG_CADERNO");
  if (!raw) return;

  const dados = JSON.parse(raw);
  resumo.innerHTML = "";

  /* ================= FUNÇÃO CHAVE ================= */
  function identificarDestino(nome) {
    if (!nome) return "-";
    if (dados.voz?.regras_tempo?.some(r => r.nome === nome)) return `⏰ Regra de Tempo — ${nome}`;
    if (dados.voz?.filas?.some(f => f.nome === nome)) return `📞 Fila — ${nome}`;
    if (dados.voz?.grupo_ring?.some(g => g.nome === nome)) return `🔔 Grupo de Ring — ${nome}`;
    if (dados.voz?.uras?.some(u => u.nome === nome)) return `🎙️ URA — ${nome}`;
    if (dados.voz?.ramais?.some(r => String(r.ramal) === String(nome))) return `☎️ Ramal — ${nome}`;
    return nome;
  }

  /* ================= CLIENTE ================= */
  if (dados.cliente) {
    resumo.innerHTML += `
      <section class="resumo-bloco">
        <h2>🏢 Cliente</h2>
        <div class="resumo-card">
          <div>${dados.cliente.empresa}</div>
          <div>${dados.cliente.dominio}</div>
          <div>${dados.cliente.cnpj}</div>
        </div>
      </section>
    `;
  }

  const voz = dados.voz;
  if (!voz) return;

  /* ================= NÚMEROS / ENTRADAS ================= */
  if (voz.entradas?.length) {
    resumo.innerHTML += `
      <section class="resumo-bloco">
        <h2>📞 Números / Entradas</h2>
        <div class="resumo-grid">
          ${voz.entradas.map(e => `
            <div class="resumo-card">
              <div class="titulo">${e.numero}</div>
              <div>${identificarDestino(e.destino)}</div>
            </div>
          `).join("")}
        </div>
      </section>
    `;
  }

  /* ================= AGENTES ================= */
  if (voz.agentes?.length) {
    resumo.innerHTML += `
      <section class="resumo-bloco">
        <h2>🎧 Agentes</h2>
        <div class="resumo-grid">
          ${voz.agentes.map(a => `
            <div class="resumo-card">
              <div class="titulo">${a.nome}</div>
              <div>📞 Ramal: ${a.ramal || "-"}</div>
              ${a.multiskill ? `<span class="badge">Multiskill</span>` : ""}
              ${a.regra_tempo ? `<div>⏰ ${a.regra_tempo}</div>` : ""}
            </div>
          `).join("")}
        </div>
      </section>
    `;
  }

  /* ================= PAUSAS ================= */
  if (voz.pausas?.length) {
    resumo.innerHTML += `
      <section class="resumo-bloco">
        <h2>⏸️ Pausas</h2>
        <div class="resumo-grid">
          ${voz.pausas.map(p => `
            <div class="resumo-card">
              <div class="titulo">${p.grupo}</div>
              <div class="lista">
                ${p.itens.map(i => `<span class="chip">${i}</span>`).join("")}
              </div>
            </div>
          `).join("")}
        </div>
      </section>
    `;
  }

  /* ================= REGRAS DE TEMPO ================= */
  if (voz.regras_tempo?.length) {
    resumo.innerHTML += `
      <section class="resumo-bloco">
        <h2>⏰ Regras de Tempo</h2>
        <div class="resumo-grid">
          ${voz.regras_tempo.map(r => `
            <div class="resumo-card">
              <div class="titulo">${r.nome}</div>
              <div>${r.descricao || ""}</div>
            </div>
          `).join("")}
        </div>
      </section>
    `;
  }

  /* ================= URA ================= */
  if (voz.uras?.length) {
    resumo.innerHTML += `
      <section class="resumo-bloco">
        <h2>🎙️ URA</h2>
        <div class="resumo-grid">
          ${voz.uras.map(u => `
            <div class="resumo-card">
              <div class="titulo">${u.nome}</div>
              <div>${u.mensagem}</div>
              <ul>
                ${u.opcoes.map(o =>
                  `<li>Tecla ${o.tecla} → ${identificarDestino(o.destino)}</li>`
                ).join("")}
              </ul>
            </div>
          `).join("")}
        </div>
      </section>
    `;
  }

  /* ================= PESQUISA DE SATISFAÇÃO ================= */
  if (voz.pesquisas?.length) {
    resumo.innerHTML += `
      <section class="resumo-bloco">
        <h2>⭐ Pesquisa de Satisfação</h2>
        <div class="resumo-grid">
          ${voz.pesquisas.map(p => `
            <div class="resumo-card">
              <div class="titulo">${p.nome}</div>
              <div>${p.introducao}</div>
              <div>${p.pergunta}</div>
              <ul>
                ${p.respostas.map(r => `<li>${r}</li>`).join("")}
              </ul>
            </div>
          `).join("")}
        </div>
      </section>
    `;
  }

  /* ================= CHAT ================= */
  window.renderResumoChat(resumo, dados);
});

/* ================= VOLTAR ================= */
window.voltar = function () {
  window.location.href = "index.html";
};
