/* ======================================================
   RESUMO – CHAT
====================================================== */

window.renderResumoChat = function (container, data) {
  if (!container || !data?.chat) return;

  const chat = data.chat;

  const box = document.createElement("div");
  box.className = "resumo-card";

  let html = `<h3>Chat / Omnichannel</h3>`;

  // QR CODE
  if (chat.tipo === "qr") {
    html += `
      <p><strong>Tipo:</strong> Integração via QR Code</p>
      <p><strong>Conexão:</strong> Realizada por leitura de QR Code para autenticação do canal.</p>
    `;
  }

  // API
  else if (chat.tipo === "api") {
    html += `
      <p><strong>Tipo:</strong> Integração via API Oficial</p>
      <p><strong>API:</strong> ${chat.api || "-"}</p>
      <p><strong>Conta:</strong> ${chat.conta || "-"}</p>
    `;
  }

  // canais
  if (chat.canais && chat.canais.length) {
    html += `
      <p><strong>Canais:</strong> ${chat.canais.join(", ")}</p>
    `;
  }

  box.innerHTML = html;
  container.appendChild(box);
};

  /* ================= USUÁRIOS ================= */
   if (usuarios.length) {
     html += `
       <h3>👤 Usuários do Chat</h3>
   
       <div class="resumo-grid">
         ${usuarios.map(u => `
           <div class="resumo-card">
   
             <div class="titulo">${u.nome}</div>
   
             <div>📧 ${u.email || "-"}</div>
   
             <div>🔐 Senha: ${u.senha || "-"}</div>
   
             <div>🛡 Permissão: ${u.permissao || "-"}</div>
   
           </div>
         `).join("")}
       </div>
     `;
   }

  /* ================= AGENTES ================= */
  if (agentes.length) {
    html += `
      <h3>🎧 Agentes do Chat</h3>
      <div class="resumo-grid">
        ${agentes.map(a => {
          const deps = Array.isArray(a.departamentos) ? a.departamentos : [];
          return `
            <div class="resumo-card">
              <div class="titulo">${a.nome}</div>
              ${
                deps.length
                  ? `<div class="lista">${deps.map(d => `<span class="chip">${d}</span>`).join("")}</div>`
                  : `<div class="texto-secundario">Sem departamento</div>`
              }
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  /* ================= DEPARTAMENTOS ================= */
  if (chat.departamentos?.length) {
    html += `
      <h3>🏢 Departamentos</h3>
      <div class="resumo-grid">
        ${chat.departamentos.map(dep => `
          <div class="resumo-card">
            <div class="titulo">${dep.nome}</div>
            ${
              dep.agentes?.length
                ? `<div class="lista">
                    ${dep.agentes.map(a => `<span class="chip">${a}</span>`).join("")}
                   </div>`
                : `<div class="texto-secundario">Sem agentes</div>`
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
   RESUMO – PRINCIPAL
   ====================================================== */
document.addEventListener("DOMContentLoaded", () => {

  const resumo = document.getElementById("resumo");
  if (!resumo) return;

  const raw = localStorage.getItem("CONFIG_CADERNO");
  if (!raw) return;

  const dados = JSON.parse(raw);
  resumo.innerHTML = "";

  const voz = dados.voz || {};

   if (
     voz.usuarios?.length ||
     voz.ramais?.length ||
     voz.agentes?.length ||
     voz.filas?.length ||
     voz.uras?.length ||
     voz.grupo_ring?.length
   ) {
     resumo.innerHTML += `
       <section class="resumo-bloco modulo-titulo">
         <h1>📞 Voz / Call Center</h1>
       </section>
     `;
   }
   
  function identificarDestino(nome) {
    if (!nome) return "-";

    if (voz.regras_tempo?.some(r => r.nome === nome))
      return `⏰ Regra de Tempo — ${nome}`;

    if (voz.filas?.some(f => f.nome === nome))
      return `📞 Fila — ${nome}`;

    if (voz.grupo_ring?.some(g => g.nome === nome))
      return `🔔 Grupo de Ring — ${nome}`;

    if (voz.uras?.some(u => u.nome === nome))
      return `🎙️ URA — ${nome}`;

    if (voz.ramais?.some(r => String(r.ramal) === String(nome)))
      return `☎️ Ramal — ${nome}`;

    return nome;
  }

  /* ================= CLIENTE ================= */
  if (dados.cliente) {
    resumo.innerHTML += `
      <section class="resumo-bloco">
        <h2>🏢 Cliente</h2>
        <div class="resumo-card">
          <div><strong>Empresa:</strong> ${dados.cliente.empresa || "-"}</div>
          <div><strong>Domínio:</strong> ${dados.cliente.dominio || "-"}</div>
          <div><strong>CNPJ:</strong> ${dados.cliente.cnpj || "-"}</div>
        </div>
      </section>
    `;
  }

  /* ================= USUÁRIOS WEB ================= */
   if (voz.usuarios?.length) {
     resumo.innerHTML += `
       <section class="resumo-bloco">
         <h2>👤 Usuários Web</h2>
   
         <div class="resumo-grid">
           ${voz.usuarios.map(u => `
             <div class="resumo-card">
   
               <div class="titulo">${u.nome}</div>
   
               <div>📧 ${u.email || "-"}</div>
   
               <div>🔐 Senha: ${u.senha || "-"}</div>
   
               <div>🛡 Permissão: ${u.permissao || "-"}</div>
   
               ${u.agente ? `<span class="badge">Agente</span>` : ""}
   
             </div>
           `).join("")}
         </div>
   
       </section>
     `;
   }

  /* ================= ENTRADAS ================= */
  if (voz.entradas?.length) {
    resumo.innerHTML += `
      <section class="resumo-bloco">
        <h2>📞 Entradas / Números</h2>
        <div class="resumo-grid">
          ${voz.entradas.map(e => `
            <div class="resumo-card">
              <div class="titulo">${e.numero}</div>
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
   
   /* ================= REGRAS DE TEMPO ================= */
   if (voz.regras_tempo?.length) {
     resumo.innerHTML += `
       <section class="resumo-bloco">
         <h2>⏰ Regras de Tempo</h2>
         <div class="resumo-grid">
           ${voz.regras_tempo.map(r => `
             <div class="resumo-card">
               <div class="titulo">${r.nome}</div>
               <div><strong>Dias:</strong> ${(r.dias || []).join(", ")}</div>
               <div><strong>Horário:</strong> ${r.hora_inicio || "-"} às ${r.hora_fim || "-"}</div>
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
               <div><strong>Estratégia:</strong> ${g.estrategia || "-"}</div>
               ${
                 g.ramais?.length
                   ? `<div class="lista">${g.ramais.map(r =>
                       `<span class="chip">${r}</span>`
                     ).join("")}</div>`
                   : ""
               }
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
                   ? `<div class="lista">${f.agentes.map(a =>
                       `<span class="chip">${a}</span>`
                     ).join("")}</div>`
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
        <h2>🎙️ URA</h2>
        <div class="resumo-grid">
          ${voz.uras.map(u => {
            const opcoes = u.opcoes || u.opcoes_ura || [];
            return `
              <div class="resumo-card">
                <div class="titulo">${u.nome}</div>
                <div>${u.mensagem || ""}</div>
                <ul>
                  ${opcoes.map(o =>
                    `<li>Tecla ${o.tecla} → ${identificarDestino(o.destino)}</li>`
                  ).join("")}
                </ul>
              </div>
            `;
          }).join("")}
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
                 ${(p.itens || []).map(i =>
                   `<span class="chip">${i.nome} (${i.tempo})</span>`
                 ).join("")}
               </div>
             </div>
           `).join("")}
         </div>
       </section>
     `;
   }

   /* ================= PESQUISA ================= */
   if (voz.pesquisas?.length) {
     resumo.innerHTML += `
       <section class="resumo-bloco">
         <h2>⭐ Pesquisa de Satisfação</h2>
         <div class="resumo-grid">
           ${voz.pesquisas.map(p => `
             <div class="resumo-card">
               <div class="titulo">${p.nome}</div>
   
               ${p.introducao ? `<div><strong>Áudio inicial:</strong> ${p.introducao}</div>` : ""}
   
               <div style="margin-top:6px;">
                 <strong>Pergunta:</strong><br>
                 ${p.pergunta || "-"}
               </div>
   
               <ul style="margin-top:8px;">
                 ${(p.respostas || []).map(r =>
                   `<li>${r.nota} - ${r.descricao}</li>`
                 ).join("")}
               </ul>
   
               ${p.encerramento ? `<div style="margin-top:8px;"><strong>Áudio final:</strong> ${p.encerramento}</div>` : ""}
   
             </div>
           `).join("")}
         </div>
       </section>
     `;
   }

   /* ================= SEPARADOR CHAT ================= */
   if (
     dados.chat &&
     (dados.chat.tipo ||
      dados.chat.usuarios?.length ||
      dados.chat.agentes?.length)
   ) {
     resumo.innerHTML += `
       <section class="resumo-bloco modulo-titulo">
         <h1>💬 Chat / Omnichannel</h1>
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

/* =================================================
   GERAR PDF – CADERNO DE PARÂMETROS (VERSÃO ESTÁVEL)
================================================= */

window.confirmarConfiguracao = function(){

const doc = new jspdf.jsPDF();
const raw = localStorage.getItem("CONFIG_CADERNO");

if(!raw){
alert("Nenhuma configuração encontrada.");
return;
}

const dados = JSON.parse(raw);
const voz = dados.voz || {};
const chat = dados.chat || {};

let y = 30;

/* ===== FUNÇÕES ===== */

function titulo(txt){

verificarPagina();

doc.setFillColor(30,120,210);
doc.rect(12,y-6,186,10,"F");

doc.setTextColor(255);
doc.setFontSize(12);
doc.setFont(undefined,"bold");

doc.text(txt,105,y,{align:"center"});

doc.setTextColor(0);
doc.setFont(undefined,"normal");

y+=12;

}

function linhaCentral(txt){

verificarPagina();

doc.text(txt,105,y,{align:"center"});
y+=7;

}

function separador(){

y+=3;
doc.setDrawColor(200);
doc.line(12,y,198,y);
y+=12;

}

function verificarPagina(){

if(y>270){
doc.addPage();
y=25;
}

}

function garantirEspaco(altura){

if(y + altura > 270){
doc.addPage();
y = 25;
}

}
/* ================= CAPA ================= */

doc.setFontSize(22);
doc.setFont(undefined,"bold");
doc.text("Caderno de Parâmetros",105,18,{align:"center"});

doc.setFontSize(12);
doc.setFont(undefined,"normal");
doc.text("Resumo da Configuração do Cliente",105,26,{align:"center"});

y=40;

/* ================= CLIENTE ================= */

if(dados.cliente){

titulo("CLIENTE");

linhaCentral("Empresa: "+(dados.cliente.empresa||"-"));
linhaCentral("Domínio: "+(dados.cliente.dominio||"-"));
linhaCentral("CNPJ: "+(dados.cliente.cnpj||"-"));

separador();

}

/* ================= USUÁRIOS WEB ================= */

if(voz.usuarios?.length){

titulo("USUÁRIOS WEB");

doc.autoTable({

startY:y,

head:[["Nome","Email","Senha","Permissão"]],

body:voz.usuarios.map(u=>[
u.nome||"-",
u.email||"-",
u.senha||"-",
u.permissao||"-"
]),

headStyles:{
fillColor:[30,120,210],
textColor:[255,255,255],
fontStyle:"bold"
},
styles:{
halign:"center",
fontSize:10,
cellPadding:4
}

});

y = doc.lastAutoTable.finalY + 10;

}

/* ================= RAMAIS ================= */

if(voz.ramais?.length){

titulo("RAMAIS");

doc.autoTable({

startY:y,

head:[["Ramal","Senha"]],

body:voz.ramais.map(r=>[
r.ramal||"-",
r.senha||"-"
]),

styles:{halign:"center"}

});

y = doc.lastAutoTable.finalY + 10;

}

/* ================= ENTRADAS ================= */

if(voz.entradas?.length){

garantirEspaco(25);
titulo("ENTRADAS");

voz.entradas.forEach(e=>{
linhaCentral("Número: "+e.numero);
});

separador();

}

/* ================= AGENTES ================= */

if(voz.agentes?.length){

titulo("AGENTES");

doc.autoTable({

startY:y,

head:[["Nome","Ramal"]],

body:voz.agentes.map(a=>[
a.nome||"-",
a.ramal||"-"
]),

styles:{halign:"center"}

});

y = doc.lastAutoTable.finalY + 10;

}

/* ================= FILAS ================= */

if(voz.filas?.length){

titulo("FILAS");

doc.autoTable({

startY:y,

head:[["Fila","Agentes"]],

body:voz.filas.map(f=>[
f.nome||"-",
(f.agentes||[]).join(", ")
]),

styles:{halign:"center"}

});

y = doc.lastAutoTable.finalY + 10;

}

/* ================= GRUPO DE RING ================= */

if(voz.grupo_ring?.length){

garantirEspaco(40);
titulo("GRUPO DE RING");

voz.grupo_ring.forEach(g=>{

linhaCentral("Grupo: "+g.nome);
linhaCentral("Estratégia: "+g.estrategia);
linhaCentral("Ramais: "+(g.ramais||[]).join(", "));

y+=4;

});

separador();

}

/* ================= URA ================= */

if(voz.uras?.length){

garantirEspaco(60);
titulo("URA");

voz.uras.forEach(u=>{

linhaCentral("URA: "+u.nome);
linhaCentral("Mensagem: "+u.mensagem);

(u.opcoes||[]).forEach(o=>{
linhaCentral(o.tecla+" -> "+o.destino);
});

y+=5;

});

separador();

}

/* ================= PAUSAS ================= */

if(voz.pausas?.length){

garantirEspaco(40);
titulo("PAUSAS");

voz.pausas.forEach(p=>{

linhaCentral("Grupo: "+(p.grupo||p.nome));

(p.itens||[]).forEach(i=>{
linhaCentral("• "+i.nome+" ("+i.tempo+")");
});

y+=4;

});

separador();

}

/* ================= PESQUISA ================= */

if(voz.pesquisas?.length){

garantirEspaco(60);
titulo("PESQUISA DE SATISFAÇÃO");

voz.pesquisas.forEach(p=>{

linhaCentral("Nome: "+p.nome);
linhaCentral("Introdução: "+p.introducao);
linhaCentral("Pergunta: "+p.pergunta);

(p.respostas||[]).forEach(r=>{
linhaCentral("• "+r.nota+" - "+r.descricao);
});

if(p.encerramento){
linhaCentral("Encerramento: "+p.encerramento);
}

y+=5;

});

separador();

}

/* ================= CHAT ================= */

if(chat){

garantirEspaco(40);
titulo("CHAT / OMNICHANNEL");

linhaCentral("Tipo: "+(chat.tipo||"-"));
linhaCentral("API: "+(chat.api||"-"));
linhaCentral("Conta: "+(chat.conta||"-"));

if(chat.canais?.length){

linhaCentral("Canais:");

chat.canais.forEach(c=>{
linhaCentral("• "+c);
});

}

separador();

}

/* ================= FINAL ================= */

doc.save("caderno-parametros.pdf");

};
