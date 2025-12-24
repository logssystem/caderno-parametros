const LIMITE = 10;

/* listas */
const listas = {
  usuario_web: "listaUsuariosWeb",
  entrada: "listaEntradas",
  ura: "listaURAs",
  fila: "listaFilas",
  ring: "listaRings",
  agente: "listaAgentes"
};

/* adicionar campo padrão */
function adicionarCampo(tipo) {
  const container = document.getElementById(listas[tipo]);
  if (container.querySelectorAll(".campo").length >= LIMITE) {
    alert("Limite máximo de 10 itens atingido");
    return;
  }
  container.appendChild(criarCampo(tipo));
}

/* criar campo com descrição */
function criarCampo(tipo) {
  const wrapper = document.createElement("div");
  wrapper.className = "campo campo-descricao";

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

  const descricao = document.createElement("textarea");
  descricao.placeholder = "Descrição (opcional)";

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

/* ramais com range */
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

/* export */
function explorar() {
  const dados = {};

  Object.keys(listas).forEach(tipo => {
    dados[tipo] = [];
    document.querySelectorAll(`#${listas[tipo]} .campo`).forEach(campo => {
      const input = campo.querySelector("input[type=text]");
      const descricao = campo.querySelector("textarea");
      const chk = campo.querySelector("input[type=checkbox]");

      if (input && !chk.checked && input.value.trim()) {
        dados[tipo].push({
          nome: input.value.trim(),
          descricao: descricao.value.trim()
        });
      }
    });
  });

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
}
