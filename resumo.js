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

   /* ================= CONFIRMAR CONFIGURAÇÃO ================= */

      window.confirmarConfiguracao = function () {
      
        const dados = JSON.parse(localStorage.getItem("CONFIG_CADERNO"));
      
        if (!dados) {
          alert("Nenhuma configuração encontrada");
          return;
        }
      
        gerarPDFTecnico(dados);
      
      };
      
      function gerarPDFTecnico(dados) {
      
        const { jsPDF } = window.jspdf;
      
        const pdf = new jsPDF();
      
        let y = 15;
      
        function linha(texto) {
      
          if (y > 270) {
            pdf.addPage();
            y = 15;
          }
      
          pdf.text(texto, 10, y);
          y += 6;
        }
      
        pdf.setFontSize(16);
        linha("Documento Técnico de Implantação");
      
        pdf.setFontSize(11);
        y += 4;
      
        /* CLIENTE */
      
        linha("CLIENTE");
        linha(`Empresa: ${dados.cliente?.empresa || "-"}`);
         linha(`Domínio: ${dados.cliente?.dominio || "-"}`);
      
        y += 6;
      
        /* USUÁRIOS */
      
        if (dados.voz.usuarios?.length) {
      
          linha("USUÁRIOS WEB");
      
          dados.voz.usuarios.forEach(u => {
            linha(`${u.nome} | ${u.email}`);
          });
      
          y += 4;
        }
      
        /* RAMAIS */
      
        if (dados.voz.ramais?.length) {
      
          linha("RAMAIS");
      
          dados.voz.ramais.forEach(r => {
            linha(`Ramal ${r.ramal}`);
          });
      
          y += 4;
        }
      
        /* AGENTES */
      
        if (dados.voz.agentes?.length) {
      
          linha("AGENTES CALL CENTER");
      
          dados.voz.agentes.forEach(a => {
            linha(`${a.nome} → Ramal ${a.ramal}`);
          });
      
          y += 4;
        }
      
        /* FILAS */
      
        if (dados.voz.filas?.length) {
      
          linha("FILAS");
      
          dados.voz.filas.forEach(f => {
            linha(`Fila: ${f.nome}`);
            linha(`Agentes: ${f.agentes.join(", ")}`);
          });
      
          y += 4;
        }
      
        /* URA */
      
        if (dados.voz.uras?.length) {
      
          linha("URA");
      
          dados.voz.uras.forEach(u => {
      
            linha(`URA: ${u.nome}`);
      
            u.opcoes?.forEach(o => {
              linha(`Tecla ${o.tecla} → ${o.destino}`);
            });
      
            y += 2;
          });
        }
      
        /* CHAT */
      
        if (dados.chat) {
      
          y += 6;
      
          linha("OMNICHANNEL");
          linha(`Tipo: ${dados.chat.tipo}`);
          linha(`API: ${dados.chat.api}`);
          linha(`Conta: ${dados.chat.conta}`);
        }
      
        pdf.save("implantacao_pabx.pdf");
      
      };

   
  /* ================= CHAT ================= */
  window.renderResumoChat(resumo, dados);

});

/* ================= VOLTAR ================= */
window.voltar = function () {
  window.location.href = "index.html"; 
};
