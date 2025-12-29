console.log("APP.JS CARREGADO - VERSÃO FINAL ESTÁVEL");

const LIMITE = 10;

/* MAPEAMENTO DAS LISTAS */
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

  const desc = document.createElement("textarea");
  desc.placeholder = "Descrição (opcional)";

  const label = document.createElement("label");
  label.className = "nao-utilizado";

  const chk = document.createElement("input");
  chk.type = "checkbox";

  const text = document.createElement("span");
  text.textContent = "Não será utilizado";

  chk.addEventListener("change", () => {
    const disabled = chk.checked;
    input.disabled = disabled;
    desc.disabled = disabled;

    if (disabled) {
      input.value = "";
      desc.value = "";
      wrap.style.opacity = "0.55";
    } else {
      wrap.style.opacity = "1";
    }
  });

  label.append(chk, text);
  wrap.append(linha, desc, label);

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
          dados[tipo].push({
            nome: input.value.trim(),
            descricao: desc.value.trim()
          });
        }
      });
  });

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
