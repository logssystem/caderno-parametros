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
document.addEventListener("DOMContentLoaded", () => {
  const resumo = document.getElementById("resumo");
  if (!resumo) return;

  const raw = localStorage.getItem("CONFIG_CADERNO");
  if (!raw || raw === "null") {
    resumo.innerHTML = `<div class="resumo-card">⚠️ Nenhum dado encontrado.<br><br>Volte e preencha a configuração antes de acessar o resumo.</div>`;
    return;
  }

  let dados = {};
  try { dados = JSON.parse(raw) || {}; } catch (e) { dados = {}; }

  resumo.innerHTML = "";
  const voz = dados.voz || {};

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

  if (dados.cliente) {
    resumo.innerHTML += `
      <section class="resumo-bloco"><h2>🏢 Cliente</h2>
        <div class="resumo-card">
          <div><strong>Empresa:</strong> ${dados.cliente.empresa || "-"}</div>
          <div><strong>Domínio:</strong> ${dados.cliente.dominio || "-"}</div>
          <div><strong>CNPJ:</strong> ${dados.cliente.cnpj || "-"}</div>
        </div>
      </section>`;
  }

  if (voz.usuarios?.length) {
    resumo.innerHTML += `
      <section class="resumo-bloco"><h2>👤 Usuários Web</h2>
        <div class="resumo-grid">
          ${voz.usuarios.map(u => `<div class="resumo-card">
            <div class="titulo">${u.nome}</div>
            <div>📧 ${u.email || "-"}</div>
            <div>🔐 Senha: ${u.senha || "-"}</div>
            <div>🛡 Permissão: ${u.permissao || "-"}</div>
            ${u.agente ? `<span class="badge">Agente</span>` : ""}
          </div>`).join("")}
        </div>
      </section>`;
  }

  if (voz.entradas?.length) {
    resumo.innerHTML += `
      <section class="resumo-bloco"><h2>📞 Entradas / Números</h2>
        <div class="resumo-grid">
          ${voz.entradas.map(e => `<div class="resumo-card"><div class="titulo">${e.numero}</div></div>`).join("")}
        </div>
      </section>`;
  }

  if (voz.ramais?.length) {
    resumo.innerHTML += `
      <section class="resumo-bloco"><h2>☎️ Ramais</h2>
        <div class="resumo-grid">
          ${voz.ramais.map(r => `<div class="resumo-card">
            <div class="titulo">Ramal ${r.ramal}</div>
            <div>🔐 ${r.senha || "-"}</div>
          </div>`).join("")}
        </div>
      </section>`;
  }

  if (voz.agentes?.length) {
    resumo.innerHTML += `
      <section class="resumo-bloco"><h2>🎧 Agentes</h2>
        <div class="resumo-grid">
          ${voz.agentes.map(a => `<div class="resumo-card">
            <div class="titulo">${a.nome}</div>
            <div>📞 Ramal: ${a.ramal || "-"}</div>
            ${a.multiskill ? `<span class="badge">Multiskill</span>` : ""}
          </div>`).join("")}
        </div>
      </section>`;
  }

  if (voz.regras_tempo?.length) {
    resumo.innerHTML += `
      <section class="resumo-bloco"><h2>⏰ Regras de Tempo</h2>
        <div class="resumo-grid">
          ${voz.regras_tempo.map(r => `<div class="resumo-card">
            <div class="titulo">${r.nome}</div>
            <div><strong>Dias:</strong> ${(r.dias || []).join(", ")}</div>
            <div><strong>Horário:</strong> ${r.hora_inicio || "-"} às ${r.hora_fim || "-"}</div>
          </div>`).join("")}
        </div>
      </section>`;
  }

  if (voz.grupo_ring?.length) {
    resumo.innerHTML += `
      <section class="resumo-bloco"><h2>🔔 Grupo de Ring</h2>
        <div class="resumo-grid">
          ${voz.grupo_ring.map(g => `<div class="resumo-card">
            <div class="titulo">${g.nome}</div>
            <div><strong>Estratégia:</strong> ${g.estrategia || "-"}</div>
            ${g.ramais?.length ? `<div class="lista">${g.ramais.map(r => `<span class="chip">${r}</span>`).join("")}</div>` : ""}
          </div>`).join("")}
        </div>
      </section>`;
  }

  if (voz.filas?.length) {
    resumo.innerHTML += `
      <section class="resumo-bloco"><h2>📞 Filas</h2>
        <div class="resumo-grid">
          ${voz.filas.map(f => `<div class="resumo-card">
            <div class="titulo">${f.nome}</div>
            ${f.agentes?.length ? `<div class="lista">${f.agentes.map(a => `<span class="chip">${a}</span>`).join("")}</div>` : ""}
          </div>`).join("")}
        </div>
      </section>`;
  }

  if (voz.uras?.length) {
    resumo.innerHTML += `
      <section class="resumo-bloco"><h2>🎙️ URA</h2>
        <div class="resumo-grid">
          ${voz.uras.map(u => {
            const opcoes = u.opcoes || [];
            return `<div class="resumo-card">
              <div class="titulo">${u.nome}</div>
              <div>${u.mensagem || ""}</div>
              <ul>${opcoes.map(o => `<li>Tecla ${o.tecla} → ${identificarDestino(o.destino)}</li>`).join("")}</ul>
            </div>`;
          }).join("")}
        </div>
      </section>`;
  }

  if (voz.pausas?.length) {
    resumo.innerHTML += `
      <section class="resumo-bloco"><h2>⏸️ Pausas</h2>
        <div class="resumo-grid">
          ${voz.pausas.map(p => `<div class="resumo-card">
            <div class="titulo">${p.grupo}</div>
            <div class="lista">${(p.itens || []).map(i => `<span class="chip">${i.nome} (${i.tempo})</span>`).join("")}</div>
          </div>`).join("")}
        </div>
      </section>`;
  }

  if (voz.pesquisas?.length) {
    resumo.innerHTML += `
      <section class="resumo-bloco"><h2>⭐ Pesquisa de Satisfação</h2>
        <div class="resumo-grid">
          ${voz.pesquisas.map(p => `<div class="resumo-card">
            <div class="titulo">${p.nome}</div>
            ${p.introducao ? `<div><strong>Áudio inicial:</strong> ${p.introducao}</div>` : ""}
            <div style="margin-top:6px;"><strong>Pergunta:</strong><br>${p.pergunta || "-"}</div>
            <ul style="margin-top:8px;">${(p.respostas || []).map(r => `<li>${r.nota} - ${r.descricao}</li>`).join("")}</ul>
            ${p.encerramento ? `<div style="margin-top:8px;"><strong>Áudio final:</strong> ${p.encerramento}</div>` : ""}
          </div>`).join("")}
        </div>
      </section>`;
  }

  if (dados.chat && (dados.chat.tipo || dados.chat.usuarios?.length || dados.chat.agentes?.length)) {
    resumo.innerHTML += `<section class="resumo-bloco modulo-titulo"><h1>💬 Chat / Omnichannel</h1></section>`;
  }

  window.renderResumoChat(resumo, dados);
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
    primary:   [13,  71, 161],   // azul escuro
    accent:    [14, 165, 233],   // azul vibrante
    accent2:   [99, 102, 241],   // índigo
    success:   [16, 185, 129],   // verde
    white:     [255, 255, 255],
    text:      [15,  23,  42],
    textSoft:  [100, 116, 139],
    bgLight:   [240, 247, 255],
    bgGray:    [248, 250, 252],
    border:    [203, 213, 225],
    chipBg:    [224, 231, 255],
    chipText:  [55,  48, 163],
    gold:      [245, 158,  11],
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
    setTextC(C.white);
    setFont(7);
    doc.text(`Caderno de Parâmetros  •  ${cli.empresa || ""}`, ML, PH - 3.5);
    doc.text(`Página ${paginaAtual}`, PW - MR, PH - 3.5, { align: "right" });
  }

  function pageHeader() {
    if (paginaAtual === 1) return;
    setFill(C.primary);
    doc.rect(0, 0, PW, 12, "F");
    setTextC(C.white);
    setFont(8, "bold");
    doc.text("CADERNO DE PARÂMETROS", ML, 7.5);
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
    setFill(cor);
    doc.rect(ML, y, CW, 11, "F");
    setFill(C.accent);
    doc.rect(ML, y, 3, 11, "F");
    setTextC(C.white);
    setFont(10, "bold");
    doc.text(titulo, ML + 6, y + 7.5);
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
  // Fundo degradê
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

  // Barra topo
  setFill(C.accent);
  doc.rect(0, 0, PW, 3, "F");

  // Círculo logo
  doc.setFillColor(255, 255, 255, 0.08);
  doc.circle(PW / 2, PH * 0.32, 22, "F");
  setFill(C.accent);
  doc.circle(PW / 2, PH * 0.32, 18, "F");
  setTextC(C.white);
  setFont(20, "bold");
  doc.text("CP", PW / 2, PH * 0.32 + 7, { align: "center" });

  // Título
  setTextC(C.white);
  setFont(26, "bold");
  doc.text("Caderno de Parâmetros", PW / 2, PH * 0.46, { align: "center" });
  doc.setTextColor(176, 212, 241);
  setFont(12, "normal");
  doc.text("Resumo da Configuração do Cliente", PW / 2, PH * 0.50, { align: "center" });

  // Divisor dourado
  setDraw(C.accent);
  doc.setLineWidth(1.5);
  doc.line(PW * 0.3, PH * 0.535, PW * 0.7, PH * 0.535);

  // Nome empresa
  setTextC(C.white);
  setFont(18, "bold");
  doc.text(cli.empresa || "—", PW / 2, PH * 0.575, { align: "center" });

  // Infos
  doc.setTextColor(176, 212, 241);
  setFont(10, "normal");
  let cy = PH * 0.615;
  [
    ["Domínio", cli.dominio || "—"],
    ["CNPJ",    cli.cnpj    || "—"],
    ["Data",    hoje],
  ].forEach(([l, v]) => {
    doc.text(`${l}:  ${v}`, PW / 2, cy, { align: "center" });
    cy += 7;
  });

  // Rodapé capa
  doc.setFillColor(255, 255, 255, 0.1);
  doc.rect(0, PH - 14, PW, 14, "F");
  setTextC(C.white);
  setFont(8);
  doc.text("Documento gerado automaticamente pelo Caderno de Parâmetros SobreIP", PW / 2, PH - 5.5, { align: "center" });

  // ── Página 2: Índice ─────────────────────────────────
  doc.addPage();
  paginaAtual = 2;
  pageHeader();

  let y = 22;
  y = sectionBar(y, "ÍNDICE DO DOCUMENTO", C.accent2);

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
    y = sectionBar(y, "USUÁRIOS WEB", C.primary);
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
    y = sectionBar(y, "NÚMEROS DE ENTRADA", C.primary);
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
      y = checkY(y, 40);
      y = cardInfo(y, [
        ["Nome",    r.nome || "—"],
        ["Dias",    (r.dias || []).join(", ") || "—"],
        ["Início",  r.hora_inicio || "—"],
        ["Fim",     r.hora_fim    || "—"],
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
    y = sectionBar(y, "URA — ATENDIMENTO AUTOMÁTICO", C.primary);
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
    y = sectionBar(y, "PESQUISA DE SATISFAÇÃO", C.primary);
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
      y = sectionBar(y, "USUÁRIOS DO CHAT", C.accent2);
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
