console.log("APP.JS FINAL – CONSOLIDADO DEFINITIVO (URA + REGRA DE TEMPO + FILA + GRUPO RING + AGENTES)");

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

/* ================= DOMÍNIO ================= */

const dominioInput = document.getElementById("dominioCliente");
const regraDominio = document.getElementById("regraDominio");

window.validarDominioCliente = function () {
  if (!dominioInput) return true;

  const v = dominioInput.value.trim().toLowerCase();
  const ok = v.endsWith(".sobreip.com.br") && v.length > ".sobreip.com.br".length;

  dominioInput.classList.toggle("campo-obrigatorio-erro", !ok);

  if (regraDominio) {
    regraDominio.innerHTML = ok
      ? `<div class="regra-ok">Domínio válido</div>`
      : `<div class="regra-erro">Deve terminar com .sobreip.com.br</div>`;
  }

  return ok;
};

if (dominioInput) {
  dominioInput.addEventListener("input", validarDominioCliente);
}

/* ================= TOAST ================= */

function mostrarToast(msg, error = false) {
  const t = document.getElementById("toastGlobal");
  const m = document.getElementById("toastMessage");
  if (!t || !m) return;

  m.textContent = msg;
  t.className = "toast show" + (error ? " error" : "");
  setTimeout(() => t.classList.remove("show"), 3000);
}

/* ================= CHAT – INFO AGENTE ================= */

window.informarAgenteChat = function () {
  mostrarToast(
    "Os agentes omnichannel são gerados automaticamente a partir dos usuários marcados como agente.",
    true
  );
};

// ponte para HTML antigo
window.adicionarAgenteChat = function () {
  informarAgenteChat();
};

/* ================= SALVAR ================= */

window.salvarConfiguracao = function () {
  explorar();

  const resultadoEl = document.getElementById("resultado");
  const resultado = resultadoEl ? resultadoEl.textContent : "";

  if (!resultado.trim()) {
    mostrarToast("Gere a configuração antes de salvar", true);
    return;
  }

  localStorage.setItem("CONFIG_CADERNO", resultado);
  window.location.href = "resumo.html";
};

/* ================= EXPLORAR ================= */

window.explorar = function () {
  try {
    const empresaEl = document.getElementById("empresaCliente");
    const dominioEl = document.getElementById("dominioCliente");

    const empresa = empresaEl ? empresaEl.value.trim() : "";
    const dominio = dominioEl ? dominioEl.value.trim() : "";

    if (!empresa || !dominio) {
      mostrarToast("Preencha o nome da empresa e o domínio", true);
      return;
    }

    if (!validarDominioCliente()) return;

    /* ===== VOZ ===== */

    const usuarios = [];
    document.querySelectorAll("#listaUsuariosWeb .campo-descricao").forEach(u => {
      usuarios.push({
        nome: u.getNome(),
        email: u.getEmail(),
        senha: u.getSenha(),
        permissao: u.getPermissao(),
        agente: u.isAgente()
      });
    });

    const ramais = [];
    document.querySelectorAll("#listaRings .campo-descricao").forEach(r => {
      ramais.push({
        ramal: r.getNome(),
        senha: r.getSenha()
      });
    });

    const agentes = [];
    document.querySelectorAll("#listaAgentes .campo-descricao").forEach(a => {
      const nomeEl = a.querySelector(".campo-nome");
      agentes.push({
        nome: nomeEl ? nomeEl.value : "",
        ramal: a.getRamal()
      });
    });

    if (agentes.some(a => !a.ramal)) {
      mostrarToast("Existe agente sem ramal vinculado", true);
      return;
    }

    const filas = [];
    document.querySelectorAll("#listaFilas .campo-descricao").forEach(f => {
      const nomeEl = f.querySelector(".campo-nome");
      filas.push({
        nome: nomeEl ? nomeEl.value : "",
        agentes: JSON.parse(f.dataset.agentes || "[]")
      });
    });

    const regras_tempo = [];
    document.querySelectorAll("#listaRegrasTempo .campo-descricao").forEach(r => {
      if (r.getData) regras_tempo.push(r.getData());
    });

    /* ===== CHAT ===== */

    const usuariosChat = [];
    document.querySelectorAll("#listaUsuariosChat .campo-descricao").forEach(u => {
      if (u.getData) usuariosChat.push(u.getData());
    });

    const departamentosChat = [];
    const agentesVinculados = new Set();

    document.querySelectorAll("#listaDepartamentosChat .campo-descricao").forEach(d => {
      const data = d.getData ? d.getData() : null;
      if (!data || !data.nome) return;

      (data.agentes || []).forEach(a => agentesVinculados.add(a));

      departamentosChat.push({
        nome: data.nome,
        agentes: data.agentes || []
      });
    });

    usuariosChat.forEach(u => {
      const isAgente =
        u.agente === true ||
        (Array.isArray(u.permissoes) && u.permissoes.includes("Agente Omnichannel"));

      if (isAgente && !agentesVinculados.has(u.nome)) {
        mostrarToast(`O agente "${u.nome}" não está em nenhum departamento`, true);
        throw new Error("Agente chat sem departamento");
      }
    });

    /* ===== JSON FINAL ===== */

    const dados = {
      cliente: { empresa, dominio },
      voz: { usuarios, ramais, agentes, filas, regras_tempo },
      chat: {
        ...(window.chatState ? window.chatState : {}),
        usuarios: usuariosChat,
        departamentos: departamentosChat
      }
    };

    const resultadoBox = document.getElementById("resultado");
    if (resultadoBox) {
      resultadoBox.textContent = JSON.stringify(dados, null, 2);
    }

    mostrarToast("JSON gerado com sucesso!");

  } catch (e) {
    console.error(e);
    mostrarToast("Erro ao gerar JSON", true);
  }
};

/* ================= CHAT – SELEÇÃO ================= */

// garante estado global
window.chatState = window.chatState || {};

window.selecionarTipoChat = function (el, tipo) {
  window.chatState.tipo = tipo;

  document
    .querySelectorAll(".tipo-chat .chat-card")
    .forEach(c => c.classList.remove("active"));

  if (el) el.classList.add("active");

  const apiBox = document.getElementById("api-oficial");
  const qrBox = document.getElementById("chat-qr");

  if (apiBox) apiBox.style.display = tipo === "api" ? "block" : "none";
  if (qrBox) qrBox.style.display = tipo === "qr" ? "block" : "none";
};

window.selecionarApi = function (el, api) {
  window.chatState.api = api;

  document
    .querySelectorAll("#api-oficial .chat-card")
    .forEach(c => c.classList.remove("active"));

  if (el) el.classList.add("active");

  const conta = document.getElementById("bloco-conta-api");
  if (conta) conta.style.display = "block";
};

window.selecionarConta = function (el, conta) {
  window.chatState.conta = conta;

  document
    .querySelectorAll("#bloco-conta-api .chat-card")
    .forEach(c => c.classList.remove("active"));

  if (el) el.classList.add("active");

  const canais = document.getElementById("chat-canais");
  if (canais) canais.style.display = "block";
};

window.toggleCanal = function (el) {
  const canal = el.dataset.canal;
  if (!canal) return;

  window.chatState.canais = window.chatState.canais || [];

  el.classList.toggle("active");

  if (el.classList.contains("active")) {
    if (!window.chatState.canais.includes(canal)) {
      window.chatState.canais.push(canal);
    }
  } else {
    window.chatState.canais =
      window.chatState.canais.filter(c => c !== canal);
  }
};
