/* ================= INTRO ================= */

const introMensagem =
  "Bem-vindo ao Caderno de Parâmetros da ERA.\n\n" +
  "Este assistente foi criado para ajudar você a organizar\n" +
  "e documentar as configurações do seu ambiente.\n\n" +
  "Selecione o tipo de serviço para continuar.";

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

/* ================= TELAS ================= */

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

window.selecionarModo = modo => {
  localStorage.setItem("modo_atendimento", modo);
  mostrarApp();
};

window.resetarIntro = () => {
  localStorage.removeItem("modo_atendimento");
  mostrarIntro();
};

/* ================= INIT ================= */

document.addEventListener("DOMContentLoaded", () => {
  const modo = localStorage.getItem("modo_atendimento");
  modo ? mostrarApp() : mostrarIntro();
});

/* ================= TEMA ================= */

const toggleTheme = document.getElementById("toggleTheme");
if (toggleTheme) {
  toggleTheme.onclick = () => document.body.classList.toggle("dark");
}

console.log("APP.JS OK");
