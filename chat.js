/* ================= DEPARTAMENTOS CHAT ================= */

function atualizarSelectDepartamentosChat(select) {
  if (!select) return;

  const atual = select.value;
  select.innerHTML = `<option value="">Departamento (opcional)</option>`;

  document
    .querySelectorAll("#listaDepartamentosChat .campo-descricao input")
    .forEach(d => {
      if (d.value) select.add(new Option(d.value, d.value));
    });

  select.value = atual;
}

window.adicionarDepartamentoChat = function () {
  const lista = document.getElementById("listaDepartamentosChat");
  if (!lista) return;

  lista.appendChild(criarDepartamentoChat());

  document
    .querySelectorAll("#listaUsuariosChat select, #listaAgentesChat select")
    .forEach(s => atualizarSelectDepartamentosChat(s));
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

/* ================= USUÁRIOS CHAT ================= */

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
  email.type = "email";
  email.placeholder = "E-mail";

  const senha = document.createElement("input");
  senha.placeholder = "Senha";
  senha.classList.add("campo-senha");

  const regras = document.createElement("div");
  senha.oninput = () => validarSenha(senha, regras);

  const permissoes = document.createElement("select");
  permissoes.multiple = true;

  ["Agente Omnichannel","Supervisor Omnichannel","Administrador Omnichannel"]
    .forEach(p => permissoes.add(new Option(p, p)));

  const chkAgente = document.createElement("input");
  chkAgente.type = "checkbox";

  const lbl = document.createElement("label");
  lbl.append(chkAgente, document.createTextNode(" Este usuário é agente omnichannel"));

  const departamento = document.createElement("select");
  atualizarSelectDepartamentosChat(departamento);

  chkAgente.onchange = gerarAgentesChatAPartirUsuarios;

  const del = document.createElement("button");
  del.textContent = "✖";
  del.onclick = () => {
    wrap.remove();
    gerarAgentesChatAPartirUsuarios();
  };

  wrap.getData = () => ({
    nome: nome.value,
    email: email.value,
    senha: senha.value,
    permissoes: [...permissoes.selectedOptions].map(o => o.value),
    agente: chkAgente.checked,
    departamento: departamento.value
  });

  wrap.append(
    nome,
    email,
    senha,
    regras,
    permissoes,
    lbl,
    departamento,
    del
  );

  return wrap;
}

/* ================= AGENTES CHAT (AUTO) ================= */

function gerarAgentesChatAPartirUsuarios() {
  const lista = document.getElementById("listaAgentesChat");
  if (!lista) return;

  lista.innerHTML = "";

  document.querySelectorAll("#listaUsuariosChat .campo-descricao").forEach(u => {
    const data = u.getData?.();
    if (data?.agente && data.nome) {
      const wrap = document.createElement("div");
      wrap.className = "campo-descricao";

      const nome = document.createElement("input");
      nome.value = data.nome;
      nome.disabled = true;

      const departamento = document.createElement("select");
      atualizarSelectDepartamentosChat(departamento);
      departamento.value = data.departamento || "";

      wrap.getData = () => ({
        nome: data.nome,
        departamento: departamento.value
      });

      wrap.append(nome, departamento);
      lista.append(wrap);
    }
  });
}

function validarSenha(input, regrasEl) {
  const v = input.value;

  const temTamanho = v.length >= 11;
  const temMaiuscula = /[A-Z]/.test(v);
  const temMinuscula = /[a-z]/.test(v);
  const temNumero = /\d/.test(v);
  const temEspecial = /[^A-Za-z0-9]/.test(v);

  const ok =
    temTamanho &&
    temMaiuscula &&
    temMinuscula &&
    temNumero &&
    temEspecial;

  if (regrasEl) {
    regrasEl.innerHTML = ok
      ? `<div class="regra-ok">Senha válida</div>`
      : `<div class="regra-erro">
          Mín. 11 caracteres<br>
          1 letra maiúscula<br>
          1 letra minúscula<br>
          1 número<br>
          1 caractere especial
        </div>`;
  }

  input.classList.toggle("campo-obrigatorio-erro", !ok);

  return ok;
}
