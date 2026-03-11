/* ======================================================
   RESUMO – CHAT (BLINDADO E ESTÁVEL)
====================================================== */
window.renderResumoChat = function (container, data) {
  if (!container || !data?.chat) return;

  const chat = data.chat;
  const usuarios = chat.usuarios || [];
  const agentes = chat.agentes || [];
  const canais = chat.canais || [];

  if (!chat.tipo && !usuarios.length && !agentes.length) return;

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
          ? `<div class="lista">${canais.map(c => `<span class="chip">${c}</span>`).join("")}</div>`
          : ""
      }
    </div>
  `;

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
   GERAR PDF – CADERNO DE PARÂMETROS (CENTRALIZADO)
================================================= */
window.confirmarConfiguracao = function () {

const { jsPDF } = window.jspdf;
const doc = new jsPDF();

const raw = localStorage.getItem("CONFIG_CADERNO");

if (!raw) {
  alert("Nenhuma configuração encontrada.");
  return;
}

const dados = JSON.parse(raw);

let y = 30;

/* ================= TÍTULO ================= */

doc.setFontSize(22);
doc.text("Caderno de Parâmetros",105,20,{align:"center"});

doc.setFontSize(12);
doc.text("Resumo da Configuração do Cliente",105,28,{align:"center"});

/* ================= CLIENTE ================= */

if(dados.cliente){

doc.setFontSize(16);
doc.text("CLIENTE",105,y,{align:"center"});

y+=10;

doc.setFontSize(11);

doc.text(`Empresa: ${dados.cliente.empresa || "-"}`,105,y,{align:"center"});
y+=6;

doc.text(`Domínio: ${dados.cliente.dominio || "-"}`,105,y,{align:"center"});
y+=6;

doc.text(`CNPJ: ${dados.cliente.cnpj || "-"}`,105,y,{align:"center"});

y+=12;

}

/* ================= USUÁRIOS WEB ================= */

if(dados.voz?.usuarios?.length){

doc.text("USUÁRIOS WEB",105,y,{align:"center"});

y+=6;

doc.autoTable({

startY:y,

head:[["Nome","Email","Senha","Permissão"]],

body:dados.voz.usuarios.map(u=>[
u.nome,
u.email,
u.senha,
u.permissao
]),

theme:"grid",

styles:{
fontSize:10,
halign:"center",
valign:"middle"
},

headStyles:{
fillColor:[230,230,230],
textColor:20,
fontStyle:"bold"
},

columnStyles:{
0:{cellWidth:35},
1:{cellWidth:60},
2:{cellWidth:40},
3:{cellWidth:50}
}

});

y = doc.lastAutoTable.finalY + 10;

}

/* ================= RAMAIS ================= */

if(dados.voz?.ramais?.length){

doc.text("RAMAIS",105,y,{align:"center"});

y+=6;

doc.autoTable({

startY:y,

head:[["Ramal","Senha"]],

body:dados.voz.ramais.map(r=>[
r.ramal,
r.senha
]),

theme:"grid",

styles:{halign:"center"}

});

y = doc.lastAutoTable.finalY + 10;

}

/* ================= ENTRADAS ================= */

if(dados.voz?.entradas?.length){

doc.text("ENTRADAS",105,y,{align:"center"});

y+=8;

dados.voz.entradas.forEach(e=>{
doc.text(`Número: ${e.numero}`,105,y,{align:"center"});
y+=6;
});

y+=6;

}

/* ================= AGENTES ================= */

if(dados.voz?.agentes?.length){

doc.text("AGENTES",105,y,{align:"center"});

y+=6;

doc.autoTable({

startY:y,

head:[["Nome","Ramal"]],

body:dados.voz.agentes.map(a=>[
a.nome,
a.ramal
]),

theme:"grid",

styles:{halign:"center"}

});

y = doc.lastAutoTable.finalY + 10;

}

/* ================= FILAS ================= */

if(dados.voz?.filas?.length){

doc.text("FILAS",105,y,{align:"center"});

y+=6;

doc.autoTable({

startY:y,

head:[["Fila","Agentes"]],

body:dados.voz.filas.map(f=>[
f.nome,
(f.agentes || []).join(", ")
]),

theme:"grid",

styles:{halign:"center"}

});

y = doc.lastAutoTable.finalY + 10;

}

/* ================= GRUPO RING ================= */

if(dados.voz?.grupo_ring?.length){

doc.text("GRUPO DE RING",105,y,{align:"center"});

y+=8;

dados.voz.grupo_ring.forEach(g=>{

doc.text(`Grupo: ${g.nome}`,105,y,{align:"center"});
y+=6;

doc.text(`Estratégia: ${g.estrategia}`,105,y,{align:"center"});
y+=6;

doc.text(`Ramais: ${(g.ramais || []).join(", ")}`,105,y,{align:"center"});

y+=10;

});

}

/* ================= URA ================= */

if(dados.voz?.uras?.length){

doc.text("URA",105,y,{align:"center"});

y+=8;

dados.voz.uras.forEach(u=>{

doc.text(`URA: ${u.nome}`,105,y,{align:"center"});
y+=6;

doc.text(`Mensagem: ${u.mensagem}`,105,y,{align:"center"});
y+=6;

(u.opcoes || []).forEach(o=>{
doc.text(`${o.tecla} -> ${o.destino}`,105,y,{align:"center"});
y+=6;
});

y+=6;

});

}

/* ================= PAUSAS ================= */

if(dados.voz?.pausas?.length){

doc.text("PAUSAS",105,y,{align:"center"});

y+=8;

dados.voz.pausas.forEach(p=>{

doc.text(`Grupo: ${p.grupo}`,105,y,{align:"center"});
y+=6;

(p.itens || []).forEach(i=>{
doc.text(`• ${i.nome} (${i.tempo})`,105,y,{align:"center"});
y+=6;
});

y+=6;

});

}

/* ================= PESQUISA ================= */

if(dados.voz?.pesquisas?.length){

doc.text("PESQUISA DE SATISFAÇÃO",105,y,{align:"center"});

y+=8;

dados.voz.pesquisas.forEach(p=>{

doc.text(`Nome: ${p.nome}`,105,y,{align:"center"});
y+=6;

doc.text(`Introdução: ${p.introducao}`,105,y,{align:"center"});
y+=6;

doc.text(`Pergunta: ${p.pergunta}`,105,y,{align:"center"});
y+=6;

(p.respostas || []).forEach(r=>{
doc.text(`• ${r.nota} - ${r.descricao}`,105,y,{align:"center"});
y+=6;
});

if(p.encerramento){
doc.text(`Encerramento: ${p.encerramento}`,105,y,{align:"center"});
y+=6;
}

y+=6;

});

}

/* ================= CHAT ================= */

if(dados.chat){

doc.text("CHAT / OMNICHANNEL",105,y,{align:"center"});

y+=8;

doc.text(`Tipo: ${dados.chat.tipo}`,105,y,{align:"center"});
y+=6;

doc.text(`API: ${dados.chat.api}`,105,y,{align:"center"});
y+=6;

doc.text(`Conta: ${dados.chat.conta}`,105,y,{align:"center"});
y+=6;

if(dados.chat.canais){

doc.text("Canais:",105,y,{align:"center"});
y+=6;

dados.chat.canais.forEach(c=>{
doc.text(`• ${c}`,105,y,{align:"center"});
y+=6;
});

}

}

doc.save("caderno-parametros.pdf");

};
