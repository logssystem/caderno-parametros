console.log("APP.JS FINAL – ESTÁVEL");

/* ================= ESTADO GLOBAL ================= */

window.APP_STATE = {
  usuarios: [],
  ramais: [],
  agentes: [],
  filas: []
};

function uid(prefix = "id") {
  return prefix + "_" + Math.random().toString(36).substr(2, 9);
}

function syncUsuariosFromDOM() {
  APP_STATE.usuarios = [];
  document.querySelectorAll("#listaUsuariosWeb .campo-descricao").forEach(c => {
    APP_STATE.usuarios.push({
      id: c.dataset.id,
      nome: c.getNome(),
      email: c.getEmail(),
      permissao: c.getPermissao()
    });
  });
}

function syncRamaisFromDOM() {
  APP_STATE.ramais = [];
  document.querySelectorAll("#listaRings .campo-descricao").forEach(c => {
    APP_STATE.ramais.push({
      id: c.dataset.id,
      numero: c.getNome(),
      usuarioId: c.dataset.usuarioId || null
    });
  });
}

function syncAgentesFromDOM() {
  APP_STATE.agentes = [];
  document.querySelectorAll("#listaAgentes .campo-descricao").forEach(c => {
    APP_STATE.agentes.push({
      id: c.dataset.id,
      nome: c.getNome(),
      usuarioId: c.dataset.usuarioId || null,
      ramalId: c.dataset.ramalId || null
    });
  });
}

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

/* ================= ADICIONAR CAMPO ================= */

window.adicionarCampo = function (tipo) {
  const container = document.getElementById(listas[tipo]);
  if (!container || container.children.length >= LIMITE) return;

  const campo = criarCampo(tipo);
  container.appendChild(campo);

  syncUsuariosFromDOM();
  syncRamaisFromDOM();
  syncAgentesFromDOM();

  atualizarTodosDestinosURA();
};

/* ================= CRIAR CAMPO ================= */

function criarCampo(tipo) {
  const wrap = document.createElement("div");
  wrap.className = "campo-descricao";
  wrap.dataset.id = uid(tipo);

  const linhaNome = document.createElement("div");
  linhaNome.className = "linha-principal";

  const nome = document.createElement("input");
  nome.placeholder = `Digite ${tipo.replace("_", " ")}`;
  nome.classList.add("campo-nome");
  nome.style.width = "100%";

  nome.addEventListener("input", () => {
    syncUsuariosFromDOM();
    syncRamaisFromDOM();
    syncAgentesFromDOM();
    atualizarTodosDestinosURA();
  });

  const btn = document.createElement("button");
  btn.textContent = "✖";
  btn.onclick = () => {
    wrap.remove();
    syncUsuariosFromDOM();
    syncRamaisFromDOM();
    syncAgentesFromDOM();
    atualizarTodosDestinosURA();
  };

  linhaNome.append(nome, btn);
  wrap.append(linhaNome);

  let emailInput = null;
  let senhaInput = null;
  let permissao = null;
  let regras = null;

  if (tipo === "usuario_web") {
    const linhaCred = document.createElement("div");
    linhaCred.className = "linha-principal";
    linhaCred.style.gap = "12px";
    linhaCred.style.marginTop = "12px";

    emailInput = document.createElement("input");
    emailInput.type = "email";
    emailInput.placeholder = "E-mail do usuário";

    senhaInput = document.createElement("input");
    senhaInput.placeholder = "Senha do usuário";
    senhaInput.classList.add("campo-senha");

    linhaCred.append(emailInput, senhaInput);
    wrap.append(linhaCred);

    permissao = document.createElement("select");
    permissao.style.marginTop = "12px";

    const opt0 = new Option("Selecione a permissão", "");
    opt0.disabled = true;
    opt0.selected = true;
    permissao.appendChild(opt0);
    PERMISSOES.forEach(p => permissao.add(new Option(p, p)));
    wrap.append(permissao);

    regras = document.createElement("div");
    regras.style.marginTop = "8px";
    wrap.append(regras);

    senhaInput.oninput = () => validarSenha(senhaInput, regras);
  }

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

  if (tipo === "ura") {
    const msg = document.createElement("textarea");
    msg.placeholder = "Mensagem da URA";
    msg.style.marginTop = "12px";
    wrap.append(msg);

    const titulo = document.createElement("h4");
    titulo.textContent = "Opções da URA";
    titulo.style.marginTop = "12px";
    wrap.append(titulo);

    const listaOpcoes = document.createElement("div");
    wrap.append(listaOpcoes);

    const btnNova = document.createElement("button");
    btnNova.textContent = "+ Nova opção";
    btnNova.onclick = () => listaOpcoes.appendChild(criarOpcaoURA());
    wrap.append(btnNova);

    wrap.getURA = () => ({
      nome: nome.value,
      mensagem: msg.value,
      opcoes: [...listaOpcoes.querySelectorAll(".opcao-ura")].map(o => o.getData())
    });
  }

  function validarSenha(input, regrasEl) {
    const v = input.value;
    const ok = v.length >= 11 && /[A-Z]/.test(v) && /\d/.test(v) && /[^A-Za-z0-9]/.test(v);
    regrasEl.innerHTML = ok
      ? `<div class="regra-ok">Senha válida</div>`
      : `<div class="regra-erro">Mín. 11 | Maiúscula | Número | Especial</div>`;
  }

  wrap.getNome = () => nome.value;
  wrap.getEmail = () => emailInput?.value || "";
  wrap.getSenha = () => senhaInput?.value || "";
  wrap.getPermissao = () => permissao?.value || "";

  return wrap;
}

