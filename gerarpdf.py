"""
Gerador de PDF – Caderno de Parâmetros
Design profissional com ReportLab
Versão 2.0 – Suporte a logotipo da empresa
"""
import json
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, KeepTogether, PageBreak, Image
)
from reportlab.platypus.flowables import Flowable
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.pdfgen import canvas as pdf_canvas
import datetime

# ─────────────────────────────────────────────
#  PALETA DE CORES  –  Tema SobreIP (verde)
# ─────────────────────────────────────────────
C_PRIMARY    = colors.HexColor("#0a1628")   # navy escuro (header/footer)
C_BAR        = colors.HexColor("#00c47a")   # verde sólido para barras de título
C_ACCENT     = colors.HexColor("#00ffa3")   # verde neon  (cor principal da plataforma)
C_ACCENT2    = colors.HexColor("#00cfff")   # ciano       (gradiente secundário)
C_SUCCESS    = colors.HexColor("#00ffa3")   # verde
C_WARN       = colors.HexColor("#f59e0b")   # âmbar
C_BG_LIGHT   = colors.HexColor("#f0fff8")   # verde claríssimo
C_BG_GRAY    = colors.HexColor("#f8fafc")   # cinza suave
C_BORDER     = colors.HexColor("#b2f5e0")   # verde borda suave
C_TEXT       = colors.HexColor("#1e293b")   # texto escuro
C_TEXT_SOFT  = colors.HexColor("#64748b")   # texto suave
C_WHITE      = colors.white
C_CHIP_BG    = colors.HexColor("#d1fae5")   # verde chip fundo
C_CHIP_TEXT  = colors.HexColor("#065f46")   # verde chip texto
C_DIVIDER    = colors.HexColor("#00ffa3")   # linha divisória verde

PAGE_W, PAGE_H = A4
MARGIN = 18 * mm

# ─────────────────────────────────────────────
#  UTILITÁRIO DE LOGO
# ─────────────────────────────────────────────
def _carregar_logo(logo_path, max_w, max_h):
    """
    Tenta carregar o logo do caminho fornecido.
    Retorna (caminho, largura, altura) calculados para caber em max_w x max_h,
    ou None se o arquivo não existir.
    """
    if not logo_path or not os.path.isfile(logo_path):
        return None
    from PIL import Image as PILImage
    try:
        with PILImage.open(logo_path) as img:
            orig_w, orig_h = img.size
        ratio = min(max_w / orig_w, max_h / orig_h)
        return logo_path, orig_w * ratio, orig_h * ratio
    except Exception:
        return None


# ─────────────────────────────────────────────
#  NUMERAÇÃO DE PÁGINAS + HEADER/FOOTER
# ─────────────────────────────────────────────
class NumberedCanvas(pdf_canvas.Canvas):
    def __init__(self, *args, **kwargs):
        self._empresa  = kwargs.pop("empresa", "")
        self._logo     = kwargs.pop("logo_path", None)   # ← novo
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

        # ── Faixa footer ──────────────────────────
        self.setFillColor(C_PRIMARY)
        self.rect(0, 0, w, 10 * mm, fill=1, stroke=0)
        # Linha de acento no topo do footer
        self.setFillColor(C_ACCENT)
        self.rect(0, 10 * mm, w, 1.2, fill=1, stroke=0)

        self.setFillColor(C_WHITE)
        self.setFont("Helvetica", 7.5)
        self.drawString(MARGIN, 3.5 * mm,
                        f"Caderno de Parâmetros  •  {self._empresa}")
        hoje = datetime.date.today().strftime("%d/%m/%Y")
        txt = f"{hoje}   |   Pág. {page_num} / {page_count}"
        self.drawRightString(w - MARGIN, 3.5 * mm, txt)

        # ── Header (exceto capa) ──────────────────
        if page_num > 1:
            HDR_H = 14 * mm

            # Fundo do header
            self.setFillColor(C_PRIMARY)
            self.rect(0, h - HDR_H, w, HDR_H, fill=1, stroke=0)
            # Linha de acento na base do header
            self.setFillColor(C_ACCENT)
            self.rect(0, h - HDR_H, w, 1.5, fill=1, stroke=0)

            # Logo no header (lado direito)
            logo_info = _carregar_logo(self._logo, 28 * mm, 8 * mm)
            if logo_info:
                lpath, lw, lh = logo_info
                lx = w - MARGIN - lw
                ly = h - HDR_H + (HDR_H - lh) / 2
                try:
                    self.drawImage(lpath, lx, ly, width=lw, height=lh,
                                   mask="auto", preserveAspectRatio=True)
                except Exception:
                    pass

            # Texto do header (lado esquerdo)
            self.setFillColor(C_WHITE)
            self.setFont("Helvetica-Bold", 9)
            self.drawString(MARGIN, h - HDR_H / 2 - 3, "CADERNO DE PARÂMETROS")
            self.setFont("Helvetica", 7.5)
            self.setFillColor(colors.HexColor("#7fffd4"))  # aquamarine / verde claro
            self.drawString(MARGIN, h - HDR_H / 2 + 5.5,
                            "SobreIP  —  Configuração do Cliente")


