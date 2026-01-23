from app.db.session import engine
from app.db.base import Base

# IMPORTANT: import all models here
from app.models.project import Project
from app.models.project_milestone import ProjectMilestone
from app.models.dpr import DPR
from app.models.material_stock import MaterialStock
from app.models.material_request import MaterialRequest
from app.models.task import Task
from app.models.project_site import ProjectSite
from app.models.attendance import Attendance
from app.models.project_site import ProjectSite
from app.models.image import Image

def init_db():
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    init_db()
