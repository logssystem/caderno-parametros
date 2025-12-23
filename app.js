async function explorar() {
  const dados = {};

  // 🔹 FILAS (pega todas)
  const filasInputs = document.querySelectorAll("#listaFilas input");
  const filas = [];

  filasInputs.forEach(input => {
    if (input.value.trim()) {
      filas.push({
        tipo: "fila",
        nome: input.value.trim()
      });
    }
  });

  // 🔹 URA (apenas 1 principal)
  const urasInputs = document.querySelectorAll("#listaURAs input");
  let ura = null;

  if (urasInputs.length > 0 && urasInputs[0].value.trim()) {
    ura = {
      tipo: "ura",
      principal: urasInputs[0].value.trim()
    };
  }

  // 🔹 monta payload NO FORMATO QUE O BACKEND ESPERA
  if (filas.length > 0) {
    dados.fila = filas[0]; // MVP: 1 fila principal
  }

  if (ura) {
    dados.ura = ura;
  }

  const payload = { dados };

  console.log("Payload enviado:", payload);

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
