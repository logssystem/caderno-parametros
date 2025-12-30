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

  /* ===== LINHA USUÁRIO (ÚNICA FLEX) ===== */
  const linhaUsuario = document.createElement("div");
  linhaUsuario.className = "linha-principal";

  const nome = document.createElement("input");
  nome.placeholder = `Digite ${tipo.replace("_", " ")}`;
  nome.style.width = "100%";

  const btn = document.createElement("button");
  btn.textContent = "✖";
  btn.onclick = () => wrap.remove();

  linhaUsuario.append(nome, btn);
  wrap.append(linhaUsuario);

  let senhaInput = null;
  let permissao = null;
  let regras = null;
  let senhaOk = false;

  /* ===== USUÁRIO WEB ===== */
  if (tipo === "usuario_web") {

    /* SENHA (FORA DO FLEX) */
    senhaInput = document.createElement("input");
    senhaInput.placeholder = "Senha do usuário";
    senhaInput.classList.add("campo-senha");
    senhaInput.style.marginTop = "12px";
    wrap.append(senhaInput);

    /* PERMISSÃO (FORA DO FLEX) */
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
      if (!/[^A-Za-z0-9]/.test(v))
        return erro("A senha deve conter pelo menos um caractere especial.");

      regras.innerHTML = `<div class="regra-ok">A senha é segura!</div>`;
      senhaOk = true;
    };

    function erro(msg) {
      senhaInput.classList.add("senha-invalida");
      regras.innerHTML = `<div class="regra-erro">${msg}</div>`;
    }
  }

  /* ===== DESCRIÇÃO ===== */
  const desc = document.createElement("textarea");
  desc.placeholder = "Descrição (opcional)";
  desc.style.marginTop = "12px";
  wrap.append(desc);

  /* HELPERS */
  wrap.validarSenha = () => (senhaInput ? senhaOk : true);
  wrap.getSenha = () => (senhaInput ? senhaInput.value : "");
  wrap.getPermissao = () => (permissao ? permissao.value : "");

  return wrap;
}

/* ================= RANGE RAMAIS (NÃO ALTERADO) ================= */
window.criarRangeRamais = function () {
  const ini = document.getElementById("ramalInicio").value;
  const fim = document.getElementById("ramalFim").value;
  const container = document.getElementById("listaRings");

  if (!ini || !fim || Number(fim) < Number(ini)) {
    mostrarToast("Range inválido", true);
    return;
  }

  for (let i = Number(ini); i <= Number(fim); i++) {
    if (container.children.length >= LIMITE) break;

    const wrap = document.createElement("div");
    wrap.className = "campo-descricao";

    const linha = document.createElement("div");
    linha.className = "linha-principal";

    const input = document.createElement("input");
    input.value = i;

    const btn = document.createElement("button");
    btn.textContent = "✖";
    btn.onclick = () => wrap.remove();

    linha.append(input, btn);
    wrap.append(linha);

    const desc = document.createElement("textarea");
    desc.placeholder = "Descrição (opcional)";
    desc.style.marginTop = "12px";
    wrap.append(desc);

    container.appendChild(wrap);
  }

  mostrarToast("Range criado com sucesso!");
};

/* ================= EXPORTAR ================= */
window.explorar = function () {
  const dados = {};
  let erro = false;

  Object.keys(listas).forEach(tipo => {
    dados[tipo] = [];
    document.getElementById(listas[tipo])
      .querySelectorAll(".campo-descricao")
      .forEach(c => {
        const nome = c.querySelector("input")?.value;
        if (!nome) return;

        if (tipo === "usuario_web" && !c.validarSenha()) erro = true;

        const item = {
          nome,
          descricao: c.querySelector("textarea")?.value || ""
        };

        if (tipo === "usuario_web") {
          item.senha = c.getSenha();
          item.permissao = c.getPermissao();
        }

        dados[tipo].push(item);
      });
  });

  if (erro) {
    mostrarToast("Existe senha inválida.", true);
    return;
  }

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
