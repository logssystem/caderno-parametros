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
  if (!listas[tipo]) return mostrarToast(`Tipo inválido: ${tipo}`, true);
  const container = document.getElementById(listas[tipo]);
  if (!container || container.children.length >= LIMITE) return;
  container.appendChild(criarCampo(tipo));
};

/* ================= CRIAR CAMPO ================= */
function criarCampo(tipo) {
  const wrap = document.createElement("div");
  wrap.className = "campo-descricao";

  const linhaNome = document.createElement("div");
  linhaNome.className = "linha-principal";

  const nome = document.createElement("input");
  nome.placeholder = `Digite ${tipo.replace("_", " ")}`;
  nome.classList.add("campo-nome");
  nome.style.width = "100%";

  const btn = document.createElement("button");
  btn.textContent = "✖";
  btn.onclick = () => wrap.remove();

  linhaNome.append(nome, btn);
  wrap.append(linhaNome);

  let emailInput = null;
  let senhaInput = null;
  let permissao = null;
  let regras = null;
  let senhaOk = false;

  const precisaSenha = tipo === "usuario_web" || tipo === "ring";

  /* EMAIL + SENHA (usuário web e ramal) */
  if (precisaSenha) {
    const linhaCred = document.createElement("div");
    linhaCred.className = "linha-principal";
    linhaCred.style.gap = "12px";
    linhaCred.style.marginTop = "12px";

    if (tipo === "usuario_web") {
      emailInput = document.createElement("input");
      emailInput.type = "email";
      emailInput.placeholder = "E-mail do usuário";
      emailInput.style.flex = "1";
      linhaCred.append(emailInput);
    }

    senhaInput = document.createElement("input");
    senhaInput.placeholder = "Senha";
    senhaInput.classList.add("campo-senha");
    senhaInput.style.flex = "1";

    linhaCred.append(senhaInput);
    wrap.append(linhaCred);

    regras = document.createElement("div");
    regras.style.marginTop = "8px";
    wrap.append(regras);

    senhaInput.oninput = () => {
      const v = senhaInput.value;
      regras.innerHTML = "";
      senhaOk = false;

      if (v.length < 11) return regra("Mínimo de 11 caracteres");
      if (!/[A-Z]/.test(v)) return regra("Pelo menos 1 letra maiúscula");
      if (!/\d/.test(v)) return regra("Pelo menos 1 número");
      if (!/[^A-Za-z0-9]/.test(v)) return regra("Pelo menos 1 caractere especial");

      regras.innerHTML = `<div class="regra-ok">Senha válida</div>`;
      senhaOk = true;
    };

    function regra(msg) {
      regras.innerHTML = `<div class="regra-erro">${msg}</div>`;
    }
  }

  /* PERMISSÃO (somente usuário web) */
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

  const desc = document.createElement("textarea");
  desc.placeholder = "Descrição (opcional)";
  desc.style.marginTop = "12px";
  wrap.append(desc);

  wrap.validarSenha = () => (precisaSenha ? senhaOk : true);
  wrap.getNome = () => nome.value;
  wrap.getEmail = () => emailInput?.value || "x@x";
  wrap.getSenha = () => senhaInput?.value || "";
  wrap.getPermissao = () => permissao?.value || "";
  wrap.setPermissaoAtalho = atalho => {
    const key = atalho?.toLowerCase();
    if (MAPA_PERMISSOES[key]) permissao.value = MAPA_PERMISSOES[key];
  };

  return wrap;
}

/* ================= RANGE RAMAIS ================= */
window.criarRangeRamais = function () {
  const ini = Number(document.getElementById("ramalInicio").value);
  const fim = Number(document.getElementById("ramalFim").value);
  const container = document.getElementById("listaRings");

  if (!ini || !fim || fim < ini) {
    mostrarToast("Range inválido", true);
    return;
  }

  for (let i = ini; i <= fim; i++) {
    if (container.children.length >= LIMITE) break;
    const campo = criarCampo("ring");
    campo.querySelector(".campo-nome").value = i;
    container.appendChild(campo);
  }

  mostrarToast("Range criado com sucesso!");
};

/* ================= IMPORTAÇÃO CSV ================= */
window.acionarImportacao = function (tipo) {
  const input = document.getElementById(
    tipo === "usuario_web" ? "importUsuarios" : "importRamais"
  );
  if (!input) return;

  input.value = "";
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
  const linhas = texto.replace(/\r/g, "").split("\n").filter(l => l.trim());
  if (linhas.length < 2) return;

  const sep = linhas[0].includes(";") ? ";" : ",";
  const header = linhas.shift().split(sep).map(h => h.trim().toLowerCase());
  const container = document.getElementById(listas[tipo]);

  linhas.forEach(l => {
    const v = l.split(sep).map(x => x.trim());
    const d = {};
    header.forEach((h, i) => (d[h] = v[i] || ""));

    if (!d.usuario && !d.nome) return;

    const campo = criarCampo(tipo);
    campo.querySelector(".campo-nome").value = d.usuario || d.nome;

    if (tipo === "usuario_web") {
      campo.querySelector("input[type=email]").value = d.email || "x@x";
      campo.querySelector(".campo-senha").value = d.senha || "";
      campo.setPermissaoAtalho(d.permissao);
    }

    if (tipo === "ring") {
      campo.querySelector(".campo-senha").value = d.senha || "";
    }

    container.appendChild(campo);
  });

  mostrarToast("Importação concluída!");
}

/* ================= TOAST ================= */
function mostrarToast(msg, error = false) {
  const t = document.getElementById("toastGlobal");
  document.getElementById("toastMessage").textContent = msg;
  t.className = "toast show" + (error ? " error" : "");
  setTimeout(() => t.classList.remove("show"), 3000);
}

window.fecharToast = () =>
  document.getElementById("toastGlobal").classList.remove("show");

/* ================= TEMA ================= */
const toggleTheme = document.getElementById("toggleTheme");
if (toggleTheme) {
  toggleTheme.onclick = () => {
    document.body.classList.toggle("dark");
  };
}
