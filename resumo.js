/* ======================================================
   RESET + BASE
====================================================== */
*, *::before, *::after { box-sizing: border-box; }

/* ======================================================
   VARIÁVEIS – DARK (PADRÃO)
====================================================== */
:root {
  --bg:           #0f172a;
  --text:         #e5e7eb;
  --text-soft:    #94a3b8;
  --header-bg:    rgba(2, 6, 23, 0.7);
  --card-bg:      rgba(15, 23, 42, 0.75);
  --border:       rgba(255, 255, 255, 0.08);
  --field-border: rgba(255, 255, 255, 0.1);
  --accent:       #00ffa3;
  --chip-bg:      rgba(99, 102, 241, 0.15);
  --chip-text:    #a5b4fc;
}

/* ======================================================
   VARIÁVEIS – DARK EXPLÍCITO
====================================================== */
body.dark {
  --bg:           #050b18;
  --text:         #e5e7eb;
  --header-bg:    #020617;
  --card-bg:      #0b1220;
  --border:       #1e293b;
  --field-border: #334155;
}

/* ======================================================
   VARIÁVEIS – LIGHT
====================================================== */
body.light {
  --bg:           #f1f5f9;
  --text:         #1e293b;
  --text-soft:    #64748b;
  --header-bg:    rgba(255, 255, 255, 0.9);
  --card-bg:      #ffffff;
  --border:       #e5e7eb;
  --field-border: #cbd5e1;
  --chip-bg:      #e0e7ff;
  --chip-text:    #4338ca;
}

