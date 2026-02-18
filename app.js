/* ================= INIT ================= */

console.log("APP.JS FINAL – CONSOLIDADO DEFINITIVO (AJUSTADO)");

window.addEventListener("error", e => {
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

/* ================= AGENTES – SYNC CENTRAL ================= */

function atualizarSelectRamaisAgentes() {
  document.querySelectorAll("#listaAgentes .campo-descricao").forEach(a => {
    const select = a.querySelector("select");
    if (!select) return;

    const atual = select.value;
    select.innerHTML = `<option value="">Ramal (obrigatório)</option>`;

    document.querySelectorAll("#listaRings .campo-nome").forEach(r => {
      if (r.value) select.add(new Option(r.value, r.value));
    });

    select.value = atual;
  });
}

function syncAgentes() {
  gerarAgentesAPartirUsuarios();
  atualizarSelectRamaisAgentes();
  atualizarSelectAgentesFila();
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

  const container = document.getElementById(listas[tipo]);
  if (!container || container.children.length >= LIMITE) return;

  const campo = criarCampo(tipo);
  container.appendChild(campo);

  if (tipo === "ring") {
    syncAgentes();
    return;
  }

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
  nome.style.width = "100%";

  const placeholders = {
    usuario_web: "Digite o nome do usuário",
    ring: "Digite o número do ramal",
    fila: "Digite o nome da fila",
    ura: "Digite o nome da URA"
  };

  nome.placeholder = placeholders[tipo] || "Digite o nome";

  const del = document.createElement("button");
  del.textContent = "✖";
  del.onclick = () => {
    wrap.remove();
    syncAgentes();
    syncTudo();
  };

  linha.append(nome, del);
  wrap.append(linha);

  let emailInput, senhaInput, chkAgente, regras;

  /* ===== USUÁRIO WEB ===== */
  if (tipo === "usuario_web") {
    emailInput = document.createElement("input");
    emailInput.type = "email";
    emailInput.placeholder = "E-mail";

    senhaInput = document.createElement("input");
    senhaInput.placeholder = "Senha";
    senhaInput.className = "campo-senha";

    wrap.append(emailInput, senhaInput);

    chkAgente = document.createElement("input");
    chkAgente.type = "checkbox";
    chkAgente.onchange = () => {
      syncAgentes();
      syncTudo();
    };

    const lbl = document.createElement("label");
    lbl.append(chkAgente, document.createTextNode(" Este usuário é agente"));
    wrap.append(lbl);

    regras = document.createElement("div");
    wrap.append(regras);

    senhaInput.oninput = () => validarSenha(senhaInput, regras);
  }

  /* ===== RAMAL ===== */
  if (tipo === "ring") {
    const info = document.createElement("div");
    info.className = "regra-neutra";
    info.textContent = "Ramal deve ter 3 a 6 dígitos e não iniciar com 0.";

    nome.oninput = () => {
      nome.value = nome.value.replace(/\D/g, "");
      syncAgentes();
    };

    senhaInput = document.createElement("input");
    senhaInput.placeholder = "Senha do ramal";
    senhaInput.className = "campo-senha";

    regras = document.createElement("div");
    senhaInput.oninput = () => validarSenha(senhaInput, regras);

    wrap.append(senhaInput, regras, info);
  }

  wrap.getNome = () => nome.value;
  wrap.getEmail = () => emailInput?.value || "";
  wrap.getSenha = () => senhaInput?.value || "";
  wrap.isAgente = () => chkAgente?.checked || false;

  return wrap;
}

/* ================= AGENTES ================= */

function gerarAgentesAPartirUsuarios() {
  const lista = document.getElementById("listaAgentes");
  if (!lista) return;

  const estado = {};
  lista.querySelectorAll(".campo-descricao").forEach(a => {
    const n = a.querySelector(".campo-nome")?.value;
    if (n) estado[n] = a.getRamal?.() || "";
  });

  lista.innerHTML = "";

  document.querySelectorAll("#listaUsuariosWeb .campo-descricao").forEach(u => {
    if (!u.isAgente || !u.isAgente() || !u.getNome()) return;

    const wrap = document.createElement("div");
    wrap.className = "campo-descricao";

    const nome = document.createElement("input");
    nome.value = u.getNome();
    nome.disabled = true;
    nome.className = "campo-nome";

    const select = document.createElement("select");
    select.innerHTML = `<option value="">Ramal (obrigatório)</option>`;

    document.querySelectorAll("#listaRings .campo-nome").forEach(r => {
      if (r.value) select.add(new Option(r.value, r.value));
    });

    if (estado[u.getNome()]) select.value = estado[u.getNome()];

    wrap.append(nome, select);
    wrap.getRamal = () => select.value;

    lista.appendChild(wrap);
  });
}

/* ================= CSV ================= */

function processarCSV(tipo, texto) {
  const linhas = texto.replace(/\r/g, "").split("\n").filter(l => l.trim());
  if (linhas.length < 2) return;

  const sep = linhas[0].includes(";") ? ";" : ",";
  const header = linhas.shift().split(sep).map(h => h.trim().toLowerCase());
  const container = document.getElementById(listas[tipo]);

  linhas.forEach(l => {
    const v = l.split(sep);
    const d = {};
    header.forEach((h, i) => d[h] = v[i]?.trim());

    const campo = criarCampo(tipo);
    campo.querySelector(".campo-nome").value = d.usuario || d.nome || d.ramal || "";

    if (tipo === "usuario_web" && d.agente?.toLowerCase() === "sim") {
      campo.querySelector("input[type=checkbox]").checked = true;
    }

    if (tipo === "ring") {
      campo.querySelector(".campo-senha").value = d.senha || "";
    }

    container.appendChild(campo);
  });

  syncAgentes();
  syncTudo();
}

/* ================= MOTOR ================= */

function syncTudo() {
  atualizarSelectAgentesFila?.();
  atualizarTodosDestinosURA?.();
}

/* ================= TOAST ================= */

function mostrarToast(msg, err = false) {
  console.log(err ? "ERRO:" : "INFO:", msg);
}
