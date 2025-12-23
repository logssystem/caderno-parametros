function criarCampo(containerId, placeholder) {
  const container = document.getElementById(containerId);

  const wrapper = document.createElement("div");
  wrapper.style.display = "flex";
  wrapper.style.gap = "8px";
  wrapper.style.marginBottom = "8px";

  const input = document.createElement("input");
  input.placeholder = placeholder;
  input.style.flex = "1";

  const remover = document.createElement("button");
  remover.textContent = "❌";
  remover.onclick = () => wrapper.remove();

  wrapper.appendChild(input);
  wrapper.appendChild(remover);
  container.appendChild(wrapper);
}

// FILAS
function adicionarFilaCampo() {
  criarCampo("listaFilas", "Nome da fila (ex: Suporte)");
}

// URAS
function adicionarURACampo() {
  criarCampo("listaURAs", "Nome da URA (ex: URA Atendimento)");
}

// EXPLORAR
async function explorar() {
  const dados = {};

  const filas = document.querySelectorAll("#listaFilas input");
  if (filas.length > 0 && filas[0].value) {
    dados.fila = {
      tipo: "fila",
      nome: filas[0].value
    };
  }

  const uras = document.querySelectorAll("#listaURAs input");
  if (uras.length > 0 && uras[0].value) {
    dados.ura = {
      tipo: "ura",
      principal: uras[0].value
    };
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
