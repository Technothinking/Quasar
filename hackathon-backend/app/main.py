from fastapi import FastAPI
from app.api.v1.routes_projects import router as project_router
from app.api.v1.routes_milestone import router as milestone_router
from app.api.v1.routes_dpr import router as dpr_router
from app.api.v1.routes_stock import router as stocks_router
from app.api.v1.routes_material_request import router as material_request_router
from app.api.v1.routes_task import router as task_router
from app.api.v1.routes_attendance import router as attendance_router
from app.api.v1.routes_project_site import router as project_site_router
from app.api.v1.routes_image import router as image_router

app = FastAPI(title="ConstructPro Backend")

app.include_router(project_router)
app.include_router(milestone_router)
app.include_router(dpr_router)
app.include_router(stocks_router)
app.include_router(material_request_router)
app.include_router(task_router)
app.include_router(attendance_router)
app.include_router(project_site_router)
app.include_router(image_router)

@app.get("/")
def health():
    return {"status": "ok"}
