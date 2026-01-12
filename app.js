console.log("APP.JS BASE ESTÁVEL - FILAS COM AGENTES");

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
  atualizarSelectAgentesFila();
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
    atualizarSelectAgentesFila();
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
    boxAgente.style.gap = "6px";
    boxAgente.style.marginTop = "6px";

    chkAgente = document.createElement("input");
    chkAgente.type = "checkbox";
    chkAgente.onchange = () => {
      atualizarSelectAgentes();
      atualizarSelectAgentesFila();
    };

    boxAgente.append(chkAgente, document.createTextNode(" Este usuário é agente"));

    wrap.append(email, senha, permissao, boxAgente);
  }

  /* ===== RAMAL ===== */
  if (tipo === "ring") {
    senha = document.createElement("input");
    senha.placeholder = "Senha do ramal";
    senha.className = "campo-senha";

    selectUsuario = document.createElement("select");
    selectUsuario.innerHTML = `<option value="">Vincular usuário (opcional)</option>`;
    selectUsuario.onchange = () => wrap.dataset.usuarioId = selectUsuario.value || "";

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

  /* ===== FILA ===== */
  if (tipo === "fila") {
    const selectAgente = document.createElement("select");
    const btnAdd = document.createElement("button");
    const lista = document.createElement("div");

    lista.style.marginTop = "8px";

    selectAgente.innerHTML = `<option value="">Selecione um agente</option>`;
    btnAdd.textContent = "Adicionar agente";

    wrap.dataset.agentes = "[]";

    btnAdd.onclick = () => {
      if (!selectAgente.value) return;

      let agentes = JSON.parse(wrap.dataset.agentes);
      if (agentes.includes(selectAgente.value)) return;

      agentes.push(selectAgente.value);
      wrap.dataset.agentes = JSON.stringify(agentes);
      renderAgentesFila();
    };

    function renderAgentesFila() {
      lista.innerHTML = "";
      let agentes = JSON.parse(wrap.dataset.agentes);

      agentes.forEach(id => {
        const nomeAgente = document.querySelector(
          `#listaAgentes .campo-descricao[data-id="${id}"] .campo-nome`
        )?.value;

        if (!nomeAgente) return;

        const item = document.createElement("div");
        item.style.display = "flex";
        item.style.justifyContent = "space-between";

        const span = document.createElement("span");
        span.textContent = nomeAgente;

        const btn = document.createElement("button");
        btn.textContent = "🗑";
        btn.onclick = () => {
          wrap.dataset.agentes = JSON.stringify(
            JSON.parse(wrap.dataset.agentes).filter(a => a !== id)
          );
          renderAgentesFila();
        };

        item.append(span, btn);
        lista.appendChild(item);
      });
    }

    wrap.atualizarFilaAgentes = () => {
      carregarAgentesFila(selectAgente);
      renderAgentesFila();
    };

    wrap.append(selectAgente, btnAdd, lista);
    setTimeout(() => wrap.atualizarFilaAgentes(), 50);
  }

  wrap.getNome = () => nome.value;
  wrap.getEmail = () => email?.value || "";
  wrap.getSenha = () => senha?.value || "";
  wrap.getPermissao = () => permissao?.value || "";
  wrap.isAgente = () => chkAgente ? chkAgente.checked : false;

  return wrap;
}

/* ================= AGENTES GERAIS ================= */

function atualizarSelectAgentes() {
  document.querySelectorAll("#listaAgentes .campo-descricao").forEach(a => {
    if (a.atualizarAgenteSelects) a.atualizarAgenteSelects();
  });
  atualizarSelectAgentesFila();
}

function atualizarSelectAgentesFila() {
  document.querySelectorAll("#listaFilas .campo-descricao").forEach(f => {
    if (f.atualizarFilaAgentes) f.atualizarFilaAgentes();
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

function carregarAgentesFila(select) {
  select.innerHTML = `<option value="">Selecione um agente</option>`;

  document.querySelectorAll("#listaAgentes .campo-descricao").forEach(a => {
    if (a.dataset.usuarioId && a.dataset.ramalId && a.querySelector(".campo-nome")?.value) {
      select.add(new Option(a.querySelector(".campo-nome").value, a.dataset.id));
    }
  });
}

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
    id: c.dataset.id,
    nome: c.getNome(),
    usuarioId: c.dataset.usuarioId || null,
    ramalId: c.dataset.ramalId || null
  }));

  const filas = [...listaFilas.querySelectorAll(".campo-descricao")].map(f => ({
    nome: f.querySelector(".campo-nome")?.value || "",
    agentes: JSON.parse(f.dataset.agentes || "[]")
  }));

  const dados = { voz: { usuarios, ramais, agentes, filas } };
  resultado.textContent = JSON.stringify(dados, null, 2);
};
