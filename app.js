console.log("APP.JS BASE ESTÁVEL - AGENTE VIA USUÁRIO");

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

/* ================= CORE ================= */

window.adicionarCampo = function (tipo) {
  const container = document.getElementById(listas[tipo]);
  if (!container || container.children.length >= LIMITE) return;

  const campo = criarCampo(tipo);
  container.appendChild(campo);

  atualizarSelectUsuariosRamal();
  atualizarSelectAgentes();
  atualizarTodosDestinosURA();
};

/* ================= CAMPOS ================= */

function criarCampo(tipo) {
  const wrap = document.createElement("div");
  wrap.className = "campo-descricao";
  wrap.dataset.id = uid(tipo);

  const linha = document.createElement("div");
  linha.className = "linha-principal";

  const nome = document.createElement("input");
  nome.placeholder = `Digite ${tipo.replace("_", " ")}`;
  nome.className = "campo-nome";

  const del = document.createElement("button");
  del.textContent = "✖";
  del.onclick = () => {
    wrap.remove();
    atualizarSelectUsuariosRamal();
    atualizarSelectAgentes();
    atualizarTodosDestinosURA();
  };

  linha.append(nome, del);
  wrap.append(linha);

  let email = null, senha = null, permissao = null;
  let selectUsuario = null;
  let chkAgente = null;

  /* ===== USUÁRIO WEB ===== */
  if (tipo === "usuario_web") {
    email = document.createElement("input");
    email.placeholder = "E-mail";

    senha = document.createElement("input");
    senha.placeholder = "Senha";
    senha.className = "campo-senha";

    permissao = document.createElement("select");
    permissao.append(new Option("Selecione a permissão", ""));
    PERMISSOES.forEach(p => permissao.add(new Option(p, p)));

    const boxAgente = document.createElement("label");
    boxAgente.style.display = "flex";
    boxAgente.style.alignItems = "center";
    boxAgente.style.gap = "6px";
    boxAgente.style.marginTop = "6px";

    chkAgente = document.createElement("input");
    chkAgente.type = "checkbox";
    chkAgente.onchange = atualizarSelectAgentes;

    const span = document.createElement("span");
    span.textContent = "Este usuário é agente";

    boxAgente.append(chkAgente, span);

    wrap.append(email, senha, permissao, boxAgente);
  }

  /* ===== RAMAL ===== */
  if (tipo === "ring") {
    senha = document.createElement("input");
    senha.placeholder = "Senha do ramal";
    senha.className = "campo-senha";

    selectUsuario = document.createElement("select");
    selectUsuario.innerHTML = `<option value="">Vincular usuário (opcional)</option>`;
    selectUsuario.onchange = () => {
      wrap.dataset.usuarioId = selectUsuario.value || "";
    };

    wrap.append(senha, selectUsuario);
  }

  /* ===== AGENTE ===== */
  if (tipo === "agente") {
    const selectUser = document.createElement("select");
    const selectRamal = document.createElement("select");

    selectUser.innerHTML = `<option value="">Usuário agente</option>`;
    selectRamal.innerHTML = `<option value="">Ramal (obrigatório)</option>`;

    selectUser.onchange = () => wrap.dataset.usuarioId = selectUser.value;
    selectRamal.onchange = () => wrap.dataset.ramalId = selectRamal.value;

    wrap.append(selectUser, selectRamal);

    wrap.atualizarAgenteSelects = () => {
      carregarUsuariosAgentes(selectUser);
      carregarRamais(selectRamal, wrap.dataset.ramalId);
    };

    setTimeout(() => wrap.atualizarAgenteSelects(), 50);
  }

  /* ===== URA ===== */
  if (tipo === "ura") {
    const msg = document.createElement("textarea");
    msg.placeholder = "Mensagem da URA";

    const lista = document.createElement("div");

    const btn = document.createElement("button");
    btn.textContent = "+ Nova opção";
    btn.onclick = () => lista.appendChild(criarOpcaoURA());

    wrap.append(msg, lista, btn);

    wrap.getURA = () => ({
      nome: nome.value,
      mensagem: msg.value,
      opcoes: [...lista.querySelectorAll(".opcao-ura")].map(o => o.getData())
    });
  }

  wrap.getNome = () => nome.value;
  wrap.getEmail = () => email?.value || "";
  wrap.getSenha = () => senha?.value || "";
  wrap.getPermissao = () => permissao?.value || "";
  wrap.isAgente = () => chkAgente ? chkAgente.checked : false;

  return wrap;
}

