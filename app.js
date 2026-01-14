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
  let chkAgente = null;

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

    const boxAgente = document.createElement("label");
    boxAgente.style.display = "flex";
    boxAgente.style.alignItems = "center";
    boxAgente.style.gap = "6px";
    boxAgente.style.marginTop = "8px";

    chkAgente = document.createElement("input");
    chkAgente.type = "checkbox";

    const txt = document.createElement("span");
    txt.textContent = "Este usuário é agente de call center";

    boxAgente.append(chkAgente, txt);
    wrap.append(boxAgente);

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
    msg.placeholder = "Mensagem da URA Ex: Olá seja bem-vindo...";
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
  wrap.isAgente = () => chkAgente ? chkAgente.checked : false;

  return wrap;
}

/* ================= OPÇÃO URA ================= */

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

/* ================= DESTINOS URA ================= */

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
  document.querySelectorAll(".opcao-ura select").forEach(select => {
    const atual = select.value;
    atualizarDestinosURA(select);
    select.value = atual;
  });
}

/* ================= RANGE RAMAIS ================= */

window.criarRangeRamais = function () {
  const ini = Number(document.getElementById("ramalInicio")?.value);
  const fim = Number(document.getElementById("ramalFim")?.value);
  const container = document.getElementById("listaRings");

  if (!ini || !fim || fim < ini) return mostrarToast("Range inválido", true);

  for (let i = ini; i <= fim; i++) {
    const campo = criarCampo("ring");
    campo.querySelector(".campo-nome").value = i;
    container.appendChild(campo);
  }

  atualizarTodosDestinosURA();
  mostrarToast("Range criado com sucesso!");
};

/* ================= TOAST ================= */

function mostrarToast(msg, error = false) {
  const t = document.getElementById("toastGlobal");
  const m = document.getElementById("toastMessage");
  if (!t || !m) return;
  m.textContent = msg;
  t.className = "toast show" + (error ? " error" : "");
  setTimeout(() => t.classList.remove("show"), 3000);
}

/* ================= JSON ================= */

window.explorar = function () {
  try {

    const coletar = (id, fn) =>
      [...document.querySelectorAll(`#${id} .campo-descricao`)]
        .map(fn)
        .filter(v => v && Object.values(v).some(x => x));

    const usuarios = coletar("listaUsuariosWeb", c => ({
      nome: c.getNome(),
      email: c.getEmail(),
      senha: c.getSenha(),
      permissao: c.getPermissao(),
      agente: c.isAgente()
    }));

    const ramais = coletar("listaRings", c => ({
      ramal: c.getNome(),
      senha: c.getSenha()
    }));

    const uras = [];
    document.querySelectorAll("#listaURAs .campo-descricao").forEach(c => {
      if (c.getURA) uras.push(c.getURA());
    });

    const dados = { voz: { usuarios, ramais, uras } };

    document.getElementById("resultado").textContent =
      JSON.stringify(dados, null, 2);

    mostrarToast("JSON gerado com sucesso!");

  } catch (e) {
    console.error(e);
    mostrarToast("Erro ao gerar JSON", true);
  }
};

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

window.baixarTemplateUsuarios = function () {
  const csv = "usuario;email;senha;permissao;descricao\n";
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "template_usuarios_web.csv";
  link.click();
};

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

/* =========================
   MOTOR CENTRAL DO SISTEMA
========================= */

window.APP_STATE = {
  usuarios: [],
  ramais: [],
  agentes: [],
  filas: []
};

function syncAppState() {
  /* ---------- USUÁRIOS ---------- */
  APP_STATE.usuarios = [...document.querySelectorAll("#listaUsuariosWeb .campo-descricao")].map(c => {
    return {
      id: c.dataset.id || null,
      nome: c.getNome(),
      email: c.getEmail(),
      senha: c.getSenha(),
      permissao: c.getPermissao(),
      isAgente: typeof c.isAgente === "function" ? c.isAgente() : false
    };
  }).filter(u => u.nome);

  /* ---------- RAMAIS ---------- */
  APP_STATE.ramais = [...document.querySelectorAll("#listaRings .campo-descricao")].map(c => {
    return {
      id: c.dataset.id || null,
      ramal: c.getNome(),
      senha: c.getSenha(),
      usuarioId: c.dataset.usuarioId || null
    };
  }).filter(r => r.ramal);

  /* ---------- AGENTES (DERIVADOS DE USUÁRIOS) ---------- */
  APP_STATE.agentes = APP_STATE.usuarios
    .filter(u => u.isAgente)
    .map(u => {
      const ramal = APP_STATE.ramais.find(r => r.usuarioId === u.id) || null;
      return {
        id: u.id,                 // agente herda ID do usuário
        nome: u.nome,
        usuarioId: u.id,
        ramalId: ramal ? ramal.id : null,
        ramal: ramal ? ramal.ramal : null
      };
    });

  /* ---------- FILAS ---------- */
  APP_STATE.filas = [...document.querySelectorAll("#listaFilas .campo-descricao")].map(f => {
    return {
      id: f.dataset.id || null,
      nome: f.querySelector(".campo-nome")?.value || "",
      agentes: JSON.parse(f.dataset.agentes || "[]")
    };
  }).filter(f => f.nome);

  console.log("APP_STATE atualizado:", APP_STATE);
}

