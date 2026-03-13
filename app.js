document.addEventListener("DOMContentLoaded", () => {
  window.initCaderno();
});

console.log("APP.JS FINAL – CONSOLIDADO DEFINITIVO (URA + REGRA DE TEMPO + FILA + GRUPO RING + AGENTES)");

window.addEventListener("error", (e) => {
  console.warn("Erro externo ignorado:", e.message);
});

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

  const DUVIDAS = {

  cliente: {
    titulo: "Dados do Cliente",
    blocos: [
      {
        tipo: "info",
        texto: "Esses dados identificam a empresa dentro do sistema e são utilizados em autenticação, integrações e organização interna."
      },
      {
        tipo: "campo",
        texto: "Nome da empresa: utilizado apenas para identificação do projeto."
      },
      {
        tipo: "campo",
        texto: "Domínio do cliente: obrigatório. Deve seguir o padrão empresa.sobreip.com.br."
      },
      {
        tipo: "alerta",
        texto: "Domínios inválidos impedem o funcionamento correto das integrações de voz e chat."
      },
      {
        tipo: "campo",
        texto: "CNPJ: utilizado apenas para registro e controle interno."
      }
    ]
  },

  usuarios: {
    titulo: "Usuários Web",
    blocos: [
      {
        tipo: "info",
        texto: "Usuários Web são as pessoas que terão acesso ao painel administrativo do sistema."
      },
      {
        tipo: "campo",
        texto: "Nome e e-mail: utilizados para identificação."
      },
      {
        tipo: "campo",
        texto: "Senha: deve conter no mínimo 11 caracteres, com letra maiúscula, número e caractere especial."
      },
      {
        tipo: "lista",
        texto: "Permissões disponíveis e suas funções:",
        itens: [
          "Administrador do Módulo de PABX: acesso total às configurações de voz (ramais, URA, filas, agentes e regras de tempo).",
          "Agente de Call Center: utilizado para usuários que realizam atendimento telefônico.",
          "Supervisor(a) de Call Center: pode acompanhar agentes e filas do call center.",
          "CRM: acesso ao módulo de CRM, sem permissões administrativas.",
          "CRM Owner: acesso total ao módulo de CRM.",
          "Administrador do Módulo de Omnichannel: acesso total às configurações de chat e canais digitais.",
          "Agente Omnichannel: utilizado para usuários que realizam atendimento via chat.",
          "Supervisor(a) Omnichannel: pode acompanhar agentes e atendimentos do chat.",
          "Super Administrador: acesso total a todos os módulos e configurações do sistema."
        ]
      },
      {
        tipo: "alerta",
        texto: "Evite conceder permissão de Administrador para usuários que não são responsáveis técnicos."
      },
      {
        tipo: "campo",
        texto: "Marcar como Agente: permite que o usuário atenda chamadas e exige vínculo obrigatório com um ramal."
      }
    ]
  },

  ramais: {
    titulo: "Ramais",
    blocos: [
      {
        tipo: "info",
        texto: "Ramais são os pontos de atendimento telefônico utilizados para realizar e receber chamadas."
      },
      {
        tipo: "campo",
        texto: "Número do ramal: deve conter apenas números e será usado para chamadas internas."
      },
      {
        tipo: "campo",
        texto: "Senha do ramal: utilizada para o registro SIP e deve seguir as regras de segurança."
      },
      {
        tipo: "campo",
        texto: "Grupo de chamada: permite organização e captura de chamadas entre ramais."
      },
      {
        tipo: "exemplo",
        texto: "Exemplo: ramais no mesmo grupo permitem o uso do *8 para captura de chamadas."
      }
    ]
  },

  agentes: {
    titulo: "Agentes",
    blocos: [
      {
        tipo: "info",
        texto: "Agentes são os usuários responsáveis por atender chamadas telefônicas e atendimentos digitais."
      },
      {
        tipo: "campo",
        texto: "Todo agente é criado a partir de um Usuário Web marcado como agente."
      },
      {
        tipo: "campo",
        texto: "Todo agente deve obrigatoriamente estar associado a um ramal."
      },
      {
        tipo: "alerta",
        texto: "Agentes sem ramal vinculado não conseguem receber chamadas."
      }
    ]
  },

  filas: {
    titulo: "Filas",
    blocos: [
      {
        tipo: "info",
        texto: "Filas organizam o atendimento distribuindo chamadas entre vários agentes."
      },
      {
        tipo: "campo",
        texto: "Filas sem agentes configurados não realizam atendimento."
      }
    ]
  },

  regrasTempo: {
    titulo: "Regras de Tempo",
    blocos: [
      {
        tipo: "info",
        texto: "Regras de Tempo definem os dias e horários em que o atendimento estará ativo."
      },
      {
        tipo: "exemplo",
        texto: "Exemplo: segunda a sexta, das 08:00 às 18:00."
      }
    ]
  },

  ura: {
    titulo: "URA",
    blocos: [
      {
        tipo: "info",
        texto: "A URA é o atendimento automático responsável por direcionar as chamadas dos clientes."
      },
      {
        tipo: "lista",
        texto: "Destinos possíveis:",
        itens: [
          "Ramal",
          "Fila",
          "Grupo de Ring",
          "Outra URA",
          "Regra de Tempo"
        ]
      }
    ]
  },

  chat: {
    titulo: "Chat / Omnichannel",
    blocos: [
      {
        tipo: "info",
        texto: "O módulo de Chat permite atendimento por canais digitais integrados ao sistema."
      },
      {
        tipo: "campo",
        texto: "Agentes omnichannel devem obrigatoriamente estar vinculados a um departamento."
      },
      {
        tipo: "alerta",
        texto: "Sem departamento configurado, o agente não consegue atender chats."
      }
    ]
  }

};