# ─────────────────────────────────────────────
#  FLOWABLES CUSTOMIZADOS
# ─────────────────────────────────────────────
class ColorBar(Flowable):
    """Barra colorida de seção."""
    def __init__(self, titulo, icone="", cor=None, w=None):
        Flowable.__init__(self)
        self.titulo = titulo
        self.icone  = icone
        self.cor    = cor or C_PRIMARY
        self.w      = w or (PAGE_W - 2 * MARGIN)
        self.height = 13 * mm

    def wrap(self, *args):
        return (self.w, self.height)

    def draw(self):
        c = self.canv
        # Sombra suave
        c.setFillColor(colors.HexColor("#00000018"))
        c.roundRect(2, -2, self.w, self.height, 4, fill=1, stroke=0)
        # Barra principal
        c.setFillColor(self.cor)
        c.roundRect(0, 0, self.w, self.height, 4, fill=1, stroke=0)
        # Faixa lateral de acento (verde mais escuro)
        c.setFillColor(colors.HexColor("#007a4d"))
        c.roundRect(0, 0, 5, self.height, 2, fill=1, stroke=0)
        # Texto
        c.setFillColor(colors.HexColor("#0a1628"))   # texto navy escuro no fundo verde
        c.setFont("Helvetica-Bold", 11)
        label = f"{self.icone}  {self.titulo}" if self.icone else self.titulo
        c.drawString(14, 4.5, label)


class ChipRow(Flowable):
    """Linha de chips coloridos."""
    def __init__(self, items, w=None):
        Flowable.__init__(self)
        self.items  = items
        self.w      = w or (PAGE_W - 2 * MARGIN)
        self._lines = []
        self._height = 0

    def _layout(self):
        x = 0
        pad_x, pad_y = 7, 4
        chip_h = 17
        gap_x, gap_y = 7, 6
        lines = [[]]
        for item in self.items:
            tw = len(item) * 5.6 + pad_x * 2
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
        self._height = len(lines) * (chip_h + gap_y) + 4

    def wrap(self, *args):
        self._layout()
        return (self.w, self._height)

    def draw(self):
        self._layout()
        c = self.canv
        y_start = self._height - self._chip_h - 2
        for line in self._lines:
            for (text, x, tw) in line:
                # Sombra do chip
                c.setFillColor(colors.HexColor("#00000012"))
                c.roundRect(x + 1, y_start - 1, tw, self._chip_h, 5, fill=1, stroke=0)
                # Fundo do chip
                c.setFillColor(C_CHIP_BG)
                c.roundRect(x, y_start, tw, self._chip_h, 5, fill=1, stroke=0)
                # Borda
                c.setStrokeColor(colors.HexColor("#c7d2fe"))
                c.setLineWidth(0.5)
                c.roundRect(x, y_start, tw, self._chip_h, 5, fill=0, stroke=1)
                # Texto
                c.setFillColor(C_CHIP_TEXT)
                c.setFont("Helvetica-Bold", 7.5)
                c.drawString(x + self._pad_x, y_start + self._pad_y + 1, text)
            y_start -= (self._chip_h + self._gap_y)


class LogoBlock(Flowable):
    """
    Bloco que exibe o logotipo da empresa centralizado,
    usado na capa quando não há canvas direto disponível.
    """
    def __init__(self, logo_path, max_w, max_h):
        Flowable.__init__(self)
        self._info = _carregar_logo(logo_path, max_w, max_h)
        self._max_w = max_w
        self._max_h = max_h

    def wrap(self, *args):
        if self._info:
            _, lw, lh = self._info
            return (lw, lh)
        return (0, 0)

    def draw(self):
        if self._info:
            lpath, lw, lh = self._info
            try:
                self.canv.drawImage(lpath, 0, 0, width=lw, height=lh,
                                    mask="auto", preserveAspectRatio=True)
            except Exception:
                pass


# ─────────────────────────────────────────────
#  ESTILOS
# ─────────────────────────────────────────────
def estilos():
    base = dict(fontName="Helvetica", fontSize=10, leading=14,
                textColor=C_TEXT, leftIndent=0, rightIndent=0)
    return {
        "normal":  ParagraphStyle("normal",  **base),
        "small":   ParagraphStyle("small",   **{**base, "fontSize": 8, "leading": 11,
                                                "textColor": C_TEXT_SOFT}),
        "bold":    ParagraphStyle("bold",    **{**base, "fontName": "Helvetica-Bold"}),
        "label":   ParagraphStyle("label",   **{**base, "fontSize": 8, "textColor": C_TEXT_SOFT,
                                                "fontName": "Helvetica-Bold", "spaceAfter": 2}),
        "value":   ParagraphStyle("value",   **{**base, "fontSize": 10, "fontName": "Helvetica-Bold",
                                                "textColor": colors.HexColor("#065f46")}),  # verde escuro
        "center":  ParagraphStyle("center",  **{**base, "alignment": TA_CENTER}),
        "caption": ParagraphStyle("caption", **{**base, "fontSize": 8, "textColor": C_TEXT_SOFT,
                                                "alignment": TA_CENTER}),
        "mono":    ParagraphStyle("mono",    **{**base, "fontName": "Courier", "fontSize": 9}),
        "h1capa":  ParagraphStyle("h1capa",  fontName="Helvetica-Bold", fontSize=26, leading=32,
                                  textColor=C_WHITE, alignment=TA_CENTER),
        "subcapa": ParagraphStyle("subcapa", fontName="Helvetica", fontSize=12, leading=16,
                                  textColor=colors.HexColor("#b0d4f1"), alignment=TA_CENTER),
        "empresa_capa": ParagraphStyle("empresa_capa", fontName="Helvetica-Bold", fontSize=18,
                                       leading=22, textColor=C_WHITE, alignment=TA_CENTER),
        "modulo":  ParagraphStyle("modulo",  fontName="Helvetica-Bold", fontSize=13, leading=18,
                                  textColor=colors.HexColor("#065f46"), spaceAfter=4),  # verde escuro
        "idx_item":ParagraphStyle("idx_item",fontName="Helvetica", fontSize=10, leading=15,
                                  textColor=C_TEXT),
    }


