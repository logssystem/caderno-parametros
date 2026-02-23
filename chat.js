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
  nome.classList.add("campo-nome");

  const email = document.createElement("input");
  email.type = "email";
  email.placeholder = "E-mail";

  const senha = document.createElement("input");
  senha.placeholder = "Senha";
  senha.classList.add("campo-senha");

  const regras = document.createElement("div");
  validarSenha(senha, regras);
  senha.oninput = () => validarSenha(senha, regras);

  const permissao = document.createElement("select");
  permissao.style.marginTop = "8px";

  const opt0 = new Option("Selecione a permissão (opcional)", "");
  opt0.disabled = true;
  opt0.selected = true;
  permissao.appendChild(opt0);

  [
    "Administrador do Módulo de Omnichannel",
    "Supervisor(a) Omnichannel",
    "Agente Omnichannel"
  ].forEach(p => permissao.add(new Option(p, p)));

  const chkAgente = document.createElement("input");
  chkAgente.type = "checkbox";

  const lbl = document.createElement("label");
  lbl.style.display = "flex";
  lbl.style.alignItems = "center";
  lbl.style.gap = "6px";
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
    permissao: permissao.value || "",
    agente: chkAgente.checked
  });

  chkAgente.onchange = gerarAgentesChatAPartirUsuarios;

  wrap.append(nome, email, senha, regras, permissao, lbl, del);
  lista.appendChild(wrap);

  return wrap;
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
        usuario: data.email,
        senha: data.senha,
        departamentos: []
      });

      wrap.append(nome);
      lista.appendChild(wrap);
    }
  });
}

/* =====================================================
   DEPARTAMENTOS CHAT
   ===================================================== */
window.adicionarDepartamentoChat = function () {
  const lista = document.getElementById("listaDepartamentosChat");
  if (!lista) return;

  const wrap = document.createElement("div");
  wrap.className = "campo-descricao";

  const linhaTopo = document.createElement("div");
  linhaTopo.style.display = "flex";
  linhaTopo.style.gap = "8px";

  const inputNome = document.createElement("input");
  inputNome.placeholder = "Nome do departamento";
  inputNome.style.flex = "1";

  const btnRemover = document.createElement("button");
  btnRemover.textContent = "🗑";
  btnRemover.onclick = () => wrap.remove();

  linhaTopo.append(inputNome, btnRemover);
  wrap.appendChild(linhaTopo);

  const listaAgentes = document.createElement("div");
  listaAgentes.style.marginTop = "8px";

  const btnAdd = document.createElement("button");
  btnAdd.textContent = "+ Adicionar agente";

  btnAdd.onclick = () => {
    const linha = document.createElement("div");
    linha.style.display = "flex";
    linha.style.gap = "6px";

    const select = document.createElement("select");
    select.innerHTML = `<option value="">Selecione um agente</option>`;

    document.querySelectorAll("#listaAgentesChat .campo-descricao").forEach(a => {
      const d = a.getData?.();
      if (d?.nome) select.add(new Option(d.nome, d.nome));
    });

    const del = document.createElement("button");
    del.textContent = "✖";
    del.onclick = () => linha.remove();

    linha.append(select, del);
    listaAgentes.appendChild(linha);
  };

  wrap.getData = () => {
    const agentes = [];
    listaAgentes.querySelectorAll("select").forEach(s => {
      if (s.value) agentes.push(s.value);
    });
    return { nome: inputNome.value.trim(), agentes };
  };

  wrap.append(listaAgentes, btnAdd);
  lista.appendChild(wrap);
};

/* =====================================================
   SENHA – PADRÃO PABX
   ===================================================== */
function validarSenha(input, regrasEl) {
  const v = input.value || "";

  if (!v.length) {
    regrasEl.innerHTML =
      `<div class="regra-neutra">Mín. 11 | Maiúscula | Número | Especial</div>`;
    return false;
  }

  const ok =
    v.length >= 11 &&
    /[A-Z]/.test(v) &&
    /\d/.test(v) &&
    /[^A-Za-z0-9]/.test(v);

  regrasEl.innerHTML = ok
    ? `<div class="regra-ok">Senha válida</div>`
    : `<div class="regra-erro">Mín. 11 | Maiúscula | Número | Especial</div>`;

  return ok;
}

/* =====================================================
   🔥 COLETA FINAL – ÚNICA PARTE AJUSTADA 🔥
   ===================================================== */
window.coletarChatDoDOM = function () {
  const chat = {
    tipo: window.chatState?.tipo || null,
    api: window.chatState?.api || null,
    conta: window.chatState?.conta || null,
    canais: window.chatState?.canais || [],
    usuarios: [],
    agentes: [],
    departamentos: []
  };

  document
    .querySelectorAll("#listaUsuariosChat .campo-descricao")
    .forEach(u => {
      const d = u.getData?.();
      if (d && d.nome) chat.usuarios.push(d);
    });

  document
    .querySelectorAll("#listaAgentesChat .campo-descricao")
    .forEach(a => {
      const d = a.getData?.();
      if (d && d.nome) chat.agentes.push(d);
    });

  document
    .querySelectorAll("#listaDepartamentosChat .campo-descricao")
    .forEach(d => {
      const data = d.getData?.();
      if (data && data.nome) chat.departamentos.push(data);
    });

  return chat;
};

/* =====================================================
   ALIASES DE COMPATIBILIDADE – IMPORTAÇÃO CSV CHAT
   (NÃO REMOVER)
   ===================================================== */

// nome oficial
window.acionarImportacaoUsuariosChat =
  window.acionarImportacaoUsuariosChat || function () {
    console.error("Função principal de importação não encontrada");
  };

// aliases para HTML antigo / typo
window.acionarImporttacaoUsuariosChat =
  window.acionarImportacaoUsuariosChat;

window.acionarImportacaoUsuarioChat =
  window.acionarImportacaoUsuariosChat;

window.acionarImportacaoUsuarios =
  window.acionarImportacaoUsuariosChat;

console.log("✅ Aliases de importação CSV Chat registrados");
