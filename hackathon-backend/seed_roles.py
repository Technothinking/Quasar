import sys
import os
from sqlalchemy.orm import Session

# Add the current directory to sys.path
sys.path.append(os.getcwd())

from app.db.session import SessionLocal
from app.models.user import Role

def seed_roles():
    db = SessionLocal()
    try:
        roles = [
            {"id": 1, "name": "Owner"},
            {"id": 2, "name": "Manager"},
            {"id": 3, "name": "Supervisor"},
            {"id": 4, "name": "Worker"}
        ]
        
        print("Seeding roles...")
        for role_data in roles:
            # Check if role exists
            existing_role = db.query(Role).filter(Role.id == role_data["id"]).first()
            if not existing_role:
                new_role = Role(id=role_data["id"], name=role_data["name"])
                db.add(new_role)
                print(f"[+] Added Role: {role_data['name']}")
            else:
                print(f"[.] Role exists: {role_data['name']}")
        
        db.commit()
        print("[OK] Roles seeded successfully.")
        
    except Exception as e:
        print(f"[ERROR] Seeding failed: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_roles()
