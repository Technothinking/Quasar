from fastapi import FastAPI
from sqlalchemy import text

from app.db.session import engine

# Routers
from app.api.v1.routes_auth import router as auth_router
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

# -----------------------
# Startup: DB health check
# -----------------------
@app.on_event("startup")
def test_db_connection():
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        print("✅ Database connected successfully")
    except Exception as e:
        print("❌ Database connection failed")
        print(e)
        raise e

# -----------------------
# Routes
# -----------------------
app.include_router(auth_router)
app.include_router(project_router)
app.include_router(milestone_router)
app.include_router(dpr_router)
app.include_router(stocks_router)
app.include_router(material_request_router)
app.include_router(task_router)
app.include_router(attendance_router)
app.include_router(project_site_router)
app.include_router(image_router)

# -----------------------
# Health check
# -----------------------
@app.get("/")
def root():
    return {"status": "ConstructPro backend running"}
