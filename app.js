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
    btnNova.onclick = () => listaOpcoes.appendChild(criarOpcaoURA());
    wrap.append(btnNova);

    wrap.getURA = () => ({
      nome: nome.value,
      mensagem: msg.value,
      opcoes: [...listaOpcoes.querySelectorAll(".opcao-ura")].map(o => o.getData())
    });
  }

  /* ===== FILA (MÚLTIPLOS AGENTES) ===== */
  if (tipo === "fila") {

    wrap.dataset.agentes = "[]";

    const selectAgente = document.createElement("select");
    selectAgente.innerHTML = `<option value="">Selecione um agente</option>`;
    selectAgente.style.marginTop = "12px";

    const btnAdd = document.createElement("button");
    btnAdd.textContent = "Adicionar agente";
    btnAdd.style.marginTop = "8px";

    const lista = document.createElement("div");
    lista.style.marginTop = "10px";
    lista.style.display = "flex";
    lista.style.flexDirection = "column";
    lista.style.gap = "6px";

    function renderAgentesFila() {
      lista.innerHTML = "";
      const agentes = JSON.parse(wrap.dataset.agentes || "[]");

      agentes.forEach(nome => {
        const item = document.createElement("div");
        item.style.display = "flex";
        item.style.justifyContent = "space-between";
        item.style.alignItems = "center";
        item.style.border = "1px dashed var(--borda)";
        item.style.borderRadius = "10px";
        item.style.padding = "6px 10px";

        const span = document.createElement("span");
        span.textContent = nome;

        const btn = document.createElement("button");
        btn.textContent = "🗑";
        btn.onclick = () => {
          wrap.dataset.agentes = JSON.stringify(
            agentes.filter(a => a !== nome)
          );
          renderAgentesFila();
        };

        item.append(span, btn);
        lista.appendChild(item);
      });
    }

    btnAdd.onclick = () => {
      if (!selectAgente.value) return;

      let agentes = JSON.parse(wrap.dataset.agentes || "[]");
      if (agentes.includes(selectAgente.value)) return;

      agentes.push(selectAgente.value);
      wrap.dataset.agentes = JSON.stringify(agentes);
      renderAgentesFila();
    };

    wrap.atualizarFilaAgentes = () => {
      const atual = selectAgente.value;
      selectAgente.innerHTML = `<option value="">Selecione um agente</option>`;

      document.querySelectorAll("#listaAgentes .campo-descricao").forEach(a => {
        const nome = a.querySelector(".campo-nome")?.value;
        if (nome) selectAgente.add(new Option(nome, nome));
      });

      selectAgente.value = atual;
      renderAgentesFila();
    };

    wrap.append(selectAgente, btnAdd, lista);

    setTimeout(() => wrap.atualizarFilaAgentes(), 50);
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

/* ================= TEMA ================= */

const toggleTheme = document.getElementById("toggleTheme");

function aplicarTemaSalvo() {
  const tema = localStorage.getItem("tema");
  document.body.classList.toggle("dark", tema === "dark");
}

if (toggleTheme) {
  toggleTheme.onclick = () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("tema",
      document.body.classList.contains("dark") ? "dark" : "light"
    );
  };
}

aplicarTemaSalvo();

/* =========================
   AGENTES AUTOMÁTICOS VIA USUÁRIO
========================= */

function gerarAgentesAPartirUsuarios() {
  const listaAgentes = document.getElementById("listaAgentes");
  if (!listaAgentes) return;

  listaAgentes.innerHTML = "";

  document.querySelectorAll("#listaUsuariosWeb .campo-descricao").forEach(u => {
    if (u.isAgente && u.isAgente() && u.getNome()) {

      const wrap = document.createElement("div");
      wrap.className = "campo-descricao";

      const linha = document.createElement("div");
      linha.className = "linha-principal";

      const nome = document.createElement("input");
      nome.value = u.getNome();
      nome.disabled = true;
      nome.className = "campo-nome";

      linha.append(nome);
      wrap.append(linha);
      listaAgentes.append(wrap);
    }
  });

  document.querySelectorAll("#listaFilas .campo-descricao")
    .forEach(f => f.atualizarFilaAgentes && f.atualizarFilaAgentes());
}

/* =========================
   GATILHOS
========================= */

document.addEventListener("change", e => {
  if (e.target.closest("#listaUsuariosWeb") || e.target.closest("#listaRings")) {
    gerarAgentesAPartirUsuarios();
  }
});

/* =========================
   GERAR JSON OFICIAL (FIX FINAL)
========================= */

window.explorar = function () {
  try {

    const getNomeSeguro = (c) =>
      typeof c.getNome === "function"
        ? c.getNome()
        : c.querySelector(".campo-nome")?.value || "";

    const coletar = (id, fn) =>
      [...document.querySelectorAll(`#${id} .campo-descricao`)]
        .map(fn)
        .filter(v => v && Object.values(v).some(x => x));

    const usuarios = coletar("listaUsuariosWeb", c => ({
      nome: getNomeSeguro(c),
      email: c.getEmail?.() || "",
      senha: c.getSenha?.() || "",
      permissao: c.getPermissao?.() || "",
      agente: c.isAgente?.() || false
    }));

    const ramais = coletar("listaRings", c => ({
      ramal: getNomeSeguro(c),
      senha: c.getSenha?.() || ""
    }));

    const entradas = coletar("listaEntradas", c => ({
      numero: getNomeSeguro(c)
    }));

    const grupos = coletar("listaGrupoRing", c => ({
      nome: getNomeSeguro(c)
    }));

    const agentes = coletar("listaAgentes", c => ({
      nome: getNomeSeguro(c)
    }));

    const filas = [...document.querySelectorAll("#listaFilas .campo-descricao")]
      .map(f => ({
        nome: getNomeSeguro(f),
        agentes: JSON.parse(f.dataset.agentes || "[]")
      }))
      .filter(f => f.nome);

    const uras = [];
    document.querySelectorAll("#listaURAs .campo-descricao").forEach(c => {
      if (c.getURA) uras.push(c.getURA());
    });

    const regras = [];
    document.querySelectorAll("#listaRegrasTempo .campo-descricao")
      .forEach(r => regras.push(r.getData()));

    const dados = {
      voz: {
        usuarios_web: usuarios,
        ramais,
        entradas,
        uras,
        filas,
        grupos_ring: grupos,
        agentes,
        regras_tempo: regras
      }
    };

    document.getElementById("resultado").textContent =
      JSON.stringify(dados, null, 2);

    window.__ultimoJSON = dados;
    mostrarToast("JSON gerado com sucesso!");

  } catch (e) {
    console.error("ERRO AO GERAR JSON:", e);
    mostrarToast("Erro ao gerar JSON. Veja o console.", true);
  }
};

/* ================= IMPORTAÇÃO CSV ================= */

window.acionarImportacao = function (tipo) {
  const input = document.getElementById(
    tipo === "usuario_web" ? "importUsuarios" : "importRamais"
  );

  if (!input) {
    mostrarToast("Input de importação não encontrado", true);
    return;
  }

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