/* ================= RANGE DE RAMAIS ================= */

window.criarRangeRamais = function () {
  const ini = Number(document.getElementById("ramalInicio")?.value);
  const fim = Number(document.getElementById("ramalFim")?.value);
  const container = document.getElementById("listaRings");

  if (!ini || !fim || fim < ini) return mostrarToast("Range inválido", true);

  for (let i = ini; i <= fim; i++) {
    if (container.children.length >= LIMITE) break;
    const campo = criarCampo("ring");
    campo.querySelector(".campo-nome").value = i;
    container.appendChild(campo);
  }

  atualizarTodosDestinosURA();
  mostrarToast("Range de ramais criado com sucesso!");
};

/* ================= GERAR JSON ================= */

window.explorar = function () {
  try {
    syncUsuariosFromDOM();
    syncRamaisFromDOM();
    syncAgentesFromDOM();

    const coletar = (id, fn) =>
      [...document.querySelectorAll(`#${id} .campo-descricao`)]
        .map(fn)
        .filter(v => v && Object.values(v).some(x => x));

    const usuarios = coletar("listaUsuariosWeb", c => ({
      nome: c.getNome(),
      email: c.getEmail(),
      senha: c.getSenha(),
      permissao: c.getPermissao()
    }));

    const ramais = coletar("listaRings", c => ({
      ramal: c.getNome(),
      senha: c.getSenha()
    }));

    const dados = { voz: { usuarios, ramais } };

    document.getElementById("resultado").textContent =
      JSON.stringify(dados, null, 2);

    mostrarToast("JSON gerado com sucesso!");

  } catch (e) {
    console.error(e);
    mostrarToast("Erro ao gerar JSON", true);
  }
};

/* ================= TOAST ================= */

function mostrarToast(msg, error = false) {
  const t = document.getElementById("toastGlobal");
  const m = document.getElementById("toastMessage");
  if (!t || !m) return;
  m.textContent = msg;
  t.className = "toast show" + (error ? " error" : "");
  setTimeout(() => t.classList.remove("show"), 3000);
}

/* ================= TEMA ================= */

const toggleTheme = document.getElementById("toggleTheme");
if (toggleTheme) {
  toggleTheme.onclick = () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("tema", document.body.classList.contains("dark") ? "dark" : "light");
  };
  if (localStorage.getItem("tema") === "dark") document.body.classList.add("dark");
}
