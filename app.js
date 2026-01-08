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
  atualizarTodosDestinosURA();
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
  nome.addEventListener("input", atualizarTodosDestinosURA);

  const btn = document.createElement("button");
  btn.textContent = "✖";
  btn.onclick = () => {
    wrap.remove();
    atualizarTodosDestinosURA();
  };

  linhaNome.append(nome, btn);
  wrap.append(linhaNome);

  let emailInput = null;
  let senhaInput = null;
  let permissao = null;
  let regras = null;

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
    msg.placeholder = "Mensagem da URA Ex: Olá Seja Bem Vindo a Empresa ERA selecione as opções a seguir 1 para suporte etc...";
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

  const desc = document.createElement("textarea");
  desc.placeholder = "Descrição (opcional)";
  wrap.append(desc);

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

/* ================= DESTINOS URA ================= */

function atualizarDestinosURA(select) {
  if (!select) return;

  select.innerHTML = "";
  select.add(new Option("Selecione o destino", ""));

  document.querySelectorAll("#listaFilas .campo-nome").forEach(f =>
    f.value && select.add(new Option("Fila: " + f.value, "fila:" + f.value))
  );

  document.querySelectorAll("#listaRings .campo-nome").forEach(r =>
    r.value && select.add(new Option("Ramal: " + r.value, "ramal:" + r.value))
  );

  document.querySelectorAll("#listaGrupoRing .campo-nome").forEach(g =>
    g.value && select.add(new Option("Grupo: " + g.value, "grupo:" + g.value))
  );

  document.querySelectorAll("#listaURAs .campo-nome").forEach(u =>
    u.value && select.add(new Option("URA: " + u.value, "ura:" + u.value))
  );

  document.querySelectorAll("#listaRegrasTempo .campo-descricao input").forEach(r =>
    r.value && select.add(new Option("Regra de tempo: " + r.value, "tempo:" + r.value))
  );

  select.add(new Option("Desligar", "desligar"));
  select.add(new Option("Número externo", "numero"));
}

function atualizarTodosDestinosURA() {
  document.querySelectorAll(".opcao-ura select").forEach(select => {
    const atual = select.value;
    atualizarDestinosURA(select);
    select.value = atual;
  });
}

/* ================= OPÇÕES URA ================= */

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

/* ================= IMPORTAÇÃO CSV ================= */

window.acionarImportacao = function (tipo) {
  const input = document.getElementById(
    tipo === "usuario_web" ? "importUsuarios" : "importRamais"
  );

  if (!input) return mostrarToast("Input de importação não encontrado", true);

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

function processarCSV(tipo, texto) {
  const linhas = texto.replace(/\r/g, "").split("\n").filter(l => l.trim());
  if (linhas.length < 2) return mostrarToast("CSV vazio ou inválido", true);

  const sep = linhas[0].includes(";") ? ";" : ",";
  const header = linhas.shift().split(sep).map(h => h.trim().toLowerCase());
  const container = document.getElementById(listas[tipo]);
  if (!container) return;

  linhas.forEach(l => {
    const v = l.split(sep);
    const d = {};
    header.forEach((h, i) => d[h] = (v[i] || "").trim());

    const campo = criarCampo(tipo);
    campo.querySelector(".campo-nome").value = d.usuario || d.nome || "";

    if (tipo === "usuario_web") {
      campo.querySelector("input[type=email]").value = d.email || "";
      campo.querySelector(".campo-senha").value = d.senha || "";

      const select = campo.querySelector("select");
      if (select && d.permissao) {
        [...select.options].forEach(opt => {
          if (opt.value.toLowerCase() === d.permissao.toLowerCase()) {
            opt.selected = true;
          }
        });
      }
    }

    container.appendChild(campo);
  });

  atualizarTodosDestinosURA();
  mostrarToast("CSV importado com sucesso!");
}

/* ================= TEMPLATE CSV ================= */

window.baixarTemplateUsuarios = function () {
  const csv = "usuario;email;senha;permissao;descricao\n";
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "template_usuarios_web.csv";
  link.click();
};

/* ================= TEMA (MODO ESCURO RESTAURADO) ================= */

const toggleTheme = document.getElementById("toggleTheme");

function aplicarTemaSalvo() {
  const tema = localStorage.getItem("tema");
  if (tema === "dark") {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
}

if (toggleTheme) {
  toggleTheme.onclick = () => {
    document.body.classList.toggle("dark");
    localStorage.setItem(
      "tema",
      document.body.classList.contains("dark") ? "dark" : "light"
    );
  };
}

aplicarTemaSalvo();

/* ================= REGRA DE TEMPO (FIX COMPLETO) ================= */

window.adicionarRegraTempo = function () {
  const container = document.getElementById("listaRegrasTempo");

  if (!container) {
    console.error("listaRegrasTempo não encontrada");
    return mostrarToast("Lista de regras de tempo não encontrada", true);
  }

  container.appendChild(criarRegraTempo());
  atualizarTodosDestinosURA();
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
    const btnDia = document.createElement("button");
    btnDia.textContent = dia;
    btnDia.className = "btn-dia";
    btnDia.onclick = () => {
      btnDia.classList.toggle("ativo");
      btnDia.classList.contains("ativo")
        ? diasSelecionados.add(dia)
        : diasSelecionados.delete(dia);
    };
    diasBox.appendChild(btnDia);
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

/* ================= RANGE DE RAMAIS (FIX DEFINITIVO) ================= */

window.criarRangeRamais = function () {
  const ini = Number(document.getElementById("ramalInicio")?.value);
  const fim = Number(document.getElementById("ramalFim")?.value);
  const container = document.getElementById("listaRings");

  if (!container) {
    console.error("listaRings não encontrada");
    return mostrarToast("Lista de ramais não encontrada", true);
  }

  if (!ini || !fim || fim < ini) {
    return mostrarToast("Range inválido", true);
  }

  for (let i = ini; i <= fim; i++) {
    if (container.children.length >= LIMITE) break;

    const campo = criarCampo("ring");
    campo.querySelector(".campo-nome").value = i;
    container.appendChild(campo);
  }

  atualizarTodosDestinosURA();
  mostrarToast("Range de ramais criado com sucesso!");
};

/* ================= REPARO DE FUNÇÕES GLOBAIS ================= */

/* ---- TOAST (garante que nunca fique undefined) ---- */
if (typeof window.mostrarToast !== "function") {
  window.mostrarToast = function (msg, error = false) {
    const t = document.getElementById("toastGlobal");
    const m = document.getElementById("toastMessage");

    if (!t || !m) {
      console.warn("Toast não encontrado:", msg);
      return;
    }

    m.textContent = msg;
    t.className = "toast show" + (error ? " error" : "");
    setTimeout(() => t.classList.remove("show"), 3000);
  };
}

/* ---- GERAR JSON (garante que o botão funcione) ---- */
if (typeof window.explorar !== "function") {
  window.explorar = function () {
    if (typeof gerarJSON === "function") {
      gerarJSON();
    } else {
      mostrarToast("Função de geração de JSON não encontrada", true);
      console.error("explorar() não encontrou gerarJSON()");
    }
  };
}