// ⬇️ COLE ISSO AQUI, LOGO ABAIXO ⬇️
function renderizarDuvidas(chave) {
  const container = document.getElementById("conteudoDuvida");
  container.innerHTML = "";

  const dados = DUVIDAS[chave];
  if (!dados) return;

  dados.blocos.forEach(bloco => {
    const el = document.createElement("div");
    el.className = `duvida-bloco duvida-${bloco.tipo}`;

    if (bloco.tipo === "lista") {
      el.innerHTML = `
        <strong>${bloco.texto}</strong>
        <ul>
          ${bloco.itens.map(item => `<li>${item}</li>`).join("")}
        </ul>
      `;
    } else {
      el.innerHTML = bloco.texto;
    }

    container.appendChild(el);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const select = document.getElementById("selectDuvida");
  if (!select) return;

  select.addEventListener("change", function () {
    renderizarDuvidas(this.value);
  });
});

window.toggleDuvidas = function () {
  const painel = document.getElementById("painelDuvidas");
  if (!painel) return;
  painel.hidden = !painel.hidden;
};

/* ================= DADOS DO CLIENTE ================= */

const dominioInput = document.getElementById("dominioCliente");
const regraDominio = document.getElementById("regraDominio");

window.validarDominioCliente = function () {
    if (!dominioInput) return true;

    const v = dominioInput.value.trim().toLowerCase();
    const ok = v.endsWith(".sobreip.com.br") && v.length > ".sobreip.com.br".length;

    // borda vermelha / normal
    dominioInput.classList.toggle("campo-obrigatorio-erro", !ok);

    // mensagem bonita embaixo
    if (regraDominio) {
        regraDominio.innerHTML = ok
            ? `<div class="regra-ok">Domínio válido</div>`
            : `<div class="regra-erro">Deve terminar com .sobreip.com.br</div>`;
    }

    return ok;
};

if (dominioInput) {
    dominioInput.addEventListener("input", window.validarDominioCliente);
}

const cnpjInput = document.getElementById("cnpjCliente");
const regraCNPJ = document.getElementById("regraCNPJ");

if (cnpjInput) {
  cnpjInput.addEventListener("input", () => {
    let v = cnpjInput.value.replace(/\D/g, "").slice(0, 14);

    v = v.replace(/^(\d{2})(\d)/, "$1.$2");
    v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    v = v.replace(/\.(\d{3})(\d)/, ".$1/$2");
    v = v.replace(/(\d{4})(\d)/, "$1-$2");

    cnpjInput.value = v;

    if (v.length === 18) {
      regraCNPJ.textContent = "CNPJ preenchido";
      regraCNPJ.style.color = "green";
    } else {
      regraCNPJ.textContent = "CNPJ incompleto";
      regraCNPJ.style.color = "red";
    }
  });
}

/* ================= ADICIONAR CAMPO ================= */

window.adicionarCampo = function (tipo) {

    // 👉 BOTÃO DE AGENTE É APENAS INFORMATIVO
    if (tipo === "agente") {
        mostrarToast(
          "Os agentes são gerados automaticamente a partir dos usuários marcados como agente.",
          true
        );
        return;
    }

    if (!listas[tipo]) return mostrarToast(`Tipo inválido: ${tipo}`, true);

    const container = document.getElementById(listas[tipo]);
    if (!container || container.children.length >= LIMITE) return;

    container.appendChild(criarCampo(tipo));
    atualizarTodosDestinosURA();
    syncTudo();
};

/* ================= PESQUISA DE SATISFAÇÃO ================= */

function togglePesquisaSatisfacao() {
  const bloco = document.getElementById("pesquisaSatisfacaoConteudo");
  if (!bloco) return;

  bloco.style.display =
    bloco.style.display === "none" ? "block" : "none";
}

function adicionarRespostaPesquisa() {
  const lista = document.getElementById("listaRespostasPesquisa");
  if (!lista) return;

  lista.appendChild(criarRespostaPesquisa());
}

function criarRespostaPesquisa() {
  const wrap = document.createElement("div");
  wrap.className = "opcao-pesquisa"; // ⚠️ NÃO usar opcao-ura

  const nota = document.createElement("input");
  nota.type = "number";
  nota.placeholder = "Nota";
  nota.style.width = "70px";

  const descricao = document.createElement("input");
  descricao.type = "text"; // explícito (seguro)
  descricao.placeholder = "Descrição da resposta (ex: Ruim, Regular, Bom, Excelente";

  const del = document.createElement("button");
  del.textContent = "🗑";
  del.onclick = () => wrap.remove();

  wrap.append(nota, descricao, del);
  return wrap;
}

/* ================= PAUSAS DO CALL CENTER ================= */

function togglePausas() {
  const bloco = document.getElementById("pausasConteudo");
  if (!bloco) return;

  // verifica se o módulo VOZ está ativo
  const modo = localStorage.getItem("modo_atendimento");

  if (modo === "chat") {
    mostrarToast("Pausas são exclusivas do Call Center (Voz)", true);
    return;
  }

  bloco.style.display =
    bloco.style.display === "none" ? "block" : "none";
}

function adicionarPausa() {
  const lista = document.getElementById("listaPausas");
  if (!lista) return;

  lista.appendChild(criarPausa());
}

function criarPausa() {
  const wrap = document.createElement("div");
  wrap.className = "opcao-pausa";

  const nome = document.createElement("input");
  nome.type = "text";
  nome.placeholder = "Nome da pausa (ex: Almoço, Banheiro, Treinamento)";

  const timeout = document.createElement("select");
  for (let i = 0; i <= 240; i += 5) {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = i === 0 ? "Sem limite" : `${i} min`;
    timeout.appendChild(opt);
  }

  const del = document.createElement("button");
  del.textContent = "🗑";
  del.onclick = () => wrap.remove();

  wrap.append(nome, timeout, del);
  return wrap;
}

/* ================= DESTINOS URA (RESTAURADO) ================= */

function atualizarDestinosURA(select) {
  if (!select) return;

  select.innerHTML = "";
  select.add(new Option("Selecione o destino", ""));

  const grupos = [
    { id: "listaRings", label: "📞 Ramal" },
    { id: "listaFilas", label: "👥 Fila" },
    { id: "listaGrupoRing", label: "🔔 Grupo de Ring" },
    { id: "listaURAs", label: "☎ URA" },
    { id: "listaRegrasTempo", label: "⏰ Regra de Tempo" }
  ];

  grupos.forEach(g => {
    const optgroup = document.createElement("optgroup");
    optgroup.label = g.label;

    document.querySelectorAll(`#${g.id} .campo-descricao`).forEach(el => {
      const nome = el.getNome?.() || el.querySelector(".campo-nome")?.value;
      if (nome) {
        optgroup.appendChild(new Option(nome, nome));
      }
    });

    if (optgroup.children.length) {
      select.appendChild(optgroup);
    }
  });
}

// 🔧 GARANTIA: função global para não quebrar o app
function atualizarTodosDestinosURA() {
    document.querySelectorAll(".opcao-ura select").forEach(select => {
        const atual = select.value;
        atualizarDestinosURA(select);
        select.value = atual;
    });
}

/* ================= CRIAR CAMPO ================= */
  function ramalJaExiste(valor, atual) {
  
      let existe = false;
  
      document.querySelectorAll("#listaRings .campo-nome").forEach(r => {
  
          if (r === atual) return;
  
          if (r.value === valor && valor !== "") {
              existe = true;
          }
  
      });
  
      return existe;
  }

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
    nome.classList.add("campo-nome");
    nome.style.width = "100%";
    nome.addEventListener("input", atualizarTodosDestinosURA);

    const btn = document.createElement("button");
    btn.textContent = "✖";
    btn.onclick = () => {
        wrap.remove();
        atualizarTodosDestinosURA();
        syncTudo();
    };

    linhaNome.append(nome, btn);
    wrap.append(linhaNome);

    let emailInput = null;
    let senhaInput = null;
    let permissao = null;
    let regras = null;
    let chkAgente = null;
    let chkAgenteOmni = null;

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
        senhaInput.classList.add("campo-senha");

        linhaCred.append(emailInput, senhaInput);
        wrap.append(linhaCred);

        permissao = document.createElement("select");
        permissao.style.marginTop = "12px";

        const opt0 = new Option("Selecione a permissão", "");
        opt0.disabled = true;
        opt0.selected = true;
        permissao.appendChild(opt0);
        PERMISSOES.forEach(p => permissao.add(new Option(p, p)));
        wrap.append(permissao);

        const boxAgente = document.createElement("label");
        boxAgente.style.display = "flex";
        boxAgente.style.alignItems = "center";
        boxAgente.style.gap = "6px";
        boxAgente.style.marginTop = "8px";

        chkAgente = document.createElement("input");
        chkAgente.type = "checkbox";

        chkAgente.addEventListener("change", () => {
            syncTudo();
            });
        
        const txt = document.createElement("span");
        txt.textContent = "Este usuário é agente de call center";

        boxAgente.append(chkAgente, txt);
        wrap.append(boxAgente);
        
        const boxOmni = document.createElement("label");
        boxOmni.style.display = "flex";
        boxOmni.style.alignItems = "center";
        boxOmni.style.gap = "6px";
        boxOmni.style.marginTop = "6px";

        const modo = localStorage.getItem("modo_atendimento");

        if (modo !== "ambos") {
            boxOmni.style.display = "none";
        }
        
       chkAgenteOmni = document.createElement("input");
        chkAgenteOmni.type = "checkbox";
        chkAgenteOmni.classList.add("checkbox-omni");
        
        chkAgenteOmni.addEventListener("change", () => {
          syncTudo();
        });
              
        const txtOmni = document.createElement("span");
        txtOmni.textContent = "Este usuário é agente omnichannel";
        
        boxOmni.append(chkAgenteOmni, txtOmni);
        wrap.append(boxOmni);

        regras = document.createElement("div");
        regras.style.marginTop = "8px";
        wrap.append(regras);

        senhaInput.oninput = () => validarSenha(senhaInput, regras);
    }

