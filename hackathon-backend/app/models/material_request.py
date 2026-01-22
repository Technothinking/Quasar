from sqlalchemy import Column, Integer, Float, Text, ForeignKey, TIMESTAMP
from sqlalchemy.sql import func
from app.db.base import Base


class MaterialRequest(Base):
    __tablename__ = "material_requests"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"))

    material_name = Column(Text, nullable=False)
    unit = Column(Text, nullable=False)
    quantity_requested = Column(Float, nullable=False)

    status = Column(Text, default="pending")

    created_at = Column(TIMESTAMP, server_default=func.now())
