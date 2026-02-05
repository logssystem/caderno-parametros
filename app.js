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

/* ================= DADOS DO CLIENTE ================= */

const dominioInput = document.getElementById("dominioCliente");
const regraDominio = document.getElementById("regraDominio");

window.validarDominioCliente = function () {
  if (!dominioInput) return true;

  const v = dominioInput.value.trim().toLowerCase();
  const ok = v.endsWith(".sobreip.com.br") && v.length > ".sobreip.com.br".length;

  dominioInput.classList.toggle("campo-obrigatorio-erro", !ok);

  if (regraDominio) {
    regraDominio.innerHTML = ok
      ? '<div class="regra-ok">Domínio válido</div>'
      : '<div class="regra-erro">Deve terminar com .sobreip.com.br</div>';
  }

  return ok;
};

if (dominioInput) {
  dominioInput.addEventListener("input", window.validarDominioCliente);
}

/* ================= ADICIONAR CAMPO ================= */

window.adicionarCampo = function (tipo) {
  if (tipo === "agente") {
    gerarAgentesAPartirUsuarios();
    atualizarSelectAgentesFila();
    mostrarToast("Agentes atualizados a partir dos usuários");
    return;
  }

  if (!listas[tipo]) {
    mostrarToast(`Tipo inválido: ${tipo}`, true);
    return;
  }

  const container = document.getElementById(listas[tipo]);
  if (!container || container.children.length >= LIMITE) return;

  container.appendChild(criarCampo(tipo));
  atualizarTodosDestinosURA();
  syncTudo();
};

/* ================= DESTINOS URA ================= */

function atualizarDestinosURA(select) {
  if (!select) return;

  select.innerHTML = "";
  select.add(new Option("Selecione o destino", ""));

  const grupos = [
    { id: "listaRings", label: "📞 Ramal", tipo: "ramal" },
    { id: "listaFilas", label: "👥 Fila", tipo: "fila" },
    { id: "listaGrupoRing", label: "🔔 Grupo de Ring", tipo: "grupo_ring" },
    { id: "listaURAs", label: "☎ URA", tipo: "ura" },
    { id: "listaRegrasTempo", label: "⏰ Regra de Tempo", tipo: "regra_tempo" }
  ];

  grupos.forEach(g => {
    const optgroup = document.createElement("optgroup");
    optgroup.label = g.label;

    document.querySelectorAll(`#${g.id} .campo-nome`).forEach(i => {
      if (i.value) {
        const opt = new Option(i.value, i.value);
        opt.dataset.tipo = g.tipo;
        optgroup.appendChild(opt);
      }
    });

    if (optgroup.children.length) {
      select.appendChild(optgroup);
    }
  });
}

function atualizarTodosDestinosURA() {
  document.querySelectorAll(".opcao-ura select").forEach(select => {
    const atual = select.value;
    atualizarDestinosURA(select);
    select.value = atual;
  });
}

/* ================= CRIAR CAMPO ================= */

function criarCampo(tipo) {
  const wrap = document.createElement("div");
  wrap.className = "campo-descricao";

  const linhaNome = document.createElement("div");
  linhaNome.className = "linha-principal";

  const nome = document.createElement("input");
  nome.className = "campo-nome";
  nome.style.width = "100%";

  const placeholders = {
    usuario_web: "Digite o nome do usuário",
    ura: "Digite o nome da sua URA",
    entrada: "Digite o número de entrada",
    fila: "Digite o nome da sua fila",
    ring: "Digite o número do ramal",
    grupo_ring: "Digite o nome do grupo de ring",
    agente: "Digite o nome do agente"
  };

  nome.placeholder = placeholders[tipo] || "Digite o nome";
  nome.addEventListener("input", atualizarTodosDestinosURA);

  const btn = document.createElement("button");
  btn.textContent = "✖";
  btn.onclick = function () {
    wrap.remove();
    atualizarTodosDestinosURA();
    syncTudo();
  };

  linhaNome.append(nome, btn);
  wrap.append(linhaNome);

  let emailInput = null;
  let senhaInput = null;
  let permissao = null;
  let regras = null;
  let chkAgente = null;

  /* ===== USUÁRIO WEB ===== */
  if (tipo === "usuario_web") {
    emailInput = document.createElement("input");
    emailInput.type = "email";
    emailInput.placeholder = "E-mail do usuário";

    senhaInput = document.createElement("input");
    senhaInput.placeholder = "Senha do usuário";
    senhaInput.className = "campo-senha";

    permissao = document.createElement("select");
    permissao.append(new Option("Selecione a permissão", ""));
    PERMISSOES.forEach(p => permissao.add(new Option(p, p)));

    chkAgente = document.createElement("input");
    chkAgente.type = "checkbox";

    regras = document.createElement("div");

    wrap.append(emailInput, senhaInput, permissao, chkAgente, regras);
  }

  /* ===== RAMAL ===== */
  if (tipo === "ring") {
    senhaInput = document.createElement("input");
    senhaInput.placeholder = "Senha do ramal";
    senhaInput.className = "campo-senha";
    regras = document.createElement("div");
    wrap.append(senhaInput, regras);
  }

  wrap.getNome = () => nome.value;
  wrap.getEmail = () => emailInput ? emailInput.value : "";
  wrap.getSenha = () => senhaInput ? senhaInput.value : "";
  wrap.getPermissao = () => permissao ? permissao.value : "";
  wrap.isAgente = () => chkAgente ? chkAgente.checked : false;

  return wrap;
}

/* ================= CHAT – INFO AGENTE ================= */

window.informarAgenteChat = function () {
  mostrarToast(
    "Os agentes omnichannel são gerados automaticamente a partir dos usuários marcados como agente.",
    true
  );
};

/* ================= TOAST ================= */

function mostrarToast(msg, error) {
  const t = document.getElementById("toastGlobal");
  const m = document.getElementById("toastMessage");
  if (!t || !m) return;

  m.textContent = msg;
  t.className = "toast show" + (error ? " error" : "");
  setTimeout(() => t.classList.remove("show"), 3000);
}
