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

  /* LINHA NOME */
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
  let senhaOk = false;

  const precisaSenha = tipo === "usuario_web" || tipo === "ring";

  /* EMAIL + SENHA */
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

    /* BLOCO SENHA (CRÍTICO PARA O LAYOUT) */
    const blocoSenha = document.createElement("div");
    blocoSenha.style.flex = "1";
    blocoSenha.style.display = "flex";
    blocoSenha.style.flexDirection = "column";

    senhaInput = document.createElement("input");
    senhaInput.placeholder = "Senha";
    senhaInput.classList.add("campo-senha");

    const regras = document.createElement("div");
    regras.style.marginTop = "6px";

    blocoSenha.append(senhaInput, regras);
    linhaCred.append(blocoSenha);
    wrap.append(linhaCred);

    senhaInput.oninput = () => {
      const v = senhaInput.value;
      const okLen = v.length >= 11;
      const okUpper = /[A-Z]/.test(v);
      const okNum = /\d/.test(v);
      const okSpec = /[^A-Za-z0-9]/.test(v);

      senhaOk = okLen && okUpper && okNum && okSpec;

      regras.innerHTML = `
        <div class="${okLen ? "regra-ok" : "regra-erro"}">• Mínimo de 11 caracteres</div>
        <div class="${okUpper ? "regra-ok" : "regra-erro"}">• Letra maiúscula</div>
        <div class="${okNum ? "regra-ok" : "regra-erro"}">• Número</div>
        <div class="${okSpec ? "regra-ok" : "regra-erro"}">• Caractere especial</div>
      `;
    };
  }

  /* PERMISSÃO (SÓ USUÁRIO WEB) */
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

  /* DESCRIÇÃO */
  const desc = document.createElement("textarea");
  desc.placeholder = "Descrição (opcional)";
  desc.style.marginTop = "12px";
  wrap.append(desc);

  /* MÉTODOS */
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

  if (!ini || !fim || fim < ini) return mostrarToast("Range inválido", true);

  for (let i = ini; i <= fim; i++) {
    if (container.children.length >= LIMITE) break;
    const campo = criarCampo("ring");
    campo.querySelector(".campo-nome").value = i;
    container.appendChild(campo);
  }

  mostrarToast("Range criado com sucesso!");
};

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
