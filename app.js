console.log("APP.JS CARREGADO - VERSÃO FINAL ESTÁVEL");

const LIMITE = 10;

const listas = {
  usuario_web: "listaUsuariosWeb",
  entrada: "listaEntradas",
  ura: "listaURAs",
  fila: "listaFilas",
  ring: "listaRings",
  agente: "listaAgentes"
};

/* =========================
   ADICIONAR CAMPO
========================= */
window.adicionarCampo = function (tipo) {
  const container = document.getElementById(listas[tipo]);
  if (!container) return;

  const card = container.closest(".card");
  if (card?.classList.contains("card-disabled")) return;

  if (container.querySelectorAll(".campo-descricao").length >= LIMITE) {
    alert("Limite máximo de 10 itens atingido");
    return;
  }

  container.appendChild(criarCampo(tipo));
};

/* =========================
   CRIAR CAMPO
========================= */
function criarCampo(tipo) {
  const wrap = document.createElement("div");
  wrap.className = "campo campo-descricao";

  const linha = document.createElement("div");
  linha.className = "linha-principal";

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = `Digite ${tipo.replace("_", " ")}`;

  const btn = document.createElement("button");
  btn.textContent = "✖";
  btn.type = "button";
  btn.onclick = () => wrap.remove();

  linha.append(input, btn);

  /* ===== SENHA EM ETAPAS ===== */
  let senhaInput, regrasBox, regras;

  if (tipo === "usuario_web") {
    senhaInput = document.createElement("input");
    senhaInput.type = "text";
    senhaInput.placeholder = "Senha do usuário";
    senhaInput.className = "campo-senha";
    senhaInput.style.width = "50%";

    regrasBox = document.createElement("div");
    regrasBox.className = "regras-senha";
    regrasBox.style.display = "none";

    regras = {
      tamanho: criarRegra("A senha deve ter pelo menos 11 caracteres."),
      maiuscula: criarRegra("A senha deve conter pelo menos uma letra maiúscula."),
      numero: criarRegra("A senha deve conter pelo menos um número."),
      especial: criarRegra("A senha deve conter pelo menos um caractere especial (como @, #, $, etc.)."),
      segura: criarRegra("A senha é segura!", true)
    };

    Object.values(regras).forEach(r => regrasBox.appendChild(r));

    senhaInput.addEventListener("input", () => {
      const v = senhaInput.value;

      regrasBox.style.display = v ? "block" : "none";
      Object.values(regras).forEach(r => r.style.display = "none");

      if (v.length < 11) {
        regras.tamanho.style.display = "block";
        setRegra(regras.tamanho, false);
        ajustarLarguraSenha(senhaInput, v.length);
        return;
      }

      if (!/[A-Z]/.test(v)) {
        regras.maiuscula.style.display = "block";
        setRegra(regras.maiuscula, false);
        ajustarLarguraSenha(senhaInput, v.length);
        return;
      }

      if (!/\d/.test(v)) {
        regras.numero.style.display = "block";
        setRegra(regras.numero, false);
        ajustarLarguraSenha(senhaInput, v.length);
        return;
      }

      if (!/[^A-Za-z0-9]/.test(v)) {
        regras.especial.style.display = "block";
        setRegra(regras.especial, false);
        ajustarLarguraSenha(senhaInput, v.length);
        return;
      }

      regras.segura.style.display = "block";
      setRegra(regras.segura, true);
      ajustarLarguraSenha(senhaInput, v.length);
      mostrarToast();
    });
  }

  const desc = document.createElement("textarea");
  desc.placeholder = "Descrição (opcional)";

  const label = document.createElement("label");
  label.className = "nao-utilizado";

  const chk = document.createElement("input");
  chk.type = "checkbox";

  chk.addEventListener("change", () => {
    const card = wrap.closest(".card");
    card.classList.toggle("card-disabled", chk.checked);

    wrap.querySelectorAll("input, textarea, button").forEach(el => {
      if (el !== chk) el.disabled = chk.checked;
    });

    input.value = "";
    desc.value = "";
    if (senhaInput) senhaInput.value = "";
  });

  label.append(chk, " Não será utilizado");

  wrap.append(linha);
  if (senhaInput) wrap.append(senhaInput, regrasBox);
  wrap.append(desc, label);

  return wrap;
}

/* =========================
   HELPERS
========================= */
function criarRegra(texto, verde = false) {
  const div = document.createElement("div");
  div.textContent = texto;
  div.className = verde ? "regra-ok" : "regra-erro";
  div.style.display = "none";
  return div;
}

function setRegra(el, ok) {
  el.className = ok ? "regra-ok" : "regra-erro";
}

function ajustarLarguraSenha(input, len) {
  input.style.width =
    len > 12 ? "100%" : len > 8 ? "75%" : "50%";
}

/* =========================
   TOAST
========================= */
function mostrarToast() {
  const toast = document.getElementById("toastSucesso");
  toast.classList.add("show");

  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 4000);
}

function fecharToast() {
  document.getElementById("toastSucesso").classList.remove("show");
}

/* =========================
   MODO ESCURO
========================= */
const toggleTheme = document.getElementById("toggleTheme");

if (toggleTheme) {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    toggleTheme.textContent = "☀️";
  }

  toggleTheme.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    toggleTheme.textContent = isDark ? "☀️" : "🌙";
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
}