/* ===== RAMAL ===== */
if (tipo === "ring") {

    // 🔧 largura igual ao campo de senha
    nome.style.width = "260px";
    nome.style.maxWidth = "100%";

    nome.type = "text";
    nome.inputMode = "numeric";
    nome.placeholder = "Digite o número do ramal";
    
    nome.onkeypress = function (e) {
    const char = String.fromCharCode(e.which);
    if (!/[0-9]/.test(char)) {
        e.preventDefault();
    }
};

    const infoRamal = document.createElement("div");
    infoRamal.className = "regra-neutra";
    infoRamal.style.marginTop = "6px";
    infoRamal.textContent =
        "O ramal não pode iniciar com 0 e deve ter entre 3 e 6 dígitos.";

       nome.addEventListener("input", () => {
    
        nome.value = nome.value.replace(/\D/g, "");
        const v = nome.value;
    
        if (!v.length) {
            nome.classList.remove("campo-obrigatorio-erro");
            infoRamal.className = "regra-neutra";
            infoRamal.textContent =
                "O ramal não pode iniciar com 0 e deve ter entre 3 e 5 dígitos.";
            return;
        }
    
        if (ramalJaExiste(v, nome)) {
            nome.classList.add("campo-obrigatorio-erro");
            infoRamal.className = "regra-erro";
            infoRamal.textContent = "⚠ Este ramal já está sendo utilizado.";
            return;
        }
    
        if (v.startsWith("0")) {
            nome.classList.add("campo-obrigatorio-erro");
            infoRamal.className = "regra-erro";
            infoRamal.textContent = "O ramal não pode iniciar com 0.";
            return;
        }
    
        if (v.length < 3) {
            nome.classList.add("campo-obrigatorio-erro");
            infoRamal.className = "regra-erro";
            infoRamal.textContent = "O ramal deve ter no mínimo 3 dígitos.";
            return;
        }
    
        if (v.length > 5) {
            nome.classList.add("campo-obrigatorio-erro");
            infoRamal.className = "regra-erro";
            infoRamal.textContent = "O ramal pode ter no máximo 5 dígitos.";
            return;
        }
    
        nome.classList.remove("campo-obrigatorio-erro");
        infoRamal.className = "regra-ok";
        infoRamal.textContent = "Ramal válido.";
    
    });

    senhaInput = document.createElement("input");
    senhaInput.placeholder = "Senha do ramal";
    senhaInput.classList.add("campo-senha");
    senhaInput.style.marginTop = "12px";
    wrap.append(senhaInput);

    regras = document.createElement("div");
    regras.style.marginTop = "8px";
    wrap.append(regras);

    senhaInput.oninput = () => validarSenha(senhaInput, regras);

    wrap.append(infoRamal);
}

    /* ===== URA ===== */
    if (tipo === "ura") {
        const msg = document.createElement("textarea");
        msg.placeholder = "Mensagem da URA Ex: Olá seja bem-vindo...";
        msg.style.marginTop = "12px";
        wrap.append(msg);

        const titulo = document.createElement("h4");
        titulo.textContent = "Opções da URA";
        titulo.style.marginTop = "12px";
        wrap.append(titulo);

        const listaOpcoes = document.createElement("div");
        wrap.append(listaOpcoes);

        const btnNova = document.createElement("button");
        btnNova.textContent = "+ Nova opção";
        btnNova.onclick = () => listaOpcoes.appendChild(criarOpcaoURA());
        wrap.append(btnNova);
    }

    /* ===== FILA ===== */
    if (tipo === "fila") {
        const titulo = document.createElement("h4");
        titulo.textContent = "Agentes da fila";
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
            const arr = JSON.parse(wrap.dataset.agentes);
            if (!arr.includes(select.value)) arr.push(select.value);
            wrap.dataset.agentes = JSON.stringify(arr);
            render();
        };

        function render() {
            lista.innerHTML = "";
            JSON.parse(wrap.dataset.agentes).forEach((a, i) => {
                const d = document.createElement("div");
                d.textContent = a;
                const x = document.createElement("button");
                x.textContent = "✖";
                x.onclick = () => {
                    const arr = JSON.parse(wrap.dataset.agentes);
                    arr.splice(i, 1);
                    wrap.dataset.agentes = JSON.stringify(arr);
                    render();
                };
                d.append(x);
                lista.append(d);
            });
        }
    }

    /* ===== GRUPO DE RING ===== */
    if (tipo === "grupo_ring") {
        const estr = document.createElement("select");
        estr.innerHTML = `
      <option value="">Estratégia</option>
      <option value="simultaneo">Simultânea</option>
      <option value="sequencial">Sequencial</option>
    `;
        wrap.append(estr);
        wrap.dataset.estrategia = "";
        estr.onchange = () => wrap.dataset.estrategia = estr.value;

        const select = document.createElement("select");
        select.innerHTML = `<option value="">Selecione um ramal</option>`;
        wrap.append(select);

        const btnAdd = document.createElement("button");
        btnAdd.textContent = "Adicionar ramal";
        wrap.append(btnAdd);

        const lista = document.createElement("div");
        wrap.append(lista);

        wrap.dataset.ramais = "[]";

        btnAdd.onclick = () => {
            if (!select.value) return;
            const arr = JSON.parse(wrap.dataset.ramais);
            if (!arr.includes(select.value)) arr.push(select.value);
            wrap.dataset.ramais = JSON.stringify(arr);
            render();
        };

        function render() {
            lista.innerHTML = "";
            JSON.parse(wrap.dataset.ramais).forEach((r, i) => {
                const d = document.createElement("div");
                d.textContent = r;
                const x = document.createElement("button");
                x.textContent = "✖";
                x.onclick = () => {
                    const arr = JSON.parse(wrap.dataset.ramais);
                    arr.splice(i, 1);
                    wrap.dataset.ramais = JSON.stringify(arr);
                    render();
                };
                d.append(x);
                lista.append(d);
            });
        }
    }

        function validarSenha(input, regrasEl) {
        if (!regrasEl) return;
    
        const v = input.value || "";
    
        const temMin = v.length >= 11;
        const temMaiuscula = /[A-Z]/.test(v);
        const temNumero = /\d/.test(v);
        const temEspecial = /[^A-Za-z0-9]/.test(v);
    
        const ok = temMin && temMaiuscula && temNumero && temEspecial;
    
        regrasEl.innerHTML = ok
            ? `<div class="regra-ok">Senha válida</div>`
            : `<div class="regra-erro">Mín. 11 | Maiúscula | Número | Especial</div>`;
    }

    wrap.getNome = () => nome.value;
    wrap.getEmail = () => emailInput?.value || "";
    wrap.getSenha = () => senhaInput?.value || "";
    wrap.getPermissao = () => permissao?.value || "";
    wrap.isAgente = () => chkAgente ? chkAgente.checked : false;
    wrap.isAgenteOmni = () => chkAgenteOmni ? chkAgenteOmni.checked : false;

    return wrap;
}

