console.log("APP.JS BASE ESTÁVEL");

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
  atualizarAgentes();
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
    atualizarAgentes();
    atualizarTodosDestinosURA();
  };

  linha.append(nome, del);
  wrap.append(linha);

  let email = null, senha = null, permissao = null;
  let selectUsuario = null;

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

    wrap.append(email, senha, permissao);
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
      atualizarAgentes();
    };

    wrap.append(senha, selectUsuario);
  }

  /* ===== AGENTE ===== */
  if (tipo === "agente") {
    criarCampoAgente(wrap, nome);
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
  wrap.getUsuarioId = () => wrap.dataset.usuarioId || "";

  return wrap;
}

/* ================= RAMAL x USUÁRIO ================= */

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

/* ================= AGENTE (RAMAL OBRIGATÓRIO) ================= */

function criarCampoAgente(wrap, nomeInput) {
  const box = document.createElement("div");
  box.style.display = "grid";
  box.style.gridTemplateColumns = "1fr 1fr";
  box.style.gap = "10px";
  box.style.marginTop = "10px";

  const selectUsuario = document.createElement("select");
  const selectRamal = document.createElement("select");

  function carregarUsuarios() {
    selectUsuario.innerHTML = "";
    selectUsuario.add(new Option("Usuário callcenter", ""));

    document.querySelectorAll("#listaUsuariosWeb .campo-descricao").forEach(c => {
      const perm = c.getPermissao()?.toLowerCase() || "";
      if (perm.includes("call center")) {
        selectUsuario.add(new Option(c.getNome(), c.dataset.id));
      }
    });
  }

  function carregarRamais() {
    selectRamal.innerHTML = "";
    selectRamal.add(new Option("Ramal (obrigatório)", ""));

    document.querySelectorAll("#listaRings .campo-descricao").forEach(r => {
      selectRamal.add(new Option(r.getNome(), r.dataset.id));
    });
  }

  selectUsuario.onchange = () => {
    const ramal = [...document.querySelectorAll("#listaRings .campo-descricao")]
      .find(r => r.dataset.usuarioId === selectUsuario.value);
    if (ramal) selectRamal.value = ramal.dataset.id;
  };

  wrap.getAgente = () => ({
    nome: nomeInput.value,
    usuarioId: selectUsuario.value || null,
    ramalId: selectRamal.value || null
  });

  wrap.atualizarAgente = () => {
    const u = selectUsuario.value;
    const r = selectRamal.value;
    carregarUsuarios();
    carregarRamais();
    selectUsuario.value = u;
    selectRamal.value = r;
  };

  box.append(selectUsuario, selectRamal);
  wrap.append(box);

  carregarUsuarios();
  carregarRamais();
}

function atualizarAgentes() {
  document.querySelectorAll("#listaAgentes .campo-descricao").forEach(c => {
    if (c.atualizarAgente) c.atualizarAgente();
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

/* ================= REGRA DE TEMPO ================= */

window.adicionarRegraTempo = function () {
  document.getElementById("listaRegrasTempo")
    .appendChild(criarRegraTempo());
};

function criarRegraTempo() {
  const wrap = document.createElement("div");
  wrap.className = "campo-descricao";

  const linhaTopo = document.createElement("div");
  linhaTopo.className = "linha-principal";

  const nome = document.createElement("input");
  nome.placeholder = "Nome da regra de tempo";

  const btn = document.createElement("button");
  btn.textContent = "✖";
  btn.onclick = () => wrap.remove();

  linhaTopo.append(nome, btn);
  wrap.append(linhaTopo);

  const diasSemana = ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"];
  const diasSelecionados = new Set();

  const diasBox = document.createElement("div");
  diasBox.style.display = "flex";
  diasBox.style.flexWrap = "wrap";
  diasBox.style.gap = "6px";
  diasBox.style.marginTop = "10px";

  diasSemana.forEach(dia => {
    const b = document.createElement("button");
    b.textContent = dia;
    b.className = "btn-dia";
    b.onclick = () => {
      b.classList.toggle("ativo");
      b.classList.contains("ativo") ? diasSelecionados.add(dia) : diasSelecionados.delete(dia);
    };
    diasBox.appendChild(b);
  });

  wrap.appendChild(diasBox);

  const horarios = document.createElement("div");
  horarios.style.display = "flex";
  horarios.style.gap = "10px";
  horarios.style.marginTop = "10px";

  const inicio = document.createElement("input");
  inicio.type = "time";

  const fim = document.createElement("input");
  fim.type = "time";

  horarios.append(inicio, fim);
  wrap.append(horarios);

  wrap.getData = () => ({
    nome: nome.value,
    dias: [...diasSelecionados],
    hora_inicio: inicio.value,
    hora_fim: fim.value
  });

  return wrap;
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
  atualizarAgentes();
};

/* ================= JSON ================= */

window.explorar = function () {

  const usuarios = [...listaUsuariosWeb.querySelectorAll(".campo-descricao")].map(c => ({
    id: c.dataset.id,
    nome: c.getNome(),
    email: c.getEmail(),
    senha: c.getSenha(),
    permissao: c.getPermissao()
  }));

  const ramais = [...listaRings.querySelectorAll(".campo-descricao")].map(c => ({
    id: c.dataset.id,
    ramal: c.getNome(),
    senha: c.getSenha(),
    usuarioId: c.dataset.usuarioId || null
  }));

  const agentes = [...listaAgentes.querySelectorAll(".campo-descricao")]
    .map(c => c.getAgente ? c.getAgente() : null)
    .filter(a => a && a.nome && a.ramalId);

  const dados = { voz: { usuarios, ramais, agentes } };
  resultado.textContent = JSON.stringify(dados, null, 2);
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
