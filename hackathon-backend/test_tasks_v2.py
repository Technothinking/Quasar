from supabase import create_client
import json

SUPABASE_URL = "https://bvgldfaxakvodhrnheyq.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2Z2xkZmF4YWt2b2Rocm5oZXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTI4NDIsImV4cCI6MjA4NDI2ODg0Mn0.iBa6qkONJ0Bm7vspCoVGb9Evri6f-gvWZW6YX8f4SIM"

client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

# Try with task_description
try:
    res = client.table("tasks").insert({
        "project_id": 1,
        "task_description": "Test task",
        "assigned_to": "test-uuid",
        "status": "pending"
    }).execute()
    
    if res.data:
        print("SUCCESS! Columns:", list(res.data[0].keys()))
        print("\nFull data:", json.dumps(res.data[0], indent=2))
        
        # Delete the test record
        client.table("tasks").delete().eq("id", res.data[0]["id"]).execute()
        print("\nTest record deleted")
except Exception as e:
    print(f"Error: {e}")
