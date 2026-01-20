from sqlalchemy import (
    Column, Integer, Date, ForeignKey, DateTime,
    UniqueConstraint, Enum, String
)
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.sql import func

from app.db.base import Base
from app.models.enums import ActiveStage, WorkStatus, IssueType


class DPR(Base):
    __tablename__ = "daily_dprs"

    id = Column(Integer, primary_key=True)

    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    milestone_id = Column(Integer, ForeignKey("project_milestones.id"), nullable=False)

    date = Column(Date, nullable=False)

    # 🔹 Active Stage (single choice)
    active_stage = Column(
        Enum(ActiveStage, name="active_stage_enum"),
        nullable=False
    )

    # 🔹 Work Status (single choice)
    work_status = Column(
        Enum(WorkStatus, name="work_status_enum"),
        nullable=False
    )

    # 🔹 Issues (multi-select)
    issues = Column(
        ARRAY(Enum(IssueType, name="issue_type_enum")),
        nullable=True
    )

    # 🔹 Optional note (1–2 lines)
    issue_note = Column(String(255))

    submitted_by = Column(String, nullable=False)
    submitted_at = Column(DateTime, server_default=func.now())

    __table_args__ = (
        UniqueConstraint("project_id", "date", name="unique_dpr_per_project_per_day"),
    )
