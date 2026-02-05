console.log("APP.JS FINAL – PABX ESTÁVEL + CHAT ACOPLADO");

/* =====================================================
   CONFIG GERAL
===================================================== */

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

/* =====================================================
   TOAST
===================================================== */

function mostrarToast(msg, error) {
  const t = document.getElementById("toastGlobal");
  const m = document.getElementById("toastMessage");
  if (!t || !m) return;

  m.textContent = msg;
  t.className = "toast show" + (error ? " error" : "");
  setTimeout(function () {
    t.classList.remove("show");
  }, 3000);
}

/* =====================================================
   ===================== PABX ==========================
   (TUDO AQUI É SEU CÓDIGO ORIGINAL)
===================================================== */

/* ---------- ADICIONAR CAMPO ---------- */

window.adicionarCampo = function (tipo) {
  if (!listas[tipo]) return mostrarToast("Tipo inválido", true);
  const container = document.getElementById(listas[tipo]);
  if (!container || container.children.length >= LIMITE) return;
  container.appendChild(criarCampo(tipo));
  atualizarTodosDestinosURA();
};

/* ---------- CRIAR CAMPO ---------- */

function criarCampo(tipo) {
  const wrap = document.createElement("div");
  wrap.className = "campo-descricao";

  const linha = document.createElement("div");
  linha.className = "linha-principal";

  const nome = document.createElement("input");
  nome.className = "campo-nome";
  nome.placeholder = "Digite " + tipo.replace("_", " ");
  nome.oninput = atualizarTodosDestinosURA;

  const del = document.createElement("button");
  del.textContent = "✖";
  del.onclick = function () {
    wrap.remove();
    atualizarTodosDestinosURA();
  };

  linha.append(nome, del);
  wrap.append(linha);

  let email, senha, permissao, chkAgente, regras;

  if (tipo === "usuario_web") {
    email = document.createElement("input");
    email.type = "email";
    email.placeholder = "E-mail";

    senha = document.createElement("input");
    senha.placeholder = "Senha";
    senha.className = "campo-senha";

    permissao = document.createElement("select");
    permissao.append(new Option("Selecione a permissão", ""));
    PERMISSOES.forEach(p => permissao.add(new Option(p, p)));

    chkAgente = document.createElement("input");
    chkAgente.type = "checkbox";

    regras = document.createElement("div");

    wrap.append(email, senha, permissao, chkAgente, regras);
  }

  if (tipo === "ring") {
    senha = document.createElement("input");
    senha.placeholder = "Senha do ramal";
    senha.className = "campo-senha";
    regras = document.createElement("div");
    wrap.append(senha, regras);
  }

  wrap.getNome = () => nome.value;
  wrap.getEmail = () => email ? email.value : "";
  wrap.getSenha = () => senha ? senha.value : "";
  wrap.getPermissao = () => permissao ? permissao.value : "";
  wrap.isAgente = () => chkAgente ? chkAgente.checked : false;

  return wrap;
}

/* ---------- URA ---------- */

function criarOpcaoURA() {
  const wrap = document.createElement("div");
  wrap.className = "opcao-ura";

  const tecla = document.createElement("input");
  tecla.placeholder = "Tecla";

  const destino = document.createElement("select");
  atualizarDestinosURA(destino);

  const desc = document.createElement("input");
  desc.placeholder = "Descrição";

  const del = document.createElement("button");
  del.textContent = "🗑";
  del.onclick = () => wrap.remove();

  wrap.append(tecla, destino, desc, del);

  wrap.getData = () => ({
    tecla: tecla.value,
    destino: destino.value,
    descricao: desc.value
  });

  return wrap;
}

function atualizarDestinosURA(select) {
  if (!select) return;
  select.innerHTML = "";
  select.add(new Option("Selecione o destino", ""));
  ["listaFilas", "listaRings", "listaGrupoRing", "listaURAs"].forEach(id => {
    document.querySelectorAll("#" + id + " .campo-nome").forEach(i => {
      if (i.value) select.add(new Option(i.value, id + ":" + i.value));
    });
  });
}

function atualizarTodosDestinosURA() {
  document.querySelectorAll(".opcao-ura select").forEach(s => {
    const v = s.value;
    atualizarDestinosURA(s);
    s.value = v;
  });
}

/* ---------- JSON PABX ---------- */

function gerarJSONVoz() {
  const usuarios = [];
  document.querySelectorAll("#listaUsuariosWeb .campo-descricao").forEach(c => {
    usuarios.push({
      nome: c.getNome(),
      email: c.getEmail(),
      senha: c.getSenha(),
      permissao: c.getPermissao(),
      agente: c.isAgente()
    });
  });

  const ramais = [];
  document.querySelectorAll("#listaRings .campo-descricao").forEach(c => {
    ramais.push({
      ramal: c.getNome(),
      senha: c.getSenha()
    });
  });

  return { usuarios, ramais };
}

/* =====================================================
   ===================== CHAT ==========================
===================================================== */

window.chatState = {
  ativo: false,
  modo: null, // 'chat' | 'voz_chat'
  api: null,
  conta: null,
  canais: []
};

window.selecionarVoz = function () {
  chatState.ativo = false;
  atualizarVisibilidade();
};

window.selecionarChat = function () {
  chatState.ativo = true;
  chatState.modo = "chat";
  atualizarVisibilidade();
};

window.selecionarVozChat = function () {
  chatState.ativo = true;
  chatState.modo = "voz_chat";
  atualizarVisibilidade();
};

function atualizarVisibilidade() {
  const voz = document.getElementById("moduloVoz");
  const chat = document.getElementById("modulochat");

  if (voz) voz.style.display = chatState.ativo && chatState.modo === "chat" ? "none" : "block";
  if (chat) chat.style.display = chatState.ativo ? "block" : "none";
}

/* ---------- INFO AGENTE CHAT ---------- */

window.informarAgenteChat = function () {
  mostrarToast(
    "Os agentes omnichannel são gerados automaticamente a partir dos usuários.",
    true
  );
};

/* ---------- JSON CHAT ---------- */

function gerarJSONChat() {
  const usuariosChat = [];
  document.querySelectorAll("#listaUsuariosChat .campo-descricao").forEach(u => {
    if (u.getData) usuariosChat.push(u.getData());
  });

  const departamentos = [];
  document.querySelectorAll("#listaDepartamentosChat .campo-descricao").forEach(d => {
    if (d.getData) departamentos.push(d.getData());
  });

  return {
    ...chatState,
    usuarios: usuariosChat,
    departamentos
  };
}

/* =====================================================
   ===================== EXPLORAR ======================
===================================================== */

window.explorar = function () {
  try {
    const dados = {};

    // VOZ sempre entra se não for chat puro
    if (!chatState.ativo || chatState.modo === "voz_chat") {
      dados.voz = gerarJSONVoz();
    }

    // CHAT entra somente se ativo
    if (chatState.ativo) {
      dados.chat = gerarJSONChat();
    }

    document.getElementById("resultado").textContent =
      JSON.stringify(dados, null, 2);

    mostrarToast("JSON gerado com sucesso!");

  } catch (e) {
    console.error(e);
    mostrarToast("Erro ao gerar JSON", true);
  }
};

/* =====================================================
   SALVAR
===================================================== */

window.salvarConfiguracao = function () {
  explorar();
  const r = document.getElementById("resultado").textContent;
  if (!r) return mostrarToast("Nada para salvar", true);
  localStorage.setItem("CONFIG_CADERNO", r);
  window.location.href = "resumo.html";
};
