console.log("CHAT.JS FINAL – ESTÁVEL (USUÁRIOS + AGENTES + DEPARTAMENTOS)");

/* =====================================================
   STATE ÚNICO DO CHAT
   ===================================================== */
window.chatState = window.chatState || {
  tipo: "",
  api: "",
  conta: "",
  canais: [],
  usuarios: [],
  agentes: [],
  departamentos: []
};

/* =====================================================
   USUÁRIOS CHAT
   ===================================================== */
window.adicionarUsuarioChat = function () {
  const lista = document.getElementById("listaUsuariosChat");
  if (!lista) return;

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
  validarSenha(senha, regras);
  senha.oninput = () => validarSenha(senha, regras);

  const chkAgente = document.createElement("input");
  chkAgente.type = "checkbox";

  const lbl = document.createElement("label");
  lbl.append(chkAgente, document.createTextNode(" Este usuário é agente omnichannel"));

  const del = document.createElement("button");
  del.textContent = "✖";
  del.onclick = () => {
    wrap.remove();
    gerarAgentesChatAPartirUsuarios();
  };

  wrap.getData = () => ({
    nome: nome.value.trim(),
    email: email.value.trim(),
    senha: senha.value,
    agente: chkAgente.checked
  });

  chkAgente.onchange = gerarAgentesChatAPartirUsuarios;

  wrap.append(nome, email, senha, regras, lbl, del);
  lista.appendChild(wrap);
};

/* =====================================================
   AGENTES CHAT (GERADOS DOS USUÁRIOS)
   ===================================================== */
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

      wrap.getData = () => ({
        nome: data.nome,
        usuarioId: data.nome // padrão simples (login = nome)
      });

      wrap.append(nome);
      lista.appendChild(wrap);
    }
  });
}

/* =====================================================
   DEPARTAMENTOS CHAT (MODELO PABX – FINAL)
   ===================================================== */
window.adicionarDepartamentoChat = function () {
  const lista = document.getElementById("listaDepartamentosChat");
  if (!lista) return;

  const wrap = document.createElement("div");
  wrap.className = "campo-descricao";

  const inputNome = document.createElement("input");
  inputNome.placeholder = "Nome do departamento";

  const listaAgentes = document.createElement("div");
  listaAgentes.style.marginTop = "8px";

  const btnAddAgente = document.createElement("button");
  btnAddAgente.textContent = "+ Adicionar agente";
  btnAddAgente.className = "btn-add";
  btnAddAgente.style.marginTop = "6px";

  btnAddAgente.onclick = () => {
    const linha = document.createElement("div");
    linha.style.display = "flex";
    linha.style.gap = "6px";
    linha.style.marginTop = "4px";

    const select = document.createElement("select");
    select.innerHTML = `<option value="">Selecione um agente</option>`;

    document
      .querySelectorAll("#listaAgentesChat .campo-descricao")
      .forEach(a => {
        if (a.getData) {
          const d = a.getData();
          if (d?.nome) {
            select.add(new Option(d.nome, d.nome));
          }
        }
      });

    const remover = document.createElement("button");
    remover.textContent = "✖";
    remover.onclick = () => linha.remove();

    linha.append(select, remover);
    listaAgentes.appendChild(linha);
  };

  wrap.getData = () => {
    const agentes = [];
    listaAgentes.querySelectorAll("select").forEach(s => {
      if (s.value) agentes.push(s.value);
    });

    return {
      nome: inputNome.value.trim(),
      agentes
    };
  };

  wrap.append(inputNome, listaAgentes, btnAddAgente);
  lista.appendChild(wrap);
};

/* =====================================================
   SENHA – MESMO PADRÃO DO PABX
   ===================================================== */
function validarSenha(input, regrasEl) {
  const v = input.value || "";

  if (!v.length) {
    regrasEl.innerHTML =
      `<div class="regra-neutra">Mín. 11 | Maiúscula | Número | Especial</div>`;
    input.classList.remove("campo-obrigatorio-erro");
    return false;
  }

  const ok =
    v.length >= 11 &&
    /[A-Z]/.test(v) &&
    /[a-z]/.test(v) &&
    /\d/.test(v) &&
    /[^A-Za-z0-9]/.test(v);

  regrasEl.innerHTML = ok
    ? `<div class="regra-ok">Senha válida</div>`
    : `<div class="regra-erro">Mín. 11 | Maiúscula | Número | Especial</div>`;

  input.classList.toggle("campo-obrigatorio-erro", !ok);
  return ok;
}

/* =====================================================
   COLETA FINAL PARA O JSON (USADO PELO app.js)
   ===================================================== */
window.coletarChatDoDOM = function () {
  const usuarios = [];
  const agentes = [];
  const departamentos = [];

  document.querySelectorAll("#listaUsuariosChat .campo-descricao").forEach(u => {
    if (u.getData) usuarios.push(u.getData());
  });

  document.querySelectorAll("#listaAgentesChat .campo-descricao").forEach(a => {
    if (a.getData) agentes.push(a.getData());
  });

  document.querySelectorAll("#listaDepartamentosChat .campo-descricao").forEach(d => {
    if (d.getData) departamentos.push(d.getData());
  });

  window.chatState.usuarios = usuarios;
  window.chatState.agentes = agentes;
  window.chatState.departamentos = departamentos;

  return window.chatState;
};
