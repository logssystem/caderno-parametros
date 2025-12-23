function adicionarFilaCampo() {
  console.log("Adicionar fila clicado");

  const container = document.getElementById("listaFilas");

  const input = document.createElement("input");
  input.placeholder = "Nome da fila (ex: Suporte)";

  container.appendChild(input);
}

function adicionarURACampo() {
  console.log("Adicionar URA clicado");

  const container = document.getElementById("listaURAs");

  const input = document.createElement("input");
  input.placeholder = "Nome da URA (ex: URA Atendimento)";

  container.appendChild(input);
}

async function explorar() {
  console.log("Explorar clicado");

  const dados = {};

  const filas = document.querySelectorAll("#listaFilas input");
  if (filas[0]?.value) {
    dados.fila = {
      tipo: "fila",
      nome: filas[0].value
    };
  }

  const uras = document.querySelectorAll("#listaURAs input");
  if (uras[0]?.value) {
    dados.ura = {
      tipo: "ura",
      principal: uras[0].value
    };
  }

  const res = await fetch("https://caderno-api.onrender.com/explorar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dados })
  });

  const json = await res.json();
  document.getElementById("resultado").textContent =
    JSON.stringify(json, null, 2);
}
