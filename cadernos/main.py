from fastapi.middleware.cors import CORSMiddleware
from cadernos.explorer import detectar_conexoes

@app.post("/explorar")
def explorar(payload: dict):
    dados = payload.get("dados", {})

    blocos = []
    for bloco_id, bloco in dados.items():
        blocos.append({
            "id": bloco_id,
            "tipo": bloco.get("tipo"),
            "dados": {k: v for k, v in bloco.items() if k != "tipo"}
        })

    conexoes = detectar_conexoes(dados)

    return {
        "status": "ok",
        "total_blocos": len(blocos),
        "blocos": blocos,
        "conexoes": conexoes
    }
