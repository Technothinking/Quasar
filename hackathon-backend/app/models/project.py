from sqlalchemy import Column, Integer, String, Date, DateTime
from sqlalchemy.sql import func
from app.db.base import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    location = Column(String)
    
    start_date = Column(Date, nullable=False)
    expected_end_date = Column(Date)

    owner_id = Column(String, nullable=False)  # Supabase user id

    created_at = Column(DateTime, server_default=func.now())
