from fastapi import FastAPI
from app.api.v1.routes_projects import router as project_router
from app.api.v1.routes_milestone import router as milestone_router
from app.api.v1.routes_dpr import router as dpr_router

app = FastAPI(title="ConstructPro Backend")

app.include_router(project_router)
app.include_router(milestone_router)
app.include_router(dpr_router)

@app.get("/")
def health():
    return {"status": "ok"}
