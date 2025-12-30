console.log("APP.JS FINAL 600+ COM IMPORTAÇÃO");

const LIMITE = 600;

const listas = {
  usuario_web: "listaUsuariosWeb",
  entrada: "listaEntradas",
  ura: "listaURAs",
  fila: "listaFilas",
  ring: "listaRings",
  agente: "listaAgentes"
};

const PERMISSOES = [
  "Administrador do Módulo de PABX",
  "Agente de Call Center",
  "Supervisor(a) de Call Center",
  "CRM",
  "CRM Owner",
  "Administrador do Módulo de Omnichannel",
  "Agente Omnichannel",
  "Supervisor(a) Omnichannel",
  "Super Administrador"
];

/* ========= ADICIONAR CAMPO ========= */
window.adicionarCampo = function (tipo) {
  const container = document.getElementById(listas[tipo]);
  if (!container || container.children.length >= LIMITE) return;
  container.appendChild(criarCampo(tipo));
};

/* ========= CRIAR CAMPO ========= */
function criarCampo(tipo) {
  const wrap = document.createElement("div");
  wrap.className = "campo-descricao";

  const linha = document.createElement("div");
  linha.className = "linha-principal";

  const nome = document.createElement("input");
  nome.placeholder = `Digite ${tipo}`;

  const btn = document.createElement("button");
  btn.textContent = "✖";
  btn.onclick = () => wrap.remove();

  linha.append(nome, btn);
  wrap.append(linha);

  let senhaInput, regrasBox, permissao;

  if (tipo === "usuario_web") {
    senhaInput = document.createElement("input");
    senhaInput.className = "campo-senha";
    senhaInput.placeholder = "Senha";

    permissao = document.createElement("select");
    permissao.className = "campo-permissao";
    PERMISSOES.forEach(p => permissao.add(new Option(p, p)));

    regrasBox = document.createElement("div");

    senhaInput.oninput = () => {
      regrasBox.innerHTML = "";
      if (senhaInput.value.length < 11)
        regrasBox.innerHTML = `<div class="regra-erro">Mínimo 11 caracteres</div>`;
      else
        regrasBox.innerHTML = `<div class="regra-ok">Senha válida</div>`;
    };

    wrap.append(senhaInput, permissao, regrasBox);
  }

  const desc = document.createElement("textarea");
  desc.placeholder = "Descrição";
  wrap.append(desc);

  return wrap;
}

/* ========= IMPORTAÇÃO ========= */
window.acionarImportacao = function (tipo) {
  const input = document.getElementById(tipo === "usuario_web" ? "importUsuarios" : "importRamais");
  input.click();

  input.onchange = () => {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => processarCSV(tipo, e.target.result);
    reader.readAsText(file);
  };
};

function processarCSV(tipo, texto) {
  const linhas = texto.split("\n").slice(1);

  linhas.forEach(l => {
    const dados = l.split(",");
    if (!dados[0]) return;

    const campo = criarCampo(tipo === "ramal" ? "ring" : tipo);
    campo.querySelector("input").value = dados[0];

    if (tipo === "usuario_web") {
      campo.querySelector(".campo-senha").value = dados[1] || "";
      campo.querySelector(".campo-permissao").value = dados[2] || "";
    }

    document.getElementById(listas[tipo === "ramal" ? "ring" : tipo]).appendChild(campo);
  });

  mostrarToast("Importação concluída!");
}

/* ========= EXPORTAR ========= */
window.explorar = function () {
  const dados = {};
  Object.keys(listas).forEach(t => {
    dados[t] = [...document.getElementById(listas[t]).children].map(c => ({
      nome: c.querySelector("input")?.value || ""
    }));
  });

  document.getElementById("resultado").textContent = JSON.stringify(dados, null, 2);
};

/* ========= TOAST ========= */
function mostrarToast(msg, error = false) {
  const t = document.getElementById("toastGlobal");
  document.getElementById("toastMessage").textContent = msg;
  t.className = "toast show" + (error ? " error" : "");
  setTimeout(() => t.classList.remove("show"), 4000);
}

window.fecharToast = () => document.getElementById("toastGlobal").classList.remove("show");

/* ========= TEMA ========= */
document.getElementById("toggleTheme").onclick = () =>
  document.body.classList.toggle("dark");
