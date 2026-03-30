"""
Gerador de PDF – Caderno de Parametros
Design profissional com ReportLab
"""
import json
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, KeepTogether, PageBreak
)
from reportlab.platypus.flowables import Flowable
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.pdfgen import canvas as pdf_canvas
import datetime

# ─────────────────────────────────────────────
#  PALETA DE CORES
# ─────────────────────────────────────────────
C_PRIMARY    = colors.HexColor("#1e3a5f")
C_ACCENT     = colors.HexColor("#0ea5e9")
C_ACCENT2    = colors.HexColor("#6366f1")
C_SUCCESS    = colors.HexColor("#10b981")
C_WARN       = colors.HexColor("#f59e0b")
C_BG_LIGHT   = colors.HexColor("#f0f7ff")
C_BG_GRAY    = colors.HexColor("#f8fafc")
C_BORDER     = colors.HexColor("#cbd5e1")
C_TEXT       = colors.HexColor("#1e293b")
C_TEXT_SOFT  = colors.HexColor("#64748b")
C_WHITE      = colors.white
C_CHIP_BG    = colors.HexColor("#e0e7ff")
C_CHIP_TEXT  = colors.HexColor("#3730a3")
C_LIME       = colors.HexColor("#CEFF00")
C_DARK_SLATE = colors.HexColor("#2B363D")

PAGE_W, PAGE_H = A4
MARGIN = 18 * mm