/* ================= OPÇÃO URA ================= */

function criarOpcaoURA() {
    const wrap = document.createElement("div");
    wrap.className = "opcao-ura";

    const tecla = document.createElement("input");
    tecla.placeholder = "Tecla";

    const destino = document.createElement("select");
    atualizarDestinosURA(destino);

    const desc = document.createElement("input");
    desc.placeholder = "Descrição";

    const del = document.createElement("button");
    del.textContent = "🗑";
    del.onclick = () => wrap.remove();

    wrap.append(tecla, destino, desc, del);
    return wrap;
}

/* ================= AGENTES AUTOMÁTICOS ================= */

function gerarAgentesAPartirUsuarios() {
    const listaAgentes = document.getElementById("listaAgentes");
    if (!listaAgentes) return;

    // 🔒 salva ramais já escolhidos
    const ramaisSalvos = {};
    listaAgentes.querySelectorAll(".campo-descricao").forEach(a => {
        const nome = a.querySelector(".campo-nome")?.value;
        const ramal = a.getRamal ? a.getRamal() : "";
        if (nome && ramal) ramaisSalvos[nome] = ramal;
    });
    
    listaAgentes.innerHTML = "";

    document.querySelectorAll("#listaUsuariosWeb .campo-descricao").forEach(u => {
        if (u.isAgente && u.isAgente() && u.getNome()) {

            const wrap = document.createElement("div");
            wrap.className = "campo-descricao";

            const linha = document.createElement("div");
            linha.className = "linha-principal";

            const nome = document.createElement("input");
            nome.value = u.getNome();
            nome.disabled = true;
            nome.className = "campo-nome";

            linha.append(nome);
            wrap.append(linha);

            const selectRamal = document.createElement("select");
            selectRamal.innerHTML = `<option value="">Ramal (obrigatório)</option>`;

            document.querySelectorAll("#listaRings .campo-descricao").forEach(r => {
                if (r.getNome()) {
                    selectRamal.add(new Option(r.getNome(), r.getNome()));
                }
            });

            // ♻ restaura ramal se já existia
            if (ramaisSalvos[u.getNome()]) {
                selectRamal.value = ramaisSalvos[u.getNome()];
            }

            wrap.append(selectRamal);

            // ===== BOTÃO MULTISKILL =====
            const btnMultiskill = document.createElement("button");
            btnMultiskill.textContent = "Multiskill";
            btnMultiskill.className = "btn-multiskill";
            btnMultiskill.dataset.ativo = "false";
            
            btnMultiskill.onclick = () => {
            const ativo = btnMultiskill.dataset.ativo === "true";
            btnMultiskill.dataset.ativo = (!ativo).toString();
            btnMultiskill.classList.toggle("ativo", !ativo);
            };
            
            wrap.append(btnMultiskill);
            
            // getter para o JSON
            wrap.isMultiskill = () => btnMultiskill.dataset.ativo === "true";

            
            wrap.getRamal = () => selectRamal.value;

            listaAgentes.append(wrap);
        }
    });
}

function gerarAgentesChatAPartirUsuarios() {

    const lista = document.getElementById("listaAgentesChat");
    if (!lista) return;

    lista.innerHTML = "";

    // pega usuários da VOZ
    let usuarios = document.querySelectorAll("#listaUsuariosWeb .campo-descricao");

    // se não existir, pega usuários do CHAT
    if (!usuarios.length) {
        usuarios = document.querySelectorAll("#listaUsuariosChat .campo-descricao");
    }

    usuarios.forEach(u => {

        const nome = u.querySelector(".campo-nome")?.value;
        const chkOmni = u.querySelector(".checkbox-omni") || u.querySelector("input[type=checkbox]");

        if (chkOmni && chkOmni.checked && nome) {

            const wrap = document.createElement("div");
            wrap.className = "campo-descricao";

            const linha = document.createElement("div");
            linha.className = "linha-principal";

            const inputNome = document.createElement("input");
            inputNome.className = "campo-nome";
            inputNome.value = nome;
            inputNome.disabled = true;

            linha.append(inputNome);
            wrap.append(linha);

            lista.appendChild(wrap);
        }

    });

}
/* ================= DESTINOS URA ================= */

