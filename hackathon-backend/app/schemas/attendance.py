from pydantic import BaseModel
from typing import Optional


class CheckInOut(BaseModel):
    project_id: int
    latitude: float
    longitude: float


class SupervisorMarkAttendance(BaseModel):
    project_id: int
    user_id: str
    role: str   # worker / supervisor
    status: str # present / absent
