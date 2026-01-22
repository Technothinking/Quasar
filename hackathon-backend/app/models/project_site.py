from sqlalchemy import Column, Integer, Float, ForeignKey
from app.db.base import Base


class ProjectSite(Base):
    __tablename__ = "project_sites"

    id = Column(Integer, primary_key=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), unique=True)

    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    radius_meters = Column(Integer, nullable=False)
