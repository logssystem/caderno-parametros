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

function atualizarSelectAgentesDepartamentoChat() {
  document
    .querySelectorAll("#listaDepartamentosChat .campo-descricao select")
    .forEach(select => {
      const atual = select.value;
      select.innerHTML = `<option value="">Selecione um agente</option>`;

      document
        .querySelectorAll("#listaUsuariosChat .campo-descricao")
        .forEach(u => {
          const data = u.getData?.();
          const isAgente =
            data?.agente === true ||
            data?.permissoes?.includes("Agente Omnichannel");

          if (isAgente && data.nome) {
            select.add(new Option(data.nome, data.nome));
          }
        });

      select.value = atual;
    });
}

window.adicionarDepartamentoChat = function () {
  const lista = document.getElementById("listaDepartamentosChat");
  if (!lista) return;

  lista.appendChild(criarDepartamentoChat());
  atualizarSelectAgentesDepartamentoChat();
};

function criarDepartamentoChat() {
  const wrap = document.createElement("div");
  wrap.className = "campo-descricao";

  const linhaTopo = document.createElement("div");
  linhaTopo.className = "linha-principal";

  const nome = document.createElement("input");
  nome.placeholder = "Nome do departamento";

  const del = document.createElement("button");
  del.textContent = "✖";
  del.onclick = () => wrap.remove();

  linhaTopo.append(nome, del);
  wrap.append(linhaTopo);

  const titulo = document.createElement("h4");
  titulo.textContent = "Agentes do departamento";
  titulo.style.marginTop = "12px";
  wrap.append(titulo);

  const select = document.createElement("select");
  select.innerHTML = `<option value="">Selecione um agente</option>`;
  wrap.append(select);

  const btnAdd = document.createElement("button");
  btnAdd.textContent = "Adicionar agente";
  wrap.append(btnAdd);

  const lista = document.createElement("div");
  wrap.append(lista);

  wrap.dataset.agentes = "[]";

  btnAdd.onclick = () => {
    if (!select.value) return;

    const agentes = JSON.parse(wrap.dataset.agentes);
    if (!agentes.includes(select.value)) {
      agentes.push(select.value);
      wrap.dataset.agentes = JSON.stringify(agentes);
      render();
    }
  };

  function render() {
    lista.innerHTML = "";
    JSON.parse(wrap.dataset.agentes).forEach((a, i) => {
      const d = document.createElement("div");
      d.textContent = a;

      const x = document.createElement("button");
      x.textContent = "✖";
      x.onclick = () => {
        const agentes = JSON.parse(wrap.dataset.agentes);
        agentes.splice(i, 1);
        wrap.dataset.agentes = JSON.stringify(agentes);
        render();
      };

      d.append(x);
      lista.append(d);
    });
  }

  wrap.getData = () => ({
    nome: nome.value,
    agentes: JSON.parse(wrap.dataset.agentes)
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

// 👉 mostra o aviso já na criação (igual PABX)
validarSenha(senha, regras);

// 👉 continua validando enquanto digita
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

  chkAgente.onchange = () => {
    gerarAgentesChatAPartirUsuarios();
    atualizarSelectAgentesDepartamentoChat();
  };

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

/* ================= SENHA ================= */

function validarSenha(input, regrasEl) {
  const v = input.value || "";

  // 👉 campo vazio = neutro (NÃO mostra erro)
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

/* ================= CHAT – DEPARTAMENTOS ================= */

window.adicionarDepartamentoChat = function () {
  const lista = document.getElementById("listaDepartamentosChat");
  if (!lista) return;

  const wrap = document.createElement("div");
  wrap.className = "campo-descricao";

  const input = document.createElement("input");
  input.placeholder = "Nome do departamento";

  const btn = document.createElement("button");
  btn.textContent = "✖";
  btn.onclick = () => wrap.remove();

  wrap.append(input, btn);

  // 🔑 getData obrigatório
  wrap.getData = () => ({
    nome: input.value.trim()
  });

  lista.appendChild(wrap);
};


/* ================= CHAT – AGENTES ================= */

window.adicionarAgenteChat = function () {
  const lista = document.getElementById("listaAgentesChat");
  if (!lista) return;

  const wrap = document.createElement("div");
  wrap.className = "campo-descricao";

  const nome = document.createElement("input");
  nome.placeholder = "Nome do agente";

  const usuario = document.createElement("input");
  usuario.placeholder = "Usuário vinculado (login)";

  const selectDept = document.createElement("select");
  selectDept.multiple = true;

  // popula departamentos existentes
  document
    .querySelectorAll("#listaDepartamentosChat .campo-descricao")
    .forEach(d => {
      if (d.getData) {
        const dep = d.getData();
        if (dep.nome) {
          selectDept.add(new Option(dep.nome, dep.nome));
        }
      }
    });

  const btn = document.createElement("button");
  btn.textContent = "✖";
  btn.onclick = () => wrap.remove();

  wrap.append(nome, usuario, selectDept, btn);

  // 🔑 getData obrigatório
  wrap.getData = () => ({
    nome: nome.value.trim(),
    usuarioId: usuario.value.trim(),
    departamentos: [...selectDept.selectedOptions].map(o => o.value)
  });

  lista.appendChild(wrap);
};

/* =========================================================
   PATCH – ENSINAR O SISTEMA A LER DEPARTAMENTOS (SEM UI)
   ========================================================= */

function aplicarGetDataDepartamentosChat() {
  document
    .querySelectorAll("#listaDepartamentosChat .campo-descricao")
    .forEach(dep => {

      // evita sobrescrever se já existir
      if (dep.getData) return;

      const inputNome = dep.querySelector("input");

      dep.getData = () => {
        // tenta achar agentes vinculados dentro do departamento
        const agentes = [];

        dep.querySelectorAll("[data-agente]").forEach(a => {
          agentes.push(a.dataset.agente);
        });

        return {
          nome: inputNome?.value.trim() || "",
          agentes
        };
      };
    });
}

// reaplica sempre que algo mudar no chat
document.addEventListener("click", e => {
  if (e.target.closest("#listaDepartamentosChat")) {
    aplicarGetDataDepartamentosChat();
  }
});

function adicionarDepartamentoChat() {
  const lista = document.getElementById("listaDepartamentosChat");
  if (!lista) return;

  const wrap = document.createElement("div");
  wrap.className = "campo-descricao";

  // ===== Nome do departamento =====
  const inputNome = document.createElement("input");
  inputNome.placeholder = "Nome do departamento";

  // ===== Lista de agentes =====
  const listaAgentes = document.createElement("div");
  listaAgentes.className = "lista-agentes-departamento";
  listaAgentes.style.marginTop = "8px";

  // ===== Botão adicionar agente =====
  const btnAddAgente = document.createElement("button");
  btnAddAgente.textContent = "+ Adicionar agente";
  btnAddAgente.className = "btn-add";
  btnAddAgente.style.marginTop = "6px";

  btnAddAgente.onclick = () => {
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

    const linha = document.createElement("div");
    linha.style.display = "flex";
    linha.style.gap = "6px";
    linha.style.marginTop = "4px";

    const btnRemover = document.createElement("button");
    btnRemover.textContent = "✖";
    btnRemover.onclick = () => linha.remove();

    linha.append(select, btnRemover);
    listaAgentes.appendChild(linha);
  };

  // ===== getData (LEITURA PARA O JSON) =====
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
}
