import sys
import os

# Add the current directory to sys.path
sys.path.append(os.getcwd())

from app.db.session import engine
from app.db.base import Base
# Import all models to ensure they are registered with Base
from app.models.user import Role, UserProjectRole
from app.models.project import Project
# Add other models if needed

def init_tables():
    print("Creating database tables if they don't exist...")
    try:
        Base.metadata.create_all(bind=engine)
        print("[OK] Tables created/verified successfully.")
    except Exception as e:
        print(f"[ERROR] Error creating tables: {e}")

if __name__ == "__main__":
    init_tables()
