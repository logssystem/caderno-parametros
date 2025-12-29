console.log("APP.JS CARREGADO - VERSÃO FINAL ESTÁVEL");

const LIMITE = 10;

/* =========================
   MAPEAMENTO DAS LISTAS
========================= */
const listas = {
  usuario_web: "listaUsuariosWeb",
  entrada: "listaEntradas",
  ura: "listaURAs",
  fila: "listaFilas",
  ring: "listaRings",
  agente: "listaAgentes"
};

/* =========================
   ADICIONAR CAMPO PADRÃO
========================= */
window.adicionarCampo = function (tipo) {
  const container = document.getElementById(listas[tipo]);
  if (!container) return;

  const card = container.closest(".card");
  if (card && card.classList.contains("card-disabled")) return;

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

  /* =========================
     SENHA (USUÁRIO WEB)
  ========================= */
  let senhaInput = null;
  let regrasBox = null;

  if (tipo === "usuario_web") {
    senhaInput = document.createElement("input");
    senhaInput.type = "text"; // 👁 senha visível
    senhaInput.placeholder = "Senha do usuário";
    senhaInput.className = "campo-senha";
    senhaInput.style.width = "50%";

    regrasBox = document.createElement("div");
    regrasBox.className = "regras-senha";

    const regras = {
      tamanho: criarRegra("A senha deve ter pelo menos 11 caracteres."),
      maiuscula: criarRegra("A senha deve conter pelo menos uma letra maiúscula."),
      numero: criarRegra("A senha deve conter pelo menos um número."),
      especial: criarRegra("A senha deve conter pelo menos um caractere especial (como @, #, $, etc.)."),
      segura: criarRegra("A senha é segura!", true)
    };

    regrasBox.append(
      regras.tamanho,
      regras.maiuscula,
      regras.numero,
      regras.especial,
      regras.segura
    );

    senhaInput.addEventListener("input", () => {
      const v = senhaInput.value;

      const okTamanho = v.length >= 11;
      const okMaiuscula = /[A-Z]/.test(v);
      const okNumero = /\d/.test(v);
      const okEspecial = /[^A-Za-z0-9]/.test(v);

      setRegra(regras.tamanho, okTamanho);
      setRegra(regras.maiuscula, okMaiuscula);
      setRegra(regras.numero, okNumero);
      setRegra(regras.especial, okEspecial);

      const tudoOk = okTamanho && okMaiuscula && okNumero && okEspecial;
      regras.segura.style.display = tudoOk ? "block" : "none";

      // 🔥 ajuste automático de largura
      senhaInput.style.width =
        v.length > 12 ? "100%" : v.length > 8 ? "75%" : "50%";
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

    if (chk.checked) {
      card.classList.add("card-disabled");
      card.querySelectorAll("input, textarea, button").forEach(el => {
        if (el !== chk) el.disabled = true;
      });
      input.value = "";
      desc.value = "";
      if (senhaInput) senhaInput.value = "";
    } else {
      card.classList.remove("card-disabled");
      card.querySelectorAll("input, textarea, button").forEach(el => {
        el.disabled = false;
      });
    }
  });

  label.append(chk, " Não será utilizado");

  /* MONTAGEM */
  wrap.append(linha);
  if (senhaInput) wrap.append(senhaInput, regrasBox);
  wrap.append(desc, label);

  return wrap;
}

/* =========================
   HELPERS DE REGRA
========================= */
function criarRegra(texto, verde = false) {
  const div = document.createElement("div");
  div.textContent = texto;
  div.className = verde ? "regra-ok" : "regra-erro";
  div.style.display = verde ? "none" : "block";
  return div;
}

function setRegra(el, ok) {
  el.className = ok ? "regra-ok" : "regra-erro";
}

/* =========================
   EXPLORAR
========================= */
window.explorar = function () {
  const dados = {};

  Object.keys(listas).forEach(tipo => {
    dados[tipo] = [];

    document.querySelectorAll(`#${listas[tipo]} .campo-descricao`).forEach(campo => {
      const input = campo.querySelector("input[type=text]");
      const desc = campo.querySelector("textarea");
      const chk = campo.querySelector("input[type=checkbox]");

      if (!chk.checked && input.value.trim()) {
        const item = { nome: input.value.trim(), descricao: desc.value.trim() };

        if (tipo === "usuario_web") {
          const senha = campo.querySelector(".campo-senha");
          item.senha = senha ? senha.value : "";
        }

        dados[tipo].push(item);
      }
    });
  });

  document.getElementById("resultado").textContent =
    JSON.stringify(dados, null, 2);
};

/* =========================
   MODO ESCURO (RESTAURADO)
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
