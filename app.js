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

/* ================= ADICIONAR CAMPO ================= */

window.adicionarCampo = function (tipo) {

  // 👉 AGENTE NÃO É CRIADO NA MÃO — É GERADO DOS USUÁRIOS
  if (tipo === "agente") {
    gerarAgentesAPartirUsuarios();
    atualizarSelectAgentesFila();
    mostrarToast("Agentes atualizados a partir dos usuários");
    return;
  }

  if (!listas[tipo]) return mostrarToast(`Tipo inválido: ${tipo}`, true);

  const container = document.getElementById(listas[tipo]);
  if (!container || container.children.length >= LIMITE) return;

  container.appendChild(criarCampo(tipo));
  atualizarTodosDestinosURA();
  syncTudo();
};

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

    document.querySelectorAll(`#${g.id} .campo-nome`).forEach(i => {
      if (i.value) {
        const opt = new Option(i.value, i.value);
        opt.dataset.tipo = g.tipo;
        optgroup.appendChild(opt);
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
    senhaInput = document.createElement("input");
    senhaInput.placeholder = "Senha do ramal";
    senhaInput.classList.add("campo-senha");
    senhaInput.style.marginTop = "12px";
    wrap.append(senhaInput);

    regras = document.createElement("div");
    regras.style.marginTop = "8px";
    wrap.append(regras);

    senhaInput.oninput = () => validarSenha(senhaInput, regras);
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

    function render(){
      lista.innerHTML="";
      JSON.parse(wrap.dataset.agentes).forEach((a,i)=>{
        const d=document.createElement("div");
        d.textContent=a;
        const x=document.createElement("button");
        x.textContent="✖";
        x.onclick=()=>{
          const arr=JSON.parse(wrap.dataset.agentes);
          arr.splice(i,1);
          wrap.dataset.agentes=JSON.stringify(arr);
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
    wrap.dataset.estrategia="";
    estr.onchange = ()=> wrap.dataset.estrategia=estr.value;

    const select = document.createElement("select");
    select.innerHTML = `<option value="">Selecione um ramal</option>`;
    wrap.append(select);

    const btnAdd = document.createElement("button");
    btnAdd.textContent="Adicionar ramal";
    wrap.append(btnAdd);

    const lista = document.createElement("div");
    wrap.append(lista);

    wrap.dataset.ramais="[]";

    btnAdd.onclick=()=>{
      if(!select.value)return;
      const arr=JSON.parse(wrap.dataset.ramais);
      if(!arr.includes(select.value))arr.push(select.value);
      wrap.dataset.ramais=JSON.stringify(arr);
      render();
    };

    function render(){
      lista.innerHTML="";
      JSON.parse(wrap.dataset.ramais).forEach((r,i)=>{
        const d=document.createElement("div");
        d.textContent=r;
        const x=document.createElement("button");
        x.textContent="✖";
        x.onclick=()=>{
          const arr=JSON.parse(wrap.dataset.ramais);
          arr.splice(i,1);
          wrap.dataset.ramais=JSON.stringify(arr);
          render();
        };
        d.append(x);
        lista.append(d);
      });
    }
  }

  function validarSenha(input, regrasEl) {
    const v = input.value;
    const ok = v.length >= 11 && /[A-Z]/.test(v) && /\d/.test(v) && /[^A-Za-z0-9]/.test(v);
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

  const tipo = document.createElement("input");
  tipo.placeholder = "Tipo";
  tipo.readOnly = true;
  tipo.className = "tipo-destino";

  const destino = document.createElement("select");
  atualizarDestinosURA(destino);

  destino.onchange = () => {
    const opt = destino.selectedOptions[0];
    tipo.value = opt?.dataset.tipo || "";
  };

  const desc = document.createElement("input");
  desc.placeholder = "Descrição";

  const del = document.createElement("button");
  del.textContent = "🗑";
  del.onclick = () => wrap.remove();

  wrap.append(tecla, tipo, destino, desc, del);
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

function atualizarSelectAgentesFila() {
  document.querySelectorAll("#listaFilas .campo-descricao").forEach(f=>{
    const s=f.querySelector("select");
    if(!s)return;
    const atual=s.value;
    s.innerHTML=`<option value="">Selecione um agente</option>`;
    document.querySelectorAll("#listaAgentes .campo-nome").forEach(a=>{
      s.add(new Option(a.value,a.value));
    });
    s.value=atual;
  });
}

function atualizarSelectRamaisGrupo(){
  document.querySelectorAll("#listaGrupoRing .campo-descricao").forEach(g=>{
    const s=g.querySelectorAll("select")[1];
    if(!s)return;
    const atual=s.value;
    s.innerHTML=`<option value="">Selecione um ramal</option>`;
    document.querySelectorAll("#listaRings .campo-nome").forEach(r=>{
      s.add(new Option(r.value,r.value));
    });
    s.value=atual;
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

  const diasSemana = ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"];
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

window.criarRangeRamais = function(){
  const ini=+ramalInicio.value;
  const fim=+ramalFim.value;
  if(!ini||!fim||fim<ini)return;
  const c=document.getElementById("listaRings");
  for(let i=ini;i<=fim;i++){
    const campo=criarCampo("ring");
    campo.querySelector(".campo-nome").value=i;
    c.append(campo);
  }
  syncTudo();
};

/* ================= MOTOR ================= */

function syncTudo(){
  gerarAgentesAPartirUsuarios();
  atualizarSelectAgentesFila();
  atualizarSelectRamaisGrupo();
  atualizarTodosDestinosURA();
}

document.addEventListener("input",e=>{
  if(e.target.closest(".campo-descricao")) syncTudo();
});
document.addEventListener("change",e=>{
  if(e.target.closest(".campo-descricao")) syncTudo();
});

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
    header.forEach((h, i) => d[h] = (v[i] || "").trim());

    const campo = criarCampo(tipo);
    campo.querySelector(".campo-nome").value = d.usuario || d.nome || d.ramal || "";

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

    // 🔒 trava se existir agente sem ramal
    const agentesSemRamal = [];
    document.querySelectorAll("#listaAgentes .campo-descricao").forEach((a, i) => {
      if (!a.getRamal || !a.getRamal()) {
        agentesSemRamal.push(`Agente ${i + 1}`);
        a.classList.add("campo-erro");
      } else {
        a.classList.remove("campo-erro");
      }
    });

    if (agentesSemRamal.length) {
      mostrarToast("Existe agente sem ramal vinculado", true);
      return;
    }

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
        nome: a.querySelector(".campo-nome").value,
        ramal: a.getRamal()
      });
    });

    const dados = {
      voz: {
        usuarios,
        ramais,
        agentes,
        filas,
        regras_tempo
      }
    };

    document.getElementById("resultado").textContent =
      JSON.stringify(dados, null, 2);

    mostrarToast("JSON gerado com sucesso!");

  } catch (e) {
    console.error(e);
    mostrarToast("Erro ao gerar JSON", true);
  }
};

// ================= SALVAR CONFIGURAÇÃO =================

window.salvarConfiguracao = function () {

  // gera o JSON antes
  explorar();

  const resultado = document.getElementById("resultado")?.textContent;
  if (!resultado) {
    mostrarToast("Gere a configuração antes de salvar", true);
    return;
  }

  localStorage.setItem("CONFIG_CADERNO", resultado);

  console.log("CONFIG_CADERNO salvo:", resultado);

  window.location.href = "resumo.html";
};

// ================= CHAT STATE OFICIAL =================

window.chatState = window.chatState || {
  tipo: "",
  api: "",
  conta: "",
  canais: []
};

// 👉 seleciona TIPO (api / qr)
window.selecionarTipoChat = function (el, tipo) {
  window.chatState.tipo = tipo;

  document.querySelectorAll(".tipo-chat .chat-card")
    .forEach(c => c.classList.remove("active"));
  el.classList.add("active");

  const apiBox = document.getElementById("api-oficial");
  const qrBox = document.getElementById("chat-qr");

  if (apiBox) apiBox.style.display = tipo === "api" ? "block" : "none";
  if (qrBox) qrBox.style.display = tipo === "qr" ? "block" : "none";

  console.log("CHAT STATE:", window.chatState);
};

// 👉 fornecedor oficial (Meta, 360, Gupshup…)
window.selecionarApi = function (el, api) {
  window.chatState.api = api;

  document.querySelectorAll("#api-oficial .chat-card")
    .forEach(c => c.classList.remove("active"));
  el.classList.add("active");

  console.log("CHAT STATE:", window.chatState);
};

// 👉 conta (cliente / ERA)
window.selecionarConta = function (el, conta) {
  window.chatState.conta = conta;

  document.querySelectorAll(".bloco-conta .chat-card")
    .forEach(c => c.classList.remove("active"));
  el.classList.add("active");

  console.log("CHAT STATE:", window.chatState);
};

// 👉 canais (whatsapp, insta, etc)
window.toggleCanal = function (el, canal) {
  el.classList.toggle("active");

  if (el.classList.contains("active")) {
    if (!window.chatState.canais.includes(canal)) {
      window.chatState.canais.push(canal);
    }
  } else {
    window.chatState.canais =
      window.chatState.canais.filter(c => c !== canal);
  }

  console.log("CHAT STATE:", window.chatState);
};
