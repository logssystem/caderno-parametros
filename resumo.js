/* ======================================================
   RESUMO – CHAT / OMNICHANNEL (ISOLADO / SEGURO)
   ====================================================== */
window.renderResumoChat = function (container, data) {
  if (!container || !data?.chat) return;

  const chat = data.chat;

  const usuarios = Array.isArray(chat.usuarios) ? chat.usuarios : [];
  const agentes = Array.isArray(chat.agentes) ? chat.agentes : [];
  const departamentos = Array.isArray(chat.departamentos) ? chat.departamentos : [];
  const canais = Array.isArray(chat.canais) ? chat.canais : [];

  if (
    !chat.tipo &&
    !usuarios.length &&
    !agentes.length &&
    !departamentos.length
  ) return;

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

  /* ===== USUÁRIOS CHAT ===== */
  if (usuarios.length) {
    html += `
      <h3>👤 Usuários do Chat</h3>
      <div class="resumo-grid">
        ${usuarios.map(u => `
          <div class="resumo-card">
            <div class="titulo">${u.nome || "-"}</div>
            <div>📧 ${u.email || "-"}</div>
            <div>🔑 ${u.senha || "-"}</div>
            <div>👮 ${u.permissao || "-"}</div>
          </div>
        `).join("")}
      </div>
    `;
  }

  /* ===== DEPARTAMENTOS CHAT ===== */
  if (departamentos.length) {
    html += `
      <h3>🏷️ Departamentos</h3>
      <div class="resumo-grid">
        ${departamentos.map(d => `
          <div class="resumo-card">
            <div class="titulo">${d.nome}</div>
            ${
              d.agentes?.length
                ? `<div class="lista">
                    ${d.agentes.map(a => `<span class="chip">${a}</span>`).join("")}
                   </div>`
                : ""
            }
          </div>
        `).join("")}
      </div>
    `;
  }

  /* ===== AGENTES CHAT ===== */
  if (agentes.length) {
    html += `
      <h3>🎧 Agentes do Chat</h3>
      <div class="resumo-grid">
        ${agentes.map(a => `
          <div class="resumo-card">
            <div class="titulo">${a.nome}</div>
            ${
              a.departamentos?.length
                ? `<div class="lista">
                    ${a.departamentos.map(d => `<span class="chip">${d}</span>`).join("")}
                   </div>`
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
   RESUMO – PRINCIPAL (VOZ / PABX + CHAT)
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

  if (!dados.voz) {
    window.renderResumoChat(resumo, dados);
    return;
  }

  const voz = dados.voz;

  /* ================= USUÁRIOS WEB ================= */
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

  /* ================= RAMAIS ================= */
  if (voz.ramais?.length) {
    resumo.innerHTML += `
      <section class="resumo-bloco">
        <h2>☎️ Ramais</h2>
        <div class="resumo-grid">
          ${voz.ramais.map(r => `
            <div class="resumo-card">
              <div class="titulo">Ramal ${r.ramal}</div>
              <div>🔐 ${r.senha || "-"}</div>
            </div>
          `).join("")}
        </div>
      </section>
    `;
  }

  /* ================= AGENTES VOZ ================= */
  if (voz.agentes?.length) {
    resumo.innerHTML += `
      <section class="resumo-bloco">
        <h2>🎧 Agentes (Voz)</h2>
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

  /* ================= FILAS ================= */
  if (voz.filas?.length) {
    resumo.innerHTML += `
      <section class="resumo-bloco">
        <h2>📞 Filas</h2>
        <div class="resumo-grid">
          ${voz.filas.map(f => `
            <div class="resumo-card">
              <div class="titulo">${f.nome}</div>
              ${
                f.agentes?.length
                  ? `<div class="lista">
                      ${f.agentes.map(a => `<span class="chip">${a}</span>`).join("")}
                     </div>`
                  : ""
              }
            </div>
          `).join("")}
        </div>
      </section>
    `;
  }

  /* ================= GRUPO DE RING ================= */
  if (voz.grupo_ring?.length) {
    resumo.innerHTML += `
      <section class="resumo-bloco">
        <h2>🔔 Grupo de Ring</h2>
        <div class="resumo-grid">
          ${voz.grupo_ring.map(g => `
            <div class="resumo-card">
              <div class="titulo">${g.nome}</div>
              <div>${g.estrategia || "-"}</div>
              ${
                g.ramais?.length
                  ? `<div class="lista">
                      ${g.ramais.map(r => `<span class="chip">${r}</span>`).join("")}
                     </div>`
                  : ""
              }
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
        <h2>🎙️ URAs</h2>
        <div class="resumo-grid">
          ${voz.uras.map(u => `
            <div class="resumo-card">
              <div class="titulo">${u.nome}</div>
              <div>${u.mensagem}</div>
              ${
                u.opcoes?.length
                  ? `<ul>
                      ${u.opcoes.map(o =>
                        `<li>Tecla ${o.tecla} → ${o.destino}</li>`
                      ).join("")}
                     </ul>`
                  : ""
              }
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
