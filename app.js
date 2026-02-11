console.log("APP.JS FINAL – CONSOLIDADO DEFINITIVO (URA + REGRA DE TEMPO + FILA + GRUPO RING + AGENTES)");

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
        texto: "Nome e e-mail: utilizados para identificação e login no sistema."
      },
      {
        tipo: "campo",
        texto: "Senha: deve conter no mínimo 11 caracteres, com letra maiúscula, número e caractere especial."
      },
      {
        tipo: "lista",
        texto: "Permissões disponíveis:",
        itens: [
          "Administrador: acesso total às configurações do sistema.",
            
          "Supervisor: acompanha agentes e filas, sem alterar regras críticas.",

          "Operador: acesso básico, apenas operacional.",
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
        texto: "Exemplo: ramais no mesmo grupo permitem o uso do *8 para captura de chamadas em ring."
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
        texto: "Origem do agente: todo agente é criado a partir de um Usuário Web marcado como agente."
      },
      {
        tipo: "campo",
        texto: "Vínculo com ramal: todo agente deve obrigatoriamente estar associado a um ramal."
      },
      {
        tipo: "campo",
        texto: "Um agente pode participar de múltiplas filas simultaneamente."
      },
      {
        tipo: "alerta",
        texto: "Agentes sem ramal vinculado não conseguem receber chamadas."
      },
      {
        tipo: "exemplo",
        texto: "Exemplo: um agente pode atender as filas Comercial e Suporte ao mesmo tempo."
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
        texto: "Nome da fila: utilizado apenas para identificação."
      },
      {
        tipo: "campo",
        texto: "Agentes da fila: selecione os agentes que atenderão as chamadas."
      },
      {
        tipo: "campo",
        texto: "Distribuição de chamadas: ocorre conforme a estratégia definida no sistema."
      },
      {
        tipo: "alerta",
        texto: "Filas sem agentes configurados não realizam atendimento."
      },
      {
        tipo: "exemplo",
        texto: "Exemplo: uma fila de Suporte pode tocar para vários agentes ao mesmo tempo."
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
        tipo: "campo",
        texto: "Nome da regra: utilizado para identificar o horário configurado."
      },
      {
        tipo: "campo",
        texto: "Dias da semana: selecione os dias em que a regra será válida."
      },
      {
        tipo: "campo",
        texto: "Horário inicial e final: define o período de funcionamento."
      },
      {
        tipo: "alerta",
        texto: "Chamadas fora do horário definido devem ser direcionadas para outro destino."
      },
      {
        tipo: "exemplo",
        texto: "Exemplo: horário comercial de segunda a sexta, das 08:00 às 18:00."
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
        tipo: "campo",
        texto: "Mensagem: áudio ou texto reproduzido quando o cliente liga."
      },
      {
        tipo: "campo",
        texto: "Opções: cada tecla deve possuir um destino configurado."
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
      },
      {
        tipo: "alerta",
        texto: "URA sem opções configuradas não direciona chamadas corretamente."
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
        texto: "Tipo de integração: define se o atendimento será apenas Chat ou Voz + Chat."
      },
      {
        tipo: "campo",
        texto: "API e Conta: definem o provedor e a conta utilizada para integração."
      },
      {
        tipo: "campo",
        texto: "Canais: selecione quais canais digitais estarão ativos."
      },
      {
        tipo: "campo",
        texto: "Agentes Chat: devem obrigatoriamente estar vinculados a um departamento."
      },
      {
        tipo: "alerta",
        texto: "Agentes sem departamento configurado não conseguem atender chats."
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
        { id: "listaRings", label: "📞 Ramal", tipo: "ramal" },
        { id: "listaFilas", label: "👥 Fila", tipo: "fila" },
        { id: "listaGrupoRing", label: "🔔 Grupo de Ring", tipo: "grupo_ring" },
        { id: "listaURAs", label: "☎ URA", tipo: "ura" },
        { id: "listaRegrasTempo", label: "⏰ Regra de Tempo", tipo: "regra_tempo" }
    ];

    grupos.forEach(g => {
        const optgroup = document.createElement("optgroup");
        optgroup.label = g.label;

        document.querySelectorAll("#listaAgentes .campo-descricao").forEach(a => {
            agentes.push({
            nome: a.querySelector(".campo-nome")?.value || "",
            ramal: a.getRamal ? a.getRamal() : "",
            multiskill: a.isMultiskill ? a.isMultiskill() : false
        });
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
                "O ramal não pode iniciar com 0 e deve ter entre 3 e 6 dígitos.";
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

        if (v.length > 6) {
            nome.classList.add("campo-obrigatorio-erro");
            infoRamal.className = "regra-erro";
            infoRamal.textContent = "O ramal pode ter no máximo 6 dígitos.";
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

/* ================= MOTOR ================= */

function syncTudo() {
    gerarAgentesAPartirUsuarios();
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

window.explorar = function () {
    try {
        const empresa = document.getElementById("empresaCliente")?.value.trim();
        const dominio = document.getElementById("dominioCliente")?.value.trim();

        if (!empresa || !dominio) {
            mostrarToast("Preencha o nome da empresa e o domínio do cliente", true);
            return;
        }

        if (!validarDominioCliente()) {
            mostrarToast("O domínio deve obrigatoriamente terminar com .sobreip.com.br", true);
            dominioInput?.focus();
            return;
        }

        /* ================= VOZ ================= */

        const usuarios = [];
        document.querySelectorAll("#listaUsuariosWeb .campo-descricao").forEach(u => {
            usuarios.push({
                nome: u.getNome(),
                email: u.getEmail(),
                senha: u.getSenha(),
                permissao: u.getPermissao(),
                agente: u.isAgente()
            });
        });

        const ramais = [];
        document.querySelectorAll("#listaRings .campo-descricao").forEach(r => {
            ramais.push({
                ramal: r.getNome(),
                senha: r.getSenha()
            });
        });

        const agentes = [];
        document.querySelectorAll("#listaAgentes .campo-descricao").forEach(a => {
            agentes.push({
                nome: a.querySelector(".campo-nome")?.value || "",
                ramal: a.getRamal ? a.getRamal() : ""
            });
        });

        const agentesSemRamal = agentes.filter(a => !a.ramal);
        if (agentesSemRamal.length) {
            mostrarToast("Existe agente sem ramal vinculado", true);
            return;
        }

        const filas = [];
        document.querySelectorAll("#listaFilas .campo-descricao").forEach(f => {
            filas.push({
                nome: f.querySelector(".campo-nome")?.value || "",
                agentes: JSON.parse(f.dataset.agentes || "[]")
            });
        });

        const regras_tempo = [];
        document.querySelectorAll("#listaRegrasTempo .campo-descricao").forEach(r => {
            if (r.getData) regras_tempo.push(r.getData());
        });

       /* ================= CHAT (COLETA REAL – MODELO PABX) ================= */

        let chat = null;
        
        // só tenta salvar chat se a função existir
        if (typeof window.coletarChatDoDOM === "function") {
        
          const chatData = window.coletarChatDoDOM();
        
          const chatAtivo =
            chatData?.tipo ||
            chatData?.api ||
            chatData?.conta ||
            chatData?.canais?.length ||
            chatData?.departamentos?.length ||
            chatData?.agentes?.length;
        
          if (chatAtivo) {
        
            if (!chatData.departamentos?.length) {
              mostrarToast("Chat ativo sem departamentos", true);
              return;
            }
        
            if (!chatData.agentes?.length) {
              mostrarToast("Chat ativo sem agentes", true);
              return;
            }
        
            chatData.agentes.forEach(a => {
              if (!a.departamentos?.length) {
                mostrarToast(`Agente ${a.nome} sem departamento`, true);
                throw new Error("Agente sem departamento");
              }
              if (!a.usuario) {
                mostrarToast(`Agente ${a.nome} sem usuário`, true);
                throw new Error("Agente sem usuário");
              }
            });
        
            chat = {
              tipo: chatData.tipo || "",
              api: chatData.api || "",
              conta: chatData.conta || "",
              canais: chatData.canais || [],
              departamentos: chatData.departamentos,
              agentes: chatData.agentes
            };
          }
        }
    
        /* ================= JSON FINAL ================= */

        const dados = {
            cliente: { empresa, dominio },
            voz: {
                usuarios,
                ramais,
                agentes,
                filas,
                regras_tempo
            }
        };

        // 👉 SALVAR CHAT NO JSON
        if (chat) {
          dados.chat = chat;
        }
                
        document.getElementById("resultado").textContent =
            JSON.stringify(dados, null, 2);

        mostrarToast("JSON gerado com sucesso!");

    } catch (e) {
        console.error(e);
        mostrarToast("Erro ao gerar JSON", true);
    }
};

window.selecionarTipoChat = function (el, tipo) {
    window.chatState = window.chatState || {};
    window.chatState.tipo = tipo;

    document
        .querySelectorAll(".tipo-chat .chat-card, .chat-section .chat-card")
        .forEach(c => c.classList.remove("active"));

    el.classList.add("active");

    const apiBox = document.getElementById("api-oficial");
    const qrBox = document.getElementById("chat-qr");

    if (apiBox) apiBox.style.display = tipo === "api" ? "block" : "none";
    if (qrBox) qrBox.style.display = tipo === "qr" ? "block" : "none";

    atualizarModuloChat();
};

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
    // gera o JSON
    if (typeof explorar === "function") {
        explorar();
    }

    const resultado = document.getElementById("resultado")?.textContent;

    if (!resultado || !resultado.trim()) {
        mostrarToast("Gere a configuração antes de salvar", true);
        return;
    }

    localStorage.setItem("CONFIG_CADERNO", resultado);
    console.log("CONFIG_CADERNO salvo:", resultado);

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

window.adicionarCampo = window.adicionarCampo;
window.adicionarRegraTempo = window.adicionarRegraTempo;
window.criarRangeRamais = window.criarRangeRamais;
window.explorar = window.explorar;
window.salvarConfiguracao = window.salvarConfiguracao;

/* CHAT */
window.selecionarTipoChat = window.selecionarTipoChat;
window.selecionarApi = window.selecionarApi;
window.selecionarConta = window.selecionarConta;
window.toggleCanal = window.toggleCanal;
window.informarAgenteChat = window.informarAgenteChat;

document.addEventListener("DOMContentLoaded", () => {
  const blocoAgentesChat = document.querySelector("#listaAgentesChat")?.parentElement;
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
