from sqlalchemy import Column, Integer, String, ForeignKey
from app.db.base import Base

class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)

class UserProjectRole(Base):
    __tablename__ = "user_project_roles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, nullable=False, index=True)  # Supabase UUID
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    role_id = Column(Integer, ForeignKey("roles.id"), nullable=False)
