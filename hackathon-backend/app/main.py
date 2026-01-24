from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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

# CORS Configuration
# ------------------
# Required to allow the mobile app (running on a different IP/port) to access the backend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
        print("⚠️  WARNING: Database connection failed - server will start anyway")
        print(f"    Error: {e}")
        print("    The /auth/login endpoint will fail until DB connectivity is restored.")

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
