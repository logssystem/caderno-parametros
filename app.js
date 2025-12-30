aça o seguinte corrija tudo e me mande 

js

console.log("APP.JS FINAL 600+ COM IMPORTAÇÃO");

/* =========================
   CONFIGURAÇÕES
========================= */
const LIMITE = 600;

const listas = {
  usuario_web: "listaUsuariosWeb",
  entrada: "listaEntradas",
  ura: "listaURAs",
  fila: "listaFilas",
  ring: "listaRings",
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

/* =========================
   ADICIONAR CAMPO
========================= */
window.adicionarCampo = function (tipo) {
  const container = document.getElementById(listas[tipo]);
  if (!container) return;

  if (container.children.length >= LIMITE) {
    mostrarToast(`Limite máximo de ${LIMITE} itens atingido`, true);
    return;
  }

  container.appendChild(criarCampo(tipo));
};

/* =========================
   CRIAR CAMPO
========================= */
function criarCampo(tipo) {
  const wrap = document.createElement("div");
  wrap.className = "campo-descricao";

  const linha = document.createElement("div");
  linha.className = "linha-principal";

  const nome = document.createElement("input");
  nome.type = "text";
  nome.placeholder = `Digite ${tipo.replace("_", " ")}`;

  const btn = document.createElement("button");
  btn.textContent = "✖";
  btn.type = "button";
  btn.onclick = () => wrap.remove();

  linha.append(nome, btn);
  wrap.append(linha);

  /* ===== USUÁRIO WEB ===== */
  let senhaInput, regrasBox, permissao;
  let senhaValidaAtual = false;

  if (tipo === "usuario_web") {
    // SENHA
    senhaInput = document.createElement("input");
    senhaInput.type = "text";
    senhaInput.className = "campo-senha";
    senhaInput.placeholder = "Senha do usuário";

    regrasBox = document.createElement("div");
    regrasBox.className = "regras-senha";

    senhaInput.addEventListener("input", () => {
      const v = senhaInput.value;
      regrasBox.innerHTML = "";
      senhaInput.classList.remove("senha-invalida");
      senhaValidaAtual = false;

      if (v.length < 11) return erroSenha("A senha deve ter pelo menos 11 caracteres.");
      if (!/[A-Z]/.test(v)) return erroSenha("A senha deve conter pelo menos uma letra maiúscula.");
      if (!/\d/.test(v)) return erroSenha("A senha deve conter pelo menos um número.");
      if (!/[^A-Za-z0-9]/.test(v))
        return erroSenha("A senha deve conter pelo menos um caractere especial (como @, #, $, etc.).");

      regrasBox.innerHTML = `<div class="regra-ok">A senha é segura!</div>`;
      senhaValidaAtual = true;
      ajustarLarguraSenha(senhaInput, v.length);
    });

    function erroSenha(msg) {
      regrasBox.innerHTML = `<div class="regra-erro">${msg}</div>`;
      senhaInput.classList.add("senha-invalida");
      ajustarLarguraSenha(senhaInput, senhaInput.value.length);
    }

    // PERMISSÃO
    permissao = document.createElement("select");
    permissao.className = "campo-permissao";

    const optDefault = document.createElement("option");
    optDefault.textContent = "Selecione a permissão";
    optDefault.disabled = true;
    optDefault.selected = true;
    permissao.appendChild(optDefault);

    PERMISSOES.forEach(p => permissao.add(new Option(p, p)));

    wrap.append(senhaInput, permissao, regrasBox);
  }

  const desc = document.createElement("textarea");
  desc.placeholder = "Descrição (opcional)";
  wrap.append(desc);

  /* HELPERS DO CAMPO */
  wrap.validarSenha = () => (senhaInput ? senhaValidaAtual : true);
  wrap.getSenha = () => (senhaInput ? senhaInput.value : "");
  wrap.getPermissao = () => (permissao ? permissao.value : "");

  return wrap;
}

/* =========================
   AJUSTE DE LARGURA DA SENHA
========================= */
function ajustarLarguraSenha(input, len) {
  input.style.width =
    len > 14 ? "100%" :
    len > 10 ? "75%" :
    "50%";
}

/* =========================
   IMPORTAÇÃO CSV
========================= */
window.acionarImportacao = function (tipo) {
  const input = document.getElementById(
    tipo === "usuario_web" ? "importUsuarios" : "importRamais"
  );

  if (!input) return;

  input.click();

  input.onchange = () => {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => processarCSV(tipo, e.target.result);
    reader.readAsText(file);
  };
};

function processarCSV(tipo, texto) {
  const linhas = texto.split("\n").slice(1);
  const container = document.getElementById(listas[tipo]);
  if (!container) return;

  linhas.forEach(linha => {
    const dados = linha.split(",").map(v => v.trim());
    if (!dados[0]) return;

    const campo = criarCampo(tipo);
    campo.querySelector("input[type=text]").value = dados[0];

    if (tipo === "usuario_web") {
      const senha = campo.querySelector(".campo-senha");
      const perm = campo.querySelector(".campo-permissao");
      if (senha) senha.value = dados[1] || "";
      if (perm) perm.value = dados[2] || "";
    }

    container.appendChild(campo);
  });

  mostrarToast("Importação concluída com sucesso!");
}

/* =========================
   EXPORTAR / EXPLORAR
========================= */
window.explorar = function () {
  const dados = {};
  let erroSenha = false;

  Object.keys(listas).forEach(tipo => {
    dados[tipo] = [];
    const container = document.getElementById(listas[tipo]);
    if (!container) return;

    container.querySelectorAll(".campo-descricao").forEach(campo => {
      const nome = campo.querySelector("input[type=text]")?.value;
      if (!nome) return;

      if (tipo === "usuario_web" && !campo.validarSenha()) {
        erroSenha = true;
      }

      const item = {
        nome,
        descricao: campo.querySelector("textarea")?.value || ""
      };

      if (tipo === "usuario_web") {
        item.senha = campo.getSenha();
        item.permissao = campo.getPermissao();
      }

      dados[tipo].push(item);
    });
  });

  if (erroSenha) {
    mostrarToast("Existe senha inválida. Corrija antes de exportar.", true);
    return;
  }

  document.getElementById("resultado").textContent =
    JSON.stringify(dados, null, 2);

  mostrarToast("Exportação realizada com sucesso!");
};

/* =========================
   TOAST
========================= */
function mostrarToast(msg, error = false) {
  const toast = document.getElementById("toastGlobal");
  const txt = document.getElementById("toastMessage");

  txt.textContent = msg;
  toast.className = "toast show" + (error ? " error" : "");

  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove("show"), 4000);
}

