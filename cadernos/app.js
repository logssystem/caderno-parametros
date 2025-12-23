async function explorar() {
  const filaNome = document.getElementById("filaNome").value;
  const uraNome = document.getElementById("uraNome").value;

  if (!filaNome || !uraNome) {
    alert("Preencha todos os campos");
    return;
  }

  const payload = {
    dados: {
      fila: {
        tipo: "fila",
        nome: filaNome
      },
      ura: {
        tipo: "ura",
        principal: uraNome
      }
    }
  };

  try {
    const res = await fetch("https://caderno-api.onrender.com/explorar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    document.getElementById("resultado").textContent =
      JSON.stringify(data, null, 2);

  } catch (e) {
    document.getElementById("resultado").textContent =
      "Erro ao chamar a API";
  }
}
