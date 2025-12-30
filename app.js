console.log("APP.JS RESTAURADO E FUNCIONAL");

const LIMITE = 600;

const listas = {
  usuario_web: "listaUsuariosWeb",
  ramal: "listaRings",
  entrada: "listaEntradas",
  ura: "listaURAs",
  fila: "listaFilas",
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

window.adicionarCampo = function(tipo) {
  const container = document.getElementById(listas[tipo]);
  if (!container || container.children.length >= LIMITE) return;

  const wrap = document.createElement("div");
  wrap.className = "campo-descricao";

  const linha = document.createElement("div");
  linha.className = "linha-principal";

  const nome = document.createElement("input");
  nome.placeholder = `Digite ${tipo.replace("_", " ")}`;

  const btn = document.createElement("button");
  btn.textContent = "✖";
  btn.onclick = () => wrap.remove();

  linha.append(nome, btn);
  wrap.append(linha);

  if (tipo === "usuario_web") {
    const senha = document.createElement("input");
    senha.className = "campo-senha";
    senha.placeholder = "Senha";

    const perm = document.createElement("select");
    perm.className = "campo-permissao";
    PERMISSOES.forEach(p => perm.add(new Option(p, p)));

    const regras = document.createElement("div");

    senha.oninput = () => {
      regras.innerHTML = "";
      senha.classList.remove("senha-invalida");

      if (senha.value.length < 11) return erro("Mínimo 11 caracteres");
      if (!/[A-Z]/.test(senha.value)) return erro("1 letra maiúscula");
      if (!/\d/.test(senha.value)) return erro("1 número");
      if (!/[^A-Za-z0-9]/.test(senha.value)) return erro("1 caractere especial");

      regras.innerHTML = `<div class="regra-ok">Senha segura</div>`;
    };

    function erro(msg) {
      senha.classList.add("senha-invalida");
      regras.innerHTML = `<div class="regra-erro">${msg}</div>`;
    }

    wrap.append(senha, perm, regras);
  }

  const desc = document.createElement("textarea");
  desc.placeholder = "Descrição (opcional)";
  wrap.append(desc);

  container.appendChild(wrap);
};

window.explorar = function() {
  const dados = {};
  Object.keys(listas).forEach(k => {
    dados[k] = [...document.getElementById(listas[k]).children].map(c => ({
      nome: c.querySelector("input")?.value || ""
    }));
  });

  document.getElementById("resultado").textContent =
    JSON.stringify(dados, null, 2);
};

function mostrarToast(msg, error=false) {
  const t = document.getElementById("toastGlobal");
  document.getElementById("toastMessage").textContent = msg;
  t.className = "toast show" + (error ? " error" : "");
  setTimeout(() => t.classList.remove("show"), 4000);
}

function fecharToast() {
  document.getElementById("toastGlobal").classList.remove("show");
}

/* TEMA */
const toggleTheme = document.getElementById("toggleTheme");
const saved = localStorage.getItem("theme");
if (saved === "dark") document.body.classList.add("dark");

toggleTheme.onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
};
