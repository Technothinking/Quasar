import requests
from jose import jwt, JWTError
from app.core.config import settings

_JWKS_CACHE = None

def get_jwks():
    global _JWKS_CACHE
    if _JWKS_CACHE is None:
        try:
             url = f"{settings.SUPABASE_URL}/auth/v1/.well-known/jwks.json"
             _JWKS_CACHE = requests.get(url).json()
        except Exception as e:
             print(f"Failed to fetch JWKS: {e}")
             return None
    return _JWKS_CACHE

def verify_supabase_jwt(token: str):
    try:
        # Check header to determine algorithm
        header = jwt.get_unverified_header(token)
        alg = header.get("alg")

        if alg == "HS256":
            payload = jwt.decode(
                token,
                settings.SUPABASE_JWT_SECRET,
                algorithms=["HS256"],
                audience="authenticated",
                issuer=f"{settings.SUPABASE_URL}/auth/v1"
            )
            return payload
            
        elif alg == "ES256":
            jwks = get_jwks()
            if not jwks:
                raise JWTError("Could not fetch JWKS for ES256 verification")
                
            payload = jwt.decode(
                token,
                jwks,
                algorithms=["ES256"],
                audience="authenticated",
                issuer=f"{settings.SUPABASE_URL}/auth/v1"
            )
            return payload
            
        else:
            raise JWTError(f"Unsupported algorithm: {alg}")
            
    except JWTError as e:
        print("JWT ERROR:", e)
        raise e
