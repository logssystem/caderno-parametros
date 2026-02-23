/* ======================================================
   RESUMO – CHAT / OMNICHANNEL (ISOLADO / SEGURO)
   ====================================================== */
window.renderResumoChat = function (container, data) {
  if (!data || !data.chat || !data.chat.tipo) return;

  const {
    tipo,
    api,
    conta,
    canais = [],
    usuarios = [],
    agentes = [],
    departamentos = []
  } = data.chat;

  const section = document.createElement("section");
  section.className = "resumo-bloco";

  section.innerHTML = `
    <h2>💬 Chat / Omnichannel</h2>

    <div class="resumo-card">
      <div><strong>Tipo:</strong> ${tipo}</div>
      ${api ? `<div><strong>API:</strong> ${api}</div>` : ""}
      ${conta ? `<div><strong>Conta:</strong> ${conta}</div>` : ""}

      ${
        canais.length
          ? `<div class="lista">
              ${canais.map(c => `<span class="chip">${c}</span>`).join("")}
            </div>`
          : ""
      }

      ${
        usuarios.length
          ? `<div class="info-linha">
              <strong>Usuários Chat:</strong>
              <ul>
                ${usuarios.map(u => `<li>${u.nome} (${u.email})</li>`).join("")}
              </ul>
            </div>`
          : ""
      }

      ${
        agentes.length
          ? `<div class="info-linha">
              <strong>Agentes Chat:</strong>
              <ul>
                ${agentes.map(a => `<li>${a.nome}</li>`).join("")}
              </ul>
            </div>`
          : ""
      }

      ${
        departamentos.length
          ? `<div class="info-linha">
              <strong>Departamentos:</strong>
              ${departamentos.map(d => `
                <div style="margin-top:6px">
                  <strong>${d.nome}</strong>
                  <div class="lista">
                    ${(d.agentes || []).map(a => `<span class="chip">${a}</span>`).join("")}
                  </div>
                </div>
              `).join("")}
            </div>`
          : ""
      }
    </div>
  `;

  container.appendChild(section);
};

/* ======================================================
   RESUMO – PRINCIPAL (PABX INTACTO)
   ====================================================== */
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

  /* ================= FUNÇÃO AUXILIAR ================= */
  function identificarDestino(nome, voz) {
    if (!nome) return "Não definido";
    if (voz.regras_tempo?.some(r => r.nome === nome)) return `⏰ Regra de Tempo — ${nome}`;
    if (voz.filas?.some(f => f.nome === nome)) return `📞 Fila — ${nome}`;
    if (voz.uras?.some(u => u.nome === nome)) return `🎙️ URA — ${nome}`;
    if (voz.grupo_ring?.some(g => g.nome === nome)) return `🔔 Grupo de Ring — ${nome}`;
    if (voz.ramais?.some(r => String(r.ramal) === String(nome))) return `☎️ Ramal — ${nome}`;
    return nome;
  }

  /* ================= CLIENTE ================= */
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

  /* ================= VOZ / PABX ================= */
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

  /* ===== FILAS ===== */
  if (voz.filas?.length) {
    resumo.innerHTML += `
      <section class="resumo-bloco">
        <h2>👥 Filas</h2>
        <div class="resumo-grid">
          ${voz.filas.map(f => `
            <div class="resumo-card">
              <div class="titulo">${f.nome}</div>
              <div class="lista">
                ${(f.agentes || []).map(a => `<span class="chip">${a}</span>`).join("")}
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
              <div class="titulo">${r.ramal}</div>
              <div>🔐 ${r.senha}</div>
              <div>👤 ${mapaRamalUsuario[r.ramal] || "Não vinculado"}</div>
            </div>
          `).join("")}
        </div>
      </section>
    `;
  }

  /* ===== NÚMEROS ===== */
  if (voz.entradas?.length) {
    resumo.innerHTML += `
      <section class="resumo-bloco">
        <h2>📲 Números</h2>
        <div class="resumo-grid">
          ${voz.entradas.map(n => `
            <div class="resumo-card">
              <div class="titulo">${n.numero}</div>
              <div>${identificarDestino(n.destino, voz)}</div>
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
        <h2>🎙️ URAs</h2>
        <div class="resumo-grid">
          ${voz.uras.map(u => `
            <div class="resumo-card">
              <div class="titulo">${u.nome}</div>
              <div><em>${u.mensagem}</em></div>
              <div class="lista">
                ${(u.opcoes || []).map(o =>
                  `<span class="chip">Tecla ${o.tecla} → ${identificarDestino(o.destino, voz)}</span>`
                ).join("")}
              </div>
            </div>
          `).join("")}
        </div>
      </section>
    `;
  }

  /* ================= CHAT – SEM MEXER NO PABX ================= */
  window.renderResumoChat(resumo, dados);
});

/* ================= VOLTAR ================= */
window.voltar = function () {
  window.location.href = "index.html";
};
