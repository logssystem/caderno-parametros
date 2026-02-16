document.addEventListener("DOMContentLoaded", () => {
  const raw = localStorage.getItem("CONFIG_CADERNO");
  if (!raw) return;

  let dados;
  try {
    dados = JSON.parse(raw);
  } catch (e) {
    console.error("Erro ao ler CONFIG_CADERNO", e);
    return;
  }

  const resumo = document.getElementById("resumo");
  if (!resumo) return;

  resumo.innerHTML = "";

  /* ================= CLIENTE ================= */

  if (dados.cliente) {
    resumo.innerHTML += `
      <div class="card">
        <h2>🏢 Dados do Cliente</h2>
        <p><b>Empresa:</b> ${dados.cliente.empresa || "-"}</p>
        <p><b>Domínio:</b> ${dados.cliente.dominio || "-"}</p>
        <p><b>CNPJ:</b> ${dados.cliente.cnpj || "-"}</p>
      </div>
    `;
  }

  const voz = dados.voz || {};

  /* ================= USUÁRIOS ================= */

  if (voz.usuarios?.length) {
    resumo.innerHTML += `
      <div class="card">
        <h2>👤 Usuários Web</h2>
        ${voz.usuarios.map(u => `
          <p>
            <b>Nome:</b> ${u.nome}<br>
            <b>Email:</b> ${u.email}<br>
            <b>Permissão:</b> ${u.permissao}<br>
            <b>Agente:</b> ${u.agente ? "Sim" : "Não"}
          </p>
          <hr>
        `).join("")}
      </div>
    `;
  }

  /* ================= RAMAIS ================= */

  if (voz.ramais?.length) {
    resumo.innerHTML += `
      <div class="card">
        <h2>📞 Ramais</h2>
        ${voz.ramais.map(r => `
          <p>
            <b>Ramal:</b> ${r.ramal}<br>
            <b>Senha:</b> <code>${r.senha || "-"}</code>
          </p>
          <hr>
        `).join("")}
      </div>
    `;
  }

  /* ================= AGENTES ================= */

  if (voz.agentes?.length) {
    resumo.innerHTML += `
      <div class="card">
        <h2>🎧 Agentes</h2>
        ${voz.agentes.map(a => `
          <p>
            <b>Nome:</b> ${a.nome}<br>
            <b>Ramal:</b> ${a.ramal}
          </p>
          <hr>
        `).join("")}
      </div>
    `;
  }

  /* ================= FILAS ================= */

  if (voz.filas?.length) {
    resumo.innerHTML += `
      <div class="card">
        <h2>👥 Filas</h2>
        ${voz.filas.map(f => `
          <p>
            <b>Fila:</b> ${f.nome}<br>
            <b>Agentes:</b> ${f.agentes?.length ? f.agentes.join(", ") : "Nenhum"}
          </p>
          <hr>
        `).join("")}
      </div>
    `;
  }

  /* ================= REGRAS DE TEMPO ================= */

  if (voz.regras_tempo?.length) {
    resumo.innerHTML += `
      <div class="card">
        <h2>⏰ Regras de Tempo</h2>
        ${voz.regras_tempo.map(r => `
          <p>
            <b>Nome:</b> ${r.nome}<br>
            <b>Dias:</b> ${r.dias.join(", ")}<br>
            <b>Horário:</b> ${r.hora_inicio} → ${r.hora_fim}
          </p>
          <hr>
        `).join("")}
      </div>
    `;
  }

  /* ================= URA ================= */

  if (voz.uras?.length) {
    resumo.innerHTML += `
      <div class="card">
        <h2>☎ URAs</h2>
        ${voz.uras.map(u => `
          <p>
            <b>Nome:</b> ${u.nome}<br>
            <b>Mensagem:</b> ${u.mensagem || "-"}<br>
            <b>Opções:</b><br>
            ${u.opcoes.map(o =>
              `• Tecla ${o.tecla} → ${o.destino} ${o.descricao ? `(${o.descricao})` : ""}`
            ).join("<br>")}
          </p>
          <hr>
        `).join("")}
      </div>
    `;
  }

  /* ================= GRUPO DE RING ================= */

  if (voz.grupo_ring?.length) {
    resumo.innerHTML += `
      <div class="card">
        <h2>🔔 Grupo de Ring</h2>
        ${voz.grupo_ring.map(g => `
          <p>
            <b>Nome:</b> ${g.nome}<br>
            <b>Estratégia:</b> ${g.estrategia}<br>
            <b>Ramais:</b> ${g.ramais.join(", ")}
          </p>
          <hr>
        `).join("")}
      </div>
    `;
  }

  /* ================= ENTRADAS ================= */

  if (voz.entradas?.length) {
    resumo.innerHTML += `
      <div class="card">
        <h2>📲 Números de Entrada</h2>
        ${voz.entradas.map(e => `
          <p><b>Número:</b> ${e.numero}</p>
          <hr>
        `).join("")}
      </div>
    `;
  }

  /* ================= PAUSAS ================= */

  if (voz.pausas && voz.pausas.itens?.length) {
  resumo.innerHTML += `
    <div class="card">
      <h2>⏸️ Pausas do Call Center</h2>
      <p><b>Grupo:</b> ${voz.pausas.grupo}</p>
      <ul>
        ${voz.pausas.itens.map(p => `<li>${p.nome}</li>`).join("")}
      </ul>
    </div>
  `;
}

  /* ================= PESQUISA ================= */

  if (voz.pesquisaSatisfacao) {
    const p = voz.pesquisaSatisfacao;

    resumo.innerHTML += `
      <div class="card">
        <h2>⭐ Pesquisa de Satisfação</h2>
        <p><b>Status:</b> ${p.ativa ? "Ativa" : "Inativa"}</p>
        <p><b>Nome:</b> ${p.nome || "-"}</p>
        <p><b>Pergunta:</b> ${p.pergunta || "-"}</p>
        <p><b>Respostas:</b></p>
        ${p.respostas?.length
          ? p.respostas.map(r => `<p>• ${r.nota} - ${r.descricao}</p>`).join("")
          : "<p>Nenhuma resposta configurada</p>"
        }
      </div>
    `;
  }

  /* ================= CHAT ================= */

  if (dados.chat) {
    resumo.innerHTML += `
      <div class="card">
        <h2>💬 Chat / Omnichannel</h2>
        <p><b>Tipo:</b> ${dados.chat.tipo}</p>
        <p><b>API:</b> ${dados.chat.api || "-"}</p>
        <p><b>Conta:</b> ${dados.chat.conta || "-"}</p>
        <p><b>Canais:</b> ${dados.chat.canais?.join(", ") || "-"}</p>
      </div>
    `;
  }
});

/* ================= VOLTAR ================= */

function voltar() {
  window.location.href = "index.html";
}