S = estilos()


# ─────────────────────────────────────────────
#  TABELA PADRÃO
# ─────────────────────────────────────────────
def make_table(head, rows, col_widths=None):
    usable = PAGE_W - 2 * MARGIN
    if not col_widths:
        n = len(head)
        col_widths = [usable / n] * n

    header_cells = [
        Paragraph(f"<b>{h}</b>", ParagraphStyle(
            "th", fontName="Helvetica-Bold", fontSize=9, leading=12,
            textColor=C_WHITE, alignment=TA_CENTER))
        for h in head
    ]

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
        ("LINEBELOW",      (0, 0), (-1, 0),  1.8, C_ACCENT),
        *[("BACKGROUND",   (0, i), (-1, i),  C_BG_LIGHT if i % 2 == 1 else C_WHITE)
          for i in range(1, len(data))],
        ("GRID",           (0, 0), (-1, -1), 0.4, C_BORDER),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [C_WHITE, C_BG_GRAY]),
        ("BOX",            (0, 0), (-1, -1), 0.8, C_BORDER),
        ("TOPPADDING",     (0, 1), (-1, -1), 6),
        ("BOTTOMPADDING",  (0, 1), (-1, -1), 6),
    ])
    return Table(data, colWidths=col_widths, style=style, repeatRows=1)


# ─────────────────────────────────────────────
#  CAPA
# ─────────────────────────────────────────────
def _hexagon_path(c, cx, cy, r):
    import math
    p = c.beginPath()
    for i in range(6):
        angle = math.radians(90 + 60 * i)
        x = cx + r * math.cos(angle)
        y = cy + r * math.sin(angle)
        if i == 0:
            p.moveTo(x, y)
        else:
            p.lineTo(x, y)
    p.close()
    return p


def _draw_era_symbol(c, cx, cy, size=38):
    import math
    for r_glow, alpha in [(size * 2.0, 0.04), (size * 1.6, 0.06), (size * 1.2, 0.08)]:
        c.setFillColor(colors.Color(0.0, 1.0, 0.64, alpha))
        c.circle(cx, cy, r_glow, fill=1, stroke=0)
    c.setStrokeColor(colors.HexColor("#00ffa3"))
    c.setLineWidth(1.8)
    p = _hexagon_path(c, cx, cy, size)
    c.setFillColor(colors.Color(0.0, 0.15, 0.10, 0.85))
    c.drawPath(p, fill=1, stroke=1)
    c.setStrokeColor(colors.Color(0.0, 1.0, 0.64, 0.35))
    c.setLineWidth(0.6)
    p2 = _hexagon_path(c, cx, cy, size * 0.78)
    c.setFillColor(colors.Color(0, 0, 0, 0))
    c.drawPath(p2, fill=0, stroke=1)
    c.setFillColor(colors.HexColor("#00ffa3"))
    font_size = size * 0.52
    c.setFont("Helvetica-Bold", font_size)
    c.drawCentredString(cx, cy - font_size * 0.35, "ERA")


def _draw_logo_placeholder(c, w, y, h):
    _draw_era_symbol(c, w / 2, y + h / 2, size=38)


