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
  if (!el) return;

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

  if (voz) {
    voz.style.display =
      modo === "voz" || modo === "ambos" ? "block" : "none";
  }

  if (chat) {
    chat.style.display =
      modo === "chat" || modo === "ambos" ? "block" : "none";
  }
}

/* ================= AÇÕES ================= */

document.addEventListener("DOMContentLoaded", () => {
  const modo = localStorage.getItem("modo_atendimento");

  if (modo === "voz" || modo === "chat" || modo === "ambos") {
    mostrarApp(modo);
  } else {
    mostrarIntro();
  }
});

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
