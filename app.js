console.log("APP.JS v2 – TODOS OS AJUSTES APLICADOS");
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
  "Agente",
  "Supervisor",
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
      { tipo: "info",    texto: "Esses dados identificam a empresa dentro do sistema e são utilizados em autenticação, integrações e organização interna." },
      { tipo: "campo",   texto: "Nome da empresa: utilizado apenas para identificação do projeto." },
      { tipo: "campo",   texto: "Domínio do cliente: obrigatório. Deve seguir o padrão empresa.sobreip.com.br." },
      { tipo: "alerta",  texto: "Domínios inválidos impedem o funcionamento correto das integrações de voz e chat." },
      { tipo: "campo",   texto: "CNPJ: utilizado apenas para registro e controle interno." }
    ]
  },
  usuarios: {
    titulo: "Usuários Web",
    blocos: [
      { tipo: "info",  texto: "Usuários Web são as pessoas que terão acesso ao painel administrativo do sistema." },
      { tipo: "campo", texto: "Nome e e-mail: utilizados para identificação." },
      { tipo: "campo", texto: "Senha: deve conter no mínimo 11 caracteres, com letra maiúscula, número e caractere especial." },
      {
        tipo: "lista",
        texto: "Permissões disponíveis e suas funções:",
        itens: [
          "Administrador do Módulo de PABX: acesso total às configurações de voz.",
          "Agente: utilizado para usuários que realizam atendimento telefônico.",
          "Supervisor: pode acompanhar Agentes de call center e Ramais administrativos.",
          "CRM: acesso ao módulo de CRM, sem permissões administrativas.",
          "CRM Owner: acesso total ao módulo de CRM.",
          "Administrador do Módulo de Omnichannel: acesso total às configurações de chat.",
          "Agente Omnichannel: utilizado para usuários que realizam atendimento via chat.",
          "Supervisor(a) Omnichannel: pode acompanhar agentes e atendimentos do chat.",
          "Super Administrador: acesso total a todos os módulos."
        ]
      },
      { tipo: "alerta", texto: "Evite conceder permissão de Administrador para usuários que não são responsáveis técnicos." },
      { tipo: "campo",  texto: "Marcar como Agente: permite que o usuário atenda chamadas e exige vínculo obrigatório com um ramal." }
    ]
  },
  ramais: {
    titulo: "Ramais",
    blocos: [
      { tipo: "info",    texto: "Ramais são os pontos de atendimento telefônico utilizados para realizar e receber chamadas." },
      { tipo: "campo",   texto: "Número do ramal: deve conter apenas números e será usado para chamadas internas." },
      { tipo: "campo",   texto: "Senha do ramal: gerada automaticamente no padrão seguro. Você pode editá-la se necessário." },
      { tipo: "campo",   texto: "Grupo de chamada: permite organização e captura de chamadas entre ramais." },
      { tipo: "exemplo", texto: "Ramais no mesmo grupo permitem o uso do *8 para captura de chamadas." }
    ]
  },
  agentes: {
    titulo: "Agentes",
    blocos: [
      { tipo: "info",   texto: "Agentes são os usuários responsáveis por atender chamadas telefônicas e atendimentos digitais." },
      { tipo: "campo",  texto: "Todo agente é criado a partir de um Usuário Web marcado como agente." },
      { tipo: "campo",  texto: "Todo agente deve obrigatoriamente estar associado a um ramal." },
      { tipo: "alerta", texto: "Agentes sem ramal vinculado não conseguem receber chamadas." }
    ]
  },
  filas: {
    titulo: "Filas",
    blocos: [
      { tipo: "info",   texto: "Filas organizam o atendimento distribuindo chamadas entre vários agentes." },
      { tipo: "alerta", texto: "Filas sem agentes configurados não realizam atendimento." },
      { tipo: "campo",  texto: "Adicione ao menos um agente com ramal vinculado para que a fila funcione corretamente." }
    ]
  },
  regrasTempo: {
    titulo: "Regras de Tempo",
    blocos: [
      { tipo: "info",    texto: "Regras de Tempo definem os dias e horários em que o atendimento estará ativo." },
      { tipo: "campo",   texto: "Selecione os dias da semana e defina o horário de início e fim do atendimento." },
      { tipo: "exemplo", texto: "Segunda a sexta, das 08:00 às 18:00." },
      { tipo: "alerta",  texto: "Chamadas fora do horário configurado podem ser redirecionadas para caixa postal ou outra URA." }
    ]
  },
  ura: {
    titulo: "URA",
    blocos: [
      { tipo: "info",  texto: "A URA é o atendimento automático responsável por direcionar as chamadas dos clientes." },
      { tipo: "campo", texto: "Mensagem: texto ou áudio que o cliente ouve ao entrar na URA." },
      {
        tipo: "lista",
        texto: "Destinos possíveis para cada opção:",
        itens: [
          "Ramal: direciona direto para um ramal específico.",
          "Fila: distribui entre vários agentes. (aparece como 'Nome (Fila)')",
          "Grupo de Ring: toca vários ramais simultaneamente ou em sequência. (aparece como 'Nome (Grupo)')",
          "Outra URA: encadeia menus.",
          "Regra de Tempo: define comportamento por horário."
        ]
      },
      { tipo: "campo", texto: "Timeout: destino para quando o cliente não pressionar nenhuma tecla. Se não definido, a chamada será desconectada." },
      { tipo: "alerta", texto: "Toda opção de tecla precisa ter um destino configurado para funcionar." }
    ]
  },
  chat: {
    titulo: "Chat / Omnichannel",
    blocos: [
      { tipo: "info",    texto: "O módulo de Chat permite atendimento por canais digitais integrados ao sistema." },
      { tipo: "campo",   texto: "Tipo de integração: escolha entre API Oficial (Meta, 360 Dialog, Gupshup) ou QR Code." },
      { tipo: "campo",   texto: "Agentes omnichannel devem obrigatoriamente estar vinculados a um departamento." },
      { tipo: "alerta",  texto: "Sem departamento configurado, o agente não consegue atender chats." },
      { tipo: "exemplo", texto: "Exemplo: crie o departamento 'Suporte' e adicione os agentes responsáveis por atendimento digital." }
    ]
  },
  fluxo: {
    titulo: "Editor de Fluxo",
    blocos: [
      { tipo: "info",    texto: "O editor de fluxo permite visualizar graficamente as conexões entre URAs, filas, ramais e regras de tempo." },
      { tipo: "campo",   texto: "Para adicionar um nó: arraste um elemento da barra lateral para a tela." },
      { tipo: "campo",   texto: "Para conectar dois nós: clique no ponto de saída (●) de um nó e arraste até o ponto de entrada (●) de outro." },
      { tipo: "campo",   texto: "Para excluir uma conexão: clique na linha de conexão e pressione Delete ou Backspace." },
      { tipo: "campo",   texto: "Para mover um nó: clique e arraste o bloco para a posição desejada." },
      { tipo: "alerta",  texto: "O fluxo é salvo automaticamente junto com as configurações. Não é necessário salvar separadamente." },
      { tipo: "exemplo", texto: "Exemplo de fluxo: Entrada → URA Principal → Fila de Suporte → Agentes." }
    ]
  }
};

/* ================= MODAL DÚVIDAS ================= */
const CATEGORIAS_DUVIDA = [
  { chave: "cliente",     icone: "🏢", label: "Cliente"    },
  { chave: "usuarios",    icone: "👤", label: "Usuários"   },
  { chave: "ramais",      icone: "📞", label: "Ramais"     },
  { chave: "agentes",     icone: "🎧", label: "Agentes"    },
  { chave: "filas",       icone: "👥", label: "Filas"      },
  { chave: "regrasTempo", icone: "⏰", label: "Reg. Tempo" },
  { chave: "ura",         icone: "☎️",  label: "URA"        },
  { chave: "chat",        icone: "💬", label: "Chat"       },
  { chave: "fluxo",       icone: "🔀", label: "Fluxo"      },
];

function renderizarBotoesCategorias() {
  const container = document.getElementById("categoriasDuvida");
  if (!container) return;
  container.innerHTML = "";
  CATEGORIAS_DUVIDA.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "btn-categoria";
    btn.dataset.chave = cat.chave;
    btn.innerHTML = `<span class="cat-icone">${cat.icone}</span>${cat.label}`;
    btn.onclick = () => {
      container.querySelectorAll(".btn-categoria").forEach(b => b.classList.remove("ativo"));
      btn.classList.add("ativo");
      renderizarDuvidas(cat.chave);
    };
    container.appendChild(btn);
  });
}

window.abrirModalDuvidas = function () {
  const overlay = document.getElementById("modalDuvidasOverlay");
  if (!overlay) return;
  renderizarBotoesCategorias();
  const corpo = document.getElementById("conteudoDuvida");
  if (corpo) {
    corpo.innerHTML = `
      <div class="duvida-placeholder">
        <span>🗂️</span>
        Selecione uma categoria acima para ver as dúvidas
      </div>`;
  }
  overlay.classList.add("aberto");
  document.body.style.overflow = "hidden";
};

window.fecharModalDuvidas = function () {
  const overlay = document.getElementById("modalDuvidasOverlay");
  if (!overlay) return;
  overlay.classList.remove("aberto");
  document.body.style.overflow = "";
};

window.fecharModalDuvidasOverlay = function (e) {
  if (e.target === document.getElementById("modalDuvidasOverlay")) {
    fecharModalDuvidas();
  }
};

document.addEventListener("keydown", e => {
  if (e.key === "Escape") fecharModalDuvidas();
});

function renderizarDuvidas(chave) {
  const container = document.getElementById("conteudoDuvida");
  if (!container) return;
  container.innerHTML = "";
  const dados = DUVIDAS[chave];
  if (!dados) return;

  const titulo = document.createElement("p");
  titulo.className = "duvida-titulo";
  titulo.textContent = dados.titulo;
  container.appendChild(titulo);

  dados.blocos.forEach(bloco => {
    const el = document.createElement("div");
    el.className = `duvida-bloco duvida-${bloco.tipo}`;
    if (bloco.tipo === "lista") {
      el.innerHTML = `
        <strong>${bloco.texto}</strong>
        <ul>${bloco.itens.map(item => `<li>${item}</li>`).join("")}</ul>
      `;
    } else {
      el.textContent = bloco.texto;
    }
    container.appendChild(el);
  });
}

window.toggleDuvidas = window.abrirModalDuvidas;

