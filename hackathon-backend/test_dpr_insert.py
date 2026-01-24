from supabase import create_client
import json

SUPABASE_URL = "https://bvgldfaxakvodhrnheyq.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2Z2xkZmF4YWt2b2Rocm5oZXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTI4NDIsImV4cCI6MjA4NDI2ODg0Mn0.iBa6qkONJ0Bm7vspCoVGb9Evri6f-gvWZW6YX8f4SIM"

client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

def check_col_types():
    print("--- Checking daily_dprs types ---")
    try:
        # Testing insertions to see what fails
        # 1. Test PascalCase (what I have now)
        res1 = client.table("daily_dprs").insert({
            "project_id": 1,
            "date": "2024-01-25",
            "active_stage": "Excavation",
            "work_status": "Work Completed",
            "issues": "Material"
        }).execute()
        print("PascalCase Success:", res1.data)
    except Exception as e:
        print("PascalCase Fail:", e)

    try:
        # 2. Test lowercase
        res2 = client.table("daily_dprs").insert({
            "project_id": 1,
            "date": "2024-01-25",
            "active_stage": "excavation",
            "work_status": "completed",
            "issues": ["material"]
        }).execute()
        print("Lowercase Success:", res2.data)
    except Exception as e:
        print("Lowercase Fail:", e)

check_col_types()