/* ================= USUÁRIOS → RAMAL ================= */

function atualizarSelectUsuariosRamal() {
  const usuarios = [...document.querySelectorAll("#listaUsuariosWeb .campo-descricao")]
    .map(c => ({ id: c.dataset.id, nome: c.getNome() }))
    .filter(u => u.nome);

  document.querySelectorAll("#listaRings .campo-descricao").forEach(ramal => {
    const select = ramal.querySelector("select");
    if (!select) return;

    const atual = ramal.dataset.usuarioId || "";
    select.innerHTML = `<option value="">Vincular usuário (opcional)</option>`;

    usuarios.forEach(u => {
      const opt = new Option(u.nome, u.id);
      if (u.id === atual) opt.selected = true;
      select.add(opt);
    });
  });
}

/* ================= USUÁRIOS → AGENTES ================= */

function atualizarSelectAgentes() {
  document.querySelectorAll("#listaAgentes .campo-descricao").forEach(a => {
    if (a.atualizarAgenteSelects) a.atualizarAgenteSelects();
  });
}

function carregarUsuariosAgentes(select) {
  select.innerHTML = `<option value="">Usuário agente</option>`;

  document.querySelectorAll("#listaUsuariosWeb .campo-descricao").forEach(c => {
    if (c.isAgente && c.isAgente() && c.getNome()) {
      select.add(new Option(c.getNome(), c.dataset.id));
    }
  });
}

function carregarRamais(select, atual = "") {
  select.innerHTML = `<option value="">Ramal (obrigatório)</option>`;

  document.querySelectorAll("#listaRings .campo-descricao").forEach(r => {
    if (r.getNome()) {
      const opt = new Option(r.getNome(), r.dataset.id);
      if (r.dataset.id === atual) opt.selected = true;
      select.add(opt);
    }
  });
}

/* ================= URA ================= */

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

  ["listaFilas","listaRings","listaGrupoRing","listaURAs"].forEach(id => {
    document.querySelectorAll(`#${id} .campo-nome`).forEach(i => {
      if (i.value) select.add(new Option(i.value, `${id}:${i.value}`));
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

/* ================= RANGE ================= */

window.criarRangeRamais = function () {
  const ini = +ramalInicio.value;
  const fim = +ramalFim.value;
  const box = listaRings;

  if (!ini || !fim || fim < ini) return mostrarToast("Range inválido", true);

  for (let i = ini; i <= fim; i++) {
    const c = criarCampo("ring");
    c.querySelector(".campo-nome").value = i;
    box.appendChild(c);
  }

  atualizarSelectUsuariosRamal();
  atualizarSelectAgentes();
};

/* ================= JSON ================= */

window.explorar = function () {
  const usuarios = [...listaUsuariosWeb.querySelectorAll(".campo-descricao")].map(c => ({
    id: c.dataset.id,
    nome: c.getNome(),
    email: c.getEmail(),
    senha: c.getSenha(),
    permissao: c.getPermissao(),
    agente: c.isAgente()
  }));

  const ramais = [...listaRings.querySelectorAll(".campo-descricao")].map(c => ({
    id: c.dataset.id,
    ramal: c.getNome(),
    senha: c.getSenha(),
    usuarioId: c.dataset.usuarioId || null
  }));

  const agentes = [...listaAgentes.querySelectorAll(".campo-descricao")].map(c => ({
    nome: c.getNome(),
    usuarioId: c.dataset.usuarioId || null,
    ramalId: c.dataset.ramalId || null
  }));

  const dados = { voz: { usuarios, ramais, agentes } };
  resultado.textContent = JSON.stringify(dados, null, 2);
};

window.exportarJSON = function () {
  const blob = new Blob([resultado.textContent], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "caderno_parametros.json";
  a.click();
};

/* ================= IMPORT (stub) ================= */

window.acionarImportacao = function () {
  mostrarToast("Importação será ligada na próxima fase.");
};

/* ================= TOAST ================= */

function mostrarToast(msg, erro=false){
  toastMessage.textContent = msg;
  toastGlobal.className = "toast show" + (erro ? " error" : "");
  setTimeout(()=>toastGlobal.classList.remove("show"),3000);
}

/* ================= TEMA ================= */

if (localStorage.getItem("tema") === "dark") document.body.classList.add("dark");
toggleTheme.onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("tema", document.body.classList.contains("dark")?"dark":"light");
};