window.fecharToast = function () {
  document.getElementById("toastGlobal").classList.remove("show");
};

/* =========================
   MODO ESCURO (CORRIGIDO)
========================= */
const toggleTheme = document.getElementById("toggleTheme");

if (toggleTheme) {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    toggleTheme.textContent = "☀️";
  } else {
    toggleTheme.textContent = "🌙";
  }

  toggleTheme.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");
    toggleTheme.textContent = isDark ? "☀️" : "🌙";
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
}

html

<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>Caderno de Parâmetros</title>
  <link rel="stylesheet" href="./style.css" />
</head>

<body>

<header class="app-header">
  <div class="header-left">
    <img src="./assets/image.png" alt="Logo ZRA" class="app-logo" />
  </div>

  <div class="header-center">
    <h1 class="app-title">Caderno de Parâmetros</h1>
  </div>

  <button id="toggleTheme" class="theme-toggle">🌙</button>
</header>

<main class="form-container">

  <!-- USUÁRIOS WEB -->
  <section class="card">
    <h2>Usuários Web</h2>

    <div class="acoes-card">
      <button class="btn-add" onclick="adicionarCampo('usuario_web')">+</button>
      <button class="btn-import" onclick="acionarImportacao('usuario_web')">📥 Importar</button>
      <input type="file" id="importUsuarios" accept=".csv" hidden>
    </div>

    <div id="listaUsuariosWeb"></div>
  </section>

  <!-- RAMAIS -->
  <section class="card">
    <h2>Ramais</h2>

    <div class="acoes-card">
      <button class="btn-import" onclick="acionarImportacao('ramal')">📥 Importar</button>
      <input type="file" id="importRamais" accept=".csv" hidden>
    </div>

    <div id="listaRings"></div>
  </section>

  <!-- OUTROS -->
  <section class="card">
    <h2>Números de Entrada</h2>
    <div id="listaEntradas"></div>
    <button class="btn-add" onclick="adicionarCampo('entrada')">+</button>
  </section>

  <section class="card">
    <h2>URAs</h2>
    <div id="listaURAs"></div>
    <button class="btn-add" onclick="adicionarCampo('ura')">+</button>
  </section>

  <section class="card">
    <h2>Filas</h2>
    <div id="listaFilas"></div>
    <button class="btn-add" onclick="adicionarCampo('fila')">+</button>
  </section>

  <section class="card">
    <h2>Agentes</h2>
    <div id="listaAgentes"></div>
    <button class="btn-add" onclick="adicionarCampo('agente')">+</button>
  </section>

  <button class="btn-explorar" onclick="explorar()">Explorar</button>

  <pre id="resultado"></pre>
