/* ======================================================
   RESUMO – CHAT
====================================================== */
window.renderResumoChat = function (container, data) {
  if (!container) return;
  if (!data.chat || !data.chat.tipo) return;
  const chat     = data.chat;
  const usuarios = chat.usuarios || [];
  const agentes  = chat.agentes  || [];
  let html = "";
  const section = document.createElement("section");
  section.className = "resumo-bloco";

  html += `<h2>💬 Chat / Omnichannel</h2>`;
  if (chat.tipo === "qr") {
    html += `
    <div class="resumo-card">
      <div><strong>Tipo:</strong> Integração via QR Code</div>
      <div class="campo"><strong>Número do QR Code:</strong> ${chat.conta || "-"}</div>
    </div>`;
  } else if (chat.tipo === "api") {
    html += `
    <div class="resumo-card">
      <div><strong>Tipo:</strong> Integração via API Oficial</div>
      <div><strong>API:</strong> ${chat.api || "-"}</div>
      <div><strong>Conta:</strong> ${chat.conta || "-"}</div>
    </div>`;
  }

  if (chat.canais?.length) {
    html += `<div class="resumo-card"><div class="titulo">Canais</div><div class="lista">
      ${chat.canais.map(c => `<span class="chip">${c}</span>`).join("")}
    </div></div>`;
  }

  if (usuarios.length) {
    html += `<h3>👤 Usuários do Chat</h3><div class="resumo-grid">
      ${usuarios.map(u => `<div class="resumo-card">
        <div class="titulo">${u.nome}</div>
        <div>📧 ${u.email || "-"}</div>
        <div>🔐 Senha: ${u.senha || "-"}</div>
        <div>🛡 Permissão: ${u.permissao || "-"}</div>
      </div>`).join("")}
    </div>`;
  }

  if (agentes.length) {
    html += `<h3>🎧 Agentes do Chat</h3><div class="resumo-grid">
      ${agentes.map(a => {
        const deps = Array.isArray(a.departamentos) ? a.departamentos : [];
        return `<div class="resumo-card">
          <div class="titulo">${a.nome}</div>
          ${deps.length
            ? `<div class="lista">${deps.map(d => `<span class="chip">${d}</span>`).join("")}</div>`
            : `<div class="texto-secundario">Sem departamento</div>`}
        </div>`;
      }).join("")}
    </div>`;
  }

  if (chat.departamentos?.length) {
    html += `<h3>🏢 Departamentos</h3><div class="resumo-grid">
      ${chat.departamentos.map(dep => `<div class="resumo-card">
        <div class="titulo">${dep.nome}</div>
        ${dep.agentes?.length
          ? `<div class="lista">${dep.agentes.map(a => `<span class="chip">${a}</span>`).join("")}</div>`
          : `<div class="texto-secundario">Sem agentes</div>`}
      </div>`).join("")}
    </div>`;
  }

  section.innerHTML = html;
  container.appendChild(section);
};

/* ======================================================
   RESUMO – PRINCIPAL
====================================================== */
/* ======================================================
   ESTADO GLOBAL DO RESUMO
====================================================== */
let _dadosResumo   = {};
let _modoCompacto  = false;
let _paginasState  = {}; // { secaoId: paginaAtual }
const PAGE_SIZE    = 9;

/* ── Modo compacto / completo ── */
window.toggleModoResumo = function () {
  _modoCompacto = !_modoCompacto;
  const btn   = document.getElementById("btnModoResumo");
  const label = btn?.querySelector(".modo-label");
  const icone = btn?.querySelector(".modo-icone");
  if (label) label.textContent = _modoCompacto ? "Compacto" : "Completo";
  if (icone) icone.textContent = _modoCompacto ? "🗂️" : "📋";
  document.querySelectorAll(".campo-sensivel").forEach(el => {
    el.style.display = _modoCompacto ? "none" : "";
  });
  document.querySelectorAll(".resumo-card").forEach(card => {
    card.classList.toggle("modo-compacto", _modoCompacto);
  });
};

/* ── Copiar para clipboard ── */
window.copiarCampo = function (texto, btn) {
  navigator.clipboard.writeText(texto).then(() => {
    const orig = btn.innerHTML;
    btn.innerHTML = "✓";
    btn.classList.add("copiado");
    setTimeout(() => { btn.innerHTML = orig; btn.classList.remove("copiado"); }, 1500);
  }).catch(() => {
    const ta = document.createElement("textarea");
    ta.value = texto;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    btn.innerHTML = "✓";
    setTimeout(() => { btn.innerHTML = "⧉"; }, 1200);
  });
};

function btnCopiar(texto) {
  if (!texto || texto === "-" || texto === "—") return "";
  const safe = texto.replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  return `<button class="btn-copiar" onclick="copiarCampo('${safe}', this)" title="Copiar">⧉</button>`;
}

function campoCopia(label, valor, sensivel = false) {
  const cls = sensivel ? ' class="campo-sensivel"' : "";
  return `<div${cls}><strong>${label}:</strong> <span>${valor || "—"}</span>${btnCopiar(valor)}</div>`;
}

/* ── Busca ── */
window.limparBusca = function () {
  const inp = document.getElementById("resumoBusca");
  if (inp) { inp.value = ""; inp.dispatchEvent(new Event("input")); }
};

function initBusca() {
  const inp   = document.getElementById("resumoBusca");
  const clear = document.getElementById("btnClearBusca");
  if (!inp) return;
  inp.addEventListener("input", () => {
    const q = inp.value.trim().toLowerCase();
    if (clear) clear.style.display = q ? "block" : "none";
    document.querySelectorAll(".resumo-card").forEach(card => {
      const txt = card.textContent.toLowerCase();
      card.style.display = (!q || txt.includes(q)) ? "" : "none";
    });
    // Mostra seções que têm resultados
    document.querySelectorAll(".resumo-bloco").forEach(bloco => {
      if (bloco.classList.contains("modulo-titulo")) return;
      const cards = bloco.querySelectorAll(".resumo-card");
      const visivel = [...cards].some(c => c.style.display !== "none");
      bloco.style.display = (!q || visivel) ? "" : "none";
    });
  });
}

