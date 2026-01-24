from supabase import create_client

SUPABASE_URL = "https://bvgldfaxakvodhrnheyq.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2Z2xkZmF4YWt2b2Rocm5oZXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTI4NDIsImV4cCI6MjA4NDI2ODg0Mn0.iBa6qkONJ0Bm7vspCoVGb9Evri6f-gvWZW6YX8f4SIM"

client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

def test_field(field_name, value):
    print(f"Testing {field_name} with value: {value}")
    try:
        # Minimum valid record structure
        record = {
            "project_id": 1,
            "date": "2024-01-25",
            "active_stage": "Excavation",
            "work_status": "Work Completed",
            "issues": "None" if field_name != "issues" else value
        }
        # Override the specific field
        record[field_name] = value
        
        res = client.table("daily_dprs").insert(record).execute()
        print(f"  SUCCESS")
    except Exception as e:
        print(f"  FAIL: {e}")

print("--- Start Modular Test ---")
test_field("active_stage", "Excavation")
test_field("active_stage", "excavation")
test_field("work_status", "Work Completed")
test_field("work_status", "completed")
test_field("issues", "Material")
test_field("issues", ["Material"])
test_field("issues", "{Material}") # Postgres array syntax string
