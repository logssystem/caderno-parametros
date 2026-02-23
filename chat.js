console.log("CHAT.JS FINAL – ESTÁVEL (STATE ÚNICO COESO)");

/* =====================================================
   STATE ÚNICO DO CHAT (FONTE DA VERDADE)
   ===================================================== */
window.chatState = window.chatState || {
  tipo: null,
  api: null,
  conta: null,
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
  nome.className = "campo-nome";

  const email = document.createElement("input");
  email.type = "email";
  email.placeholder = "E-mail";

  const senha = document.createElement("input");
  senha.placeholder = "Senha";
  senha.className = "campo-senha";

  const regras = document.createElement("div");
  validarSenha(senha, regras);
  senha.oninput = () => validarSenha(senha, regras);

  const permissao = document.createElement("select");
  permissao.append(new Option("Selecione a permissão (opcional)", ""));
  [
    "Administrador do Módulo de Omnichannel",
    "Supervisor(a) Omnichannel",
    "Agente Omnichannel"
  ].forEach(p => permissao.add(new Option(p, p)));

  const chkAgente = document.createElement("input");
  chkAgente.type = "checkbox";

  const lbl = document.createElement("label");
  lbl.style.display = "flex";
  lbl.style.gap = "6px";
  lbl.append(chkAgente, document.createTextNode(" Este usuário é agente omnichannel"));

  const del = document.createElement("button");
  del.textContent = "✖";
  del.onclick = () => {
    wrap.remove();
    syncChatStateFromDOM();
  };

  wrap.getData = () => ({
    nome: nome.value.trim(),
    email: email.value.trim(),
    senha: senha.value,
    permissao: permissao.value || "",
    agente: chkAgente.checked
  });

  chkAgente.onchange = syncChatStateFromDOM;

  wrap.append(nome, email, senha, regras, permissao, lbl, del);
  lista.appendChild(wrap);

  syncChatStateFromDOM();
};

/* =====================================================
   DEPARTAMENTOS CHAT
   ===================================================== */
window.adicionarDepartamentoChat = function () {
  const lista = document.getElementById("listaDepartamentosChat");
  if (!lista) return;

  const wrap = document.createElement("div");
  wrap.className = "campo-descricao";

  const topo = document.createElement("div");
  topo.style.display = "flex";
  topo.style.gap = "8px";

  const nome = document.createElement("input");
  nome.placeholder = "Nome do departamento";
  nome.style.flex = "1";

  const del = document.createElement("button");
  del.textContent = "🗑";
  del.onclick = () => {
    wrap.remove();
    syncChatStateFromDOM();
  };

  topo.append(nome, del);
  wrap.appendChild(topo);

  const listaAgentes = document.createElement("div");
  listaAgentes.style.marginTop = "8px";

  const btnAdd = document.createElement("button");
  btnAdd.textContent = "+ Adicionar agente";
  btnAdd.onclick = () => {
    const linha = document.createElement("div");
    linha.style.display = "flex";
    linha.style.gap = "6px";

    const select = document.createElement("select");
    select.append(new Option("Selecione um agente", ""));

    window.chatState.agentes.forEach(a =>
      select.add(new Option(a.nome, a.nome))
    );

    select.onchange = syncChatStateFromDOM;

    const x = document.createElement("button");
    x.textContent = "✖";
    x.onclick = () => {
      linha.remove();
      syncChatStateFromDOM();
    };

    linha.append(select, x);
    listaAgentes.appendChild(linha);
  };

  wrap.getData = () => {
    const agentes = [];
    listaAgentes.querySelectorAll("select").forEach(s => {
      if (s.value) agentes.push(s.value);
    });
    return { nome: nome.value.trim(), agentes };
  };

  wrap.append(listaAgentes, btnAdd);
  lista.appendChild(wrap);

  syncChatStateFromDOM();
};

/* =====================================================
   SINCRONIZAÇÃO ÚNICA E DEFINITIVA
   ===================================================== */
function syncChatStateFromDOM() {
  window.chatState.usuarios = [];
  window.chatState.agentes = [];
  window.chatState.departamentos = [];

  // usuários
  document.querySelectorAll("#listaUsuariosChat .campo-descricao").forEach(u => {
    const d = u.getData?.();
    if (d?.nome) window.chatState.usuarios.push(d);
  });

  // agentes (derivados dos usuários)
  window.chatState.usuarios.forEach(u => {
    if (u.agente) {
      window.chatState.agentes.push({
        nome: u.nome,
        usuario: u.email,
        departamentos: []
      });
    }
  });

  // departamentos
  document.querySelectorAll("#listaDepartamentosChat .campo-descricao").forEach(d => {
    const dep = d.getData?.();
    if (!dep?.nome) return;

    window.chatState.departamentos.push(dep);

    dep.agentes.forEach(nomeAgente => {
      const ag = window.chatState.agentes.find(a => a.nome === nomeAgente);
      if (ag && !ag.departamentos.includes(dep.nome)) {
        ag.departamentos.push(dep.nome);
      }
    });
  });

  console.log("✅ chatState sincronizado:", window.chatState);
}

/* =====================================================
   SENHA – PADRÃO PABX
   ===================================================== */
function validarSenha(input, regrasEl) {
  const v = input.value || "";
  if (!v.length) {
    regrasEl.innerHTML =
      `<div class="regra-neutra">Mín. 11 | Maiúscula | Número | Especial</div>`;
    return;
  }

  const ok =
    v.length >= 11 &&
    /[A-Z]/.test(v) &&
    /\d/.test(v) &&
    /[^A-Za-z0-9]/.test(v);

  regrasEl.innerHTML = ok
    ? `<div class="regra-ok">Senha válida</div>`
    : `<div class="regra-erro">Mín. 11 | Maiúscula | Número | Especial</div>`;
}

/* =====================================================
   COLETA FINAL (USADA PELO app.js)
   ===================================================== */
window.coletarChatDoDOM = function () {
  syncChatStateFromDOM();
  return window.chatState;
};
