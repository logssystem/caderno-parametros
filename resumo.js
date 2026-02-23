/* ======================================================
   RESUMO – CHAT / OMNICHANNEL (ISOLADO / SEGURO)
   ====================================================== */
window.renderResumoChat = function (container, data) {
  if (!container || !data?.chat) return;

  const chat = data.chat;

  // ===== NORMALIZAÇÃO SEGURA (AJUSTE CRÍTICO) =====
  const usuarios =
    Array.isArray(chat.usuarios) && chat.usuarios.length
      ? chat.usuarios
      : [];

  const agentes =
    Array.isArray(chat.agentes) && chat.agentes.length
      ? chat.agentes
      : [];

  const departamentos =
    Array.isArray(chat.departamentos) && chat.departamentos.length
      ? chat.departamentos
      : [];

  const canais = Array.isArray(chat.canais) ? chat.canais : [];

  if (
    !chat.tipo &&
    !usuarios.length &&
    !agentes.length &&
    !departamentos.length
  ) {
    return;
  }

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
          ? `<div style="margin-top:8px">
              <strong>Canais:</strong>
              <div class="lista">
                ${canais.map(c => `<span class="chip">${c}</span>`).join("")}
              </div>
            </div>`
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
            <div class="titulo">${u.nome || "-"}</div>
            <div>📧 ${u.email || "-"}</div>
            <div>🔑 ${u.permissao || "-"}</div>
          </div>
        `).join("")}
      </div>
    `;
  }

  if (departamentos.length) {
    html += `
      <h3>🏷️ Departamentos</h3>
      <div class="resumo-grid">
        ${departamentos.map(d => `
          <div class="resumo-card">
            <div class="titulo">${d.nome || "-"}</div>
            ${
              d.agentes?.length
                ? `<div class="lista">
                    ${d.agentes.map(a => `<span class="chip">${a}</span>`).join("")}
                   </div>`
                : `<em>Sem agentes vinculados</em>`
            }
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
            <div class="titulo">${a.nome || "-"}</div>
            ${
              a.departamentos?.length
                ? `<div class="lista">
                    ${a.departamentos.map(d => `<span class="chip">${d}</span>`).join("")}
                   </div>`
                : `<em>Sem departamentos</em>`
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
   RESUMO – PRINCIPAL (PABX INTACTO)
   ====================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const temaSalvo = localStorage.getItem("tema");
  document.body.classList.toggle("dark", temaSalvo === "dark");

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

  function identificarDestino(nome, voz) {
    if (!nome) return "Não definido";
    if (voz.regras_tempo?.some(r => r.nome === nome)) return `⏰ Regra de Tempo — ${nome}`;
    if (voz.filas?.some(f => f.nome === nome)) return `📞 Fila — ${nome}`;
    if (voz.uras?.some(u => u.nome === nome)) return `🎙️ URA — ${nome}`;
    if (voz.grupo_ring?.some(g => g.nome === nome)) return `🔔 Grupo de Ring — ${nome}`;
    if (voz.ramais?.some(r => String(r.ramal) === String(nome))) return `☎️ Ramal — ${nome}`;
    return nome;
  }

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

  if (!dados.voz) return;
  const voz = dados.voz;

  const mapaRamalUsuario = {};
  (voz.agentes || []).forEach(a => {
    if (a.ramal && a.nome) mapaRamalUsuario[a.ramal] = a.nome;
  });

  /* ===== USUÁRIOS ===== */
  if (voz.usuarios?.length) {
    resumo.innerHTML += `
      <section class="resumo-bloco">
        <h2>👤 Usuários Web</h2>
        <div class="resumo-grid">
          ${voz.usuarios.map(u => `
            <div class="resumo-card">
              <div class="titulo">${u.nome}</div>
              <div>📧 ${u.email}</div>
              <div>🔐 ${u.senha}</div>
              <div>${u.permissao} ${u.agente ? `<span class="badge">Agente</span>` : ""}</div>
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
              <div class="titulo">${a.nome}</div>
              <div>📞 Ramal: ${a.ramal || "Não vinculado"}</div>
              ${a.multiskill ? `<span class="badge">Multiskill</span>` : ""}
            </div>
          `).join("")}
        </div>
      </section>
    `;
  }

  /* ===== CHAT (FINAL) ===== */
  window.renderResumoChat(resumo, dados);
});

/* ================= VOLTAR ================= */
window.voltar = function () {
  window.location.href = "index.html";
};
