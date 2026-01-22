from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.models.project_site import ProjectSite
from app.schemas.project_site import ProjectSiteCreate

router = APIRouter(prefix="/project-site", tags=["Project Site"])

@router.post("/")
def create_or_update_site(payload: ProjectSiteCreate, db: Session = Depends(get_db)):
    site = db.query(ProjectSite).filter(
        ProjectSite.project_id == payload.project_id
    ).first()

    if site:
        site.latitude = payload.latitude
        site.longitude = payload.longitude
        site.radius_meters = payload.radius_meters
    else:
        site = ProjectSite(**payload.dict())
        db.add(site)

    db.commit()
    return {"message": "Project site configured"}
