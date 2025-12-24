console.log("APP.JS CARREGADO - VERSAO ESTAVEL");

/* ================== CONFIG ================== */
const LIMITE = 10;

const listas = {
  usuario_web: "listaUsuariosWeb",
  entrada: "listaEntradas",
  ura: "listaURAs",
  fila: "listaFilas",
  ring: "listaRings",
  agente: "listaAgentes"
};

/* ================== ADICIONAR CAMPOS ================== */
window.adicionarCampo = function (tipo) {
  const container = document.getElementById(listas[tipo]);
  if (!container) {
    console.error("Container não encontrado:", tipo);
    return;
  }

  const total = container.querySelectorAll(".campo-descricao").length;
  if (total >= LIMITE) {
    alert("Limite máximo de 10 itens atingido");
    return;
  }

  container.appendChild(criarCampo(tipo));
};

/* ================== ADICIONAR RAMAL ================== */
window.adicionarRamal = function () {
  const container = document.getElementById("listaRamais");
  if (!container) {
    console.error("Container de ramais não encontrado");
    return;
  }

  const total = container.querySelectorAll(".campo").length;
  if (total >= LIMITE) {
    alert("Limite máximo de 10 ranges atingido");
    return;
  }

  const wrapper = document.createElement("div");
  wrapper.className = "campo";

  const ramalInicial = document.createElement("input");
  ramalInicial.type = "number";
  ramalInicial.placeholder = "Ramal inicial (ex: 2000)";

  const range = document.createElement("input");
  range.type = "number";
  range.placeholder = "Range (ex: 5)";

  const btn = document.createElement("button");
  btn.textContent = "✖";
  btn.type = "button";
  btn.onclick = () => wrapper.remove();

  wrapper.append(ramalInicial, range, btn);
  container.appendChild(wrapper);
};

/* ================== EXPORTAR ================== */
window.explorar = function () {
  const dados = {};

  Object.keys(listas).forEach(tipo => {
    dados[tipo] = [];

    document
      .querySelectorAll(`#${listas[tipo]} .campo-descricao`)
      .forEach(campo => {
        const input = campo.querySelector("input[type=text]");
        const descricao = campo.querySelector("textarea");
        const chk = campo.querySelector("input[type=checkbox]");

        if (!chk.checked && input.value.trim()) {
          dados[tipo].push({
            nome: input.value.trim(),
            descricao: descricao.value.trim()
          });
        }
      });
  });

  /* RAMAIS */
  dados.ramais = [];
  document.querySelectorAll("#listaRamais .campo").forEach(campo => {
    const nums = campo.querySelectorAll("input[type=number]");
    if (nums.length < 2) return;

    const base = parseInt(nums[0].value);
    const qtd = parseInt(nums[1].value);

    if (!isNaN(base) && !isNaN(qtd) && qtd > 0) {
      for (let i = 1; i <= qtd; i++) {
        dados.ramais.push(base + i);
      }
    }
  });

  document.getElementById("resultado").textContent =
    JSON.stringify(dados, null, 2);
};

/* ================== CRIAR CAMPO PADRÃO ================== */
function criarCampo(tipo) {
  const wrapper = document.createElement("div");
  wrapper.className = "campo campo-descricao";

  /* LINHA PRINCIPAL */
  const linha = document.createElement("div");
  linha.className = "linha-principal";

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = `Digite ${tipo.replace("_", " ")}`;

  const btn = document.createElement("button");
  btn.textContent = "✖";
  btn.type = "button";
  btn.onclick = () => wrapper.remove();

  linha.append(input, btn);

  /* DESCRIÇÃO */
  const descricao = document.createElement("textarea");
  descricao.placeholder = "Descrição (opcional)";

  /* CHECKBOX NÃO UTILIZADO */
  const label = document.createElement("label");
  label.className = "nao-utilizado";

  const chk = document.createElement("input");
  chk.type = "checkbox";

  chk.onchange = () => {
    /* desabilita campos */
    input.disabled = chk.checked;
    descricao.disabled = chk.checked;

    if (chk.checked) {
      input.value = "";
      descricao.value = "";
    }

    /* efeito visual no card */
    toggleNaoUtilizado(chk);
  };

  label.append(chk, " Não será utilizado");

  wrapper.append(linha, descricao, label);
  return wrapper;
}

/* ================== ESTADO VISUAL DO CARD ================== */
function toggleNaoUtilizado(checkbox) {
  const card = checkbox.closest(".card");
  if (!card) return;

  if (checkbox.checked) {
    card.classList.add("card-disabled");

    card.querySelectorAll("input, textarea").forEach(el => {
      if (el !== checkbox) el.disabled = true;
    });
  } else {
    card.classList.remove("card-disabled");

    card.querySelectorAll("input, textarea").forEach(el => {
      el.disabled = false;
    });
  }
}
