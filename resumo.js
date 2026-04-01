/* ======================================================
   RESUMO – CHAT
====================================================== */
window.renderResumoChat = function (container, data) {
  if (!container) return;
  if (!data.chat || !data.chat.tipo) return;
  const chat=data.chat,usuarios=chat.usuarios||[],agentes=chat.agentes||[];
  let html="";const section=document.createElement("section");section.className="resumo-bloco";
  html+=`<h2>💬 Chat / Omnichannel</h2>`;
  if(chat.tipo==="qr"){html+=`<div class="resumo-card"><div><strong>Tipo:</strong> QR Code</div><div><strong>Número:</strong> ${chat.conta||"-"}</div></div>`;}
  else if(chat.tipo==="api"){html+=`<div class="resumo-card"><div><strong>Tipo:</strong> API Oficial</div><div><strong>API:</strong> ${chat.api||"-"}</div><div><strong>Conta:</strong> ${chat.conta||"-"}</div></div>`;}
  if(chat.canais?.length){html+=`<div class="resumo-card"><div class="titulo">Canais</div><div class="lista">${chat.canais.map(c=>`<span class="chip">${c}</span>`).join("")}</div></div>`;}
  if(usuarios.length){html+=`<h3>👤 Usuários</h3><div class="resumo-grid">${usuarios.map(u=>`<div class="resumo-card"><div class="titulo">${u.nome}</div><div>📧 ${u.email||"-"}</div><div>🔐 ${u.senha||"-"}</div><div>🛡 ${u.permissao||"-"}</div></div>`).join("")}</div>`;}
  if(agentes.length){html+=`<h3>🎧 Agentes</h3><div class="resumo-grid">${agentes.map(a=>{const deps=Array.isArray(a.departamentos)?a.departamentos:[];return`<div class="resumo-card"><div class="titulo">${a.nome}</div>${deps.length?`<div class="lista">${deps.map(d=>`<span class="chip">${d}</span>`).join("")}</div>`:`<div class="texto-secundario">Sem departamento</div>`}</div>`;}).join("")}</div>`;}
  if(chat.departamentos?.length){html+=`<h3>🏢 Departamentos</h3><div class="resumo-grid">${chat.departamentos.map(dep=>`<div class="resumo-card"><div class="titulo">${dep.nome}</div>${dep.agentes?.length?`<div class="lista">${dep.agentes.map(a=>`<span class="chip">${a}</span>`).join("")}</div>`:`<div class="texto-secundario">Sem agentes</div>`}</div>`).join("")}</div>`;}
  section.innerHTML=html;container.appendChild(section);
};

/* ======================================================
   HELPER: formatar destino URA (prefixado)
====================================================== */
function formatarDestinoDisplay(valor) {
  if (!valor) return "—";
  if (!valor.includes("::")) return valor; // compatibilidade antiga
  const [tipo, nome] = valor.split("::");
  switch(tipo) {
    case "fila":   return `${nome} (Fila)`;
    case "grupo":  return `${nome} (Grupo)`;
    case "ramal":  return nome;
    case "ura":    return nome;
    case "regra":  return nome;
    default:       return nome;
  }
}

/* ======================================================
   RESUMO – ESTADO
====================================================== */
let _dadosResumo={},_modoCompacto=false,_paginasState={};
const PAGE_SIZE=9;

window.toggleModoResumo=function(){
  _modoCompacto=!_modoCompacto;
  const btn=document.getElementById("btnModoResumo");
  const label=btn?.querySelector(".modo-label"),icone=btn?.querySelector(".modo-icone");
  if(label)label.textContent=_modoCompacto?"Compacto":"Completo";
  if(icone)icone.textContent=_modoCompacto?"🗂️":"📋";
  document.querySelectorAll(".campo-sensivel").forEach(el=>{el.style.display=_modoCompacto?"none":"";});
  document.querySelectorAll(".resumo-card").forEach(card=>{card.classList.toggle("modo-compacto",_modoCompacto);});
};
window.copiarCampo=function(texto,btn){
  navigator.clipboard.writeText(texto).then(()=>{const orig=btn.innerHTML;btn.innerHTML="✓";btn.classList.add("copiado");setTimeout(()=>{btn.innerHTML=orig;btn.classList.remove("copiado");},1500);}).catch(()=>{const ta=document.createElement("textarea");ta.value=texto;document.body.appendChild(ta);ta.select();document.execCommand("copy");document.body.removeChild(ta);btn.innerHTML="✓";setTimeout(()=>{btn.innerHTML="⧉";},1200);});
};
function btnCopiar(texto){if(!texto||texto==="-"||texto==="—")return "";const safe=texto.replace(/"/g,"&quot;").replace(/'/g,"&#39;");return `<button class="btn-copiar" onclick="copiarCampo('${safe}',this)" title="Copiar">⧉</button>`;}
function campoCopia(label,valor,sensivel=false){const cls=sensivel?' class="campo-sensivel"':"";return `<div${cls}><strong>${label}:</strong> <span>${valor||"—"}</span>${btnCopiar(valor)}</div>`;}
window.limparBusca=function(){const inp=document.getElementById("resumoBusca");if(inp){inp.value="";inp.dispatchEvent(new Event("input"));}};
function initBusca(){
  const inp=document.getElementById("resumoBusca"),clear=document.getElementById("btnClearBusca");
  if(!inp)return;
  inp.addEventListener("input",()=>{
    const q=inp.value.trim().toLowerCase();
    if(clear)clear.style.display=q?"block":"none";
    document.querySelectorAll(".resumo-card").forEach(card=>{card.style.display=(!q||card.textContent.toLowerCase().includes(q))?"":"none";});
    document.querySelectorAll(".resumo-bloco").forEach(bloco=>{if(bloco.classList.contains("modulo-titulo"))return;const cards=bloco.querySelectorAll(".resumo-card");const vis=[...cards].some(c=>c.style.display!=="none");bloco.style.display=(!q||vis)?"":"none";});
  });
}
function renderPaginado(itens,secaoId,renderFn){
  if(!_paginasState[secaoId])_paginasState[secaoId]=1;
  const total=Math.ceil(itens.length/PAGE_SIZE),pagina=Math.min(_paginasState[secaoId],total);
  const slice=itens.slice((pagina-1)*PAGE_SIZE,pagina*PAGE_SIZE);
  let html=`<div class="resumo-grid">${slice.map(renderFn).join("")}</div>`;
  if(total>1){html+=`<div class="paginacao">`;if(pagina>1)html+=`<button class="btn-pag" onclick="irPagina('${secaoId}',${pagina-1})">‹ Ant.</button>`;html+=`<span class="pag-info">Pág. ${pagina} / ${total} <span class="pag-total">(${itens.length} itens)</span></span>`;if(pagina<total)html+=`<button class="btn-pag" onclick="irPagina('${secaoId}',${pagina+1})">Próx. ›</button>`;html+=`</div>`;}
  return html;
}
window.irPagina=function(secaoId,pagina){_paginasState[secaoId]=pagina;renderResumoCompleto();setTimeout(()=>{const el=document.getElementById(secaoId);if(el)el.scrollIntoView({behavior:"smooth",block:"start"});},60);};
function buildNav(secoes){
  const lista=document.getElementById("navLista");if(!lista)return;
  lista.innerHTML=secoes.map(s=>`<li><a class="nav-link" href="#${s.id}" onclick="navClick('${s.id}',event)"><span class="nav-icone">${s.icone}</span><span class="nav-nome">${s.nome}</span>${s.count?`<span class="nav-badge">${s.count}</span>`:""}</a></li>`).join("");
  const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){const id=e.target.id;document.querySelectorAll(".nav-link").forEach(l=>{l.classList.toggle("ativo",l.getAttribute("href")===`#${id}`);});}});},{rootMargin:"-30% 0px -60% 0px"});
  secoes.forEach(s=>{const el=document.getElementById(s.id);if(el)obs.observe(el);});
}
window.navClick=function(id,e){e.preventDefault();const el=document.getElementById(id);if(el)el.scrollIntoView({behavior:"smooth",block:"start"});};
function buildAlertas(dados){
  const voz=dados.voz||{},alertas=[];
  (voz.agentes||[]).forEach(a=>{if(!a.ramal)alertas.push({tipo:"erro",msg:`Agente <strong>${a.nome}</strong> sem ramal vinculado`});});
  (voz.filas||[]).forEach(f=>{if(!f.agentes?.length)alertas.push({tipo:"aviso",msg:`Fila <strong>${f.nome}</strong> sem agentes configurados`});});
  (voz.uras||[]).forEach(u=>{(u.opcoes||[]).forEach(o=>{if(!o.destino)alertas.push({tipo:"aviso",msg:`URA <strong>${u.nome}</strong> — tecla ${o.tecla} sem destino definido`});});});
  (voz.grupo_ring||[]).forEach(g=>{if(!g.ramais?.length)alertas.push({tipo:"aviso",msg:`Grupo de Ring <strong>${g.nome}</strong> sem ramais`});});
  (voz.usuarios||[]).forEach(u=>{if(!u.permissao)alertas.push({tipo:"info",msg:`Usuário <strong>${u.nome}</strong> sem permissão definida`});});
  const dom=dados.cliente?.dominio||"";
  if(dom&&!dom.endsWith(".sobreip.com.br"))alertas.push({tipo:"erro",msg:`Domínio <strong>${dom}</strong> não termina com .sobreip.com.br`});
  const painel=document.getElementById("painelAlertas");if(!painel)return;
  if(!alertas.length){painel.style.display="none";return;}
  const icons={erro:"🔴",aviso:"🟡",info:"🔵"};
  const erros=alertas.filter(a=>a.tipo==="erro").length,avisos=alertas.filter(a=>a.tipo==="aviso").length;
  painel.style.display="block";
  painel.innerHTML=`<div class="alertas-header"><span class="alertas-titulo">⚠️ Verificações automáticas</span><div class="alertas-resumo">${erros?`<span class="badge-alerta erro">${erros} erro${erros>1?"s":""}</span>`:""} ${avisos?`<span class="badge-alerta aviso">${avisos} aviso${avisos>1?"s":""}</span>`:""}</div><button class="alertas-toggle" onclick="this.closest('.painel-alertas').classList.toggle('expandido')">▾</button></div><ul class="alertas-lista">${alertas.map(a=>`<li class="alerta-item alerta-${a.tipo}">${icons[a.tipo]} ${a.msg}</li>`).join("")}</ul>`;
}

