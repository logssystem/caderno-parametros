console.log("APP.JS FINAL – FILAS MULTI-AGENTES + VALIDAÇÃO");

/* ================= ESTADO ================= */

window.APP_STATE = {
  usuarios: [],
  ramais: [],
  agentes: [],
  filas: []
};

function uid(prefix="id"){
  return prefix+"_"+Math.random().toString(36).substr(2,9);
}

/* ================= CONFIG ================= */

const LIMITE = 600;

const listas = {
  usuario_web:"listaUsuariosWeb",
  entrada:"listaEntradas",
  ura:"listaURAs",
  fila:"listaFilas",
  ring:"listaRings",
  grupo_ring:"listaGrupoRing",
  agente:"listaAgentes"
};

const PERMISSOES = [
  "Administrador do Módulo de PABX",
  "Agente de Call Center",
  "Supervisor(a) de Call Center",
  "CRM","CRM Owner",
  "Administrador do Módulo de Omnichannel",
  "Agente Omnichannel",
  "Supervisor(a) Omnichannel",
  "Super Administrador"
];

/* ================= CORE ================= */

window.adicionarCampo = function(tipo){
  const box = document.getElementById(listas[tipo]);
  if(!box || box.children.length>=LIMITE) return;

  const campo = criarCampo(tipo);
  box.appendChild(campo);

  atualizarUsuariosRamal();
  atualizarAgentes();
  atualizarAgentesFila();
};

/* ================= CAMPOS ================= */

function criarCampo(tipo){
  const wrap = document.createElement("div");
  wrap.className="campo-descricao";
  wrap.dataset.id = uid(tipo);

  const linha = document.createElement("div");
  linha.className="linha-principal";

  const nome = document.createElement("input");
  nome.className="campo-nome";
  nome.placeholder=`Digite ${tipo.replace("_"," ")}`;

  const del = document.createElement("button");
  del.textContent="✖";
  del.onclick=()=>{
    wrap.remove();
    atualizarUsuariosRamal();
    atualizarAgentes();
    atualizarAgentesFila();
  };

  linha.append(nome,del);
  wrap.append(linha);

  let email=null, senha=null, permissao=null, chkAgente=null;

/* ===== USUÁRIO ===== */

  if(tipo==="usuario_web"){
    email=document.createElement("input");
    email.placeholder="E-mail";

    senha=document.createElement("input");
    senha.placeholder="Senha";
    senha.className="campo-senha";

    permissao=document.createElement("select");
    permissao.append(new Option("Selecione a permissão",""));
    PERMISSOES.forEach(p=>permissao.add(new Option(p,p)));

    chkAgente=document.createElement("input");
    chkAgente.type="checkbox";
    chkAgente.onchange=()=>{ atualizarAgentes(); atualizarAgentesFila(); };

    const lbl=document.createElement("label");
    lbl.style.display="flex";
    lbl.style.gap="6px";
    lbl.append(chkAgente,document.createTextNode(" Usuário é agente"));

    wrap.append(email,senha,permissao,lbl);
  }

/* ===== RAMAL ===== */

  if(tipo==="ring"){
    senha=document.createElement("input");
    senha.placeholder="Senha do ramal";
    senha.className="campo-senha";

    const sel=document.createElement("select");
    sel.innerHTML=`<option value="">Vincular usuário (opcional)</option>`;
    sel.onchange=()=>wrap.dataset.usuarioId=sel.value||"";

    wrap.append(senha,sel);
  }

/* ===== AGENTE ===== */

  if(tipo==="agente"){
    const selUser=document.createElement("select");
    const selRamal=document.createElement("select");

    selUser.innerHTML=`<option value="">Usuário agente</option>`;
    selRamal.innerHTML=`<option value="">Ramal (obrigatório)</option>`;

    selUser.onchange=()=>wrap.dataset.usuarioId=selUser.value;
    selRamal.onchange=()=>wrap.dataset.ramalId=selRamal.value;

    wrap.append(selUser,selRamal);

    wrap.atualizar=()=>{
      carregarUsuariosAgentes(selUser);
      carregarRamais(selRamal,wrap.dataset.ramalId);
    };

    setTimeout(()=>wrap.atualizar(),30);
  }

/* ===== FILA (MULTI AGENTE) ===== */

  if(tipo==="fila"){
    wrap.dataset.agentes="[]";

    const sel=document.createElement("select");
    sel.innerHTML=`<option value="">Selecione um agente</option>`;

    const btn=document.createElement("button");
    btn.textContent="+ Adicionar agente";

    const lista=document.createElement("div");
    lista.style.marginTop="10px";

    btn.onclick=()=>{
      if(!sel.value) return;

      let arr=JSON.parse(wrap.dataset.agentes);
      if(arr.includes(sel.value)) return;

      arr.push(sel.value);
      wrap.dataset.agentes=JSON.stringify(arr);
      render();
    };

    function render(){
      lista.innerHTML="";
      let arr=JSON.parse(wrap.dataset.agentes);

      arr.forEach(id=>{
        const a=document.querySelector(`#listaAgentes .campo-descricao[data-id="${id}"]`);
        if(!a) return;

        const item=document.createElement("div");
        item.style.display="flex";
        item.style.justifyContent="space-between";
        item.style.marginBottom="6px";

        const span=document.createElement("span");
        span.textContent=a.querySelector(".campo-nome")?.value||"Agente";

        const b=document.createElement("button");
        b.textContent="🗑";
        b.onclick=()=>{
          wrap.dataset.agentes=JSON.stringify(arr.filter(x=>x!==id));
          render();
        };

        item.append(span,b);
        lista.appendChild(item);
      });
    }

    wrap.atualizarFila=()=>{
      carregarAgentesFila(sel);
      render();
    };

    wrap.append(sel,btn,lista);
    setTimeout(()=>wrap.atualizarFila(),40);
  }

  wrap.getNome=()=>nome.value.trim();
  wrap.getEmail=()=>email?.value||"";
  wrap.getSenha=()=>senha?.value||"";
  wrap.getPermissao=()=>permissao?.value||"";
  wrap.isAgente=()=>chkAgente?chkAgente.checked:false;

  return wrap;
}

