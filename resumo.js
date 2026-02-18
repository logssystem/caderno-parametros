document.addEventListener("DOMContentLoaded", () => {
  /* ================= TEMA ================= */
  const temaSalvo = localStorage.getItem("tema");
  document.body.classList.toggle("dark", temaSalvo === "dark");
  console.log("Tema aplicado no resumo:", temaSalvo);

  /* ================= DADOS ================= */
  const raw = localStorage.getItem("CONFIG_CADERNO");
  if (!raw) {
    console.warn("CONFIG_CADERNO não encontrado");
    return;
  }

  let dados;
  try {
    dados = JSON.parse(raw);
  } catch (e) {
    console.error("Erro ao parsear CONFIG_CADERNO", e);
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
          </p><hr>
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
          <p><b>Ramal:</b> ${r.ramal}<br><b>Senha:</b> <code>${r.senha}</code></p><hr>
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
            <b>Ramal:</b> ${a.ramal}<br>
            <b>Multiskill:</b> ${a.multiskill ? "Sim" : "Não"}
          </p><hr>
        `).join("")}
      </div>
    `;
  }

  /* ================= CHAT ================= */
  if (dados.chat) {
  const chat = dados.chat;

  resumo.innerHTML += `
    <div class="card chat-card">
      <h2>💬 Atendimento por Chat</h2>

      <div class="chat-info">
        <div><strong>Tipo:</strong> ${chat.tipo}</div>
        <div><strong>API:</strong> ${chat.api}</div>
        <div><strong>Conta:</strong> ${chat.conta}</div>
        <div><strong>Canais:</strong> ${(chat.canais || []).join(", ")}</div>
      </div>

      ${
        chat.departamentos?.length
          ? `
            <div class="chat-section">
              <h3>🏷️ Departamentos</h3>
              ${chat.departamentos
                .map(
                  d => `
                    <div class="chat-departamento">
                      <strong>${d.nome}</strong>
                      <ul>
                        ${(d.agentes || []).map(a => `<li>${a}</li>`).join("")}
                      </ul>
                    </div>
                  `
                )
                .join("")}
            </div>
          `
          : ""
      }

      ${
        chat.agentes?.length
          ? `
            <div class="chat-section">
              <h3>🎧 Agentes</h3>
              ${chat.agentes
                .map(
                  a => `
                    <div class="chat-agente">
                      <strong>${a.nome}</strong>
                      <div class="chat-agente-sub">
                        Usuário: ${a.usuario}<br>
                        Departamentos: ${(a.departamentos || []).join(", ")}
                      </div>
                    </div>
                  `
                )
                .join("")}
            </div>
          `
          : ""
      }
    </div>
  `;
}
/* ================= VOLTAR (GLOBAL) ================= */
window.voltar = function () {
  window.location.href = "index.html";
};
