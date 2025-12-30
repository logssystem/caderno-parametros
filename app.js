function criarCampo(tipo) {
  const wrap = document.createElement("div");
  wrap.className = "campo-descricao";

  /* ================= NOME ================= */
  const linhaNome = document.createElement("div");
  linhaNome.className = "linha-principal";

  const nome = document.createElement("input");
  nome.placeholder = `Digite ${tipo.replace("_", " ")}`;
  nome.classList.add("campo-nome");
  nome.style.width = "100%";

  const btn = document.createElement("button");
  btn.textContent = "✖";
  btn.onclick = () => wrap.remove();

  linhaNome.append(nome, btn);
  wrap.append(linhaNome);

  let emailInput = null;
  let senhaInput = null;
  let permissao = null;
  let regras = null;
  let senhaOk = false;

  const precisaSenha = tipo === "usuario_web" || tipo === "ring";

  /* ================= EMAIL + SENHA ================= */
  if (precisaSenha) {
    const linhaCred = document.createElement("div");
    linhaCred.className = "linha-principal";
    linhaCred.style.gap = "12px";
    linhaCred.style.marginTop = "12px";

    if (tipo === "usuario_web") {
      emailInput = document.createElement("input");
      emailInput.type = "email";
      emailInput.placeholder = "E-mail do usuário";
      emailInput.style.flex = "1";
      linhaCred.append(emailInput);
    }

    senhaInput = document.createElement("input");
    senhaInput.placeholder = "Senha do usuário";
    senhaInput.classList.add("campo-senha");
    senhaInput.style.flex = "1";

    linhaCred.append(senhaInput);
    wrap.append(linhaCred);

    /* ===== REGRAS DE SENHA ===== */
    regras = document.createElement("div");
    regras.style.marginTop = "8px";
    wrap.append(regras);

    senhaInput.oninput = () => {
      const v = senhaInput.value;
      senhaOk = false;

      if (v.length < 11) return regra("Mínimo de 11 caracteres");
      if (!/[A-Z]/.test(v)) return regra("Pelo menos 1 letra maiúscula");
      if (!/\d/.test(v)) return regra("Pelo menos 1 número");
      if (!/[^A-Za-z0-9]/.test(v)) return regra("Pelo menos 1 caractere especial");

      regras.innerHTML = `<div class="regra-ok">Senha válida</div>`;
      senhaOk = true;
    };

    function regra(msg) {
      regras.innerHTML = `<div class="regra-erro">${msg}</div>`;
    }
  }

  /* ================= PERMISSÃO (SÓ USUÁRIO WEB) ================= */
  if (tipo === "usuario_web") {
    permissao = document.createElement("select");
    permissao.classList.add("campo-permissao");
    permissao.style.marginTop = "12px";

    const opt0 = new Option("Selecione a permissão", "");
    opt0.disabled = true;
    opt0.selected = true;
    permissao.appendChild(opt0);

    PERMISSOES.forEach(p => permissao.add(new Option(p, p)));
    wrap.append(permissao);
  }

  /* ================= DESCRIÇÃO (SEMPRE POR ÚLTIMO) ================= */
  const desc = document.createElement("textarea");
  desc.placeholder = "Descrição (opcional)";
  desc.style.marginTop = "12px";
  wrap.append(desc);

  /* ================= MÉTODOS ================= */
  wrap.validarSenha = () => (precisaSenha ? senhaOk : true);
  wrap.getNome = () => nome.value;
  wrap.getEmail = () => emailInput?.value || "x@x";
  wrap.getSenha = () => senhaInput?.value || "";
  wrap.getPermissao = () => permissao?.value || "";
  wrap.setPermissaoAtalho = atalho => {
    const key = atalho?.toLowerCase();
    if (MAPA_PERMISSOES[key]) permissao.value = MAPA_PERMISSOES[key];
  };

  return wrap;
}
