from supabase import create_client
import json

SUPABASE_URL = "https://bvgldfaxakvodhrnheyq.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2Z2xkZmF4YWt2b2Rocm5oZXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTI4NDIsImV4cCI6MjA4NDI2ODg0Mn0.iBa6qkONJ0Bm7vspCoVGb9Evri6f-gvWZW6YX8f4SIM"

client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

def check_profiles():
    print("--- Checking profiles structure ---")
    try:
        # Try specific table variations
        for t in ["profiles", "user_profiles"]:
            try:
                res = client.table(t).select("*").limit(1).execute()
                print(f"Table {t} Keys:", list(res.data[0].keys()) if res.data else "Table is empty")
                if res.data:
                    print(f"Sample Row: {res.data[0]}")
            except Exception as e:
                print(f"Table {t} could not be read: {e}")
    except Exception as e:
        print(f"Error checking profiles: {e}")

check_profiles()