</main>

<div id="toastGlobal" class="toast">
  <span id="toastMessage"></span>
  <button onclick="fecharToast()">×</button>
</div>

<script src="./app.js"></script>
</body>
</html>

css

* { box-sizing: border-box; }

/* ===== TEMA CLARO ===== */
:root {
  --bg: #f9fafb;
  --text: #1f2933;
  --header-bg: #ffffff;
  --card-bg: #ffffff;
  --border: #d1d5db;
  --field-border: #cbd5e1;
  --accent: #c6ff00;
}

/* ===== TEMA ESCURO ===== */
body.dark {
  --bg: #0b1220;
  --text: #e6edf3;
  --header-bg: #0f172a;
  --card-bg: #111c33;
  --border: #24304a;
  --field-border: #334155;
}

/* BODY */
body {
  margin: 0;
  font-family: Inter, Arial, sans-serif;
  background: var(--bg);
  color: var(--text);
  font-weight: 500;
  transition: background 0.25s ease, color 0.25s ease;
}

/* HEADER */
.app-header {
  height: 120px;
  background: var(--header-bg);
  border-bottom: 1px solid var(--border);
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  padding: 0 48px;
}

.app-logo { height: 72px; }
.app-title { font-size: 26px; font-weight: 900; }

/* CONTEÚDO */
.form-container {
  max-width: 900px;
  margin: 56px auto;
  padding: 0 16px 60px;
}

/* CARD */
.card {
  background: var(--card-bg);
  border-radius: 14px;
  padding: 24px;
  margin-bottom: 28px;
  box-shadow: 0 14px 36px rgba(0,0,0,0.08);
}

body.dark .card {
  box-shadow: 0 14px 36px rgba(0,0,0,0.55);
}

.card h2 {
  font-weight: 900;
  margin-bottom: 16px;
}

/* CAMPOS */
.campo-descricao {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 22px;
  padding-bottom: 18px;
  border-bottom: 1px dashed var(--border);
}

.linha-principal {
  display: flex;
  gap: 10px;
}

/* INPUTS – SEM COR FIXA */
input,
textarea,
select {
  width: 100%;
  padding: 11px 14px;
  border-radius: 8px;
  border: 1.5px solid var(--field-border);
  background: var(--card-bg);
  color: var(--text);
  font-size: 14px;
  font-weight: 600;
  transition: border 0.2s ease, background 0.2s ease;
}

input::placeholder,
textarea::placeholder {
  color: #9ca3af;
}

/* SENHA */
.campo-senha {
  width: 50%;
  min-width: 220px;
  transition: width 0.2s ease;
}

.senha-invalida {
  border: 2px solid #ef4444 !important;
  box-shadow: 0 0 0 2px rgba(239,68,68,0.25);
}

/* PERMISSÃO */
.campo-permissao {
  width: 65%;
  min-width: 260px;
}

/* REGRAS */
.regra-erro {
  background: #ef4444;
  color: #fff;
  padding: 10px;
  border-radius: 8px;
  font-weight: 800;
}

.regra-ok {
  background: #22c55e;
  color: #052e16;
  padding: 10px;
  border-radius: 8px;
  font-weight: 800;
}

/* BOTÕES */
.btn-add,
.btn-import {
  height: 46px;
  padding: 0 18px;
  border-radius: 12px;
  border: 2px dashed var(--border);
  background: transparent;
  font-weight: 800;
  cursor: pointer;
}

.btn-explorar {
  margin: 48px auto;
  padding: 18px 52px;
  border-radius: 14px;
  background: var(--accent);
  font-weight: 900;
  cursor: pointer;
}

/* RESULTADO */
pre {
  background: #020617;
  color: #e5e7eb;
  padding: 18px;
  border-radius: 12px;
}

/* TOAST */
.toast {
  position: fixed;
  top: 24px;
  right: 24px;
  padding: 18px 22px;
  background: #22c55e;
  border-radius: 14px;
  font-weight: 800;
  opacity: 0;
  transform: translateY(-10px);
  transition: 0.3s;
}

.toast.show {
  opacity: 1;
  transform: translateY(0);
}

.toast.error {
  background: #ef4444;
}
