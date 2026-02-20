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

  /* ===== FUNÇÃO: IDENTIFICAR DESTINO ===== */
  function identificarDestino(nome, voz) {
    if (!nome) return "Não definido";

    if (voz.regras_tempo?.some(r => r.nome === nome))
      return `⏰ Regra de Tempo — ${nome}`;

    if (voz.filas?.some(f => f.nome === nome))
      return `📞 Fila — ${nome}`;

    if (voz.uras?.some(u => u.nome === nome))
      return `🎙️ URA — ${nome}`;

    if (voz.grupo_ring?.some(g => g.nome === nome))
      return `🔔 Grupo de Ring — ${nome}`;

    if (voz.ramais?.some(r => String(r.ramal) === String(nome)))
      return `☎️ Ramal — ${nome}`;

    return nome;
  }

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

    /* ===== MAPA RAMAL → USUÁRIO ===== */
    const mapaRamalUsuario = {};
    (voz.agentes || []).forEach(a => {
      if (a.ramal && a.nome) mapaRamalUsuario[a.ramal] = a.nome;
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

    /* ===== AGENTES ===== */
    if (voz.agentes?.length) {
      resumo.innerHTML += `
        <section class="resumo-bloco">
          <h2>🎧 Agentes</h2>
          <div class="resumo-grid">
            ${voz.agentes.map(a => `
              <div class="resumo-card">
                <div class="titulo">Agente: ${a.nome}</div>
                <div class="info-linha">📞 Ramal: ${a.ramal || "Não vinculado"}</div>
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
                <div class="titulo">Fila: ${f.nome}</div>
                <div class="lista">
                  ${(f.agentes || []).map(a => `<span class="chip">${a}</span>`).join("")}
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
                <div class="titulo">${g.nome}</div>
                <div class="info-linha">Estratégia: <strong>${g.estrategia}</strong></div>
                <div class="lista">
                  ${(g.ramais || []).map(r => `<span class="chip">${r}</span>`).join("")}
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
                <div class="titulo">Ramal ${r.ramal}</div>
                <div class="info-linha">🔐 ${r.senha}</div>
                <div class="info-linha">
                  👤 Usuário: ${mapaRamalUsuario[r.ramal] || "Não vinculado"}
                </div>
              </div>
            `).join("")}
          </div>
        </section>
      `;
    }

    /* ===== NÚMEROS / ENTRADAS ===== */
    if (voz.entradas?.length) {
      resumo.innerHTML += `
        <section class="resumo-bloco">
          <h2>📲 Números</h2>
          <div class="resumo-grid">
            ${voz.entradas.map(n => `
              <div class="resumo-card">
                <div class="titulo">${n.numero}</div>
                <div class="info-linha">
                  Destino: ${identificarDestino(n.destino, voz)}
                </div>
              </div>
            `).join("")}
          </div>
        </section>
      `;
    }

    /* ===== REGRAS DE TEMPO ===== */
    if (voz.regras_tempo?.length) {
      resumo.innerHTML += `
        <section class="resumo-bloco">
          <h2>⏰ Regras de Tempo</h2>
          <div class="resumo-grid">
            ${voz.regras_tempo.map(r => {

              let horariosHTML = "🕒 Horário não definido";

              if (r.horarios?.length) {
                horariosHTML = r.horarios
                  .map(h => `🕒 ${h.inicio} até ${h.fim}`)
                  .join("<br>");
              } else if (r.inicio && r.fim) {
                horariosHTML = `🕒 ${r.inicio} até ${r.fim}`;
              } else if (r.hora_inicio && r.hora_fim) {
                horariosHTML = `🕒 ${r.hora_inicio} até ${r.hora_fim}`;
              }

              return `
                <div class="resumo-card">
                  <div class="titulo">${r.nome}</div>
                  <div class="info-linha">
                    Dias: ${(r.dias || []).join(", ")}
                  </div>
                  <div class="info-linha">
                    ${horariosHTML}
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </section>
      `;
    }

    /* ===== PAUSAS ===== */
    const pausas = voz.pausas || [];
    
    if (pausas.length) {
      resumo.innerHTML += `
        <section class="resumo-bloco">
          <h2>⏸️ Pausas</h2>
          <div class="resumo-grid">
            ${pausas.map(p => `
              <div class="resumo-card">
                <div class="titulo">${p.grupo}</div>
                ${(p.itens || []).map(i =>
                  `<div class="info-linha">• ${i}</div>`
                ).join("")}
              </div>
            `).join("")}
          </div>
        </section>
      `;
    }

  /* ===== PESQUISA DE SATISFAÇÃO ===== */
    const pesquisas = voz.pesquisaSatisfacao || [];
    
    if (pesquisas.length) {
      resumo.innerHTML += `
        <section class="resumo-bloco">
          <h2>📊 Pesquisa de Satisfação</h2>
          <div class="resumo-grid">
            ${pesquisas.map(p => `
              <div class="resumo-card">
                <div class="titulo">${p.nome}</div>
    
                ${p.introducao
                  ? `<div class="info-linha"><em>${p.introducao}</em></div>`
                  : ""
                }
    
                ${p.pergunta
                  ? `<div class="info-linha"><strong>Pergunta:</strong> ${p.pergunta}</div>`
                  : ""
                }
    
                ${(p.respostas || []).length
                  ? `
                    <div class="lista">
                      ${(p.respostas || []).map(r =>
                        `<span class="chip">${r}</span>`
                      ).join("")}
                    </div>
                  `
                  : ""
                }
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
                <div class="info-linha"><em>${u.mensagem}</em></div>
                <div class="lista">
                  ${(u.opcoes || []).map(o =>
                    `<div class="chip">
                      Tecla ${o.tecla} → ${identificarDestino(o.destino, voz)}
                    </div>`
                  ).join("")}
                </div>
              </div>
            `).join("")}
          </div>
        </section>
      `;
    }
  }

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
          <div class="info-linha">
            <strong>Canais:</strong> ${(chat.canais || []).join(", ")}
          </div>
        </div>
      </section>
    `;
  }
});

/* ===== VOLTAR ===== */
window.voltar = () => {
  window.location.href = "index.html";
};
