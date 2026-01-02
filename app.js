/* ================= INTRO / ONBOARDING ================= */

const introMensagem =
  "Bem-vindo ao Caderno de Parâmetros da ERA.\n\n" +
  "Este assistente foi criado para ajudar você a organizar\n" +
  "e documentar as configurações do seu ambiente de atendimento.\n\n" +
  "Para continuarmos, selecione abaixo o tipo de serviço\n" +
  "que será configurado.";

let introPosicao = 0;
let introElemento = null;

function iniciarIntro() {
  introElemento = document.getElementById("intro-text");
  if (!introElemento) return;

  introElemento.innerHTML = "";
  introPosicao = 0;
  digitarTexto();
}

function digitarTexto() {
  if (introPosicao >= introMensagem.length) return;

  const char = introMensagem.charAt(introPosicao);
  introElemento.innerHTML += char === "\n" ? "<br>" : char;
  introPosicao++;

  setTimeout(digitarTexto, 30);
}

/* ================= CONTROLE DE TELAS ================= */

function mostrarIntro() {
  const intro = document.getElementById("intro-screen");
  const app = document.getElementById("app-content");

  if (intro) intro.style.display = "flex";
  if (app) app.style.display = "none";

  iniciarIntro();
}

function mostrarApp() {
  const intro = document.getElementById("intro-screen");
  const app = document.getElementById("app-content");

  if (intro) intro.style.display = "none";
  if (app) app.style.display = "block";
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
  const modoSalvo = localStorage.getItem("modo_atendimento");
  modoSalvo ? mostrarApp() : mostrarIntro();
});

console.log("APP.JS FINAL – ESTÁVEL");

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

const PERMISSOES = [
  "Administrador do Módulo de PABX",
  "Agente de Call Center",
  "Supervisor(a) de Call Center",
  "CRM",
  "CRM Owner",
  "Administrador do Módulo de Omnichannel",
  "Agente Omnichannel",
  "Supervisor(a) Omnichannel",
  "Super Administrador"
];

const MAPA_PERMISSOES = {
  pabx: PERMISSOES[0],
  agente: PERMISSOES[1],
  supervisor: PERMISSOES[2],
  crm: PERMISSOES[3],
  crm_owner: PERMISSOES[4],
  omni: PERMISSOES[5],
  agente_omni: PERMISSOES[6],
  super_omni: PERMISSOES[7],
  super_admin: PERMISSOES[8]
};

/* ================= ADICIONAR CAMPO ================= */

window.adicionarCampo = function (tipo) {
  const container = document.getElementById(listas[tipo]);
  if (!container || container.children.length >= LIMITE) return;
  container.appendChild(criarCampo(tipo));
};

/* ================= CRIAR CAMPO ================= */

function criarCampo(tipo) {
  const wrap = document.createElement("div");
  wrap.className = "campo-descricao";

  const linhaNome = document.createElement("div");
  linhaNome.className = "linha-principal";

  const nome = document.createElement("input");
  nome.placeholder = `Digite ${tipo.replace("_", " ")}`;
  nome.style.width = "100%";

  const btn = document.createElement("button");
  btn.textContent = "✖";
  btn.onclick = () => wrap.remove();

  linhaNome.append(nome, btn);
  wrap.append(linhaNome);

  let emailInput = null;
  let senhaInput = null;
  let permissao = null;
  let regras = null;
  let senhaOk = true;

  function validarSenha(input, regrasEl) {
    const v = input.value;
    senhaOk =
      v.length >= 11 &&
      /[A-Z]/.test(v) &&
      /\d/.test(v) &&
      /[^A-Za-z0-9]/.test(v);

    regrasEl.innerHTML = senhaOk
      ? `<div class="regra-ok">Senha válida</div>`
      : `<div class="regra-erro">Mín. 11 | Maiúscula | Número | Especial</div>`;
  }

  if (tipo === "usuario_web") {
    const linhaCred = document.createElement("div");
    linhaCred.className = "linha-principal";
    linhaCred.style.marginTop = "12px";

    emailInput = document.createElement("input");
    emailInput.type = "email";
    emailInput.placeholder = "E-mail do usuário";

    senhaInput = document.createElement("input");
    senhaInput.placeholder = "Senha do usuário";
    senhaInput.className = "campo-senha";

    linhaCred.append(emailInput, senhaInput);
    wrap.append(linhaCred);

    permissao = document.createElement("select");
    permissao.className = "campo-permissao";

    const opt = new Option("Selecione a permissão", "");
    opt.disabled = true;
    opt.selected = true;
    permissao.appendChild(opt);

    PERMISSOES.forEach(p => permissao.add(new Option(p, p)));
    wrap.append(permissao);

    regras = document.createElement("div");
    wrap.append(regras);

    senhaInput.oninput = () => validarSenha(senhaInput, regras);
  }

  if (tipo === "ring") {
    senhaInput = document.createElement("input");
    senhaInput.placeholder = "Senha do ramal";
    senhaInput.className = "campo-senha";
    wrap.append(senhaInput);

    regras = document.createElement("div");
    wrap.append(regras);

    senhaInput.oninput = () => validarSenha(senhaInput, regras);
  }

  const desc = document.createElement("textarea");
  desc.placeholder = "Descrição (opcional)";
  wrap.append(desc);

  wrap.validarSenha = () => senhaOk;
  wrap.getNome = () => nome.value;
  wrap.getEmail = () => emailInput?.value || "";
  wrap.getSenha = () => senhaInput?.value || "";
  wrap.getPermissao = () => permissao?.value || "";

  return wrap;
}

/* ================= EXPLORAR ================= */

window.explorar = function () {
  const dados = {};

  Object.keys(listas).forEach(tipo => {
    const container = document.getElementById(listas[tipo]);
    if (!container) return;

    dados[tipo] = [];

    container.querySelectorAll(".campo-descricao").forEach(c => {
      if ((tipo === "usuario_web" || tipo === "ring") && !c.validarSenha()) return;

      const item = {
        nome: c.getNome(),
        descricao: c.querySelector("textarea")?.value || ""
      };

      if (tipo === "usuario_web") {
        item.email = c.getEmail();
        item.senha = c.getSenha();
        item.permissao = c.getPermissao();
      }

      if (tipo === "ring") item.senha = c.getSenha();

      dados[tipo].push(item);
    });
  });

  document.getElementById("resultado").textContent =
    JSON.stringify(dados, null, 2);
};

/* ================= TEMA ================= */

const toggleTheme = document.getElementById("toggleTheme");
if (toggleTheme) {
  toggleTheme.onclick = () => {
    document.body.classList.toggle("dark");
  };
}
