from app.db.session import engine
from app.db.base import Base

# IMPORTANT: import all models here
from app.models.project import Project
from app.models.project_milestone import ProjectMilestone
from app.models.dpr import DPR
from app.models.ra_bill import RABill
from app.models.gst_invoice import GSTInvoice


def init_db():
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    init_db()
