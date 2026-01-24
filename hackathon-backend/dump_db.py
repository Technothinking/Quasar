from supabase import create_client
import json

SUPABASE_URL = "https://bvgldfaxakvodhrnheyq.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2Z2xkZmF4YWt2b2Rocm5oZXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTI4NDIsImV4cCI6MjA4NDI2ODg0Mn0.iBa6qkONJ0Bm7vspCoVGb9Evri6f-gvWZW6YX8f4SIM"

client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

print("--- Dumping User_Profile ---")
try:
    res = client.table("User_Profile").select("*").execute()
    print(f"Count: {len(res.data)}")
    print(json.dumps(res.data, indent=2))
except Exception as e:
    print("Error User_Profile:", e)

print("\n--- Dumping project_user_roles ---")
try:
    res = client.table("project_user_roles").select("*").execute()
    print(f"Count: {len(res.data)}")
    print(json.dumps(res.data, indent=2))
except Exception as e:
    print("Error project_user_roles:", e)
