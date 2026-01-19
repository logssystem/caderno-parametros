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
  if (!listas[tipo]) return mostrarToast(`Tipo inválido: ${tipo}`, true);
  const container = document.getElementById(listas[tipo]);
  if (!container || container.children.length >= LIMITE) return;
  container.appendChild(criarCampo(tipo));
  atualizarTodosDestinosURA();
  syncTudo();
};

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
  const lista = document.getElementById("listaAgentes");
  if(!lista) return;
  lista.innerHTML = "";

  document.querySelectorAll("#listaUsuariosWeb .campo-descricao").forEach(u=>{
    if(u.isAgente() && u.getNome()){
      const d=document.createElement("div");
      d.className="campo-descricao";
      const i=document.createElement("input");
      i.value=u.getNome();
      i.disabled=true;
      i.className="campo-nome";
      d.append(i);
      lista.append(d);
    }
  });
}

/* ================= DESTINOS URA ================= */

function atualizarDestinosURA(select) {
  if (!select) return;
  select.innerHTML = "";
  select.add(new Option("Selecione o destino", ""));

  ["listaFilas","listaRings","listaGrupoRing","listaURAs","listaRegrasTempo"].forEach(id=>{
    document.querySelectorAll(`#${id} .campo-nome`).forEach(i=>{
      if(i.value) select.add(new Option(i.value, `${id}:${i.value}`));
    });
  });
}

function atualizarTodosDestinosURA() {
  document.querySelectorAll(".opcao-ura select").forEach(select=>{
    const atual = select.value;
    atualizarDestinosURA(select);
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

window.adicionarRegraTempo = function(){
  const c=document.getElementById("listaRegrasTempo");
  if(!c)return;
  const d=document.createElement("div");
  d.className="campo-descricao";
  d.innerHTML=`<input placeholder="Nome da regra"> <input type="time"> <input type="time">`;
  c.append(d);
};

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
