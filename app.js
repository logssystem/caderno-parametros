/* ================= INTRO / ONBOARDING ================= */

const introMensagem =
  "Bem-vindo ao Caderno de Parâmetros da ERA.\n\n" +
  "Este assistente foi criado para ajudar você a organizar\n" +
  "e documentar as configurações do seu ambiente de atendimento.\n\n" +
  "Para continuarmos, selecione abaixo o tipo de serviço\n" +
  "que será configurado.";

let introPos = 0;

function iniciarIntro() {
  const el = document.getElementById("intro-text");
  if (!el) return;
  el.innerHTML = "";
  introPos = 0;

  (function digitar() {
    if (introPos >= introMensagem.length) return;
    el.innerHTML += introMensagem[introPos] === "\n" ? "<br>" : introMensagem[introPos];
    introPos++;
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

/* ================= BOTÕES DA INTRO ================= */

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

/* ================= CONFIG ================= */

const LIMITE = 600;

const listas = {
  usuario_web: "listaUsuariosWeb",
  entrada: "listaEntradas",
  ura: "listaURAs",
  fila: "listaFilas",
  ring: "listaRings",
  grupo_ring: "listaGrupoRing",
  agente: "listaAgentes"
};

/* ================= ADICIONAR CAMPO ================= */

window.adicionarCampo = function (tipo) {
  const container = document.getElementById(listas[tipo]);
  if (!container || container.children.length >= LIMITE) return;

  const div = document.createElement("div");
  div.className = "campo-descricao";

  const linha = document.createElement("div");
  linha.className = "linha-principal";

  const input = document.createElement("input");
  input.placeholder = `Digite ${tipo.replace("_", " ")}`;
  input.style.flex = "1";

  const btn = document.createElement("button");
  btn.textContent = "✖";
  btn.onclick = () => div.remove();

  linha.append(input, btn);
  div.append(linha);

  const desc = document.createElement("textarea");
  desc.placeholder = "Descrição (opcional)";
  div.append(desc);

  container.append(div);
};

/* ================= RANGE RAMAIS ================= */

window.criarRangeRamais = function () {
  const ini = Number(document.getElementById("ramalInicio").value);
  const fim = Number(document.getElementById("ramalFim").value);
  const container = document.getElementById("listaRings");

  if (!ini || !fim || fim < ini) {
    alert("Range inválido");
    return;
  }

  for (let i = ini; i <= fim; i++) {
    if (container.children.length >= LIMITE) break;

    const div = document.createElement("div");
    div.className = "campo-descricao";

    const linha = document.createElement("div");
    linha.className = "linha-principal";

    const input = document.createElement("input");
    input.value = i;

    const btn = document.createElement("button");
    btn.textContent = "✖";
    btn.onclick = () => div.remove();

    linha.append(input, btn);
    div.append(linha);
    container.append(div);
  }
};

/* ================= EXPLORAR ================= */

window.explorar = function () {
  const dados = {};

  Object.keys(listas).forEach(tipo => {
    const container = document.getElementById(listas[tipo]);
    if (!container) return;

    dados[tipo] = [];
    container.querySelectorAll(".campo-descricao").forEach(c => {
      const nome = c.querySelector("input")?.value || "";
      const desc = c.querySelector("textarea")?.value || "";
      dados[tipo].push({ nome, descricao: desc });
    });
  });

  document.getElementById("resultado").textContent =
    JSON.stringify(dados, null, 2);
};

/* ================= TEMA ================= */

const toggleTheme = document.getElementById("toggleTheme");
if (toggleTheme) {
  toggleTheme.onclick = () => document.body.classList.toggle("dark");
}

console.log("APP.JS RESTAURADO E ESTÁVEL");
