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

if (dominioInput) {
  dominioInput.addEventListener("input", validarDominioCliente);
}

/* ================= TOAST ================= */

function mostrarToast(msg, error = false) {
  const t = document.getElementById("toastGlobal");
  const m = document.getElementById("toastMessage");
  if (!t || !m) return;

  m.textContent = msg;
  t.className =
