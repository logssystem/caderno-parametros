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

/* ================= ADICIONAR CAMPO ================= */

window.adicionarCampo = function (tipo) {
  if (!listas[tipo]) return mostrarToast(`Tipo inválido: ${tipo}`, true);
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
    btnNova.style.marginTop = "10px";
    btnNova.onclick = () => listaOpcoes.appendChild(criarOpcaoURA());
    wrap.append(btnNova);

    wrap.getURA = () => ({
      nome: nome.value,
      mensagem: msg.value,
      opcoes: [...listaOpcoes.querySelectorAll(".opcao-ura")].map(o => o.getData())
    });
  }

  const desc = document.createElement("textarea");
  desc.placeholder = "Descrição (opcional)";
  desc.style.marginTop = "12px";
  wrap.append(desc);

  function validarSenha(input, regrasEl) {
    const v = input.value;
    senhaOk = v.length >= 11 && /[A-Z]/.test(v) && /\d/.test(v) && /[^A-Za-z0-9]/.test(v);
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

/* ================= OPÇÕES URA (DINÂMICAS) ================= */

function criarOpcaoURA() {
  const wrap = document.createElement("div");
  wrap.className = "opcao-ura";
  wrap.style.display = "grid";
  wrap.style.gridTemplateColumns = "70px 1fr 1fr auto";
  wrap.style.gap = "8px";
  wrap.style.marginTop = "8px";

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
  select.innerHTML = "";
  select.add(new Option("Selecione o destino", ""));

  document.querySelectorAll("#listaFilas .campo-nome").forEach(f => {
    if (f.value) select.add(new Option("Fila: " + f.value, "fila:" + f.value));
  });

  document.querySelectorAll("#listaRings .campo-nome").forEach(r => {
    if (r.value) select.add(new Option("Ramal: " + r.value, "ramal:" + r.value));
  });

  document.querySelectorAll("#listaGrupoRing .campo-nome").forEach(g => {
    if (g.value) select.add(new Option("Grupo: " + g.value, "grupo:" + g.value));
  });

  document.querySelectorAll("#listaURAs .campo-nome").forEach(u => {
    if (u.value) select.add(new Option("URA: " + u.value, "ura:" + u.value));
  });

  document.querySelectorAll("#listaRegrasTempo .campo-descricao input").forEach(r => {
    if (r.value) select.add(new Option("Regra de tempo: " + r.value, "tempo:" + r.value));
  });

  select.add(new Option("Desligar", "desligar"));
  select.add(new Option("Número externo", "numero"));
}

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
  nome.placeholder = "Nome da regra";
  wrap.appendChild(nome);

  const diasSemana = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
  const diasSelecionados = new Set();

  const diasBox = document.createElement("div");
  diasBox.style.display = "grid";
  diasBox.style.gridTemplateColumns = "repeat(auto-fit, minmax(80px, 1fr))";
  diasBox.style.gap = "6px";
  diasBox.style.marginTop = "10px";

  diasSemana.forEach(d => {
    const b = document.createElement("button");
    b.textContent = d;
    b.onclick = () => {
      b.classList.toggle("ativo");
      b.classList.contains("ativo") ? diasSelecionados.add(d) : diasSelecionados.delete(d);
    };
    diasBox.appendChild(b);
  });

  wrap.appendChild(diasBox);

  const ini = document.createElement("input");
  ini.type = "time";
  const fim = document.createElement("input");
  fim.type = "time";

  wrap.append(ini, fim);

  wrap.getData = () => ({
    nome: nome.value,
    dias: [...diasSelecionados],
    hora_inicio: ini.value,
    hora_fim: fim.value
  });

  return wrap;
}

/* ================= EXPLORAR ================= */

window.explorar = function () {
  const dados = {};

  dados.uras = [];
  document.querySelectorAll("#listaURAs .campo-descricao").forEach(c => {
    if (c.getURA) dados.uras.push(c.getURA());
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
}
