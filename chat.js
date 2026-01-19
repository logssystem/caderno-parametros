const chatState = {
  tipo: null,
  api: null,
  conta: null,
  canais: []
};

function limparAtivos(selector) {
  document.querySelectorAll(selector).forEach(el =>
    el.classList.remove("active")
  );
}

/* ========== TIPO DE CHAT ========== */
window.selecionarTipoChat = function (el, tipo) {
  chatState.tipo = tipo;

  limparAtivos(".chat-section:first-of-type .chat-card");
  el.classList.add("active");

  document.getElementById("api-oficial").style.display = tipo === "api" ? "block" : "none";
  document.getElementById("chat-canais").style.display = tipo === "api" ? "block" : "none";
  document.getElementById("chat-qr").style.display = tipo === "qr" ? "block" : "none";

  const blocoConta = document.getElementById("bloco-conta-api");
  if (blocoConta) blocoConta.style.display = tipo === "api" ? "block" : "none";

  chatState.api = null;
  chatState.conta = null;
  chatState.canais = [];

  limparAtivos("#api-oficial .chat-card");
  limparAtivos("#bloco-conta-api .chat-card");
  limparAtivos("#chat-canais .chat-card");
};

/* ========== API ========== */
window.selecionarContaApi = function (el, conta) {
  chatState.conta = conta;

  document.querySelectorAll("#bloco-conta-api .chat-card")
    .forEach(c => c.classList.remove("active"));

  el.classList.add("active");
};

/* ========== CONTA ========== */
window.selecionarContaApi = function (el, conta) {
  chatState.conta = conta;

  document.querySelectorAll("#bloco-conta-api .chat-card")
    .forEach(c => c.classList.remove("active"));

  el.classList.add("active");
};

/* ========== CANAIS ========== */
window.toggleCanal = function (el) {
  el.classList.toggle("active");

  const canal = el.dataset.canal;

  if (!chatState.canais) chatState.canais = [];

  if (el.classList.contains("active")) {
    if (!chatState.canais.includes(canal)) {
      chatState.canais.push(canal);
    }
  } else {
    chatState.canais = chatState.canais.filter(c => c !== canal);
  }
};
