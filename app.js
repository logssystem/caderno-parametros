console.log("APP.JS FINAL");

const listas = {
  usuario_web: "listaUsuariosWeb",
  entrada: "listaEntradas",
  ura: "listaURAs",
  fila: "listaFilas",
  ring: "listaRings",
  agente: "listaAgentes"
};

/* CAMPOS */
window.adicionarCampo = function (tipo) {
  const container = document.getElementById(listas[tipo]);
  if (!container) return;

  const wrap = document.createElement("div");
  wrap.className = "campo-descricao";

  const linha = document.createElement("div");
  linha.className = "linha-principal";

  const input = document.createElement("input");
  input.placeholder = `Digite ${tipo.replace("_", " ")}`;

  const btn = document.createElement("button");
  btn.textContent = "✖";
  btn.onclick = () => wrap.remove();

  linha.append(input, btn);
  wrap.append(linha);

  const desc = document.createElement("textarea");
  desc.placeholder = "Descrição (opcional)";
  wrap.append(desc);

  container.appendChild(wrap);
};

/* EXPORTAR */
window.explorar = function () {
  const dados = {};
  Object.keys(listas).forEach(t => {
    dados[t] = [...document.getElementById(listas[t]).children].map(c => ({
      nome: c.querySelector("input")?.value || "",
      descricao: c.querySelector("textarea")?.value || ""
    }));
  });

  document.getElementById("resultado").textContent =
    JSON.stringify(dados, null, 2);

  mostrarToast("Exportação realizada com sucesso!");
};

/* TOAST */
function mostrarToast(msg, error = false) {
  const t = document.getElementById("toastGlobal");
  document.getElementById("toastMessage").textContent = msg;
  t.className = "toast show" + (error ? " error" : "");
  setTimeout(() => t.classList.remove("show"), 4000);
}

function fecharToast() {
  document.getElementById("toastGlobal").classList.remove("show");
}

/* TEMA – DEFINITIVO */
const toggleTheme = document.getElementById("toggleTheme");
const saved = localStorage.getItem("theme");

if (saved === "dark") {
  document.body.classList.add("dark");
  toggleTheme.textContent = "☀️";
} else {
  toggleTheme.textContent = "🌙";
}

toggleTheme.onclick = () => {
  const dark = document.body.classList.toggle("dark");
  toggleTheme.textContent = dark ? "☀️" : "🌙";
  localStorage.setItem("theme", dark ? "dark" : "light");
};
