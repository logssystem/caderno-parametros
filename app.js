function criarCampo(tipo) {
  const wrap = document.createElement("div");
  wrap.className = "campo campo-descricao";

  /* Linha principal (input + remover) */
  const linha = document.createElement("div");
  linha.className = "linha-principal";

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = `Digite ${tipo.replace("_", " ")}`;

  const btn = document.createElement("button");
  btn.textContent = "✖";
  btn.type = "button";
  btn.onclick = () => wrap.remove();

  linha.append(input, btn);

  /* Descrição */
  const desc = document.createElement("textarea");
  desc.placeholder = "Descrição (opcional)";

  /* Toggle Não será utilizado */
  const toggleWrap = document.createElement("div");
  toggleWrap.className = "campo-toggle";

  const label = document.createElement("label");
  label.className = "toggle-label";

  const spanText = document.createElement("span");
  spanText.textContent = "Não será utilizado";

  const chk = document.createElement("input");
  chk.type = "checkbox";

  const slider = document.createElement("span");
  slider.className = "toggle-slider";

  label.append(spanText, chk, slider);
  toggleWrap.appendChild(label);

  /* Comportamento do toggle */
  chk.addEventListener("change", () => {
    const disabled = chk.checked;

    input.disabled = disabled;
    desc.disabled = disabled;

    if (disabled) {
      input.value = "";
      desc.value = "";
      wrap.classList.add("desativado");
    } else {
      wrap.classList.remove("desativado");
    }
  });

  wrap.append(linha, desc, toggleWrap);
  return wrap;
}
