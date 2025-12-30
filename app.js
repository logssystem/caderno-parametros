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

/* ================= VALIDAÇÃO DE SENHA ================= */
function validarSenhaDetalhada(valor, regrasEl, inputEl) {
  regrasEl.innerHTML = "";
  inputEl.classList.remove("senha-invalida");

  if (valor.length < 11)
    return erro("A senha deve ter pelo menos 11 caracteres.");
  if (!/[A-Z]/.test(valor))
    return erro("A senha deve conter pelo menos uma letra maiúscula.");
  if (!/\d/.test(valor))
    return erro("A senha deve conter pelo menos um número.");
  if (!/[^A-Za-z0-9]/.test(valor))
    return erro("A senha deve conter pelo menos um caractere especial.");

  regrasEl.innerHTML = `<div class="regra-ok">A senha é segura!</div>`;
  return true;

  function erro(msg) {
    inputEl.classList.add("senha-invalida");
    regrasEl.innerHTML = `<div class="regra-erro">${msg}</div>`;
    return false;
  }
}

/* ================= CRIAR CAMPO ================= */
function criarCampo(tipo) {
  const wrap = document.createElement("div");
  wrap.className = "campo-descricao";

  /* NOME */
  const linhaNome = document.createElement("div");
  linhaNome.className = "linha-principal";

  const nome = document.createElement("input");
  nome.placeholder = `Digite ${tipo === "ring" ? "ramal" : tipo.replace("_", " ")}`;
  nome.classList.add("campo-nome");
  nome.style.width = "100%";

  const btn = document.createElement("button");
  btn.textContent = "✖";
  btn.onclick = () => wrap.remove();

  linhaNome.append(nome, btn);
  wrap.append(linhaNome);

  let emailInput, senhaInput, permissao, regras;
  let senhaOk = false;

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

    senhaInput.oninput = () => {
      senhaOk = validarSenhaDetalhada(
        senhaInput.value,
        regras,
        senhaInput
      );
    };
  }

  /* ===== RAMAL (SENHA OBRIGATÓRIA) ===== */
  if (tipo === "ring") {
    senhaInput = document.createElement("input");
    senhaInput.placeholder = "Senha do ramal";
    senhaInput.classList.add("campo-senha");
    senhaInput.style.marginTop = "12px";
    wrap.append(senhaInput);

    regras = document.createElement("div");
    regras.style.marginTop = "10px";
    wrap.append(regras);

    senhaInput.oninput = () => {
      senhaOk = validarSenhaDetalhada(
        senhaInput.value,
        regras,
        senhaInput
      );
    };
  }

  /* DESCRIÇÃO */
  const desc = document.createElement("textarea");
  desc.placeholder = "Descrição (opcional)";
  desc.style.marginTop = "12px";
  wrap.append(desc);

  /* HELPERS */
  wrap.validarSenha = () => senhaOk;
  wrap.getNome = () => nome.value;
  wrap.getEmail = () => emailInput?.value || "x@x";
  wrap.getSenha = () => senhaInput?.value || "";
  wrap.getPermissao = () => permissao?.value || "";
  wrap.getDescricao = () => desc.value;

  wrap.setPermissaoAtalho = atalho => {
    const key = atalho?.toLowerCase();
    if (MAPA_PERMISSOES[key]) permissao.value = MAPA_PERMISSOES[key];
  };

  return wrap;
}