function atualizarSelectAgentesFila() {
    document.querySelectorAll("#listaFilas .campo-descricao").forEach(fila => {
        const select = fila.querySelector("select");
        if (!select) return;

        const atual = select.value;
        select.innerHTML = `<option value="">Selecione um agente</option>`;

        document.querySelectorAll("#listaAgentes .campo-descricao").forEach(a => {
            const nome = a.querySelector(".campo-nome")?.value;
            const ramal = a.getRamal ? a.getRamal() : "";

            if (nome) {
                const label = ramal ? `${nome} (${ramal})` : `${nome} (sem ramal)`;
                select.add(new Option(label, nome));
            }
        });

        select.value = atual;
    });
}

/* ================= SELECTS DINÂMICOS ================= */

function atualizarSelectRamaisGrupo() {
    document.querySelectorAll("#listaGrupoRing .campo-descricao").forEach(g => {
        const s = g.querySelectorAll("select")[1];
        if (!s) return;
        const atual = s.value;
        s.innerHTML = `<option value="">Selecione um ramal</option>`;
        document.querySelectorAll("#listaRings .campo-nome").forEach(r => {
            s.add(new Option(r.value, r.value));
        });
        s.value = atual;
    });
}

/* ================= REGRA DE TEMPO ================= */

window.adicionarRegraTempo = function () {
    const container = document.getElementById("listaRegrasTempo");

    if (!container) {
        console.error("listaRegrasTempo não encontrada");
        return mostrarToast("Lista de regras de tempo não encontrada", true);
    }

    container.appendChild(criarRegraTempo());
    atualizarTodosDestinosURA();
    syncTudo();
};

function criarRegraTempo() {
    const wrap = document.createElement("div");
    wrap.className = "campo-descricao";

    const linhaTopo = document.createElement("div");
    linhaTopo.className = "linha-principal";

    const nome = document.createElement("input");
    nome.placeholder = "Nome da regra de tempo";

    const btn = document.createElement("button");
    btn.textContent = "✖";
    btn.onclick = () => wrap.remove();

    linhaTopo.append(nome, btn);
    wrap.append(linhaTopo);

    const diasSemana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    const diasSelecionados = new Set();

    const diasBox = document.createElement("div");
    diasBox.style.display = "flex";
    diasBox.style.flexWrap = "wrap";
    diasBox.style.gap = "6px";
    diasBox.style.marginTop = "10px";

    diasSemana.forEach(dia => {
        const btnDia = document.createElement("button");
        btnDia.textContent = dia;
        btnDia.className = "btn-dia";
        btnDia.onclick = () => {
            btnDia.classList.toggle("ativo");
            btnDia.classList.contains("ativo")
                ? diasSelecionados.add(dia)
                : diasSelecionados.delete(dia);
        };
        diasBox.appendChild(btnDia);
    });

    wrap.appendChild(diasBox);

    const horarios = document.createElement("div");
    horarios.style.display = "flex";
    horarios.style.gap = "10px";
    horarios.style.marginTop = "10px";

    const inicio = document.createElement("input");
    inicio.type = "time";

    const fim = document.createElement("input");
    fim.type = "time";

    horarios.append(inicio, fim);
    wrap.append(horarios);

    wrap.getData = () => ({
        nome: nome.value,
        dias: [...diasSelecionados],
        hora_inicio: inicio.value,
        hora_fim: fim.value
    });

    return wrap;
}
/* ================= RANGE RAMAIS ================= */

window.criarRangeRamais = function () {
    const ini = parseInt(ramalInicio.value.replace(/\D/g, ""), 10);
    const fim = parseInt(ramalFim.value.replace(/\D/g, ""), 10);

    if (!ini || !fim) {
        mostrarToast("Informe o ramal inicial e final", true);
        return;
    }

    if (fim < ini) {
        mostrarToast("O ramal final não pode ser menor que o inicial", true);
        return;
    }

    const container = document.getElementById("listaRings");
    if (!container) return;

    // evita duplicar ramais já existentes
    const ramaisExistentes = new Set();
    container.querySelectorAll(".campo-nome").forEach(r => {
        if (r.value) ramaisExistentes.add(r.value);
    });

    for (let i = ini; i <= fim; i++) {
        const ramal = String(i);

        if (ramaisExistentes.has(ramal)) continue;

        const campo = criarCampo("ring");
        const inputRamal = campo.querySelector(".campo-nome");

        // garante só número
        inputRamal.value = ramal;
        inputRamal.addEventListener("input", () => {
            inputRamal.value = inputRamal.value.replace(/\D/g, "");
        });

        container.appendChild(campo);
    }

    syncTudo();
    mostrarToast("Ramais criados com sucesso");
};

/* ================= COLETAS NOVAS ================= */

function coletarPausas() {
  const container = document.getElementById("pausasConteudo");
  if (!container) return null;

  const nomeGrupo = document.getElementById("nomeGrupoPausas")?.value.trim();
  if (!nomeGrupo) return null;

  const pausas = [];

  document.querySelectorAll("#listaPausas .opcao-pausa").forEach(p => {
    const nome = p.querySelector("input[type=text]")?.value.trim();
    const tempo = p.querySelector("select")?.value;

    if (nome) {
      pausas.push({
        nome,
        tempo: tempo === "0" ? "Sem limite" : `${tempo} min`
      });
    }
  });

  if (!pausas.length) return null;

  return {
    grupo: nomeGrupo,
    itens: pausas
  };
} // ✅ ESSA CHAVE É O QUE FALTAVA

function coletarPesquisaSatisfacao() {
  const container = document.getElementById("pesquisaSatisfacaoConteudo");
  if (!container) return null;

  const nome = document.getElementById("pesquisaNome")?.value?.trim() || "";
  const introducao = document.getElementById("pesquisaAudioIntro")?.value?.trim() || "";
  const pergunta = document.getElementById("pesquisaPergunta")?.value?.trim() || "";
  const encerramento = document.getElementById("pesquisaAudioFim")?.value?.trim() || "";

  const respostas = [];

  document
    .querySelectorAll("#listaRespostasPesquisa .opcao-pesquisa")
    .forEach(r => {
      const nota = r.querySelector("input[type=number]")?.value;
      const desc = r.querySelector("input[type=text]")?.value?.trim();

      if (nota !== "" && desc) {
        respostas.push({
          nota: Number(nota),
          descricao: desc
        });
      }
    });

  if (!nome && !pergunta && respostas.length === 0) {
    return null;
  }

  if (!nome || !pergunta || respostas.length === 0) {
    return {
      ativa: false,
      nome,
      introducao,
      pergunta,
      encerramento,
      respostas
    };
  }

  return {
    ativa: true,
    nome,
    introducao,
    pergunta,
    encerramento,
    respostas
  };
}

