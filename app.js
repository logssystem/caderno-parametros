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

  /* ===== USUÁRIO WEB ===== */
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

  /* ===== RAMAL ===== */
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

  /* ===== URA ===== */
  if (tipo === "ura") {
    const msg = document.createElement("textarea");
    msg.placeholder = "Mensagem da URA (ex: Bem-vindo, digite 1 para vendas...)";
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

/* ================= OPÇÕES URA ================= */

function criarOpcaoURA() {
  const wrap = document.createElement("div");
  wrap.className = "opcao-ura";
  wrap.style.display = "grid";
  wrap.style.gridTemplateColumns = "80px 1fr 1fr auto";
  wrap.style.gap = "8px";
  wrap.style.marginTop = "8px";

  const tecla = document.createElement("input");
  tecla.placeholder = "Tecla";

  const destino = document.createElement("select");
  ["Fila", "URA", "Ramal", "Grupo", "Número", "Desligar"].forEach(v =>
    destino.add(new Option(v, v))
  );

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

  const diasSemana = ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"];
  const diasSelecionados = new Set();

  const diasBox = document.createElement("div");
  diasBox.style.display = "grid";
  diasBox.style.gridTemplateColumns = "repeat(auto-fit, minmax(120px, 1fr))";
  diasBox.style.gap = "8px";
  diasBox.style.marginTop = "10px";

  diasSemana.forEach(dia => {
    const btn = document.createElement("button");
    btn.textContent = dia;
    btn.onclick = () => {
      btn.classList.toggle("ativo");
      btn.classList.contains("ativo")
        ? diasSelecionados.add(dia)
        : diasSelecionados.delete(dia);
    };
    diasBox.appendChild(btn);
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

/* ================= CSV ================= */

window.acionarImportacao = function (tipo) {
  const input = document.getElementById(
    tipo === "usuario_web" ? "importUsuarios" : "importRamais"
  );

  if (!input) return;

  input.value = "";
  input.click();

  input.onchange = () => {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => processarCSV(tipo, e.target.result);
    reader.readAsText(file);
  };
};

window.baixarTemplateUsuarios = function () {
  const csv = "usuario;email;senha;permissao;descricao\n";
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "template_usuarios_web.csv";
  link.click();
};

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

  dados.uras = [];
  document.querySelectorAll("#listaURAs .campo-descricao").forEach(c => {
    if (c.getURA) dados.uras.push(c.getURA());
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
