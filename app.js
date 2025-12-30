console.log("APP.JS CARREGADO - VERSÃO FINAL 600+");

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

/* CONTADORES */
const contadores = {
  usuario_web: 0,
  entrada: 0,
  ura: 0,
  fila: 0,
  ring: 0,
  agente: 0
};

/* PERMISSÕES */
const PERMISSOES_USUARIO = [
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

  if (contadores[tipo] >= LIMITE) {
    mostrarToast(`Limite máximo de ${LIMITE} itens atingido`, true);
    return;
  }

  const campo = criarCampo(tipo);
  container.appendChild(campo);
  contadores[tipo]++;
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
  btn.onclick = () => {
    wrap.remove();
    contadores[tipo]--;
  };

  linha.append(nome, btn);
  wrap.append(linha);

  /* ===== USUÁRIO WEB ===== */
  let senhaInput = null;
  let regrasBox = null;
  let permissaoSelect = null;
  let senhaValidaAtual = false;

  if (tipo === "usuario_web") {
    /* SENHA */
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

      if (v.length < 11) {
        erroSenha("A senha deve ter pelo menos 11 caracteres.");
        return;
      }
      if (!/[A-Z]/.test(v)) {
        erroSenha("A senha deve conter pelo menos uma letra maiúscula.");
        return;
      }
      if (!/\d/.test(v)) {
        erroSenha("A senha deve conter pelo menos um número.");
        return;
      }
      if (!/[^A-Za-z0-9]/.test(v)) {
        erroSenha("A senha deve conter pelo menos um caractere especial (como @, #, $, etc.).");
        return;
      }

      regrasBox.innerHTML = `<div class="regra-ok">A senha é segura!</div>`;
      senhaValidaAtual = true;
      ajustarLarguraSenha(senhaInput, v.length);
    });

    function erroSenha(msg) {
      regrasBox.innerHTML = `<div class="regra-erro">${msg}</div>`;
      senhaInput.classList.add("senha-invalida");
      ajustarLarguraSenha(senhaInput, senhaInput.value.length);
    }

    /* PERMISSÃO */
    permissaoSelect = document.createElement("select");
    permissaoSelect.className = "campo-permissao";

    const optDefault = document.createElement("option");
    optDefault.textContent = "Selecione a permissão";
    optDefault.disabled = true;
    optDefault.selected = true;
    permissaoSelect.appendChild(optDefault);

    PERMISSOES_USUARIO.forEach(p => {
      const opt = document.createElement("option");
      opt.value = p;
      opt.textContent = p;
      permissaoSelect.appendChild(opt);
    });

    wrap.append(senhaInput, permissaoSelect, regrasBox);
  }

  const desc = document.createElement("textarea");
  desc.placeholder = "Descrição (opcional)";
  wrap.append(desc);

  /* HELPERS POR CAMPO */
  wrap.validarSenha = () => (senhaInput ? senhaValidaAtual : true);
  wrap.getSenha = () => (senhaInput ? senhaInput.value : "");
  wrap.getPermissao = () => (permissaoSelect ? permissaoSelect.value : "");

  return wrap;
}

/* =========================
   AJUSTE LARGURA SENHA
========================= */
function ajustarLarguraSenha(input, len) {
  input.style.width =
    len > 14 ? "100%" :
    len > 10 ? "75%" :
    "50%";
}

/* =========================
   EXPORTAR
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
   TEMA
========================= */
const toggleTheme = document.getElementById("toggleTheme");

if (toggleTheme) {
  const saved = localStorage.getItem("theme");
  if (saved === "dark") {
    document.body.classList.add("dark");
    toggleTheme.textContent = "☀️";
  }

  toggleTheme.onclick = () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    toggleTheme.textContent = isDark ? "☀️" : "🌙";
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };
}
