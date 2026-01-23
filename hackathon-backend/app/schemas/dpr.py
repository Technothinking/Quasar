from datetime import date
from typing import List, Optional
from pydantic import BaseModel

from app.models.enums import ActiveStage, WorkStatus, IssueType


class DPRCreate(BaseModel):
    project_id: int
    milestone_id: int
    date: date

    active_stage: ActiveStage
    work_status: WorkStatus

    issues: Optional[List[IssueType]] = None
    issue_note: Optional[str] = None


class DPRResponse(BaseModel):
    id: int
    project_id: int
    milestone_id: int
    date: date

    active_stage: ActiveStage
    work_status: WorkStatus

    issues: Optional[List[IssueType]]
    issue_note: Optional[str]

    submitted_by: str

    class Config:
        from_attributes = True
