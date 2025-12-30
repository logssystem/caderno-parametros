console.log("APP.JS FINAL – ESTÁVEL");

/* CONFIG */
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
  const container = document.getElementById(listas[tipo]);
  if (!container || container.children.length >= LIMITE) return;
  container.appendChild(criarCampo(tipo));
};

/* ================= CRIAR CAMPO ================= */
function criarCampo(tipo) {
  const wrap = document.createElement("div");
  wrap.className = "campo-descricao";

  const linha = document.createElement("div");
  linha.className = "linha-principal";

  const nome = document.createElement("input");
  nome.className = "campo-nome";
  nome.placeholder = `Digite ${tipo.replace("_", " ")}`;
  nome.style.width = "100%";

  const btn = document.createElement("button");
  btn.textContent = "✖";
  btn.onclick = () => wrap.remove();

  linha.append(nome, btn);
  wrap.append(linha);

  let email, senha, permissao, regras;
  let senhaOk = true;

  if (tipo === "usuario_web" || tipo === "ring") {
    email = document.createElement("input");
    email.type = "email";
    email.placeholder = "E-mail";
    email.value = "x@x";

    senha = document.createElement("input");
    senha.placeholder = "Senha";
    senha.className = "campo-senha";

    regras = document.createElement("div");

    senha.oninput = () => {
      const v = senha.value;
      senhaOk =
        v.length >= 11 &&
        /[A-Z]/.test(v) &&
        /\d/.test(v) &&
        /[^A-Za-z0-9]/.test(v);

      regras.innerHTML = senhaOk
        ? `<div class="regra-ok">Senha válida</div>`
        : `<div class="regra-erro">Mín. 11, maiúscula, número e especial</div>`;
    };

    wrap.append(email, senha, regras);
  }

  if (tipo === "usuario_web") {
    permissao = document.createElement("select");
    permissao.append(new Option("Selecione a permissão", ""));
    PERMISSOES.forEach(p => permissao.append(new Option(p, p)));
    wrap.append(permissao);
  }

  const desc = document.createElement("textarea");
  desc.placeholder = "Descrição (opcional)";
  wrap.append(desc);

  wrap.validarSenha = () => senhaOk;
  wrap.getNome = () => nome.value;
  wrap.getEmail = () => email?.value || "x@x";
  wrap.getSenha = () => senha?.value || "";
  wrap.getPermissao = () => permissao?.value || "";
  wrap.setPermissaoAtalho = a => {
    const k = a?.toLowerCase();
    if (MAPA_PERMISSOES[k] && permissao) permissao.value = MAPA_PERMISSOES[k];
  };

  return wrap;
}

/* ================= RANGE RAMAIS ================= */
window.criarRangeRamais = function () {
  const ini = Number(ramalInicio.value);
  const fim = Number(ramalFim.value);
  const c = document.getElementById("listaRings");

  if (!ini || !fim || fim < ini) return mostrarToast("Range inválido", true);

  for (let i = ini; i <= fim; i++) {
    const campo = criarCampo("ring");
    campo.querySelector(".campo-nome").value = i;
    c.appendChild(campo);
  }

  mostrarToast("Range criado!");
};

/* ================= IMPORTAÇÃO ================= */
window.acionarImportacao = function (tipo) {
  const input =
    tipo === "usuario_web"
      ? document.getElementById("importUsuarios")
      : document.getElementById("importRamais");

  input.value = "";
  input.click();

  input.onchange = () => {
    const r = new FileReader();
    r.onload = e => processarCSV(tipo, e.target.result);
    r.readAsText(input.files[0]);
  };
};

function processarCSV(tipo, texto) {
  const linhas = texto.replace(/\r/g, "").split("\n").filter(l => l);
  const header = linhas.shift().split(";");

  linhas.forEach(l => {
    const d = l.split(";");
    const campo = criarCampo(tipo);
    campo.querySelector(".campo-nome").value = d[0];

    if (tipo === "usuario_web") {
      campo.querySelector("input[type=email]").value = d[1] || "x@x";
      campo.querySelector(".campo-senha").value = d[2] || "";
      campo.setPermissaoAtalho(d[3]);
    }

    document.getElementById(listas[tipo]).appendChild(campo);
  });

  mostrarToast("Importado com sucesso!");
}

/* ================= EXPORTAR ================= */
window.explorar = function () {
  const dados = {};
  Object.keys(listas).forEach(t => {
    dados[t] = [];
    document.getElementById(listas[t])
      .querySelectorAll(".campo-descricao")
      .forEach(c => {
        if (t === "usuario_web" && !c.validarSenha()) return;
        dados[t].push({
          nome: c.getNome(),
          email: c.getEmail(),
          senha: c.getSenha(),
          permissao: c.getPermissao()
        });
      });
  });
  resultado.textContent = JSON.stringify(dados, null, 2);
};

/* ================= TEMPLATE CSV ================= */
window.baixarTemplateUsuarios = function () {
  const csv = [
    "usuario;email;senha;permissao;descricao",
    "joao.silva;joao@empresa.com;Senha@12345;pabx;Admin"
  ].join("\n");

  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv]));
  a.download = "template_usuarios_web.csv";
  a.click();
};

/* ================= TOAST ================= */
function mostrarToast(msg, error = false) {
  const t = document.getElementById("toastGlobal");
  toastMessage.textContent = msg;
  t.className = "toast show" + (error ? " error" : "");
  setTimeout(() => t.classList.remove("show"), 3000);
}

window.fecharToast = () => toastGlobal.classList.remove("show");

/* ================= TEMA ================= */
(function () {
  const tema = localStorage.getItem("theme");
  if (tema === "dark") {
    document.body.classList.add("dark");
    toggleTheme.textContent = "☀️";
  }
})();

toggleTheme.onclick = () => {
  const d = document.body.classList.toggle("dark");
  toggleTheme.textContent = d ? "☀️" : "🌙";
  localStorage.setItem("theme", d ? "dark" : "light");
};
