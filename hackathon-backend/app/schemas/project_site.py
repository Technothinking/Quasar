from pydantic import BaseModel

class ProjectSiteCreate(BaseModel):
    project_id: int
    latitude: float
    longitude: float
    radius_meters: int