/* ======================================================
   RENDER RESUMO HTML
====================================================== */
function renderResumoCompleto(){
  const resumo=document.getElementById("resumo");if(!resumo)return;
  const dados=_dadosResumo,voz=dados.voz||{},cli=dados.cliente||{};
  resumo.innerHTML="";const secoes=[];
  const _EDIT_MAP={"sec-cliente":"#empresaCliente","sec-usuarios":"#listaUsuariosWeb","sec-entradas":"#listaEntradas","sec-ramais":"#listaRings","sec-agentes":"#listaAgentes","sec-regras":"#listaRegrasTempo","sec-grupo-ring":"#listaGrupoRing","sec-filas":"#listaFilas","sec-ura":"#listaURAs","sec-pausas":"#pausasConteudo","sec-pesquisa":"#pesquisaSatisfacaoConteudo","sec-chat-config":"#modulochat","sec-chat-usuarios":"#listaUsuariosChat","sec-chat-agentes":"#listaAgentesChat","sec-chat-depto":"#listaDepartamentosChat","sec-fluxo":"#modulochat"};
  function secao(id,icone,titulo,count){secoes.push({id,icone,nome:titulo,count});const ancora=_EDIT_MAP[id]||"";const btnEdit=ancora?`<button class="btn-editar-secao" onclick="editarSecao('${ancora}')">✏️ Editar</button>`:"";return`<section class="resumo-bloco" id="${id}"><h2 class="resumo-secao-titulo"><span>${icone}</span> ${titulo}${count?`<span class="secao-count">${count}</span>`:`<span style="flex:1"></span>`}${btnEdit}</h2>`;}
  function fs(){return`</section>`;}
  function idDest(valor){return formatarDestinoDisplay(valor);}
  let html="";
  const temVoz=voz.usuarios?.length||voz.ramais?.length||voz.agentes?.length||voz.filas?.length;
  if(temVoz)html+=`<div class="modulo-titulo"><h1>📞 Voz / Call Center</h1></div>`;
  if(cli.empresa||cli.dominio||cli.cnpj){html+=secao("sec-cliente","🏢","Cliente");html+=`<div class="resumo-card">${campoCopia("Empresa",cli.empresa)}${campoCopia("Domínio",cli.dominio)}${campoCopia("CNPJ / CPF",cli.cnpj)}</div>`;html+=fs();}
  if(voz.usuarios?.length){html+=secao("sec-usuarios","👤","Usuários Web",voz.usuarios.length);html+=renderPaginado(voz.usuarios,"sec-usuarios",u=>`<div class="resumo-card"><div class="titulo">${u.nome}</div><div>📧 ${u.email||"—"}${btnCopiar(u.email)}</div><div class="campo-sensivel">🔐 ${u.senha||"—"}${btnCopiar(u.senha)}</div><div class="campo-sensivel">🛡 ${u.permissao||"—"}</div>${u.agente_callcenter||u.agente?`<span class="badge">Agente CC</span>`:""} ${u.agente_omnichannel?`<span class="badge badge-omni">Agente Omni</span>`:""}</div>`);html+=fs();}
  if(voz.entradas?.length){html+=secao("sec-entradas","📞","Entradas / Números",voz.entradas.length);html+=`<div class="resumo-grid">${voz.entradas.map(e=>`<div class="resumo-card"><div class="titulo">${e.numero}${btnCopiar(e.numero)}</div></div>`).join("")}</div>`;html+=fs();}
  if(voz.ramais?.length){html+=secao("sec-ramais","☎️","Ramais",voz.ramais.length);html+=renderPaginado(voz.ramais,"sec-ramais",r=>`<div class="resumo-card"><div class="titulo">Ramal ${r.ramal}${btnCopiar(r.ramal)}</div><div class="campo-sensivel">🔐 ${r.senha||"—"}${btnCopiar(r.senha)}</div></div>`);html+=fs();}
  if(voz.agentes?.length){html+=secao("sec-agentes","🎧","Agentes",voz.agentes.length);html+=renderPaginado(voz.agentes,"sec-agentes",a=>`<div class="resumo-card ${!a.ramal?"card-alerta":""}"><div class="titulo">${a.nome}</div><div>☎️ ${a.ramal||'<span class="sem-ramal">⚠ sem ramal</span>'}${btnCopiar(a.ramal)}</div>${a.multiskill?`<span class="badge badge-multi">Multiskill</span>`:""}</div>`);html+=fs();}
  if(voz.regras_tempo?.length){html+=secao("sec-regras","⏰","Regras de Tempo",voz.regras_tempo.length);html+=`<div class="resumo-grid">${voz.regras_tempo.map(r=>{const faixas=r.faixas?.length?r.faixas:(r.hora_inicio?[{inicio:r.hora_inicio,fim:r.hora_fim}]:[]);return`<div class="resumo-card"><div class="titulo">${r.nome}</div><div><strong>Dias:</strong> ${(r.dias||[]).join(", ")||"—"}</div><div style="margin-top:6px">${faixas.map(f=>`<span class="resumo-chip">🕐 ${f.inicio||"--:--"} às ${f.fim||"--:--"}</span>`).join(" ")}</div></div>`;}).join("")}</div>`;html+=fs();}
  if(voz.grupo_ring?.length){html+=secao("sec-grupo-ring","🔔","Grupo de Ring",voz.grupo_ring.length);html+=`<div class="resumo-grid">${voz.grupo_ring.map(g=>`<div class="resumo-card"><div class="titulo">${g.nome}</div><div><strong>Estratégia:</strong> ${g.estrategia||"—"}</div><div class="lista">${(g.ramais||[]).map(r=>`<span class="chip">${r}</span>`).join("")}</div></div>`).join("")}</div>`;html+=fs();}
  if(voz.filas?.length){html+=secao("sec-filas","📋","Filas",voz.filas.length);html+=`<div class="resumo-grid">${voz.filas.map(f=>`<div class="resumo-card ${!f.agentes?.length?"card-alerta":""}"><div class="titulo">${f.nome}</div><div class="lista">${(f.agentes||[]).length?f.agentes.map(a=>`<span class="chip">${a}</span>`).join(""):'<span class="sem-ramal">⚠ sem agentes</span>'}</div></div>`).join("")}</div>`;html+=fs();}
  if(voz.uras?.length){
    html+=secao("sec-ura","🎙️","URA",voz.uras.length);
    html+=voz.uras.map(u=>{
      const timeout = u.timeout || {};
      const timeoutStr = timeout.segundos && timeout.segundos !== "0"
        ? `${timeout.segundos}s → ${timeout.destino ? formatarDestinoDisplay(timeout.destino) : "Desconectar"}`
        : "Desconectar";
      return `<div class="resumo-card"><div class="titulo">${u.nome}</div>
        ${u.mensagem?`<div class="campo-sensivel" style="opacity:.8;font-size:13px">${u.mensagem}</div>`:""}
        <div style="font-size:12px;color:var(--text-soft);margin:6px 0 2px">⏱ Timeout: <strong>${timeoutStr}</strong></div>
        ${(u.opcoes||[]).length?`<table class="ura-table"><thead><tr><th>Tecla</th><th>Destino</th><th>Descrição</th></tr></thead><tbody>${u.opcoes.map(o=>`<tr><td><strong>${o.tecla||"—"}</strong></td><td>${idDest(o.destino)||'<span class="sem-ramal">⚠ sem destino</span>'}</td><td>${o.descricao||"—"}</td></tr>`).join("")}</tbody></table>`:""}
      </div>`;
    }).join("");
    html+=fs();
  }
  if(voz.pausas?.length){html+=secao("sec-pausas","⏸️","Pausas",voz.pausas.length);html+=voz.pausas.map(p=>`<div class="resumo-card"><div class="titulo">${p.grupo}</div><div class="lista">${(p.itens||[]).map(i=>`<span class="chip">${i.nome} <em>(${i.tempo})</em></span>`).join("")}</div></div>`).join("");html+=fs();}
  if(voz.pesquisas?.length){html+=secao("sec-pesquisa","⭐","Pesquisa de Satisfação",voz.pesquisas.length);html+=voz.pesquisas.map(p=>`<div class="resumo-card"><div class="titulo">${p.nome}</div>${p.introducao?`<div><strong>Introdução:</strong> ${p.introducao}</div>`:""}<div><strong>Pergunta:</strong> ${p.pergunta||"—"}</div><ul style="margin-top:8px">${(p.respostas||[]).map(r=>`<li>${r.nota} — ${r.descricao}</li>`).join("")}</ul>${p.encerramento?`<div style="margin-top:6px"><strong>Encerramento:</strong> ${p.encerramento}</div>`:""}</div>`).join("");html+=fs();}

  const chat=dados.chat||{};
  if(chat.tipo||chat.usuarios?.length||chat.agentes?.length||chat.fluxo||chat.fluxo_imagem||chat.fluxos?.length||chat.regras_tempo?.length){
    html+=`<div class="modulo-titulo"><h1>💬 Chat / Omnichannel</h1></div>`;
    html+=secao("sec-chat-config","⚙️","Configuração de Chat");
    if(chat.tipo==="qr"){html+=`<div class="resumo-card"><div><strong>Tipo:</strong> QR Code</div><div>📱 ${Array.isArray(chat.numero_qr)?chat.numero_qr.join(", "):(chat.conta||"—")}${btnCopiar(chat.conta)}</div></div>`;}
    else if(chat.tipo==="api"||chat.tipo==="ambos"){html+=`<div class="resumo-card"><div><strong>Tipo:</strong> ${chat.tipo==="ambos"?"API + QR Code":"API Oficial"}</div>${campoCopia("API",chat.api)}${campoCopia("Conta",typeof chat.conta==="object"?chat.conta?.api:chat.conta)}</div>`;}
    if(chat.canais?.length)html+=`<div style="margin-top:8px" class="lista">${chat.canais.map(c=>`<span class="chip">${c}</span>`).join("")}</div>`;
    html+=fs();
    if(chat.usuarios?.length){html+=secao("sec-chat-usuarios","👤","Usuários do Chat",chat.usuarios.length);html+=renderPaginado(chat.usuarios,"sec-chat-usuarios",u=>`<div class="resumo-card"><div class="titulo">${u.nome}</div><div>📧 ${u.email||"—"}${btnCopiar(u.email)}</div><div class="campo-sensivel">🔐 ${u.senha||"—"}${btnCopiar(u.senha)}</div><div class="campo-sensivel">🛡 ${u.permissao||"—"}</div></div>`);html+=fs();}
    if(chat.agentes?.length){html+=secao("sec-chat-agentes","🎧","Agentes do Chat",chat.agentes.length);html+=renderPaginado(chat.agentes,"sec-chat-agentes",a=>`<div class="resumo-card"><div class="titulo">${a.nome}</div><div class="lista">${(a.departamentos||[]).map(d=>`<span class="chip">${d}</span>`).join("")||'<span style="opacity:.5">Sem departamento</span>'}</div></div>`);html+=fs();}
    if(chat.departamentos?.length){
      html+=secao("sec-chat-depto","🏢","Departamentos",chat.departamentos.length);
      html+=`<div style="display:flex;flex-direction:column;gap:12px;">${chat.departamentos.map(d=>{
        const ag=d.agentes||[];
        return`<div style="border-radius:12px;overflow:hidden;border:1px solid var(--border);">
          <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:rgba(52,211,153,.1);border-bottom:1px solid rgba(52,211,153,.2);">
            <span style="font-weight:800;font-size:14px;color:#34d399;">🏢 ${d.nome}</span>
            <span style="font-size:11px;font-weight:700;background:rgba(52,211,153,.15);color:#34d399;padding:2px 10px;border-radius:99px;border:1px solid rgba(52,211,153,.3);">${ag.length===0?"Sem agentes":ag.length===1?"1 agente":`${ag.length} agentes`}</span>
          </div>
          ${ag.length?`<div style="padding:10px 14px;display:flex;flex-wrap:wrap;gap:6px;">${ag.map(a=>`<span class="chip" style="background:rgba(52,211,153,.1);color:#34d399;border-color:rgba(52,211,153,.25);">👤 ${a}</span>`).join("")}</div>`:`<div style="padding:10px 14px;font-size:12px;color:var(--text-soft);font-style:italic;">Nenhum agente vinculado ainda</div>`}
        </div>`;
      }).join("")}</div>`;
      html+=fs();
    }
    if(chat.regras_tempo?.length){html+=secao("sec-regras-chat","⏰","Regras de Tempo (Chat)",chat.regras_tempo.length);html+=`<div class="resumo-grid">${chat.regras_tempo.map(r=>{const faixas=r.faixas?.length?r.faixas:(r.hora_inicio?[{inicio:r.hora_inicio,fim:r.hora_fim}]:[]);return`<div class="resumo-card"><div class="titulo">${r.nome}</div><div><strong>Dias:</strong> ${(r.dias||[]).join(", ")||"—"}</div><div style="margin-top:6px">${faixas.map(f=>`<span class="resumo-chip">🕐 ${f.inicio||"--:--"} às ${f.fim||"--:--"}</span>`).join(" ")}</div></div>`;}).join("")}</div>`;html+=fs();}

    const _fluxos=chat.fluxos?.length?chat.fluxos:(chat.fluxo_imagem||chat.fluxo?[{id:"legado",nome:chat.fluxo?.nome||"Fluxo de Atendimento",imagem:chat.fluxo_imagem,nos:chat.fluxo?.nos,conexoes:chat.fluxo?.conexoes}]:[]);
    html+=secao("sec-fluxo","🔀","Fluxos de Atendimento",_fluxos.length||null);
    if(_fluxos.length){
      _fluxos.forEach(f=>{
        const nos=f.nos||[],conns=f.conexoes||[];
        const tipoCount={};nos.forEach(n=>{tipoCount[n.tipo]=(tipoCount[n.tipo]||0)+1;});
        const tipoLabels={start:"Start",mensagem:"Mensagens",menu:"Menus",horario:"Horários",dados:"Coleta de dados",agente:"Tranf. Agentes",depto:"Departamentos",espera:"Esperas",finalizar:"Encerramentos"};
        const tipoIcons={start:"🟢",mensagem:"✉️",menu:"📋",horario:"⏰",dados:"📝",agente:"👤",depto:"🏢",espera:"⏱️",finalizar:"🔴"};
        const chips=Object.entries(tipoCount).map(([tipo,qtd])=>`<span style="display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:700;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);color:var(--text);padding:3px 9px;border-radius:99px;">${tipoIcons[tipo]||"⬡"} ${tipoLabels[tipo]||tipo}: <strong>${qtd}</strong></span>`).join("");
        html+=`<div class="resumo-card" style="padding:16px;margin-bottom:14px;">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:12px;flex-wrap:wrap;gap:8px;">
            <div>
              <div style="font-size:15px;font-weight:800;color:var(--text);margin-bottom:4px;">🔀 ${f.nome||"Fluxo de Atendimento"}</div>
              <div style="font-size:12px;color:var(--text-soft);">${nos.length} nós &nbsp;·&nbsp; ${conns.length} conexões</div>
            </div>
          </div>
          ${chips?`<div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:12px;">${chips}</div>`:""}
          ${f.imagem?`<img src="${f.imagem}" style="width:100%;border-radius:10px;border:1px solid var(--border);display:block;" alt="${f.nome}">`:
          `<div style="background:rgba(206,255,0,.04);border:1px dashed rgba(206,255,0,.18);border-radius:10px;padding:16px;text-align:center;color:var(--text-soft);font-size:12px;">Sem imagem — abra o editor e salve novamente para gerar.</div>`}
        </div>`;
      });
    } else {
      html+=`<div class="resumo-card" style="padding:20px;text-align:center;"><p style="font-size:13px;color:var(--text-soft);">Nenhum fluxo criado ainda.</p></div>`;
    }
    html+=fs();
  }
  resumo.innerHTML=html;
  if(_modoCompacto)document.querySelectorAll(".campo-sensivel").forEach(el=>el.style.display="none");
  buildNav(secoes);buildAlertas(dados);initBusca();
}

window.baixarBackupDoResumo=function(){
  const raw=localStorage.getItem("CONFIG_CADERNO");if(!raw||raw==="null")return;
  try{const dados=JSON.parse(raw);const emp=(dados.cliente?.empresa||"caderno").replace(/\s+/g,"-");const data=new Date().toISOString().slice(0,10);const blob=new Blob([JSON.stringify(dados,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`backup-${emp}-${data}.json`;document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(url);const t=document.getElementById("toastGlobal"),m=document.getElementById("toastMessage");if(t&&m){m.textContent="Backup JSON baixado!";t.className="toast show";setTimeout(()=>t.classList.remove("show"),3000);}}catch(e){console.error("Backup:",e);}
};
document.addEventListener("DOMContentLoaded",()=>{
  const raw=localStorage.getItem("CONFIG_CADERNO");
  if(!raw||raw==="null"){document.getElementById("resumoEmpty").style.display="block";return;}
  try{_dadosResumo=JSON.parse(raw)||{};}catch(e){_dadosResumo={};}
  // FIX #5: Ocultar toolbar com botões desnecessários, manter apenas Backup e Salvar
  const toolbar = document.getElementById("resumoToolbar");
  if(toolbar) toolbar.style.display="flex";
  document.getElementById("resumoLayout").style.display="flex";
  renderResumoCompleto();
});
window.voltar=function(){window.location.href="index.html";};
window.editarSecao=function(ancora){sessionStorage.setItem("CADERNO_EDIT_ANCORA",ancora);window.location.href="index.html";};

/* ======================================================
   GERAR PDF PROFISSIONAL — COMPACTO E ORGANIZADO
====================================================== */
window.confirmarConfiguracao=async function(){
  const raw=localStorage.getItem("CONFIG_CADERNO");
  if(!raw||raw==="null"){document.getElementById("resumo").innerHTML=`<div class="resumo-card">⚠️ Nenhuma configuração válida encontrada.</div>`;return;}
  const dados=JSON.parse(raw),voz=dados.voz||{},chat=dados.chat||{},cli=dados.cliente||{};
  const {jsPDF}=window.jspdf;
  const doc=new jsPDF({unit:"mm",format:"a4"});
  const PW=210,PH=297,ML=12,MR=12,CW=210-ML-MR;
  const C={primary:[30,42,55],accent:[30,42,55],success:[16,185,129],white:[255,255,255],text:[15,23,42],textSoft:[100,116,139],bgLight:[245,248,252],bgGray:[249,250,251],border:[210,220,232],chipBg:[224,231,255],chipText:[55,48,163],lime:[206,255,0]};
  const hoje=new Date().toLocaleDateString("pt-BR");
  let paginaAtual=1;
  function sF(arr){doc.setFillColor(...arr);}function sD(arr){doc.setDrawColor(...arr);}function sT(arr){doc.setTextColor(...arr);}function sf(sz,st="normal"){doc.setFontSize(sz);doc.setFont("helvetica",st);}
  function pFoot(){sF(C.primary);doc.rect(0,PH-9,PW,9,"F");doc.setFillColor(206,255,0);doc.rect(0,PH-9,PW,0.7,"F");sT(C.white);sf(7);doc.text("Caderno de Parametros - "+(cli.empresa||""),ML,PH-3);doc.setTextColor(206,255,0);sf(7.5,"bold");doc.text(hoje+"  |  Pag. "+paginaAtual,PW-MR,PH-3,{align:"right"});}
  function pHead(){if(paginaAtual===1)return;sF(C.primary);doc.rect(0,0,PW,10,"F");sT(C.white);sf(8,"bold");doc.text("CADERNO DE PARAMETROS",ML,7);doc.setTextColor(206,255,0);sf(6.5);doc.text("SobreIP",ML,10.5);sT(C.white);sf(7);doc.text(hoje,PW-MR,7,{align:"right"});}
  function novaP(){pFoot();doc.addPage();paginaAtual++;pHead();return 18;}
  function chkY(y,n=18){if(y+n>PH-14)return novaP();return y;}
  
  // Barra de seção compacta
  function secBar(y,titulo,cor=null){
    y=chkY(y,11);
    sF(cor||C.primary);doc.rect(ML,y,CW,9,"F");
    doc.setFillColor(206,255,0);doc.rect(ML,y,3,9,"F");
    sT(C.white);sf(9,"bold");doc.text(titulo,ML+6,y+6.2);
    return y+12;
  }

  // Subsection header (menor)
  function subBar(y,titulo){
    y=chkY(y,8);
    sF(C.bgLight);doc.rect(ML,y,CW,7,"F");
    doc.setFillColor(...C.primary);doc.rect(ML,y,2,7,"F");
    sD(C.border);doc.setLineWidth(0.2);doc.rect(ML,y,CW,7,"S");
    sT(C.primary);sf(8,"bold");doc.text(titulo,ML+5,y+4.8);
    return y+9;
  }

  // Tabela compacta
  function tbl(y,head,body,cw){
    if(!body.length)return y;
    doc.autoTable({
      startY:y,head:[head],body,
      margin:{left:ML,right:MR},
      headStyles:{fillColor:C.primary,textColor:C.white,fontStyle:"bold",fontSize:7.5,halign:"center",cellPadding:3},
      bodyStyles:{fontSize:7.5,textColor:C.text,halign:"center",cellPadding:2.5},
      alternateRowStyles:{fillColor:C.bgLight},
      columnStyles:cw?Object.fromEntries(cw.map((w,i)=>[i,{cellWidth:w}])):{},
      tableLineColor:C.border,tableLineWidth:0.25,
      didDrawPage:()=>{pHead();paginaAtual=doc.getNumberOfPages();}
    });
    return doc.lastAutoTable.finalY+5;
  }

  // Card de info compacto (2 colunas por linha)
  function cInfo2(y,pares){
    const metade=Math.ceil(pares.length/2);
    const colW=CW/2-2;
    for(let i=0;i<pares.length;i+=2){
      y=chkY(y,7);
      const par1=pares[i],par2=pares[i+1];
      // Col 1
      sF(i%4<2?C.bgLight:C.bgGray);doc.rect(ML,y,colW,6.5,"F");
      sD(C.border);doc.setLineWidth(0.2);doc.rect(ML,y,colW,6.5,"S");
      sT(C.textSoft);sf(7,"bold");doc.text(par1[0],ML+3,y+4.5);
      sT(C.text);sf(7.5);const v1=String(par1[1]||"-");doc.text(v1.length>22?v1.substring(0,22)+"…":v1,ML+colW*0.45,y+4.5);
      // Col 2
      if(par2){
        const x2=ML+colW+4;
        sF(i%4<2?C.bgLight:C.bgGray);doc.rect(x2,y,colW,6.5,"F");
        doc.rect(x2,y,colW,6.5,"S");
        sT(C.textSoft);sf(7,"bold");doc.text(par2[0],x2+3,y+4.5);
        sT(C.text);sf(7.5);const v2=String(par2[1]||"-");doc.text(v2.length>22?v2.substring(0,22)+"…":v2,x2+colW*0.45,y+4.5);
      }
      y+=6.5;
    }
    return y+3;
  }

  // Card info simples (1 coluna)
  function cInfo(y,pares){
    y=chkY(y,pares.length*6.5+3);
    pares.forEach(([label,val],i)=>{
      const bg=i%2===0?C.bgGray:C.white;sF(bg);doc.rect(ML,y,CW,6.5,"F");
      sD(C.border);doc.setLineWidth(0.2);doc.rect(ML,y,CW,6.5,"S");
      const lw=CW*0.30;sF(C.bgLight);doc.rect(ML,y,lw,6.5,"F");doc.rect(ML,y,lw,6.5,"S");
      doc.setFillColor(...C.primary);doc.rect(ML,y,1.5,6.5,"F");
      sT(C.textSoft);sf(7,"bold");doc.text(String(label),ML+3,y+4.5);
      sT(C.text);sf(7.5);const vs=String(val||"-");doc.text(vs.length>55?vs.substring(0,55)+"…":vs,ML+lw+3,y+4.5);
      y+=6.5;
    });
    return y+3;
  }

  function chips(y,items){
    if(!items?.length)return y;
    y=chkY(y,10);let x=ML;const cH=6,px=3,gp=2.5;
    items.forEach(item=>{sf(7,"bold");const tw=doc.getTextWidth(item)+px*2;if(x+tw>PW-MR){x=ML;y+=cH+gp;y=chkY(y,9);}sF(C.chipBg);doc.roundedRect(x,y,tw,cH,1.5,1.5,"F");sT(C.chipText);doc.text(item,x+px,y+4.2);x+=tw+gp;});
    return y+cH+3;
  }

  function ramGrid(y,ramais){
    const cols=5,colW=CW/cols,rowH=12;
    for(let i=0;i<ramais.length;i+=cols){
      y=chkY(y,rowH+1);const g=ramais.slice(i,i+cols);while(g.length<cols)g.push(null);
      g.forEach((r,j)=>{const x=ML+j*colW;sF(r?C.bgLight:C.bgGray);doc.rect(x,y,colW,rowH,"F");sD(C.border);doc.setLineWidth(0.2);doc.rect(x,y,colW,rowH,"S");if(r){doc.setFillColor(...C.primary);doc.rect(x,y,1.5,rowH,"F");sT(C.primary);sf(7.5,"bold");doc.text(`R ${r.ramal}`,x+colW/2,y+4.8,{align:"center"});sT(C.textSoft);sf(6.5);doc.text(r.senha||"-",x+colW/2,y+9,{align:"center"});}});
      y+=rowH;
    }
    return y+4;
  }

  // ── CAPA ──
  for(let i=0;i<60;i++){const t=i/60;doc.setFillColor(Math.round(5+t*8),Math.round(11+t*20),Math.round(24+t*44));doc.rect(0,(PH/60)*i,PW,PH/60+0.5,"F");}
  doc.setFillColor(206,255,0);doc.rect(0,0,PW,2,"F");
  const lcx=PW/2,lcy=PH*.28;
  doc.setFillColor(10,20,40);doc.circle(lcx,lcy,18,"F");doc.setDrawColor(206,255,0);doc.setLineWidth(1.2);doc.circle(lcx,lcy,18,"S");doc.setLineWidth(0.4);doc.circle(lcx,lcy,12,"S");
  doc.setTextColor(206,255,0);doc.setFont("helvetica","bold");doc.setFontSize(11);doc.text("ERA",lcx,lcy+3.5,{align:"center"});
  doc.setTextColor(255,255,255);doc.setFont("helvetica","bold");doc.setFontSize(22);doc.text("Caderno de Parametros",PW/2,PH*.42,{align:"center"});
  doc.setTextColor(176,212,241);doc.setFont("helvetica","normal");doc.setFontSize(11);doc.text("Resumo da Configuracao do Cliente",PW/2,PH*.46,{align:"center"});
  doc.setDrawColor(206,255,0);doc.setLineWidth(1.2);doc.line(PW*.30,PH*.49,PW*.70,PH*.49);
  doc.setTextColor(255,255,255);doc.setFont("helvetica","bold");doc.setFontSize(16);doc.text(cli.empresa||"",PW/2,PH*.535,{align:"center"});
  doc.setTextColor(176,212,241);doc.setFont("helvetica","normal");doc.setFontSize(9.5);let iy=PH*.575;
  [["Dominio",cli.dominio||"-"],["CNPJ",cli.cnpj||"-"],["Data",hoje]].forEach(([l,v])=>{doc.text(l+":  "+v,PW/2,iy,{align:"center"});iy+=6;});
  // Stats
  const temVS=!!(voz.usuarios?.length||voz.ramais?.length||voz.agentes?.length),temCS=!!(chat.usuarios?.length||chat.agentes?.length||chat.departamentos?.length);
  let stats;
  if(temVS&&temCS)stats=[{label:"Usu. Voz",val:String(voz.usuarios?.length||0)},{label:"Ramais",val:String(voz.ramais?.length||0)},{label:"Filas",val:String(voz.filas?.length||0)},{label:"Usu. Chat",val:String(chat.usuarios?.length||0)},{label:"Ag. Chat",val:String(chat.agentes?.length||0)},{label:"Deptos",val:String(chat.departamentos?.length||0)}];
  else if(temCS)stats=[{label:"Usuarios",val:String(chat.usuarios?.length||0)},{label:"Agentes",val:String(chat.agentes?.length||0)},{label:"Deptos",val:String(chat.departamentos?.length||0)},{label:"Canais",val:String(chat.canais?.length||0)},{label:"API",val:(chat.tipo==="api"||chat.tipo==="ambos")?"Sim":"Nao"},{label:"QR",val:(chat.tipo==="qr"||chat.tipo==="ambos")?"Sim":"Nao"}];
  else stats=[{label:"Usuarios",val:String(voz.usuarios?.length||0)},{label:"Ramais",val:String(voz.ramais?.length||0)},{label:"Filas",val:String(voz.filas?.length||0)},{label:"URAs",val:String(voz.uras?.length||0)},{label:"PABX",val:temVS?"Sim":"Nao"},{label:"Chat",val:temCS?"Sim":"Nao"}];
  const N=stats.length,sTW=PW-24,s0=12,sW=sTW/N,sY=PH*.66,sH=20;
  stats.forEach(({label,val},i)=>{const bx=s0+i*sW+1,bw=sW-3;doc.setFillColor(255,255,255);doc.setGState(new doc.GState({opacity:0.07}));doc.roundedRect(bx,sY,bw,sH,2.5,2.5,"F");doc.setGState(new doc.GState({opacity:1}));doc.setDrawColor(206,255,0);doc.setLineWidth(0.3);doc.setGState(new doc.GState({opacity:.28}));doc.roundedRect(bx,sY,bw,sH,2.5,2.5,"S");doc.setGState(new doc.GState({opacity:1}));doc.setTextColor(206,255,0);doc.setFont("helvetica","bold");doc.setFontSize(11);doc.text(val,bx+bw/2,sY+12,{align:"center"});doc.setTextColor(255,255,255);doc.setGState(new doc.GState({opacity:.55}));doc.setFont("helvetica","normal");doc.setFontSize(6);doc.text(label,bx+bw/2,sY+17,{align:"center"});doc.setGState(new doc.GState({opacity:1}));});
  doc.setFillColor(0,0,0);doc.setGState(new doc.GState({opacity:.3}));doc.rect(0,PH-12,PW,12,"F");doc.setGState(new doc.GState({opacity:1}));doc.setTextColor(255,255,255);doc.setFont("helvetica","normal");doc.setFontSize(7.5);doc.text("Documento gerado automaticamente pelo Caderno de Parametros SobreIP",PW/2,PH-4.5,{align:"center"});

  // ── ÍNDICE ──
  doc.addPage();paginaAtual=2;pHead();let y=18;
  y=secBar(y,"INDICE DO DOCUMENTO");
  const modulos=[];
  if(cli)modulos.push({txt:"Dados do Cliente",nivel:0});
  if(voz.usuarios?.length)modulos.push({txt:"Usuarios Web",nivel:0});
  if(voz.entradas?.length)modulos.push({txt:"Numeros de Entrada",nivel:0});
  if(voz.ramais?.length)modulos.push({txt:"Ramais",nivel:0});
  if(voz.agentes?.length)modulos.push({txt:"Agentes",nivel:0});
  if(voz.regras_tempo?.length)modulos.push({txt:"Regras de Tempo (Voz)",nivel:0});
  if(voz.grupo_ring?.length)modulos.push({txt:"Grupo de Ring",nivel:0});
  if(voz.filas?.length)modulos.push({txt:"Filas",nivel:0});
  if(voz.uras?.length)modulos.push({txt:"URA - Atendimento Automatico",nivel:0});
  if(voz.pausas?.length)modulos.push({txt:"Pausas do Call Center",nivel:0});
  if(voz.pesquisas?.length)modulos.push({txt:"Pesquisa de Satisfacao",nivel:0});
  const temCI=chat.tipo||chat.usuarios?.length||chat.agentes?.length||chat.departamentos?.length||chat.fluxos?.length||chat.fluxo||chat.regras_tempo?.length;
  if(temCI){
    modulos.push({txt:"Chat / Omnichannel",nivel:0});
    if(chat.usuarios?.length)modulos.push({txt:"Usuarios do Chat",nivel:1});
    if(chat.agentes?.length)modulos.push({txt:"Agentes do Chat",nivel:1});
    if(chat.departamentos?.length)modulos.push({txt:"Departamentos",nivel:1});
    if(chat.regras_tempo?.length)modulos.push({txt:"Regras de Tempo (Chat)",nivel:1});
    if(chat.fluxo||chat.fluxos?.length)modulos.push({txt:"Fluxo de Atendimento",nivel:1});
  }
  // Exibir índice em 2 colunas
  const mMid=Math.ceil(modulos.length/2);const colW2=(CW-4)/2;
  modulos.forEach((m,i)=>{
    const col=i>=mMid?1:0;const row=col===0?i:i-mMid;
    const yx=y+row*7.5;const xx=ML+col*(colW2+4);
    if(row===0&&col===1){}// já gerenciado
    if(col===0){
      y=chkY(y,7.5);
      sF(i%2===0?C.bgLight:C.white);doc.rect(ML,yx,colW2,7,"F");
      sD(C.border);doc.setLineWidth(0.2);doc.rect(ML,yx,colW2,7,"S");
      if(m.nivel===0){doc.setFillColor(...C.primary);doc.rect(ML,yx,2,7,"F");}
      else{doc.setFillColor(52,211,153);doc.rect(ML,yx,2,7,"F");}
      sT(m.nivel===0?C.text:C.textSoft);sf(m.nivel===0?8:7.5,"normal");
      doc.text((m.nivel===0?"  ":"    > ")+m.txt,ML+4,yx+5);
    }
  });
  // Col direita
  let yR=y;
  modulos.slice(mMid).forEach((m,i)=>{
    const yx=y+i*7.5;const xx=ML+colW2+4;
    sF(i%2===0?C.bgLight:C.white);doc.rect(xx,yx,colW2,7,"F");
    sD(C.border);doc.setLineWidth(0.2);doc.rect(xx,yx,colW2,7,"S");
    if(m.nivel===0){doc.setFillColor(...C.primary);doc.rect(xx,yx,2,7,"F");}
    else{doc.setFillColor(52,211,153);doc.rect(xx,yx,2,7,"F");}
    sT(m.nivel===0?C.text:C.textSoft);sf(m.nivel===0?8:7.5,"normal");
    doc.text((m.nivel===0?"  ":"    > ")+m.txt,xx+4,yx+5);
  });
  y=y+Math.max(mMid,modulos.length-mMid)*7.5+6;
  pFoot();

  // ── CONTEÚDO ──
  doc.addPage();paginaAtual++;pHead();y=18;
  if(cli.empresa||cli.dominio||cli.cnpj){y=secBar(y,"DADOS DO CLIENTE");y=cInfo2(y,[["Empresa",cli.empresa||"-"],["Dominio",cli.dominio||"-"],["CNPJ/CPF",cli.cnpj||"-"],["",""]]);} 
  if(voz.usuarios?.length){y=chkY(y,20);y=secBar(y,"USUARIOS WEB");const cw=[CW*.22,CW*.26,CW*.19,CW*.25,CW*.08];y=tbl(y,["Nome","E-mail","Senha","Permissao","Agente"],voz.usuarios.map(u=>[u.nome||"-",u.email||"-",u.senha||"-",u.permissao||"-",u.agente_callcenter?"✓":""]),cw);}
  if(voz.entradas?.length){y=chkY(y,18);y=secBar(y,"NUMEROS DE ENTRADA");y=chips(y,voz.entradas.map(e=>e.numero||"-"));}
  if(voz.ramais?.length){y=chkY(y,20);y=secBar(y,"RAMAIS ("+voz.ramais.length+")");y=ramGrid(y,voz.ramais);}
  if(voz.agentes?.length){y=chkY(y,20);y=secBar(y,"AGENTES");y=tbl(y,["Nome","Ramal","Multiskill"],voz.agentes.map(a=>[a.nome||"-",a.ramal||"-",a.multiskill?"Sim":"-"]),[CW*.50,CW*.30,CW*.20]);}
  if(voz.regras_tempo?.length){
    y=chkY(y,18);y=secBar(y,"REGRAS DE TEMPO - VOZ");
    voz.regras_tempo.forEach(r=>{
      const faixas=r.faixas?.length?r.faixas:(r.hora_inicio?[{inicio:r.hora_inicio,fim:r.hora_fim}]:[]);
      const faixasStr=faixas.map(f=>`${f.inicio||"--:--"} as ${f.fim||"--:--"}`).join(" | ")||"-";
      y=chkY(y,22);y=cInfo2(y,[["Nome",r.nome||"-"],["Dias",(r.dias||[]).join(", ")||"-"],["Horarios",faixasStr],["",""]]);
    });
  }
  if(voz.grupo_ring?.length){y=chkY(y,18);y=secBar(y,"GRUPO DE RING");voz.grupo_ring.forEach(g=>{y=chkY(y,22);y=cInfo2(y,[["Nome",g.nome||"-"],["Estrategia",g.estrategia||"-"],["Ramais",(g.ramais||[]).join(", ")||"-"],["",""]]);});}
  if(voz.filas?.length){y=chkY(y,18);y=secBar(y,"FILAS");y=tbl(y,["Fila","Agentes"],voz.filas.map(f=>[f.nome||"-",(f.agentes||[]).join(", ")]),[CW*.35,CW*.65]);}
  
  // URA com timeout e destino diferenciado
  if(voz.uras?.length){
    y=chkY(y,18);y=secBar(y,"URA - ATENDIMENTO AUTOMATICO");
    voz.uras.forEach(u=>{
      y=chkY(y,22);
      const timeout=u.timeout||{};
      const timeoutStr=timeout.segundos&&timeout.segundos!=="0"?`${timeout.segundos}s -> ${timeout.destino?formatarDestinoDisplay(timeout.destino):"Desconectar"}`:"Desconectar";
      y=subBar(y,u.nome||"-");
      if(u.mensagem){y=chkY(y,8);sF(C.bgLight);doc.rect(ML,y,CW,7,"F");sD(C.border);doc.setLineWidth(0.2);doc.rect(ML,y,CW,7,"S");sT(C.textSoft);sf(7.5);doc.text(u.mensagem.substring(0,90),ML+3,y+4.8);y+=7;}
      y=chkY(y,7);sF(C.bgGray);doc.rect(ML,y,CW,6.5,"F");sD(C.border);doc.rect(ML,y,CW,6.5,"S");sT(C.textSoft);sf(7,"bold");doc.text("Timeout:",ML+3,y+4.5);sT(C.primary);sf(7.5);doc.text(timeoutStr,ML+25,y+4.5);y+=6.5;
      const op=u.opcoes||[];
      if(op.length){
        // FIX #8: mostrar diferenciação (Fila) / (Grupo) no PDF
        y=tbl(y,["Tecla","Destino","Descricao"],op.map(o=>[o.tecla||"-",formatarDestinoDisplay(o.destino)||"-",o.descricao||"-"]),[CW*.10,CW*.45,CW*.45]);
      }
      y+=2;
    });
  }
  if(voz.pausas?.length){y=chkY(y,18);y=secBar(y,"PAUSAS DO CALL CENTER");voz.pausas.forEach(p=>{y=chkY(y,16);y=subBar(y,"Grupo: "+(p.grupo||"-"));if(p.itens?.length)y=tbl(y,["Nome da Pausa","Tempo"],p.itens.map(i=>[i.nome||"-",i.tempo||"-"]),[CW*.65,CW*.35]);});}
  if(voz.pesquisas?.length){y=chkY(y,18);y=secBar(y,"PESQUISA DE SATISFACAO");voz.pesquisas.forEach(p=>{y=chkY(y,22);y=cInfo2(y,[["Nome",p.nome||"-"],["Pergunta",p.pergunta||"-"],["Introducao",p.introducao||"-"],["Encerramento",p.encerramento||"-"]]);if(p.respostas?.length)y=tbl(y,["Nota","Descricao"],p.respostas.map(r=>[String(r.nota??"-"),r.descricao||"-"]),[CW*.18,CW*.82]);});}

  const temChat=chat.tipo||chat.usuarios?.length||chat.agentes?.length||chat.departamentos?.length||chat.fluxos?.length||chat.fluxo_imagem||chat.regras_tempo?.length;
  if(temChat){
    doc.addPage();paginaAtual++;pHead();y=18;
    y=secBar(y,"CHAT / OMNICHANNEL");
    if(chat.tipo){
      const tl=chat.tipo==="qr"?"Integracao via QR Code":chat.tipo==="ambos"?"API Oficial + QR Code":"Integracao via API Oficial";
      const pc=[["Tipo",tl]];
      if(chat.tipo==="api"||chat.tipo==="ambos"){pc.push(["API",chat.api||"-"]);const cv=typeof chat.conta==="object"?(chat.conta?.api||"-"):(chat.conta||"-");pc.push(["Conta",cv]);}
      if(chat.tipo==="qr"||chat.tipo==="ambos"){const nq=Array.isArray(chat.numero_qr)?chat.numero_qr.join(", "):(typeof chat.conta==="object"?chat.conta?.qr:chat.conta)||"-";pc.push(["WhatsApp",nq]);}
      y=cInfo(y,pc);
    }
    if(chat.canais?.length){y=chkY(y,14);sT(C.primary);sf(8,"bold");doc.text("Canais integrados:",ML,y);y+=4;y=chips(y,chat.canais);}
    if(chat.usuarios?.length){y=chkY(y,18);y=secBar(y,"USUARIOS DO CHAT");y=tbl(y,["Nome","E-mail","Senha","Permissao"],chat.usuarios.map(u=>[u.nome||"-",u.email||"-",u.senha||"-",u.permissao||"-"]),[CW*.22,CW*.28,CW*.20,CW*.30]);}
    if(chat.agentes?.length){y=chkY(y,18);y=secBar(y,"AGENTES DO CHAT");y=tbl(y,["Agente","Departamentos"],chat.agentes.map(a=>[a.nome||"-",(a.departamentos||[]).join(", ")||"-"]),[CW*.40,CW*.60]);}
    if(chat.departamentos?.length){
      y=chkY(y,18);y=secBar(y,"DEPARTAMENTOS");
      chat.departamentos.forEach(dep=>{
        y=chkY(y,20);const ag=dep.agentes||[];
        // Header verde compacto
        doc.setFillColor(14,50,43);doc.rect(ML,y,CW,8,"F");
        doc.setFillColor(52,211,153);doc.rect(ML,y,2.5,8,"F");
        sT(C.white);sf(8,"bold");doc.text(dep.nome||"-",ML+6,y+5.4);
        const cntLbl=ag.length===0?"Sem agentes":ag.length===1?"1 agente":ag.length+" agentes";
        doc.setTextColor(52,211,153);sf(7);doc.text(cntLbl,PW-MR,y+5.4,{align:"right"});
        y+=8;
        if(ag.length){
          const c4=4,cW4=CW/c4,rH=7;
          for(let i=0;i<ag.length;i+=c4){
            y=chkY(y,rH+1);const g=ag.slice(i,i+c4);while(g.length<c4)g.push(null);
            g.forEach((a,j)=>{const x=ML+j*cW4;sF(j%2===0?C.bgLight:C.bgGray);doc.rect(x,y,cW4,rH,"F");sD(C.border);doc.setLineWidth(0.2);doc.rect(x,y,cW4,rH,"S");if(a){sT(C.text);sf(7.5);doc.text(a,x+cW4/2,y+4.8,{align:"center"});}});y+=rH;
          }
        }else{sF(C.bgGray);doc.rect(ML,y,CW,7,"F");sD(C.border);doc.rect(ML,y,CW,7,"S");sT(C.textSoft);sf(7.5);doc.text("Nenhum agente vinculado",ML+CW/2,y+4.8,{align:"center"});y+=7;}
        y+=3;
      });
    }
    if(chat.regras_tempo?.length){
      y=chkY(y,18);y=secBar(y,"REGRAS DE TEMPO - CHAT");
      chat.regras_tempo.forEach(r=>{
        const faixas=r.faixas?.length?r.faixas:(r.hora_inicio?[{inicio:r.hora_inicio,fim:r.hora_fim}]:[]);
        const faixasStr=faixas.map(f=>`${f.inicio||"--:--"} as ${f.fim||"--:--"}`).join(" | ")||"-";
        y=chkY(y,22);y=cInfo2(y,[["Nome",r.nome||"-"],["Dias",(r.dias||[]).join(", ")||"-"],["Horarios",faixasStr],["",""]]);
      });
    }
  }
  pFoot();

  // ── FLUXOS (compactos, sem distorção) ──
  const NODE_LBL={start:"Inicio",mensagem:"Enviar Msg",menu:"Menu",horario:"Horario",dados:"Coletar Dados",agente:"Agente",depto:"Departamento",espera:"Espera",finalizar:"Finalizar"};
  const NODE_IC={start:"[S]",mensagem:"[M]",menu:"[O]",horario:"[H]",dados:"[D]",agente:"[A]",depto:"[P]",espera:"[E]",finalizar:"[F]"};
  const _pF=chat.fluxos?.length?chat.fluxos:(chat.fluxo_imagem?[{nome:chat.fluxo?.nome||"Fluxo de Atendimento",imagem:chat.fluxo_imagem,nos:chat.fluxo?.nos,conexoes:chat.fluxo?.conexoes}]:[]);

  if(_pF.length){
    _pF.forEach((f,idx)=>{
      doc.addPage();paginaAtual++;pHead();let yf=18;
      yf=secBar(yf,"FLUXO: "+(f.nome||"Fluxo "+(idx+1)).toUpperCase());
      const nos=f.nos||[],conns=f.conexoes||[];
      const tipoCount={};nos.forEach(n=>{tipoCount[n.tipo]=(tipoCount[n.tipo]||0)+1;});
      yf=cInfo2(yf,[["Nome",f.nome||"Fluxo "+(idx+1)],["Total de nos",String(nos.length)],["Total de conexoes",String(conns.length)],["",""]]); 
      // Composição
      const tiposStr=Object.entries(tipoCount).map(([tipo,qtd])=>`${NODE_LBL[tipo]||tipo}: ${qtd}`).join("  |  ");
      if(tiposStr){yf=chkY(yf,8);sF(C.bgLight);doc.rect(ML,yf,CW,7,"F");sD(C.border);doc.setLineWidth(0.2);doc.rect(ML,yf,CW,7,"S");doc.setFillColor(...C.primary);doc.rect(ML,yf,2,7,"F");sT(C.textSoft);sf(7,"bold");doc.text("Composicao:",ML+4,yf+4.8);sT(C.text);sf(7.5);doc.text(tiposStr.substring(0,80),ML+28,yf+4.8);yf+=9;}
      // Imagem proporcional
      if(f.imagem){
        try{
          const fmt=f.imagem.startsWith("data:image/jpeg")?"JPEG":"PNG";
          const props=doc.getImageProperties(f.imagem);
          const ratio=props.width/props.height;
          const maxW=CW,maxH=Math.min(PH-yf-38,90);
          let imgW=maxW,imgH=imgW/ratio;
          if(imgH>maxH){imgH=maxH;imgW=imgH*ratio;}
          if(imgW>maxW){imgW=maxW;imgH=imgW/ratio;}
          const imgX=ML+(CW-imgW)/2;
          yf=chkY(yf,imgH+6);
          sD(C.border);doc.setLineWidth(0.4);doc.roundedRect(imgX-0.5,yf-0.5,imgW+1,imgH+1,2,2,"S");
          doc.addImage(f.imagem,fmt,imgX,yf,imgW,imgH,undefined,"FAST");
          yf+=imgH+6;
        }catch(e){sT(C.textSoft);sf(8);doc.text("Imagem nao disponivel.",ML,yf+5);yf+=10;}
      }
      // Tabela de nós compacta
      if(nos.length){
        yf=chkY(yf,22);
        sF(C.primary);doc.rect(ML,yf,CW,8,"F");doc.setFillColor(206,255,0);doc.rect(ML,yf,2.5,8,"F");sT(C.white);sf(7.5,"bold");
        doc.text("No",ML+4,yf+5.4);doc.text("Tipo",ML+14,yf+5.4);doc.text("Conteudo / Configuracao",ML+52,yf+5.4);yf+=8;
        nos.forEach((no,i)=>{
          yf=chkY(yf,8);
          const tipo=NODE_LBL[no.tipo]||no.tipo||"-";const dados=no.dados||{};
          let desc="";
          if(no.tipo==="mensagem"||no.tipo==="finalizar")desc=dados.text||"";
          else if(no.tipo==="menu"){desc=(dados.text?dados.text+" >> ":"")+(dados.opcoes||[]).filter(Boolean).map((o,j)=>`${j+1}. ${o}`).join(" | ");}
          else if(no.tipo==="horario")desc=dados.horario||"Horario Comercial";
          else if(no.tipo==="dados")desc=(dados.campo?"Campo: "+dados.campo:"")+(dados.text?" - "+dados.text:"");
          else if(no.tipo==="agente")desc=dados.text||"Qualquer agente";
          else if(no.tipo==="depto")desc=dados.text||"-";
          else if(no.tipo==="espera")desc=dados.text||"Aguardando";
          else if(no.tipo==="start")desc="Inicio do fluxo";
          if(!desc)desc="-";
          const bg=i%2===0?C.bgGray:C.white;sF(bg);doc.rect(ML,yf,CW,7,"F");sD(C.border);doc.setLineWidth(0.2);doc.rect(ML,yf,CW,7,"S");
          // Nº
          sT(C.textSoft);sf(7,"bold");doc.text(String(i+1),ML+3,yf+4.8);
          doc.setDrawColor(210,220,232);doc.rect(ML+10,yf,0.25,7,"S");
          // Tipo
          sT(C.primary);sf(7,"bold");doc.text(`${NODE_IC[no.tipo]||"?"} ${tipo}`,ML+12,yf+4.8);
          doc.rect(ML+50,yf,0.25,7,"S");
          // Conteudo
          sT(C.text);sf(7.5,"normal");const dtxt=desc.length>95?desc.substring(0,95)+"...":desc;doc.text(dtxt,ML+52,yf+4.8,{maxWidth:CW-42});
          yf+=7;
        });
      }
      pFoot();
    });
  }

  // ── SALVAR + DRIVE ──
  const _emp=(cli.empresa||"caderno").replace(/[^a-zA-Z0-9À-ÿ ]/g,"").trim().replace(/\s+/g,"-");
  const _d=new Date().toISOString().slice(0,10);
  const nomeArq=`${_emp}-${_d}.pdf`;
  doc.save(nomeArq);

  try{const res=await fetch("/app/caderno/api/salvar.php",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(dados)});if(!res.ok)throw new Error();console.log("API PHP OK");}catch(e){console.error("API PHP:",e);}

  const ASU="https://script.google.com/macros/s/AKfycbwIa5t0aWJwqAOGVp0WXkoJhqZlGVdU4rhrBoInoKhd3ZS8rBBSr84tLi_BQutcVuV6Yg/exec";
  function _dT(txt,erro){const t=document.getElementById("toastGlobal"),m=document.getElementById("toastMessage");if(!t||!m)return;m.textContent=txt;t.className="toast show"+(erro?" error":"");clearTimeout(t._dt);t._dt=setTimeout(()=>t.classList.remove("show"),5000);}
  function _envD(url,nome,empresa,b64){try{const iid="_df_"+Date.now(),ifr=document.createElement("iframe");ifr.name=iid;ifr.style="display:none;position:absolute;top:-9999px";document.body.appendChild(ifr);const form=document.createElement("form");form.method="POST";form.action=url;form.target=iid;form.enctype="application/x-www-form-urlencoded";form.style="display:none";[["nome",nome],["empresa",empresa],["pdf",b64]].forEach(([n,v])=>{const i=document.createElement("input");i.type="hidden";i.name=n;i.value=v;form.appendChild(i);});document.body.appendChild(form);form.submit();setTimeout(()=>{try{document.body.removeChild(form);}catch(_){}},500);setTimeout(()=>{try{document.body.removeChild(ifr);}catch(_){}},15000);setTimeout(()=>_dT("PDF enviado ao Drive com sucesso!"),3000);}catch(err){_dT("Erro ao enviar para o Drive.",true);}}
  _dT("Enviando PDF para o Drive...");
  try{const b64=doc.output("datauristring").split(",")[1];_envD(ASU,nomeArq,cli.empresa||"",b64);}catch(err){_dT("Erro ao preparar PDF para o Drive.",true);}
};

/* -- TEMA -- */
(function(){const btn=document.getElementById("toggleTheme");if(!btn)return;const t=localStorage.getItem("tema");if(t==="light"){document.body.classList.add("light");btn.textContent="🌙";}else btn.textContent="☀️";btn.addEventListener("click",()=>{document.body.classList.toggle("light");const il=document.body.classList.contains("light");localStorage.setItem("tema",il?"light":"dark");btn.textContent=il?"🌙":"☀️";});})();

/* -- PROTEÇÃO -- */
document.addEventListener("contextmenu",e=>e.preventDefault());
document.addEventListener("keydown",e=>{
  if(e.key==="F12"){e.preventDefault();return;}
  if(e.ctrlKey&&!e.shiftKey&&(e.key==="u"||e.key==="U")){e.preventDefault();return;}
  if(e.ctrlKey&&e.shiftKey&&(e.key==="I"||e.key==="i"||e.key==="J"||e.key==="j")){e.preventDefault();return;}
  if(e.ctrlKey&&!e.shiftKey&&(e.key==="w"||e.key==="W")){e.preventDefault();return;}
  if(e.key==="Backspace"){const tag=document.activeElement?.tagName?.toLowerCase();const ed=(tag==="input"||tag==="textarea"||tag==="select"||document.activeElement?.isContentEditable);if(!ed)e.preventDefault();}
});
window.addEventListener("beforeunload",e=>{const raw=localStorage.getItem("CONFIG_CADERNO");if(raw&&raw!=="null"){e.preventDefault();e.returnValue="";}});