function coletarURAs() {
  const uras = [];

  document.querySelectorAll("#listaURAs .campo-descricao").forEach(ura => {
    const nome = ura.querySelector(".campo-nome")?.value || "";
    const mensagem = ura.querySelector("textarea")?.value || "";

    const opcoes = [];
    ura.querySelectorAll(".opcao-ura").forEach(o => {
      const inputs = o.querySelectorAll("input");
      opcoes.push({
        tecla: inputs[0]?.value || "",
        destino: o.querySelector("select")?.value || "",
        descricao: inputs[1]?.value || ""
      });
    });

    if (nome) {
      uras.push({ nome, mensagem, opcoes });
    }
  });

  return uras;
}

function coletarGrupoRing() {
  const grupos = [];

  document.querySelectorAll("#listaGrupoRing .campo-descricao").forEach(g => {
    const nome = g.querySelector(".campo-nome")?.value.trim();

    // 🔥 LÊ DIRETAMENTE DO SELECT (não depende mais do dataset)
    const selectEstr = g.querySelector("select");
    const estrategiaSelecionada = selectEstr?.value || "";

    const ramais = JSON.parse(g.dataset.ramais || "[]");

    if (nome && ramais.length) {
      grupos.push({
        nome,
        estrategia: estrategiaSelecionada,
        ramais
      });
    }
  });

  return grupos;
}

function coletarEntradas() {
  const entradas = [];

  document.querySelectorAll("#listaEntradas .campo-descricao").forEach(e => {
    entradas.push({
      numero: e.querySelector(".campo-nome")?.value || ""
    });
  });

  return entradas;
}

/* ================= CHAT – COLETA FINAL ================= */

window.coletarChatDoDOM = function () {
  const numeroQr = document.getElementById("numeroQr");

  const chat = {
    tipo: window.chatState?.tipo || null,
    api: window.chatState?.api || null,
    conta: (numeroQr && numeroQr.value?.trim()) || window.chatState?.conta || null,
    canais: window.chatState?.canais || [],
    usuarios: [],
    agentes: [],
    departamentos: []
  };

  // usuários chat
  document.querySelectorAll("#listaUsuariosChat .campo-descricao").forEach(u => {
    chat.usuarios.push({
      nome: u.getNome?.() || "",
      email: u.getEmail?.() || "",
      senha: u.getSenha?.() || "",
      permissao: u.getPermissao?.() || ""
    });
  });

  // departamentos
  document.querySelectorAll("#listaDepartamentosChat .campo-descricao").forEach(d => {
    const nome = d.querySelector(".campo-nome")?.value || "";
    if (!nome) return;

    chat.departamentos.push({
      nome,
      agentes: JSON.parse(d.dataset.agentes || "[]")
    });
  });

  // agentes
  document.querySelectorAll("#listaAgentesChat .campo-descricao").forEach(a => {
    chat.agentes.push({
      nome: a.querySelector(".campo-nome")?.value || "",
      usuario: a.dataset.usuario || "",
      departamentos: JSON.parse(a.dataset.departamentos || "[]")
    });
  });

  return chat;
};

/* ================= MOTOR ================= */

function syncTudo() {
    gerarAgentesAPartirUsuarios();
    gerarAgentesChatAPartirUsuarios();
    atualizarSelectAgentesFila();
    atualizarSelectRamaisGrupo();
    atualizarTodosDestinosURA();
}

document.addEventListener("input", e => {
    if (e.target.closest(".campo-descricao")) syncTudo();
});
document.addEventListener("change", e => {
    if (e.target.closest(".campo-descricao")) syncTudo();
});

/* ================= TEMPLATE CSV USUÁRIOS WEB ================= */

window.baixarTemplateUsuarios = function () {
  const csv = [
    // Cabeçalho (coluna I = permissões)
    "usuario;email;senha;permissao;agente;;;;permissoes_validas",

    // Exemplo de preenchimento
    "teste;teste@empresa.com;Senha@12345;Agente de Call Center;sim",

    // Linha em branco
    "",

    // Lista de permissões (coluna I)
    ";;;;;;;;Administrador do Modulo de PABX",
    ";;;;;;;;Agente de Call Center",
    ";;;;;;;;Supervisor(a) de Call Center",
    ";;;;;;;;CRM",
    ";;;;;;;;CRM Owner",
    ";;;;;;;;Administrador do Modulo de Omnichannel",
    ";;;;;;;;Agente Omnichannel",
    ";;;;;;;;Supervisor(a) Omnichannel",
    ";;;;;;;;Super Administrador"
  ].join("\n");

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;"
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "template_usuarios_web.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
};

/* ================= TEMPLATE CSV RAMAIS ================= */

window.baixarTemplateRamais = function () {
  const csv = [
    "ramal;senha",
    "1001;Senha@12345"
  ].join("\n");

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;"
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "template_ramais.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
};

/* ================= IMPORTAÇÃO CSV ================= */

window.acionarImportacao = function (tipo) {
    const input = document.getElementById(
        tipo === "usuario_web" ? "importUsuarios" : "importRamais"
    );

    if (!input) return mostrarToast("Input de importação não encontrado", true);

    input.value = "";
    input.click();

    input.onchange = () => {
        const file = input.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = e => processarCSV(tipo, e.target.result);
        reader.readAsText(file);
    };
};

