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

  wrap.getNome = () => nome.value;
  wrap.getEmail = () => emailInput?.value || "";
  wrap.getSenha = () => senhaInput?.value || "";
  wrap.getPermissao = () => permissao?.value || "";

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

/* ================= REGRA DE TEMPO ================= */

window.adicionarRegraTempo = function () {
  const container = document.getElementById("listaRegrasTempo");
  if (!container) return;
  container.appendChild(criarRegraTempo());
};

function criarRegraTempo() {
  const wrap = document.createElement("div");
  wrap.className = "campo-descricao";

  const nome = document.createElement("input");
  nome.placeholder = "Nome da regra (ex: Horário Comercial)";
  wrap.appendChild(nome);

  const dias = [
    "Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"
  ];
  const diasSelecionados = new Set();

  const diasBox = document.createElement("div");
  diasBox.style.display = "grid";
  diasBox.style.gridTemplateColumns = "repeat(auto-fit,minmax(120px,1fr))";
  diasBox.style.gap = "8px";

  dias.forEach(d => {
    const b = document.createElement("button");
    b.textContent = d;
    b.onclick = () => {
      b.classList.toggle("ativo");
      b.classList.contains("ativo")
        ? diasSelecionados.add(d)
        : diasSelecionados.delete(d);
    };
    diasBox.appendChild(b);
  });

  wrap.appendChild(diasBox);

  const inicio = document.createElement("input");
  inicio.type = "time";
  const fim = document.createElement("input");
  fim.type = "time";

  wrap.append(inicio, fim);

  wrap.getData = () => ({
    nome: nome.value,
    dias: Array.from(diasSelecionados),
    hora_inicio: inicio.value,
    hora_fim: fim.value
  });

  return wrap;
}

/* ================= EXPLORAR ================= */

window.explorar = function () {
  const dados = {};

  dados.usuarios_web = [];
  document.querySelectorAll("#listaUsuariosWeb .campo-descricao").forEach(c => {
    dados.usuarios_web.push({
      nome: c.getNome(),
      email: c.getEmail(),
      senha: c.getSenha(),
      permissao: c.getPermissao()
    });
  });

  dados.ramais = [];
  document.querySelectorAll("#listaRings .campo-descricao").forEach(c => {
    dados.ramais.push({
      ramal: c.getNome(),
      senha: c.getSenha()
    });
  });

  dados.regras_tempo = [];
  document.querySelectorAll("#listaRegrasTempo .campo-descricao").forEach(r => {
    dados.regras_tempo.push(r.getData());
  });

  document.getElementById("resultado").textContent =
    JSON.stringify(dados, null, 2);

  mostrarToast("Parâmetros gerados com sucesso!");
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
  toggleTheme.onclick = () => document.body.classList.toggle("dark");
};