# ─────────────────────────────────────────────
#  NUMERACAO DE PAGINAS + HEADER/FOOTER
# ─────────────────────────────────────────────
class NumberedCanvas(pdf_canvas.Canvas):
    def __init__(self, *args, **kwargs):
        self._empresa = kwargs.pop("empresa", "")
        pdf_canvas.Canvas.__init__(self, *args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_number(num_pages)
            pdf_canvas.Canvas.showPage(self)
        pdf_canvas.Canvas.save(self)

    def draw_page_number(self, page_count):
        page_num = self._pageNumber
        w, h = A4
        # Footer
        self.setFillColor(C_PRIMARY)
        self.rect(0, 0, w, 10 * mm, fill=1, stroke=0)
        self.setFillColor(C_LIME)
        self.rect(0, 10 * mm - 1, w, 1, fill=1, stroke=0)
        self.setFillColor(C_WHITE)
        self.setFont("Helvetica", 8)
        self.drawString(MARGIN, 3.5 * mm, f"Caderno de Parametros  -  {self._empresa}")
        self.setFillColor(C_LIME)
        self.setFont("Helvetica-Bold", 8)
        txt = f"{datetime.date.today().strftime('%d/%m/%Y')}   |   Pag. {page_num} de {page_count}"
        self.drawRightString(w - MARGIN, 3.5 * mm, txt)
        # Header (exceto capa)
        if page_num > 1:
            self.setFillColor(C_PRIMARY)
            self.rect(0, h - 12 * mm, w, 12 * mm, fill=1, stroke=0)
            self.setFillColor(C_WHITE)
            self.setFont("Helvetica-Bold", 9)
            self.drawString(MARGIN, h - 7 * mm, "CADERNO DE PARAMETROS")
            self.setFillColor(C_LIME)
            self.setFont("Helvetica", 7)
            self.drawString(MARGIN, h - 11 * mm, "SobreIP - Configuracao do Cliente")
            self.setFillColor(C_WHITE)
            self.setFont("Helvetica", 7)
            self.drawRightString(w - MARGIN, h - 7 * mm, datetime.date.today().strftime("%d/%m/%Y"))


# ─────────────────────────────────────────────
#  FLOWABLES CUSTOMIZADOS
# ─────────────────────────────────────────────
class ColorBar(Flowable):
    """Barra colorida de secao."""
    def __init__(self, titulo, cor=None, w=None):
        Flowable.__init__(self)
        self.titulo = titulo
        self.cor    = cor or C_PRIMARY
        self.w      = w or (PAGE_W - 2 * MARGIN)
        self.height = 12 * mm

    def wrap(self, *args):
        return (self.w, self.height)

    def draw(self):
        c = self.canv
        c.setFillColor(self.cor)
        c.rect(0, 0, self.w, self.height, fill=1, stroke=0)
        # Faixa lime lateral
        c.setFillColor(C_LIME)
        c.rect(0, 0, 4, self.height, fill=1, stroke=0)
        c.setFillColor(C_WHITE)
        c.setFont("Helvetica-Bold", 11)
        c.drawString(12, 4, self.titulo)


class ChipRow(Flowable):
    """Linha de chips coloridos."""
    def __init__(self, items, w=None):
        Flowable.__init__(self)
        self.items   = items
        self.w       = w or (PAGE_W - 2 * MARGIN)
        self._lines  = []
        self._height = 0

    def _layout(self):
        x = 0
        pad_x, pad_y = 6, 3
        chip_h = 16
        gap_x, gap_y = 6, 5
        lines = [[]]
        for item in self.items:
            tw = len(item) * 5.5 + pad_x * 2
            if x + tw > self.w and lines[-1]:
                x = 0
                lines.append([])
            lines[-1].append((item, x, tw))
            x += tw + gap_x
        self._lines  = lines
        self._chip_h = chip_h
        self._gap_y  = gap_y
        self._pad_x  = pad_x
        self._pad_y  = pad_y
        self._height = len(lines) * (chip_h + gap_y) + 2

    def wrap(self, *args):
        self._layout()
        return (self.w, self._height)

    def draw(self):
        self._layout()
        c = self.canv
        y_start = self._height - self._chip_h
        for line in self._lines:
            for (text, x, tw) in line:
                c.setFillColor(C_CHIP_BG)
                c.roundRect(x, y_start, tw, self._chip_h, 4, fill=1, stroke=0)
                c.setFillColor(C_CHIP_TEXT)
                c.setFont("Helvetica-Bold", 7.5)
                c.drawString(x + self._pad_x, y_start + self._pad_y + 1, text)
            y_start -= (self._chip_h + self._gap_y)


class DepartamentoBlock(Flowable):
    """Bloco visual de departamento com grid de agentes."""
    def __init__(self, dep, w=None):
        Flowable.__init__(self)
        self.dep    = dep
        self.w      = w or (PAGE_W - 2 * MARGIN)
        self._h     = 0
        self._cols  = 3
        self._cell_h = 8 * mm

    def _calc_height(self):
        agentes = self.dep.get("agentes", [])
        import math
        rows = math.ceil(len(agentes) / self._cols) if agentes else 1
        return 10 * mm + rows * self._cell_h + 3 * mm

    def wrap(self, *args):
        self._h = self._calc_height()
        return (self.w, self._h)

    def draw(self):
        c       = self.canv
        dep     = self.dep
        agentes = dep.get("agentes", [])
        nome    = dep.get("nome", "—")
        w       = self.w
        h       = self._h

        # Cabecalho do departamento
        c.setFillColor(C_PRIMARY)
        c.rect(0, h - 9 * mm, w, 9 * mm, fill=1, stroke=0)
        c.setFillColor(C_LIME)
        c.rect(0, h - 9 * mm, 4, 9 * mm, fill=1, stroke=0)
        c.setFillColor(C_WHITE)
        c.setFont("Helvetica-Bold", 10)
        c.drawString(10, h - 5.5 * mm, nome)
        # Contador de agentes
        count_txt = "Sem agentes" if not agentes else (
            "1 agente" if len(agentes) == 1 else f"{len(agentes)} agentes"
        )
        c.setFillColor(C_LIME)
        c.setFont("Helvetica", 8)
        c.drawRightString(w, h - 5.5 * mm, count_txt)

        # Grid de agentes
        col_w = w / self._cols
        y_pos = h - 9 * mm
        import math
        for i, ag in enumerate(agentes):
            col = i % self._cols
            row = i // self._cols
            x   = col * col_w
            y   = y_pos - (row + 1) * self._cell_h
            bg  = C_BG_LIGHT if (row + col) % 2 == 0 else C_BG_GRAY
            c.setFillColor(bg)
            c.rect(x, y, col_w, self._cell_h, fill=1, stroke=0)
            c.setStrokeColor(C_BORDER)
            c.setLineWidth(0.25)
            c.rect(x, y, col_w, self._cell_h, fill=0, stroke=1)
            c.setFillColor(C_TEXT)
            c.setFont("Helvetica", 8)
            c.drawCentredString(x + col_w / 2, y + 2.5 * mm, ag)

        if not agentes:
            y = y_pos - self._cell_h
            c.setFillColor(C_BG_GRAY)
            c.rect(0, y, w, self._cell_h, fill=1, stroke=0)
            c.setStrokeColor(C_BORDER)
            c.rect(0, y, w, self._cell_h, fill=0, stroke=1)
            c.setFillColor(C_TEXT_SOFT)
            c.setFont("Helvetica", 8)
            c.drawCentredString(w / 2, y + 2.5 * mm, "Nenhum agente vinculado")


# ─────────────────────────────────────────────
#  ESTILOS
# ─────────────────────────────────────────────
def estilos():
    base = dict(fontName="Helvetica", fontSize=10, leading=14,
                textColor=C_TEXT, leftIndent=0, rightIndent=0)
    return {
        "normal":  ParagraphStyle("normal",  **base),
        "small":   ParagraphStyle("small",   **{**base, "fontSize": 8, "leading": 11, "textColor": C_TEXT_SOFT}),
        "bold":    ParagraphStyle("bold",    **{**base, "fontName": "Helvetica-Bold"}),
        "label":   ParagraphStyle("label",   **{**base, "fontSize": 8, "textColor": C_TEXT_SOFT, "fontName": "Helvetica-Bold", "spaceAfter": 2}),
        "value":   ParagraphStyle("value",   **{**base, "fontSize": 10, "fontName": "Helvetica-Bold", "textColor": C_PRIMARY}),
        "center":  ParagraphStyle("center",  **{**base, "alignment": TA_CENTER}),
        "caption": ParagraphStyle("caption", **{**base, "fontSize": 8, "textColor": C_TEXT_SOFT, "alignment": TA_CENTER}),
        "mono":    ParagraphStyle("mono",    **{**base, "fontName": "Courier", "fontSize": 9}),
        "h1capa":  ParagraphStyle("h1capa",  fontName="Helvetica-Bold", fontSize=26, leading=32,
                                  textColor=C_WHITE, alignment=TA_CENTER),
        "subcapa": ParagraphStyle("subcapa", fontName="Helvetica", fontSize=12, leading=16,
                                  textColor=colors.HexColor("#b0d4f1"), alignment=TA_CENTER),
        "empresa_capa": ParagraphStyle("empresa_capa", fontName="Helvetica-Bold", fontSize=16, leading=20,
                                       textColor=C_WHITE, alignment=TA_CENTER),
        "modulo":  ParagraphStyle("modulo",  fontName="Helvetica-Bold", fontSize=13, leading=18,
                                  textColor=C_PRIMARY, spaceAfter=6),
        "secao_sub": ParagraphStyle("secao_sub", fontName="Helvetica-Bold", fontSize=11, leading=16,
                                    textColor=C_PRIMARY, spaceAfter=4, spaceBefore=6),
    }

S = estilos()

# ─────────────────────────────────────────────
#  TABELA PADRAO
# ─────────────────────────────────────────────
def make_table(head, rows, col_widths=None):
    usable = PAGE_W - 2 * MARGIN
    if not col_widths:
        n = len(head)
        col_widths = [usable / n] * n

    header_cells = [Paragraph(f"<b>{h}</b>", ParagraphStyle(
        "th", fontName="Helvetica-Bold", fontSize=9, leading=12,
        textColor=C_WHITE, alignment=TA_CENTER)) for h in head]

    body_cells = []
    for row in rows:
        body_cells.append([
            Paragraph(str(c) if c else "—", ParagraphStyle(
                "td", fontName="Helvetica", fontSize=9, leading=12,
                textColor=C_TEXT, alignment=TA_CENTER))
            for c in row
        ])

    data  = [header_cells] + body_cells
    style = TableStyle([
        ("BACKGROUND",     (0, 0), (-1, 0),  C_PRIMARY),
        ("TOPPADDING",     (0, 0), (-1, 0),  8),
        ("BOTTOMPADDING",  (0, 0), (-1, 0),  8),
        ("LEFTPADDING",    (0, 0), (-1, -1), 8),
        ("RIGHTPADDING",   (0, 0), (-1, -1), 8),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [C_WHITE, C_BG_GRAY]),
        ("GRID",           (0, 0), (-1, -1), 0.4, C_BORDER),
        ("LINEBELOW",      (0, 0), (-1, 0),  1.5, C_ACCENT),
        ("BOX",            (0, 0), (-1, -1), 0.8, C_BORDER),
        ("TOPPADDING",     (0, 1), (-1, -1), 6),
        ("BOTTOMPADDING",  (0, 1), (-1, -1), 6),
    ])
    return Table(data, colWidths=col_widths, style=style, repeatRows=1)