/* ================= SINCRONIZAÇÕES ================= */

function atualizarUsuariosRamal(){
  const users=[...listaUsuariosWeb.children].map(c=>({id:c.dataset.id,nome:c.getNome()})).filter(u=>u.nome);

  document.querySelectorAll("#listaRings .campo-descricao select").forEach(sel=>{
    const atual=sel.value;
    sel.innerHTML=`<option value="">Vincular usuário (opcional)</option>`;
    users.forEach(u=>{
      const o=new Option(u.nome,u.id);
      if(u.id===atual) o.selected=true;
      sel.add(o);
    });
  });
}

function atualizarAgentes(){
  document.querySelectorAll("#listaAgentes .campo-descricao").forEach(a=>{
    if(a.atualizar) a.atualizar();
  });
}

function atualizarAgentesFila(){
  document.querySelectorAll("#listaFilas .campo-descricao").forEach(f=>{
    if(f.atualizarFila) f.atualizarFila();
  });
}

function carregarUsuariosAgentes(select){
  select.innerHTML=`<option value="">Usuário agente</option>`;
  document.querySelectorAll("#listaUsuariosWeb .campo-descricao").forEach(u=>{
    if(u.isAgente() && u.getNome()){
      select.add(new Option(u.getNome(),u.dataset.id));
    }
  });
}

function carregarRamais(select,atual=""){
  select.innerHTML=`<option value="">Ramal (obrigatório)</option>`;
  document.querySelectorAll("#listaRings .campo-descricao").forEach(r=>{
    if(r.getNome()){
      const o=new Option(r.getNome(),r.dataset.id);
      if(r.dataset.id===atual) o.selected=true;
      select.add(o);
    }
  });
}

function carregarAgentesFila(select){
  select.innerHTML=`<option value="">Selecione um agente</option>`;
  document.querySelectorAll("#listaAgentes .campo-descricao").forEach(a=>{
    if(a.dataset.usuarioId && a.dataset.ramalId){
      select.add(new Option(a.querySelector(".campo-nome").value,a.dataset.id));
    }
  });
}

/* ================= RANGE ================= */

window.criarRangeRamais=function(){
  const ini=+ramalInicio.value;
  const fim=+ramalFim.value;
  if(!ini||!fim||fim<ini) return mostrarToast("Range inválido",true);

  for(let i=ini;i<=fim;i++){
    const c=criarCampo("ring");
    c.querySelector(".campo-nome").value=i;
    listaRings.appendChild(c);
  }
  atualizarUsuariosRamal();
  atualizarAgentes();
  atualizarAgentesFila();
};

/* ================= JSON + VALIDAÇÃO ================= */

window.explorar=function(){

  let erro=false;

  const usuarios=[...listaUsuariosWeb.children].map(u=>{
    if(!u.getNome()||!u.getEmail()||!u.getSenha()||!u.getPermissao()) erro=true;
    return {
      id:u.dataset.id,
      nome:u.getNome(),
      email:u.getEmail(),
      senha:u.getSenha(),
      permissao:u.getPermissao(),
      agente:u.isAgente()
    };
  });

  const ramais=[...listaRings.children].map(r=>{
    if(!r.getNome()||!r.getSenha()) erro=true;
    return {
      id:r.dataset.id,
      ramal:r.getNome(),
      senha:r.getSenha(),
      usuarioId:r.dataset.usuarioId||null
    };
  });

  const agentes=[...listaAgentes.children].map(a=>{
    if(!a.dataset.usuarioId||!a.dataset.ramalId) erro=true;
    return {
      id:a.dataset.id,
      nome:a.querySelector(".campo-nome").value,
      usuarioId:a.dataset.usuarioId,
      ramalId:a.dataset.ramalId
    };
  });

  const filas=[...listaFilas.children].map(f=>{
    const arr=JSON.parse(f.dataset.agentes||"[]");
    if(!f.querySelector(".campo-nome").value||arr.length===0) erro=true;
    return {
      nome:f.querySelector(".campo-nome").value,
      agentes:arr
    };
  });

  if(erro){
    mostrarToast("Preencha todos os campos obrigatórios",true);
    return;
  }

  const dados={voz:{usuarios,ramais,agentes,filas}};
  resultado.textContent=JSON.stringify(dados,null,2);
  mostrarToast("JSON gerado com sucesso!");
};

/* ================= TOAST ================= */

function mostrarToast(msg,erro=false){
  toastMessage.textContent=msg;
  toastGlobal.className="toast show"+(erro?" error":"");
  setTimeout(()=>toastGlobal.classList.remove("show"),3000);
}
