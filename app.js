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

/* ATALHOS CSV */
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

/* ADICIONAR CAMPO */
window.adicionarCampo = function (tipo) {
  const c = document.getElementById(listas[tipo]);
  if (!c || c.children.length >= LIMITE) return;
  c.appendChild(criarCampo(tipo));
};

/* CRIAR CAMPO */
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

  let email, senha, permissao, senhaOk = false;

  if (tipo === "usuario_web") {
    const cred = document.createElement("div");
    cred.className = "linha-principal";
    cred.style.gap = "12px";
    cred.style.marginTop = "12px";

    email = document.createElement("input");
    email.type = "email";
    email.placeholder = "E-mail do usuário";
    email.style.flex = "1";

    senha = document.createElement("input");
    senha.placeholder = "Senha do usuário";
    senha.className = "campo-senha";
    senha.style.flex = "1";

    cred.append(email, senha);
    wrap.append(cred);

    permissao = document.createElement("select");
    permissao.className = "campo-permissao";
    permissao.style.marginTop = "12px";

    permissao.append(new Option("Selecione a permissão", "", true, true));
    PERMISSOES.forEach(p => permissao.add(new Option(p, p)));
    wrap.append(permissao);

    senha.oninput = () => {
      senhaOk =
        senha.value.length >= 11 &&
        /[A-Z]/.test(senha.value) &&
        /\d/.test(senha.value) &&
        /[^A-Za-z0-9]/.test(senha.value);
    };
  }

  const desc = document.createElement("textarea");
  desc.placeholder = "Descrição (opcional)";
  desc.style.marginTop = "12px";
  wrap.append(desc);

  wrap.get = () => ({
    nome: nome.value,
    email: email?.value || "x@x",
    senha: senha?.value || "",
    permissao: permissao?.value || "",
    descricao: desc.value || ""
  });

  wrap.validarSenha = () => senha ? senhaOk : true;
  wrap.setPermissaoAtalho = a => {
    const k = a?.toLowerCase();
    if (MAPA_PERMISSOES[k]) permissao.value = MAPA_PERMISSOES[k];
  };

  return wrap;
}

/* IMPORTAÇÃO CSV */
function processarCSV(tipo, texto) {
  const linhas = texto.split("\n").slice(1);
  const container = document.getElementById(listas[tipo]);

  linhas.forEach(l => {
    const [u,e,s,p,d] = l.split(";").map(v => v?.trim());
    if (!u) return;

    const c = criarCampo(tipo);
    c.querySelector(".campo-nome").value = u;

    if (tipo === "usuario_web") {
      c.querySelector("input[type=email]").value = e || "x@x";
      c.querySelector(".campo-senha").value = s || "";
      if (p) c.setPermissaoAtalho(p);
    }

    c.querySelector("textarea").value = d || "";
    container.appendChild(c);
  });

  mostrarToast("Importação concluída!");
}

/* TEMPLATE CSV */
window.baixarTemplateUsuarios = function () {
  const csv = [
    "usuario;email;senha;permissao;descricao",
    "joao.silva;joao@empresa.com;Senha@12345;pabx;Administrador",
    "maria.souza;maria@empresa.com;Senha@12345;agente;Agente CC",
    "admin;x@x;Admin@2024!;super_admin;Super Admin"
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "template_usuarios_web.csv";
  a.click();
};
