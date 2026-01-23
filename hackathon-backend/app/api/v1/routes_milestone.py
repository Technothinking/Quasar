from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.project_milestone import ProjectMilestone
from app.schemas.milestone import MilestoneCreate, MilestoneResponse

router = APIRouter(prefix="/milestones", tags=["Milestones"])

@router.post("/", response_model=MilestoneResponse)
def create_milestone(
    milestone_in: MilestoneCreate,
    db: Session = Depends(get_db),
):
    milestone = ProjectMilestone(
        project_id=milestone_in.project_id,
        name=milestone_in.name,
    )

    db.add(milestone)
    db.commit()
    db.refresh(milestone)
    return milestone

@router.get("/{project_id}", response_model=list[MilestoneResponse])
def list_milestones(
    project_id: int,
    db: Session = Depends(get_db),
):
    return db.query(ProjectMilestone).filter(
        ProjectMilestone.project_id == project_id
    ).all()
