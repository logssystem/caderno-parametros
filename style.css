const LIMITE = 10;

/* ====== MAPA DE LISTAS ====== */
const listas = {
  usuario_web: "listaUsuariosWeb",
  entrada: "listaEntradas",
  ura: "listaURAs",
  fila: "listaFilas",
  ring: "listaRings",
  agente: "listaAgentes"
};

/* ====== ADICIONAR CAMPOS PADRÃO ====== */
function adicionarCampo(tipo) {
  const container = document.getElementById(listas[tipo]);
  if (container.querySelectorAll(".campo").length >= LIMITE) {
    alert("Limite máximo de 10 itens atingido");
    return;
  }
  container.appendChild(criarCampo(tipo));
}

/* ====== CAMPO PADRÃO COM DESCRIÇÃO ====== */
function criarCampo(tipo) {
  const wrapper = document.createElement("div");
  wrapper.className = "campo";
  wrapper.style.flexDirection = "column";
  wrapper.style.alignItems = "flex-start";

  /* linha principal */
  const linha = document.createElement("div");
  linha.style.display = "flex";
  linha.style.alignItems = "center";
  linha.style.gap = "8px";

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = `Digite ${tipo.replace("_", " ")}`;

  const btn = document.createElement("button");
  btn.textContent = "✖";
  btn.type = "button";
  btn.onclick = () => wrapper.remove();

  linha.append(input, btn);

  /* descrição */
  const descricao = document.createElement("textarea");
  descricao.placeholder = "Descrição (opcional)";

  /* não utilizar */
  const label = document.createElement("label");
  const chk = document.createElement("input");
  chk.type = "checkbox";
  label.appendChild(chk);
  label.append(" Não será utilizado");

  chk.onchange = () => {
    input.disabled = chk.checked;
    descricao.disabled = chk.checked;
    if (chk.checked) {
      input.value = "";
      descricao.value = "";
    }
  };

  wrapper.append(linha, descricao, label);
  return wrapper;
}

/* ====== RAMAIS (SEM DESCRIÇÃO) ====== */
function adicionarRamal() {
  const container = document.getElementById("listaRamais");
  if (container.querySelectorAll(".campo").length >= LIMITE) {
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
}

/* ====== EXPORT ====== */
function explorar() {
  const dados = {};

  /* campos padrão */
  Object.keys(listas).forEach(tipo => {
    dados[tipo] = [];
    document.querySelectorAll(`#${listas[tipo]} .campo`).forEach(campo => {
      const input = campo.querySelector("input[type=text]");
      const textarea = campo.querySelector("textarea");
      const chk = campo.querySelector("input[type=checkbox]");

      if (input && !chk.checked && input.value.trim()) {
        dados[tipo].push({
          nome: input.value.trim(),
          descricao: textarea.value.trim()
        });
      }
    });
  });

  /* ramais */
  dados.ramais = [];
  document.querySelectorAll("#listaRamais .campo").forEach(campo => {
    const inputs = campo.querySelectorAll("input[type=number]");
    if (inputs.length < 2) return;

    const base = parseInt(inputs[0].value);
    const qtd = parseInt(inputs[1].value);

    if (!isNaN(base) && !isNaN(qtd) && qtd > 0) {
      for (let i = 1; i <= qtd; i++) {
        dados.ramais.push(base + i);
      }
    }
  });

  document.getElementById("resultado").textContent =
    JSON.stringify(dados, null, 2);
}
