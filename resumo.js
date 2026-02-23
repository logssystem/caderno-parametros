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

  /* ===== FUNÇÃO: IDENTIFICAR DESTINO ===== */
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

  /* ================= VOZ ================= */
  if (!dados.voz) return;
  const voz = dados.voz;

  /* ===== MAPA RAMAL → USUÁRIO ===== */
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

  /* ===== REGRAS DE TEMPO ===== */
  if (voz.regras_tempo?.length) {
    const regrasHTML = voz.regras_tempo.map(r => {
      let horario = "🕒 Horário não definido";
      if (r.horario) horario = `🕒 ${r.horario}`;
      else if (r.inicio && r.fim) horario = `🕒 ${r.inicio} até ${r.fim}`;

      return `
        <div class="resumo-card">
          <div class="titulo">${r.nome}</div>
          <div>Dias: ${(r.dias || []).join(", ")}</div>
          <div>${horario}</div>
        </div>
      `;
    }).join("");

    resumo.innerHTML += `
      <section class="resumo-bloco">
        <h2>⏰ Regras de Tempo</h2>
        <div class="resumo-grid">${regrasHTML}</div>
      </section>
    `;
  }

  /* ===== PAUSAS (COM MINUTAGEM) ===== */
  if (voz.pausas) {
    const pausasLista = Array.isArray(voz.pausas) ? voz.pausas : [voz.pausas];

    const pausasHTML = pausasLista.map(p => {
      const itens = p.pausas || p.itens || [];
      const itensHTML = itens.map(i => {
        const nome = i.nome || i.tipo || "Pausa";
        const minutos = i.minutos || i.tempo || i.duracao;
        return `<div>• ${nome}${minutos ? ` (${minutos} min)` : ""}</div>`;
      }).join("");

      return `
        <div class="resumo-card">
          <div class="titulo">${p.nome || p.grupo}</div>
          ${itensHTML}
        </div>
      `;
    }).join("");

    resumo.innerHTML += `
      <section class="resumo-bloco">
        <h2>⏸️ Pausas</h2>
        <div class="resumo-grid">${pausasHTML}</div>
      </section>
    `;
  }

 
/* ===== PESQUISA DE SATISFAÇÃO (VARREDURA TOTAL DE TEXTO) ===== */
if (voz.pesquisaSatisfacao) {
  const pesquisas = Array.isArray(voz.pesquisaSatisfacao)
    ? voz.pesquisaSatisfacao
    : [voz.pesquisaSatisfacao];

  function extrairTextoProfundo(obj) {
    let textos = [];

    function percorrer(o) {
      if (!o) return;

      if (typeof o === "string" && o.trim().length > 5) {
        textos.push(o);
      } else if (typeof o === "object") {
        Object.values(o).forEach(v => percorrer(v));
      }
    }

    percorrer(obj);
    return textos;
  }

  const pesquisaHTML = pesquisas.map(p => {
    const introducao =
      p.introducao ??
      p.textoIntroducao ??
      p.descricao ??
      "";

    const pergunta =
      p.pergunta ??
      p.textoPergunta ??
      "";

    const respostasRaw = Array.isArray(p.respostas) ? p.respostas : [];

    const respostasHTML = respostasRaw.length
      ? respostasRaw.map((r, i) => {
          let texto = "";

          if (typeof r === "string" || typeof r === "number") {
            texto = r;
          } else if (typeof r === "object" && r !== null) {
            texto =
              r.texto ??
              r.label ??
              r.descricao ??
              r.valor ??
              r.nota ??
              JSON.stringify(r);
          } else {
            texto = "Resposta não identificada";
          }

          return `<div>${i + 1} - ${texto}</div>`;
        }).join("")
      : `<div><em>Nenhuma resposta cadastrada</em></div>`;

    // 🔥 EXTRAÇÃO FINAL AUTOMÁTICA
    const textosDetectados = extrairTextoProfundo(p);

    // remove duplicados óbvios (introdução/pergunta)
    const textosLimpos = textosDetectados.filter(t =>
    t &&
    t !== p.nome &&
    t !== introducao &&
    t !== pergunta
  );

    return `
      <div class="resumo-card" style="max-width:100%">
        <div class="titulo">${p.nome || "Pesquisa de Satisfação"}</div>

        <div class="info-linha">
          <strong>Introdução:</strong><br>
          ${introducao || "<em>Não informada</em>"}
        </div>

        <div class="info-linha">
          <strong>Pergunta:</strong><br>
          ${pergunta || "<em>Não informada</em>"}
        </div>

        <div class="info-linha">
          <strong>Respostas:</strong><br>
          ${respostasHTML}
        </div>

        <div class="info-linha">
          <strong>Agradecimentos:</strong><br>
          ${
            textosLimpos.length
              ? textosLimpos.map(t => `<div>• ${t}</div>`).join("")
              : "<em>Nenhum texto adicional encontrado</em>"
          }
        </div>
      </div>
    `;
  }).join("");

  resumo.innerHTML += `
    <section class="resumo-bloco">
      <h2>📊 Pesquisa de Satisfação</h2>
      <div class="resumo-grid">${pesquisaHTML}</div>
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
});

/* =======================
   RESUMO – CHAT / OMNICHANNEL
   ======================= */
function renderResumoChat(container) {
  if (!window.chatState || !window.chatState.tipo) return;

  const {
    tipo,
    api,
    conta,
    canais = [],
    usuarios = [],
    agentes = [],
    departamentos = []
  } = window.chatState;

  const card = document.createElement("div");
  card.className = "resumo-card";

  card.innerHTML = `
    <h3>Chat / Omnichannel</h3>

    <div class="resumo-linha"><strong>Tipo:</strong> ${tipo}</div>
    ${api ? `<div class="resumo-linha"><strong>API:</strong> ${api}</div>` : ""}
    ${conta ? `<div class="resumo-linha"><strong>Conta:</strong> ${conta}</div>` : ""}

    ${
      canais.length
        ? `<div class="resumo-linha"><strong>Canais:</strong>
            <div class="resumo-chips">
              ${canais.map(c => `<span class="chip">${c}</span>`).join("")}
            </div>
          </div>`
        : ""
    }

    ${
      usuarios.length
        ? `<div class="resumo-bloco">
            <strong>Usuários Chat</strong>
            <ul>
              ${usuarios.map(u => `<li>${u.nome} (${u.email})</li>`).join("")}
            </ul>
          </div>`
        : ""
    }

    ${
      agentes.length
        ? `<div class="resumo-bloco">
            <strong>Agentes Chat</strong>
            <ul>
              ${agentes.map(a => `<li>${a.nome}</li>`).join("")}
            </ul>
          </div>`
        : ""
    }

    ${
      departamentos.length
        ? `<div class="resumo-bloco">
            <strong>Departamentos</strong>
            ${departamentos
              .map(
                d => `
                  <div class="resumo-departamento">
                    <div><strong>${d.nome}</strong></div>
                    ${
                      d.agentes?.length
                        ? `<div class="resumo-chips">
                            ${d.agentes
                              .map(a => `<span class="chip">${a}</span>`)
                              .join("")}
                          </div>`
                        : `<div class="resumo-vazio">Sem agentes</div>`
                    }
                  </div>
                `
              )
              .join("")}
          </div>`
        : ""
    }
  `;

  container.appendChild(card);
}

/*==============/*Voltar=============*/

window.voltar = function () {
  window.location.href = "index.html";
};
