const introMensagem =
  "Bem-vindo ao Caderno de Parâmetros da ERA.\n\n" +
  "Este assistente foi criado para ajudar você a organizar\n" +
  "e documentar as configurações do seu ambiente de atendimento.\n\n" +
  "Selecione o tipo de serviço para continuar.";

let pos = 0;
let digitando = false;

/* ================= INTRO ================= */

function iniciarIntro() {
  const el = document.getElementById("intro-text");
  if (!el || digitando) return;

  el.innerHTML = "";
  pos = 0;
  digitando = true;

  (function digitar() {
    if (pos >= introMensagem.length) {
      digitando = false;
      return;
    }

    el.innerHTML += introMensagem[pos] === "\n"
      ? "<br>"
      : introMensagem[pos];

    pos++;
    setTimeout(digitar, 30);
  })();
}

function mostrarIntro() {
  const intro = document.getElementById("intro-screen");
  const app = document.getElementById("app-content");

  if (intro) intro.style.display = "flex";
  if (app) app.style.display = "none";

  iniciarIntro();
}

function mostrarApp(modo) {
  const intro = document.getElementById("intro-screen");
  const app = document.getElementById("app-content");
  const voz = document.getElementById("voz-area");
  const chat = document.getElementById("chat-area");

  if (intro) intro.style.display = "none";
  if (app) app.style.display = "block";

  // sempre limpa primeiro
  if (voz) voz.style.display = "none";
  if (chat) chat.style.display = "none";

  if (modo === "voz" || modo === "ambos") {
    if (voz) voz.style.display = "block";
  }

  if (modo === "chat" || modo === "ambos") {
    if (chat) chat.style.display = "block";
  }
}

/* ================= AÇÕES ================= */

window.selecionarModo = modo => {
  localStorage.setItem("modo_atendimento", modo);
  mostrarApp(modo);
};

window.resetarIntro = () => {
  // limpa modo
  localStorage.removeItem("modo_atendimento");

  // limpa estado de chat
  delete window.chatState;

  // esconde áreas
  const voz = document.getElementById("voz-area");
  const chat = document.getElementById("chat-area");
  const app = document.getElementById("app-content");
  const intro = document.getElementById("intro-screen");

  if (voz) voz.style.display = "none";
  if (chat) chat.style.display = "none";
  if (app) app.style.display = "none";
  if (intro) intro.style.display = "flex";

  iniciarIntro();
};

/* ================= INIT ================= */

document.addEventListener("DOMContentLoaded", () => {
  const modo = localStorage.getItem("modo_atendimento");

  if (modo === "voz" || modo === "chat" || modo === "ambos") {
    mostrarApp(modo);
  } else {
    mostrarIntro();
  }
});
