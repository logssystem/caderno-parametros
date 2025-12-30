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
