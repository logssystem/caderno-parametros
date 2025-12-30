console.log("APP.JS FINAL – ESTÁVEL");

/* CONFIG */
const LIMITE = 600;

const listas = {
  usuario_web: "listaUsuariosWeb",
  entrada: "listaEntradas",
  ura: "listaURAs",
  fila: "listaFilas",
  ring: "listaRings",
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

/* 🔑 MAPA DE ATALHOS CSV */
const MAPA_PERMISSOES = {
  pabx: "Administrador do Módulo de PABX",
  agente: "Agente de Call Center",
  supervisor: "Supervisor(a) de Call Center",
  crm: "CRM",
  crm_owner: "CRM Owner",
  omni: "Administrador do Módulo de Omnichannel",
  agente_omni: "Agente Omnichannel",
  super_omni: "Supervisor(a) Omnichannel",
  super_admin: "Super Administrador"
};

/* ================= ADICIONAR CAMPO ================= */
window.adicionarCampo = function (tipo) {
  const container = document.getElementById(listas[tipo]);
  if (!container || container.children.length >= LIMITE) return;
  container.appendChild(criarCampo(tipo));
};

/* ================= CRIAR CAMPO ================= */
function criarCampo(tipo) {
  const wrap = document.createElement("div");
  wrap.className = "campo-descricao";

  /* === NOME === */
  const linhaUsuario = document.createElement("div");
  linhaUsuario.className = "linha-principal";

  const nome = document.createElement("input");
  nome.placeholder = `Digite ${tipo.replace("_", " ")}`;
  nome.classList.add("campo-nome");
  nome.style.width = "100%";

  const btn = document.createElement("button");
  btn.textContent = "✖";
  btn.onclick = () => wrap.remove();

  linhaUsuario.append(nome, btn);
  wrap.append(linhaUsuario);

  let emailInput, senhaInput, permissao, regras;
  let senhaOk = false;

  /* === USUÁRIO WEB === */
  if (tipo === "usuario_web") {
    /* EMAIL + SENHA */
    const linhaCred = document.createElement("div");
    linhaCred.className = "linha-principal";
    linhaCred.style.gap = "12px";
    linhaCred.style.marginTop = "12px";

    emailInput = document.createElement("input");
    emailInput.type = "email";
    emailInput.placeholder = "E-mail do usuário";
    emailInput.classList.add("campo-email");
    emailInput.style.flex = "1";

    senhaInput = document.createElement("input");
    senhaInput.placeholder = "Senha do usuário";
    senhaInput.classList.add("campo-senha");
    senhaInput.style.flex = "1";

    linhaCred.append(emailInput, senhaInput);
    wrap.append(linhaCred);

    /* PERMISSÃO */
    permissao = document.createElement("select");
    permissao.classList.add("campo-permissao");
    permissao.style.marginTop = "12px";

    const opt0 = new Option("Selecione a permissão", "");
    opt0.disabled = true;
    opt0.selected = true;
    permissao.appendChild(opt0);
    PERMISSOES.forEach(p => permissao.add(new Option(p, p)));

    wrap.append(permissao);

    /* REGRAS */
    regras = document.createElement("div");
    regras.style.marginTop = "10px";
    wrap.append(regras);

    senhaInput.oninput = () => {
      regras.innerHTML = "";
      senhaInput.classList.remove("senha-invalida");
      senhaOk = false;

      const v = senhaInput.value;
      if (v.length < 11) return erro("A senha deve ter pelo menos 11 caracteres.");
      if (!/[A-Z]/.test(v)) return erro("A senha deve conter pelo menos uma letra maiúscula.");
      if (!/\d/.test(v)) return erro("A senha deve conter pelo menos um número.");
      if (!/[^A-Za-z0-9]/.test(v)) return erro("A senha deve conter pelo menos um caractere especial.");

      regras.innerHTML = `<div class="regra-ok">A senha é segura!</div>`;
      senhaOk = true;
    };

    function erro(msg) {
      senhaInput.classList.add("senha-invalida");
      regras.innerHTML = `<div class="regra-erro">${msg}</div>`;
    }
  }

  /* DESCRIÇÃO */
  const desc = document.createElement("textarea");
  desc.placeholder = "Descrição (opcional)";
  desc.style.marginTop = "12px";
  wrap.append(desc);

  /* HELPERS */
  wrap.validarSenha = () => (senhaInput ? senhaOk : true);
  wrap.getNome = () => nome.value;
  wrap.getEmail = () => emailInput?.value || "";
  wrap.getSenha = () => senhaInput?.value || "";
  wrap.getPermissao = () => permissao?.value || "";
  wrap.setPermissaoAtalho = atalho => {
    const key = atalho?.toLowerCase();
    if (MAPA_PERMISSOES[key]) permissao.value = MAPA_PERMISSOES[key];
  };

  return wrap;
}

/* ================= IMPORTAÇÃO CSV ================= */
window.acionarImportacao = function (tipo) {
  const input = document.getElementById(
    tipo === "usuario_web" ? "importUsuarios" : "importRamais"
  );
  if (!input) return;

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
  const linhas = texto.split("\n").slice(1);
  const container = document.getElementById(listas[tipo]);
  if (!container) return;

  linhas.forEach(l => {
    const d = l.split(",").map(v => v.trim());
    if (!d[0]) return;

    const campo = criarCampo(tipo);
    campo.querySelector(".campo-nome").value = d[0];

    if (tipo === "usuario_web") {
      if (d[1]) campo.querySelector(".campo-email").value = d[1];
      if (d[2]) campo.querySelector(".campo-senha").value = d[2];
      if (d[3]) campo.setPermissaoAtalho(d[3]);
    }

    container.appendChild(campo);
  });

  mostrarToast("Importação concluída com sucesso!");
}

/* ================= EXPORTAR ================= */
window.explorar = function () {
  const dados = {};
  let erro = false;

  Object.keys(listas).forEach(tipo => {
    dados[tipo] = [];
    document.getElementById(listas[tipo])
      .querySelectorAll(".campo-descricao")
      .forEach(c => {
        if (tipo === "usuario_web" && !c.validarSenha()) erro = true;

        const item = {
          nome: c.getNome(),
          descricao: c.querySelector("textarea")?.value || ""
        };

        if (tipo === "usuario_web") {
          item.email = c.getEmail();
          item.senha = c.getSenha();
          item.permissao = c.getPermissao();
        }

        dados[tipo].push(item);
      });
  });

  if (erro) return mostrarToast("Existe senha inválida.", true);

  document.getElementById("resultado").textContent =
    JSON.stringify(dados, null, 2);

  mostrarToast("Exportado com sucesso!");
};

/* ================= TOAST ================= */
function mostrarToast(msg, error = false) {
  const t = document.getElementById("toastGlobal");
  document.getElementById("toastMessage").textContent = msg;
  t.className = "toast show" + (error ? " error" : "");
  setTimeout(() => t.classList.remove("show"), 4000);
}

window.fecharToast = () =>
  document.getElementById("toastGlobal").classList.remove("show");

/* ================= TEMA ================= */
const toggleTheme = document.getElementById("toggleTheme");
if (toggleTheme) {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    toggleTheme.textContent = "☀️";
  }

  toggleTheme.onclick = () => {
    document.body.classList.toggle("dark");
    const d = document.body.classList.contains("dark");
    toggleTheme.textContent = d ? "☀️" : "🌙";
    localStorage.setItem("theme", d ? "dark" : "light");
  };
}
