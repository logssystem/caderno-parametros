// ===============================
// Caderno de Parâmetros – app.js
// ===============================

// Cria novo campo de FILA
function adicionarFilaCampo() {
  const container = document.getElementById("listaFilas");

  const input = document.createElement("input");
  input.placeholder = "Nome da fila (ex: Suporte)";

  container.appendChild(input);
}

// Cria novo campo de URA
function adicionarURACampo() {
  const container = document.getElementById("listaURAs");

  const input = document.createElement("input");
  input.placeholder = "Nome da URA (ex: URA Atendimento)";

  container.appendChild(input);
}

// Envia dados para a API
async function explorar() {
  const dados = {};

  // ===============================
  // FILAS
  // ===============================
  const filasInputs = document.querySelectorAll("#listaFilas input");
  if (filasInputs.length > 0 && filasInputs[0].value) {
    dados.fila = {
      tipo: "fila",
      nome: filasInputs[0].value
    };
  }

  // ===============================
  // URAS
  // ===============================
  const urasInputs = document.querySelectorAll("#listaURAs input");
  if (urasInputs.length > 0 && urasInputs[0].value) {
    dados.ura = {
      tipo: "ura",
      principal: urasInputs[0].value
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
