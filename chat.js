let chatConfig = {
  tipo: null,
  api: null,
  canais: []
};

window.selecionarChatTipo = tipo => {
  chatConfig.tipo = tipo;

  document.getElementById("chat-api-opcoes").style.display =
    tipo === "api" ? "block" : "none";

  document.getElementById("chat-canais").style.display = "block";
};

window.selecionarApi = api => {
  chatConfig.api = api;
};

document.querySelectorAll("#chat-canais input[type=checkbox]").forEach(cb => {
  cb.addEventListener("change", () => {
    chatConfig.canais = Array.from(
      document.querySelectorAll("#chat-canais input:checked")
    ).map(c => c.value);
  });
});
