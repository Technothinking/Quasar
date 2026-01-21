from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectResponse

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.post("/", response_model=ProjectResponse)
def create_project(
    project_in: ProjectCreate,
    db: Session = Depends(get_db),
):
    user_id = "user_123"  # TEMP (Supabase later)

    project = Project(
        name=project_in.name,
        location=project_in.location,
        start_date=project_in.start_date,
        expected_end_date=project_in.expected_end_date,
        owner_id=user_id,
    )

    db.add(project)
    db.commit()
    db.refresh(project)
    return project

@router.get("/", response_model=list[ProjectResponse])
def list_projects(db: Session = Depends(get_db)):
    user_id = "user_123"

    return db.query(Project).filter(
        Project.owner_id == user_id
    ).all()