function processarCSV(tipo, texto) {
    const linhas = texto.replace(/\r/g, "").split("\n").filter(l => l.trim());
    if (linhas.length < 2) return mostrarToast("CSV vazio ou inválido", true);

    const sep = linhas[0].includes(";") ? ";" : ",";
    const header = linhas.shift().split(sep).map(h => h.trim().toLowerCase());
    const container = document.getElementById(listas[tipo]);
    if (!container) return;

    linhas.forEach(l => {
    const v = l.split(sep);
    const d = {};

    header.forEach((h, i) => {
        d[h] = (v[i] || "").trim();
    });

    // 🔒 AQUI É O AJUSTE (LINHA NOVA)
    // se não tiver dado real, ignora a linha
    if (
        !d.usuario &&
        !d.nome &&
        !d.email &&
        !d.ramal
    ) {
        return;
    }

    const campo = criarCampo(tipo);
    campo.querySelector(".campo-nome").value =
        d.usuario || d.nome || d.ramal || "";

    if (tipo === "usuario_web") {
        campo.querySelector("input[type=email]").value = d.email || "";
        campo.querySelector(".campo-senha").value = d.senha || "";

        const select = campo.querySelector("select");
        if (select && d.permissao) {
            [...select.options].forEach(opt => {
                if (opt.value.toLowerCase() === d.permissao.toLowerCase()) {
                    opt.selected = true;
                }
            });
        }

        if (d.agente === "1" || d.agente?.toLowerCase() === "sim") {
            campo.querySelector("input[type=checkbox]").checked = true;
        }
    }

    if (tipo === "ring") {
        campo.querySelector(".campo-senha").value = d.senha || "";
    }

    container.appendChild(campo);
});

    syncTudo();
    mostrarToast("CSV importado com sucesso!");
}

function mostrarToast(msg, error = false) {
    const t = document.getElementById("toastGlobal");
    const m = document.getElementById("toastMessage");

    if (!t || !m) {
        console.warn("Toast não encontrado:", msg);
        return;
    }

    m.textContent = msg;
    t.className = "toast show" + (error ? " error" : "");

    setTimeout(() => {
        t.classList.remove("show");
    }, 3000);
}

/* ================= SALVAR / EXPLORAR ================= */

window.explorar = function () {
  try {

    const empresa = document.getElementById("empresaCliente")?.value.trim();
    const dominio = document.getElementById("dominioCliente")?.value.trim();

    if (!empresa || !dominio) {
      mostrarToast("Preencha o nome da empresa e o domínio do cliente", true);
      return null;
    }

    if (!validarDominioCliente()) {
      mostrarToast("O domínio deve terminar com .sobreip.com.br", true);
      return null;
    }

    /* ================= USUÁRIOS ================= */

    const usuarios = [];
    document
    .querySelectorAll(`#${listas.usuario_web} .campo-descricao`)
    .forEach(u => {
      if (!u.getNome()) return;
  
      usuarios.push({
      nome: u.getNome(),
      email: u.getEmail(),
      senha: u.getSenha(),
      permissao: u.getPermissao(),
      agente_callcenter: u.isAgente(),
      agente_omnichannel: u.isAgenteOmni()
    });
  
    });
    /* ================= RAMAIS ================= */

    const ramais = [];
    document
      .querySelectorAll(`#${listas.ring} .campo-descricao`)
      .forEach(r => {
        if (!r.getNome()) return;

        ramais.push({
          ramal: r.getNome(),
          senha: r.getSenha()
        });
      });

    /* ================= AGENTES ================= */

    const agentes = [];
    document
      .querySelectorAll(`#${listas.agente} .campo-descricao`)
      .forEach(a => {
        const nome = a.querySelector(".campo-nome")?.value || "";
        if (!nome) return;

        agentes.push({
          nome,
          ramal: a.getRamal ? a.getRamal() : "",
          multiskill: a.isMultiskill ? a.isMultiskill() : false
        });
      });

    const agentesSemRamal = agentes.filter(a => !a.ramal);
    if (agentesSemRamal.length) {
      mostrarToast("Existe agente sem ramal vinculado.", true);
      return null;
    }

    /* ================= FILAS ================= */

    const filas = [];
    document
      .querySelectorAll(`#${listas.fila} .campo-descricao`)
      .forEach(f => {
        const nome = f.querySelector(".campo-nome")?.value.trim();
        const listaAg = JSON.parse(f.dataset.agentes || "[]");

        if (nome && listaAg.length) {
          filas.push({ nome, agentes: listaAg });
        }
      });

    /* ================= REGRAS DE TEMPO ================= */

    const regras_tempo = [];
    document
      .querySelectorAll(`#listaRegrasTempo .campo-descricao`)
      .forEach(r => {
        if (r.getData) {
          const data = r.getData();
          if (data.nome) regras_tempo.push(data);
        }
      });

    /* ================= OUTROS ================= */

    const grupo_ring = coletarGrupoRing() || [];
    const uras = coletarURAs() || [];
    const entradas = coletarEntradas() || [];

    const pausa = coletarPausas();
    const pausas = pausa ? [pausa] : [];

    const pesquisa = coletarPesquisaSatisfacao();
    const pesquisas = pesquisa ? [pesquisa] : [];

    /* ================= BASE VOZ ================= */

    const dados = {
      cliente: {
        empresa,
        dominio,
        cnpj: document.getElementById("cnpjCliente")?.value || ""
      },
      voz: {
        usuarios,
        ramais,
        agentes,
        filas,
        regras_tempo,
        uras,
        grupo_ring,
        entradas,
        pausas,
        pesquisas
      }
    };

    /* ================= CHAT (CORREÇÃO DEFINITIVA) ================= */

    let chat = null;

    if (window.chatState?.tipo === "api" || window.chatState?.tipo === "qr") {
      if (typeof window.coletarChatDoDOM === "function") {
        chat = window.coletarChatDoDOM();
      }
    }

    if (chat && chat.tipo) {
      dados.chat = chat;
    }

    /* ================= FINAL ================= */

    document.getElementById("resultado").textContent =
      JSON.stringify(dados, null, 2);

    mostrarToast("JSON gerado com sucesso!");
    return dados;

  } catch (e) {
    console.error(e);
    mostrarToast("Erro ao gerar JSON", true);
    return null;
  }
};

// ================= CHAT – SELECIONAR TIPO =================
window.selecionarTipoChat = function (el, tipo) {

  window.chatState = window.chatState || {};
  window.chatState.tipo = tipo;

  // remove seleção anterior
  document
    .querySelectorAll(".tipo-chat .chat-card")
    .forEach(c => c.classList.remove("active"));

  // marca o selecionado
  if (el) el.classList.add("active");

  // captura número do QR se existir
  const numeroQr = document.getElementById("numeroQr");

  if (numeroQr && numeroQr.value) {
    window.chatState.conta = numeroQr.value;
  }

  // controla visibilidade
  const apiBox = document.getElementById("api-oficial");
  const qrBox = document.getElementById("chat-qr");
  const blocoConta = document.getElementById("bloco-conta-api");
  const canais = document.getElementById("chat-canais");

  if (apiBox) apiBox.style.display = tipo === "api" ? "block" : "none";
  if (qrBox) qrBox.style.display = tipo === "qr" ? "block" : "none";

  if (blocoConta) blocoConta.style.display = "none";
  if (canais) canais.style.display = "none";

  console.log("Tipo de chat selecionado:", tipo);
};


