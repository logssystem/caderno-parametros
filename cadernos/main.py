from fastapi import FastAPI
from pydantic import BaseModel
from typing import Dict, Any, List

app = FastAPI()

class Caderno(BaseModel):
    dados: Dict[str, Any]

@app.post("/explorar")
def explorar(caderno: Caderno):
    blocos = []
    conexoes = []

    for nome_bloco, conteudo in caderno.dados.items():
        blocos.append({
            "id": nome_bloco,
            "tipo": nome_bloco,
            "conteudo": conteudo
        })

    return {
        "status": "ok",
        "total_blocos": len(blocos),
        "blocos": blocos,
        "conexoes": conexoes
    }
