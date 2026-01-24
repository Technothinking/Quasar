import sys
import os
import requests
from dotenv import load_dotenv

# Add the current directory to sys.path to ensure we can import from app
sys.path.append(os.getcwd())

# Load environment variables
load_dotenv()

try:
    from app.core.security import verify_supabase_jwt
    from app.core.config import settings
    from jose import jwt
except ImportError as e:
    print(f"Error importing app modules or jose: {e}")
    print("Make sure you are running this script from the 'hackathon-backend' directory.")
    sys.exit(1)

def test_auth_flow():
    print("--- Starting Auth Flow Verification ---")

    # 1. Credentials (using the ones from test_auth.py if not in env, or prompting/hardcoded for test)
    # Using the hardcoded ones from the user's test_auth.py for consistency in checking their setup
    email = "supervisor@test.com"
    password = "supervisor123"
    
    print(f"1. Attempting login for user: {email}")
    
    # 2. Login via Supabase REST API
    # We use the Anon key for the client-side interaction simulation
    supabase_url = settings.SUPABASE_URL
    supabase_anon_key = settings.SUPABASE_ANON_KEY
    
    if not supabase_url or not supabase_anon_key:
        print("[ERROR] Missing SUPABASE_URL or SUPABASE_ANON_KEY in environment/config.")
        return

    auth_url = f"{supabase_url}/auth/v1/token?grant_type=password"
    headers = {
        "apikey": supabase_anon_key,
        "Content-Type": "application/json"
    }
    payload = {
        "email": email,
        "password": password
    }

    try:
        response = requests.post(auth_url, headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()
        access_token = data.get("access_token")
        
        if not access_token:
            print("[ERROR] Login failed: No access_token received.")
            print(data)
            return
            
        print("[OK] Login successful. Token received.")
        
    except requests.exceptions.RequestException as e:
        print(f"[ERROR] Login request failed: {e}")
        if hasattr(e, 'response') and e.response is not None:
             print(f"Response: {e.response.text}")
        return

    # 3. Verify Token using Backend Logic
    print("\n2. Verifying token using backend logic (app.core.security.verify_supabase_jwt)...")
    
    try:
        # Check if secret is set
        if not settings.SUPABASE_JWT_SECRET:
             print("[ERROR] SUPABASE_JWT_SECRET is missing in config.")
             return

        # DEBUG: Print header
        try:
            header = jwt.get_unverified_header(access_token)
            print(f"[DEBUG] Token Header: {header}")
        except Exception as header_error:
             print(f"[DEBUG] Failed to get header: {header_error}")
             header = {}

        decoded_payload = verify_supabase_jwt(access_token)
        print("[OK] Token verification successful!")
        print("Decoded Payload (partial):")
        print(f"  User ID: {decoded_payload.get('sub')}")
        print(f"  Role: {decoded_payload.get('role')}")
        print(f"  Exp: {decoded_payload.get('exp')}")
        
    except Exception as e:
        print(f"[ERROR] Token verification failed: {e}")
        # Help debug if signature failed - maybe secret mismatch
        print("\nTroubleshooting Tips:")
        print("- Check if SUPABASE_JWT_SECRET in .env matches the Supabase project JWT secret.")
        print("- Ensure the algorithm is HS256 (default for Supabase).")

if __name__ == "__main__":
    test_auth_flow()
