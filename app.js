const LIMITE = 10;

/* ====== MAPA DE LISTAS ====== */
const listas = {
  fila: "listaFilas",
  ura: "listaURAs",
  entrada: "listaEntradas",
  agente: "listaAgentes",
  ring: "listaRings"
};

/* ====== ADICIONAR CAMPOS PADRÃO ====== */
function adicionarCampo(tipo) {
  const container = document.getElementById(listas[tipo]);
  if (container.querySelectorAll(".campo").length >= LIMITE) {
    alert("Limite máximo atingido");
    return;
  }
  container.appendChild(criarCampo(tipo));
}

/* ====== CAMPO PADRÃO ====== */
function criarCampo(tipo) {
  const wrapper = document.createElement("div");
  wrapper.className = "campo";

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = `Digite ${tipo}`;

  const label = document.createElement("label");
  const chk = document.createElement("input");
  chk.type = "checkbox";
  label.appendChild(chk);
  label.append(" Não será utilizado");

  chk.onchange = () => {
    input.disabled = chk.checked;
    if (chk.checked) input.value = "";
  };

  const btn = document.createElement("button");
  btn.textContent = "✖";
  btn.onclick = () => wrapper.remove();

  wrapper.append(input, label, btn);
  return wrapper;
}

/* ====== RAMAIS COM RANGE ====== */
function adicionarRamal() {
  const container = document.getElementById("listaRamais");
  if (container.querySelectorAll(".campo").length >= LIMITE) {
    alert("Limite máximo atingido");
    return;
  }

  const wrapper = document.createElement("div");
  wrapper.className = "campo";

  const ramalInicial = document.createElement("input");
  ramalInicial.placeholder = "Ramal inicial (ex: 2000)";
  ramalInicial.type = "number";

  const range = document.createElement("input");
  range.placeholder = "Range (ex: 5)";
  range.type = "number";

  const btn = document.createElement("button");
  btn.textContent = "✖";
  btn.onclick = () => wrapper.remove();

  wrapper.append(ramalInicial, range, btn);
  container.appendChild(wrapper);
}

/* ====== EXPORT ====== */
function explorar() {
  const dados = {};

  Object.keys(listas).forEach(tipo => {
    dados[tipo] = [];
    document.querySelectorAll(`#${listas[tipo]} .campo`).forEach(campo => {
      const input = campo.querySelector("input[type=text]");
      const chk = campo.querySelector("input[type=checkbox]");
      if (input && !chk.checked && input.value.trim()) {
        dados[tipo].push(input.value.trim());
      }
    });
  });

  /* RAMAIS */
  dados.ramais = [];
  document.querySelectorAll("#listaRamais .campo").forEach(campo => {
    const base = parseInt(campo.children[0].value);
    const range = parseInt(campo.children[1].value);

    if (!isNaN(base) && !isNaN(range)) {
      for (let i = 1; i <= range; i++) {
        dados.ramais.push(base + i);
      }
    }
  });

  document.getElementById("resultado").textContent =
    JSON.stringify(dados, null, 2);
}
