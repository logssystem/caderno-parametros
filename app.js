const LIMITE = 10;

/* ====== DADOS MOCK (DEPOIS PODE VIR DE API) ====== */
const FILAS_DISPONIVEIS = [
  "Suporte",
  "Financeiro",
  "Comercial",
  "Cobrança"
];

const URAS_DISPONIVEIS = [
  "URA Atendimento",
  "URA Financeiro",
  "URA Comercial"
];

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

/* ====== CRIA UM CAMPO ====== */
function criarCampo(tipo) {
  const wrapper = document.createElement("div");
  wrapper.className = "campo";
  wrapper.style.display = "flex";
  wrapper.style.alignItems = "center";
  wrapper.style.gap = "8px";
  wrapper.style.marginBottom = "6px";

  /* SELECT */
  const select = document.createElement("select");

  select.innerHTML = `
    <option value="">Selecione</option>
    <option value="__NOT_USED__">Não será utilizado</option>
  `;

  const lista = tipo === "fila" ? FILAS_DISPONIVEIS : URAS_DISPONIVEIS;
  lista.forEach(item => {
    const opt = document.createElement("option");
    opt.value = item;
    opt.textContent = item;
    select.appendChild(opt);
  });

  /* SUBMENU */
  const label = document.createElement("label");
  label.style.fontSize = "12px";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = true;

  label.appendChild(checkbox);
  label.append(" Usar como submenu");

  /* DESABILITA SUBMENU SE NÃO UTILIZAR */
  select.addEventListener("change", () => {
    if (select.value === "__NOT_USED__" || select.value === "") {
      checkbox.checked = false;
      checkbox.disabled = true;
    } else {
      checkbox.disabled = false;
    }
  });

  /* REMOVER */
  const btn = document.createElement("button");
  btn.textContent = "✖";
  btn.type = "button";
  btn.onclick = () => wrapper.remove();

  wrapper.appendChild(select);
  wrapper.appendChild(label);
  wrapper.appendChild(btn);

  return wrapper;
}

/* ====== EXPORT / EXPLORAR ====== */
async function explorar() {
  const dados = {};
  let filaIndex = 1;
  let uraIndex = 1;

  document.querySelectorAll("#listaFilas .campo").forEach(campo => {
    const select = campo.querySelector("select");
    const submenu = campo.querySelector("input[type=checkbox]").checked;

    if (
      select.value &&
      select.value !== "__NOT_USED__" &&
      filaIndex <= LIMITE
    ) {
      dados[`fila_${filaIndex}`] = {
        tipo: "fila",
        nome: select.value,
        submenu
      };
      filaIndex++;
    }
  });

  document.querySelectorAll("#listaURAs .campo").forEach(campo => {
    const select = campo.querySelector("select");
    const submenu = campo.querySelector("input[type=checkbox]").checked;

    if (
      select.value &&
      select.value !== "__NOT_USED__" &&
      uraIndex <= LIMITE
    ) {
      dados[`ura_${uraIndex}`] = {
        tipo: "ura",
        principal: select.value,
        submenu
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
