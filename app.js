console.log("APP.JS FINAL – ESTÁVEL");

/* CONFIG */
const LIMITE = 600;

const listas = {
  usuario_web: "listaUsuariosWeb",
  entrada: "listaEntradas",
  ura: "listaURAs",
  fila: "listaFilas",
  ring: "listaRings",
  grupo_ring: "listaGrupoRing",
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

const MAPA_PERMISSOES = {
  pabx: PERMISSOES[0],
  agente: PERMISSOES[1],
  supervisor: PERMISSOES[2],
  crm: PERMISSOES[3],
  crm_owner: PERMISSOES[4],
  omni: PERMISSOES[5],
  agente_omni: PERMISSOES[6],
  super_omni: PERMISSOES[7],
  super_admin: PERMISSOES[8]
};

/* ================= ADICIONAR CAMPO ================= */
window.adicionarCampo = function (tipo) {
  const container = document.getElementById(listas[tipo]);
  if (!container || container.children.length >= LIMITE) return;
  container.appendChild(criarCampo(tipo));
};

/* ================= CRIAR CAMPO ================= */
function criarCampo(tipo) {
  const wrap = document.createElement("div");
  wrap.className = "campo-descricao";

  /* NOME */
  const linhaNome = document.createElement("div");
  linhaNome.className = "linha-principal";

  const nome = document.createElement("input");
  nome.classList.add("campo-nome");
  nome.placeholder = `Digite ${tipo.replace("_", " ")}`;
  nome.style.width = "100%";

  const btn = document.createElement("button");
  btn.textContent = "✖";
  btn.onclick = () => wrap.remove();

  linhaNome.append(nome, btn);
  wrap.append(linhaNome);

  let emailInput, senhaInput, permissao, regras;
  let senhaOk = false;

  /* USUÁRIO WEB ou RAMAL */
  if (tipo === "usuario_web" || tipo === "ring") {
    const linhaCred = document.createElement("div");
    linhaCred.className = "linha-principal";
    linhaCred.style.gap = "12px";
    linhaCred.style.marginTop = "12px";

    if (tipo === "usuario_web") {
      emailInput = document.createElement("input");
      emailInput.type = "email";
      emailInput.placeholder = "E-mail do usuário";
      emailInput.style.flex = "1";
      linhaCred.appendChild(emailInput);
    }

    senhaInput = document.createElement("input");
    senhaInput.placeholder = "Senha";
    senhaInput.classList.add("campo-senha");
    senhaInput.style.flex = "1";
    linhaCred.appendChild(senhaInput);

    wrap.append(linhaCred);

    if (tipo === "usuario_web") {
      permissao = document.createElement("select");
      permissao.classList.add("campo-permissao");
      permissao.style.marginTop = "12px";

      const opt0 = new Option("Selecione a permissão", "");
      opt0.disabled = true;
      opt0.selected = true;
      permissao.appendChild(opt0);
      PERMISSOES.forEach(p => permissao.add(new Option(p, p)));

      wrap.append(permissao);
    }

    regras = document.createElement("div");
    regras.style.marginTop = "10px";
    wrap.append(regras);

    senhaInput.oninput = () => {
      const v = senhaInput.value;
      senhaOk = true;
      regras.innerHTML = "";

      if (v.length < 11) return erro("Mínimo 11 caracteres");
      if (!/[A-Z]/.test(v)) return erro("Precisa letra maiúscula");
      if (!/\d/.test(v)) return erro("Precisa número");
      if (!/[^A-Za-z0-9]/.test(v)) return erro("Precisa caractere especial");

      regras.innerHTML = `<div class="regra-ok">Senha válida</div>`;
    };

    function erro(msg) {
      senhaOk = false;
      regras.innerHTML = `<div class="regra-erro">${msg}</div>`;
    }
  }

  const desc = document.createElement("textarea");
  desc.placeholder = "Descrição (opcional)";
  desc.style.marginTop = "12px";
  wrap.append(desc);

  wrap.validarSenha = () => senhaOk;
  wrap.getNome = () => nome.value;
  wrap.getEmail = () => emailInput?.value || "x@x";
  wrap.getSenha = () => senhaInput?.value || "";
  wrap.getPermissao = () => permissao?.value || "";
  wrap.setPermissaoAtalho = a => MAPA_PERMISSOES[a]?. && (permissao.value = MAPA_PERMISSOES[a]);

  return wrap;
}

/* ================= RANGE RAMAIS ================= */
window.criarRangeRamais = function () {
  const ini = Number(ramalInicio.value);
  const fim = Number(ramalFim.value);
  const container = listaRings;

  if (!ini || !fim || fim < ini) return mostrarToast("Range inválido", true);

  for (let i = ini; i <= fim; i++) {
    const c = criarCampo("ring");
    c.querySelector(".campo-nome").value = i;
    container.appendChild(c);
  }

  mostrarToast("Range criado com sucesso!");
};

/* ================= IMPORTAÇÃO CSV ================= */
window.acionarImportacao = function (tipo) {
  const input = document.getElementById(
    tipo === "usuario_web" ? "importUsuarios" : "importRamais"
  );
  input.value = "";
  input.click();

  input.onchange = () => {
    const reader = new FileReader();
    reader.onload = e => processarCSV(tipo, e.target.result);
    reader.readAsText(input.files[0]);
  };
};

function processarCSV(tipo, texto) {
  const linhas = texto.replace(/\r/g, "").split("\n");
  const header = linhas.shift().split(";");

  linhas.forEach(l => {
    if (!l.trim()) return;
    const d = l.split(";");
    const campo = criarCampo(tipo);

    campo.querySelector(".campo-nome").value = d[0];

    if (tipo === "usuario_web") {
      campo.querySelector("input[type=email]").value = d[1] || "x@x";
      campo.querySelector(".campo-senha").value = d[2];
      campo.setPermissaoAtalho(d[3]);
    }

    if (tipo === "ring") {
      campo.querySelector(".campo-senha").value = d[1];
    }

    document.getElementById(listas[tipo]).appendChild(campo);
  });

  mostrarToast("Importação concluída!");
}

/* ================= TEMA ================= */
const toggleTheme = document.getElementById("toggleTheme");
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  toggleTheme.textContent = "☀️";
}

toggleTheme.onclick = () => {
  document.body.classList.toggle("dark");
  const d = document.body.classList.contains("dark");
  toggleTheme.textContent = d ? "☀️" : "🌙";
  localStorage.setItem("theme", d ? "dark" : "light");
};
