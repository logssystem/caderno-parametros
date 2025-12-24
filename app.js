const LIMITE = 10;

/* ====== ADICIONAR CAMPOS ====== */
function adicionarFilaCampo() {
  const container = document.getElementById("listaFilas");
  if (container.querySelectorAll(".campo").length >= LIMITE) {
    alert("Máximo de 10 filas permitido");
    return;
  }
  container.appendChild(criarCampo("fila"));
}

function adicionarURACampo() {
  const container = document.getElementById("listaURAs");
  if (container.querySelectorAll(".campo").length >= LIMITE) {
    alert("Máximo de 10 URAs permitido");
    return;
  }
  container.appendChild(criarCampo("ura"));
}

/* ====== CRIA UM CAMPO (SÓ INPUT + NÃO UTILIZAR + REMOVER) ====== */
function criarCampo(tipo) {
  const wrapper = document.createElement("div");
  wrapper.className = "campo";
  wrapper.style.display = "flex";
  wrapper.style.alignItems = "center";
  wrapper.style.gap = "8px";
  wrapper.style.marginBottom = "6px";

  /* INPUT LIVRE */
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder =
    tipo === "fila"
      ? "Digite o nome da fila"
      : "Digite o nome da URA";

  /* CHECKBOX NÃO UTILIZAR */
  const labelNaoUsar = document.createElement("label");
  labelNaoUsar.style.fontSize = "12px";

  const checkboxNaoUsar = document.createElement("input");
  checkboxNaoUsar.type = "checkbox";

  labelNaoUsar.appendChild(checkboxNaoUsar);
  labelNaoUsar.append(" Não será utilizado");

  checkboxNaoUsar.addEventListener("change", () => {
    if (checkboxNaoUsar.checked) {
      input.value = "";
      input.disabled = true;
    } else {
      input.disabled = false;
    }
  });

  /* BOTÃO REMOVER */
  const btn = document.createElement("button");
  btn.textContent = "✖";
  btn.type = "button";
  btn.onclick = () => wrapper.remove();

  wrapper.appendChild(input);
  wrapper.appendChild(labelNaoUsar);
  wrapper.appendChild(btn);

  return wrapper;
}

/* ====== EXPORT / EXPLORAR ====== */
async function explorar() {
  const dados = {};
  let filaIndex = 1;
  let uraIndex = 1;

  /* FILAS */
  document.querySelectorAll("#listaFilas .campo").forEach(campo => {
    const input = campo.querySelector("input[type=text]");
    const naoUsar = campo.querySelector("input[type=checkbox]");

    if (!naoUsar.checked && input.value.trim() && filaIndex <= LIMITE) {
      dados[`fila_${filaIndex}`] = {
        tipo: "fila",
        nome: input.value.trim()
      };
      filaIndex++;
    }
  });

  /* URAS */
  document.querySelectorAll("#listaURAs .campo").forEach(campo => {
    const input = campo.querySelector("input[type=text]");
    const naoUsar = campo.querySelector("input[type=checkbox]");

    if (!naoUsar.checked && input.value.trim() && uraIndex <= LIMITE) {
      dados[`ura_${uraIndex}`] = {
        tipo: "ura",
        principal: input.value.trim()
      };
      uraIndex++;
    }
  });

  if (Object.keys(dados).length === 0) {
    alert("Adicione ao menos uma fila ou URA");
    return;
  }

  const payload = { dados };

  const res = await fetch("https://caderno-api.onrender.com/explorar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const json = await res.json();
  document.getElementById("resultado").textContent =
    JSON.stringify(json, null, 2);
}
