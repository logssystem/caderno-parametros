console.log("APP.JS CARREGADO - VERSÃO FINAL");

const LIMITE = 10;

const listas = {
  usuario_web: "listaUsuariosWeb",
  entrada: "listaEntradas",
  ura: "listaURAs",
  fila: "listaFilas",
  ring: "listaRings",
  agente: "listaAgentes"
};

window.adicionarCampo = function (tipo) {
  const container = document.getElementById(listas[tipo]);
  if (!container) return;
  if (container.children.length >= LIMITE) return;

  container.appendChild(criarCampo(tipo));
};

function criarCampo(tipo) {
  const wrap = document.createElement("div");
  wrap.className = "campo-descricao";

  const linha = document.createElement("div");
  linha.className = "linha-principal";

  const nome = document.createElement("input");
  nome.placeholder = `Digite ${tipo.replace("_", " ")}`;

  const btn = document.createElement("button");
  btn.textContent = "✖";
  btn.onclick = () => wrap.remove();

  linha.append(nome, btn);
  wrap.append(linha);

  let senhaInput, regrasBox;

  if (tipo === "usuario_web") {
    senhaInput = document.createElement("input");
    senhaInput.className = "campo-senha";
    senhaInput.placeholder = "Senha do usuário";

    regrasBox = document.createElement("div");

    const regras = [
      ["11 caracteres", v => v.length >= 11],
      ["1 letra maiúscula", v => /[A-Z]/.test(v)],
      ["1 número", v => /\d/.test(v)],
      ["1 especial", v => /[^A-Za-z0-9]/.test(v)]
    ];

    senhaInput.addEventListener("input", () => {
      regrasBox.innerHTML = "";
      senhaInput.classList.remove("senha-invalida");

      const valor = senhaInput.value;

      for (let [txt, fn] of regras) {
        if (!fn(valor)) {
          regrasBox.innerHTML = `<div class="regra-erro">A senha deve conter ${txt}</div>`;
          senhaInput.classList.add("senha-invalida");
          ajustarLargura(senhaInput, valor.length);
          return;
        }
      }

      regrasBox.innerHTML = `<div class="regra-ok">Senha segura</div>`;
      ajustarLargura(senhaInput, valor.length);
    });

    wrap.append(senhaInput, regrasBox);
  }

  const desc = document.createElement("textarea");
  desc.placeholder = "Descrição (opcional)";
  wrap.append(desc);

  return wrap;
}

function ajustarLargura(input, len) {
  input.style.width = len > 12 ? "100%" : len > 8 ? "75%" : "50%";
}

function senhaValida(v) {
  return v.length >= 11 && /[A-Z]/.test(v) && /\d/.test(v) && /[^A-Za-z0-9]/.test(v);
}

window.explorar = function () {
  let erro = false;
  const dados = {};

  Object.keys(listas).forEach(tipo => {
    dados[tipo] = [];
    document.getElementById(listas[tipo]).querySelectorAll(".campo-descricao")
      .forEach(c => {
        const nome = c.querySelector("input")?.value;
        if (!nome) return;

        const item = { nome };

        if (tipo === "usuario_web") {
          const senha = c.querySelector(".campo-senha").value;
          if (!senhaValida(senha)) erro = true;
          item.senha = senha;
        }

        dados[tipo].push(item);
      });
  });

  if (erro) {
    mostrarToast("Existe senha inválida. Corrija antes de continuar.", true);
    return;
  }

  document.getElementById("resultado").textContent =
    JSON.stringify(dados, null, 2);

  mostrarToast("Atualização completa");
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

/* TEMA */
const toggleTheme = document.getElementById("toggleTheme");
toggleTheme.onclick = () => {
  document.body.classList.toggle("dark");
};
