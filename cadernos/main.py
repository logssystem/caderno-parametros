from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from cadernos.explorer import detectar_conexoes

# 1️⃣ cria a aplicação
app = FastAPI()

# 2️⃣ habilita CORS (GitHub Pages, testes, etc)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3️⃣ endpoint principal
@app.post("/explorar")
def explorar(payload: dict):
    dados = payload.get("dados", {})

    blocos = []
    for bloco_id, bloco in dados.items():
        blocos.append({
            "id": bloco_id,
            "tipo": bloco.get("tipo"),
            "conteudo": {k: v for k, v in bloco.items() if k != "tipo"}
        })

    conexoes = detectar_conexoes(dados)

    return {
        "status": "ok",
        "total_blocos": len(blocos),
        "blocos": blocos,
        "conexoes": conexoes
    }
