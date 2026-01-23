from pydantic import BaseModel


class MilestoneCreate(BaseModel):
    project_id: int
    name: str


class MilestoneResponse(BaseModel):
    id: int
    project_id: int
    name: str

    class Config:
        from_attributes = True
