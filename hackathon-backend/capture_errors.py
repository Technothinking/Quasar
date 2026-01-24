from supabase import create_client
import json

SUPABASE_URL = "https://bvgldfaxakvodhrnheyq.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2Z2xkZmF4YWt2b2Rocm5oZXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTI4NDIsImV4cCI6MjA4NDI2ODg0Mn0.iBa6qkONJ0Bm7vspCoVGb9Evri6f-gvWZW6YX8f4SIM"

client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

results = []

def test_field(field_name, value):
    try:
        record = {
            "project_id": 1,
            "date": "2024-01-25",
            "active_stage": "Excavation",
            "work_status": "Work Completed",
            "issues": "None" if field_name != "issues" else value
        }
        record[field_name] = value
        res = client.table("daily_dprs").insert(record).execute()
        results.append({"field": field_name, "value": value, "status": "SUCCESS"})
    except Exception as e:
        results.append({"field": field_name, "value": value, "status": "FAIL", "error": str(e)})

test_field("active_stage", "Excavation")
test_field("active_stage", "excavation")
test_field("work_status", "Work Completed")
test_field("work_status", "completed")
test_field("issues", "Material")
test_field("issues", ["Material"])
test_field("issues", "{Material}")

with open("test_results.json", "w") as f:
    json.dump(results, f, indent=2)
