from datetime import date
from pydantic import BaseModel


class ProjectCreate(BaseModel):
    name: str
    location: str
    start_date: date
    expected_end_date: date | None = None


class ProjectResponse(BaseModel):
    id: int
    name: str
    location: str
    start_date: date
    expected_end_date: date | None

    class Config:
        from_attributes = True
