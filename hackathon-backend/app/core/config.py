from dotenv import load_dotenv
import os

load_dotenv()

class Settings:
    DATABASE_URL = os.getenv(
        "DATABASE_URL",
        "sqlite:///./local_dev.db"   # ✅ fallback
    )
    SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET", "dummy-secret")

settings = Settings()


