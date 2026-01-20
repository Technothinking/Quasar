from sqlalchemy import Column, Integer, String, ForeignKey
from app.db.base import Base

class ProjectMilestone(Base):
    __tablename__ = "project_milestones"

    id = Column(Integer, primary_key=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)

    name = Column(String, nullable=False)  # Slab, Brickwork, etc.