/* =========================
   GANCHO GLOBAL DE SYNC
========================= */

function syncTudo() {
  syncAppState();

  if (typeof atualizarSelectUsuariosRamal === "function") atualizarSelectUsuariosRamal();
  if (typeof atualizarSelectAgentes === "function") atualizarSelectAgentes();
  if (typeof atualizarSelectAgentesFila === "function") atualizarSelectAgentesFila();
  if (typeof atualizarTodosDestinosURA === "function") atualizarTodosDestinosURA();
}

/* =========================
   AUTO-SYNC (SEGURANÇA)
========================= */

document.addEventListener("input", e => {
  if (e.target.closest(".campo-descricao")) {
    syncTudo();
  }
});

document.addEventListener("change", e => {
  if (e.target.closest(".campo-descricao")) {
    syncTudo();
  }
});

/* ================= FIX DEFINITIVO — REGRA DE TEMPO ================= */

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

/* =========================
   AGENTES AUTOMÁTICOS VIA USUÁRIO
========================= */

function gerarAgentesAPartirUsuarios() {
  const listaAgentes = document.getElementById("listaAgentes");
  if (!listaAgentes) return;

  listaAgentes.innerHTML = "";

  const usuarios = [...document.querySelectorAll("#listaUsuariosWeb .campo-descricao")];

  usuarios.forEach(u => {
    if (typeof u.isAgente === "function" && u.isAgente() && u.getNome()) {

      const wrap = document.createElement("div");
      wrap.className = "campo-descricao";
      wrap.dataset.id = u.dataset.id || ("agente_" + Math.random().toString(36).slice(2));

      const linha = document.createElement("div");
      linha.className = "linha-principal";

      const nome = document.createElement("input");
      nome.value = u.getNome();
      nome.disabled = true;
      nome.className = "campo-nome";

      const del = document.createElement("button");
      del.textContent = "✖";
      del.onclick = () => {
        u.querySelector("input[type=checkbox]").checked = false;
        gerarAgentesAPartirUsuarios();
      };

      linha.append(nome, del);
      wrap.append(linha);

      const selectRamal = document.createElement("select");
      selectRamal.innerHTML = `<option value="">Ramal (obrigatório)</option>`;

      document.querySelectorAll("#listaRings .campo-descricao").forEach(r => {
        if (r.getNome()) {
          selectRamal.add(new Option(r.getNome(), r.getNome()));
        }
      });

      wrap.append(selectRamal);

      listaAgentes.append(wrap);
    }
  });

  atualizarSelectAgentesFila?.();
}

/* =========================
   FILAS ENXERGAM AGENTES
========================= */

function atualizarSelectAgentesFila() {
  document.querySelectorAll("#listaFilas .campo-descricao").forEach(fila => {
    const select = fila.querySelector("select");
    if (!select) return;

    const atual = select.value;
    select.innerHTML = `<option value="">Selecione um agente</option>`;

    document.querySelectorAll("#listaAgentes .campo-descricao").forEach(a => {
      const nome = a.querySelector(".campo-nome")?.value;
      if (nome) select.add(new Option(nome, nome));
    });

    select.value = atual;
  });
}

/* =========================
   GATILHOS AUTOMÁTICOS
========================= */

document.addEventListener("change", e => {
  if (e.target.closest("#listaUsuariosWeb")) {
    gerarAgentesAPartirUsuarios();
  }

  if (e.target.closest("#listaRings")) {
    gerarAgentesAPartirUsuarios();
  }
});
