from sqlalchemy import Column, Integer, Text, Date, ForeignKey, TIMESTAMP, UniqueConstraint
from sqlalchemy.sql import func
from app.db.base import Base


class Attendance(Base):
    __tablename__ = "attendances"

    id = Column(Integer, primary_key=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"))

    user_id = Column(Text, nullable=False)
    role = Column(Text, nullable=False)

    date = Column(Date, nullable=False)

    check_in_time = Column(TIMESTAMP)
    check_out_time = Column(TIMESTAMP)

    method = Column(Text, nullable=False)  # self / supervisor
    status = Column(Text, default="present")

    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, onupdate=func.now())

    __table_args__ = (
        UniqueConstraint("project_id", "user_id", "date", name="unique_daily_attendance"),
    )
