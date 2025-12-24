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

/* ====== CAMPO PADRÃO (INPUT + NÃO UTILIZAR) ====== */
function criarCampo(tipo) {
  const wrapper = document.createElement("div");
  wrapper.className = "campo";

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = `Digite ${tipo.replace("_", " ")}`;

  const label = document.createElement("label");
  const chk = document.createElement("input");
  chk.type = "checkbox";
  label.appendChild(chk);
  label.append(" Não será utilizado");

  chk.addEventListener("change", () => {
    input.disabled = chk.checked;
    if (chk.checked) input.value = "";
  });

  const btn = document.createElement("button");
  btn.textContent = "✖";
  btn.type = "button";
  btn.onclick = () => wrapper.remove();

  wrapper.append(input, label, btn);
  return wrapper;
}

/* ====== RAMAIS COM RANGE + PREVIEW ====== */
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

  const preview = document.createElement("div");
  preview.className = "preview-ramais";
  preview.textContent = "Gerados: —";

  function atualizarPreview() {
    const base = parseInt(ramalInicial.value);
    const qtd = parseInt(range.value);

    if (isNaN(base) || isNaN(qtd) || qtd <= 0) {
      preview.textContent = "Gerados: —";
      return;
    }

    const ramais = [];
    for (let i = 1; i <= qtd; i++) {
      ramais.push(base + i);
    }

    preview.innerHTML = `Gerados: <span>${ramais.join(", ")}</span>`;
  }

  ramalInicial.addEventListener("input", atualizarPreview);
  range.addEventListener("input", atualizarPreview);

  const btn = document.createElement("button");
  btn.textContent = "✖";
  btn.type = "button";
  btn.onclick = () => wrapper.remove();

  wrapper.append(ramalInicial, range, btn);
  wrapper.appendChild(preview);
  container.appendChild(wrapper);
}

/* ====== EXPORT / EXPLORAR ====== */
function explorar() {
  const dados = {};

  /* CAMPOS PADRÃO */
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

  /* RAMAIS (USA A MESMA LÓGICA DO PREVIEW) */
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