/* ── Paginação ── */
function renderPaginado(itens, secaoId, renderFn) {
  if (!_paginasState[secaoId]) _paginasState[secaoId] = 1;
  const total  = Math.ceil(itens.length / PAGE_SIZE);
  const pagina = Math.min(_paginasState[secaoId], total);
  const slice  = itens.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE);

  let html = `<div class="resumo-grid">${slice.map(renderFn).join("")}</div>`;

  if (total > 1) {
    html += `<div class="paginacao">`;
    if (pagina > 1)
      html += `<button class="btn-pag" onclick="irPagina('${secaoId}',${pagina - 1})">‹ Ant.</button>`;
    html += `<span class="pag-info">Pág. ${pagina} / ${total} <span class="pag-total">(${itens.length} itens)</span></span>`;
    if (pagina < total)
      html += `<button class="btn-pag" onclick="irPagina('${secaoId}',${pagina + 1})">Próx. ›</button>`;
    html += `</div>`;
  }
  return html;
}

window.irPagina = function (secaoId, pagina) {
  _paginasState[secaoId] = pagina;
  renderResumoCompleto();
  // Rola para a seção
  setTimeout(() => {
    const el = document.getElementById(secaoId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 60);
};

/* ── Sidebar nav ── */
function buildNav(secoes) {
  const lista = document.getElementById("navLista");
  if (!lista) return;
  lista.innerHTML = secoes.map(s =>
    `<li><a class="nav-link" href="#${s.id}" onclick="navClick('${s.id}',event)">
      <span class="nav-icone">${s.icone}</span>
      <span class="nav-nome">${s.nome}</span>
      ${s.count ? `<span class="nav-badge">${s.count}</span>` : ""}
    </a></li>`
  ).join("");

  // Observer para destacar seção ativa
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        document.querySelectorAll(".nav-link").forEach(l => {
          l.classList.toggle("ativo", l.getAttribute("href") === `#${id}`);
        });
      }
    });
  }, { rootMargin: "-30% 0px -60% 0px" });

  secoes.forEach(s => {
    const el = document.getElementById(s.id);
    if (el) observer.observe(el);
  });
}