def capa_page(dados, logo_path=None):
    class CapaFlowable(Flowable):
        def __init__(self, dados, logo_path):
            Flowable.__init__(self)
            self.dados     = dados
            self.logo_path = logo_path
            self.width     = PAGE_W - 2 * MARGIN
            self.height    = PAGE_H - 2 * MARGIN

        def wrap(self, avW, avH):
            return (self.width, min(self.height, avH))

        def draw(self):
            import math
            c   = self.canv
            d   = self.dados
            w   = self.width
            h   = self.height
            cli  = d.get("cliente", {})
            voz  = d.get("voz",  {})
            chat = d.get("chat", {})

            # 1. FUNDO NEGRO
            c.setFillColor(colors.HexColor("#020617"))
            c.rect(-MARGIN, -MARGIN, PAGE_W, PAGE_H, fill=1, stroke=0)

            # 2. GRID DE PONTOS
            dot_gap = 20
            c.setFillColor(colors.Color(0.0, 1.0, 0.64, 0.055))
            x0 = -MARGIN
            while x0 < PAGE_W:
                y0 = -MARGIN
                while y0 < PAGE_H:
                    c.circle(x0, y0, 0.85, fill=1, stroke=0)
                    y0 += dot_gap
                x0 += dot_gap

            # 3. ORBS
            for radius, alpha in [(160, 0.05), (110, 0.07), (70, 0.07), (38, 0.06)]:
                c.setFillColor(colors.Color(0.0, 1.0, 0.64, alpha))
                c.circle(PAGE_W - MARGIN * 0.3, PAGE_H - MARGIN * 0.3, radius, fill=1, stroke=0)
            for radius, alpha in [(130, 0.05), (85, 0.06), (45, 0.06)]:
                c.setFillColor(colors.Color(0.0, 0.81, 1.0, alpha))
                c.circle(-MARGIN * 0.5, MARGIN * 0.5, radius, fill=1, stroke=0)
            for radius, alpha in [(90, 0.03), (45, 0.04)]:
                c.setFillColor(colors.Color(0.0, 1.0, 0.64, alpha))
                c.circle(w * 0.5, h * 0.08, radius, fill=1, stroke=0)

            # 4. BARRA GRADIENTE TOPO
            bar_steps = 50
            for i in range(bar_steps):
                t = i / bar_steps
                g_ = int(255 * (1 - t) + 207 * t)
                b_ = int(163 * (1 - t) + 255 * t)
                seg_w = PAGE_W / bar_steps
                c.setFillColor(colors.Color(0, g_/255, b_/255))
                c.rect(-MARGIN + i * seg_w, h + MARGIN - 4, seg_w + 0.5, 4, fill=1, stroke=0)

            # 5. SÍMBOLO / LOGO
            logo_cx = w / 2
            logo_cy = h * 0.755
            logo_info = _carregar_logo(self.logo_path, w * 0.52, 72)
            if logo_info:
                lpath, lw, lh = logo_info
                lx = logo_cx - lw / 2
                ly = logo_cy - lh / 2
                for r_glow, alpha in [(50, 0.04), (34, 0.06)]:
                    c.setFillColor(colors.Color(0.0, 1.0, 0.64, alpha))
                    c.circle(logo_cx, logo_cy, r_glow + lw * 0.35, fill=1, stroke=0)
                try:
                    c.drawImage(lpath, lx, ly, width=lw, height=lh,
                                mask="auto", preserveAspectRatio=True)
                except Exception:
                    _draw_era_symbol(c, logo_cx, logo_cy, size=40)
            else:
                _draw_era_symbol(c, logo_cx, logo_cy, size=42)

            # 6. CARD GLASSMORPHISM
            card_w = w * 0.88
            card_h = h * 0.335
            card_x = (w - card_w) / 2
            card_y = h * 0.370

            c.setFillColor(colors.Color(0, 0, 0, 0.35))
            c.roundRect(card_x + 4, card_y - 5, card_w, card_h, 14, fill=1, stroke=0)
            c.setFillColor(colors.Color(1, 1, 1, 0.055))
            c.roundRect(card_x, card_y, card_w, card_h, 12, fill=1, stroke=0)
            c.setStrokeColor(colors.Color(0.0, 1.0, 0.64, 0.22))
            c.setLineWidth(0.8)
            c.roundRect(card_x, card_y, card_w, card_h, 12, fill=0, stroke=1)

            # Borda topo gradiente
            steps_b = 40
            for i in range(steps_b):
                t = i / steps_b
                g_ = int(255 * (1-t) + 207 * t)
                b_ = int(163 * (1-t) + 255 * t)
                seg = card_w / steps_b
                c.setStrokeColor(colors.Color(0, g_/255, b_/255, 0.7))
                c.setLineWidth(1.4)
                c.line(card_x + i * seg, card_y + card_h,
                       card_x + (i+1) * seg, card_y + card_h)

            # Título
            c.setFillColor(C_WHITE)
            c.setFont("Helvetica-Bold", 22)
            c.drawCentredString(w / 2, card_y + card_h - 30, "Caderno de Parâmetros")
            c.setFont("Helvetica", 10)
            c.setFillColor(colors.HexColor("#00ffa3"))
            c.drawCentredString(w / 2, card_y + card_h - 46,
                                "Resumo da Configuração do Cliente")

            # Divisor interno
            c.setStrokeColor(colors.Color(1, 1, 1, 0.12))
            c.setLineWidth(0.6)
            c.line(card_x + 20, card_y + card_h - 58, card_x + card_w - 20, card_y + card_h - 58)

            # Nome da empresa
            empresa = cli.get("empresa", "—")
            c.setFillColor(C_WHITE)
            c.setFont("Helvetica-Bold", 17)
            c.drawCentredString(w / 2, card_y + card_h - 80, empresa)

            # Infos
            info_y = card_y + card_h - 102
            for label, val in [
                ("Domínio", cli.get("dominio", "—")),
                ("CNPJ",    cli.get("cnpj",    "—")),
                ("Data",    datetime.date.today().strftime("%d/%m/%Y")),
            ]:
                c.setFillColor(colors.HexColor("#00ffa3"))
                c.circle(card_x + 22, info_y + 4, 2.2, fill=1, stroke=0)
                c.setFont("Helvetica-Bold", 8)
                c.setFillColor(colors.Color(0.6, 1.0, 0.84))
                c.drawString(card_x + 30, info_y, label + ":")
                c.setFont("Helvetica", 8.5)
                c.setFillColor(colors.Color(0.85, 0.95, 0.92))
                c.drawString(card_x + 82, info_y, val)
                info_y -= 15

            # Divisor inferior
            c.setStrokeColor(colors.Color(1, 1, 1, 0.10))
            c.setLineWidth(0.5)
            c.line(card_x + 20, card_y + 50, card_x + card_w - 20, card_y + 50)

            # 7. STATS
            n_usuarios = len(voz.get("usuarios", []))
            n_ramais   = len(voz.get("ramais",   []))
            n_filas    = len(voz.get("filas",    []))
            n_uras     = len(voz.get("uras",     []))
            has_chat   = "Sim" if chat.get("tipo") else "Nao"
            n_agentes  = len(voz.get("agentes",  []))

            stats = [
                ("Usuarios", str(n_usuarios)),
                ("Ramais",   str(n_ramais)),
                ("Filas",    str(n_filas)),
                ("URAs",     str(n_uras)),
                ("Agentes",  str(n_agentes)),
                ("Chat",     has_chat),
            ]

            stat_count  = len(stats)
            stat_w_each = (card_w - 28) / stat_count
            stat_y_base = card_y + 8

            for i, (rotulo, valor) in enumerate(stats):
                sx = card_x + 14 + i * stat_w_each
                c.setFillColor(colors.Color(0.0, 1.0, 0.64, 0.06))
                c.roundRect(sx, stat_y_base, stat_w_each - 5, 36, 5, fill=1, stroke=0)
                c.setStrokeColor(colors.Color(0.0, 1.0, 0.64, 0.15))
                c.setLineWidth(0.5)
                c.roundRect(sx, stat_y_base, stat_w_each - 5, 36, 5, fill=0, stroke=1)
                c.setFillColor(colors.HexColor("#00ffa3"))
                c.setFont("Helvetica-Bold", 11)
                c.drawCentredString(sx + (stat_w_each - 5) / 2, stat_y_base + 20, valor)
                c.setFillColor(colors.Color(1, 1, 1, 0.55))
                c.setFont("Helvetica", 6.5)
                c.drawCentredString(sx + (stat_w_each - 5) / 2, stat_y_base + 8, rotulo)

            # 8. RODAPÉ
            c.setFillColor(colors.Color(0, 0, 0, 0.4))
            c.rect(-MARGIN, -MARGIN, PAGE_W, 14 * mm, fill=1, stroke=0)
            c.setStrokeColor(colors.Color(0.0, 1.0, 0.64, 0.25))
            c.setLineWidth(0.6)
            c.line(-MARGIN, 14 * mm - MARGIN, PAGE_W - MARGIN, 14 * mm - MARGIN)
            c.setFillColor(colors.Color(0.0, 1.0, 0.64, 0.7))
            c.setFont("Helvetica-Bold", 7)
            c.drawString(-MARGIN + 12, 4, "SobreIP")
            c.setFillColor(colors.Color(1, 1, 1, 0.35))
            c.setFont("Helvetica", 7)
            c.drawCentredString(w / 2, 4,
                "Documento gerado automaticamente pelo sistema Caderno de Parametros")
            c.setFillColor(colors.Color(0.0, 1.0, 0.64, 0.5))
            c.setFont("Helvetica", 7)
            hoje = datetime.date.today().strftime("%d/%m/%Y")
            c.drawRightString(w + MARGIN - 12, 4, hoje)

    return [CapaFlowable(dados, logo_path)]