// ================= CAPTURAR NÚMERO DO QR =================
document.addEventListener("DOMContentLoaded", () => {

  const numeroQr = document.getElementById("numeroQr");

  if (!numeroQr) return;

  numeroQr.addEventListener("input", function () {

    window.chatState = window.chatState || {};

    window.chatState.conta = this.value;

    console.log("Número QR atualizado:", window.chatState.conta);

  });

});

// ================= CHAT – SELECIONAR API =================
window.selecionarApi = function (el, api) {
    window.chatState = window.chatState || {};
    window.chatState.api = api;

    // remove seleção anterior
    document
        .querySelectorAll("#api-oficial .chat-card")
        .forEach(c => c.classList.remove("active"));

    // marca o atual
    el.classList.add("active");

    // mostra bloco de conta
    const blocoConta = document.getElementById("bloco-conta-api");
    if (blocoConta) blocoConta.style.display = "block";

    console.log("API selecionada:", api);
};

// ================= CHAT – SELECIONAR CONTA =================
window.selecionarConta = function (el, conta) {
    window.chatState = window.chatState || {};
    window.chatState.conta = conta;

    // remove seleção anterior
    document
        .querySelectorAll("#bloco-conta-api .chat-card")
        .forEach(c => c.classList.remove("active"));

    // marca o selecionado
    el.classList.add("active");

    // mostra canais
    const canais = document.getElementById("chat-canais");
    if (canais) canais.style.display = "block";

    console.log("Conta selecionada:", conta);
};

// ================= CHAT – TOGGLE CANAL =================
window.toggleCanal = function (el) {
    const canal = el.dataset.canal;

    window.chatState = window.chatState || {};
    if (!window.chatState.canais) {
        window.chatState.canais = [];
    }

    el.classList.toggle("active");

    if (el.classList.contains("active")) {
        if (!window.chatState.canais.includes(canal)) {
            window.chatState.canais.push(canal);
        }
    } else {
        window.chatState.canais =
            window.chatState.canais.filter(c => c !== canal);
    }

    console.log("Canais ativos:", window.chatState.canais);
};

// ================= CHAT – INFO AGENTE =================
window.informarAgenteChat = function () {
    mostrarToast(
        "Os agentes omnichannel são gerados automaticamente a partir dos usuários marcados como agente.",
        true
    );
};

// ================= SALVAR CONFIGURAÇÃO =================
window.salvarConfiguracao = function () {
  if (typeof explorar !== "function") {
    mostrarToast("Função explorar não encontrada", true);
    return;
  }

  const dados = explorar();

console.log("DADOS GERADOS:", dados);

if (!dados || !dados.voz) {
  mostrarToast("Nenhum dado de voz encontrado. Verifique os campos.", true);
  return;
}

  localStorage.setItem(
    "CONFIG_CADERNO",
    JSON.stringify(dados)
  );

  console.log("CONFIG_CADERNO salvo:", dados);
  window.location.href = "resumo.html";
};

// ================= VISIBILIDADE DO MÓDULO CHAT ================= 
function atualizarModuloChat() {
    const moduloChat = document.getElementById("modulochat");
    if (!moduloChat) return;

    const temChat =
        window.chatState?.tipo === "api" ||
        window.chatState?.tipo === "qr";

    moduloChat.style.display = temChat ? "block" : "none";
}

/* ================= EXPOSIÇÃO GLOBAL (HTML) ================= */

document.addEventListener("DOMContentLoaded", () => {
  const blocoAgentesChat =
    document.querySelector("#listaAgentesChat")?.parentElement;
  if (!blocoAgentesChat) return;

  // evita duplicar
  if (blocoAgentesChat.querySelector(".info-agente-chat")) return;

  const info = document.createElement("div");
  info.className = "info-agente-chat";
  info.style.marginTop = "8px";
  info.style.fontSize = "13px";
  info.style.color = "#666";

  info.textContent =
    "ℹ️ Os agentes omnichannel são gerados automaticamente a partir dos usuários marcados como agente.";

  blocoAgentesChat.insertBefore(info, blocoAgentesChat.children[1]);
});

/* ================= PAUSAS E PESQUISA (EXPOSIÇÃO HTML) ================= */

// Pausas do Call Center
window.togglePausas = togglePausas;
window.adicionarPausa = adicionarPausa;

// Pesquisa de Satisfação
window.togglePesquisaSatisfacao = togglePesquisaSatisfacao;
window.adicionarRespostaPesquisa = adicionarRespostaPesquisa;

/* ================= MODO ESCURO ================= */

(function initTema() {
  const btn = document.getElementById("toggleTheme");
  if (!btn) return;

  // aplica tema salvo
  const temaSalvo = localStorage.getItem("tema");
  if (temaSalvo === "dark") {
    document.body.classList.add("dark");
    btn.textContent = "☀️";
  } else {
    btn.textContent = "🌙";
  }

  // toggle no clique
  btn.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("tema", isDark ? "dark" : "light");
    btn.textContent = isDark ? "☀️" : "🌙";
  });
})();

// ================= INIT GLOBAL BLINDADO =================
window.initCaderno = function () {

  // 🔒 estado base do chat (NUNCA undefined)
  window.chatState = window.chatState || {
    tipo: null,
    api: null,
    conta: null,
    canais: [],
    usuarios: [],
    agentes: [],
    departamentos: []
  };

 const modo = localStorage.getItem("modo_atendimento");

  const usuariosChat = document.getElementById("listaUsuariosChat");

if (usuariosChat) {

  const cardUsuarios = usuariosChat.closest(".card");

  if (cardUsuarios) {

    // só mostra usuários omnichannel quando for SOMENTE chat
    if (modo === "chat") {
      cardUsuarios.style.display = "block";
    } else {
      cardUsuarios.style.display = "none";
    }

  }

}

  mostrarApp(modo);

  if (modo === "chat" || modo === "ambos") {
    if (typeof window.inicializarChatUI === "function") {
      window.inicializarChatUI();
    }
  }

  setTimeout(syncTudo, 200);
};

function bloquearLetrasRamalRange() {

  const inicio = document.getElementById("ramalInicio");
  const fim = document.getElementById("ramalFim");

  function validarInput(e) {

    const valorAntes = e.target.value;

    e.target.value = valorAntes.replace(/\D/g, "");

    if (valorAntes !== e.target.value) {
      mostrarToast("Digite apenas números para o ramal", true);
    }

  }

  if (inicio) {
    inicio.addEventListener("input", validarInput);
  }

  if (fim) {
    fim.addEventListener("input", validarInput);
  }

}

document.addEventListener("DOMContentLoaded", bloquearLetrasRamalRange);
