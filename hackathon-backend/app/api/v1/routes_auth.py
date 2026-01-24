from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.api.deps_auth import get_current_user
from app.db.session import get_db
from app.models.user import UserProjectRole, Role
from app.core import supabase

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str
    role_id: int

@router.post("/auth/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    # 1. Authenticate with Supabase
    try:
        # Check if supabase client exposes auth attribute directly or via specific method
        # Usually: supabase.auth.sign_in_with_password({...})
        # Note: app.core.supabase.supabase is the client instance
        
        res = supabase.supabase.auth.sign_in_with_password({
            "email": request.email, 
            "password": request.password
        })
        
        # Supabase returns a session object in res.session or user in res.user
        # The structure usually has session.access_token or just access_token in data
        if not res.session:
             raise Exception("No session returned")
             
        user_id = res.user.id
        access_token = res.session.access_token
        
    except Exception as e:
        print(f"Supabase Auth Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid credentials"
        )

    # 2. Verify Role Assignment
    # Check if this user has the requested role in ANY project? 
    # Or do we just check if they possess the role at all? 
    # The requirement: "fetch the users from that role from supabase table... verify if the user belongs to that particular role"
    # We will check if there is ANY entry in UserProjectRole for this user_id and role_id.
    
    # Special Case: Owner (Role ID 1) might not be in UserProjectRole if they own everything?
    # For now, assume explicit assignment for all roles as per user description.
    
    role_assignment = db.query(UserProjectRole).filter(
        UserProjectRole.user_id == user_id,
        UserProjectRole.role_id == request.role_id
    ).first()

    if not role_assignment:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is not authorized for this role"
        )

    # 3. Return Token and User Info
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "email": request.email,
            "role_id": request.role_id
        }
    }

@router.get("/auth/me")
def auth_me(user = Depends(get_current_user)):
    return {
        "id": user["sub"],
        "email": user["email"],
        "role": user["role"]
    }
