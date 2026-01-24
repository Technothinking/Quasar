from jose import jwt, JWTError
from app.core.config import settings

def verify_supabase_jwt(token: str):
    try:
        payload = jwt.decode(
            token,
            settings.SUPABASE_JWT_SECRET,
            algorithms=["HS256"],              # Supabase default
            audience="authenticated",
            issuer=f"{settings.SUPABASE_URL}/auth/v1"
        )
        return payload
    except JWTError as e:
        print("JWT ERROR:", e)
        raise e
