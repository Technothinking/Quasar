from sqlalchemy import Column, Integer, Float, Text, ForeignKey, TIMESTAMP, UniqueConstraint
from sqlalchemy.sql import func
from app.db.base import Base


class MaterialStock(Base):
    __tablename__ = "material_stocks"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"))
    material_name = Column(Text, nullable=False)
    unit = Column(Text, nullable=False)
    current_quantity = Column(Float, nullable=False)

    last_updated = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    __table_args__ = (
        UniqueConstraint("project_id", "material_name", name="unique_material_per_project"),
    )
