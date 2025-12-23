function criarCampo(containerId, placeholder) {
  const container = document.getElementById(containerId);

  const wrapper = document.createElement("div");
  wrapper.style.display = "flex";
  wrapper.style.gap = "8px";
  wrapper.style.marginBottom = "6px";

  const input = document.createElement("input");
  input.placeholder = placeholder;
  input.style.flex = "1";

  const btnRemover = document.createElement("button");
  btnRemover.textContent = "❌";
  btnRemover.type = "button";
  btnRemover.onclick = () => wrapper.remove();

  wrapper.appendChild(input);
  wrapper.appendChild(btnRemover);
  container.appendChild(wrapper);
}

function adicionarFilaCampo() {
  criarCampo("listaFilas", "Nome da fila (ex: Suporte)");
}

function adicionarURACampo() {
  criarCampo("listaURAs", "Nome da URA (ex: URA Atendimento)");
}

async function explorar() {
  const dados = {
    filas: [],
    uras: []
  };

  document.querySelectorAll("#listaFilas input").forEach(input => {
    if (input.value.trim()) {
      dados.filas.push({
        tipo: "fila",
        nome: input.value.trim()
      });
    }
  });

  document.querySelectorAll("#listaURAs input").forEach(input => {
    if (input.value.trim()) {
      dados.uras.push({
        tipo: "ura",
        principal: input.value.trim()
      });
    }
  });

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

// cria 1 campo inicial de cada ao carregar
adicionarFilaCampo();
adicionarURACampo();
