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
   GERAR PDF – CADERNO DE PARÂMETROS
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
  const voz = dados.voz || null;
  const chat = dados.chat || null;

  let y = 25;

  function verificarEspaco(altura){
    if(y + altura > 280){
      doc.addPage();
      y = 25;
    }
  }

  /* protege blocos grandes */
  function verificarBloco(linhas){
    const altura = linhas * 7 + 15;
    if(y + altura > 280){
      doc.addPage();
      y = 25;
    }
  }

  function titulo(txt){
    verificarEspaco(20);
    y += 8;
    doc.setFontSize(16);
    doc.setFont(undefined,"bold");
    doc.text(txt,12,y);
    y += 10;
    doc.setFont(undefined,"normal");
    doc.setFontSize(11);
  }

  function linha(txt){
    verificarEspaco(10);
    doc.text(String(txt),14,y);
    y += 7;
  }

  function tabela(a,b,c,d){
    verificarEspaco(10);
    doc.text(String(a || "-"),14,y);
    doc.text(String(b || "-"),70,y);
    if(c) doc.text(String(c),120,y);
    if(d) doc.text(String(d),170,y);
    y += 7;
  }

  function separador(){
    verificarEspaco(10);
    doc.line(12,y,198,y);
    y += 10;
  }

  /* CAPA */

  doc.setFontSize(22);
  doc.setFont(undefined,"bold");
  doc.text("Caderno de Parâmetros",12,18);

  doc.setFontSize(12);
  doc.setFont(undefined,"normal");
  doc.text("Resumo da Configuração do Cliente",12,26);

  y = 40;

  /* CLIENTE */

  if(dados.cliente){
    titulo("CLIENTE");
    linha(`Empresa: ${dados.cliente.empresa || "-"}`);
    linha(`Domínio: ${dados.cliente.dominio || "-"}`);
    linha(`CNPJ: ${dados.cliente.cnpj || "-"}`);
    separador();
  }

  /* ================= VOZ ================= */

  if(voz){

    if(voz.usuarios?.length){
      titulo("USUÁRIOS WEB");
      tabela("Nome","Email","Senha","Permissão");
      voz.usuarios.forEach(u=>{
        tabela(u.nome,u.email,u.senha,u.permissao);
      });
      separador();
    }

    if(voz.ramais?.length){
      titulo("RAMAIS");
      tabela("Ramal","Senha");
      voz.ramais.forEach(r=>{
        tabela(String(r.ramal),r.senha);
      });
      separador();
    }

    if(voz.entradas?.length){
      titulo("ENTRADAS");
      voz.entradas.forEach(e=>{
        linha(`Número: ${e.numero}`);
      });
      separador();
    }

    if(voz.agentes?.length){
      titulo("AGENTES");
      tabela("Nome","Ramal");
      voz.agentes.forEach(a=>{
        tabela(a.nome,String(a.ramal));
      });
      separador();
    }

    if(voz.filas?.length){
      titulo("FILAS");
      tabela("Fila","Agentes");
      voz.filas.forEach(f=>{
        tabela(f.nome,(f.agentes || []).join(", "));
      });
      separador();
    }

    if(voz.grupo_ring?.length){
      titulo("GRUPO DE RING");
      voz.grupo_ring.forEach(g=>{
        linha(`Grupo: ${g.nome}`);
        linha(`Estratégia: ${g.estrategia}`);
        linha(`Ramais: ${(g.ramais || []).join(", ")}`);
        y += 4;
      });
      separador();
    }

    /* URA protegida */

    if(voz.uras?.length){

      let linhasURA = 3;
      voz.uras.forEach(u=>{
        linhasURA += (u.opcoes || []).length + 2;
      });

      verificarBloco(linhasURA);

      titulo("URA");

      voz.uras.forEach(u=>{
        linha(`URA: ${u.nome}`);
        linha(`Mensagem: ${u.mensagem}`);

        (u.opcoes || []).forEach(o=>{
          linha(o.tecla + " -> " + o.destino);
        });

        y += 5;
      });

      separador();
    }

    if(voz.regras_tempo?.length){
      titulo("REGRAS DE TEMPO");

      voz.regras_tempo.forEach(r=>{
        linha(`Regra: ${r.nome}`);
        linha(`Dias: ${(r.dias || []).join(", ")}`);
        linha(`Horário: ${(r.hora_inicio || r.inicio || "-")} -> ${(r.hora_fim || r.fim || "-")}`);
        linha(`Destino: ${r.destino || "-"}`);
        y += 5;
      });

      separador();
    }

    /* PAUSAS protegida */

    if(voz.pausas?.length){

      let linhasPausa = 2;

      voz.pausas.forEach(p=>{
        linhasPausa += (p.itens || []).length + 1;
      });

      verificarBloco(linhasPausa);

      titulo("PAUSAS");

      voz.pausas.forEach(p=>{
        linha(`Grupo: ${p.grupo || p.nome || "-"}`);

        (p.itens || []).forEach(i=>{
          linha(`• ${(i.nome || "-")} (${i.tempo || "-"})`);
        });

        y += 4;
      });

      separador();
    }

    /* PESQUISA protegida */

    if(voz.pesquisas?.length){

      let linhasPesquisa = 4;

      voz.pesquisas.forEach(p=>{
        linhasPesquisa += (p.respostas || []).length + 2;
      });

      verificarBloco(linhasPesquisa);

      titulo("PESQUISA DE SATISFAÇÃO");

      voz.pesquisas.forEach(p=>{

        linha(`Nome: ${p.nome}`);
        linha(`Introdução: ${p.introducao || "-"}`);
        linha(`Pergunta: ${p.pergunta || "-"}`);

        (p.respostas || []).forEach(r=>{
          linha(`• ${r.nota || "-"} - ${r.descricao || "-"}`);
        });

        if(p.encerramento){
          linha(`Encerramento: ${p.encerramento}`);
        }

        y += 5;
      });

      separador();
    }

  }

  /* ================= CHAT ================= */

  if(chat){

    titulo("CHAT / OMNICHANNEL");

    linha(`Tipo: ${chat.tipo || "-"}`);
    linha(`API: ${chat.api || "-"}`);
    linha(`Conta: ${chat.conta || "-"}`);

    if(chat.canais?.length){
      linha("Canais:");
      chat.canais.forEach(c=>{
        linha(`• ${c}`);
      });
    }

    separador();

    if(chat.usuarios?.length){
      titulo("USUÁRIOS CHAT");
      tabela("Nome","Email","Senha","Permissão");

      chat.usuarios.forEach(u=>{
        tabela(u.nome,u.email,u.senha,u.permissao);
      });

      separador();
    }

    if(chat.agentes?.length){

      verificarBloco(chat.agentes.length * 2);

      titulo("AGENTES CHAT");

      chat.agentes.forEach(a=>{

        linha(`Agente: ${a.nome}`);

        if(a.departamentos?.length){
          linha(`Departamentos: ${a.departamentos.join(", ")}`);
        }

        y += 3;
      });

      separador();
    }

    if(chat.departamentos?.length){
      titulo("DEPARTAMENTOS");

      chat.departamentos.forEach(d=>{
        linha(`Departamento: ${d.nome}`);

        if(d.agentes?.length){
          linha(`Agentes: ${d.agentes.join(", ")}`);
        }

        y += 3;
      });
    }

  }

  doc.save("caderno-parametros.pdf");

};
