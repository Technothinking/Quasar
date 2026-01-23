from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.db.base import Base

class Image(Base):
    __tablename__ = "images"

    id = Column(Integer, primary_key=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)

    entity_type = Column(String, nullable=False)
    entity_id = Column(Integer, nullable=False)

    image_url = Column(String, nullable=False)
    uploaded_by = Column(String, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
