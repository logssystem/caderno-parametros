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
   PROCESSAMENTO CSV – USUÁRIOS CHAT
   ===================================================== */
function processarCSVUsuariosChat(texto) {
  const linhas = texto.replace(/\r/g, "").split("\n").filter(l => l.trim());
  if (linhas.length < 2) return;

  const sep = linhas[0].includes(";") ? ";" : ",";
  const headers = linhas.shift().split(sep).map(h => h.trim().toLowerCase());

  linhas.forEach(linha => {
    const valores = linha.split(sep);
    const row = {};
    headers.forEach((h, i) => row[h] = (valores[i] || "").trim());
    if (!row.usuario) return;

    const existe = [...document.querySelectorAll("#listaUsuariosChat .campo-nome")]
      .some(i => i.value === row.usuario);
    if (existe) return;

    const wrap = adicionarUsuarioChat();
    wrap.querySelector(".campo-nome").value = row.usuario;
    wrap.querySelector("input[type=email]").value = row.email || "";
    wrap.querySelector(".campo-senha").value = row.senha || "";

    if (row.agente?.toLowerCase() === "sim") {
      wrap.querySelector("input[type=checkbox]").checked = true;
    }
  });

  gerarAgentesChatAPartirUsuarios();
}

/* =====================================================
   AGENTES CHAT (GERADOS DOS USUÁRIOS)
   ===================================================== */
function gerarAgentesChatAPartirUsuarios() {
  const lista = document.getElementById("listaAgentesChat");
  if (!lista) return;

  lista.innerHTML = "";

  document.querySelectorAll("#listaUsuariosChat .campo-descricao").forEach(u => {
    const d = u.getData?.();
    if (!d?.agente || !d.nome) return;

    const wrap = document.createElement("div");
    wrap.className = "campo-descricao";

    const nome = document.createElement("input");
    nome.value = d.nome;
    nome.disabled = true;

    wrap.getData = () => ({
      nome: d.nome,
      usuario: d.email,
      senha: d.senha,
      departamentos: []
    });

    wrap.append(nome);
    lista.appendChild(wrap);
  });
}

/* =====================================================
   DEPARTAMENTOS CHAT (AJUSTADO)
   ===================================================== */
window.adicionarDepartamentoChat = function () {
  const lista = document.getElementById("listaDepartamentosChat");
  if (!lista) return;

  const wrap = document.createElement("div");
  wrap.className = "campo-descricao";

  const topo = document.createElement("div");
  topo.style.display = "flex";
  topo.style.gap = "8px";

  const inputNome = document.createElement("input");
  inputNome.placeholder = "Nome do departamento";
  inputNome.style.flex = "1";

  const btnRemover = document.createElement("button");
  btnRemover.textContent = "🗑";
  btnRemover.onclick = () => wrap.remove();

  topo.append(inputNome, btnRemover);
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
    select.innerHTML = `<option value="">Selecione um agente</option>`;

    document
      .querySelectorAll("#listaAgentesChat .campo-descricao")
      .forEach(a => {
        const d = a.getData?.();
        if (!d?.nome) return;

        const opt = document.createElement("option");
        opt.value = d.nome;
        opt.textContent = d.nome;
        select.appendChild(opt);
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
   SINCRONIZAR DEPARTAMENTOS NOS AGENTES
   (Departamento é a fonte da verdade)
   ===================================================== */
const mapaAgenteDepartamentos = {};

// percorre departamentos e monta mapa agente -> departamentos
chat.departamentos.forEach(dep => {
  if (!dep.nome || !Array.isArray(dep.agentes)) return;

  dep.agentes.forEach(nomeAgente => {
    if (!mapaAgenteDepartamentos[nomeAgente]) {
      mapaAgenteDepartamentos[nomeAgente] = [];
    }
    mapaAgenteDepartamentos[nomeAgente].push(dep.nome);
  });
});

// aplica departamentos nos agentes
chat.agentes = chat.agentes.map(ag => ({
  ...ag,
  departamentos: mapaAgenteDepartamentos[ag.nome] || []
}));

/* =====================================================
   COLETA FINAL CHAT
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

  document.querySelectorAll("#listaUsuariosChat .campo-descricao")
    .forEach(u => {
      const d = u.getData?.();
      if (d?.nome) chat.usuarios.push(d);
    });

  document.querySelectorAll("#listaAgentesChat .campo-descricao")
    .forEach(a => {
      const d = a.getData?.();
      if (d?.nome) chat.agentes.push(d);
    });

  document.querySelectorAll("#listaDepartamentosChat .campo-descricao")
    .forEach(dep => {
      const d = dep.getData?.();
      if (d?.nome) chat.departamentos.push(d);
    });

  return chat;
};

/* =====================================================
   COMPATIBILIDADE – IMPORTAÇÃO CSV CHAT
   ===================================================== */
window.acionarImportacaoUsuariosChat = function () {
  const input = document.getElementById("importUsuariosChat");
  if (!input) return;

  input.value = "";
  input.click();

  input.onchange = () => {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => processarCSVUsuariosChat(e.target.result);
    reader.readAsText(file);
  };
};

window.acionarImportacaoUsuariosChatCSV = window.acionarImportacaoUsuariosChat;
window.importarUsuariosChat = window.acionarImportacaoUsuariosChat;
window.importarUsuariosChatCSV = window.acionarImportacaoUsuariosChat;
window.processarCSVUsuariosChat = processarCSVUsuariosChat;

console.log("✅ Chat.js carregado sem erros");
