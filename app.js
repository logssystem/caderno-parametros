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

/* ================= DOMÍNIO ================= */

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

dominioInput?.addEventListener("input", validarDominioCliente);

/* ================= TOAST ================= */

function mostrarToast(msg, error = false) {
  const t = document.getElementById("toastGlobal");
  const m = document.getElementById("toastMessage");
  if (!t || !m) return;

  m.textContent = msg;
  t.className = "toast show" + (error ? " error" : "");
  setTimeout(() => t.classList.remove("show"), 3000);
}

/* ================= CHAT – INFO AGENTE ================= */

window.informarAgenteChat = function () {
  mostrarToast(
    "Os agentes omnichannel são gerados automaticamente a partir dos usuários marcados como agente.",
    true
  );
};

// ponte para não quebrar HTML antigo
window.adicionarAgenteChat = function () {
  informarAgenteChat();
};

/* ================= SALVAR ================= */

window.salvarConfiguracao = function () {
  explorar();

  const resultado = document.getElementById("resultado")?.textContent;
  if (!resultado || !resultado.trim()) {
    mostrarToast("Gere a configuração antes de salvar", true);
    return;
  }

  localStorage.setItem("CONFIG_CADERNO", resultado);
  window.location.href = "resumo.html";
};

/* ================= EXPLORAR ================= */

window.explorar = function () {
  try {
    const empresa = document.getElementById("empresaCliente")?.value.trim();
    const dominio = document.getElementById("dominioCliente")?.value.trim();

    if (!empresa || !dominio) {
      mostrarToast("Preencha o nome da empresa e o domínio", true);
      return;
    }

    if (!validarDominioCliente()) return;

    /* ===== VOZ ===== */

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
      ramais.push({ ramal: r.getNome(), senha: r.getSenha() });
    });

    const agentes = [];
    document.querySelectorAll("#listaAgentes .campo-descricao").forEach(a => {
      agentes.push({
        nome: a.querySelector(".campo-nome")?.value || "",
        ramal: a.getRamal()
      });
    });

    if (agentes.some(a => !a.ramal)) {
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

    /* ===== CHAT ===== */

    const usuariosChat = [];
    document.querySelectorAll("#listaUsuariosChat .campo-descricao").forEach(u => {
      if (u.getData) usuariosChat.push(u.getData());
    });

    const departamentosChat = [];
    const agentesVinculados = new Set();

    document.querySelectorAll("#listaDepartamentosChat .campo-descricao").forEach(d => {
      const data = d.getData?.();
      if (!data?.nome) return;

      (data.agentes || []).forEach(a => agentesVinculados.add(a));

      departamentosChat.push({
        nome: data.nome,
        agentes: data.agentes || []
      });
    });

    usuariosChat.forEach(u => {
      const isAgente =
        u.agente === true ||
        u.permissoes?.includes("Agente Omnichannel");

      if (isAgente && !agentesVinculados.has(u.nome)) {
        mostrarToast(`O agente "${u.nome}" não está em nenhum departamento`, true);
        throw new Error("Agente chat sem departamento");
      }
    });

    /* ===== JSON FINAL ===== */

    const dados = {
      cliente: { empresa, dominio },
      voz: { usuarios, ramais, agentes, filas, regras_tempo },
      chat: {
        ...(window.chatState || {}),
        usuarios: usuariosChat,
        departamentos: departamentosChat
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
