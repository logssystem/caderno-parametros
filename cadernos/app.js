let dados = {};

function adicionarFila() {
  const nome = document.getElementById("filaNome").value;
  if (!nome) {
    alert("Informe o nome da fila");
    return;
  }

  dados.fila = {
    tipo: "fila",
    nome: nome
  };

  alert("Fila adicionada!");
}

function adicionarURA() {
  const nome = document.getElementById("uraNome").value;
  if (!nome) {
    alert("Informe o nome da URA");
    return;
  }

  dados.ura = {
    tipo: "ura",
    principal: nome
  };

  alert("URA adicionada!");
}

async function explorar() {
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
