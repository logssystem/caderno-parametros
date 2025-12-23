from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def health():
    return {"status": "ok"}

@app.post("/explorar")
def explorar(payload: dict):
    return {
        "status": "ok",
        "recebido": payload
    }
