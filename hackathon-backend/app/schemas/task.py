from pydantic import BaseModel
from typing import Optional


class TaskCreate(BaseModel):
    project_id: int
    task_description: str
    assigned_to: Optional[str] = "supervisor"


class TaskStatusUpdate(BaseModel):
    status: str   # pending | in_progress | completed


class TaskResponse(BaseModel):
    id: int
    project_id: int
    task_description: str
    assigned_to: str
    status: str

    class Config:
        from_attributes = True
