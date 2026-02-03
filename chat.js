function atualizarSelectDepartamentos(select) {
  if (!select) return;

  const atual = select.value;
  select.innerHTML = `<option value="">Departamento</option>`;

  document
    .querySelectorAll("#listaDepartamentosChat .campo-descricao input")
    .forEach(d => {
      if (d.value) {
        select.add(new Option(d.value, d.value));
      }
    });

  select.value = atual;
}

function limparAtivos(selector) {
  document.querySelectorAll(selector).forEach(el =>
    el.classList.remove("active")
  );
}

/* ========== CONTA ========== */
window.selecionarContaApi = function (el, conta) {
  chatState.conta = conta;

  document.querySelectorAll("#bloco-conta-api .chat-card")
    .forEach(c => c.classList.remove("active"));

  el.classList.add("active");
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

  const departamento = document.createElement("select");
departamento.innerHTML = `<option value="">Departamento (opcional)</option>`;

document
  .querySelectorAll("#listaDepartamentosChat .campo-descricao input")
  .forEach(d => {
    if (d.value) {
      departamento.add(new Option(d.value, d.value));
    }
  });
  
  [
    "Agente Omnichannel",
    "Supervisor Omnichannel",
    "Administrador Omnichannel"
  ].forEach(p => permissoes.add(new Option(p, p)));

  const del = document.createElement("button");
  del.textContent = "✖";
  del.onclick = () => wrap.remove();

  // ✅ AQUI
  wrap.getData = () => ({
    nome: nome.value,
    email: email.value,
    senha: senha.value,
    permissoes: [...permissoes.selectedOptions].map(o => o.value)
  });

  wrap.append(nome, email, senha, permissoes, departamento, del);
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
  
  const departamento = document.createElement("select");
atualizarSelectDepartamentos(departamento);

document.querySelectorAll("#listaDepartamentosChat .campo-descricao input")
  .forEach(d => {
    if (d.value) {
      departamento.add(new Option(d.value, d.value));
    }
  });
  
  wrap.getData = () => ({
    nome: nome.value,
    usuario_voz: usuarioVoz.value
  });

  const del = document.createElement("button");
  del.textContent = "✖";
  del.onclick = () => wrap.remove();

  wrap.append(nome, usuarioVoz, departamento, del);
  return wrap;
}

/* ================= DEPARTAMENTOS CHAT ================= */

window.adicionarDepartamentoChat = function () {
  const lista = document.getElementById("listaDepartamentosChat");
  if (!lista) return;

  lista.appendChild(criarDepartamentoChat());
  
  document.querySelectorAll("#listaUsuariosChat select, #listaAgentesChat select")
  .forEach(s => atualizarSelectDepartamentos(s));

};

function criarDepartamentoChat() {
  const wrap = document.createElement("div");
  wrap.className = "campo-descricao";

  const nome = document.createElement("input");
  nome.placeholder = "Nome do departamento (ex: Suporte, Vendas)";

  const del = document.createElement("button");
  del.textContent = "✖";
  del.onclick = () => wrap.remove();

  wrap.getData = () => ({
    nome: nome.value,
    usuarios: [],
    agentes: []
  });

  wrap.append(nome, del);
  return wrap;
}

window.adicionarDepartamentoChat = function () {
  const lista = document.getElementById("listaDepartamentosChat");
  if (!lista) return;

  lista.appendChild(criarDepartamentoChat());
};

function criarDepartamentoChat() {
  const wrap = document.createElement("div");
  wrap.className = "campo-descricao";

  const linha = document.createElement("div");
  linha.className = "linha-principal";

  const nome = document.createElement("input");
  nome.placeholder = "Nome do departamento";

  const del = document.createElement("button");
  del.textContent = "✖";
  del.onclick = () => wrap.remove();

  linha.append(nome, del);
  wrap.append(linha);

  wrap.getData = () => ({
    nome: nome.value
  });

  return wrap;
}

// ================= DEPARTAMENTOS CHAT =================

window.adicionarDepartamentoChat = function () {
  const container = document.getElementById("listaDepartamentosChat");
  if (!container) return;

  container.appendChild(criarDepartamentoChat());
};

function criarDepartamentoChat() {
  const wrap = document.createElement("div");
  wrap.className = "campo-descricao";

  const linha = document.createElement("div");
  linha.className = "linha-principal";

  const nome = document.createElement("input");
  nome.placeholder = "Nome do departamento";

  const btn = document.createElement("button");
  btn.textContent = "✖";
  btn.onclick = () => wrap.remove();

  linha.append(nome, btn);
  wrap.append(linha);

  wrap.getData = () => ({
    nome: nome.value
  });

  return wrap;
}

document
  .querySelectorAll("#listaUsuariosChat select")
  .forEach(select => {
    const atual = select.value;
    select.innerHTML = `<option value="">Departamento (opcional)</option>`;

    document
      .querySelectorAll("#listaDepartamentosChat .campo-descricao input")
      .forEach(d => {
        if (d.value) {
          select.add(new Option(d.value, d.value));
        }
      });

    select.value = atual;
  });
