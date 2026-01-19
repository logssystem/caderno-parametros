console.log("APP.JS FINAL – BASE ESTÁVEL CONSOLIDADA");

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
  const container = document.getElementById(listas[tipo]);
  if (!container || container.children.length >= LIMITE) return;
  container.appendChild(criarCampo(tipo));
  syncTudo();
};

/* ================= CRIAR CAMPO ================= */

function criarCampo(tipo) {
  const wrap = document.createElement("div");
  wrap.className = "campo-descricao";

  const linha = document.createElement("div");
  linha.className = "linha-principal";

  const nome = document.createElement("input");
  nome.className = "campo-nome";
  nome.placeholder = "Nome";
  nome.oninput = syncTudo;

  const btn = document.createElement("button");
  btn.textContent = "✖";
  btn.onclick = () => { wrap.remove(); syncTudo(); };

  linha.append(nome, btn);
  wrap.append(linha);

  let emailInput=null, senhaInput=null, permissao=null, chkAgente=null;

  /* ===== USUÁRIO ===== */
  if (tipo === "usuario_web") {
    emailInput = document.createElement("input");
    emailInput.placeholder = "E-mail";

    senhaInput = document.createElement("input");
    senhaInput.placeholder = "Senha";

    wrap.append(emailInput, senhaInput);

    permissao = document.createElement("select");
    permissao.append(new Option("Permissão", ""));
    PERMISSOES.forEach(p=>permissao.add(new Option(p,p)));
    wrap.append(permissao);

    chkAgente = document.createElement("input");
    chkAgente.type = "checkbox";
    wrap.append(chkAgente, document.createTextNode(" É agente"));
  }

  /* ===== RAMAL ===== */
  if (tipo === "ring") {
    senhaInput = document.createElement("input");
    senhaInput.placeholder = "Senha do ramal";
    wrap.append(senhaInput);
  }

  /* ===== FILA ===== */
  if (tipo === "fila") {
    const select = document.createElement("select");
    select.innerHTML = `<option value="">Selecione um agente</option>`;
    wrap.append(select);
    wrap.dataset.agentes = "[]";

    const btnAdd = document.createElement("button");
    btnAdd.textContent = "Adicionar agente";
    wrap.append(btnAdd);

    const lista = document.createElement("div");
    wrap.append(lista);

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

  wrap.getNome = () => nome.value;
  wrap.isAgente = () => chkAgente?.checked || false;

  return wrap;
}

/* ================= AGENTES AUTOMÁTICOS ================= */

function gerarAgentesAPartirUsuarios() {
  const lista = document.getElementById("listaAgentes");
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

/* ================= FILAS ENXERGAM AGENTES ================= */

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

/* ================= GRUPOS ENXERGAM RAMAIS ================= */

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

/* ================= REGRA DE TEMPO (RESTAURADA) ================= */

window.adicionarRegraTempo = function(){
  const c=document.getElementById("listaRegrasTempo");
  if(!c)return;
  const d=document.createElement("div");
  d.className="campo-descricao";
  d.innerHTML=`<input placeholder="Nome da regra"> <input type="time"> <input type="time">`;
  c.append(d);
};

/* ================= RANGE RAMAIS (RESTAURADO) ================= */

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
}

document.addEventListener("input",e=>{
  if(e.target.closest(".campo-descricao"))syncTudo();
});