# ─────────────────────────────────────────────
#  BLOCO DE SEÇÃO
# ─────────────────────────────────────────────
def secao(titulo, icone="", cor=None):
    elems = [Spacer(1, 8 * mm)]
    elems.append(ColorBar(titulo, icone, cor or C_BAR))
    elems.append(Spacer(1, 4 * mm))
    return elems


# ─────────────────────────────────────────────
#  CARD INFO (chave / valor)
# ─────────────────────────────────────────────
def card_info(pares, largura=None):
    usable = largura or (PAGE_W - 2 * MARGIN)
    col_w  = [usable * 0.33, usable * 0.67]
    rows   = []
    for label, val in pares:
        rows.append([
            Paragraph(label, ParagraphStyle(
                "lbl", fontName="Helvetica-Bold", fontSize=9,
                textColor=C_TEXT_SOFT, leading=13)),
            Paragraph(str(val) if val else "—", ParagraphStyle(
                "val", fontName="Helvetica", fontSize=10,
                textColor=C_TEXT, leading=14))
        ])
    style = TableStyle([
        ("BACKGROUND",     (0, 0), (0, -1),  C_BG_LIGHT),
        ("BACKGROUND",     (1, 0), (1, -1),  C_BG_GRAY),
        ("ROWBACKGROUNDS", (1, 0), (1, -1),  [C_BG_GRAY, C_WHITE]),
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
#  MINI SEÇÃO (sub-título de módulo)
# ─────────────────────────────────────────────
def mini_secao(titulo_icone):
    return [
        Spacer(1, 3 * mm),
        Paragraph(titulo_icone, S["modulo"]),
        HRFlowable(width=PAGE_W - 2 * MARGIN, thickness=0.8,
                   color=C_BORDER, spaceAfter=3),
    ]


# ─────────────────────────────────────────────
#  GERADOR PRINCIPAL
# ─────────────────────────────────────────────
def gerar_pdf(dados: dict, caminho: str, logo_path: str = None):
    """
    Gera o PDF do Caderno de Parâmetros.

    Parâmetros
    ----------
    dados      : dict com as seções 'cliente', 'voz' e 'chat'
    caminho    : caminho do arquivo de saída (.pdf)
    logo_path  : (opcional) caminho para o arquivo de imagem do logotipo
                 da empresa (ex: './assets/image.png').
                 Aceita PNG, JPG, GIF e outros formatos suportados pelo Pillow.
    """
    voz  = dados.get("voz",  {})
    chat = dados.get("chat", {})
    cli  = dados.get("cliente", {})

    doc = SimpleDocTemplate(
        caminho,
        pagesize=A4,
        leftMargin=MARGIN,  rightMargin=MARGIN,
        topMargin=MARGIN + 14 * mm,  bottomMargin=MARGIN + 10 * mm,
        title="Caderno de Parâmetros",
        author="SobreIP",
        subject=cli.get("empresa", ""),
    )

    story = []

    # ─── CAPA ───────────────────────────────────
    story += capa_page(dados, logo_path)
    story.append(PageBreak())

    usable = PAGE_W - 2 * MARGIN

    # ─── ÍNDICE ─────────────────────────────────
    story += secao("ÍNDICE DO DOCUMENTO", "📋")

    modulos = []
    if cli:                            modulos.append(("🏢", "Dados do Cliente"))
    if voz.get("usuarios"):            modulos.append(("👤", "Usuários Web"))
    if voz.get("entradas"):            modulos.append(("📞", "Números de Entrada"))
    if voz.get("ramais"):              modulos.append(("☎️",  "Ramais"))
    if voz.get("agentes"):             modulos.append(("🎧", "Agentes"))
    if voz.get("regras_tempo"):        modulos.append(("⏰", "Regras de Tempo"))
    if voz.get("grupo_ring"):          modulos.append(("🔔", "Grupo de Ring"))
    if voz.get("filas"):               modulos.append(("📋", "Filas"))
    if voz.get("uras"):                modulos.append(("🎙️",  "URA"))
    if voz.get("pausas"):              modulos.append(("⏸️",  "Pausas"))
    if voz.get("pesquisas"):           modulos.append(("⭐", "Pesquisa de Satisfação"))
    if chat.get("tipo"):
        modulos.append(("💬", "Chat / Omnichannel"))
        if chat.get("usuarios"):       modulos.append(("    └", "Usuários do Chat"))
        if chat.get("agentes"):        modulos.append(("    └", "Agentes do Chat"))
        if chat.get("departamentos"):  modulos.append(("    └", "Departamentos"))

    idx_rows = []
    for i, (icone, nome) in enumerate(modulos):
        num_cell = Paragraph(
            f"<b>{i + 1:02d}</b>" if not nome.startswith("    ") else "",
            ParagraphStyle("idx_num", fontName="Helvetica-Bold", fontSize=9,
                           textColor=C_ACCENT, alignment=TA_CENTER, leading=14)
        )
        ico_cell = Paragraph(icone, ParagraphStyle(
            "idx_ico", fontName="Helvetica", fontSize=10,
            alignment=TA_CENTER, leading=14))
        lbl_cell = Paragraph(nome, ParagraphStyle(
            "idx_lbl", fontName="Helvetica" if nome.startswith("    ") else "Helvetica-Bold",
            fontSize=10, textColor=C_TEXT_SOFT if nome.startswith("    ") else C_TEXT,
            leading=14))
        idx_rows.append([num_cell, ico_cell, lbl_cell])

    idx_style = TableStyle([
        ("BACKGROUND",     (0, 0), (-1, -1), C_WHITE),
        ("ROWBACKGROUNDS", (0, 0), (-1, -1), [C_WHITE, C_BG_LIGHT]),
        ("GRID",           (0, 0), (-1, -1), 0.3, C_BORDER),
        ("BOX",            (0, 0), (-1, -1), 0.8, C_BORDER),
        ("LEFTPADDING",    (0, 0), (-1, -1), 8),
        ("RIGHTPADDING",   (0, 0), (-1, -1), 8),
        ("TOPPADDING",     (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING",  (0, 0), (-1, -1), 6),
        ("VALIGN",         (0, 0), (-1, -1), "MIDDLE"),
        ("LINEBEFORE",     (0, 0), (0, -1),  3, C_ACCENT),
        ("LINEAFTER",      (1, 0), (1, -1),  0.5, C_BORDER),
    ])
    story.append(Table(idx_rows,
                       colWidths=[usable * 0.10, usable * 0.12, usable * 0.78],
                       style=idx_style))
    story.append(PageBreak())

    # ─── CLIENTE ────────────────────────────────
    if cli:
        story += secao("DADOS DO CLIENTE", "🏢")
        story.append(card_info([
            ("Empresa", cli.get("empresa", "—")),
            ("Domínio", cli.get("dominio", "—")),
            ("CNPJ",    cli.get("cnpj",    "—")),
        ]))
        story.append(Spacer(1, 4 * mm))

    # ─── VOZ ────────────────────────────────────
    tem_voz = any([
        voz.get("usuarios"), voz.get("ramais"),  voz.get("agentes"),
        voz.get("filas"),    voz.get("uras"),     voz.get("grupo_ring"),
        voz.get("entradas"), voz.get("regras_tempo"),
    ])
    if tem_voz:
        story += secao("VOZ / CALL CENTER", "📞")

    # Usuários Web
    if voz.get("usuarios"):
        story += mini_secao("👤  Usuários Web")
        cols = [usable*0.22, usable*0.28, usable*0.22, usable*0.22, usable*0.06]
        rows = []
        for u in voz["usuarios"]:
            badge = "✔" if u.get("agente_callcenter") else ""
            rows.append([u.get("nome","—"), u.get("email","—"), u.get("senha","—"),
                         u.get("permissao","—"), badge])
        story.append(make_table(["Nome","E-mail","Senha","Permissão","Agente"], rows, cols))
        story.append(Spacer(1, 3 * mm))

    # Números de Entrada
    if voz.get("entradas"):
        story += mini_secao("📞  Números de Entrada")
        nums = [e.get("numero","—") for e in voz["entradas"]]
        story.append(ChipRow(nums))
        story.append(Spacer(1, 3 * mm))

    # Ramais
    if voz.get("ramais"):
        story += mini_secao("☎️  Ramais")
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
                        f"<font color='#64748b' size='8'>Senha: {r.get('senha','—')}</font>",
                        ParagraphStyle("rc", fontName="Helvetica", fontSize=9,
                                       leading=13, textColor=C_TEXT, alignment=TA_CENTER)
                    ))
                else:
                    cells.append(Paragraph("", S["normal"]))
            t = Table([cells], colWidths=[col_r]*chunk,
                      style=TableStyle([
                          ("GRID",           (0,0),(-1,-1), 0.4, C_BORDER),
                          ("BOX",            (0,0),(-1,-1), 0.8, C_BORDER),
                          ("ROWBACKGROUNDS", (0,0),(-1,-1), [C_BG_LIGHT, C_WHITE]),
                          ("TOPPADDING",     (0,0),(-1,-1), 8),
                          ("BOTTOMPADDING",  (0,0),(-1,-1), 8),
                          ("ALIGN",          (0,0),(-1,-1), "CENTER"),
                          ("VALIGN",         (0,0),(-1,-1), "MIDDLE"),
                          ("LINEBEFORE",     (0,0),(0,-1),  2.5, C_ACCENT),
                      ]))
            story.append(t)
        story.append(Spacer(1, 3 * mm))

    # Agentes
    if voz.get("agentes"):
        story += mini_secao("🎧  Agentes")
        cols = [usable*0.45, usable*0.35, usable*0.20]
        rows = [[a.get("nome","—"), a.get("ramal","—"),
                 "✔ Multiskill" if a.get("multiskill") else "—"]
                for a in voz["agentes"]]
        story.append(make_table(["Nome","Ramal","Multiskill"], rows, cols))
        story.append(Spacer(1, 3 * mm))

    # Regras de Tempo
    if voz.get("regras_tempo"):
        story += mini_secao("⏰  Regras de Tempo")
        for r in voz["regras_tempo"]:
            dias  = ", ".join(r.get("dias", [])) or "—"
            pares = [
                ("Nome",   r.get("nome",        "—")),
                ("Dias",   dias),
                ("Início", r.get("hora_inicio", "—")),
                ("Fim",    r.get("hora_fim",     "—")),
            ]
            story.append(card_info(pares))
            story.append(Spacer(1, 2 * mm))

    # Grupo de Ring
    if voz.get("grupo_ring"):
        story += mini_secao("🔔  Grupo de Ring")
        for g in voz["grupo_ring"]:
            ramais_str = ", ".join(g.get("ramais", [])) or "—"
            pares = [
                ("Nome",       g.get("nome",      "—")),
                ("Estratégia", g.get("estrategia","—")),
                ("Ramais",     ramais_str),
            ]
            story.append(card_info(pares))
            story.append(Spacer(1, 2 * mm))

    # Filas
    if voz.get("filas"):
        story += mini_secao("📋  Filas")
        cols = [usable*0.35, usable*0.65]
        rows = [[f.get("nome","—"), ", ".join(f.get("agentes",[]) or [])]
                for f in voz["filas"]]
        story.append(make_table(["Fila","Agentes"], rows, cols))
        story.append(Spacer(1, 3 * mm))

    # URA
    if voz.get("uras"):
        story += mini_secao("🎙️  URA")
        for u in voz["uras"]:
            story.append(Paragraph(f"<b>{u.get('nome','—')}</b>", S["bold"]))
            if u.get("mensagem"):
                story.append(Paragraph(f"Mensagem: {u['mensagem']}", S["small"]))
                story.append(Spacer(1, 2 * mm))
            opcoes = u.get("opcoes", [])
            if opcoes:
                cols2 = [usable*0.12, usable*0.35, usable*0.53]
                rows2 = [[o.get("tecla","—"), o.get("destino","—"),
                          o.get("descricao","—")] for o in opcoes]
                story.append(make_table(["Tecla","Destino","Descrição"], rows2, cols2))
            story.append(Spacer(1, 3 * mm))

    # Pausas
    if voz.get("pausas"):
        story += mini_secao("⏸️  Pausas do Call Center")
        for p in voz["pausas"]:
            story.append(Paragraph(
                f"<b>Grupo:</b> {p.get('grupo','—')}", S["bold"]))
            itens = p.get("itens", [])
            if itens:
                cols3 = [usable*0.6, usable*0.4]
                rows3 = [[i.get("nome","—"), i.get("tempo","—")] for i in itens]
                story.append(make_table(["Nome da Pausa","Tempo"], rows3, cols3))
            story.append(Spacer(1, 2 * mm))

    # Pesquisa de Satisfação
    if voz.get("pesquisas"):
        story += mini_secao("⭐  Pesquisa de Satisfação")
        for p in voz["pesquisas"]:
            pares = [
                ("Nome",         p.get("nome",         "—")),
                ("Introdução",   p.get("introducao",   "—")),
                ("Pergunta",     p.get("pergunta",      "—")),
                ("Encerramento", p.get("encerramento",  "—")),
            ]
            story.append(card_info(pares))
            respostas = p.get("respostas", [])
            if respostas:
                story.append(Spacer(1, 2 * mm))
                cols4 = [usable*0.15, usable*0.85]
                rows4 = [[str(r.get("nota","—")), r.get("descricao","—")]
                         for r in respostas]
                story.append(make_table(["Nota","Descrição"], rows4, cols4))
            story.append(Spacer(1, 3 * mm))

    # ─── CHAT ───────────────────────────────────
    if chat.get("tipo"):
        story.append(PageBreak())
        story += secao("CHAT / OMNICHANNEL", "💬")

        tipo_label = ("Integração via QR Code"
                      if chat["tipo"] == "qr"
                      else "Integração via API Oficial")
        pares_chat = [("Tipo", tipo_label)]
        if chat["tipo"] == "api":
            pares_chat.append(("API",   chat.get("api",   "—")))
            pares_chat.append(("Conta", chat.get("conta", "—")))
        else:
            pares_chat.append(("Número WhatsApp", chat.get("conta","—")))
        story.append(card_info(pares_chat))
        story.append(Spacer(1, 3 * mm))

        canais = chat.get("canais", [])
        if canais:
            story.append(Paragraph("Canais integrados:", S["bold"]))
            story.append(ChipRow(canais))
            story.append(Spacer(1, 3 * mm))

        if chat.get("usuarios"):
            story += mini_secao("👤  Usuários do Chat")
            cols = [usable*0.25, usable*0.30, usable*0.22, usable*0.23]
            rows = [[u.get("nome","—"), u.get("email","—"),
                     u.get("senha","—"), u.get("permissao","—")]
                    for u in chat["usuarios"]]
            story.append(make_table(["Nome","E-mail","Senha","Permissão"], rows, cols))
            story.append(Spacer(1, 3 * mm))

        if chat.get("agentes"):
            story += mini_secao("🎧  Agentes do Chat")
            cols = [usable*0.4, usable*0.6]
            rows = [[a.get("nome","—"),
                     ", ".join(a.get("departamentos",[]))]
                    for a in chat["agentes"]]
            story.append(make_table(["Agente","Departamentos"], rows, cols))
            story.append(Spacer(1, 3 * mm))

        if chat.get("departamentos"):
            story += mini_secao("🏢  Departamentos")
            cols = [usable*0.4, usable*0.6]
            rows = [[d.get("nome","—"),
                     ", ".join(d.get("agentes",[]))]
                    for d in chat["departamentos"]]
            story.append(make_table(["Departamento","Agentes"], rows, cols))
            story.append(Spacer(1, 3 * mm))

    # ─── BUILD ──────────────────────────────────
    empresa_nome = cli.get("empresa", "")
    _logo = logo_path  # captura para o closure

    def make_canvas(filename, **kwargs):
        kwargs.pop("pagesize", None)
        return NumberedCanvas(filename, pagesize=A4,
                              empresa=empresa_nome,
                              logo_path=_logo)

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
                {"nome": "João Silva",   "email": "joao@era.com",   "senha": "Senha@12345",
                 "permissao": "Administrador do Módulo de PABX", "agente_callcenter": True},
                {"nome": "Maria Santos", "email": "maria@era.com",  "senha": "Senha@12345",
                 "permissao": "Agente",                           "agente_callcenter": True},
                {"nome": "Carlos Lima",  "email": "carlos@era.com", "senha": "Senha@12345",
                 "permissao": "Supervisor",                       "agente_callcenter": False},
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
                {"ramal": "1005", "senha": "Pass@1005"},
                {"ramal": "1006", "senha": "Pass@1006"},
            ],
            "agentes": [
                {"nome": "João Silva",   "ramal": "1001", "multiskill": True},
                {"nome": "Maria Santos", "ramal": "1002", "multiskill": False},
            ],
            "regras_tempo": [
                {"nome": "Horário Comercial",
                 "dias": ["Segunda","Terça","Quarta","Quinta","Sexta"],
                 "hora_inicio": "08:00", "hora_fim": "18:00"},
            ],
            "grupo_ring": [
                {"nome": "Suporte", "estrategia": "Simultânea", "ramais": ["1001","1002"]},
            ],
            "filas": [
                {"nome": "Atendimento Geral", "agentes": ["João Silva","Maria Santos"]},
            ],
            "uras": [
                {"nome": "URA Principal",
                 "mensagem": "Olá, seja bem-vindo à ERA Telecom!",
                 "opcoes": [
                     {"tecla": "1", "destino": "Atendimento Geral", "descricao": "Suporte"},
                     {"tecla": "2", "destino": "1003",              "descricao": "Financeiro"},
                 ]}
            ],
            "pausas": [
                {"grupo": "Pausas Operacionais", "itens": [
                    {"nome": "Almoço",      "tempo": "60 min"},
                    {"nome": "Banheiro",    "tempo": "10 min"},
                    {"nome": "Treinamento", "tempo": "30 min"},
                ]}
            ],
            "pesquisas": [
                {"nome": "Pesquisa de Atendimento",
                 "introducao": "Sua opinião é muito importante.",
                 "pergunta":   "De 0 a 5, como avalia nosso atendimento?",
                 "encerramento": "Obrigado por participar!",
                 "respostas": [
                     {"nota": 0, "descricao": "Péssimo"},
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
            "api":  "Meta",
            "conta": "cliente",
            "canais": ["whatsapp","instagram","messenger"],
            "usuarios": [
                {"nome": "Ana Chat", "email": "ana@era.com",
                 "senha": "Senha@12345", "permissao": "Agente Omnichannel"},
            ],
            "agentes": [
                {"nome": "Ana Chat", "departamentos": ["Suporte Digital"]},
            ],
            "departamentos": [
                {"nome": "Suporte Digital", "agentes": ["Ana Chat"]},
            ],
        }
    }

    # ── Ajuste o caminho da logo conforme seu ambiente ──
    # Se a imagem estiver na pasta assets ao lado deste script:
    import os as _os
    _script_dir = _os.path.dirname(_os.path.abspath(__file__))
    _logo = _os.path.join(_script_dir, "assets", "image.png")

    gerar_pdf(
        dados_exemplo,
        "/mnt/user-data/outputs/caderno-parametros.pdf",
        logo_path=_logo if _os.path.isfile(_logo) else None
    )
