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

  let emailInput, senhaInput, permissao, regras;
  let senhaOk = true;

  if (tipo === "usuario_web") {
    const linhaCred = document.createElement("div");
    linhaCred.className = "linha-principal";
    linhaCred.style.gap = "12px";
    linhaCred.style.marginTop = "12px";

    emailInput = document.createElement("input");
    emailInput.type = "email";
    emailInput.placeholder = "E-mail do usuário";
    emailInput.style.flex = "1";

    senhaInput = document.createElement("input");
    senhaInput.placeholder = "Senha do usuário";
    senhaInput.classList.add("campo-senha");
    senhaInput.style.flex = "1";

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

    senhaInput.oninput = () => {
      senhaOk = false;
      const v = senhaInput.value;
      if (
        v.length >= 11 &&
        /[A-Z]/.test(v) &&
        /\d/.test(v) &&
        /[^A-Za-z0-9]/.test(v)
      ) {
        regras.innerHTML = `<div class="regra-ok">Senha válida</div>`;
        senhaOk = true;
      } else {
        regras.innerHTML = `<div class="regra-erro">Senha inválida</div>`;
      }
    };
  }

  const desc = document.createElement("textarea");
  desc.placeholder = "Descrição (opcional)";
  desc.style.marginTop = "12px";
  wrap.append(desc);

  wrap.validarSenha = () => senhaOk;
  wrap.getNome = () => nome.value;
  wrap.getEmail = () => emailInput?.value || "x@x";
  wrap.getSenha = () => senhaInput?.value || "";
  wrap.getPermissao = () => permissao?.value || "";
  wrap.setPermissaoAtalho = atalho => {
    const key = atalho?.toLowerCase();
    if (MAPA_PERMISSOES[key]) permissao.value = MAPA_PERMISSOES[key];
  };

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
    const campo = criarCampo("ring");
    campo.querySelector(".campo-nome").value = i;
    container.appendChild(campo);
  }

  mostrarToast("Range criado com sucesso!");
};

/* ================= IMPORTAÇÃO ================= */
window.acionarImportacao = function (tipo) {
  if (!listas[tipo]) return mostrarToast("Tipo inválido", true);
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

function processarCSV(tipo, texto) {
  const linhas = texto.split("\n").slice(1);
  const container = document.getElementById(listas[tipo]);

  linhas.forEach(l => {
    const d = l.split(",").map(v => v.trim());
    if (!d[0]) return;

    const campo = criarCampo(tipo);
    campo.querySelector(".campo-nome").value = d[0];

    if (tipo === "usuario_web") {
      campo.querySelector("input[type=email]").value = d[1] || "x@x";
      campo.querySelector(".campo-senha").value = d[2] || "";
      campo.setPermissaoAtalho(d[3]);
    }

    container.appendChild(campo);
  });

  mostrarToast("Importação concluída!");
}

/* ================= EXPORTAR ================= */
window.explorar = function () {
  const dados = {};

  Object.keys(listas).forEach(tipo => {
    dados[tipo] = [];
    document.getElementById(listas[tipo])
      .querySelectorAll(".campo-descricao")
      .forEach(c => {
        if (tipo === "usuario_web" && !c.validarSenha()) return;

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

  document.getElementById("resultado").textContent =
    JSON.stringify(dados, null, 2);
};

/* ================= TEMPLATE CSV ================= */
window.baixarTemplateUsuarios = function () {
  const csv = [
    "usuario,email,senha,permissao,descricao",
    "joao.silva,joao@empresa.com,Senha@12345,pabx,Administrador",
    "maria.souza,maria@empresa.com,Senha@12345,agente,Agente CC"
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "template_usuarios_web.csv";
  a.click();
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
  toggleTheme.onclick = () => {
    document.body.classList.toggle("dark");
  };
}
