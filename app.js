const LIMITE = 10;

function adicionarFilaCampo() {
  const container = document.getElementById("listaFilas");
  const total = container.querySelectorAll("input").length;

  if (total >= LIMITE) {
    alert("Máximo de 10 filas permitido");
    return;
  }

  container.appendChild(criarCampo("Nome da fila (ex: Suporte)"));
}

function adicionarURACampo() {
  const container = document.getElementById("listaURAs");
  const total = container.querySelectorAll("input").length;

  if (total >= LIMITE) {
    alert("Máximo de 10 URAs permitido");
    return;
  }

  container.appendChild(criarCampo("Nome da URA (ex: URA Atendimento)"));
}

function criarCampo(placeholder) {
  const wrapper = document.createElement("div");
  wrapper.style.display = "flex";
  wrapper.style.gap = "6px";
  wrapper.style.marginBottom = "6px";

  const input = document.createElement("input");
  input.placeholder = placeholder;

  const btn = document.createElement("button");
  btn.textContent = "✖";
  btn.type = "button";
  btn.onclick = () => wrapper.remove();

  wrapper.appendChild(input);
  wrapper.appendChild(btn);

  return wrapper;
}

async function explorar() {
  const dados = {};

  // FILAS
  const filasInputs = document.querySelectorAll("#listaFilas input");
  let filaIndex = 1;

  filasInputs.forEach(input => {
    const nome = input.value.trim();
    if (nome && filaIndex <= LIMITE) {
      dados[`fila_${filaIndex}`] = {
        tipo: "fila",
        nome: nome
      };
      filaIndex++;
    }
  });

  // URAs
  const urasInputs = document.querySelectorAll("#listaURAs input");
  let uraIndex = 1;

  urasInputs.forEach(input => {
    const nome = input.value.trim();
    if (nome && uraIndex <= LIMITE) {
      dados[`ura_${uraIndex}`] = {
        tipo: "ura",
        principal: nome
      };
      uraIndex++;
    }
  });

  if (Object.keys(dados).length === 0) {
    alert("Adicione ao menos uma fila ou URA");
    return;
  }

  const payload = { dados };

  try {
    const res = await fetch("https://caderno-api.onrender.com/explorar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const json = await res.json();
    document.getElementById("resultado").textContent =
      JSON.stringify(json, null, 2);
  } catch (err) {
    alert("Erro ao chamar a API");
    console.error(err);
  }
}
