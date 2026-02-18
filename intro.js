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

function selecionarModo(modo) {
  document.getElementById("intro-screen").style.display = "none";
  document.getElementById("app-content").style.display = "block";

  const voz = document.getElementById("voz-area");
  const chat = document.getElementById("chat-area");

  voz.style.display = "none";
  chat.style.display = "none";

  window.chatState = window.chatState || {};

  if (modo === "voz") {
    voz.style.display = "block";
    window.chatState.tipo = null;
    atualizarModuloChat();
  }

  if (modo === "chat") {
    chat.style.display = "block";
    window.chatState.tipo = "api";
    atualizarModuloChat();
  }

  if (modo === "ambos") {
    voz.style.display = "block";
    chat.style.display = "block";
    window.chatState.tipo = "api";
    atualizarModuloChat();
  }
}

/* ================= AÇÕES ================= */

window.selecionarModo = modo => {
  localStorage.setItem("modo_atendimento", modo);
  mostrarApp(modo);
};

window.resetarIntro = () => {
  localStorage.removeItem("modo_atendimento");
  mostrarIntro();
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

/* ================= DARK MODE (INTRO) ================= */

(function aplicarTemaIntro() {
  const tema = localStorage.getItem("tema_caderno") || "light";

  if (tema === "dark") {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
})();
