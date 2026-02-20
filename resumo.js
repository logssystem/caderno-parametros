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

  /* ===== PESQUISA DE SATISFAÇÃO ===== */
  if (voz.pesquisaSatisfacao) {
    const lista = Array.isArray(voz.pesquisaSatisfacao)
      ? voz.pesquisaSatisfacao
      : [voz.pesquisaSatisfacao];
  
    const pesquisaHTML = lista.map(p => {
      const respostasRaw = Array.isArray(p.respostas) ? p.respostas : [];
  
      const respostas = respostasRaw.map((r, i) => {
        if (typeof r === "number" || typeof r === "string") {
          return `(${i + 1}) ${r}`;
        }
        if (typeof r === "object" && r !== null) {
          return `(${i + 1}) ${r.texto ?? r.label ?? r.valor ?? r.nota ?? "Resposta"}`;
        }
        return null;
      }).filter(Boolean);
  
      return `
        <div class="resumo-card">
          <div class="titulo">${p.nome || "Pesquisa de Satisfação"}</div>
  
          ${p.introducao
            ? `<div class="info-linha"><em>${p.introducao}</em></div>`
            : ""
          }
  
          ${p.pergunta
            ? `<div class="info-linha"><strong>Pergunta:</strong> ${p.pergunta}</div>`
            : ""
          }
  
          ${
            respostas.length
              ? `
                <div class="lista">
                  ${respostas.map(r => `<span class="chip">${r}</span>`).join("")}
                </div>
              `
              : `<div class="info-linha">⚠️ Nenhuma resposta configurada</div>`
          }
  
          ${p.finalizacao
            ? `<div class="info-linha"><em>${p.finalizacao}</em></div>`
            : ""
          }
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
