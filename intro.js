/* ================= INTRO / ONBOARDING ================= */

const introMensagem =
  "Bem-vindo ao Caderno de Parâmetros da ERA.\n\n" +
  "Este assistente foi criado para ajudar você a organizar\n" +
  "e documentar as configurações do seu ambiente de atendimento.\n\n" +
  "Para continuarmos, selecione abaixo o tipo de serviço.";

let pos = 0;

function iniciarIntro() {
  const el = document.getElementById("intro-text");
  if (!el) return;

  el.innerHTML = "";
  pos = 0;

  (function digitar() {
    if (pos >= introMensagem.length) return;
    el.innerHTML += introMensagem[pos] === "\n" ? "<br>" : introMensagem[pos];
    pos++;
    setTimeout(digitar, 30);
  })();
}

/* ================= CONTROLE DE TELAS ================= */

function mostrarIntro() {
  document.getElementById("intro-screen").style.display = "flex";
  document.getElementById("app-content").style.display = "none";
  iniciarIntro();
}

function mostrarApp() {
  document.getElementById("intro-screen").style.display = "none";
  document.getElementById("app-content").style.display = "block";
}

/* ================= BOTÕES ================= */

window.selecionarModo = function (modo) {
  localStorage.setItem("modo_atendimento", modo);
  mostrarApp();
};

window.resetarIntro = function () {
  localStorage.removeItem("modo_atendimento");
  mostrarIntro();
};

/* ================= INIT ================= */

document.addEventListener("DOMContentLoaded", () => {
  const modo = localStorage.getItem("modo_atendimento");
  modo ? mostrarApp() : mostrarIntro();
});
