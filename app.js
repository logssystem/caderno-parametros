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

  const total = container.querySelectorAll(".campo-descricao").length;
  if (total >= LIMITE) {
    alert("Limite máximo de 10 itens atingido");
    return;
  }

  container.appendChild(criarCampo(tipo));
};

/* =========================
   ADICIONAR RAMAL (RANGE)
========================= */
window.adicionarRamal = function () {
  const container = document.getElementById("listaRamais");
  if (!container) return;

  const card = container.closest(".card");
  if (card && card.classList.contains("card-disabled")) return;

  const total = container.querySelectorAll(".campo").length;
  if (total >= LIMITE) {
    alert("Limite máximo de 10 ranges atingido");
    return;
  }

  const wrapper = document.createElement("div");
  wrapper.className = "campo";

  const ini = document.createElement("input");
  ini.type = "number";
  ini.placeholder = "Ramal inicial (ex: 2000)";

  const qtd = document.createElement("input");
  qtd.type = "number";
  qtd.placeholder = "Range (ex: 5)";

  const btn = document.createElement("button");
  btn.textContent = "✖";
  btn.type = "button";
  btn.onclick = () => wrapper.remove();

  wrapper.append(ini, qtd, btn);
  container.appendChild(wrapper);
};

/* =========================
   CRIAR CAMPO COM DESCRIÇÃO
   + SENHA (USUÁRIO WEB)
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
  wrap.append(linha);

  /* 🔐 SENHA – SOMENTE PARA USUÁRIO WEB */
  let senhaInput = null;

  if (tipo === "usuario_web") {
    const senhaWrap = document.createElement("div");
    senhaWrap.style.display = "flex";
    senhaWrap.style.alignItems = "center";
    senhaWrap.style.gap = "8px";

    senhaInput = document.createElement("input");
    senhaInput.type = "text"; // começa visível
    senhaInput.placeholder = "Senha do usuário";
    senhaInput.className = "campo-senha";
    senhaInput.style.width = "50%";

    // ajuste automático de largura
    senhaInput.addEventListener("input", () => {
      const len = senhaInput.value.length;
      if (len > 12) senhaInput.style.width = "100%";
      else if (len > 8) senhaInput.style.width = "75%";
      else senhaInput.style.width = "50%";
    });

    // botão mostrar / ocultar
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.textContent = "👁️";
    toggle.title = "Mostrar / Ocultar senha";

    toggle.addEventListener("click", () => {
      senhaInput.type = senhaInput.type === "password" ? "text" : "password";
    });

    senhaWrap.append(senhaInput, toggle);
    wrap.append(senhaWrap);
  }

  const desc = document.createElement("textarea");
  desc.placeholder = "Descrição (opcional)";

  const label = document.createElement("label");
  label.className = "nao-utilizado";

  const chk = document.createElement("input");
  chk.type = "checkbox";

  const text = document.createElement("span");
  text.textContent = "Não será utilizado";

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

  label.append(chk, text);
  wrap.append(desc, label);

  return wrap;
}

/* =========================
   EXPLORAR / EXPORTAR
========================= */
window.explorar = function () {
  const dados = {};

  Object.keys(listas).forEach(tipo => {
    dados[tipo] = [];

    document
      .querySelectorAll(`#${listas[tipo]} .campo-descricao`)
      .forEach(campo => {
        const input = campo.querySelector("input[type=text]");
        const desc = campo.querySelector("textarea");
        const chk = campo.querySelector("input[type=checkbox]");

        if (!chk.checked && input.value.trim()) {
          const item = {
            nome: input.value.trim(),
            descricao: desc.value.trim()
          };

          if (tipo === "usuario_web") {
            const senha = campo.querySelector(".campo-senha");
            item.senha = senha ? senha.value : "";
          }

          dados[tipo].push(item);
        }
      });
  });

  // RAMAIS
  dados.ramais = [];
  document.querySelectorAll("#listaRamais .campo").forEach(campo => {
    const inputs = campo.querySelectorAll("input[type=number]");
    if (inputs.length < 2) return;

    const base = parseInt(inputs[0].value);
    const range = parseInt(inputs[1].value);

    if (!isNaN(base) && !isNaN(range) && range > 0) {
      for (let i = 1; i <= range; i++) {
        dados.ramais.push(base + i);
      }
    }
  });

  document.getElementById("resultado").textContent =
    JSON.stringify(dados, null, 2);
};

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