/* ================= DADOS DO CLIENTE ================= */
const dominioInput = document.getElementById("dominioCliente");
const regraDominio = document.getElementById("regraDominio");
window.validarDominioCliente = function () {
    if (!dominioInput) return true;
    const v = dominioInput.value.trim().toLowerCase();
    const ok = v.endsWith(".sobreip.com.br") && v.length > ".sobreip.com.br".length;
    dominioInput.classList.toggle("campo-obrigatorio-erro", !ok);
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

/* ================= SENHA AUTOMÁTICA PARA RAMAIS ================= */
function gerarSenhaRamal() {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghjkmnpqrstuvwxyz";
  const digits = "23456789";
  const special = "@#$!";
  const all = upper + lower + digits + special;
  let senha = "";
  senha += upper[Math.floor(Math.random() * upper.length)];
  senha += lower[Math.floor(Math.random() * lower.length)];
  senha += digits[Math.floor(Math.random() * digits.length)];
  senha += digits[Math.floor(Math.random() * digits.length)];
  senha += special[Math.floor(Math.random() * special.length)];
  for (let i = 5; i < 11; i++) {
    senha += all[Math.floor(Math.random() * all.length)];
  }
  return senha.split("").sort(() => Math.random() - 0.5).join("");
}

/* ================= ADICIONAR CAMPO ================= */
window.adicionarCampo = function (tipo) {
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
// FIX #1: Toggle mostra/oculta o bloco; campos ficam sempre dentro
let _pesquisaAberta = false;
function togglePesquisaSatisfacao() {
  const container = document.getElementById("pesquisaSatisfacaoConteudo");
  if (!container) return;
  if (container._iniciado) {
    container.style.display = container.style.display === "none" ? "block" : "none";
    return;
  }
  container._iniciado = true;
  container.style.display = "block";
  container.appendChild(criarBlocoPesquisa());
}

function criarBlocoPesquisa() {
  const wrap = document.createElement("div");
  wrap.className = "campo-descricao";

  const nome = document.createElement("input");
  nome.id = "pesquisaNome";
  nome.placeholder = "Ex: Pesquisa de Atendimento Telefônico";

  const audioIntro = document.createElement("textarea");
  audioIntro.id = "pesquisaAudioIntro";
  audioIntro.placeholder = "Ex: Sua opinião é muito importante para nós.";

  const pergunta = document.createElement("textarea");
  pergunta.id = "pesquisaPergunta";
  pergunta.placeholder = "Ex: De 0 a 5, como você avalia nosso atendimento?";

  const listaRespostas = document.createElement("div");
  listaRespostas.className = "listaRespostasPesquisa";

  const btnAddResposta = document.createElement("button");
  btnAddResposta.className = "btn-add";
  btnAddResposta.textContent = "+";
  btnAddResposta.onclick = () => listaRespostas.appendChild(criarRespostaPesquisa());

  const dica = document.createElement("p");
  dica.style.cssText = "opacity:.7;font-size:13px";
  dica.textContent = "Ex: 0-Péssimo | 1-Ruim | 2-Regular | 3-Bom | 4-Muito Bom | 5-Excelente";

  const audioFim = document.createElement("textarea");
  audioFim.id = "pesquisaAudioFim";
  audioFim.placeholder = "Ex: Obrigado por participar da nossa pesquisa.";

  const btn = document.createElement("button");
  btn.textContent = "✖";
  btn.style.cssText = "float:right;width:auto;min-height:auto;padding:4px 8px;font-size:12px;background:#f3f4f6;border:1px solid #d1d5db;color:#6b7280;border-radius:6px;cursor:pointer;";
  btn.onclick = () => wrap.remove();

  wrap.append(nome, audioIntro, pergunta, listaRespostas, btnAddResposta, dica, audioFim, btn);
  return wrap;
}

/* ================= PAUSAS DO CALL CENTER ================= */
// FIX #1: Toggle mostra/oculta o bloco; não remove campos
function togglePausas() {
  const container = document.getElementById("pausasConteudo");
  if (!container) return;
  const modo = localStorage.getItem("modo_atendimento");
  if (modo === "chat") {
    mostrarToast("Pausas são exclusivas do Call Center (Voz)", true);
    return;
  }
  if (container._iniciado) {
    container.style.display = container.style.display === "none" ? "block" : "none";
    return;
  }
  container._iniciado = true;
  container.style.display = "block";
  container.appendChild(criarBlocoPausas());
}

function criarBlocoPausas() {
  const wrap = document.createElement("div");
  wrap.className = "campo-descricao";

  const btn = document.createElement("button");
  btn.textContent = "✖";
  btn.style.cssText = "float:right;";
  btn.onclick = () => wrap.remove();

  const nomeGrupo = document.createElement("input");
  nomeGrupo.placeholder = "Ex: Pausas Operacionais";

  const listaPausas = document.createElement("div");

  const btnAddPausa = document.createElement("button");
  btnAddPausa.className = "btn-add";
  btnAddPausa.textContent = "+";
  btnAddPausa.onclick = () => listaPausas.appendChild(criarPausa());

  wrap.append(nomeGrupo, listaPausas, btnAddPausa, btn);
  return wrap;
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
  del.textContent = "✖";
  del.onclick = () => wrap.remove();

  wrap.append(nome, timeout, del);
  return wrap;
}

/* ================= DESTINOS URA (FIX #8: diferenciar Fila vs Grupo) ================= */
function atualizarDestinosURA(select) {
  if (!select) return;
  select.innerHTML = "";
  select.add(new Option("Selecione o destino", ""));

  // Ramais
  const grpRamal = document.createElement("optgroup");
  grpRamal.label = "📞 Ramal";
  document.querySelectorAll(`#listaRings .campo-descricao`).forEach(el => {
    const nome = el.getNome?.() || el.querySelector(".campo-nome")?.value;
    if (nome) grpRamal.appendChild(new Option(nome, `ramal::${nome}`));
  });
  if (grpRamal.children.length) select.appendChild(grpRamal);

  // Filas — label com "(Fila)" para diferenciar
  const grpFila = document.createElement("optgroup");
  grpFila.label = "👥 Fila";
  document.querySelectorAll(`#listaFilas .campo-descricao`).forEach(el => {
    const nome = el.getNome?.() || el.querySelector(".campo-nome")?.value;
    if (nome) grpFila.appendChild(new Option(`${nome} (Fila)`, `fila::${nome}`));
  });
  if (grpFila.children.length) select.appendChild(grpFila);

  // Grupos de Ring — label com "(Grupo)" para diferenciar
  const grpRing = document.createElement("optgroup");
  grpRing.label = "🔔 Grupo de Ring";
  document.querySelectorAll(`#listaGrupoRing .campo-descricao`).forEach(el => {
    const nome = el.getNome?.() || el.querySelector(".campo-nome")?.value;
    if (nome) grpRing.appendChild(new Option(`${nome} (Grupo)`, `grupo::${nome}`));
  });
  if (grpRing.children.length) select.appendChild(grpRing);

  // URAs
  const grpURA = document.createElement("optgroup");
  grpURA.label = "☎ URA";
  document.querySelectorAll(`#listaURAs .campo-descricao`).forEach(el => {
    const nome = el.getNome?.() || el.querySelector(".campo-nome")?.value;
    if (nome) grpURA.appendChild(new Option(nome, `ura::${nome}`));
  });
  if (grpURA.children.length) select.appendChild(grpURA);

  // Regras de Tempo
  const grpRT = document.createElement("optgroup");
  grpRT.label = "⏰ Regra de Tempo";
  document.querySelectorAll(`#listaRegrasTempo .campo-descricao`).forEach(el => {
    const nome = el.getNome?.() || el.querySelector(".campo-nome")?.value;
    if (nome) grpRT.appendChild(new Option(nome, `regra::${nome}`));
  });
  if (grpRT.children.length) select.appendChild(grpRT);
}

function atualizarTodosDestinosURA() {
    document.querySelectorAll(".opcao-ura select, .ura-destino, .ura-timeout-select").forEach(select => {
        const atual = select.value;
        // Para timeout select, adicionar opção "Desconectar"
        if (select.classList.contains("ura-timeout-select")) {
            atualizarSelectTimeout(select, atual);
        } else {
            atualizarDestinosURA(select);
            select.value = atual;
        }
    });
}

/* FIX #3: Timeout da URA */
function atualizarSelectTimeout(select, valorAtual) {
  select.innerHTML = "";
  select.add(new Option("Selecione o Destino de Timeout", ""));
  const grupos = [
    { id: "listaRings",     label: "📞 Ramal",        prefix: "ramal::" },
    { id: "listaFilas",     label: "👥 Fila",          prefix: "fila::",  suffix: " (Fila)" },
    { id: "listaGrupoRing", label: "🔔 Grupo de Ring", prefix: "grupo::", suffix: " (Grupo)" },
    { id: "listaURAs",      label: "☎ URA",           prefix: "ura::" },
    { id: "listaRegrasTempo", label: "⏰ Regra de Tempo", prefix: "regra::" },
  ];
  grupos.forEach(g => {
    const optgroup = document.createElement("optgroup");
    optgroup.label = g.label;
    document.querySelectorAll(`#${g.id} .campo-descricao`).forEach(el => {
      const nome = el.getNome?.() || el.querySelector(".campo-nome")?.value;
      if (nome) {
        const label = nome + (g.suffix || "");
        optgroup.appendChild(new Option(label, g.prefix + nome));
      }
    });
    if (optgroup.children.length) select.appendChild(optgroup);
  });
  if (valorAtual) select.value = valorAtual;
}

/* ================= CRIAR CAMPO ================= */
function ramalJaExiste(valor, atual) {
    let existe = false;
    document.querySelectorAll("#listaRings .campo-nome").forEach(r => {
        if (r === atual) return;
        if (r.value === valor && valor !== "") existe = true;
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
        ura:         "Digite o nome da sua URA",
        entrada:     "Digite o número de entrada",
        fila:        "Digite o nome da sua fila",
        ring:        "Digite o número do ramal",
        grupo_ring:  "Digite o nome do grupo de ring",
        agente:      "Digite o nome do agente"
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
    let permissao  = null;
    let regras     = null;
    let chkAgente  = null;
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
        boxAgente.style.cssText = "display:flex;align-items:center;gap:6px;margin-top:8px;";
        chkAgente = document.createElement("input");
        chkAgente.type = "checkbox";
        chkAgente.addEventListener("change", () => syncTudo());
        const txt = document.createElement("span");
        txt.textContent = "Este usuário é agente de call center";
        boxAgente.append(chkAgente, txt);
        wrap.append(boxAgente);
        const boxOmni = document.createElement("label");
        boxOmni.style.cssText = "display:flex;align-items:center;gap:6px;margin-top:6px;";
        const modo = localStorage.getItem("modo_atendimento");
        if (modo !== "ambos") boxOmni.style.display = "none";
        chkAgenteOmni = document.createElement("input");
        chkAgenteOmni.type = "checkbox";
        chkAgenteOmni.classList.add("checkbox-omni");
        chkAgenteOmni.addEventListener("change", () => syncTudo());
        const txtOmni = document.createElement("span");
        txtOmni.textContent = "Este usuário é agente omnichannel";
        boxOmni.append(chkAgenteOmni, txtOmni);
        wrap.append(boxOmni);
        regras = document.createElement("div");
        regras.style.marginTop = "8px";
        wrap.append(regras);
        senhaInput.oninput = () => validarSenha(senhaInput, regras);
    }

    /* ===== RAMAL (FIX #2: senha automática) ===== */
    if (tipo === "ring") {
        nome.style.width = "260px";
        nome.style.maxWidth = "100%";
        nome.type = "text";
        nome.inputMode = "numeric";
        nome.placeholder = "Digite o número do ramal";
        nome.onkeypress = function (e) {
            if (!/[0-9]/.test(String.fromCharCode(e.which))) e.preventDefault();
        };
        const infoRamal = document.createElement("div");
        infoRamal.className = "regra-neutra";
        infoRamal.style.marginTop = "6px";
        infoRamal.textContent = "O ramal não pode iniciar com 0 e deve ter entre 3 e 5 dígitos.";
        nome.addEventListener("input", () => {
            nome.value = nome.value.replace(/\D/g, "");
            const v = nome.value;
            if (!v.length) {
                nome.classList.remove("campo-obrigatorio-erro");
                infoRamal.className = "regra-neutra";
                infoRamal.textContent = "O ramal não pode iniciar com 0 e deve ter entre 3 e 5 dígitos.";
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

        // FIX #2: Gerar senha automática
        senhaInput = document.createElement("input");
        senhaInput.placeholder = "Senha do ramal";
        senhaInput.classList.add("campo-senha");
        senhaInput.style.marginTop = "12px";
        senhaInput.value = gerarSenhaRamal(); // Senha auto
        wrap.append(senhaInput);

        regras = document.createElement("div");
        regras.style.marginTop = "8px";
        wrap.append(regras);
        // Validar a senha gerada automaticamente
        validarSenha(senhaInput, regras);
        senhaInput.oninput = () => validarSenha(senhaInput, regras);
        wrap.append(infoRamal);
    }

    /* ===== URA (restaurado com opções acima do timeout) ===== */
    if (tipo === "ura") {
        const msg = document.createElement("textarea");
        msg.placeholder = "Mensagem da URA Ex: Olá seja bem-vindo...";
        msg.style.marginTop = "12px";
        wrap.append(msg);
    
        // ⌨️ Opções da URA (acima do timeout)
        const secOpcoes = document.createElement("div");
        secOpcoes.style.marginTop = "14px";
        const titulo = document.createElement("div");
        titulo.innerHTML = "⌨️ <strong>Opções da URA</strong>";
        titulo.style.cssText = "font-size:13px;font-weight:700;margin-bottom:8px;color:var(--text-soft)";
        secOpcoes.append(titulo);
        const hdr = document.createElement("div");
        hdr.className = "ura-opcoes-header";
        hdr.innerHTML = "<span>Tecla</span><span>Destino</span><span>Descrição</span><span></span>";
        secOpcoes.append(hdr);
        const listaOpcoes = document.createElement("div");
        secOpcoes.append(listaOpcoes);
        const btnNova = document.createElement("button");
        btnNova.innerHTML = "+ Nova opção";
        btnNova.className = "btn-add-faixa";
        btnNova.onclick = () => listaOpcoes.appendChild(criarOpcaoURA());
        secOpcoes.append(btnNova);
        wrap.append(secOpcoes);
    
        // Destino de timeout (sem campo de segundos)
        const timeoutRow = document.createElement("div");
        timeoutRow.style.cssText = "margin-top:12px;";
    
        const timeoutLabel = document.createElement("label");
        timeoutLabel.style.cssText = "font-size:12px;font-weight:700;color:var(--text-soft);display:block;margin-bottom:6px;";
        timeoutLabel.textContent = "Caso nenhuma tecla seja pressionada, direcionar para:";
    
        const timeoutDest = document.createElement("select");
        timeoutDest.className = "ura-timeout-select";
        timeoutDest.style.cssText = "width:100%;min-height:36px;border-radius:8px;font-size:13px;padding:6px 10px;";
        atualizarSelectTimeout(timeoutDest, "");
    
        timeoutRow.append(timeoutLabel, timeoutDest);
        wrap.append(timeoutRow);
    
        wrap.getTimeout = () => ({
            segundos: "0",
            destino: timeoutDest.value || ""
        });
    }
  
    /* ===== FILA (FIX #7: seleção de agentes corrigida) ===== */
    if (tipo === "fila") {
        const titulo = document.createElement("h4");
        titulo.textContent = "Agentes da fila";
        titulo.style.marginTop = "12px";
        wrap.append(titulo);

        const linhaAdd = document.createElement("div");
        linhaAdd.style.cssText = "display:flex;gap:8px;margin-bottom:8px;";
        const select = document.createElement("select");
        select.style.flex = "1";
        select.innerHTML = `<option value="">Selecione um agente</option>`;
        const btnAdd = document.createElement("button");
        btnAdd.textContent = "Adicionar agente";
        btnAdd.style.whiteSpace = "nowrap";
        linhaAdd.append(select, btnAdd);
        wrap.append(linhaAdd);

        const lista = document.createElement("div");
        lista.className = "fila-agentes-lista";
        wrap.append(lista);
        wrap.dataset.agentes = "[]";

        function getJaAdicionados() {
            return JSON.parse(wrap.dataset.agentes || "[]");
        }

        function refreshSelect() {
            const jaAdicionados = getJaAdicionados();
            const valorAtual = select.value;
            select.innerHTML = `<option value="">Selecione um agente</option>`;
            document.querySelectorAll("#listaAgentes .campo-descricao").forEach(a => {
                const nomeA = a.querySelector(".campo-nome")?.value;
                const ramal = a.getRamal ? a.getRamal() : "";
                if (nomeA && !jaAdicionados.includes(nomeA)) {
                    const label = ramal ? `${nomeA} (${ramal})` : `${nomeA} (sem ramal)`;
                    select.add(new Option(label, nomeA));
                }
            });
            if ([...select.options].some(o => o.value === valorAtual)) {
                select.value = valorAtual;
            }
        }

        function render() {
            lista.innerHTML = "";
            getJaAdicionados().forEach((a, i) => {
                const d = document.createElement("div");
                d.style.cssText = "display:flex;align-items:center;justify-content:space-between;padding:6px 10px;background:rgba(0,255,163,0.06);border:1px solid rgba(0,255,163,0.15);border-radius:8px;margin-bottom:6px;font-size:13px;";
                d.textContent = a;
                const x = document.createElement("button");
                x.textContent = "✖";
                x.style.cssText = "background:transparent;border:none;color:#fca5a5;cursor:pointer;min-height:auto;padding:2px 6px;";
                x.onclick = () => {
                    const arr = JSON.parse(wrap.dataset.agentes);
                    arr.splice(i, 1);
                    wrap.dataset.agentes = JSON.stringify(arr);
                    render();
                };
                d.append(x);
                lista.append(d);
            });
            refreshSelect();
        }

        btnAdd.onclick = () => {
            if (!select.value) return mostrarToast("Selecione um agente", true);
            const arr = JSON.parse(wrap.dataset.agentes);
            if (!arr.includes(select.value)) {
                arr.push(select.value);
                wrap.dataset.agentes = JSON.stringify(arr);
            }
            render();
        };

        wrap.refreshFilaSelect = refreshSelect;
        wrap.getNome = () => nome.value;
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

    /* ===== NÚMERO DE ENTRADA ===== */
    if (tipo === "entrada") {
        nome.placeholder = "Ex: (11) 3000-1000 ou (11) 99999-0000";
        nome.inputMode   = "numeric";

        const feedbackEl = document.createElement("div");
        feedbackEl.className = "entrada-feedback";
        wrap.append(feedbackEl);

        const DDDS_VALIDOS = new Set([
            11,12,13,14,15,16,17,18,19,
            21,22,24,27,28,
            31,32,33,34,35,37,38,
            41,42,43,44,45,46,47,48,49,
            51,53,54,55,
            61,62,63,64,65,66,67,68,69,
            71,73,74,75,77,79,
            81,82,83,84,85,86,87,88,89,
            91,92,93,94,95,96,97,98,99
        ]);

        function formatarEntrada(val) {
            let digits = val.replace(/\D/g, "").slice(0, 11);
            if (digits.length <= 2)  return digits;
            if (digits.length <= 6)  return `(${digits.slice(0,2)}) ${digits.slice(2)}`;
            if (digits.length <= 10) return `(${digits.slice(0,2)}) ${digits.slice(2,6)}-${digits.slice(6)}`;
            return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`;
        }

        function validarEntrada(val) {
            const digits = val.replace(/\D/g, "");
            if (!digits) return { ok: null, msg: "" };
            const ddd    = parseInt(digits.slice(0, 2), 10);
            const numero = digits.slice(2);
            if (digits.length < 10)
                return { ok: false, msg: "Número incompleto — mínimo 10 dígitos com DDD" };
            if (digits.length > 11)
                return { ok: false, msg: "Número muito longo — máximo 11 dígitos com DDD" };
            if (!DDDS_VALIDOS.has(ddd))
                return { ok: false, msg: `DDD ${ddd} inválido — não existe no Brasil` };
            if (digits.length === 11 && numero[0] !== "9")
                return { ok: false, msg: "Celular com 11 dígitos deve começar com 9" };
            if (digits.length === 10 && !["2","3","4","5"].includes(numero[0]))
                return { ok: false, msg: "Fixo com 10 dígitos deve começar com 2, 3, 4 ou 5" };
            const tipo_num = digits.length === 11 ? "Celular" : "Fixo";
            return { ok: true, msg: `✓ ${tipo_num} — DDD ${ddd} válido` };
        }

        function atualizarEntrada() {
            nome.value = formatarEntrada(nome.value);
            const { ok, msg } = validarEntrada(nome.value);
            if (ok === null) {
                feedbackEl.className = "entrada-feedback";
                feedbackEl.textContent = "";
                nome.classList.remove("campo-valido", "campo-obrigatorio-erro");
            } else if (ok) {
                feedbackEl.className = "entrada-feedback entrada-ok";
                feedbackEl.textContent = msg;
                nome.classList.add("campo-valido");
                nome.classList.remove("campo-obrigatorio-erro");
            } else {
                feedbackEl.className = "entrada-feedback entrada-erro";
                feedbackEl.textContent = "✗ " + msg;
                nome.classList.add("campo-obrigatorio-erro");
                nome.classList.remove("campo-valido");
            }
        }

        nome.addEventListener("input", atualizarEntrada);
        nome.addEventListener("blur",  atualizarEntrada);
    }

    function validarSenha(input, regrasEl) {
        if (!regrasEl) return;
        const v = input.value || "";
        const temMin      = v.length >= 11;
        const temMaiuscula = /[A-Z]/.test(v);
        const temNumero   = /\d/.test(v);
        const temEspecial = /[^A-Za-z0-9]/.test(v);
        const ok = temMin && temMaiuscula && temNumero && temEspecial;
        regrasEl.innerHTML = ok
            ? `<div class="regra-ok">Senha válida</div>`
            : `<div class="regra-erro">Mín. 11 | Maiúscula | Número | Especial</div>`;
    }
    wrap.getNome      = () => nome.value;
    wrap.getEmail     = () => emailInput?.value || "";
    wrap.getSenha     = () => senhaInput?.value || "";
    wrap.getPermissao = () => permissao?.value || "";
    wrap.isAgente     = () => chkAgente     ? chkAgente.checked     : false;
    wrap.isAgenteOmni = () => chkAgenteOmni ? chkAgenteOmni.checked : false;
    return wrap;
}

/* ================= HELPER: extrair nome real do valor prefixado ================= */
function extrairNomeDestino(valor) {
    if (!valor) return "";
    if (valor.includes("::")) return valor.split("::")[1];
    return valor; // Compatibilidade com dados antigos
}

function extrairTipoDestino(valor) {
    if (!valor) return "";
    if (valor.includes("::")) return valor.split("::")[0];
    return ""; // sem prefixo = desconhecido
}

/* ================= OPÇÃO URA ================= */
function criarOpcaoURA() {
    const wrap = document.createElement("div");
    wrap.className = "opcao-ura-row";
    const tecla = document.createElement("input");
    tecla.placeholder = "Tecla";
    tecla.className = "ura-tecla";
    tecla.maxLength = 2;
    const destino = document.createElement("select");
    destino.className = "ura-destino";
    atualizarDestinosURA(destino);
    const desc = document.createElement("input");
    desc.placeholder = "Descrição (ex: Suporte, Financeiro)";
    desc.className = "ura-desc";
    const del = document.createElement("button");
    del.innerHTML = "✕";
    del.className = "ura-del";
    del.title = "Remover opção";
    del.onclick = () => {
        wrap.style.opacity = "0";
        wrap.style.transform = "translateX(8px)";
        setTimeout(() => wrap.remove(), 180);
    };
    wrap.append(tecla, destino, desc, del);
    return wrap;
}

/* ================= AGENTES AUTOMÁTICOS ================= */
function gerarAgentesAPartirUsuarios() {
    const listaAgentes = document.getElementById("listaAgentes");
    if (!listaAgentes) return;

    const estadoSalvo = {};
    listaAgentes.querySelectorAll(".campo-descricao").forEach(a => {
        const nome = a.querySelector(".campo-nome")?.value;
        if (!nome) return;
        estadoSalvo[nome] = {
            ramal:      a.getRamal     ? a.getRamal()     : "",
            multiskill: a.isMultiskill ? a.isMultiskill() : false,
        };
    });

    listaAgentes.innerHTML = "";

    document.querySelectorAll("#listaUsuariosWeb .campo-descricao").forEach(u => {
        if (!u.isAgente || !u.isAgente() || !u.getNome()) return;

        const wrap = document.createElement("div");
        wrap.className = "campo-descricao";

        const linha = document.createElement("div");
        linha.className = "linha-principal";
        const nomeInput = document.createElement("input");
        nomeInput.value    = u.getNome();
        nomeInput.disabled = true;
        nomeInput.className = "campo-nome";
        linha.append(nomeInput);
        wrap.append(linha);

        const selectRamal = document.createElement("select");
        selectRamal.innerHTML = `<option value="">Ramal (obrigatório)</option>`;
        document.querySelectorAll("#listaRings .campo-descricao").forEach(r => {
            if (r.getNome()) selectRamal.add(new Option(r.getNome(), r.getNome()));
        });

        const salvo = estadoSalvo[u.getNome()];
        if (salvo?.ramal) selectRamal.value = salvo.ramal;
        wrap.append(selectRamal);

        const btnMultiskill = document.createElement("button");
        btnMultiskill.textContent    = "Multiskill";
        btnMultiskill.className      = "btn-multiskill";
        const multiskillAtivo = salvo?.multiskill === true;
        btnMultiskill.dataset.ativo  = multiskillAtivo.toString();
        if (multiskillAtivo) btnMultiskill.classList.add("ativo");

        btnMultiskill.onclick = () => {
            const ativo = btnMultiskill.dataset.ativo === "true";
            btnMultiskill.dataset.ativo = (!ativo).toString();
            btnMultiskill.classList.toggle("ativo", !ativo);
        };
        wrap.append(btnMultiskill);

        wrap.isMultiskill = () => btnMultiskill.dataset.ativo === "true";
        wrap.getRamal     = () => selectRamal.value;
        listaAgentes.append(wrap);
    });
}

function gerarAgentesChatAPartirUsuarios() {
    const lista = document.getElementById("listaAgentesChat");
    if (!lista) return;

    const agentesEncontrados = new Map();

    document.querySelectorAll("#listaUsuariosWeb .campo-descricao").forEach(u => {
        const nome    = u.querySelector(".campo-nome")?.value?.trim();
        const chkOmni = u.querySelector(".checkbox-omni");
        if (chkOmni && chkOmni.checked && nome) agentesEncontrados.set(nome, true);
    });

    document.querySelectorAll("#listaUsuariosChat .campo-descricao").forEach(u => {
        const nome = u.querySelector(".campo-nome")?.value?.trim();
        const chk  = u.querySelector("input[type=checkbox]");
        if (chk && chk.checked && nome && !agentesEncontrados.has(nome)) {
            agentesEncontrados.set(nome, true);
        }
    });

    lista.innerHTML = "";

    agentesEncontrados.forEach((_, nome) => {
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
    });
}

/* ================= SELECTS DINÂMICOS ================= */
function atualizarSelectAgentesFila() {
    document.querySelectorAll("#listaFilas .campo-descricao").forEach(fila => {
        if (typeof fila.refreshFilaSelect === "function") {
            fila.refreshFilaSelect();
        }
    });
}

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
    if (!container) return mostrarToast("Lista de regras de tempo não encontrada", true);
    container.appendChild(criarRegraTempo());
    atualizarTodosDestinosURA();
    syncTudo();
};
function criarFaixaHoraria() {
    const row = document.createElement("div");
    row.className = "faixa-horaria-row";
    const label = document.createElement("span");
    label.className = "faixa-label";
    label.textContent = "Das";
    const inicio = document.createElement("input");
    inicio.type = "time";
    inicio.className = "faixa-time";
    const sep = document.createElement("span");
    sep.className = "faixa-sep";
    sep.textContent = "às";
    const fim = document.createElement("input");
    fim.type = "time";
    fim.className = "faixa-time";
    const del = document.createElement("button");
    del.innerHTML = "✕";
    del.className = "faixa-del";
    del.title = "Remover horário";
    del.onclick = () => {
        if (row.parentElement.querySelectorAll(".faixa-horaria-row").length <= 1) return;
        row.style.opacity = "0";
        setTimeout(() => row.remove(), 180);
    };
    row.append(label, inicio, sep, fim, del);
    row.getHorario = () => ({ inicio: inicio.value, fim: fim.value });
    return row;
}

function criarRegraTempo() {
    const wrap = document.createElement("div");
    wrap.className = "campo-descricao regra-tempo-card";
    const linhaTopo = document.createElement("div");
    linhaTopo.className = "linha-principal";
    const nome = document.createElement("input");
    nome.placeholder = "Nome da regra (ex: Horário Comercial)";
    nome.className = "campo-nome";
    const btnDel = document.createElement("button");
    btnDel.innerHTML = "✕";
    btnDel.className = "btn-del-regra";
    btnDel.onclick = () => {
        wrap.style.opacity = "0";
        wrap.style.transform = "translateY(-4px)";
        setTimeout(() => { wrap.remove(); atualizarTodosDestinosURA(); }, 180);
    };
    linhaTopo.append(nome, btnDel);
    wrap.append(linhaTopo);

    const diasSemana = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
    const diasCompletos = ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"];
    const diasSelecionados = new Set();
    const diasBox = document.createElement("div");
    diasBox.className = "dias-semana-box";

    diasSemana.forEach((dia, idx) => {
        const btnDia = document.createElement("button");
        btnDia.textContent = dia;
        btnDia.className = "btn-dia";
        btnDia.title = diasCompletos[idx];
        btnDia.type = "button";
        btnDia.onclick = () => {
            btnDia.classList.toggle("ativo");
            const diaCompleto = diasCompletos[idx];
            btnDia.classList.contains("ativo")
                ? diasSelecionados.add(diaCompleto)
                : diasSelecionados.delete(diaCompleto);
        };
        diasBox.appendChild(btnDia);
    });

    const atalhos = document.createElement("div");
    atalhos.className = "dias-atalhos";
    const atalhosList = [
        { label: "Seg–Sex", dias: ["Segunda","Terça","Quarta","Quinta","Sexta"] },
        { label: "Seg–Sáb", dias: ["Segunda","Terça","Quarta","Quinta","Sexta","Sábado"] },
        { label: "Todos",   dias: ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"] },
        { label: "Limpar",  dias: [] },
    ];
    atalhosList.forEach(a => {
        const btn = document.createElement("button");
        btn.textContent = a.label;
        btn.className = "btn-atalho-dia";
        btn.type = "button";
        btn.onclick = () => {
            diasSelecionados.clear();
            diasBox.querySelectorAll(".btn-dia").forEach((b, i) => {
                const dc = diasCompletos[i];
                if (a.dias.includes(dc)) { b.classList.add("ativo"); diasSelecionados.add(dc); }
                else b.classList.remove("ativo");
            });
        };
        atalhos.appendChild(btn);
    });

    wrap.append(diasBox, atalhos);

    const faixasLabel = document.createElement("div");
    faixasLabel.className = "faixas-titulo";
    faixasLabel.innerHTML = "🕐 Faixas de horário";

    const faixasContainer = document.createElement("div");
    faixasContainer.className = "faixas-container";
    faixasContainer.appendChild(criarFaixaHoraria());

    const btnAddFaixa = document.createElement("button");
    btnAddFaixa.className = "btn-add-faixa";
    btnAddFaixa.type = "button";
    btnAddFaixa.innerHTML = "+ Adicionar faixa de horário";
    btnAddFaixa.onclick = () => faixasContainer.appendChild(criarFaixaHoraria());

    wrap.append(faixasLabel, faixasContainer, btnAddFaixa);

    wrap.getData = () => {
        const faixas = [];
        faixasContainer.querySelectorAll(".faixa-horaria-row").forEach(r => {
            if (r.getHorario) {
                const h = r.getHorario();
                if (h.inicio || h.fim) faixas.push(h);
            }
        });
        const primeira = faixas[0] || {};
        return {
            nome:        nome.value,
            dias:        [...diasSelecionados],
            hora_inicio: primeira.inicio || "",
            hora_fim:    primeira.fim    || "",
            faixas:      faixas,
        };
    };
    return wrap;
}

/* ================= RANGE RAMAIS ================= */
window.criarRangeRamais = function () {
    const ini = parseInt(ramalInicio.value.replace(/\D/g, ""), 10);
    const fim = parseInt(ramalFim.value.replace(/\D/g, ""), 10);
    if (!ini || !fim) return mostrarToast("Informe o ramal inicial e final", true);
    if (fim < ini)    return mostrarToast("O ramal final não pode ser menor que o inicial", true);
    const container = document.getElementById("listaRings");
    if (!container) return;
    const ramaisExistentes = new Set();
    container.querySelectorAll(".campo-nome").forEach(r => { if (r.value) ramaisExistentes.add(r.value); });
    for (let i = ini; i <= fim; i++) {
        const ramal = String(i);
        if (ramaisExistentes.has(ramal)) continue;
        const campo      = criarCampo("ring");
        const inputRamal = campo.querySelector(".campo-nome");
        inputRamal.value = ramal;
        inputRamal.addEventListener("input", () => { inputRamal.value = inputRamal.value.replace(/\D/g, ""); });
        container.appendChild(campo);
    }
    syncTudo();
    mostrarToast("Ramais criados com sucesso");
};

/* ================= COLETAS ================= */
function coletarPausas() {
  const container = document.getElementById("pausasConteudo");
  if (!container) return null;
  const nomeGrupo = document.getElementById("nomeGrupoPausas")?.value.trim();
  if (!nomeGrupo) return null;
  const pausas = [];
  document.querySelectorAll("#listaPausas .opcao-pausa").forEach(p => {
    const nome  = p.querySelector("input[type=text]")?.value.trim();
    const tempo = p.querySelector("select")?.value;
    if (nome) pausas.push({ nome, tempo: tempo === "0" ? "Sem limite" : `${tempo} min` });
  });
  if (!pausas.length) return null;
  return { grupo: nomeGrupo, itens: pausas };
}
function coletarPesquisaSatisfacao() {
  const container = document.getElementById("pesquisaSatisfacaoConteudo");
  if (!container) return null;
  const nome        = document.getElementById("pesquisaNome")?.value?.trim()        || "";
  const introducao  = document.getElementById("pesquisaAudioIntro")?.value?.trim()  || "";
  const pergunta    = document.getElementById("pesquisaPergunta")?.value?.trim()    || "";
  const encerramento = document.getElementById("pesquisaAudioFim")?.value?.trim()  || "";
  const respostas = [];
  document.querySelectorAll("#listaRespostasPesquisa .opcao-pesquisa").forEach(r => {
    const nota = r.querySelector("input[type=number]")?.value;
    const desc = r.querySelector("input[type=text]")?.value?.trim();
    if (nota !== "" && desc) respostas.push({ nota: Number(nota), descricao: desc });
  });
  if (!nome && !pergunta && respostas.length === 0) return null;
  if (!nome || !pergunta || respostas.length === 0) return { ativa: false, nome, introducao, pergunta, encerramento, respostas };
  return { ativa: true, nome, introducao, pergunta, encerramento, respostas };
}

/* FIX #8: Coleta URAs com destino prefixado + timeout */
function coletarURAs() {
  const uras = [];
  document.querySelectorAll("#listaURAs .campo-descricao").forEach(ura => {
    const nome     = ura.querySelector(".campo-nome")?.value || "";
    const mensagem = ura.querySelector("textarea")?.value    || "";
    const opcoes   = [];
    ura.querySelectorAll(".opcao-ura-row").forEach(o => {
      const tecla   = o.querySelector(".ura-tecla")?.value   || "";
      const destinoRaw = o.querySelector(".ura-destino")?.value || "";
      const descricao = o.querySelector(".ura-desc")?.value   || "";
      if (tecla || destinoRaw) {
        opcoes.push({
          tecla,
          destino: destinoRaw,               // valor prefixado (fila::nome)
          destinoDisplay: formatarDestinoDisplay(destinoRaw), // para exibição no PDF
          descricao
        });
      }
    });
    // Timeout
    const timeout = ura.getTimeout ? ura.getTimeout() : { segundos: "0", destino: "" };
    if (nome) uras.push({ nome, mensagem, opcoes, timeout });
  });
  return uras;
}

function formatarDestinoDisplay(valorPrefixado) {
  if (!valorPrefixado) return "";
  if (!valorPrefixado.includes("::")) return valorPrefixado;
  const [tipo, nome] = valorPrefixado.split("::");
  switch(tipo) {
    case "fila":   return `${nome} (Fila)`;
    case "grupo":  return `${nome} (Grupo)`;
    case "ramal":  return nome;
    case "ura":    return nome;
    case "regra":  return nome;
    default:       return nome;
  }
}

function coletarGrupoRing() {
  const grupos = [];
  document.querySelectorAll("#listaGrupoRing .campo-descricao").forEach(g => {
    const nome               = g.querySelector(".campo-nome")?.value.trim();
    const selectEstr         = g.querySelector("select");
    const estrategiaSelecionada = selectEstr?.value || "";
    const ramais             = JSON.parse(g.dataset.ramais || "[]");
    if (nome && ramais.length) grupos.push({ nome, estrategia: estrategiaSelecionada, ramais });
  });
  return grupos;
}
function coletarEntradas() {
  const entradas = [];
  document.querySelectorAll("#listaEntradas .campo-descricao").forEach(e => {
    entradas.push({ numero: e.querySelector(".campo-nome")?.value || "" });
  });
  return entradas;
}

/* ================= CHAT – COLETA FINAL ================= */
window.coletarChatDoDOM = function () {
  const tiposAtivos = window._tiposAtivos || new Set();
  let contaApi = window.chatState?.conta || null;
  const numerosQr = (window.chatState?.numeros_qr || []).filter(Boolean);
  let contaQr = numerosQr.length ? (numerosQr.length === 1 ? numerosQr[0] : numerosQr) : null;
  let contaFinal = null;
  if (tiposAtivos.has("api") && tiposAtivos.has("qr")) {
    contaFinal = { api: contaApi, qr: contaQr };
  } else if (tiposAtivos.has("qr")) {
    contaFinal = contaQr;
  } else {
    contaFinal = contaApi;
  }
  const chat = {
    tipo:          window.chatState?.tipo  || null,
    api:           window.chatState?.api   || null,
    conta:         contaFinal,
    numero_qr:     numerosQr,
    canais:        window.chatState?.canais || [],
    usuarios:      [],
    agentes:       [],
    departamentos: []
  };
  document.querySelectorAll("#listaUsuariosChat .campo-descricao").forEach(u => {
    chat.usuarios.push({ nome: u.getNome?.() || "", email: u.getEmail?.() || "", senha: u.getSenha?.() || "", permissao: u.getPermissao?.() || "" });
  });
  document.querySelectorAll("#listaDepartamentosChat .campo-descricao").forEach(d => {
    const nome = d.querySelector(".campo-nome")?.value || "";
    if (!nome) return;
    chat.departamentos.push({ nome, agentes: JSON.parse(d.dataset.agentes || "[]") });
  });
  document.querySelectorAll("#listaAgentesChat .campo-descricao").forEach(a => {
    chat.agentes.push({ nome: a.querySelector(".campo-nome")?.value || "", usuario: a.dataset.usuario || "", departamentos: JSON.parse(a.dataset.departamentos || "[]") });
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
document.addEventListener("input",  e => { if (e.target.closest(".campo-descricao")) syncTudo(); });
document.addEventListener("change", e => { if (e.target.closest(".campo-descricao")) syncTudo(); });

/* ================= TEMPLATE CSV ================= */
window.baixarTemplateUsuarios = function () {
  const csv = [
    "usuario;email;senha;permissao;agente;;;;permissoes_validas",
    "teste;teste@empresa.com;Senha@12345;Agente de Call Center;sim"
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = "template_usuarios_web.csv";
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
};
window.baixarTemplateRamais = function () {
  const csv  = ["ramal;senha","1001;Senha@12345"].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = "template_ramais.csv";
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
};

/* ================= IMPORTAÇÃO CSV ================= */
window.acionarImportacao = function (tipo) {
    const input = document.getElementById(tipo === "usuario_web" ? "importUsuarios" : "importRamais");
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
    const sep    = linhas[0].includes(";") ? ";" : ",";
    const header = linhas.shift().split(sep).map(h => h.trim().toLowerCase());
    const container = document.getElementById(listas[tipo]);
    if (!container) return;
    linhas.forEach(l => {
        const v = l.split(sep);
        const d = {};
        header.forEach((h, i) => { d[h] = (v[i] || "").trim(); });
        if (!d.usuario && !d.nome && !d.email && !d.ramal) return;
        const campo = criarCampo(tipo);
        campo.querySelector(".campo-nome").value = d.usuario || d.nome || d.ramal || "";
        if (tipo === "usuario_web") {
            campo.querySelector("input[type=email]").value = d.email || "";
            campo.querySelector(".campo-senha").value = d.senha || "";
            const select = campo.querySelector("select");
            if (select && d.permissao) {
                [...select.options].forEach(opt => { if (opt.value.toLowerCase() === d.permissao.toLowerCase()) opt.selected = true; });
            }
            if (d.agente === "1" || d.agente?.toLowerCase() === "sim") {
                campo.querySelector("input[type=checkbox]").checked = true;
            }
        }
        if (tipo === "ring") {
          // Na importação CSV, se a senha estiver no CSV use ela, senão mantém a gerada
          if (d.senha) campo.querySelector(".campo-senha").value = d.senha;
        }
        container.appendChild(campo);
    });
    syncTudo();
    mostrarToast("CSV importado com sucesso!");
}

function mostrarToast(msg, error = false) {
    const t = document.getElementById("toastGlobal");
    const m = document.getElementById("toastMessage");
    if (!t || !m) { console.warn("Toast não encontrado:", msg); return; }
    m.textContent = msg;
    t.className = "toast show" + (error ? " error" : "");
    setTimeout(() => t.classList.remove("show"), 3000);
}

/* =======================================================
   LIMPAR TUDO
======================================================= */
function _limparTudoInterno() {
  localStorage.removeItem("CONFIG_CADERNO");
  localStorage.removeItem("CONFIG_CADERNO_BACKUPS");
  localStorage.removeItem("modo_atendimento");
  sessionStorage.removeItem("CADERNO_EDIT_ANCORA");

  ["empresaCliente","dominioCliente","cnpjCliente"].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.value = ""; el.dispatchEvent(new Event("input")); }
  });

  ["listaUsuariosWeb","listaRings","listaEntradas","listaAgentes",
   "listaFilas","listaGrupoRing","listaURAs","listaRegrasTempo","listaRegrasTempoChat",
   "listaPausas","listaRespostasPesquisa",
   "listaUsuariosChat","listaAgentesChat","listaDepartamentosChat",
   "listaNumeroQr"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = "";
  });

  const blPausas = document.getElementById("pausasConteudo");
  const blPesq   = document.getElementById("pesquisaSatisfacaoConteudo");
  if (blPausas) blPausas.style.display = "none";
  if (blPesq)   blPesq.style.display   = "none";
  _pesquisaAberta = false;
  _pausasAberta = false;

  ["pesquisaNome","pesquisaAudioIntro","pesquisaPergunta","pesquisaAudioFim",
   "nomeGrupoPausas"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });

  window.chatState = { tipo: null, api: null, conta: null, canais: [], usuarios: [], agentes: [], departamentos: [] };
  window._tiposAtivos = new Set();

  document.querySelectorAll(".chat-card.active").forEach(c => c.classList.remove("active"));
  document.querySelectorAll(".chat-tipo-bloco").forEach(b => b.style.display = "none");
  const blocoApi = document.getElementById("bloco-conta-api");
  const blocoCanais = document.getElementById("chat-canais");
  if (blocoApi)    blocoApi.style.display    = "none";
  if (blocoCanais) blocoCanais.style.display = "none";
}

window.resetarIntro = function () {
  const raw = localStorage.getItem("CONFIG_CADERNO");
  const temDados = raw && raw !== "null" && raw !== "{}";
  if (temDados) {
    _abrirModalLimpar();
  } else {
    _executarResetarIntro();
  }
};

function _executarResetarIntro() {
  _limparTudoInterno();
  if (typeof window._irParaIntro === "function") {
    window._irParaIntro();
    return;
  }
  const introEl = document.getElementById("intro-screen");
  const appEl   = document.getElementById("app-content");
  if (introEl) introEl.style.display = "flex";
  if (appEl)   appEl.style.display   = "none";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

window.limparTudoCaderno = function () {
  _abrirModalLimpar();
};

function _abrirModalLimpar() {
  let modal = document.getElementById("modalLimpar");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "modalLimpar";
    modal.style.cssText = `
      position:fixed;inset:0;background:rgba(0,0,0,0.65);backdrop-filter:blur(4px);
      z-index:9100;display:flex;align-items:center;justify-content:center;
      opacity:0;pointer-events:none;transition:opacity 0.2s ease;
    `;
    modal.innerHTML = `
      <div style="
        background:var(--card-bg);border:1px solid var(--border);border-radius:20px;
        width:420px;max-width:92vw;padding:28px 28px 22px;
        box-shadow:0 30px 80px rgba(0,0,0,0.5);
        transform:scale(0.96);transition:transform 0.2s ease;
      " id="modalLimparBox">
        <div style="font-size:38px;text-align:center;margin-bottom:12px;">🗑️</div>
        <h3 style="margin:0 0 10px;text-align:center;font-size:18px;font-weight:800;color:var(--text)">
          Limpar tudo?
        </h3>
        <p style="margin:0 0 22px;text-align:center;font-size:13px;color:var(--text-soft);line-height:1.6">
          Isso vai apagar <strong>todos os dados</strong> preenchidos e voltar para a tela inicial.<br>
          Essa ação não pode ser desfeita.
        </p>
        <div style="display:flex;gap:10px;justify-content:center;">
          <button onclick="fecharModalLimpar()" style="
            padding:11px 24px;border-radius:10px;border:1px solid var(--border);
            background:transparent;color:var(--text);font-weight:700;font-size:13px;cursor:pointer;
          ">Cancelar</button>
          <button onclick="_confirmarLimpar()" style="
            padding:11px 24px;border-radius:10px;border:none;
            background:linear-gradient(90deg,#ef4444,#dc2626);
            color:#fff;font-weight:800;font-size:13px;cursor:pointer;
          ">Sim, limpar tudo</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener("click", e => { if (e.target === modal) fecharModalLimpar(); });
  }
  modal.style.opacity = "1";
  modal.style.pointerEvents = "all";
  const box = document.getElementById("modalLimparBox");
  if (box) box.style.transform = "scale(1)";
}

window.fecharModalLimpar = function () {
  const modal = document.getElementById("modalLimpar");
  if (!modal) return;
  modal.style.opacity = "0";
  modal.style.pointerEvents = "none";
  const box = document.getElementById("modalLimparBox");
  if (box) box.style.transform = "scale(0.96)";
};

window._confirmarLimpar = function () {
  fecharModalLimpar();
  setTimeout(() => {
    _executarResetarIntro();
    mostrarToast("Caderno limpo com sucesso!");
  }, 200);
};

/* ================= EXPLORAR / SALVAR ================= */
window.explorar = function () {
  try {
    window.chatState = window.chatState || {};
    const empresa = document.getElementById("empresaCliente")?.value.trim();
    const dominio = document.getElementById("dominioCliente")?.value.trim();
    if (!empresa || !dominio) { mostrarToast("Preencha o nome da empresa e o domínio do cliente", true); return null; }
    if (!validarDominioCliente()) { mostrarToast("O domínio deve terminar com .sobreip.com.br", true); return null; }
    const usuarios = [];
    document.querySelectorAll(`#${listas.usuario_web} .campo-descricao`).forEach(u => {
      if (!u.getNome()) return;
      usuarios.push({ nome: u.getNome(), email: u.getEmail(), senha: u.getSenha(), permissao: u.getPermissao(), agente_callcenter: u.isAgente(), agente_omnichannel: u.isAgenteOmni() });
    });
    const ramais = [];
    document.querySelectorAll(`#${listas.ring} .campo-descricao`).forEach(r => {
      if (!r.getNome()) return;
      ramais.push({ ramal: r.getNome(), senha: r.getSenha() });
    });
    const agentes = [];
    document.querySelectorAll(`#${listas.agente} .campo-descricao`).forEach(a => {
      const nome = a.querySelector(".campo-nome")?.value || "";
      if (!nome) return;
      agentes.push({ nome, ramal: a.getRamal ? a.getRamal() : "", multiskill: a.isMultiskill ? a.isMultiskill() : false });
    });
    const agentesSemRamal = agentes.filter(a => !a.ramal);
    if (agentesSemRamal.length) { mostrarToast("Existe agente sem ramal vinculado.", true); return null; }
    const filas = [];
    document.querySelectorAll(`#${listas.fila} .campo-descricao`).forEach(f => {
      const nome    = f.querySelector(".campo-nome")?.value.trim();
      const listaAg = JSON.parse(f.dataset.agentes || "[]");
      if (nome && listaAg.length) filas.push({ nome, agentes: listaAg });
    });
    const regras_tempo = [];
    document.querySelectorAll(`#listaRegrasTempo .campo-descricao`).forEach(r => {
      if (r.getData) { const data = r.getData(); if (data.nome) regras_tempo.push(data); }
    });
    const grupo_ring = coletarGrupoRing() || [];
    const uras       = coletarURAs()      || [];
    const entradas   = coletarEntradas()  || [];
    const pausa      = coletarPausas();
    const pausas     = pausa   ? [pausa]   : [];
    const pesquisa   = coletarPesquisaSatisfacao();
    const pesquisas  = pesquisa ? [pesquisa] : [];
    const dados = {
      cliente: { empresa, dominio, cnpj: document.getElementById("cnpjCliente")?.value || "" },
      voz:     { usuarios, ramais, agentes, filas, regras_tempo, uras, grupo_ring, entradas, pausas, pesquisas }
    };
    const numeroQr = document.getElementById("numeroQr");
    if (numeroQr && numeroQr.value.trim()) { window.chatState = window.chatState || {}; window.chatState.conta = numeroQr.value.trim(); }
    let chat = null;
    if (window.chatState?.tipo === "api" || window.chatState?.tipo === "qr") {
      chat = typeof window.coletarChatDoDOM === "function" ? window.coletarChatDoDOM() : {};
      const nqr = document.getElementById("numeroQr");
      if (nqr && nqr.value.trim()) chat.conta = nqr.value.trim();
      if (window.chatState?.conta) chat.conta = window.chatState.conta;
    }
    const modo = localStorage.getItem("modo_atendimento");
    if (modo === "chat" || modo === "ambos") {
      if (!chat) chat = {};
      chat.regras_tempo = coletarRegrasTempoChat();
      dados.chat = chat;
    }

    try {
      const anterior = JSON.parse(localStorage.getItem("CONFIG_CADERNO") || "{}");
      if (anterior.chat) {
        if (!dados.chat) dados.chat = {};
        if (anterior.chat.fluxos?.length) {
          dados.chat.fluxos       = anterior.chat.fluxos;
          dados.chat.fluxo        = anterior.chat.fluxo;
          dados.chat.fluxo_imagem = anterior.chat.fluxo_imagem;
        }
      }
    } catch(_e) {}

    if (!window._explorarSilencioso) mostrarToast("Configuração gerada com sucesso!");
    return dados;
  } catch (e) {
    console.error(e);
    mostrarToast("Erro ao gerar configuração", true);
    return null;
  }
};

/* ================= CHAT TIPO / API / CONTA / CANAL ================= */
window._tiposAtivos = window._tiposAtivos || new Set();

function _atualizarBlocosTipo() {
  const s     = window._tiposAtivos;
  const apiBox = document.getElementById("api-oficial");
  const qrBox  = document.getElementById("chat-qr");
  if (apiBox) apiBox.style.display = s.has("api") ? "block" : "none";
  if (qrBox)  qrBox.style.display  = s.has("qr")  ? "block" : "none";
  window.chatState = window.chatState || {};
  if (s.has("api") && s.has("qr")) window.chatState.tipo = "ambos";
  else if (s.has("api"))            window.chatState.tipo = "api";
  else if (s.has("qr"))             window.chatState.tipo = "qr";
  else                              window.chatState.tipo = null;
  if (!s.has("api")) {
    const bc = document.getElementById("bloco-conta-api");
    const ca = document.getElementById("chat-canais");
    if (bc) bc.style.display = "none";
    if (ca) ca.style.display = "none";
  }
}

window.toggleTipoChat = function (el, tipo) {
  window.chatState = window.chatState || {};
  window._tiposAtivos = window._tiposAtivos || new Set();
  if (window._tiposAtivos.has(tipo)) {
    window._tiposAtivos.delete(tipo);
    if (el) el.classList.remove("active");
  } else {
    window._tiposAtivos.add(tipo);
    if (el) el.classList.add("active");
  }
  _atualizarBlocosTipo();
};

window.selecionarTipoChat = function (el, tipo) {
  window.toggleTipoChat(el, tipo);
};

window.adicionarNumeroQr = function () {
  const lista = document.getElementById("listaNumeroQr");
  if (!lista) return;
  const row = document.createElement("div");
  row.className = "qr-numero-row";
  const input = document.createElement("input");
  input.placeholder  = "Ex: (11) 99999-9999";
  input.inputMode    = "numeric";
  input.className    = "qr-numero-input campo-nome";
  input.addEventListener("input", () => {
    if (typeof formatarTelefone === "function") formatarTelefone(input);
    _sincronizarNumerosQr();
  });
  const del = document.createElement("button");
  del.innerHTML = "✕";
  del.className = "faixa-del";
  del.title     = "Remover número";
  del.onclick   = () => {
    if (lista.querySelectorAll(".qr-numero-row").length <= 1) return;
    row.style.opacity = "0";
    setTimeout(() => { row.remove(); _sincronizarNumerosQr(); }, 180);
  };
  row.append(input, del);
  lista.appendChild(row);
  input.focus();
  _sincronizarNumerosQr();
};

function _sincronizarNumerosQr() {
  const numeros = [];
  document.querySelectorAll("#listaNumeroQr .qr-numero-input").forEach(inp => {
    const v = inp.value.trim();
    if (v) numeros.push(v);
  });
  window.chatState = window.chatState || {};
  window.chatState.numeros_qr = numeros;
  window.chatState.conta = numeros[0] || null;
}

document.addEventListener("DOMContentLoaded", () => {
  const qrBox = document.getElementById("chat-qr");
  if (!qrBox) return;
  const obs = new MutationObserver(() => {
    if (qrBox.style.display !== "none") {
      const lista = document.getElementById("listaNumeroQr");
      if (lista && lista.children.length === 0) {
        window.adicionarNumeroQr();
      }
    }
  });
  obs.observe(qrBox, { attributes: true, attributeFilter: ["style"] });
});

window.selecionarApi = function (el, api) {
    window.chatState = window.chatState || {};
    window.chatState.api = api;
    document.querySelectorAll("#api-oficial .chat-card").forEach(c => c.classList.remove("active"));
    el.classList.add("active");
    const blocoConta = document.getElementById("bloco-conta-api");
    if (blocoConta) blocoConta.style.display = "block";
};
window.selecionarConta = function (el, conta) {
    window.chatState = window.chatState || {};
    window.chatState.conta = conta;
    document.querySelectorAll("#bloco-conta-api .chat-card").forEach(c => c.classList.remove("active"));
    el.classList.add("active");
    const canais = document.getElementById("chat-canais");
    if (canais) canais.style.display = "block";
};
window.toggleCanal = function (el) {
    const canal = el.dataset.canal;
    window.chatState = window.chatState || {};
    if (!window.chatState.canais) window.chatState.canais = [];
    el.classList.toggle("active");
    if (el.classList.contains("active")) {
        if (!window.chatState.canais.includes(canal)) window.chatState.canais.push(canal);
    } else {
        window.chatState.canais = window.chatState.canais.filter(c => c !== canal);
    }
};
window.informarAgenteChat = function () {
    mostrarToast("Os agentes omnichannel são gerados automaticamente a partir dos usuários marcados como agente.", true);
};

function atualizarModuloChat() {
    const moduloChat = document.getElementById("modulochat");
    if (!moduloChat) return;
    const modo = localStorage.getItem("modo_atendimento");
    const visivel = modo === "chat" || modo === "ambos";
    moduloChat.style.display = visivel ? "block" : "none";
}
document.addEventListener("DOMContentLoaded", () => {
  const blocoAgentesChat = document.querySelector("#listaAgentesChat")?.parentElement;
  if (!blocoAgentesChat) return;
  if (blocoAgentesChat.querySelector(".info-agente-chat")) return;
  const info = document.createElement("div");
  info.className = "info-agente-chat";
  info.style.cssText = "margin-top:8px;font-size:13px;color:#666;";
  info.textContent = "ℹ️ Os agentes omnichannel são gerados automaticamente a partir dos usuários marcados como agente.";
  blocoAgentesChat.insertBefore(info, blocoAgentesChat.children[1]);
});

/* ================= FLUXOS DE ATENDIMENTO ================= */
window.abrirNovoFluxo = function() {
  window.open("fluxo.html", "_blank");
};

window.editarFluxo = function(id) {
  window.open("fluxo.html?id=" + id, "_blank");
};

window.excluirFluxo = function(id) {
  if (!confirm("Excluir este fluxo?")) return;
  const raw = localStorage.getItem("CONFIG_CADERNO");
  const cad = raw ? JSON.parse(raw) : {};
  if (cad.chat?.fluxos) {
    cad.chat.fluxos = cad.chat.fluxos.filter(f => f.id !== id);
    if (cad.chat.fluxo?.id === id || !cad.chat.fluxos.length) {
      cad.chat.fluxo = cad.chat.fluxos[0] || null;
      cad.chat.fluxo_imagem = cad.chat.fluxos[0]?.imagem || null;
    }
  }
  localStorage.setItem("CONFIG_CADERNO", JSON.stringify(cad));
  renderizarFluxosSalvos();
  mostrarToast("Fluxo excluído");
};

function renderizarFluxosSalvos() {
  const container = document.getElementById("listaFluxosSalvos");
  if (!container) return;
  const raw = localStorage.getItem("CONFIG_CADERNO");
  const cad = raw ? JSON.parse(raw) : {};
  const fluxos = cad.chat?.fluxos || [];

  if (!fluxos.length) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = fluxos.map(f => `
    <div style="
      display:flex;align-items:center;gap:10px;
      background:rgba(206,255,0,.05);border:1px solid rgba(206,255,0,.15);
      border-radius:10px;padding:10px 14px;
    ">
      <span style="font-size:16px;">🔀</span>
      <div style="flex:1;min-width:0;">
        <div style="font-size:13px;font-weight:700;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${f.nome}</div>
        <div style="font-size:11px;color:var(--text-soft);">${f.nos?.length||0} nós · ${f.conexoes?.length||0} conexões</div>
      </div>
      <button onclick="editarFluxo('${f.id}')" style="
        padding:6px 12px;border-radius:8px;border:1px solid rgba(206,255,0,.3);
        background:rgba(206,255,0,.08);color:#CEFF00;font-size:11px;font-weight:700;cursor:pointer;
        white-space:nowrap;
      ">✏️ Editar</button>
      <button onclick="excluirFluxo('${f.id}')" style="
        padding:6px 10px;border-radius:8px;border:1px solid rgba(239,68,68,.3);
        background:rgba(239,68,68,.08);color:#fca5a5;font-size:11px;cursor:pointer;
      ">🗑</button>
    </div>
  `).join("");
}

/* ================= REGRAS DE TEMPO – CHAT ================= */
window.adicionarRegraTempoChat = function () {
  const container = document.getElementById("listaRegrasTempoChat");
  if (!container) return mostrarToast("Lista não encontrada", true);
  container.appendChild(criarRegraTempo());
  syncTudo();
};

function coletarRegrasTempoChat() {
  const regras = [];
  document.querySelectorAll("#listaRegrasTempoChat .campo-descricao").forEach(r => {
    if (r.getData) {
      const data = r.getData();
      if (data.nome) regras.push(data);
    }
  });
  return regras;
}

/* ================= RESPOSTA PESQUISA ================= */
function criarRespostaPesquisa() {
  const wrap = document.createElement("div");
  wrap.className = "opcao-pesquisa";
  const nota = document.createElement("input");
  nota.type = "number"; nota.min = "0"; nota.max = "10";
  nota.placeholder = "Nota";
  const desc = document.createElement("input");
  desc.type = "text";
  desc.placeholder = "Descrição (ex: Ótimo)";
  const del = document.createElement("button");
  del.textContent = "✖";
  del.onclick = () => wrap.remove();
  wrap.append(nota, desc, del);
  return wrap;
}

/* ================= PAUSAS E PESQUISA ================= */
window.togglePausas = function () {
  const container = document.getElementById("pausasConteudo");
  if (!container) return;
  const modo = localStorage.getItem("modo_atendimento");
  if (modo === "chat") {
    mostrarToast("Pausas são exclusivas do Call Center (Voz)", true);
    return;
  }
  if (container._iniciado) {
    container.style.display = container.style.display === "none" ? "block" : "none";
    return;
  }
  container._iniciado = true;
  container.style.display = "block";
  container.appendChild(criarBlocoPausas());
};

window.togglePesquisaSatisfacao = function () {
  const container = document.getElementById("pesquisaSatisfacaoConteudo");
  if (!container) return;
  container.style.display = "block";
  container.appendChild(criarBlocoPesquisa());
};

window.adicionarPausa = function () {
  const lista = document.getElementById("pausasConteudo")?.querySelector(".opcao-pausa")
    ?.parentElement
    || document.getElementById("pausasConteudo")?.querySelector(".campo-descricao div:not(.opcao-pausa)");
  // Busca a div que contém as pausas dentro do bloco criado
  const wrap = document.getElementById("pausasConteudo")?.querySelector(".campo-descricao");
  if (!wrap) return;
  // A listaPausas é a div antes do botão +
  const btns = wrap.querySelectorAll("button");
  const btnAdd = [...btns].find(b => b.textContent.trim() === "+");
  if (btnAdd) btnAdd.click();
};

window.adicionarRespostaPesquisa = function () {
  const lista = document.getElementById("pesquisaSatisfacaoConteudo")
    ?.querySelector(".listaRespostasPesquisa");
  if (!lista) return;
  lista.appendChild(criarRespostaPesquisa());
};

/* ================= MODO ESCURO ================= */
(function initTema() {
  const btn       = document.querySelector(".theme-toggle");
  const temaSalvo = localStorage.getItem("tema");
  if (temaSalvo === "light") { document.body.classList.add("light"); if (btn) btn.textContent = "☀️"; }
  else                       { document.body.classList.add("dark");  if (btn) btn.textContent = "🌙"; }
  if (btn) {
    btn.addEventListener("click", () => {
      if (document.body.classList.contains("light")) {
        document.body.classList.replace("light", "dark");
        localStorage.setItem("tema", "dark");
        btn.textContent = "🌙";
      } else {
        document.body.classList.replace("dark", "light");
        localStorage.setItem("tema", "light");
        btn.textContent = "☀️";
      }
    });
  }
})();

function bloquearLetrasRamalRange() {
  const inicio = document.getElementById("ramalInicio");
  const fim    = document.getElementById("ramalFim");
  function validarInput(e) {
    const valorAntes = e.target.value;
    e.target.value = valorAntes.replace(/\D/g, "");
    if (valorAntes !== e.target.value) mostrarToast("Digite apenas números para o ramal", true);
  }
  if (inicio) inicio.addEventListener("input", validarInput);
  if (fim)    fim.addEventListener("input", validarInput);
}
document.addEventListener("DOMContentLoaded", bloquearLetrasRamalRange);
document.addEventListener("contextmenu", e => e.preventDefault());
document.addEventListener("keydown", e => {
  if (e.key === "F12") e.preventDefault();
  if (e.ctrlKey && e.shiftKey && e.key === "I") e.preventDefault();
  if (e.ctrlKey && e.shiftKey && e.key === "J") e.preventDefault();
  if (e.ctrlKey && e.key === "U") e.preventDefault();
});

/* ================= INIT GLOBAL ================= */
window.initCaderno = function () {
  window.chatState = window.chatState || { tipo: null, api: null, conta: null, canais: [], usuarios: [], agentes: [], departamentos: [] };
  const modo = localStorage.getItem("modo_atendimento");
  const modoValido = modo === "voz" || modo === "chat" || modo === "ambos";
  if (!modoValido) return;
  const cardUsuariosOmni = document.getElementById("cardUsuariosOmni");
  if (cardUsuariosOmni) cardUsuariosOmni.style.display = modo === "chat" ? "block" : "none";
  const fn = typeof mostrarApp === "function" ? mostrarApp : window.mostrarApp;
  if (fn) fn(modo);
  setTimeout(() => {
    atualizarModuloChat();
    if (modo === "chat" || modo === "ambos") {
      if (typeof window.inicializarChatUI === "function") window.inicializarChatUI();
    }
    syncTudo();
    if (modo === "chat" || modo === "ambos") {
      setTimeout(gerarAgentesChatAPartirUsuarios, 150);
    }
    _carregarDadosSalvos();
  }, 200);
};

/* ================= RECARREGAR DADOS DO LOCALSTORAGE ================= */
function _carregarDadosSalvos() {
  const raw = localStorage.getItem("CONFIG_CADERNO");
  if (!raw || raw === "null") return;
  let dados;
  try { dados = JSON.parse(raw); } catch(e) { return; }
  if (!dados) return;

  const voz = dados.voz  || {};
  const cli = dados.cliente || {};
  const chat = dados.chat || {};

  const fEmp = document.getElementById("empresaCliente");
  const fDom = document.getElementById("dominioCliente");
  const fCnpj = document.getElementById("cnpjCliente");
  if (fEmp  && cli.empresa)  { fEmp.value  = cli.empresa;  fEmp.dispatchEvent(new Event("input")); }
  if (fDom  && cli.dominio)  { fDom.value  = cli.dominio;  fDom.dispatchEvent(new Event("input")); }
  if (fCnpj && cli.cnpj)     { fCnpj.value = cli.cnpj;     fCnpj.dispatchEvent(new Event("input")); }

  const listaUW = document.getElementById("listaUsuariosWeb");
  if (listaUW && voz.usuarios?.length) {
    listaUW.innerHTML = "";
    voz.usuarios.forEach(u => {
      const campo = criarCampo("usuario_web");
      campo.querySelector(".campo-nome").value = u.nome || "";
      const email = campo.querySelector("input[type=email]");
      if (email) email.value = u.email || "";
      const senha = campo.querySelector(".campo-senha");
      if (senha) { senha.value = u.senha || ""; senha.dispatchEvent(new Event("input")); }
      const perm = campo.querySelector("select");
      if (perm && u.permissao) perm.value = u.permissao;
      const chks = campo.querySelectorAll("input[type=checkbox]");
      if (chks[0]) { chks[0].checked = !!u.agente_callcenter; chks[0].dispatchEvent(new Event("change")); }
      if (chks[1]) { chks[1].checked = !!u.agente_omnichannel; chks[1].dispatchEvent(new Event("change")); }
      listaUW.appendChild(campo);
    });
  }

  const listaR = document.getElementById("listaRings");
  if (listaR && voz.ramais?.length) {
    listaR.innerHTML = "";
    voz.ramais.forEach(r => {
      const campo = criarCampo("ring");
      campo.querySelector(".campo-nome").value = r.ramal || "";
      const senha = campo.querySelector(".campo-senha");
      if (senha) senha.value = r.senha || "";
      listaR.appendChild(campo);
    });
  }

  const listaE = document.getElementById("listaEntradas");
  if (listaE && voz.entradas?.length) {
    listaE.innerHTML = "";
    voz.entradas.forEach(e => {
      const campo = criarCampo("entrada");
      campo.querySelector(".campo-nome").value = e.numero || "";
      campo.querySelector(".campo-nome").dispatchEvent(new Event("input"));
      listaE.appendChild(campo);
    });
  }

  const listaRT = document.getElementById("listaRegrasTempo");
  if (listaRT && voz.regras_tempo?.length) {
    listaRT.innerHTML = "";
    voz.regras_tempo.forEach(r => {
      const card = criarRegraTempo();
      card.querySelector(".campo-nome").value = r.nome || "";
      const diasBtns = card.querySelectorAll(".btn-dia");
      const diasCompletos = ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"];
      diasBtns.forEach((btn, idx) => {
        if ((r.dias || []).includes(diasCompletos[idx])) btn.click();
      });
      const faixas = r.faixas?.length ? r.faixas
        : (r.hora_inicio ? [{ inicio: r.hora_inicio, fim: r.hora_fim }] : []);
      const faixaContainer = card.querySelector(".faixas-container");
      if (faixaContainer && faixas.length) {
        faixaContainer.innerHTML = "";
        faixas.forEach(f => {
          const row = criarFaixaHoraria();
          const times = row.querySelectorAll("input[type=time]");
          if (times[0]) times[0].value = f.inicio || "";
          if (times[1]) times[1].value = f.fim    || "";
          faixaContainer.appendChild(row);
        });
      }
      listaRT.appendChild(card);
    });
  }

  const listaF = document.getElementById("listaFilas");
  if (listaF && voz.filas?.length) {
    listaF.innerHTML = "";
    voz.filas.forEach(f => {
      const campo = criarCampo("fila");
      campo.querySelector(".campo-nome").value = f.nome || "";
      campo.dataset.agentes = JSON.stringify(f.agentes || []);
      listaF.appendChild(campo);
    });
  }

  const listaGR = document.getElementById("listaGrupoRing");
  if (listaGR && voz.grupo_ring?.length) {
    listaGR.innerHTML = "";
    voz.grupo_ring.forEach(g => {
      const campo = criarCampo("grupo_ring");
      campo.querySelector(".campo-nome").value = g.nome || "";
      const selEstr = campo.querySelector("select");
      if (selEstr && g.estrategia) selEstr.value = g.estrategia;
      campo.dataset.ramais = JSON.stringify(g.ramais || []);
      listaGR.appendChild(campo);
    });
  }

  const listaURA = document.getElementById("listaURAs");
  if (listaURA && voz.uras?.length) {
    listaURA.innerHTML = "";
    voz.uras.forEach(u => {
      const campo = criarCampo("ura");
      campo.querySelector(".campo-nome").value = u.nome || "";
      const ta = campo.querySelector("textarea");
      if (ta) ta.value = u.mensagem || "";
      const listaOpc = campo.querySelector(".opcao-ura-row")?.parentElement
                    || campo.querySelectorAll("div")[campo.querySelectorAll("div").length - 2];
      (u.opcoes || []).forEach(o => {
        const row = criarOpcaoURA();
        row.querySelector(".ura-tecla").value = o.tecla || "";
        row.querySelector(".ura-desc").value  = o.descricao || "";
        setTimeout(() => {
          const sel = row.querySelector(".ura-destino");
          if (sel) sel.value = o.destino || "";
        }, 300);
        if (listaOpc) listaOpc.appendChild(row);
      });
      listaURA.appendChild(campo);
    });
  }

  if (voz.pausas?.length && voz.pausas[0]) {
    const p = voz.pausas[0];
    const nomeGrupo = document.getElementById("nomeGrupoPausas");
    if (nomeGrupo) nomeGrupo.value = p.grupo || "";
    const listaPausas = document.getElementById("listaPausas");
    const bloco = document.getElementById("pausasConteudo");
    if (listaPausas && p.itens?.length) {
      if (bloco) { bloco.style.display = "block"; _pausasAberta = true; }
      listaPausas.innerHTML = "";
      p.itens.forEach(item => {
        const el = criarPausa();
        el.querySelector("input[type=text]").value = item.nome || "";
        const sel = el.querySelector("select");
        if (sel) { const mins = parseInt(item.tempo) || 0; sel.value = mins; }
        listaPausas.appendChild(el);
      });
    }
  }

  if (voz.pesquisas?.length && voz.pesquisas[0]) {
    const p = voz.pesquisas[0];
    const bloco = document.getElementById("pesquisaSatisfacaoConteudo");
    if (bloco && (p.nome || p.pergunta)) {
      bloco.style.display = "block"; _pesquisaAberta = true;
      const fn1 = document.getElementById("pesquisaNome");
      const fn2 = document.getElementById("pesquisaAudioIntro");
      const fn3 = document.getElementById("pesquisaPergunta");
      const fn4 = document.getElementById("pesquisaAudioFim");
      if (fn1) fn1.value = p.nome || "";
      if (fn2) fn2.value = p.introducao || "";
      if (fn3) fn3.value = p.pergunta || "";
      if (fn4) fn4.value = p.encerramento || "";
      const listaResp = document.getElementById("listaRespostasPesquisa");
      if (listaResp && p.respostas?.length) {
        listaResp.innerHTML = "";
        p.respostas.forEach(r => {
          const el = criarRespostaPesquisa();
          el.querySelector("input[type=number]").value = r.nota ?? "";
          el.querySelector("input[type=text]").value   = r.descricao || "";
          listaResp.appendChild(el);
        });
      }
    }
  }

  if (chat && (chat.tipo || chat.usuarios?.length || chat.departamentos?.length)) {
    if (chat.tipo) {
      const tipos = chat.tipo === "ambos" ? ["api","qr"] : [chat.tipo];
      tipos.forEach(t => {
        const btn = document.querySelector(`[data-tipo="${t}"]`);
        if (btn) window.toggleTipoChat(btn, t);
      });
    }
    if (chat.api) {
      const btnApi = document.querySelector(`[data-api="${chat.api}"]`);
      if (btnApi) window.selecionarApi(btnApi, chat.api);
    }
    const contaVal = typeof chat.conta === "object" ? chat.conta?.api : chat.conta;
    if (contaVal) {
      const btnConta = document.querySelector(`[data-conta="${contaVal}"]`);
      if (btnConta) window.selecionarConta(btnConta, contaVal);
    }
    (chat.canais || []).forEach(canal => {
      const btnCanal = document.querySelector(`[data-canal="${canal}"]`);
      if (btnCanal && !btnCanal.classList.contains("active")) window.toggleCanal(btnCanal);
    });
    if (chat.numero_qr?.length) {
      const listaQr = document.getElementById("listaNumeroQr");
      if (listaQr) {
        listaQr.innerHTML = "";
        chat.numero_qr.forEach(n => {
          window.adicionarNumeroQr();
          const inputs = listaQr.querySelectorAll(".qr-numero-input");
          const last = inputs[inputs.length - 1];
          if (last) last.value = n;
        });
      }
    }

    const listaRTC = document.getElementById("listaRegrasTempoChat");
    if (listaRTC && chat.regras_tempo?.length) {
      listaRTC.innerHTML = "";
      chat.regras_tempo.forEach(r => {
        const card = criarRegraTempo();
        card.querySelector(".campo-nome").value = r.nome || "";
        const diasBtns = card.querySelectorAll(".btn-dia");
        const diasComp = ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"];
        diasBtns.forEach((btn, idx) => {
          if ((r.dias || []).includes(diasComp[idx])) btn.click();
        });
        const faixas = r.faixas?.length ? r.faixas
          : (r.hora_inicio ? [{ inicio: r.hora_inicio, fim: r.hora_fim }] : []);
        const fc = card.querySelector(".faixas-container");
        if (fc && faixas.length) {
          fc.innerHTML = "";
          faixas.forEach(f => {
            const row = criarFaixaHoraria();
            const ts  = row.querySelectorAll("input[type=time]");
            if (ts[0]) ts[0].value = f.inicio || "";
            if (ts[1]) ts[1].value = f.fim    || "";
            fc.appendChild(row);
          });
        }
        listaRTC.appendChild(card);
      });
    }

    const listaUC = document.getElementById("listaUsuariosChat");
    const _usuariosChat = chat.usuarios || [];
    if (listaUC && _usuariosChat.length) {
      listaUC.innerHTML = "";
      _usuariosChat.forEach(u => {
        if (typeof window.adicionarUsuarioChat !== "function") return;
        const wrap = window.adicionarUsuarioChat();
        if (!wrap) return;
        const nomeEl = wrap.querySelector(".campo-nome");
        if (nomeEl) nomeEl.value = u.nome || "";
        const emailEl = wrap.querySelector("input[type=email]");
        if (emailEl) emailEl.value = u.email || "";
        const senhaEl = wrap.querySelector(".campo-senha");
        if (senhaEl) senhaEl.value = u.senha || "";
        const permEl = wrap.querySelector("select");
        if (permEl && u.permissao) permEl.value = u.permissao;
        const chk = wrap.querySelector("input[type=checkbox]");
        if (chk) {
          const deveSerAgente = u.agente === true || u.agente_omnichannel === true;
          const origOnchange = chk.onchange;
          chk.onchange = null;
          chk.checked = deveSerAgente;
          chk.onchange = origOnchange;
        }
      });
    }
  }

  setTimeout(() => {
    syncTudo();
    atualizarTodosDestinosURA();
    renderizarFluxosSalvos();
  }, 300);

  setTimeout(() => {
    if (typeof gerarAgentesChatAPartirUsuarios === "function") {
      gerarAgentesChatAPartirUsuarios();
    }
  }, 700);

  setTimeout(() => {
    const _depsSalvos = (JSON.parse(localStorage.getItem("CONFIG_CADERNO") || "{}").chat || {}).departamentos || [];
    if (!_depsSalvos.length) return;
    const listaDC = document.getElementById("listaDepartamentosChat");
    if (!listaDC) return;
    listaDC.innerHTML = "";
    const _agentesNoDOM = [];
    document.querySelectorAll("#listaAgentesChat .campo-descricao").forEach(a => {
      const n = a.querySelector(".campo-nome")?.value?.trim();
      if (n) _agentesNoDOM.push(n);
    });
    _depsSalvos.forEach(dep => {
      if (typeof window.adicionarDepartamentoChat !== "function") return;
      window.adicionarDepartamentoChat();
      const cards = listaDC.querySelectorAll(".campo-descricao");
      const card  = cards[cards.length - 1];
      if (!card) return;
      const nomeEl = card.querySelector(".campo-nome");
      if (nomeEl) nomeEl.value = dep.nome || "";
      const addBtn = [...card.querySelectorAll("button")]
        .find(b => b.textContent.trim().includes("Adicionar agente"));
      if (!addBtn) return;
      (dep.agentes || []).forEach(agNome => {
        addBtn.click();
        const selects = card.querySelectorAll("select");
        const sel = selects[selects.length - 1];
        if (!sel) return;
        const jaTemOpcao = [...sel.options].some(o => o.value === agNome);
        if (!jaTemOpcao) sel.add(new Option(agNome, agNome));
        sel.value = agNome;
      });
    });
  }, 1200);
}

document.addEventListener("DOMContentLoaded", () => {
  if (typeof window.initCaderno === "function") window.initCaderno();

  window.addEventListener("focus", () => {
    setTimeout(renderizarFluxosSalvos, 300);
  });

  const ancora = sessionStorage.getItem("CADERNO_EDIT_ANCORA");
  if (ancora) {
    sessionStorage.removeItem("CADERNO_EDIT_ANCORA");
    setTimeout(() => {
      const el = document.querySelector(ancora);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        el.style.transition = "box-shadow 0.3s";
        el.style.boxShadow  = "0 0 0 3px rgba(206,255,0,0.6)";
        setTimeout(() => { el.style.boxShadow = ""; }, 2000);
      }
    }, 800);
  }
});

/* ================= VALIDAÇÕES V2 ================= */
window.validarCNPJReal = function(cnpj) {
  cnpj = cnpj.replace(/\D/g, "");
  if (cnpj.length !== 14) return false;
  if (/^(\d)\1+$/.test(cnpj)) return false;
  const calc = (n) => {
    let sum = 0, pos = n - 7;
    for (let i = n; i >= 1; i--) {
      sum += parseInt(cnpj.charAt(n - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    const r = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    return r === parseInt(cnpj.charAt(n));
  };
  return calc(12) && calc(13);
};

window.validarCPFReal = function(cpf) {
  cpf = cpf.replace(/\D/g, "");
  if (cpf.length !== 11) return false;
  if (/^(\d)\1+$/.test(cpf)) return false;
  const calc = (len) => {
    let sum = 0;
    for (let i = 0; i < len; i++) sum += parseInt(cpf[i]) * (len + 1 - i);
    const r = (sum * 10) % 11;
    return (r === 10 || r === 11 ? 0 : r) === parseInt(cpf[len]);
  };
  return calc(9) && calc(10);
};

window.validarEmail = function(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
};

window.formatarTelefone = function(input) {
  let v = input.value.replace(/\D/g, "").slice(0, 11);
  if (v.length <= 10)
    v = v.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  else
    v = v.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
  input.value = v.replace(/-$/, "");
};

window.avaliarForcaSenha = function(senha) {
  let score = 0;
  if (senha.length >= 11)          score++;
  if (/[A-Z]/.test(senha))         score++;
  if (/[0-9]/.test(senha))         score++;
  if (/[^A-Za-z0-9]/.test(senha))  score++;
  if (score <= 1) return "fraca";
  if (score <= 2) return "media";
  return "forte";
};

window.validarSenhaV2 = function(input, container) {
  if (!container) return;
  const v = input.value || "";
  const temMin      = v.length >= 11;
  const temMaiuscula = /[A-Z]/.test(v);
  const temNumero   = /\d/.test(v);
  const temEspecial = /[^A-Za-z0-9]/.test(v);
  const ok = temMin && temMaiuscula && temNumero && temEspecial;
  const forca = avaliarForcaSenha(v);
  let bar = container.querySelector(".senha-strength-bar");
  if (!bar && v.length > 0) {
    bar = document.createElement("div");
    bar.className = "senha-strength-bar";
    container.prepend(bar);
  }
  if (bar) bar.dataset.forca = v.length ? forca : "";
  let msg = container.querySelector(".regra-msg");
  if (!msg) { msg = document.createElement("div"); msg.className = "regra-msg"; container.appendChild(msg); }
  if (!v.length) { msg.innerHTML = ""; if(bar) bar.dataset.forca = ""; return; }
  if (ok) {
    msg.className = "regra-msg regra-ok";
    msg.textContent = "✓ Senha forte";
    input.classList.remove("campo-obrigatorio-erro");
    input.classList.add("campo-valido");
  } else {
    const falta = [];
    if (!temMin)       falta.push(`${11 - v.length} car. a mais`);
    if (!temMaiuscula) falta.push("maiúscula");
    if (!temNumero)    falta.push("número");
    if (!temEspecial)  falta.push("especial");
    msg.className = "regra-msg regra-erro";
    msg.textContent = "Falta: " + falta.join(" · ");
    input.classList.add("campo-obrigatorio-erro");
    input.classList.remove("campo-valido");
  }
};

(function melhorarDocumento() {
  const input  = document.getElementById("cnpjCliente");
  const regra  = document.getElementById("regraCNPJ");
  if (!input || !regra) return;
  function formatarDoc(digits) {
    if (digits.length <= 11) {
      let v = digits;
      v = v.replace(/(\d{3})(\d)/, "$1.$2");
      v = v.replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
      v = v.replace(/\.(\d{3})(\d)/, ".$1-$2");
      return v;
    } else {
      let v = digits;
      v = v.replace(/^(\d{2})(\d)/, "$1.$2");
      v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
      v = v.replace(/\.(\d{3})(\d)/, ".$1/$2");
      v = v.replace(/(\d{4})(\d)/, "$1-$2");
      return v;
    }
  }
  input.addEventListener("input", () => {
    const digits = input.value.replace(/\D/g, "").slice(0, 14);
    input.value  = formatarDoc(digits);
    const len    = digits.length;
    if (len === 0) {
      regra.className   = "";
      regra.textContent = "";
      input.classList.remove("campo-valido", "campo-obrigatorio-erro");
      return;
    }
    if (len <= 11) {
      if (len < 11) {
        regra.className   = "regra-neutra";
        regra.textContent = `CPF — faltam ${11 - len} dígito${11 - len > 1 ? "s" : ""}`;
        input.classList.remove("campo-valido", "campo-obrigatorio-erro");
      } else {
        const ok = validarCPFReal(digits);
        regra.className   = ok ? "regra-ok"  : "regra-erro";
        regra.textContent = ok ? "✓ CPF válido" : "✗ CPF inválido";
        input.classList.toggle("campo-valido",            ok);
        input.classList.toggle("campo-obrigatorio-erro", !ok);
      }
      return;
    }
    if (len < 14) {
      regra.className   = "regra-neutra";
      regra.textContent = `CNPJ — faltam ${14 - len} dígito${14 - len > 1 ? "s" : ""}`;
      input.classList.remove("campo-valido", "campo-obrigatorio-erro");
      return;
    }
    const ok = validarCNPJReal(digits);
    regra.className   = ok ? "regra-ok"  : "regra-erro";
    regra.textContent = ok ? "✓ CNPJ válido" : "✗ CNPJ inválido";
    input.classList.toggle("campo-valido",            ok);
    input.classList.toggle("campo-obrigatorio-erro", !ok);
  });
})();

(function melhorarDominio() {
  const dominioInput = document.getElementById("dominioCliente");
  const regraDominio = document.getElementById("regraDominio");
  if (!dominioInput || !regraDominio) return;
  dominioInput.addEventListener("input", () => {
    const v = dominioInput.value.trim().toLowerCase();
    if (!v) {
      regraDominio.innerHTML = "";
      dominioInput.classList.remove("campo-valido","campo-obrigatorio-erro");
      return;
    }
    const ok = v.endsWith(".sobreip.com.br") && v.length > ".sobreip.com.br".length;
    if (ok) {
      regraDominio.className = "regra-ok";
      regraDominio.textContent = "✓ Domínio válido";
      dominioInput.classList.add("campo-valido");
      dominioInput.classList.remove("campo-obrigatorio-erro");
    } else {
      regraDominio.className = "regra-erro";
      regraDominio.textContent = "✗ Deve terminar com .sobreip.com.br";
      dominioInput.classList.add("campo-obrigatorio-erro");
      dominioInput.classList.remove("campo-valido");
    }
  });
})();

document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("input", (e) => {
    if (e.target.type === "email") {
      const v = e.target.value.trim();
      if (!v) { e.target.classList.remove("campo-valido","campo-obrigatorio-erro"); return; }
      if (validarEmail(v)) {
        e.target.classList.add("campo-valido");
        e.target.classList.remove("campo-obrigatorio-erro");
      } else {
        e.target.classList.add("campo-obrigatorio-erro");
        e.target.classList.remove("campo-valido");
      }
    }
  });

  document.addEventListener("input", (e) => {
    if (!e.target.classList.contains("campo-senha")) return;
    let regrasEl = null;
    let el = e.target.nextElementSibling;
    while (el) {
      if (el.tagName === "DIV") { regrasEl = el; break; }
      el = el.nextElementSibling;
    }
    if (!regrasEl) {
      regrasEl = e.target.closest(".campo-descricao")?.querySelector("div:last-child");
    }
    if (regrasEl) validarSenhaV2(e.target, regrasEl);
  });

  document.addEventListener("input", (e) => {
    const ph = e.target.placeholder || "";
    if (ph.toLowerCase().includes("número de entrada") || e.target.classList.contains("qr-numero-input") || (e.target.closest("#listaEntradas") && e.target.classList.contains("campo-nome"))) {
      formatarTelefone(e.target);
    }
  });

  const qrInput = document.getElementById("numeroQr");
  if (qrInput) {
    qrInput.addEventListener("input", () => formatarTelefone(qrInput));
  }
});

/* ================= BACKUP LOCAL AUTOMÁTICO ================= */
const BACKUP_KEY    = "CONFIG_CADERNO_BACKUPS";
const BACKUP_MAX    = 5;
const BACKUP_INTERVALO = 60 * 1000;

function _fazerBackup(dados) {
  if (!dados) return;
  try {
    const backups = JSON.parse(localStorage.getItem(BACKUP_KEY) || "[]");
    backups.unshift({ ts: new Date().toISOString(), dados });
    if (backups.length > BACKUP_MAX) backups.length = BACKUP_MAX;
    localStorage.setItem(BACKUP_KEY, JSON.stringify(backups));
  } catch(e) {
    console.warn("[Backup] erro:", e);
  }
}

setInterval(() => {
  const empresa = document.getElementById("empresaCliente")?.value.trim();
  if (!empresa) return;
  try {
    const dados = window.explorar?.();
    if (dados) _fazerBackup(dados);
  } catch(_) {}
}, BACKUP_INTERVALO);

window.baixarBackupJSON = function () {
  try {
    const dados = window.explorar?.();
    if (!dados) { mostrarToast("Preencha os dados antes de fazer backup", true); return; }
    _fazerBackup(dados);
    const empresa = (dados.cliente?.empresa || "caderno").replace(/\s+/g, "-");
    const data    = new Date().toISOString().slice(0, 10);
    const nome    = `backup-${empresa}-${data}.json`;
    const blob    = new Blob([JSON.stringify(dados, null, 2)], { type: "application/json" });
    const url     = URL.createObjectURL(blob);
    const a       = document.createElement("a");
    a.href = url; a.download = nome;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
    mostrarToast("Backup JSON baixado!");
  } catch(e) {
    mostrarToast("Erro ao gerar backup", true);
  }
};

window.restaurarBackupJSON = function () {
  const input = document.createElement("input");
  input.type  = "file";
  input.accept = ".json,application/json";
  input.onchange = () => {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const dados = JSON.parse(e.target.result);
        if (!dados.cliente) throw new Error("JSON inválido");
        localStorage.setItem("CONFIG_CADERNO", JSON.stringify(dados));
        mostrarToast("Backup restaurado! Redirecionando ao resumo...");
        setTimeout(() => window.location.href = "resumo.html", 1500);
      } catch(_) {
        mostrarToast("Arquivo JSON inválido", true);
      }
    };
    reader.readAsText(file);
  };
  input.click();
};

/* ================= MODAL DE VALIDAÇÃO ANTES DE SALVAR ================= */
function _criarModalValidacao() {
  if (document.getElementById("modalValidacao")) return;

  const overlay = document.createElement("div");
  overlay.id = "modalValidacao";
  overlay.style.cssText = `
    position:fixed;inset:0;background:rgba(0,0,0,0.6);backdrop-filter:blur(4px);
    z-index:9000;display:flex;align-items:center;justify-content:center;
    opacity:0;pointer-events:none;transition:opacity 0.25s ease;
  `;

  overlay.innerHTML = `
    <div id="modalValidacaoBox" style="
      background:var(--card-bg);border:1px solid var(--border);border-radius:20px;
      width:520px;max-width:95vw;max-height:80vh;display:flex;flex-direction:column;
      box-shadow:0 30px 80px rgba(0,0,0,0.5);overflow:hidden;
      transform:translateY(20px) scale(0.97);transition:transform 0.25s ease;
    ">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:20px 24px 14px;border-bottom:1px solid var(--border);">
        <h3 id="modalValidacaoTitulo" style="margin:0;font-size:17px;font-weight:800;color:var(--text)"></h3>
        <button onclick="fecharModalValidacao()" style="
          width:34px;height:34px;border-radius:8px;border:1px solid var(--border);
          background:transparent;color:var(--text);font-size:18px;cursor:pointer;
          display:flex;align-items:center;justify-content:center;
        ">✕</button>
      </div>
      <div id="modalValidacaoLista" style="overflow-y:auto;padding:20px 24px;flex:1;display:flex;flex-direction:column;gap:8px;"></div>
      <div style="padding:16px 24px;border-top:1px solid var(--border);display:flex;gap:10px;justify-content:flex-end;">
        <button onclick="fecharModalValidacao()" style="
          padding:10px 20px;border-radius:10px;border:1px solid var(--border);
          background:transparent;color:var(--text);font-weight:700;cursor:pointer;font-size:13px;
        ">Corrigir</button>
        <button id="btnContinuarMesmoAssim" style="
          padding:10px 20px;border-radius:10px;border:none;
          background:linear-gradient(90deg,#f59e0b,#ef4444);
          color:#fff;font-weight:700;cursor:pointer;font-size:13px;display:none;
        " onclick="_confirmarSalvar()">Continuar mesmo assim</button>
        <button id="btnSalvarOk" style="
          padding:10px 24px;border-radius:10px;border:none;
          background:linear-gradient(90deg,#00ffa3,#00cfff);
          color:#000;font-weight:800;cursor:pointer;font-size:13px;display:none;
        " onclick="_confirmarSalvar()">Salvar ✓</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  overlay.addEventListener("click", e => {
    if (e.target === overlay) fecharModalValidacao();
  });
}

window.fecharModalValidacao = function () {
  const overlay = document.getElementById("modalValidacao");
  if (!overlay) return;
  overlay.style.opacity = "0";
  overlay.style.pointerEvents = "none";
  const box = document.getElementById("modalValidacaoBox");
  if (box) box.style.transform = "translateY(20px) scale(0.97)";
};

function _abrirModalValidacao(erros, avisos) {
  _criarModalValidacao();
  const overlay = document.getElementById("modalValidacao");
  const titulo  = document.getElementById("modalValidacaoTitulo");
  const lista   = document.getElementById("modalValidacaoLista");
  const btnCont = document.getElementById("btnContinuarMesmoAssim");
  const btnOk   = document.getElementById("btnSalvarOk");

  const temErros  = erros.length  > 0;
  const temAvisos = avisos.length > 0;

  titulo.textContent = temErros
    ? `⛔ ${erros.length} erro${erros.length > 1 ? "s" : ""} encontrado${erros.length > 1 ? "s" : ""}`
    : `⚠️ ${avisos.length} aviso${avisos.length > 1 ? "s" : ""} antes de salvar`;

  lista.innerHTML = "";

  erros.forEach(e => {
    const el = document.createElement("div");
    el.style.cssText = "padding:10px 14px;border-radius:10px;font-size:13px;line-height:1.5;background:rgba(239,68,68,0.12);border-left:3px solid #ef4444;color:var(--text)";
    el.innerHTML = `🔴 <strong>Erro:</strong> ${e}`;
    lista.appendChild(el);
  });

  avisos.forEach(a => {
    const el = document.createElement("div");
    el.style.cssText = "padding:10px 14px;border-radius:10px;font-size:13px;line-height:1.5;background:rgba(251,191,36,0.10);border-left:3px solid #f59e0b;color:var(--text)";
    el.innerHTML = `🟡 <strong>Aviso:</strong> ${a}`;
    lista.appendChild(el);
  });

  btnCont.style.display = (!temErros && temAvisos) ? "block" : "none";
  btnOk.style.display   = (!temErros && !temAvisos) ? "block" : "none";

  overlay.style.opacity      = "1";
  overlay.style.pointerEvents = "all";
  const box = document.getElementById("modalValidacaoBox");
  if (box) box.style.transform = "translateY(0) scale(1)";
}

function _confirmarSalvar() {
  fecharModalValidacao();
  const dados = window.explorar?.();
  if (!dados) return;

  try {
    const anterior = JSON.parse(localStorage.getItem("CONFIG_CADERNO") || "{}");
    if (anterior.chat?.fluxos?.length) {
      if (!dados.chat) dados.chat = {};
      dados.chat.fluxos       = anterior.chat.fluxos;
      dados.chat.fluxo        = anterior.chat.fluxo        || dados.chat.fluxo;
      dados.chat.fluxo_imagem = anterior.chat.fluxo_imagem || dados.chat.fluxo_imagem;
    }
  } catch(e) {}

  _fazerBackup(dados);
  localStorage.setItem("CONFIG_CADERNO", JSON.stringify(dados));
  window.location.href = "resumo.html";
}

/* FIX #5 & #6: salvarConfiguracao — botão renomeado para "Salvar Configurações" */
window.salvarConfiguracao = function () {
  const erros  = [];
  const avisos = [];

  const empresa = document.getElementById("empresaCliente")?.value.trim();
  if (!empresa) erros.push("Nome da empresa é obrigatório.");

  const dominio = document.getElementById("dominioCliente")?.value.trim().toLowerCase();
  if (!dominio || !dominio.endsWith(".sobreip.com.br"))
    erros.push("Domínio inválido — deve terminar com .sobreip.com.br");

  const cnpj = document.getElementById("cnpjCliente")?.value.trim();
  if (cnpj) {
    const digits = cnpj.replace(/\D/g, "");
    const docValido = digits.length === 11 ? validarCPFReal(cnpj) : validarCNPJReal(cnpj);
    if (!docValido) erros.push(digits.length <= 11 ? "CPF inválido." : "CNPJ inválido.");
  }

  document.querySelectorAll("#listaAgentes .campo-descricao").forEach(a => {
    if (a.getRamal && !a.getRamal()) {
      const nome = a.querySelector(".campo-nome")?.value || "sem nome";
      erros.push(`Agente "${nome}" sem ramal vinculado.`);
    }
  });

  document.querySelectorAll("#listaUsuariosWeb input[type=email]").forEach((el, i) => {
    if (el.value && !validarEmail(el.value))
      erros.push(`E-mail do usuário ${i + 1} inválido: "${el.value}"`);
  });

  const modo = localStorage.getItem("modo_atendimento");

  if (modo === "voz" || modo === "ambos") {
    if (!document.querySelectorAll("#listaRings .campo-descricao").length)
      avisos.push("Nenhum ramal cadastrado.");
    if (!document.querySelectorAll("#listaUsuariosWeb .campo-descricao").length)
      avisos.push("Nenhum usuário web cadastrado.");
    if (!document.querySelectorAll("#listaFilas .campo-descricao").length)
      avisos.push("Nenhuma fila cadastrada.");
    if (!document.querySelectorAll("#listaURAs .campo-descricao").length)
      avisos.push("Nenhuma URA cadastrada.");
    document.querySelectorAll("#listaFilas .campo-descricao").forEach(f => {
      const nome = f.querySelector(".campo-nome")?.value?.trim();
      const agentes = JSON.parse(f.dataset.agentes || "[]");
      if (nome && !agentes.length) avisos.push(`Fila "${nome}" sem agentes configurados.`);
    });
  }

  if (modo === "chat" || modo === "ambos") {
    if (!document.querySelectorAll("#listaUsuariosChat .campo-descricao").length)
      avisos.push("Nenhum usuário de chat cadastrado.");
    if (!document.querySelectorAll("#listaDepartamentosChat .campo-descricao").length)
      avisos.push("Nenhum departamento de chat cadastrado.");
  }

  if (erros.length || avisos.length) {
    _abrirModalValidacao(erros, avisos);
    return;
  }

  _confirmarSalvar();
};
