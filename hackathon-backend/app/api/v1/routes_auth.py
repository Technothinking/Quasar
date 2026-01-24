from fastapi import APIRouter, Depends
from app.api.deps_auth import get_current_user

router = APIRouter()

@router.get("/auth/me")
def auth_me(user = Depends(get_current_user)):
    return {
        "id": user["sub"],
        "email": user["email"],
        "role": user["role"]
    }
