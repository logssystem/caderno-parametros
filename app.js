console.log("APP.JS FINAL – ESTÁVEL");

/* ================= CONFIG ================= */

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
  if (!listas[tipo]) {
    mostrarToast(`Tipo inválido: ${tipo}`, true);
    return;
  }

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
  let senhaOk = true;

  /* ===== USUÁRIO WEB ===== */
  if (tipo === "usuario_web") {
    const linhaCred = document.createElement("div");
    linhaCred.className = "linha-principal";
    linhaCred.style.gap = "12px";
    linhaCred.style.marginTop = "12px";

    emailInput = document.createElement("input");
    emailInput.type = "email";
    emailInput.placeholder = "E-mail do usuário";
    emailInput.style.flex = "1";

    senhaInput = document.createElement("input");
    senhaInput.placeholder = "Senha do usuário";
    senhaInput.classList.add("campo-senha");
    senhaInput.style.flex = "1";

    linhaCred.append(emailInput, senhaInput);
    wrap.append(linhaCred);

    permissao = document.createElement("select");
    permissao.classList.add("campo-permissao");
    permissao.style.marginTop = "12px";

    const opt0 = new Option("Selecione a permissão", "");
    opt0.disabled = true;
    opt0.selected = true;
    permissao.appendChild(opt0);

    PERMISSOES.forEach(p => permissao.add(new Option(p, p)));
    wrap.append(permissao);

    regras = document.createElement("div");
    regras.style.marginTop = "10px";
    wrap.append(regras);

    senhaInput.oninput = () => validarSenha(senhaInput, regras);
  }

  /* ===== RAMAL (COM SENHA) ===== */
  if (tipo === "ring") {
    senhaInput = document.createElement("input");
    senhaInput.placeholder = "Senha do ramal";
    senhaInput.classList.add("campo-senha");
    senhaInput.style.marginTop = "12px";
    wrap.append(senhaInput);

    regras = document.createElement("div");
    regras.style.marginTop = "8px";
    wrap.append(regras);

    senhaInput.oninput = () => validarSenha(senhaInput, regras);
  }

  /* DESCRIÇÃO */
  const desc = document.createElement("textarea");
  desc.placeholder = "Descrição (opcional)";
  desc.style.marginTop = "12px";
  wrap.append(desc);

  function validarSenha(input, regrasEl) {
    const v = input.value;
    senhaOk =
      v.length >= 11 &&
      /[A-Z]/.test(v) &&
      /\d/.test(v) &&
      /[^A-Za-z0-9]/.test(v);

    regrasEl.innerHTML = senhaOk
      ? `<div class="regra-ok">Senha válida</div>`
      : `<div class="regra-erro">Mín. 11 | Maiúscula | Número | Especial</div>`;
  }

  /* MÉTODOS */
  wrap.validarSenha = () => senhaOk;
  wrap.getNome = () => nome.value;
  wrap.getEmail = () => emailInput?.value || "";
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
  const linhas = texto
    .replace(/\r/g, "")
    .split("\n")
    .map(l => l.trim())
    .filter(Boolean);

  if (linhas.length < 2) {
    mostrarToast("CSV vazio ou inválido", true);
    return;
  }

  const sep = linhas[0].includes(";") ? ";" : ",";
  const header = linhas.shift().split(sep).map(h => h.trim().toLowerCase());
  const container = document.getElementById(listas[tipo]);
  let criados = 0;

  linhas.forEach(l => {
    const v = l.split(sep).map(x => x.trim());
    const d = {};
    header.forEach((h, i) => (d[h] = v[i] || ""));

    const nome = d.usuario || d.nome;
    if (!nome || !d.senha) return;
    if (tipo === "usuario_web" && !d.email) return;

    const campo = criarCampo(tipo);
    campo.querySelector(".campo-nome").value = nome;
    campo.querySelector(".campo-senha").value = d.senha;

    if (tipo === "usuario_web") {
      campo.querySelector("input[type=email]").value = d.email;
      campo.setPermissaoAtalho(d.permissao);
    }

    campo.querySelector("textarea").value = d.descricao || "";
    container.appendChild(campo);
    criados++;
  });

  criados
    ? mostrarToast(`${criados} registros importados com sucesso!`)
    : mostrarToast("Nenhuma linha válida encontrada", true);
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

/* ================= CHAT ================= */

function initChat() {
  const modo = localStorage.getItem("modo_atendimento");
  const cardChat = document.getElementById("card-chat");

  if (!cardChat) return;

  // Só aparece em chat ou ambos
  cardChat.style.display =
    modo === "chat" || modo === "ambos" ? "block" : "none";

  const chkApi = document.getElementById("chatApi");
  const chkQr = document.getElementById("chatQr");
  const campoApi = document.getElementById("campoApi");
  const campoQr = document.getElementById("campoQr");

  chkApi.onchange = () => {
    campoApi.style.display = chkApi.checked ? "block" : "none";
  };

  chkQr.onchange = () => {
    campoQr.style.display = chkQr.checked ? "block" : "none";
  };
}

// chama após carregar
document.addEventListener("DOMContentLoaded", initChat);
