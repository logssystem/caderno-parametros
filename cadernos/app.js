// ===============================
// Adicionar campos dinâmicos
// ===============================

function adicionarFilaCampo() {
  const container = document.getElementById("listaFilas");

  const input = document.createElement("input");
  input.placeholder = "Nome da fila (ex: Suporte)";

  container.appendChild(input);
}

function adicionarURACampo() {
  const container = document.getElementById("listaURAs");

  const input = document.createElement("input");
  input.placeholder = "Nome da URA (ex: URA Atendimento)";

  container.appendChild(input);
}

// ===============================
// Explorar (envia para API)
// ===============================

async function explorar() {
  const dados = {};

  // FILA (usa a primeira preenchida)
  const filas = document.querySelectorAll("#listaFilas input");
  for (const input of filas) {
    if (input.value) {
      dados.fila = {
        tipo: "fila",
        nome: input.value
      };
      break;
    }
  }

  // URA (usa a primeira preenchida)
  const uras = document.querySelectorAll("#listaURAs input");
  for (const input of uras) {
    if (input.value) {
      dados.ura = {
        tipo: "ura",
        principal: input.value
      };
      break;
    }
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