# ─────────────────────────────────────────────
#  CAPA
# ─────────────────────────────────────────────
def capa_page(dados):
    class CapaFlowable(Flowable):
        def __init__(self, dados):
            Flowable.__init__(self)
            self.dados  = dados
            self.width  = PAGE_W - 2 * MARGIN
            self.height = PAGE_H - 2 * MARGIN

        def wrap(self, avW, avH):
            return (self.width, min(self.height, avH))

        def draw(self):
            c   = self.canv
            d   = self.dados
            w   = self.width
            h   = self.height
            cli = d.get("cliente", {})

            # Fundo degradê navy
            steps = 60
            for i in range(steps):
                ratio = i / steps
                r = int(0x05 + ratio * (0x08 - 0x05))
                g = int(0x0b + ratio * (0x1c - 0x0b))
                b = int(0x18 + ratio * (0x37 - 0x18))
                c.setFillColor(colors.Color(r/255, g/255, b/255))
                c.rect(-MARGIN, h * ratio - MARGIN, PAGE_W, PAGE_H / steps + 1, fill=1, stroke=0)

            # Circulos decorativos
            c.setFillColor(colors.Color(0.05, 0.64, 0.91, 0.10))
            c.circle(w * 0.85, h * 0.72, 80, fill=1, stroke=0)
            c.circle(w * 0.10, h * 0.22, 50, fill=1, stroke=0)
            c.circle(w * 0.95, h * 0.15, 30, fill=1, stroke=0)

            # Faixa lime topo
            c.setFillColor(C_LIME)
            c.rect(-MARGIN, h - 2 * mm, PAGE_W, 3, fill=1, stroke=0)

            # Circulo ERA
            cx, cy = w / 2, h * 0.72
            c.setFillColor(colors.Color(0.81, 1.0, 0, 0.08))
            c.circle(cx, cy, 56, fill=1, stroke=0)
            c.setFillColor(colors.Color(0.04, 0.08, 0.16))
            c.circle(cx, cy, 40, fill=1, stroke=0)
            c.setStrokeColor(C_LIME)
            c.setLineWidth(2)
            c.circle(cx, cy, 40, fill=0, stroke=1)
            c.setLineWidth(0.6)
            c.circle(cx, cy, 31, fill=0, stroke=1)
            c.setFillColor(C_LIME)
            c.setFont("Helvetica-Bold", 14)
            c.drawCentredString(cx, cy - 5, "ERA")

            # Titulo
            c.setFillColor(C_WHITE)
            c.setFont("Helvetica-Bold", 26)
            c.drawCentredString(w / 2, h * 0.575, "Caderno de Parametros")
            c.setFillColor(colors.Color(0.69, 0.83, 0.95))
            c.setFont("Helvetica", 12)
            c.drawCentredString(w / 2, h * 0.540, "Resumo da Configuracao do Cliente")

            # Divisor lime
            c.setStrokeColor(C_LIME)
            c.setLineWidth(2)
            c.line(w * 0.3, h * 0.510, w * 0.7, h * 0.510)

            # Empresa
            empresa = cli.get("empresa", "")
            c.setFillColor(C_WHITE)
            c.setFont("Helvetica-Bold", 18)
            c.drawCentredString(w / 2, h * 0.465, empresa)

            # Infos
            c.setFont("Helvetica", 10)
            c.setFillColor(colors.Color(0.69, 0.83, 0.95))
            info_y = h * 0.415
            for label, val in [
                ("Dominio", cli.get("dominio", "—")),
                ("CNPJ",    cli.get("cnpj", "—")),
                ("Data",    datetime.date.today().strftime("%d/%m/%Y")),
            ]:
                c.drawCentredString(w / 2, info_y, f"{label}:  {val}")
                info_y -= 16

            # Stats cards
            voz  = d.get("voz",  {})
            chat = d.get("chat", {})
            tem_voz  = bool(voz.get("usuarios") or voz.get("ramais") or voz.get("agentes"))
            tem_chat = bool(chat.get("usuarios") or chat.get("agentes") or chat.get("departamentos"))

            if tem_voz and tem_chat:
                stats = [
                    ("Usu. Voz",  str(len(voz.get("usuarios",   [])))),
                    ("Ramais",    str(len(voz.get("ramais",      [])))),
                    ("Filas",     str(len(voz.get("filas",       [])))),
                    ("Usu. Chat", str(len(chat.get("usuarios",   [])))),
                    ("Ag. Chat",  str(len(chat.get("agentes",    [])))),
                    ("Depto.",    str(len(chat.get("departamentos", [])))),
                ]
            elif tem_chat and not tem_voz:
                stats = [
                    ("Usuarios",  str(len(chat.get("usuarios",      [])))),
                    ("Agentes",   str(len(chat.get("agentes",        [])))),
                    ("Depto.",    str(len(chat.get("departamentos",  [])))),
                    ("Canais",    str(len(chat.get("canais",         [])))),
                    ("API",      "Sim" if chat.get("tipo") in ("api","ambos") else "Nao"),
                    ("QR Code",  "Sim" if chat.get("tipo") in ("qr", "ambos") else "Nao"),
                ]
            else:
                stats = [
                    ("Usuarios",  str(len(voz.get("usuarios",  [])))),
                    ("Ramais",    str(len(voz.get("ramais",    [])))),
                    ("Filas",     str(len(voz.get("filas",     [])))),
                    ("URAs",      str(len(voz.get("uras",      [])))),
                    ("PABX",     "Sim" if tem_voz  else "Nao"),
                    ("Chat",     "Sim" if tem_chat else "Nao"),
                ]

            N      = len(stats)
            sw     = w / N
            stat_y = h * 0.290
            stat_h = 48

            for i, (lbl, val) in enumerate(stats):
                bx  = i * sw + 2
                bw  = sw - 4
                # Card fundo translucido
                c.setFillColor(colors.Color(1, 1, 1, 0.07))
                c.roundRect(bx, stat_y, bw, stat_h, 6, fill=1, stroke=0)
                c.setStrokeColor(colors.Color(0.81, 1.0, 0, 0.3))
                c.setLineWidth(0.4)
                c.roundRect(bx, stat_y, bw, stat_h, 6, fill=0, stroke=1)
                # Valor em lime
                c.setFillColor(C_LIME)
                c.setFont("Helvetica-Bold", 14)
                c.drawCentredString(bx + bw / 2, stat_y + stat_h * 0.52, val)
                # Label branco suave
                c.setFillColor(colors.Color(1, 1, 1, 0.55))
                c.setFont("Helvetica", 6.5)
                c.drawCentredString(bx + bw / 2, stat_y + 6, lbl)

            # Rodape da capa
            c.setFillColor(colors.Color(0, 0, 0, 0.30))
            c.rect(-MARGIN, -MARGIN, PAGE_W, 18 * mm, fill=1, stroke=0)
            c.setFillColor(C_WHITE)
            c.setFont("Helvetica", 8)
            c.drawCentredString(w / 2, 5, "Documento gerado automaticamente pelo Caderno de Parametros SobreIP")

    return [CapaFlowable(dados)]


