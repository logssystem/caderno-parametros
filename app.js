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

  const placeholders = {
    usuario_web: "Digite o nome do usuário",
    ura: "Digite o nome da sua URA",
    entrada: "Digite o número de entrada",
    fila: "Digite o nome da sua fila",
    ring: "Digite o número do ramal",
    grupo_ring: "Digite o nome do grupo de ring",
    agente: "Digite o nome do agente"
  };

  nome.placeholder = placeholders[tipo] || "Digite o nome";
  nome.className = "campo-nome";
  nome.style.width = "100%";

  const btn = document.createElement("button");
  btn.textContent = "✖";
  btn.onclick = () => wrap.remove();

  linhaNome.append(nome, btn);
  wrap.append(linhaNome);

  let emailInput = null;
  let senhaInput = null;
  let permissao = null;
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
    senhaInput.className = "campo-senha";

    linhaCred.append(emailInput, senhaInput);
    wrap.append(linhaCred);

    permissao = document.createElement("select");
    permissao.innerHTML = `<option value="">Selecione a permissão</option>`;
    PERMISSOES.forEach(p => permissao.add(new Option(p, p)));
    wrap.append(permissao);

    chkAgente = document.createElement("input");
    chkAgente.type = "checkbox";

    const box = document.createElement("label");
    box.style.display = "flex";
    box.style.gap = "6px";
    box.style.marginTop = "8px";
    box.append(chkAgente, document.createTextNode(" Este usuário é agente de call center"));
    wrap.append(box);
  }

  /* ===== FILA ===== */
  if (tipo === "fila") {

    wrap.dataset.agentes = "[]";

    const select = document.createElement("select");
    select.innerHTML = `<option value="">Selecione um agente</option>`;
    select.style.marginTop = "12px";

    const btnAdd = document.createElement("button");
    btnAdd.textContent = "Adicionar agente";

    const lista = document.createElement("div");
    lista.style.marginTop = "10px";

    btnAdd.onclick = () => {
      if (!select.value) return;
      let agentes = JSON.parse(wrap.dataset.agentes || "[]");
      if (!agentes.includes(select.value)) {
        agentes.push(select.value);
        wrap.dataset.agentes = JSON.stringify(agentes);
        render();
      }
    };

    function render() {
      lista.innerHTML = "";
      JSON.parse(wrap.dataset.agentes).forEach(nome => {
        const d = document.createElement("div");
        d.textContent = nome;
        lista.appendChild(d);
      });
    }

    wrap.atualizarFilaAgentes = () => {
      select.innerHTML = `<option value="">Selecione um agente</option>`;
      document.querySelectorAll("#listaAgentes .campo-nome")
        .forEach(i => select.add(new Option(i.value, i.value)));
    };

    wrap.append(select, btnAdd, lista);
  }

  wrap.getNome = () => nome.value;
  wrap.getEmail = () => emailInput?.value || "";
  wrap.getSenha = () => senhaInput?.value || "";
  wrap.getPermissao = () => permissao?.value || "";
  wrap.isAgente = () => chkAgente?.checked || false;

  return wrap;
}

/* ================= AGENTES AUTOMÁTICOS ================= */

function gerarAgentesAPartirUsuarios() {
  const lista = document.getElementById("listaAgentes");
  if (!lista) return;

  lista.innerHTML = "";

  document.querySelectorAll("#listaUsuariosWeb .campo-descricao").forEach(u => {
    if (u.isAgente() && u.getNome()) {
      const wrap = document.createElement("div");
      wrap.className = "campo-descricao";
      const input = document.createElement("input");
      input.className = "campo-nome";
      input.value = u.getNome();
      input.disabled = true;
      wrap.append(input);
      lista.append(wrap);
    }
  });

  document.querySelectorAll("#listaFilas .campo-descricao")
    .forEach(f => f.atualizarFilaAgentes?.());
}

document.addEventListener("change", e => {
  if (e.target.closest("#listaUsuariosWeb")) gerarAgentesAPartirUsuarios();
});

/* ================= VALIDAÇÃO ================= */

function validarCenarioAntesDoJSON() {
  const erros = [];

  document.querySelectorAll("#listaUsuariosWeb .campo-descricao").forEach((u, i) => {
    if (!u.getNome()) erros.push(`Usuário ${i+1}: nome vazio`);
    if (!u.getEmail()) erros.push(`Usuário ${i+1}: e-mail vazio`);
    if (!u.getSenha()) erros.push(`Usuário ${i+1}: senha vazia`);
    if (!u.getPermissao()) erros.push(`Usuário ${i+1}: permissão não definida`);
  });

  document.querySelectorAll("#listaFilas .campo-descricao").forEach((f, i) => {
    if (!f.getNome()) erros.push(`Fila ${i+1}: nome vazio`);
    if (!JSON.parse(f.dataset.agentes || "[]").length)
      erros.push(`Fila ${i+1}: sem agentes`);
  });

  if (erros.length) {
    console.error("VALIDAÇÃO:", erros);
    mostrarToast(erros[0], true);
    return false;
  }

  return true;
}

/* ================= GERAR JSON ================= */

window.explorar = function () {
  try {

    if (!validarCenarioAntesDoJSON()) return;

    const usuarios = [...document.querySelectorAll("#listaUsuariosWeb .campo-descricao")].map(u => ({
      nome: u.getNome(),
      email: u.getEmail(),
      senha: u.getSenha(),
      permissao: u.getPermissao(),
      agente: u.isAgente()
    }));

    const agentes = [...document.querySelectorAll("#listaAgentes .campo-descricao")]
      .map(a => ({ nome: a.querySelector(".campo-nome").value }));

    const filas = [...document.querySelectorAll("#listaFilas .campo-descricao")]
      .map(f => ({
        nome: f.getNome(),
        agentes: JSON.parse(f.dataset.agentes || "[]")
      }));

    const dados = { voz: { usuarios, agentes, filas } };

    document.getElementById("resultado").textContent =
      JSON.stringify(dados, null, 2);

    mostrarToast("JSON gerado com sucesso!");

  } catch (e) {
    console.error("ERRO JSON:", e);
    mostrarToast("Erro ao gerar JSON", true);
  }
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
