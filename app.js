console.log("APP.JS CARREGADO - VERSAO FINAL");

const LIMITE = 10;

const listas = {
  usuario_web: "listaUsuariosWeb",
  entrada: "listaEntradas",
  ura: "listaURAs",
  fila: "listaFilas",
  ring: "listaRings",
  agente: "listaAgentes"
};

/* ADICIONAR CAMPOS */
window.adicionarCampo = function (tipo) {
  const container = document.getElementById(listas[tipo]);
  if (!container) return;

  if (container.querySelectorAll(".campo-descricao").length >= LIMITE) {
    alert("Limite máximo atingido");
    return;
  }

  container.appendChild(criarCampo(tipo));
};

/* ADICIONAR RAMAL */
window.adicionarRamal = function () {
  const container = document.getElementById("listaRamais");
  if (!container) return;

  const wrapper = document.createElement("div");
  wrapper.className = "campo";

  const ini = document.createElement("input");
  ini.type = "number";
  ini.placeholder = "Ramal inicial";

  const qtd = document.createElement("input");
  qtd.type = "number";
  qtd.placeholder = "Range";

  const btn = document.createElement("button");
  btn.textContent = "✖";
  btn.onclick = () => wrapper.remove();

  wrapper.append(ini, qtd, btn);
  container.appendChild(wrapper);
};

/* CRIAR CAMPO PADRÃO */
function criarCampo(tipo) {
  const wrap = document.createElement("div");
  wrap.className = "campo campo-descricao";

  const linha = document.createElement("div");
  linha.className = "linha-principal";

  const input = document.createElement("input");
  input.placeholder = `Digite ${tipo.replace("_", " ")}`;

  const btn = document.createElement("button");
  btn.textContent = "✖";
  btn.onclick = () => wrap.remove();

  linha.append(input, btn);

  const desc = document.createElement("textarea");
  desc.placeholder = "Descrição (opcional)";

  const label = document.createElement("label");
  label.className = "nao-utilizado";

  const chk = document.createElement("input");
  chk.type = "checkbox";

  chk.onchange = () => {
    input.disabled = chk.checked;
    desc.disabled = chk.checked;
    wrap.closest(".card").classList.toggle("card-disabled", chk.checked);
    if (chk.checked) {
      input.value = "";
      desc.value = "";
    }
  };

  label.append(chk, " Não será utilizado");
  wrap.append(linha, desc, label);

  return wrap;
}

/* EXPLORAR + RESUMO */
window.explorar = function () {
  const dados = {};
  const resumo = [];

  Object.keys(listas).forEach(tipo => {
    const campos = document.querySelectorAll(`#${listas[tipo]} .campo-descricao`);
    let ativos = 0;

    campos.forEach(c => {
      const input = c.querySelector("input[type=text]");
      const chk = c.querySelector("input[type=checkbox]");
      if (!chk.checked && input.value.trim()) ativos++;
    });

    resumo.push(
      `<li><strong>${tipo}:</strong> ${
        ativos ? ativos + " ativo(s)" : "Não utilizado"
      }</li>`
    );
  });

  document.getElementById("resumoLista").innerHTML = resumo.join("");
  document.getElementById("resumoCard").style.display = "block";

  document.getElementById("resultado").textContent =
    JSON.stringify({ resumo }, null, 2);
};
