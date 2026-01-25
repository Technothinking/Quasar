from supabase import create_client
import json

SUPABASE_URL = "https://bvgldfaxakvodhrnheyq.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2Z2xkZmF4YWt2b2Rocm5oZXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTI4NDIsImV4cCI6MjA4NDI2ODg0Mn0.iBa6qkONJ0Bm7vspCoVGb9Evri6f-gvWZW6YX8f4SIM"

client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

# Try to insert a minimal record to see what columns exist
try:
    res = client.table("tasks").insert({
        "project_id": 1,
        "assigned_to": "test",
        "status": "pending"
    }).execute()
    
    if res.data:
        print("SUCCESS! Columns:", list(res.data[0].keys()))
        print("\nData:", json.dumps(res.data[0], indent=2))
except Exception as e:
    error_str = str(e)
    print(f"Error: {error_str}")
    
    # Try to extract column info from error
    if "Could not find" in error_str:
        print("\nColumn doesn't exist in error message")