window.navClick = function (id, e) {
  e.preventDefault();
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

/* ── Alertas ── */
function buildAlertas(dados) {
  const voz  = dados.voz  || {};
  const alertas = [];

  // Agentes sem ramal
  (voz.agentes || []).forEach(a => {
    if (!a.ramal) alertas.push({ tipo: "erro", msg: `Agente <strong>${a.nome}</strong> sem ramal vinculado` });
  });

  // Filas sem agentes
  (voz.filas || []).forEach(f => {
    if (!f.agentes?.length) alertas.push({ tipo: "aviso", msg: `Fila <strong>${f.nome}</strong> sem agentes configurados` });
  });

  // URAs com opções sem destino
  (voz.uras || []).forEach(u => {
    (u.opcoes || []).forEach(o => {
      if (!o.destino) alertas.push({ tipo: "aviso", msg: `URA <strong>${u.nome}</strong> — tecla ${o.tecla} sem destino definido` });
    });
  });

  // Grupo de ring sem ramais
  (voz.grupo_ring || []).forEach(g => {
    if (!g.ramais?.length) alertas.push({ tipo: "aviso", msg: `Grupo de Ring <strong>${g.nome}</strong> sem ramais` });
  });

  // Usuários sem permissão
  (voz.usuarios || []).forEach(u => {
    if (!u.permissao) alertas.push({ tipo: "info", msg: `Usuário <strong>${u.nome}</strong> sem permissão definida` });
  });

  // Domínio inválido
  const dom = dados.cliente?.dominio || "";
  if (dom && !dom.endsWith(".sobreip.com.br"))
    alertas.push({ tipo: "erro", msg: `Domínio <strong>${dom}</strong> não termina com .sobreip.com.br` });

  const painel = document.getElementById("painelAlertas");
  if (!painel) return;
  if (!alertas.length) { painel.style.display = "none"; return; }

  const icons  = { erro: "🔴", aviso: "🟡", info: "🔵" };
  const erros  = alertas.filter(a => a.tipo === "erro").length;
  const avisos = alertas.filter(a => a.tipo === "aviso").length;

  painel.style.display = "block";
  painel.innerHTML = `
    <div class="alertas-header">
      <span class="alertas-titulo">⚠️ Verificações automáticas</span>
      <div class="alertas-resumo">
        ${erros  ? `<span class="badge-alerta erro">${erros} erro${erros > 1 ? "s" : ""}</span>` : ""}
        ${avisos ? `<span class="badge-alerta aviso">${avisos} aviso${avisos > 1 ? "s" : ""}</span>` : ""}
      </div>
      <button class="alertas-toggle" onclick="this.closest('.painel-alertas').classList.toggle('expandido')">▾</button>
    </div>
    <ul class="alertas-lista">
      ${alertas.map(a => `<li class="alerta-item alerta-${a.tipo}">${icons[a.tipo]} ${a.msg}</li>`).join("")}
    </ul>`;
}

/* ── Render principal ── */
function renderResumoCompleto() {
  const resumo = document.getElementById("resumo");
  if (!resumo) return;
  const dados = _dadosResumo;
  const voz   = dados.voz  || {};
  const cli   = dados.cliente || {};
  resumo.innerHTML = "";

  const secoes = []; // para a sidebar

  function secao(id, icone, titulo, count) {
    secoes.push({ id, icone, nome: titulo, count });
    return `<section class="resumo-bloco" id="${id}">
      <h2 class="resumo-secao-titulo"><span>${icone}</span> ${titulo}
        ${count ? `<span class="secao-count">${count}</span>` : ""}
      </h2>`;
  }

  function fecharSecao() { return `</section>`; }

  function identificarDestino(nome) {
    if (!nome) return "—";
    if (voz.regras_tempo?.some(r => r.nome === nome)) return `⏰ ${nome}`;
    if (voz.filas?.some(f => f.nome === nome))        return `📞 ${nome}`;
    if (voz.grupo_ring?.some(g => g.nome === nome))   return `🔔 ${nome}`;
    if (voz.uras?.some(u => u.nome === nome))         return `🎙️ ${nome}`;
    if (voz.ramais?.some(r => String(r.ramal) === String(nome))) return `☎️ ${nome}`;
    return nome;
  }

  let html = "";

  // ── Módulo Voz ──────────────────────────────────────
  const temVoz = voz.usuarios?.length || voz.ramais?.length || voz.agentes?.length || voz.filas?.length;
  if (temVoz) html += `<div class="modulo-titulo"><h1>📞 Voz / Call Center</h1></div>`;

  // Cliente
  if (cli.empresa || cli.dominio || cli.cnpj) {
    html += secao("sec-cliente", "🏢", "Cliente");
    html += `<div class="resumo-card">
      ${campoCopia("Empresa", cli.empresa)}
      ${campoCopia("Domínio", cli.dominio)}
      ${campoCopia("CNPJ / CPF", cli.cnpj)}
    </div>`;
    html += fecharSecao();
  }

  // Usuários Web
  if (voz.usuarios?.length) {
    html += secao("sec-usuarios", "👤", "Usuários Web", voz.usuarios.length);
    html += renderPaginado(voz.usuarios, "sec-usuarios", u => `
      <div class="resumo-card">
        <div class="titulo">${u.nome}</div>
        <div>📧 ${u.email || "—"}${btnCopiar(u.email)}</div>
        <div class="campo-sensivel">🔐 ${u.senha || "—"}${btnCopiar(u.senha)}</div>
        <div class="campo-sensivel">🛡 ${u.permissao || "—"}</div>
        ${u.agente_callcenter || u.agente ? `<span class="badge">Agente CC</span>` : ""}
        ${u.agente_omnichannel ? `<span class="badge badge-omni">Agente Omni</span>` : ""}
      </div>`);
    html += fecharSecao();
  }

  // Entradas
  if (voz.entradas?.length) {
    html += secao("sec-entradas", "📞", "Entradas / Números", voz.entradas.length);
    html += `<div class="resumo-grid">
      ${voz.entradas.map(e => `<div class="resumo-card">
        <div class="titulo">${e.numero}${btnCopiar(e.numero)}</div>
      </div>`).join("")}
    </div>`;
    html += fecharSecao();
  }

  // Ramais — paginado
  if (voz.ramais?.length) {
    html += secao("sec-ramais", "☎️", "Ramais", voz.ramais.length);
    html += renderPaginado(voz.ramais, "sec-ramais", r => `
      <div class="resumo-card">
        <div class="titulo">Ramal ${r.ramal}${btnCopiar(r.ramal)}</div>
        <div class="campo-sensivel">🔐 ${r.senha || "—"}${btnCopiar(r.senha)}</div>
      </div>`);
    html += fecharSecao();
  }

  // Agentes — paginado
  if (voz.agentes?.length) {
    html += secao("sec-agentes", "🎧", "Agentes", voz.agentes.length);
    html += renderPaginado(voz.agentes, "sec-agentes", a => `
      <div class="resumo-card ${!a.ramal ? "card-alerta" : ""}">
        <div class="titulo">${a.nome}</div>
        <div>☎️ Ramal: ${a.ramal || '<span class="sem-ramal">⚠ sem ramal</span>'}${btnCopiar(a.ramal)}</div>
        ${a.multiskill ? `<span class="badge badge-multi">Multiskill</span>` : ""}
      </div>`);
    html += fecharSecao();
  }

  // Regras de Tempo
  if (voz.regras_tempo?.length) {
    html += secao("sec-regras", "⏰", "Regras de Tempo", voz.regras_tempo.length);
    html += `<div class="resumo-grid">${voz.regras_tempo.map(r => {
      const faixas = r.faixas?.length ? r.faixas
        : (r.hora_inicio ? [{ inicio: r.hora_inicio, fim: r.hora_fim }] : []);
      return `<div class="resumo-card">
        <div class="titulo">${r.nome}</div>
        <div><strong>Dias:</strong> ${(r.dias || []).join(", ") || "—"}</div>
        <div style="margin-top:6px">${faixas.map(f =>
          `<span class="resumo-chip">🕐 ${f.inicio || "--:--"} às ${f.fim || "--:--"}</span>`
        ).join(" ")}</div>
      </div>`;
    }).join("")}</div>`;
    html += fecharSecao();
  }

  // Grupo de Ring
  if (voz.grupo_ring?.length) {
    html += secao("sec-grupo-ring", "🔔", "Grupo de Ring", voz.grupo_ring.length);
    html += `<div class="resumo-grid">${voz.grupo_ring.map(g => `
      <div class="resumo-card">
        <div class="titulo">${g.nome}</div>
        <div><strong>Estratégia:</strong> ${g.estrategia || "—"}</div>
        <div class="lista">${(g.ramais || []).map(r => `<span class="chip">${r}</span>`).join("")}</div>
      </div>`).join("")}</div>`;
    html += fecharSecao();
  }

  // Filas
  if (voz.filas?.length) {
    html += secao("sec-filas", "📋", "Filas", voz.filas.length);
    html += `<div class="resumo-grid">${voz.filas.map(f => `
      <div class="resumo-card ${!f.agentes?.length ? "card-alerta" : ""}">
        <div class="titulo">${f.nome}</div>
        <div class="lista">${(f.agentes || []).length
          ? f.agentes.map(a => `<span class="chip">${a}</span>`).join("")
          : '<span class="sem-ramal">⚠ sem agentes</span>'}
        </div>
      </div>`).join("")}</div>`;
    html += fecharSecao();
  }

  // URA
  if (voz.uras?.length) {
    html += secao("sec-ura", "🎙️", "URA", voz.uras.length);
    html += voz.uras.map(u => `
      <div class="resumo-card">
        <div class="titulo">${u.nome}</div>
        ${u.mensagem ? `<div class="campo-sensivel" style="opacity:.8;font-size:13px">${u.mensagem}</div>` : ""}
        ${(u.opcoes || []).length ? `<table class="ura-table">
          <thead><tr><th>Tecla</th><th>Destino</th><th>Descrição</th></tr></thead>
          <tbody>${u.opcoes.map(o => `<tr>
            <td><strong>${o.tecla || "—"}</strong></td>
            <td>${identificarDestino(o.destino) || '<span class="sem-ramal">⚠ sem destino</span>'}</td>
            <td>${o.descricao || "—"}</td>
          </tr>`).join("")}</tbody>
        </table>` : ""}
      </div>`).join("");
    html += fecharSecao();
  }

  // Pausas
  if (voz.pausas?.length) {
    html += secao("sec-pausas", "⏸️", "Pausas", voz.pausas.length);
    html += voz.pausas.map(p => `
      <div class="resumo-card">
        <div class="titulo">${p.grupo}</div>
        <div class="lista">${(p.itens || []).map(i =>
          `<span class="chip">${i.nome} <em>(${i.tempo})</em></span>`).join("")}
        </div>
      </div>`).join("");
    html += fecharSecao();
  }

  // Pesquisa
  if (voz.pesquisas?.length) {
    html += secao("sec-pesquisa", "⭐", "Pesquisa de Satisfação", voz.pesquisas.length);
    html += voz.pesquisas.map(p => `
      <div class="resumo-card">
        <div class="titulo">${p.nome}</div>
        ${p.introducao    ? `<div><strong>Introdução:</strong> ${p.introducao}</div>`   : ""}
        <div><strong>Pergunta:</strong> ${p.pergunta || "—"}</div>
        <ul style="margin-top:8px">${(p.respostas || []).map(r =>
          `<li>${r.nota} — ${r.descricao}</li>`).join("")}</ul>
        ${p.encerramento  ? `<div style="margin-top:6px"><strong>Encerramento:</strong> ${p.encerramento}</div>` : ""}
      </div>`).join("");
    html += fecharSecao();
  }

  // ── Módulo Chat ──────────────────────────────────────
  const chat = dados.chat || {};
  if (chat.tipo || chat.usuarios?.length || chat.agentes?.length) {
    html += `<div class="modulo-titulo"><h1>💬 Chat / Omnichannel</h1></div>`;

    html += secao("sec-chat-config", "⚙️", "Configuração de Chat");
    if (chat.tipo === "qr") {
      html += `<div class="resumo-card">
        <div><strong>Tipo:</strong> QR Code</div>
        <div>📱 ${Array.isArray(chat.numero_qr) ? chat.numero_qr.join(", ") : (chat.conta || "—")}${btnCopiar(chat.conta)}</div>
      </div>`;
    } else if (chat.tipo === "api" || chat.tipo === "ambos") {
      html += `<div class="resumo-card">
        <div><strong>Tipo:</strong> ${chat.tipo === "ambos" ? "API + QR Code" : "API Oficial"}</div>
        ${campoCopia("API", chat.api)}
        ${campoCopia("Conta", typeof chat.conta === "object" ? chat.conta?.api : chat.conta)}
      </div>`;
    }
    if (chat.canais?.length) {
      html += `<div style="margin-top:8px" class="lista">${chat.canais.map(c =>
        `<span class="chip">${c}</span>`).join("")}</div>`;
    }
    html += fecharSecao();

    if (chat.usuarios?.length) {
      html += secao("sec-chat-usuarios", "👤", "Usuários do Chat", chat.usuarios.length);
      html += renderPaginado(chat.usuarios, "sec-chat-usuarios", u => `
        <div class="resumo-card">
          <div class="titulo">${u.nome}</div>
          <div>📧 ${u.email || "—"}${btnCopiar(u.email)}</div>
          <div class="campo-sensivel">🔐 ${u.senha || "—"}${btnCopiar(u.senha)}</div>
          <div class="campo-sensivel">🛡 ${u.permissao || "—"}</div>
        </div>`);
      html += fecharSecao();
    }

    if (chat.agentes?.length) {
      html += secao("sec-chat-agentes", "🎧", "Agentes do Chat", chat.agentes.length);
      html += renderPaginado(chat.agentes, "sec-chat-agentes", a => `
        <div class="resumo-card">
          <div class="titulo">${a.nome}</div>
          <div class="lista">${(a.departamentos || []).map(d =>
            `<span class="chip">${d}</span>`).join("") || '<span style="opacity:.5">Sem departamento</span>'}
          </div>
        </div>`);
      html += fecharSecao();
    }

    if (chat.departamentos?.length) {
      html += secao("sec-chat-depto", "🏢", "Departamentos", chat.departamentos.length);
      html += `<div class="resumo-grid">${chat.departamentos.map(d => `
        <div class="resumo-card">
          <div class="titulo">${d.nome}</div>
          <div class="lista">${(d.agentes || []).map(a =>
            `<span class="chip">${a}</span>`).join("") || '<span style="opacity:.5">Sem agentes</span>'}
          </div>
        </div>`).join("")}</div>`;
      html += fecharSecao();
    }
  }

  resumo.innerHTML = html;

  // Aplica modo compacto se ativo
  if (_modoCompacto) {
    document.querySelectorAll(".campo-sensivel").forEach(el => el.style.display = "none");
  }

  buildNav(secoes);
  buildAlertas(dados);
  initBusca();
}

document.addEventListener("DOMContentLoaded", () => {
  const raw = localStorage.getItem("CONFIG_CADERNO");

  if (!raw || raw === "null") {
    document.getElementById("resumoEmpty").style.display = "block";
    return;
  }

  try { _dadosResumo = JSON.parse(raw) || {}; } catch (e) { _dadosResumo = {}; }

  // Mostra layout
  document.getElementById("resumoToolbar").style.display = "flex";
  document.getElementById("resumoLayout").style.display  = "flex";

  const voz = _dadosResumo.voz || {};

  if (voz.usuarios?.length || voz.ramais?.length || voz.agentes?.length || voz.filas?.length || voz.uras?.length || voz.grupo_ring?.length) {
    resumo.innerHTML += `<section class="resumo-bloco modulo-titulo"><h1>📞 Voz / Call Center</h1></section>`;
  }

  function identificarDestino(nome) {
    if (!nome) return "-";
    if (voz.regras_tempo?.some(r => r.nome === nome)) return `⏰ Regra de Tempo — ${nome}`;
    if (voz.filas?.some(f => f.nome === nome))        return `📞 Fila — ${nome}`;
    if (voz.grupo_ring?.some(g => g.nome === nome))   return `🔔 Grupo de Ring — ${nome}`;
    if (voz.uras?.some(u => u.nome === nome))         return `🎙️ URA — ${nome}`;
    if (voz.ramais?.some(r => String(r.ramal) === String(nome))) return `☎️ Ramal — ${nome}`;
    return nome;
  }

  renderResumoCompleto();

});

/* ================= VOLTAR ================= */
window.voltar = function () { window.location.href = "index.html"; };

/* =======================================================
   GERAR PDF PROFISSIONAL
   Usa jsPDF + autoTable com design de nível enterprise
======================================================= */
window.confirmarConfiguracao = async function () {
  const raw = localStorage.getItem("CONFIG_CADERNO");
  if (!raw || raw === "null") {
    document.getElementById("resumo").innerHTML = `
      <div class="resumo-card">⚠️ Nenhuma configuração válida encontrada.<br><br>
      Volte e preencha os dados corretamente.</div>`;
    return;
  }

  const dados = JSON.parse(raw);
  const voz   = dados.voz   || {};
  const chat  = dados.chat  || {};
  const cli   = dados.cliente || {};
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  const PW = 210, PH = 297;
  const ML = 14, MR = 14, MT = 14;
  const CW = PW - ML - MR;

  // ── PALETA ──────────────────────────────────────────
  const C = {
    primary:   [43,  54,  61],   // #2B363D slate
    accent:    [43,  54,  61],   // slate (borda tabela)
    accent2:   [43,  54,  61],
    accentDark:[30,  40,  46],
    success:   [16, 185, 129],
    white:     [255, 255, 255],
    black:     [14,  22,  25],
    text:      [15,  23,  42],
    textSoft:  [100, 116, 139],
    bgLight:   [240, 247, 255],
    bgGray:    [248, 250, 252],
    border:    [203, 213, 225],
    chipBg:    [224, 231, 255],
    chipText:  [55,  48, 163],
    gold:      [245, 158,  11],
    lime:      [206, 255,   0],   // ERA limão (detalhes)
  };

  const hoje = new Date().toLocaleDateString("pt-BR");
  let paginaAtual = 1;
  const paginas = [];

  // ── HELPERS ─────────────────────────────────────────
  function rgb(arr) { return { r: arr[0], g: arr[1], b: arr[2] }; }

  function setFill(arr)   { doc.setFillColor(...arr); }
  function setDraw(arr)   { doc.setDrawColor(...arr); }
  function setTextC(arr)  { doc.setTextColor(...arr); }
  function setFont(sz, style="normal") { doc.setFontSize(sz); doc.setFont("helvetica", style); }

  function pageFooter() {
    setFill(C.primary);
    doc.rect(0, PH - 10, PW, 10, "F");
    doc.setFillColor(206, 255, 0);
    doc.rect(0, PH - 10, PW, 0.8, "F");
    setTextC(C.white);
    setFont(7);
    doc.text("Caderno de Parametros  •  " + (cli.empresa || ""), ML, PH - 3.5);
    doc.setTextColor(206, 255, 0);
    setFont(7.5, "bold");
    doc.text(hoje + "   |   Pag. " + paginaAtual, PW - MR, PH - 3.5, { align: "right" });
  }

  function pageHeader() {
    if (paginaAtual === 1) return;
    setFill(C.primary);
    doc.rect(0, 0, PW, 12, "F");
    setTextC(C.white);
    setFont(8, "bold");
    doc.text("CADERNO DE PARAMETROS", ML, 7.5);
    doc.setTextColor(206, 255, 0);
    setFont(7, "normal");
    doc.text("SobreIP — Configuracao do Cliente", ML, 11.5);
    setTextC(C.white);
    setFont(7.5, "normal");
    doc.text(hoje, PW - MR, 7.5, { align: "right" });
  }

  function novaPage() {
    pageFooter();
    paginas.push(paginaAtual);
    doc.addPage();
    paginaAtual++;
    pageHeader();
    return 22; // y inicial após header
  }

  function checkY(y, needed = 20) {
    if (y + needed > PH - 16) return novaPage();
    return y;
  }

  // ── BARRA DE SEÇÃO ───────────────────────────────────
  function sectionBar(y, titulo, cor = C.primary) {
    y = checkY(y, 14);
    setFill(C.primary);
    doc.rect(ML, y, CW, 11, "F");
    doc.setFillColor(206, 255, 0);
    doc.rect(ML, y, 4, 11, "F");
    setTextC(C.white);
    setFont(10, "bold");
    doc.text(titulo, ML + 8, y + 7.5);
    return y + 15;
  }

  // ── TABELA GENÉRICA ──────────────────────────────────
  function tabelaAutoTable(y, head, body, colWidths, startY) {
    doc.autoTable({
      startY: startY || y,
      head:   [head],
      body:   body,
      margin: { left: ML, right: MR },
      headStyles: {
        fillColor:  C.primary,
        textColor:  C.white,
        fontStyle:  "bold",
        fontSize:   8,
        halign:     "center",
        cellPadding: 4,
      },
      bodyStyles: {
        fontSize:    8,
        textColor:   C.text,
        halign:      "center",
        cellPadding: 3.5,
      },
      alternateRowStyles: { fillColor: C.bgLight },
      columnStyles: colWidths
        ? Object.fromEntries(colWidths.map((w, i) => [i, { cellWidth: w }]))
        : {},
      tableLineColor: C.border,
      tableLineWidth: 0.3,
      didDrawPage: () => {
        pageHeader();
        paginaAtual = doc.getNumberOfPages();
      },
    });
    return doc.lastAutoTable.finalY + 6;
  }

  // ── CARD INFO ────────────────────────────────────────
  function cardInfo(y, pares) {
    y = checkY(y, pares.length * 9 + 4);
    const lw = CW * 0.34, vw = CW * 0.66;
    pares.forEach(([label, val], i) => {
      const bg = i % 2 === 0 ? C.bgGray : C.white;
      setFill(bg);
      doc.rect(ML, y, CW, 8, "F");
      setFill(C.bgLight);
      doc.rect(ML, y, lw, 8, "F");
      // borda esquerda accent
      setFill(C.accent);
      doc.rect(ML, y, 2, 8, "F");
      setDraw(C.border);
      doc.setLineWidth(0.3);
      doc.rect(ML, y, CW, 8, "S");
      setTextC(C.textSoft);
      setFont(8, "bold");
      doc.text(label, ML + 5, y + 5.5);
      setTextC(C.text);
      setFont(9, "normal");
      doc.text(String(val || "—"), ML + lw + 4, y + 5.5);
      y += 8;
    });
    return y + 4;
  }

  // ── CHIPS ────────────────────────────────────────────
  function chips(y, items) {
    if (!items || !items.length) return y;
    y = checkY(y, 12);
    let x = ML;
    const chipH = 7, padX = 4, gap = 3;
    items.forEach(item => {
      setFont(7, "bold");
      const tw = doc.getTextWidth(item) + padX * 2;
      if (x + tw > PW - MR) { x = ML; y += chipH + gap; y = checkY(y, 10); }
      setFill(C.chipBg);
      doc.roundedRect(x, y, tw, chipH, 2, 2, "F");
      setTextC(C.chipText);
      doc.text(item, x + padX, y + 5);
      x += tw + gap;
    });
    return y + chipH + 4;
  }

  // ── RAMAIS EM GRID ───────────────────────────────────
  function ramaisGrid(y, ramais) {
    const cols = 4, colW = CW / cols, rowH = 14;
    for (let i = 0; i < ramais.length; i += cols) {
      y = checkY(y, rowH + 2);
      const grupo = ramais.slice(i, i + cols);
      while (grupo.length < cols) grupo.push(null);
      grupo.forEach((r, j) => {
        const x = ML + j * colW;
        setFill(r ? C.bgLight : C.bgGray);
        doc.rect(x, y, colW, rowH, "F");
        setDraw(C.border);
        doc.setLineWidth(0.3);
        doc.rect(x, y, colW, rowH, "S");
        if (r) {
          setFill(C.accent);
          doc.rect(x, y, 2, rowH, "F");
          setTextC(C.primary);
          setFont(9, "bold");
          doc.text(`Ramal ${r.ramal}`, x + colW / 2, y + 5.5, { align: "center" });
          setTextC(C.textSoft);
          setFont(7, "normal");
          doc.text(`Senha: ${r.senha || "—"}`, x + colW / 2, y + 10.5, { align: "center" });
        }
      });
      y += rowH;
    }
    return y + 5;
  }

  // ════════════════════════════════════════════════════
  //  CAPA
  // ════════════════════════════════════════════════════
  // Fundo degradê azul profissional
  for (let i = 0; i < 50; i++) {
    const t = i / 50;
    const r = Math.round(5  + t * (13  - 5));
    const g = Math.round(11 + t * (71  - 11));
    const b = Math.round(24 + t * (161 - 24));
    doc.setFillColor(r, g, b);
    doc.rect(0, (PH / 50) * i, PW, PH / 50 + 0.5, "F");
  }
  // Círculos decorativos
  doc.setFillColor(14, 165, 233, 0.15);
  doc.circle(PW * 0.85, PH * 0.28, 30, "F");
  doc.circle(PW * 0.1,  PH * 0.72, 20, "F");
  doc.circle(PW * 0.9,  PH * 0.82, 12, "F");

  // Barra topo limão
  doc.setFillColor(206, 255, 0);
  doc.rect(0, 0, PW, 3, "F");

  // Círculo logo ERA
  doc.setFillColor(255, 255, 255, 0.08);
  doc.circle(PW / 2, PH * 0.32, 22, "F");
  doc.setFillColor(43, 54, 61);
  doc.circle(PW / 2, PH * 0.32, 18, "F");
  doc.setDrawColor(206, 255, 0);
  doc.setLineWidth(1.2);
  doc.circle(PW / 2, PH * 0.32, 18, "S");
  doc.setTextColor(206, 255, 0);
  setFont(14, "bold");
  doc.text("ERA", PW / 2, PH * 0.32 + 5, { align: "center" });

  setTextC(C.white);
  setFont(26, "bold");
  doc.text("Caderno de Parametros", PW / 2, PH * 0.46, { align: "center" });
  doc.setTextColor(206, 255, 0);
  setFont(12, "normal");
  doc.text("Resumo da Configuracao do Cliente", PW / 2, PH * 0.50, { align: "center" });

  doc.setDrawColor(206, 255, 0);
  doc.setLineWidth(1.5);
  doc.line(PW * 0.3, PH * 0.535, PW * 0.7, PH * 0.535);

  setTextC(C.white);
  setFont(18, "bold");
  doc.text(cli.empresa || "—", PW / 2, PH * 0.575, { align: "center" });

  // Infos centralizadas
  doc.setTextColor(176, 212, 241);
  setFont(10, "normal");
  let cy = PH * 0.615;
  [
    ["Dominio",   cli.dominio || "—"],
    ["CNPJ",      cli.cnpj    || "—"],
    ["Data",      hoje],
  ].forEach(([l, v]) => {
    doc.text(l + ":  " + v, PW / 2, cy, { align: "center" });
    cy += 7;
  });

  // Stats box
  const statsD = [
    ["Usuarios", String(voz.usuarios?.length || 0)],
    ["Ramais",   String(voz.ramais?.length   || 0)],
    ["Filas",    String(voz.filas?.length    || 0)],
    ["URAs",     String(voz.uras?.length     || 0)],
    ["Agentes",  String(voz.agentes?.length  || 0)],
    ["Chat",     dados.chat?.tipo ? "Sim" : "Nao"],
  ];
  const sw2 = (PW * 0.72) / statsD.length;
  const sx0 = PW * 0.14, sy2 = PH * 0.695;
  statsD.forEach(([lb, vl], i) => {
    const sx = sx0 + i * sw2;
    doc.setFillColor(255, 255, 255, 0.07);
    doc.roundedRect(sx + 1, sy2, sw2 - 3, 22, 3, 3, "F");
    doc.setDrawColor(206, 255, 0, 0.25);
    doc.setLineWidth(0.4);
    doc.roundedRect(sx + 1, sy2, sw2 - 3, 22, 3, 3, "S");
    doc.setTextColor(206, 255, 0);
    setFont(11, "bold");
    doc.text(vl, sx + sw2 / 2, sy2 + 13, { align: "center" });
    doc.setTextColor(255, 255, 255, 0.5);
    setFont(6.5, "normal");
    doc.text(lb, sx + sw2 / 2, sy2 + 19.5, { align: "center" });
  });

  doc.setFillColor(255, 255, 255, 0.1);
  doc.rect(0, PH - 14, PW, 14, "F");
  setTextC(C.white);
  setFont(8);
  doc.text("Documento gerado automaticamente pelo Caderno de Parametros SobreIP", PW / 2, PH - 5.5, { align: "center" });

  // ── Página 2: Índice ─────────────────────────────────
  doc.addPage();
  paginaAtual = 2;
  pageHeader();

  let y = 22;
  y = sectionBar(y, "INDICE DO DOCUMENTO", C.accent2);

  const modulos = [];
  if (cli)                        modulos.push("🏢  Dados do Cliente");
  if (voz.usuarios?.length)       modulos.push("👤  Usuários Web");
  if (voz.entradas?.length)       modulos.push("📞  Números de Entrada");
  if (voz.ramais?.length)         modulos.push("☎️   Ramais");
  if (voz.agentes?.length)        modulos.push("🎧  Agentes");
  if (voz.regras_tempo?.length)   modulos.push("⏰  Regras de Tempo");
  if (voz.grupo_ring?.length)     modulos.push("🔔  Grupo de Ring");
  if (voz.filas?.length)          modulos.push("📋  Filas");
  if (voz.uras?.length)           modulos.push("🎙️   URA");
  if (voz.pausas?.length)         modulos.push("⏸️   Pausas do Call Center");
  if (voz.pesquisas?.length)      modulos.push("⭐  Pesquisa de Satisfação");
  if (chat.tipo) {
    modulos.push("💬  Chat / Omnichannel");
    if (chat.usuarios?.length)      modulos.push("     └─ Usuários do Chat");
    if (chat.agentes?.length)       modulos.push("     └─ Agentes do Chat");
    if (chat.departamentos?.length) modulos.push("     └─ Departamentos");
  }

  modulos.forEach((m, i) => {
    y = checkY(y, 10);
    setFill(i % 2 === 0 ? C.bgLight : C.white);
    doc.rect(ML, y, CW, 8.5, "F");
    setFill(C.accent);
    doc.rect(ML, y, 3, 8.5, "F");
    setDraw(C.border);
    doc.setLineWidth(0.3);
    doc.rect(ML, y, CW, 8.5, "S");
    setTextC(C.text);
    setFont(9, "normal");
    doc.text(m, ML + 7, y + 6);
    y += 8.5;
  });

  pageFooter();

  // ── NOVA PÁGINA: CONTEÚDO ────────────────────────────
  doc.addPage();
  paginaAtual++;
  pageHeader();
  y = 22;

  // ── CLIENTE ──────────────────────────────────────────
  if (cli.empresa || cli.dominio || cli.cnpj) {
    y = sectionBar(y, "DADOS DO CLIENTE", C.primary);
    y = cardInfo(y, [
      ["Empresa",  cli.empresa  || "—"],
      ["Domínio",  cli.dominio  || "—"],
      ["CNPJ",     cli.cnpj     || "—"],
    ]);
  }

  // ── USUÁRIOS WEB ─────────────────────────────────────
  if (voz.usuarios?.length) {
    y = checkY(y, 30);
    y = sectionBar(y, "USUARIOS WEB", C.primary);
    const cols = [CW*0.22, CW*0.27, CW*0.21, CW*0.25, CW*0.05];
    const rows = voz.usuarios.map(u => [
      u.nome || "—", u.email || "—", u.senha || "—", u.permissao || "—",
      u.agente_callcenter ? "✔" : ""
    ]);
    y = tabelaAutoTable(y, ["Nome","E-mail","Senha","Permissão","Agente"], rows, cols);
  }

  // ── ENTRADAS ─────────────────────────────────────────
  if (voz.entradas?.length) {
    y = checkY(y, 20);
    y = sectionBar(y, "NUMEROS DE ENTRADA", C.primary);
    y = chips(y, voz.entradas.map(e => e.numero || "—"));
  }

  // ── RAMAIS ───────────────────────────────────────────
  if (voz.ramais?.length) {
    y = checkY(y, 30);
    y = sectionBar(y, "RAMAIS", C.primary);
    y = ramaisGrid(y, voz.ramais);
  }

  // ── AGENTES ──────────────────────────────────────────
  if (voz.agentes?.length) {
    y = checkY(y, 30);
    y = sectionBar(y, "AGENTES", C.primary);
    const cols = [CW*0.45, CW*0.32, CW*0.23];
    const rows = voz.agentes.map(a => [
      a.nome || "—", a.ramal || "—", a.multiskill ? "✔ Multiskill" : "—"
    ]);
    y = tabelaAutoTable(y, ["Nome","Ramal","Multiskill"], rows, cols);
  }

  // ── REGRAS DE TEMPO ──────────────────────────────────
  if (voz.regras_tempo?.length) {
    y = checkY(y, 30);
    y = sectionBar(y, "REGRAS DE TEMPO", C.primary);
    voz.regras_tempo.forEach(r => {
      const faixas = r.faixas?.length ? r.faixas
        : (r.hora_inicio ? [{ inicio: r.hora_inicio, fim: r.hora_fim }] : []);
      const faixasStr = faixas.map(f => `${f.inicio || "--:--"} às ${f.fim || "--:--"}`).join("  |  ") || "—";
      y = checkY(y, 40);
      y = cardInfo(y, [
        ["Nome",     r.nome || "—"],
        ["Dias",     (r.dias || []).join(", ") || "—"],
        ["Horários", faixasStr],
      ]);
    });
  }

  // ── GRUPO DE RING ────────────────────────────────────
  if (voz.grupo_ring?.length) {
    y = checkY(y, 30);
    y = sectionBar(y, "GRUPO DE RING", C.primary);
    voz.grupo_ring.forEach(g => {
      y = checkY(y, 40);
      y = cardInfo(y, [
        ["Nome",       g.nome || "—"],
        ["Estratégia", g.estrategia || "—"],
        ["Ramais",     (g.ramais || []).join(", ") || "—"],
      ]);
    });
  }

  // ── FILAS ────────────────────────────────────────────
  if (voz.filas?.length) {
    y = checkY(y, 30);
    y = sectionBar(y, "FILAS", C.primary);
    const cols = [CW*0.38, CW*0.62];
    const rows = voz.filas.map(f => [f.nome || "—", (f.agentes || []).join(", ")]);
    y = tabelaAutoTable(y, ["Fila","Agentes"], rows, cols);
  }

  // ── URA ──────────────────────────────────────────────
  if (voz.uras?.length) {
    y = checkY(y, 30);
    y = sectionBar(y, "URA - ATENDIMENTO AUTOMATICO", C.primary);
    voz.uras.forEach(u => {
      y = checkY(y, 30);
      setTextC(C.primary);
      setFont(10, "bold");
      doc.text(u.nome || "—", ML, y);
      y += 5;
      if (u.mensagem) {
        setTextC(C.textSoft);
        setFont(8, "normal");
        doc.text(u.mensagem, ML, y);
        y += 6;
      }
      const opcoes = u.opcoes || [];
      if (opcoes.length) {
        const cols = [CW*0.12, CW*0.40, CW*0.48];
        const rows = opcoes.map(o => [o.tecla || "—", o.destino || "—", o.descricao || "—"]);
        y = tabelaAutoTable(y, ["Tecla","Destino","Descrição"], rows, cols);
      }
      y += 3;
    });
  }

  // ── PAUSAS ───────────────────────────────────────────
  if (voz.pausas?.length) {
    y = checkY(y, 30);
    y = sectionBar(y, "PAUSAS DO CALL CENTER", C.primary);
    voz.pausas.forEach(p => {
      y = checkY(y, 20);
      setTextC(C.primary);
      setFont(10, "bold");
      doc.text(`Grupo: ${p.grupo || "—"}`, ML, y);
      y += 5;
      const itens = p.itens || [];
      if (itens.length) {
        const cols = [CW*0.6, CW*0.4];
        const rows = itens.map(i => [i.nome || "—", i.tempo || "—"]);
        y = tabelaAutoTable(y, ["Nome da Pausa","Tempo"], rows, cols);
      }
    });
  }

  // ── PESQUISA ─────────────────────────────────────────
  if (voz.pesquisas?.length) {
    y = checkY(y, 40);
    y = sectionBar(y, "PESQUISA DE SATISFACAO", C.primary);
    voz.pesquisas.forEach(p => {
      y = checkY(y, 50);
      y = cardInfo(y, [
        ["Nome",         p.nome || "—"],
        ["Introdução",   p.introducao || "—"],
        ["Pergunta",     p.pergunta || "—"],
        ["Encerramento", p.encerramento || "—"],
      ]);
      const respostas = p.respostas || [];
      if (respostas.length) {
        const cols = [CW*0.2, CW*0.8];
        const rows = respostas.map(r => [String(r.nota ?? "—"), r.descricao || "—"]);
        y = tabelaAutoTable(y, ["Nota","Descrição"], rows, cols);
      }
    });
  }

  // ── CHAT ─────────────────────────────────────────────
  if (chat.tipo) {
    doc.addPage();
    paginaAtual++;
    pageHeader();
    y = 22;

    y = sectionBar(y, "CHAT / OMNICHANNEL", C.accent2);

    const tipoLabel = chat.tipo === "qr" ? "Integração via QR Code" : "Integração via API Oficial";
    const paresChat = [["Tipo", tipoLabel]];
    if (chat.tipo === "api") {
      paresChat.push(["API",   chat.api   || "—"]);
      paresChat.push(["Conta", chat.conta || "—"]);
    } else {
      paresChat.push(["Número WhatsApp", chat.conta || "—"]);
    }
    y = cardInfo(y, paresChat);

    if (chat.canais?.length) {
      y = checkY(y, 20);
      setTextC(C.primary);
      setFont(9, "bold");
      doc.text("Canais integrados:", ML, y);
      y += 4;
      y = chips(y, chat.canais);
    }

    if (chat.usuarios?.length) {
      y = checkY(y, 30);
      y = sectionBar(y, "USUARIOS DO CHAT", C.accent2);
      const cols = [CW*0.25, CW*0.30, CW*0.22, CW*0.23];
      const rows = chat.usuarios.map(u => [u.nome || "—", u.email || "—", u.senha || "—", u.permissao || "—"]);
      y = tabelaAutoTable(y, ["Nome","E-mail","Senha","Permissão"], rows, cols);
    }

    if (chat.agentes?.length) {
      y = checkY(y, 30);
      y = sectionBar(y, "AGENTES DO CHAT", C.accent2);
      const cols = [CW*0.45, CW*0.55];
      const rows = chat.agentes.map(a => [a.nome || "—", (a.departamentos || []).join(", ") || "—"]);
      y = tabelaAutoTable(y, ["Agente","Departamentos"], rows, cols);
    }

    if (chat.departamentos?.length) {
      y = checkY(y, 30);
      y = sectionBar(y, "DEPARTAMENTOS", C.accent2);
      const cols = [CW*0.45, CW*0.55];
      const rows = chat.departamentos.map(d => [d.nome || "—", (d.agentes || []).join(", ") || "—"]);
      y = tabelaAutoTable(y, ["Departamento","Agentes"], rows, cols);
    }
  }

  // ── FOOTER ÚLTIMA PÁGINA ─────────────────────────────
  pageFooter();

  // ── SALVA ────────────────────────────────────────────
  doc.save("caderno-parametros.pdf");

  // ── ENVIA PARA API ────────────────────────────────────
  try {
    const res = await fetch("/app/caderno/api/salvar.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });
    const texto = await res.text();
    if (!res.ok) throw new Error(`Erro ${res.status}: ${texto}`);
    let r;
    try { r = JSON.parse(texto); } catch { throw new Error(`Resposta não é JSON: ${texto}`); }
    console.log("API:", r);
  } catch (e) {
    console.error("Erro ao enviar para API", e);
  }
};

/* ================= TEMA ================= */
(function initTema() {
  const btn = document.getElementById("toggleTheme");
  if (!btn) return;
  const temaSalvo = localStorage.getItem("tema");
  if (temaSalvo === "light") {
    document.body.classList.add("light");
    btn.textContent = "🌙";
  } else {
    btn.textContent = "☀️";
  }
  btn.addEventListener("click", () => {
    document.body.classList.toggle("light");
    const isLight = document.body.classList.contains("light");
    localStorage.setItem("tema", isLight ? "light" : "dark");
    btn.textContent = isLight ? "🌙" : "☀️";
  });
})();
