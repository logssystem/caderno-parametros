console.log("APP.JS CARREGADO COM SUCESSO");

const LIMITE = 10;

const listas = {
  usuario_web: "listaUsuariosWeb",
  entrada: "listaEntradas",
  ura: "listaURAs",
  fila: "listaFilas",
  ring: "listaRings",
  agente: "listaAgentes"
};

/* ===== ADICIONAR CAMPOS ===== */
window.adicionarCampo = function (tipo) {
  const container = document.getElementById(listas[tipo]);
  if (!container) {
    console.error("Container não encontrado:", tipo);
    return;
  }

  const total = container.querySelectorAll(".campo-descricao").length;
  if (total >= LIMITE) {
    alert("Limite máximo de 10 itens atingido");
    return;
  }

  container.appendChild(criarCampo(tipo));
  atualizarResumo();
};

window.adicionarRamal = function () {
  const container = document.getElementById("listaRamais");
  if (!container) return;

  const total = container.querySelectorAll(".campo").length;
  if (total >= LIMITE) {
    alert("Limite máximo de 10 ranges atingido");
    return;
  }

  const wrapper = document.createElement("div");
  wrapper.className = "campo";

  const ramalInicial = document.createElement("input");
  ramalInicial.type = "number";
  ramalInicial.placeholder = "Ramal inicial (ex: 2000)";

  const range = document.createElement("input");
  range.type = "number";
  range.placeholder = "Range (ex: 5)";

  const btn = document.createElement("button");
  btn.textContent = "✖";
  btn.type = "button";
  btn.onclick = () => {
    wrapper.remove();
    atualizarResumo();
  };

  wrapper.append(ramalInicial, range, btn);
  container.appendChild(wrapper);
  atualizarResumo();
};

/* ===== EXPORT*