# ─────────────────────────────────────────────
#  HELPER SECAO
# ─────────────────────────────────────────────
def secao(titulo, cor=None):
    """Retorna lista de flowables para uma barra de secao."""
    return [
        Spacer(1, 6 * mm),
        ColorBar(titulo, cor),
        Spacer(1, 4 * mm),
    ]


# ─────────────────────────────────────────────
#  CARD INFO (chave / valor)
# ─────────────────────────────────────────────
def card_info(pares, largura=None):
    usable = largura or (PAGE_W - 2 * MARGIN)
    col_w  = [usable * 0.34, usable * 0.66]
    rows   = []
    for label, val in pares:
        rows.append([
            Paragraph(label, ParagraphStyle("lbl", fontName="Helvetica-Bold", fontSize=9,
                                             textColor=C_TEXT_SOFT, leading=13)),
            Paragraph(str(val) if val else "—", ParagraphStyle("val", fontName="Helvetica",
                                                                 fontSize=10, textColor=C_TEXT, leading=14))
        ])
    style = TableStyle([
        ("ROWBACKGROUNDS", (0, 0), (-1, -1), [C_BG_LIGHT, C_WHITE]),
        ("BACKGROUND",     (0, 0), (0, -1),  C_BG_LIGHT),
        ("GRID",           (0, 0), (-1, -1), 0.4, C_BORDER),
        ("BOX",            (0, 0), (-1, -1), 0.8, C_BORDER),
        ("LEFTPADDING",    (0, 0), (-1, -1), 10),
        ("RIGHTPADDING",   (0, 0), (-1, -1), 8),
        ("TOPPADDING",     (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING",  (0, 0), (-1, -1), 7),
        ("LINEAFTER",      (0, 0), (0, -1),  1.5, C_ACCENT),
    ])
    return Table(rows, colWidths=col_w, style=style)


# ─────────────────────────────────────────────
#  GERADOR PRINCIPAL
# ─────────────────────────────────────────────
def gerar_pdf(dados: dict, caminho: str, empresa_nome=""):
    voz  = dados.get("voz",  {})
    chat = dados.get("chat", {})
    cli  = dados.get("cliente", {})

    doc = SimpleDocTemplate(
        caminho,
        pagesize=A4,
        leftMargin=MARGIN, rightMargin=MARGIN,
        topMargin=MARGIN + 12 * mm, bottomMargin=MARGIN + 10 * mm,
        title="Caderno de Parametros",
        author="SobreIP",
        subject=cli.get("empresa", ""),
    )

    story = []

    # ── CAPA ────────────────────────────────
    story += capa_page(dados)
    story.append(PageBreak())

    usable = PAGE_W - 2 * MARGIN

    # ── INDICE — sem emojis (Helvetica nao suporta) ──
    story += secao("INDICE DO DOCUMENTO", C_ACCENT2)
    modulos = []
    if cli:                         modulos.append("  Dados do Cliente")
    if voz.get("usuarios"):         modulos.append("  Usuarios Web")
    if voz.get("entradas"):         modulos.append("  Numeros de Entrada")
    if voz.get("ramais"):           modulos.append("  Ramais")
    if voz.get("agentes"):          modulos.append("  Agentes")
    if voz.get("regras_tempo"):     modulos.append("  Regras de Tempo")
    if voz.get("grupo_ring"):       modulos.append("  Grupo de Ring")
    if voz.get("filas"):            modulos.append("  Filas")
    if voz.get("uras"):             modulos.append("  URA")
    if voz.get("pausas"):           modulos.append("  Pausas do Call Center")
    if voz.get("pesquisas"):        modulos.append("  Pesquisa de Satisfacao")

    # Chat aparece mesmo sem tipo definido
    tem_chat_idx = (chat.get("tipo") or chat.get("usuarios") or
                    chat.get("agentes") or chat.get("departamentos"))
    if tem_chat_idx:
        modulos.append("  Chat / Omnichannel")
        if chat.get("usuarios"):      modulos.append("     |- Usuarios do Chat")
        if chat.get("agentes"):       modulos.append("     |- Agentes do Chat")
        if chat.get("departamentos"): modulos.append("     |- Departamentos")

    idx_data  = [[Paragraph(m, S["normal"])] for m in modulos]
    idx_style = TableStyle([
        ("ROWBACKGROUNDS", (0, 0), (-1, -1), [C_WHITE, C_BG_LIGHT]),
        ("GRID",           (0, 0), (-1, -1), 0.3, C_BORDER),
        ("BOX",            (0, 0), (-1, -1), 0.8, C_BORDER),
        ("LEFTPADDING",    (0, 0), (-1, -1), 14),
        ("TOPPADDING",     (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING",  (0, 0), (-1, -1), 6),
        ("LINEBEFORE",     (0, 0), (0, -1),  3, C_ACCENT),
    ])
    story.append(Table(idx_data, colWidths=[usable], style=idx_style))
    story.append(PageBreak())

    # ── CLIENTE ──────────────────────────────
    if cli:
        story += secao("DADOS DO CLIENTE")
        story.append(card_info([
            ("Empresa",  cli.get("empresa", "—")),
            ("Dominio",  cli.get("dominio", "—")),
            ("CNPJ",     cli.get("cnpj",    "—")),
        ]))
        story.append(Spacer(1, 4 * mm))

    # ── VOZ ──────────────────────────────────
    tem_voz = any([
        voz.get("usuarios"), voz.get("ramais"), voz.get("agentes"),
        voz.get("filas"),    voz.get("uras"),   voz.get("grupo_ring"),
        voz.get("entradas"), voz.get("regras_tempo"),
    ])
    if tem_voz:
        story += secao("VOZ / CALL CENTER", C_PRIMARY)

    # Usuarios Web
    if voz.get("usuarios"):
        story.append(Spacer(1, 3 * mm))
        story.append(Paragraph("Usuarios Web", S["secao_sub"]))
        cols = [usable*0.22, usable*0.28, usable*0.22, usable*0.22, usable*0.06]
        rows = []
        for u in voz["usuarios"]:
            badge = "V" if u.get("agente_callcenter") else ""
            rows.append([u.get("nome","—"), u.get("email","—"), u.get("senha","—"),
                         u.get("permissao","—"), badge])
        story.append(make_table(["Nome","E-mail","Senha","Permissao","Agente"], rows, cols))
        story.append(Spacer(1, 3 * mm))

    # Numeros de entrada
    if voz.get("entradas"):
        story.append(Spacer(1, 3 * mm))
        story.append(Paragraph("Numeros de Entrada", S["secao_sub"]))
        nums = [e.get("numero","—") for e in voz["entradas"]]
        story.append(ChipRow(nums))
        story.append(Spacer(1, 3 * mm))

    # Ramais
    if voz.get("ramais"):
        story.append(Spacer(1, 3 * mm))
        story.append(Paragraph("Ramais", S["secao_sub"]))
        ramais = voz["ramais"]
        chunk  = 4
        col_r  = usable / chunk
        for i in range(0, len(ramais), chunk):
            grupo = ramais[i:i+chunk]
            while len(grupo) < chunk:
                grupo.append(None)
            cells = []
            for r in grupo:
                if r:
                    cells.append(Paragraph(
                        f"<b>Ramal {r.get('ramal','')}</b><br/>"
                        f"<font size='8'>Senha: {r.get('senha','—')}</font>",
                        ParagraphStyle("rc", fontName="Helvetica", fontSize=9, leading=13,
                                       textColor=C_TEXT, alignment=TA_CENTER)
                    ))
                else:
                    cells.append(Paragraph("", S["normal"]))
            t = Table([cells], colWidths=[col_r]*chunk,
                      style=TableStyle([
                          ("GRID",           (0,0),(-1,-1), 0.4, C_BORDER),
                          ("BOX",            (0,0),(-1,-1), 0.8, C_BORDER),
                          ("ROWBACKGROUNDS", (0,0),(-1,-1), [C_BG_LIGHT, C_WHITE]),
                          ("TOPPADDING",     (0,0),(-1,-1), 7),
                          ("BOTTOMPADDING",  (0,0),(-1,-1), 7),
                          ("ALIGN",          (0,0),(-1,-1), "CENTER"),
                          ("LINEBEFORE",     (0,0),(0,-1),  2, C_ACCENT),
                      ]))
            story.append(t)
        story.append(Spacer(1, 3 * mm))

    # Agentes
    if voz.get("agentes"):
        story.append(Spacer(1, 3 * mm))
        story.append(Paragraph("Agentes", S["secao_sub"]))
        cols = [usable*0.45, usable*0.35, usable*0.20]
        rows = [[a.get("nome","—"), a.get("ramal","—"),
                 "V Multiskill" if a.get("multiskill") else "—"]
                for a in voz["agentes"]]
        story.append(make_table(["Nome","Ramal","Multiskill"], rows, cols))
        story.append(Spacer(1, 3 * mm))

    # Regras de Tempo
    if voz.get("regras_tempo"):
        story.append(Spacer(1, 3 * mm))
        story.append(Paragraph("Regras de Tempo", S["secao_sub"]))
        for r in voz["regras_tempo"]:
            faixas = r.get("faixas", [])
            if not faixas and r.get("hora_inicio"):
                faixas = [{"inicio": r["hora_inicio"], "fim": r["hora_fim"]}]
            faixas_str = "  |  ".join(
                f"{f.get('inicio','--:--')} as {f.get('fim','--:--')}" for f in faixas
            ) or "—"
            pares = [
                ("Nome",      r.get("nome","—")),
                ("Dias",      ", ".join(r.get("dias", [])) or "—"),
                ("Horarios",  faixas_str),
            ]
            story.append(card_info(pares))
            story.append(Spacer(1, 2 * mm))

    # Grupo de Ring
    if voz.get("grupo_ring"):
        story.append(Spacer(1, 3 * mm))
        story.append(Paragraph("Grupo de Ring", S["secao_sub"]))
        for g in voz["grupo_ring"]:
            pares = [
                ("Nome",       g.get("nome","—")),
                ("Estrategia", g.get("estrategia","—")),
                ("Ramais",     ", ".join(g.get("ramais", [])) or "—"),
            ]
            story.append(card_info(pares))
            story.append(Spacer(1, 2 * mm))

    # Filas
    if voz.get("filas"):
        story.append(Spacer(1, 3 * mm))
        story.append(Paragraph("Filas", S["secao_sub"]))
        cols = [usable*0.35, usable*0.65]
        rows = [[f.get("nome","—"), ", ".join(f.get("agentes",[]) or [])]
                for f in voz["filas"]]
        story.append(make_table(["Fila","Agentes"], rows, cols))
        story.append(Spacer(1, 3 * mm))

    # URA
    if voz.get("uras"):
        story.append(Spacer(1, 3 * mm))
        story.append(Paragraph("URA", S["secao_sub"]))
        for u in voz["uras"]:
            story.append(Paragraph(f"<b>{u.get('nome','—')}</b>", S["bold"]))
            if u.get("mensagem"):
                story.append(Paragraph(u["mensagem"], S["small"]))
            opcoes = u.get("opcoes", [])
            if opcoes:
                cols2 = [usable*0.12, usable*0.35, usable*0.53]
                rows2 = [[o.get("tecla","—"), o.get("destino","—"), o.get("descricao","—")]
                         for o in opcoes]
                story.append(make_table(["Tecla","Destino","Descricao"], rows2, cols2))
            story.append(Spacer(1, 3 * mm))

    # Pausas
    if voz.get("pausas"):
        story.append(Spacer(1, 3 * mm))
        story.append(Paragraph("Pausas do Call Center", S["secao_sub"]))
        for p in voz["pausas"]:
            story.append(Paragraph(f"<b>Grupo:</b> {p.get('grupo', '—')}", S["bold"]))
            itens = p.get("itens", [])
            if itens:
                cols3 = [usable*0.6, usable*0.4]
                rows3 = [[i.get("nome","—"), i.get("tempo","—")] for i in itens]
                story.append(make_table(["Nome da Pausa","Tempo"], rows3, cols3))
            story.append(Spacer(1, 2 * mm))

    # Pesquisa de Satisfacao
    if voz.get("pesquisas"):
        story.append(Spacer(1, 3 * mm))
        story.append(Paragraph("Pesquisa de Satisfacao", S["secao_sub"]))
        for p in voz["pesquisas"]:
            pares = [
                ("Nome",         p.get("nome","—")),
                ("Introducao",   p.get("introducao","—")),
                ("Pergunta",     p.get("pergunta","—")),
                ("Encerramento", p.get("encerramento","—")),
            ]
            story.append(card_info(pares))
            respostas = p.get("respostas", [])
            if respostas:
                story.append(Spacer(1, 2 * mm))
                cols4 = [usable*0.15, usable*0.85]
                rows4 = [[str(r.get("nota","—")), r.get("descricao","—")] for r in respostas]
                story.append(make_table(["Nota","Descricao"], rows4, cols4))
            story.append(Spacer(1, 3 * mm))

    # ── CHAT ─────────────────────────────────
    # Renderiza se tiver tipo OU qualquer dado de chat
    tem_chat = (chat.get("tipo") or chat.get("usuarios") or
                chat.get("agentes") or chat.get("departamentos"))
    if tem_chat:
        story.append(PageBreak())
        story += secao("CHAT / OMNICHANNEL", C_ACCENT2)

        # Tipo de integracao (apenas se definido)
        if chat.get("tipo"):
            tipo = chat["tipo"]
            if tipo == "ambos":
                tipo_label = "API Oficial + QR Code"
            elif tipo == "api":
                tipo_label = "Integracao via API Oficial"
            else:
                tipo_label = "Integracao via QR Code"

            pares_chat = [("Tipo", tipo_label)]
            if tipo in ("api", "ambos"):
                pares_chat.append(("API",   chat.get("api","—")))
                conta = chat.get("conta")
                conta_val = conta.get("api","—") if isinstance(conta, dict) else (conta or "—")
                pares_chat.append(("Conta", conta_val))
            if tipo in ("qr", "ambos"):
                conta = chat.get("conta")
                numeros = chat.get("numero_qr", [])
                qr_val = ", ".join(numeros) if numeros else (
                    conta.get("qr","—") if isinstance(conta, dict) else (conta or "—")
                )
                pares_chat.append(("Numero WhatsApp", qr_val))
            story.append(card_info(pares_chat))
            story.append(Spacer(1, 3 * mm))

        # Canais
        canais = chat.get("canais", [])
        if canais:
            story.append(Paragraph("Canais integrados:", S["bold"]))
            story.append(ChipRow(canais))
            story.append(Spacer(1, 3 * mm))

        # Usuarios chat
        if chat.get("usuarios"):
            story.append(Spacer(1, 3 * mm))
            story.append(Paragraph("Usuarios do Chat", S["secao_sub"]))
            cols = [usable*0.25, usable*0.30, usable*0.22, usable*0.23]
            rows = [[u.get("nome","—"), u.get("email","—"), u.get("senha","—"), u.get("permissao","—")]
                    for u in chat["usuarios"]]
            story.append(make_table(["Nome","E-mail","Senha","Permissao"], rows, cols))
            story.append(Spacer(1, 3 * mm))

        # Agentes chat
        if chat.get("agentes"):
            story.append(Spacer(1, 3 * mm))
            story.append(Paragraph("Agentes do Chat", S["secao_sub"]))
            cols = [usable*0.4, usable*0.6]
            rows = [[a.get("nome","—"), ", ".join(a.get("departamentos",[]))]
                    for a in chat["agentes"]]
            story.append(make_table(["Agente","Departamentos"], rows, cols))
            story.append(Spacer(1, 3 * mm))

        # Departamentos — bloco visual melhorado
        if chat.get("departamentos"):
            story.append(Spacer(1, 3 * mm))
            story.append(Paragraph("Departamentos", S["secao_sub"]))
            for dep in chat["departamentos"]:
                story.append(DepartamentoBlock(dep, w=usable))
                story.append(Spacer(1, 3 * mm))

    # ── BUILD ─────────────────────────────────
    empresa_nome = cli.get("empresa", "")

    def make_canvas(filename, **kwargs):
        kwargs.pop("pagesize", None)
        return NumberedCanvas(filename, pagesize=A4, empresa=empresa_nome)

    doc.build(story, canvasmaker=make_canvas)
    print(f"PDF gerado: {caminho}")


# ─────────────────────────────────────────────
#  MAIN – dados de exemplo
# ─────────────────────────────────────────────
if __name__ == "__main__":
    dados_exemplo = {
        "cliente": {
            "empresa": "ERA Telecom",
            "dominio": "era.sobreip.com.br",
            "cnpj": "12.345.678/0001-99"
        },
        "voz": {
            "usuarios": [
                {"nome": "Joao Silva",    "email": "joao@era.com",   "senha": "Senha@12345", "permissao": "Administrador do Modulo de PABX", "agente_callcenter": True},
                {"nome": "Maria Santos",  "email": "maria@era.com",  "senha": "Senha@12345", "permissao": "Agente",                          "agente_callcenter": True},
                {"nome": "Carlos Lima",   "email": "carlos@era.com", "senha": "Senha@12345", "permissao": "Supervisor",                      "agente_callcenter": False},
            ],
            "entradas": [
                {"numero": "(11) 3000-1000"},
                {"numero": "(11) 3000-1001"},
            ],
            "ramais": [
                {"ramal": "1001", "senha": "Pass@1001"},
                {"ramal": "1002", "senha": "Pass@1002"},
                {"ramal": "1003", "senha": "Pass@1003"},
                {"ramal": "1004", "senha": "Pass@1004"},
            ],
            "agentes": [
                {"nome": "Joao Silva",   "ramal": "1001", "multiskill": True},
                {"nome": "Maria Santos", "ramal": "1002", "multiskill": False},
            ],
            "regras_tempo": [
                {"nome": "Horario Comercial", "dias": ["Segunda","Terca","Quarta","Quinta","Sexta"],
                 "hora_inicio": "08:00", "hora_fim": "18:00"},
            ],
            "grupo_ring": [
                {"nome": "Suporte", "estrategia": "Simultanea", "ramais": ["1001","1002"]},
            ],
            "filas": [
                {"nome": "Atendimento Geral", "agentes": ["Joao Silva","Maria Santos"]},
            ],
            "uras": [
                {"nome": "URA Principal", "mensagem": "Ola, seja bem-vindo a ERA Telecom!",
                 "opcoes": [
                     {"tecla": "1", "destino": "Atendimento Geral", "descricao": "Suporte"},
                     {"tecla": "2", "destino": "1003",              "descricao": "Financeiro"},
                 ]}
            ],
            "pausas": [
                {"grupo": "Pausas Operacionais", "itens": [
                    {"nome": "Almoco",     "tempo": "60 min"},
                    {"nome": "Banheiro",   "tempo": "10 min"},
                    {"nome": "Treinamento","tempo": "30 min"},
                ]}
            ],
            "pesquisas": [
                {"nome": "Pesquisa de Atendimento",
                 "introducao": "Sua opiniao e muito importante.",
                 "pergunta": "De 0 a 5, como avalia nosso atendimento?",
                 "encerramento": "Obrigado por participar!",
                 "respostas": [
                     {"nota": 0, "descricao": "Pessimo"},
                     {"nota": 1, "descricao": "Ruim"},
                     {"nota": 2, "descricao": "Regular"},
                     {"nota": 3, "descricao": "Bom"},
                     {"nota": 4, "descricao": "Muito Bom"},
                     {"nota": 5, "descricao": "Excelente"},
                 ]}
            ],
        },
        "chat": {
            "tipo": "api",
            "api": "Meta",
            "conta": "era",
            "canais": ["whatsapp", "instagram", "messenger"],
            "usuarios": [
                {"nome": "Ana Chat", "email": "ana@era.com", "senha": "Senha@12345", "permissao": "Agente Omnichannel"},
                {"nome": "Bruno Chat", "email": "bruno@era.com", "senha": "Senha@12345", "permissao": "Supervisor Omnichannel"},
            ],
            "agentes": [
                {"nome": "Ana Chat",   "departamentos": ["Suporte Digital"]},
                {"nome": "Bruno Chat", "departamentos": ["Vendas Online"]},
            ],
            "departamentos": [
                {"nome": "Suporte Digital", "agentes": ["Ana Chat"]},
                {"nome": "Vendas Online",   "agentes": ["Bruno Chat"]},
                {"nome": "Financeiro Chat", "agentes": []},
            ],
        }
    }

    gerar_pdf(dados_exemplo, "/mnt/user-data/outputs/caderno-parametros-exemplo.pdf")
