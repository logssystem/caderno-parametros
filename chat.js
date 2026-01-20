const chatState = {
  tipo: null,
  api: null,
  conta: null,
  canais: []
};

function limparAtivos(selector) {
  document.querySelectorAll(selector).forEach(el =>
    el.classList.remove("active")
  );
}

/* ========== TIPO DE CHAT ========== */
window.selecionarTipoChat = function (el, tipo) {
  chatState.tipo = tipo;

  limparAtivos(".chat-section:first-of-type .chat-card");
  el.classList.add("active");

  document.getElementById("api-oficial").style.display = tipo === "api" ? "block" : "none";
  document.getElementById("chat-canais").style.display = tipo === "api" ? "block" : "none";
  document.getElementById("chat-qr").style.display = tipo === "qr" ? "block" : "none";

  const blocoConta = document.getElementById("bloco-conta-api");
  if (blocoConta) blocoConta.style.display = tipo === "api" ? "block" : "none";

  chatState.api = null;
  chatState.conta = null;
  chatState.canais = [];

  limparAtivos("#api-oficial .chat-card");
  limparAtivos("#bloco-conta-api .chat-card");
  limparAtivos("#chat-canais .chat-card");
};

/* ========== API ========== */
window.selecionarContaApi = function (el, conta) {
  chatState.conta = conta;

  document.querySelectorAll("#bloco-conta-api .chat-card")
    .forEach(c => c.classList.remove("active"));

  el.classList.add("active");
};

/* ========== CONTA ========== */
window.selecionarContaApi = function (el, conta) {
  chatState.conta = conta;

  document.querySelectorAll("#bloco-conta-api .chat-card")
    .forEach(c => c.classList.remove("active"));

  el.classList.add("active");
};

/* ========== CANAIS ========== */
window.toggleCanal = function (el) {
  el.classList.toggle("active");

  const canal = el.dataset.canal;

  if (!chatState.canais) chatState.canais = [];

  if (el.classList.contains("active")) {
    if (!chatState.canais.includes(canal)) {
      chatState.canais.push(canal);
    }
  } else {
    chatState.canais = chatState.canais.filter(c => c !== canal);
  }
};

window.adicionarUsuarioChat = function () {
  const lista = document.getElementById("listaUsuariosChat");
  if (!lista) return;

  lista.appendChild(criarUsuarioChat());
};

function criarUsuarioChat() {
  const wrap = document.createElement("div");
  wrap.className = "campo-descricao";

  const nome = document.createElement("input");
  nome.placeholder = "Nome do usuário";

  const email = document.createElement("input");
  email.placeholder = "E-mail";

  const senha = document.createElement("input");
  senha.placeholder = "Senha";

  const permissoes = document.createElement("select");
  permissoes.multiple = true;

  [
    "Agente Omnichannel",
    "Supervisor Omnichannel",
    "Administrador Omnichannel"
  ].forEach(p => permissoes.add(new Option(p, p)));

  const del = document.createElement("button");
  del.textContent = "✖";
  del.onclick = () => wrap.remove();

  wrap.getData = () => ({
    nome: nome.value,
    email: email.value,
    senha: senha.value,
    permissoes: [...permissoes.selectedOptions].map(o => o.value)
  });

  wrap.append(nome, email, senha, permissoes, del);
  return wrap;
}

window.adicionarAgenteChat = function () {
  const lista = document.getElementById("listaAgentesChat");
  if (!lista) return;

  lista.appendChild(criarAgenteChat());
};

function criarAgenteChat() {
  const wrap = document.createElement("div");
  wrap.className = "campo-descricao";

  const nome = document.createElement("input");
  nome.placeholder = "Nome do agente";

  const usuarioVoz = document.createElement("select");
  usuarioVoz.innerHTML = `<option value="">Vincular a usuário da voz (opcional)</option>`;

  document.querySelectorAll("#listaUsuariosWeb .campo-descricao .campo-nome")
    .forEach(u => {
      usuarioVoz.add(new Option(u.value, u.value));
    });

  wrap.getData = () => ({
    nome: nome.value,
    usuario_voz: usuarioVoz.value
  });

  const del = document.createElement("button");
  del.textContent = "✖";
  del.onclick = () => wrap.remove();

  wrap.append(nome, usuarioVoz, del);
  return wrap;
}
