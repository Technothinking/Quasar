from fastapi import FastAPI
from app.api.v1.routes_projects import router as project_router
from app.api.v1.routes_milestone import router as milestone_router
from app.api.v1.routes_dpr import router as dpr_router
from app.api.v1.routes_ra_bill import router as ra_bill_router
from app.api.v1.routes_gst_invoice import router as gst_invoice_router
from app.api.v1.routes_gst_invoice_owner import router as gst_invoice_owner_router
from app.api.v1.routes_ra_bill_owner import router as ra_bill_owner_router



app = FastAPI(title="ConstructPro Backend")

app.include_router(project_router)
app.include_router(milestone_router)
app.include_router(dpr_router)
app.include_router(ra_bill_router)
app.include_router(gst_invoice_router)
app.include_router(gst_invoice_owner_router)
app.include_router(ra_bill_owner_router)




@app.get("/")
def health():
    return {"status": "ok"}
