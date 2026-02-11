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

  // ===== PERMISSÃO (MANUAL – PADRÃO PABX) =====
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

  // 🔹 DADOS PARA SALVAR
  wrap.getData = () => ({
    nome: nome.value.trim(),
    email: email.value.trim(),
    senha: senha.value,
    permissao: permissao.value || "",
    agente: chkAgente.checked
  });

  chkAgente.onchange = gerarAgentesChatAPartirUsuarios;

  wrap.append(
    nome,
    email,
    senha,
    regras,
    permissao,
    lbl,
    del
  );

  lista.appendChild(wrap);

  return wrap; // 🔴 ESSENCIAL para importação CSV
};

/* ================= TEMPLATE CSV – USUÁRIOS CHAT (PADRÃO PABX) ================= */

window.baixarTemplateUsuariosChat = function () {
  const csv = [
    "usuario;email;senha;permissao;agente;;;;permissoes_disponiveis",
    "teste;teste@empresa.com;Senha@12345;Agente Omnichannel;sim;;;;",
    ";;;;;;;;;Administrador do Modulo de Omnichannel",
    ";;;;;;;;;Supervisor(a) Omnichannel",
    ";;;;;;;;;Agente Omnichannel"
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "template_usuarios_chat.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
};

/* ================= IMPORTAÇÃO CSV USUÁRIOS CHAT ================= */

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

function processarCSVUsuariosChat(texto) {
  const linhas = texto.replace(/\r/g, "").split("\n").filter(l => l.trim());
  if (linhas.length < 2) return;

  const sep = linhas[0].includes(";") ? ";" : ",";
  const header = linhas.shift().split(sep).map(h => h.trim().toLowerCase());

  linhas.forEach(linha => {
    const valores = linha.split(sep);
    const d = {};
    header.forEach((h, i) => d[h] = (valores[i] || "").trim());

    // ❌ ignora usuário vazio
    if (!d.usuario) return;

    // ❌ evita duplicar
    const existe = [...document.querySelectorAll("#listaUsuariosChat .campo-nome")]
      .some(i => i.value === d.usuario);

    if (existe) return;

    const wrap = adicionarUsuarioChat(true);

    wrap.querySelector(".campo-nome").value = d.usuario;
    wrap.querySelector("input[type=email]").value = d.email || "";
    wrap.querySelector(".campo-senha").value = d.senha || "";

    // permissão
    const select = wrap.querySelector("select");
    if (select && d.permissao) {
      [...select.options].forEach(opt => {
        if (opt.value.toLowerCase() === d.permissao.toLowerCase()) {
          opt.selected = true;
        }
      });
    }

    // agente
    if (d.agente?.toLowerCase() === "sim") {
      wrap.querySelector("input[type=checkbox]")?.click();
    }
  });

  mostrarToast("Usuários do chat importados com sucesso!");
}

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
        departamentos: [] // preenchido no salvar
      });

      wrap.append(nome);
      lista.appendChild(wrap);
    }
  });
}

/* =====================================================
   DEPARTAMENTOS CHAT (MODELO PABX)
   ===================================================== */
  window.adicionarDepartamentoChat = function () {
  const lista = document.getElementById("listaDepartamentosChat");
  if (!lista) return;

  const wrap = document.createElement("div");
  wrap.className = "campo-descricao";

  /* ===== LINHA TOPO (NOME + REMOVER) ===== */
  const linhaTopo = document.createElement("div");
  linhaTopo.style.display = "flex";
  linhaTopo.style.gap = "8px";
  linhaTopo.style.alignItems = "center";

  const inputNome = document.createElement("input");
  inputNome.placeholder = "Nome do departamento";
  inputNome.style.flex = "1";

  const btnRemoverDepto = document.createElement("button");
  btnRemoverDepto.textContent = "🗑";
  btnRemoverDepto.title = "Remover departamento";
  btnRemoverDepto.className = "btn-remover";

  btnRemoverDepto.onclick = () => {
  wrap.classList.add("removendo");

  setTimeout(() => {
    wrap.remove();
  }, 180); // tempo da animação
};

  linhaTopo.append(inputNome, btnRemoverDepto);
  wrap.appendChild(linhaTopo);

  /* ===== LISTA DE AGENTES ===== */
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
        const d = a.getData?.();
        if (d?.nome) select.add(new Option(d.nome, d.nome));
      });

    const remover = document.createElement("button");
    remover.textContent = "✖";
    remover.onclick = () => linha.remove();

    linha.append(select, remover);
    listaAgentes.appendChild(linha);
  };

  /* ===== DATA PARA SALVAR ===== */
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

  wrap.append(listaAgentes, btnAddAgente);
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
   COLETA FINAL PARA O JSON (SALVAR)
   ===================================================== */
window.coletarChatDoDOM = function () {
  const usuarios = [];
  const agentes = [];
  const departamentos = [];

  document.querySelectorAll("#listaUsuariosChat .campo-descricao").forEach(u => {
    const d = u.getData?.();
    if (d) usuarios.push(d);
  });

  document.querySelectorAll("#listaAgentesChat .campo-descricao").forEach(a => {
    const d = a.getData?.();
    if (d) agentes.push(d);
  });

  document.querySelectorAll("#listaDepartamentosChat .campo-descricao").forEach(d => {
    const dep = d.getData?.();
    if (dep) departamentos.push(dep);
  });

  // 🔥 AQUI ESTÁ O BUG QUE FOI CORRIGIDO
  agentes.forEach(agente => {
    agente.departamentos = departamentos
      .filter(dep => dep.agentes.includes(agente.nome))
      .map(dep => dep.nome);
  });

  window.chatState.usuarios = usuarios;
  window.chatState.agentes = agentes;
  window.chatState.departamentos = departamentos;

  console.log("CHAT STATE FINAL:", window.chatState);

  return window.chatState;
};
