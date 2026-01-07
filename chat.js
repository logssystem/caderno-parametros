const chatState = {
  tipo: null,
  api: null,
  conta: null, // 👈 NOVO (cliente | era)
  canais: []
};

function limparAtivos(selector) {
  document.querySelectorAll(selector).forEach(el =>
    el.classList.remove("active")
  );
}

/* ========== TIPO DE CHAT (API / QR) ========== */

window.selecionarTipoChat = function (el, tipo) {
  chatState.tipo = tipo;

  limparAtivos(".chat-section:first-of-type .chat-card");
  el.classList.add("active");

  document.getElementById("api-oficial").style.display =
    tipo === "api" ? "block" : "none";

  document.getElementById("chat-canais").style.display =
    tipo === "api" ? "block" : "none";

  document.getElementById("chat-qr").style.display =
    tipo === "qr" ? "block" : "none";

  // 👇 mostra/esconde bloco de conta
  const blocoConta = document.getElementById("bloco-conta-api");
  if (blocoConta) {
    blocoConta.style.display = tipo === "api" ? "block" : "none";
  }

  chatState.conta = null;
  limparAtivos("#bloco-conta-api .chat-card");
};

/* ========== FORNECEDOR API ========== */

window.selecionarApi = function (el, api) {
  chatState.api = api;
  limparAtivos("#api-oficial .chat-card");
  el.classList.add("active");
};

/* ========== CONTA DA API ========== */

window.selecionarContaApi = function (el, conta) {
  chatState.conta = conta;
  limparAtivos("#bloco-conta-api .chat-card");
  el.classList.add("active");
};

/* ========== CANAIS ========== */

window.toggleCanal = function (el) {
  el.classList.toggle("active");

  const canal = el.dataset.canal;

  if (el.classList.contains("active")) {
    if (!chatState.canais.includes(canal)) {
      chatState.canais.push(canal);
    }
  } else {
    chatState.canais = chatState.canais.filter(c => c !== canal);
  }
};