/* ======================================================
   BODY
====================================================== */
body {
  margin: 0;
  font-family: "Inter", Arial, sans-serif;
  background: var(--bg);
  color: var(--text);
  transition: background 0.3s, color 0.3s;
}
body.dark {
  background: linear-gradient(270deg, #020617, #0f172a, #020617);
  background-size: 600% 600%;
  animation: gradientMove 20s ease infinite;
}
body.light  { background: #f1f5f9; }
body.intro .app-header { display: none; }
body.intro  { overflow: hidden; }

/* ======================================================
   FUNDO DINÂMICO (DARK)
====================================================== */
body.dark::after {
  content: "";
  position: fixed; inset: 0;
  background:
    radial-gradient(circle at 20% 30%, rgba(0,255,150,0.08), transparent 40%),
    radial-gradient(circle at 80% 70%, rgba(0,200,255,0.08), transparent 40%);
  pointer-events: none; z-index: 0;
}
body.dark::before {
  content: "";
  position: fixed; inset: 0;
  pointer-events: none; z-index: 0;
}

/* ======================================================
   ANIMAÇÕES
====================================================== */
@keyframes gradientMove {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes piscar {
  0%, 50%, 100% { opacity: 1; }
  25%, 75%      { opacity: 0; }
}
@keyframes moveParticles {
  from { transform: translateY(0); }
  to   { transform: translateY(-50%); }
}

* { transition: background 0.2s, border-color 0.2s, transform 0.2s; }

/* ======================================================
   TIPOGRAFIA
====================================================== */
h1, h2, h3, h4 { color: var(--text); }
label { color: var(--text-soft); font-size: 13px; display: block; margin-bottom: 6px; }

/* ======================================================
   HEADER
====================================================== */
.app-header {
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  align-items: center;
  padding: 16px 24px; gap: 16px;
  background: var(--header-bg);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  position: relative; z-index: 10;
}
.app-logo   { height: 64px; }
.app-title  { justify-self: center; text-align: center; margin: 0; font-size: 20px; font-weight: 800; }
.header-right { display: flex; gap: 10px; }
.theme-toggle {
  width: 42px; height: 42px; border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(30,41,59,0.8); backdrop-filter: blur(10px);
  color: #fff; font-size: 18px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  justify-self: end; transition: transform 0.2s;
}
.theme-toggle:hover { transform: scale(1.08); }

/* ======================================================
   HEADER RESUMO
====================================================== */
.resumo-header {
  position: sticky; top: 0; z-index: 1000;
  background: var(--header-bg);
  border-bottom: 1px solid var(--border);
  box-shadow: 0 6px 18px rgba(0,0,0,0.08);
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 24px; position: relative;
}
.header-center { position: absolute; left: 50%; transform: translateX(-50%); }
.resumo-header .app-logo  { height: 48px; width: auto; object-fit: contain; }
.resumo-header .app-title { text-align: center; margin: 0; font-size: 18px; font-weight: 800; }

/* ======================================================
   CONTAINER PRINCIPAL
====================================================== */
.form-container, .main-container {
  max-width: 900px; margin: 40px auto; padding: 0 20px;
  display: flex; flex-direction: column; gap: 24px;
  position: relative; z-index: 1;
}
.main-container { max-width: 1100px; padding: 30px 20px; }

/* ======================================================
   CARDS
====================================================== */
.card {
  position: relative; z-index: 1;
  background: var(--card-bg); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
  border-radius: 16px; padding: 24px; margin-bottom: 24px;
  border: 1px solid var(--border);
  box-shadow: 0 10px 30px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  animation: fadeInUp 0.4s ease;
}
.card:hover { transform: translateY(-3px); box-shadow: 0 12px 30px rgba(0,0,0,0.35); }
body.light .card { background: #ffffff; border: 1px solid #e5e7eb; box-shadow: 0 10px 20px rgba(0,0,0,0.08); }
body.dark  .card { background: linear-gradient(180deg, #0b1220, #020617); box-shadow: 0 20px 60px rgba(0,0,0,0.6); }
.card h2 {
  font-size: 19px; font-weight: 600; margin-bottom: 16px;
  padding-bottom: 10px; border-bottom: 1px solid var(--border);
  display: flex; align-items: center; gap: 8px;
}
body.dark .card h2, body.dark .card h3 { color: #f8fafc; }

/* ======================================================
   INPUTS
====================================================== */
input:not([type="checkbox"]), select, textarea {
  width: 100%; padding: 10px 12px; border-radius: 10px;
  border: 1px solid var(--field-border);
  background: rgba(255,255,255,0.05); color: var(--text);
  font-weight: 600; font-size: 14px;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
}
input::placeholder, textarea::placeholder { color: #64748b; }
input:hover:not([type="checkbox"]), select:hover, textarea:hover { border-color: rgba(255,255,255,0.2); }
input:focus:not([type="checkbox"]), select:focus, textarea:focus {
  outline: none; border-color: var(--accent);
  box-shadow: 0 0 0 2px rgba(0,255,163,0.2); transform: scale(1.01);
}
body.light input:not([type="checkbox"]), body.light textarea, body.light select {
  background: #ffffff !important; color: #111827 !important; border: 1px solid #cbd5e1 !important;
}
body.light input::placeholder, body.light textarea::placeholder { color: #9ca3af !important; }
body.dark  input:not([type="checkbox"]), body.dark textarea, body.dark select {
  background: #020617; color: #f1f5f9; border-color: #334155;
}
body.dark  input::placeholder, body.dark textarea::placeholder { color: #94a3b8; }
input.campo-senha   { width: 280px !important; max-width: 280px !important; }
select.campo-permissao { width: 280px !important; }
#empresaCliente, #dominioCliente { width: 100%; max-width: 520px; font-size: 14px; }
.campo-obrigatorio-erro { border: 2px solid #ef4444 !important; background: rgba(239,68,68,0.08); }

/* ======================================================
   BOTÕES – BASE
====================================================== */
button {
  border-radius: 10px; padding: 10px 14px;
  font-size: 13px; font-weight: 600; cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
button:hover { transform: translateY(-1px); }

/* ======================================================
   BOTÕES – VARIANTES
====================================================== */
.btn-add, .btn-import {
  height: 42px; padding: 0 16px; border-radius: 10px;
  border: 1px dashed rgba(255,255,255,0.2);
  background: rgba(255,255,255,0.05); color: var(--text); font-weight: 800;
}
.btn-add:hover, .btn-import:hover { background: rgba(0,255,150,0.15); border-color: var(--accent); color: var(--accent); }
body.light .btn-add, body.light .btn-import { background: #f8fafc !important; color: #111827 !important; border: 1px dashed #cbd5e1 !important; }
body.dark  .btn-add, body.dark .btn-import, body.dark .btn-dia, body.dark .btn-voltar-intro { color: #e5e7eb; border-color: #334155; }
body.dark  .btn-add:hover, body.dark .btn-import:hover, body.dark .btn-dia:hover { border-color: #38bdf8; color: #38bdf8; }

.btn-explorar, .btn-salvar {
  background: linear-gradient(90deg, #00ffa3, #00cfff);
  color: #000; font-weight: 700; border: none;
  box-shadow: 0 6px 20px rgba(0,255,150,0.3);
}
.btn-explorar { margin: 40px auto; padding: 16px 40px; border-radius: 14px; font-weight: 900; display: block; }
.btn-explorar:hover { transform: scale(1.03); }
.btn-salvar   { padding: 12px 28px; border-radius: 8px; }

.btn-voltar-intro {
  background: transparent; border: 2px dashed var(--border);
  border-radius: 10px; padding: 10px 16px; color: var(--text);
  font-weight: 800; cursor: pointer;
  position: relative; z-index: 9999; pointer-events: auto; white-space: nowrap;
}
.btn-confirmar {
  background: linear-gradient(135deg, #4f7cff, #335cff);
  color: white; border: none; padding: 12px 22px;
  border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer;
  box-shadow: 0 4px 10px rgba(0,0,0,0.15);
}
.btn-confirmar:hover  { transform: translateY(-1px); box-shadow: 0 6px 14px rgba(0,0,0,0.2); }
.btn-confirmar:active { transform: scale(0.97); }
.btn-remover {
  background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 8px;
  padding: 6px 8px; cursor: pointer; font-size: 15px; line-height: 1;
  opacity: 0.8; transition: all 0.2s ease;
}
.btn-remover:hover { background: #fee2e2; border-color: #fca5a5; color: #b91c1c; opacity: 1; transform: scale(1.05); }
.btn-dia { padding: 10px; border-radius: 10px; border: 2px solid var(--border); background: transparent; color: var(--text); font-weight: 800; cursor: pointer; }
.btn-dia.ativo { background: var(--accent); border-color: var(--accent); color: #000; }
.btn-multiskill {
  margin-top: 6px; align-self: flex-start; padding: 4px 10px;
  font-size: 14px; font-weight: 500; line-height: 1;
  border-radius: 14px; border: 1px solid #bbb;
  background: #f5f5f5; color: #111827; cursor: pointer; opacity: 0.7;
  transition: all 0.2s ease;
}
.btn-multiskill:hover { opacity: 1; border-color: #888; }
.btn-multiskill.ativo { background: #2e7d32; border-color: #2e7d32; color: #fff; opacity: 1; }

/* ======================================================
   BOTÃO DÚVIDAS (FLUTUANTE) — melhorado
====================================================== */
.btn-duvidas {
  position: fixed;
  top: 180px;
  right: 24px;
  z-index: 1100;
  padding: 12px 18px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
  background: linear-gradient(135deg, #7c3aed, #4f46e5);
  color: #fff;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(124, 58, 237, 0.45);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  letter-spacing: 0.3px;
}
.btn-duvidas:hover {
  transform: scale(1.06) translateY(-2px);
  box-shadow: 0 10px 28px rgba(124, 58, 237, 0.6);
}
.btn-duvidas .badge-ajuda {
  background: #fff;
  color: #7c3aed;
  font-size: 11px;
  font-weight: 800;
  padding: 2px 7px;
  border-radius: 99px;
  line-height: 1.4;
}

/* ======================================================
   MODAL DÚVIDAS — OVERLAY
====================================================== */
.modal-duvidas-overlay {
  position: fixed; inset: 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(4px);
  z-index: 2000;
  display: flex; align-items: center; justify-content: center;
  opacity: 0; pointer-events: none;
  transition: opacity 0.25s ease;
}
.modal-duvidas-overlay.aberto {
  opacity: 1;
  pointer-events: all;
}

/* ======================================================
   MODAL DÚVIDAS — CAIXA
====================================================== */
.modal-duvidas {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 20px;
  width: 540px; max-width: 95vw; max-height: 82vh;
  display: flex; flex-direction: column;
  box-shadow: 0 30px 80px rgba(0,0,0,0.4);
  transform: translateY(24px) scale(0.97);
  transition: transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: hidden;
}
.modal-duvidas-overlay.aberto .modal-duvidas { transform: translateY(0) scale(1); }
body.light .modal-duvidas { background: #ffffff; border-color: #e2e8f0; }
body.dark  .modal-duvidas { background: #0b1220; border-color: #1e293b; }

/* Header do modal */
.modal-duvidas-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 24px 14px;
  border-bottom: 1px solid var(--border);
}
.modal-duvidas-header h3 { margin: 0; font-size: 17px; font-weight: 800; }
.modal-duvidas-fechar {
  width: 34px; height: 34px; border-radius: 8px;
  border: 1px solid var(--border); background: transparent;
  color: var(--text); font-size: 18px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  padding: 0; line-height: 1;
  transition: background 0.2s, transform 0.2s;
}
.modal-duvidas-fechar:hover { background: rgba(239,68,68,0.12); color: #ef4444; transform: scale(1.1); }

/* Grade de categorias */
.modal-duvidas-categorias {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  padding: 16px 24px 12px;
  border-bottom: 1px solid var(--border);
}
.btn-categoria {
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  padding: 10px 6px; border-radius: 12px;
  border: 1.5px solid var(--border); background: transparent;
  color: var(--text); font-size: 12px; font-weight: 600; cursor: pointer;
  transition: all 0.2s ease; text-align: center; line-height: 1.3;
}
.btn-categoria .cat-icone { font-size: 20px; line-height: 1; }
.btn-categoria:hover { border-color: #7c3aed; color: #7c3aed; background: rgba(124,58,237,0.07); transform: translateY(-2px); }
.btn-categoria.ativo { border-color: #7c3aed; background: rgba(124,58,237,0.12); color: #7c3aed; box-shadow: 0 0 0 3px rgba(124,58,237,0.15); }
body.light .btn-categoria       { border-color: #e2e8f0; background: #f8fafc; color: #374151; }
body.light .btn-categoria.ativo { background: #ede9fe; color: #6d28d9; border-color: #8b5cf6; }

/* Conteúdo scrollável */
.modal-duvidas-corpo { overflow-y: auto; padding: 20px 24px; flex: 1; }
.modal-duvidas-corpo::-webkit-scrollbar { width: 5px; }
.modal-duvidas-corpo::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }

/* Placeholder */
.duvida-placeholder {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 10px; padding: 32px 0; opacity: 0.5; font-size: 13px; text-align: center;
}
.duvida-placeholder span { font-size: 36px; }

/* ======================================================
   BLOCOS DE DÚVIDA
====================================================== */
.duvida-titulo { font-size: 16px; font-weight: 800; margin: 0 0 14px 0; color: var(--text); }
.duvida-bloco {
  padding: 12px 14px; border-radius: 10px; font-size: 13px;
  line-height: 1.6; margin-bottom: 10px; border-left: 3px solid transparent;
}
.duvida-info    { background: rgba(56,189,248,0.08);  border-left-color: #38bdf8; color: var(--text); }
.duvida-campo   { background: rgba(99,102,241,0.07);  border-left-color: #818cf8; color: var(--text); }
.duvida-alerta  { background: rgba(251,191,36,0.10);  border-left-color: #fbbf24; color: var(--text); }
.duvida-alerta::before  { content: "⚠️ "; }
.duvida-exemplo { background: rgba(34,197,94,0.08);   border-left-color: #22c55e; color: var(--text); font-style: italic; }
.duvida-exemplo::before { content: "💡 "; font-style: normal; }
.duvida-lista   { background: rgba(124,58,237,0.07);  border-left-color: #7c3aed; color: var(--text); }
.duvida-lista ul { margin: 8px 0 0 0; padding-left: 18px; }
.duvida-lista li { margin-bottom: 5px; font-size: 13px; }

body.light .duvida-info    { background: #e0f2fe; }
body.light .duvida-campo   { background: #ede9fe; }
body.light .duvida-alerta  { background: #fef9c3; }
body.light .duvida-exemplo { background: #dcfce7; }
body.light .duvida-lista   { background: #f3e8ff; }

/* ======================================================
   AÇÕES CARD / RESUMO
====================================================== */
.acoes-card { display: flex; gap: 10px; margin-top: 10px; flex-wrap: wrap; }
.acoes-card input { max-width: 180px; }
.acoes-resumo { display: flex; justify-content: center; margin: 40px 0; }

/* ======================================================
   CAMPOS / LAYOUT
====================================================== */
.campo-descricao {
  display: flex; flex-direction: column; gap: 10px;
  margin-top: 10px; margin-bottom: 18px; padding-bottom: 18px;
  border-bottom: 1px dashed var(--border);
}
.campo-descricao.removendo { opacity: 0; transform: translateX(10px); transition: all 0.18s ease; }
.linha-principal { display: flex; gap: 10px; }
.campo-cliente   { gap: 18px; }
.bloco-campo     { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
.bloco-campo label { font-weight: 800; font-size: 13px; opacity: 0.75; }
.campo-descricao input[placeholder*="E-mail"] { width: 45%; }
.campo-descricao input.campo-senha            { width: 45% !important; }

/* ======================================================
   LINHA AGENTE / CHECKBOX
====================================================== */
.linha-agente { display: flex; align-items: center; gap: 10px; margin-top: 8px; }
.linha-agente input[type="checkbox"] { width: auto; transform: scale(1.1); cursor: pointer; }
.linha-agente span { font-size: 13px; opacity: 0.8; }

/* ======================================================
   REGRAS DE VALIDAÇÃO
====================================================== */
.regra-erro  { background: #ef4444; color: #fff;    padding: 8px; border-radius: 6px; }
.regra-ok    { background: #22c55e; color: #052e16; padding: 8px; border-radius: 6px; }

/* ======================================================
   PESQUISA DE SATISFAÇÃO
====================================================== */
.opcao-pesquisa { display: flex; align-items: center; gap: 14px; margin-bottom: 14px; }
.opcao-pesquisa input[type="number"] { width: 70px; text-align: center; }
.opcao-pesquisa input[type="text"], .opcao-pesquisa input:not([type]) { flex: 1; }
.opcao-pesquisa button { width: 40px; height: 40px; border-radius: 8px; }
#listaRespostasPesquisa + .btn-add { margin-top: 16px; }

/* ======================================================
   PAUSAS DO CALL CENTER
====================================================== */
.opcao-pausa { display: grid; grid-template-columns: 1fr 160px 40px; gap: 16px; align-items: center; margin-bottom: 14px; }
.opcao-pausa input  { width: 100%; height: 40px; }
.opcao-pausa select { width: 160px; height: 40px; }
.opcao-pausa button { width: 40px; height: 40px; border-radius: 8px; }
#listaPausas + .btn-add { margin-top: 18px; }

/* ======================================================
   TOAST
====================================================== */
.toast {
  position: fixed; top: 30px; left: 50%;
  transform: translateX(-50%) translateY(-20px);
  padding: 14px 20px; border-radius: 10px;
  z-index: 999999; box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  opacity: 0; pointer-events: none; transition: all 0.3s ease;
  background: #22c55e; color: #052e16;
}
.toast.error { background: #ef4444; color: #ffffff; }
.toast.show  { opacity: 1; pointer-events: auto; transform: translateX(-50%) translateY(0); }

/* ======================================================
   CHIPS
====================================================== */
.chip      { display: inline-block; background: var(--chip-bg); color: var(--chip-text); border: 1px solid rgba(99,102,241,0.3); padding: 4px 10px; border-radius: 999px; font-size: 12px; margin-right: 6px; }
.chip-user { background: #7b5cff; color: #fff; padding: 4px 10px; border-radius: 999px; font-size: 12px; }
.resumo-chip { display: inline-block; background: var(--chip-bg, #eef2f7); color: var(--chip-color, #333); border-radius: 12px; padding: 3px 8px; font-size: 12px; margin: 2px 4px 2px 0; white-space: nowrap; }
body.dark .resumo-chip { background: #2c2c2c; color: #ddd; }

/* ======================================================
   BADGE
====================================================== */
.badge { display: inline-block; background: #eaff00; color: #000; font-size: 11px; padding: 2px 8px; border-radius: 12px; margin-left: 6px; }

/* ======================================================
   CHAT GRID / CARDS
====================================================== */
.chat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 20px; margin-top: 20px; margin-bottom: 24px; }
.chat-grid div  { background: rgba(0,0,0,0.04); border-radius: 10px; padding: 12px 14px; font-size: 14px; }
.chat-grid span { display: block; font-size: 12px; opacity: 0.6; margin-bottom: 2px; }
body.dark  .chat-grid div { background: rgba(255,255,255,0.06); }
body.light .chat-grid div { background: #f9fafb !important; color: #111827 !important; }

.chat-card {
  background: var(--card-bg); backdrop-filter: blur(6px);
  border: 2px solid var(--border); border-radius: 18px; border-left: 6px solid #7b5cff;
  padding: 24px 16px; text-align: center; cursor: pointer;
  min-height: 150px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px;
  transition: all 0.25s ease; user-select: none;
}
.chat-card:hover  { border-color: #2563eb; transform: translateY(-3px); }
.chat-card.active { border-color: #38bdf8; box-shadow: 0 0 0 3px rgba(56,189,248,0.35); }
.chat-card h2 { margin-bottom: 12px; }
.chat-card h4 { margin: 0; font-weight: 800; }
body.light .chat-card { background: #ffffff !important; border: 1px solid #e5e7eb !important; color: #111827 !important; }
body.dark  .chat-card { background: #020617; border-color: #1e293b; }
body.dark  .chat-card h4 { color: #f1f5f9; }
body.dark  .chat-card.active { border-color: #38bdf8; box-shadow: 0 0 0 3px rgba(56,189,248,0.35); }
.chat-card img { height: 64px; max-width: 160px; object-fit: contain; margin: 0 auto 16px; display: block; transition: transform 0.25s ease, filter 0.25s ease; }
.chat-card:hover  img { transform: scale(1.08); filter: grayscale(0%); }
.chat-card.active img { transform: scale(1.18); }
body.dark .chat-card img        { filter: brightness(1.2) contrast(1.2); }
body.dark .chat-card.active img { filter: brightness(1.3) contrast(1.3) drop-shadow(0 0 10px rgba(56,189,248,0.4)); }

/* ======================================================
   CHAT INPUT / INFO / SEÇÕES
====================================================== */
.chat-input { width: 100%; max-width: 320px; padding: 14px; border-radius: 12px; border: 1px solid var(--field-border); font-size: 16px; font-weight: 700; }
.chat-info  { display: grid; grid-template-columns: repeat(2,1fr); gap: 12px; margin-bottom: 20px; font-size: 14px; }
.chat-info div { background: rgba(0,0,0,0.04); padding: 10px 12px; border-radius: 8px; }
body.dark  .chat-info div { background: rgba(255,255,255,0.06); }
body.light .chat-info div { background: #f9fafb !important; color: #111827 !important; }
.chat-section { margin-top: 20px; padding-top: 12px; border-top: 1px solid var(--border); }
.chat-section h3 { margin-bottom: 10px; font-size: 15px; color: #7b5cff; }
.chat-departamento { padding: 12px; border-radius: 8px; background: rgba(0,0,0,0.03); margin-bottom: 10px; }
.chat-departamento ul { margin: 6px 0 0 16px; padding-left: 2px; }
body.dark  .chat-departamento { background: rgba(255,255,255,0.05); }
body.light .chat-departamento { background: #f9fafb !important; color: #111827 !important; }
.chat-agente { padding: 12px; border-radius: 8px; background: rgba(0,0,0,0.03); margin-bottom: 10px; }
.chat-agente-sub { font-size: 13px; color: #555; opacity: 0.8; margin-top: 4px; }
body.dark  .chat-agente { background: rgba(255,255,255,0.05); }
body.light .chat-agente { background: #f9fafb !important; color: #111827 !important; }
body.light .chat-agente-sub { color: #4b5563 !important; }
.chat-box { background: rgba(0,0,0,0.03); border-radius: 12px; padding: 14px 16px; margin-bottom: 12px; }
body.dark  .chat-box { background: rgba(255,255,255,0.05); }
body.light .chat-box { background: #f9fafb !important; color: #111827 !important; }
.chat-box-title { font-size: 14px; margin-bottom: 8px; }
.chat-users { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 6px; }

/* ======================================================
   LINHAS / LAYOUT
====================================================== */
.linha { display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 6px; }
.linha span { opacity: 0.6; }
.sub { margin-left: 16px; margin-top: 6px; font-size: 14px; color: #444; }

/* ======================================================
   RESUMO
====================================================== */
.resumo-container { display: flex; flex-direction: column; gap: 18px; }
.resumo-bloco { margin-bottom: 36px; }
.resumo-bloco h2 { font-size: 18px; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 1px solid #e5e7eb; }
.resumo-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px,1fr)); gap: 16px; }
.resumo-section { margin-bottom: 32px; }
.resumo-section h2 { font-size: 18px; margin-bottom: 12px; border-bottom: 1px solid #e5e5e5; padding-bottom: 6px; }
.resumo-list { display: flex; flex-direction: column; gap: 8px; }
.resumo-item { padding: 10px 14px; border-radius: 8px; background: #fafafa; border: 1px solid #eee; }
.resumo-item strong { display: block; font-size: 14px; margin-bottom: 4px; }
.resumo-sub { font-size: 13px; color: #555; margin-left: 12px; }
body.light .resumo-sub { color: #4b5563 !important; }
.resumo-card { background: var(--card-bg, #fff); border-radius: 14px; padding: 14px 16px; border: 1px solid var(--border, #e5e7eb); box-shadow: 0 4px 12px rgba(0,0,0,0.06); font-size: 14px; line-height: 1.55; }
.resumo-card .titulo  { font-weight: 600; margin-bottom: 8px; }
.resumo-card h4  { margin: 0 0 10px 0; font-size: 15px; font-weight: 600; }
.resumo-card p   { margin: 0 0 6px 0; }
.resumo-card strong { display: block; margin-top: 10px; margin-bottom: 4px; font-weight: 600; }
.resumo-card ul  { margin: 6px 0 10px 0; padding-left: 18px; }
.resumo-card li  { margin-bottom: 4px; }
.resumo-card .linha { font-size: 13px; color: #444; margin-bottom: 4px; }
body.dark .resumo-card { background: #1e1e1e; box-shadow: 0 2px 6px rgba(0,0,0,0.4); }
.info-linha { font-size: 13px; color: #555; margin-bottom: 6px; }
.info-linha span { font-weight: 500; color: #222; }
body.light .info-linha { color: #4b5563 !important; }
.resumo-secao { margin-top: 8px; }
.resumo-texto { margin-left: 6px; }
.lista { margin-top: 8px; display: flex; flex-wrap: wrap; gap: 6px; }

/* ======================================================
   LOGO WRAPPER (META / DARK)
====================================================== */
.logo-wrapper.meta { background: rgba(255,255,255,0.08); padding: 12px; border-radius: 12px; }
body.dark .logo-wrapper.meta { background: rgba(255,255,255,0.18); }
body.dark .logo-wrapper.meta img { filter: brightness(3) contrast(2) saturate(1.2) !important; }
body.dark img[src*="qr"], body.dark img[alt*="QR"] { background: #ffffff; padding: 8px; border-radius: 8px; }
body.dark img[src*="meta"], body.dark img[alt*="Meta"] { background: rgba(255,255,255,0.08); padding: 10px; border-radius: 10px; }

/* ======================================================
   INTRO SCREEN
====================================================== */
#intro-screen {
  position: fixed !important; inset: 0; height: 100vh; overflow: hidden;
  display: flex; align-items: center; justify-content: center; z-index: 10;
  background: linear-gradient(270deg, #020617, #0f172a, #020617) !important;
  background-size: 600% 600% !important;
  animation: gradientMove 15s ease infinite !important;
  color: #fff !important;
}
body.light #intro-screen { background: linear-gradient(270deg, #e2e8f0, #cbd5f5, #e2e8f0) !important; }
.background::before {
  content: ""; position: absolute; width: 200%; height: 200%;
  background: radial-gradient(circle, rgba(0,255,150,0.08) 1px, transparent 1px);
  background-size: 40px 40px;
  animation: moveParticles 30s linear infinite;
  pointer-events: none; z-index: 0;
}
.orb { position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; z-index: 0; }
.orb1 { background: #00ffa3; opacity: 0.25; }
.orb2 { background: #00cfff; opacity: 0.25; }

.nova-intro {
  position: relative; z-index: 2; width: 500px; padding: 40px; border-radius: 20px;
  background: rgba(255,255,255,0.06) !important; backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.1); text-align: center;
  animation: aparecer 0.6s ease; color: #fff !important;
}
.logo-intro     { height: 45px; margin-bottom: 15px; }
.titulo-intro   { font-size: 22px; margin-bottom: 10px; }
.subtitulo-intro { font-size: 14px; opacity: 0.8; margin-bottom: 25px; }
.intro-actions  { display: flex; flex-direction: column; gap: 14px; }
.intro-actions button { padding: 14px; border-radius: 12px; font-size: 16px; font-weight: 800; cursor: pointer; border: 2px solid var(--border); background: transparent; }
body.dark #intro-screen .intro-actions button       { color: #e5e7eb; }
body.dark #intro-screen .intro-actions button:hover { color: #ffffff; }
.botao-intro {
  width: 100%; padding: 14px; margin-bottom: 10px; border-radius: 10px;
  border: none; background: rgba(255,255,255,0.08); color: inherit; cursor: pointer; transition: all 0.25s ease;
}
body.light .botao-intro { background: rgba(0,0,0,0.05); }
.botao-intro:hover { transform: translateY(-2px) scale(1.02); background: rgba(0,255,150,0.15); box-shadow: 0 0 15px rgba(0,255,150,0.3); }
#intro-screen .botao-intro.destaque, .botao-intro.destaque {
  background: linear-gradient(90deg, #00ffa3, #00cfff) !important;
  color: #000 !important; font-weight: 800; border: none !important;
  box-shadow: 0 0 20px rgba(0,255,200,0.25);
}
#intro-screen .botao-intro.destaque:hover, .botao-intro.destaque:hover {
  transform: translateY(-2px) scale(1.02); box-shadow: 0 0 25px rgba(0,255,200,0.6);
}
#intro-screen .botao-intro.destaque:active, .botao-intro.destaque:active { transform: scale(0.97); }
.intro-box { background: var(--card-bg); padding: 48px; border-radius: 18px; max-width: 600px; width: 90%; box-shadow: 0 20px 60px rgba(0,0,0,0.4); text-align: center; }
.intro-box h1 { font-size: 22px; min-height: 120px; margin-bottom: 32px; }
.cursor { animation: piscar 1s infinite; }

/* INTRO LIGHT */
body.light #intro-screen { background: radial-gradient(circle at center, #f1f5f9 0%, #e2e8f0 100%) !important; }
body.light .nova-intro    { background: #ffffff !important; color: #0f172a !important; border-radius: 20px; padding: 40px; box-shadow: 0 30px 80px rgba(0,0,0,0.12); border: 1px solid #e2e8f0; }
body.light .titulo-intro  { color: #0f172a !important; }
body.light .subtitulo-intro { color: #475569 !important; }
body.light .botao-intro   { background: #f8fafc !important; color: #0f172a !important; border: 1px solid #e2e8f0 !important; }
body.light .botao-intro:hover { background: #e2e8f0 !important; transform: translateY(-2px) scale(1.02); }
body.light .botao-intro.destaque { background: linear-gradient(135deg, #10b981, #06b6d4) !important; color: #ffffff !important; border: none !important; box-shadow: 0 15px 40px rgba(6,182,212,0.3); }
body.light .botao-intro.destaque:hover { transform: translateY(-2px) scale(1.03); box-shadow: 0 20px 50px rgba(6,182,212,0.45); }
/* ======================================================
   MELHORIAS GERAIS – VALIDAÇÃO VISUAL
====================================================== */
.campo-obrigatorio-erro {
  border: 2px solid #ef4444 !important;
  background: rgba(239,68,68,0.08) !important;
  animation: shake 0.3s ease;
}
@keyframes shake {
  0%,100% { transform: translateX(0); }
  25%      { transform: translateX(-4px); }
  75%      { transform: translateX(4px); }
}
.campo-valido {
  border-color: #00ffa3 !important;
  box-shadow: 0 0 0 2px rgba(0,255,163,0.15) !important;
}

/* Indicador de força de senha */
.senha-strength-bar {
  height: 4px;
  border-radius: 99px;
  margin-top: 6px;
  transition: width 0.3s ease, background 0.3s ease;
  background: #334155;
}
.senha-strength-bar[data-forca="fraca"]  { background: #ef4444; width: 30%; }
.senha-strength-bar[data-forca="media"]  { background: #f59e0b; width: 65%; }
.senha-strength-bar[data-forca="forte"]  { background: #00ffa3; width: 100%; }

.regra-erro {
  background: rgba(239,68,68,0.15);
  color: #fca5a5;
  padding: 6px 10px;
  border-radius: 8px;
  border-left: 3px solid #ef4444;
  font-size: 12px;
  font-weight: 600;
}
.regra-ok {
  background: rgba(0,255,163,0.1);
  color: #00ffa3;
  padding: 6px 10px;
  border-radius: 8px;
  border-left: 3px solid #00ffa3;
  font-size: 12px;
  font-weight: 600;
}
.regra-neutra {
  color: var(--text-soft);
  font-size: 12px;
  padding: 4px 0;
}
body.light .regra-erro  { background: #fee2e2; color: #b91c1c; }
body.light .regra-ok    { background: #dcfce7; color: #166534; }
body.light .regra-neutra{ color: #64748b; }

/* Contador de caracteres */
.char-counter {
  font-size: 11px;
  color: var(--text-soft);
  text-align: right;
  margin-top: 2px;
}
.char-counter.limite { color: #ef4444; font-weight: 700; }

/* Label obrigatório */
label .obrigatorio {
  color: #ef4444;
  margin-left: 2px;
  font-size: 11px;
}

/* ======================================================
   INPUTS – CORRIGIR LARGURAS FIXAS PARA MOBILE
====================================================== */
input.campo-senha          { width: 100% !important; max-width: 280px !important; }
select.campo-permissao     { width: 100% !important; max-width: 280px !important; }
#empresaCliente,
#dominioCliente,
#cnpjCliente               { width: 100%; max-width: 520px; }

/* ======================================================
   TOUCH-FRIENDLY – Targets mínimos de 44px
====================================================== */
button,
input[type="checkbox"],
select {
  min-height: 44px;
}
input:not([type="checkbox"]),
textarea {
  min-height: 44px;
}
.btn-remover,
.opcao-pesquisa button,
.opcao-pausa button {
  min-width: 44px;
  min-height: 44px;
}

/* ======================================================
   HEADER – RESPONSIVO
====================================================== */
@media (max-width: 640px) {
  .app-header {
    grid-template-columns: auto 1fr auto auto;
    padding: 10px 14px;
    gap: 8px;
  }
  .app-logo    { height: 38px; }
  .app-title   { font-size: 15px; }
  .btn-voltar-intro {
    font-size: 12px;
    padding: 8px 10px;
    white-space: nowrap;
  }
  .theme-toggle {
    width: 38px; height: 38px;
    font-size: 16px;
  }

  /* Header resumo */
  .resumo-header {
    flex-wrap: wrap;
    padding: 10px 14px;
    gap: 8px;
  }
  .header-center {
    position: static;
    transform: none;
    order: 3;
    width: 100%;
    text-align: center;
  }
  .resumo-header .app-logo { height: 32px; }
  .resumo-header .app-title { font-size: 15px; }
}

/* ======================================================
   CONTAINER PRINCIPAL – RESPONSIVO
====================================================== */
@media (max-width: 640px) {
  .form-container, .main-container {
    padding: 0 12px;
    margin: 16px auto;
    gap: 16px;
  }
  .card {
    padding: 16px;
    border-radius: 12px;
    margin-bottom: 16px;
  }
  .card h2 {
    font-size: 16px;
    margin-bottom: 12px;
  }
  .card h3 { font-size: 14px; }
}

/* ======================================================
   CAMPOS / LINHA-PRINCIPAL – RESPONSIVO
====================================================== */
@media (max-width: 640px) {
  .linha-principal {
    flex-direction: column;
    gap: 8px;
  }
  .campo-descricao {
    gap: 8px;
    padding-bottom: 14px;
    margin-bottom: 14px;
  }
  /* Inputs de senha e email voltam a 100% */
  input.campo-senha,
  input[type="email"] {
    width: 100% !important;
    max-width: 100% !important;
  }
  select.campo-permissao {
    width: 100% !important;
    max-width: 100% !important;
  }
  /* Input de domínio e empresa */
  #empresaCliente,
  #dominioCliente,
  #cnpjCliente {
    width: 100%;
    max-width: 100%;
  }
  .campo-descricao input[placeholder*="E-mail"],
  .campo-descricao input.campo-senha {
    width: 100% !important;
  }
}

/* ======================================================
   AÇÕES CARD – RESPONSIVO
====================================================== */
@media (max-width: 640px) {
  .acoes-card {
    flex-direction: column;
    gap: 8px;
  }
  .acoes-card input {
    max-width: 100%;
  }
  .acoes-card .btn-add,
  .acoes-card .btn-import {
    width: 100%;
    justify-content: center;
  }
}

/* ======================================================
   RAMAIS – INPUTS DE RANGE
====================================================== */
@media (max-width: 640px) {
  #ramalInicio,
  #ramalFim {
    width: 100% !important;
    max-width: 100%;
  }
}

/* ======================================================
   DIAS DA SEMANA – RESPONSIVO
====================================================== */
@media (max-width: 480px) {
  .btn-dia {
    padding: 8px 6px;
    font-size: 11px;
    flex: 1 1 calc(25% - 6px);
    text-align: center;
  }
}

/* ======================================================
   OPCOES URA – RESPONSIVO
====================================================== */
@media (max-width: 640px) {
  .opcao-ura {
    display: flex !important;
    flex-direction: column !important;
    gap: 8px;
  }
  .opcao-ura input,
  .opcao-ura select {
    width: 100% !important;
  }
  .opcao-ura button {
    align-self: flex-end;
    width: 44px;
  }
}

/* ======================================================
   PESQUISA – RESPONSIVO
====================================================== */
@media (max-width: 640px) {
  .opcao-pesquisa {
    flex-wrap: wrap;
    gap: 8px;
  }
  .opcao-pesquisa input[type="number"] {
    width: 70px !important;
    flex-shrink: 0;
  }
  .opcao-pesquisa input[type="text"],
  .opcao-pesquisa input:not([type]) {
    flex: 1 1 100%;
    min-width: 0;
  }
  .opcao-pesquisa button {
    margin-left: auto;
  }
}

/* ======================================================
   PAUSAS – RESPONSIVO
====================================================== */
@media (max-width: 640px) {
  .opcao-pausa {
    grid-template-columns: 1fr 44px;
    grid-template-rows: auto auto;
    gap: 8px;
  }
  .opcao-pausa input  {
    grid-column: 1 / -1;
  }
  .opcao-pausa select { width: 100%; }
  .opcao-pausa button {
    grid-column: 2;
    grid-row: 2;
  }
}

/* ======================================================
   CHAT CARDS – RESPONSIVO
====================================================== */
.chat-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
@media (max-width: 480px) {
  .chat-grid {
    gap: 8px;
  }
  .chat-card {
    flex: 1 1 calc(50% - 8px);
    min-width: 130px;
    padding: 12px 8px !important;
  }
  .chat-card h4 { font-size: 12px; }
  .chat-card img { max-height: 28px; }
}

/* ======================================================
   MODAL DÚVIDAS – RESPONSIVO
====================================================== */
@media (max-width: 640px) {
  .modal-duvidas {
    width: 100%;
    max-width: 100%;
    max-height: 90vh;
    border-radius: 20px 20px 0 0;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0;
  }
  .modal-duvidas-overlay {
    align-items: flex-end;
  }
  .modal-duvidas-overlay.aberto .modal-duvidas {
    transform: translateY(0) scale(1);
  }
  .modal-duvidas-overlay .modal-duvidas {
    transform: translateY(100%);
  }
  .modal-duvidas-categorias {
    grid-template-columns: repeat(4, 1fr);
    gap: 6px;
    padding: 12px 14px;
  }
  .btn-categoria { font-size: 11px; padding: 8px 4px; }
  .btn-categoria .cat-icone { font-size: 18px; }
  .modal-duvidas-corpo { padding: 14px; }
}

/* ======================================================
   BOTÃO DÚVIDAS – RESPONSIVO
====================================================== */
@media (max-width: 640px) {
  .btn-duvidas {
    top: auto;
    bottom: 20px;
    right: 16px;
    padding: 10px 14px;
    font-size: 13px;
  }
  .btn-duvidas span { display: none; }
}

/* ======================================================
   TOAST – RESPONSIVO
====================================================== */
@media (max-width: 640px) {
  .toast {
    width: calc(100% - 32px);
    left: 16px;
    right: 16px;
    transform: translateX(0) translateY(-20px);
    text-align: center;
  }
  .toast.show {
    transform: translateX(0) translateY(0);
  }
}

/* ======================================================
   BOTÃO SALVAR / EXPLORAR – RESPONSIVO
====================================================== */
@media (max-width: 640px) {
  .btn-explorar {
    width: 100%;
    padding: 16px 20px;
    margin: 24px 0;
    font-size: 16px;
  }
}

/* ======================================================
   INTRO SCREEN – RESPONSIVO
====================================================== */
@media (max-width: 480px) {
  .intro-box.nova-intro {
    padding: 28px 20px;
    width: 94%;
  }
  .logo-intro    { height: 36px; }
  .titulo-intro  { font-size: 18px; }
  .subtitulo-intro { font-size: 13px; }
  .botao-intro   { padding: 14px 12px; font-size: 15px; }
}

/* ======================================================
   SCROLLBAR MOBILE (oculta mas funcional)
====================================================== */
@media (max-width: 640px) {
  ::-webkit-scrollbar { width: 0; }
}

/* ======================================================
   AJUSTE GERAL PARA TELAS MÉDIAS (TABLET)
====================================================== */
@media (min-width: 641px) and (max-width: 900px) {
  .form-container { padding: 0 20px; }
  .card           { padding: 20px; }
  input.campo-senha,
  select.campo-permissao { max-width: 220px !important; }
}

/* ======================================================
   FILA – LISTA DE AGENTES ADICIONADOS
====================================================== */
#listaFilas .campo-descricao > div:last-of-type > div,
#listaGrupoRing .campo-descricao > div:last-of-type > div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px;
  background: rgba(0,255,163,0.06);
  border-radius: 8px;
  margin-bottom: 6px;
  border: 1px solid rgba(0,255,163,0.15);
  font-size: 13px;
}
#listaFilas .campo-descricao > div:last-of-type > div button,
#listaGrupoRing .campo-descricao > div:last-of-type > div button {
  min-height: 28px;
  padding: 2px 8px;
  font-size: 12px;
}
