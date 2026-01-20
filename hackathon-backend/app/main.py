from fastapi import FastAPI
from app.api.v1.routes_dpr import router as dpr_router

app = FastAPI(title="ConstructPro Backend")

app.include_router(dpr_router)

@app.get("/")
def health():
    return {"status": "ok"}
