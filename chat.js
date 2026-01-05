const chatState = {
  tipo: null,
  api: null,
  canais: []
};

function limparAtivos(selector) {
  document.querySelectorAll(selector).forEach(el =>
    el.classList.remove("active")
  );
}

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
};

window.selecionarApi = function (el, api) {
  chatState.api = api;
  limparAtivos("#api-oficial .chat-card");
  el.classList.add("active");
};

window.toggleCanal = function (el) {
  el.classList.toggle("active");
};
