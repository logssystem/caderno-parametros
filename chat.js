const chatState = {
  tipo: null,
  api: null
};

function limparAtivos(grupo) {
  grupo.forEach(el => el.classList.remove("active"));
}

window.selecionarTipoChat = function (el, tipo) {
  chatState.tipo = tipo;

  const cards = document.querySelectorAll(".chat-section .chat-card");
  limparAtivos(cards);
  el.classList.add("active");

  document.getElementById("api-oficial").style.display =
    tipo === "api" ? "block" : "none";

  document.getElementById("chat-qr").style.display =
    tipo === "qr" ? "block" : "none";
};

window.selecionarApi = function (el, api) {
  chatState.api = api;

  const cards = document.querySelectorAll("#api-oficial .chat-card");
  limparAtivos(cards);
  el.classList.add("active");
};
