const LIMITE = 10;

function adicionarFilaCampo() {
  const container = document.getElementById("listaFilas");
  if (container.querySelectorAll(".campo").length >= LIMITE) {
    alert("Máximo de 10 filas permitido");
    return;
  }
  container.appendChild(criarCampo("fila", "Nome da fila (ex: Suporte)"));
}

function adicionarURACampo() {
  const container = document.getElementById("listaURAs");
  if (container.querySelectorAll(".campo").length >= LIMITE) {
    alert("Máximo de 10 URAs permitido");
    return;
  }
  container.appendChild(criarCampo("ura", "Nome da URA (ex: URA Atendimento)"));
}

function criarCampo(tipo, placeholder) {
  const wrapper = document.createElement("div");
  wrapper.className = "campo";
  wrapper.style.display = "flex";
  wrapper.style.alignItems = "center";
  wrapper.style.gap = "8px";
  wrapper.style.marginBottom = "6px";

  const input = document.createElement("input");
  input.placeholder = placeholder;

  const label = document.createElement("label");
  label.style.fontSize = "12px";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = true;

  label.appendChild(checkbox);
  label.append(" Usar como submenu");

  const btn = document.createElement("button");
  btn.textContent = "✖";
  btn.type = "button";
  btn.onclick = () => wrapper.remove();

  wrapper.appendChild(input);
  wrapper.appendChild(label);
  wrapper.appendChild(btn);

  return wrapper;
}

async function explorar() {
  const dados = {};
  let filaIndex = 1;
  let uraIndex = 1;

  document.querySelectorAll("#listaFilas .campo").forEach(campo => {
    const nome = campo.querySelector("input").value.trim();
    const submenu = campo.querySelector("input[type=checkbox]").checked;

    if (nome && filaIndex <= LIMITE) {
      dados[`fila_${filaIndex}`] = {
        tipo: "fila",
        nome,
        submenu
      };
      filaIndex++;
    }
  });

  document.querySelectorAll("#listaURAs .campo").forEach(campo => {
    const nome = campo.querySelector("input").value.trim();
    const submenu = campo.querySelector("input[type=checkbox]").checked;

    if (nome && uraIndex <= LIMITE) {
      dados[`ura_${uraIndex}`] = {
        tipo: "ura",
        principal: nome,
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
