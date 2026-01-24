from supabase import create_client
import json

SUPABASE_URL = "https://bvgldfaxakvodhrnheyq.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2Z2xkZmF4YWt2b2Rocm5oZXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTI4NDIsImV4cCI6MjA4NDI2ODg0Mn0.iBa6qkONJ0Bm7vspCoVGb9Evri6f-gvWZW6YX8f4SIM"

client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

def test_cols(table_name, record):
    print(f"Testing {table_name} with {record.keys()}")
    try:
        res = client.table(table_name).insert(record).execute()
        print("Success!")
    except Exception as e:
        print(f"Fail: {e}")

# Case 1: Project_name (user suggested)
test_cols("material_requests", {
    "project_id": 1,
    "Project_name": "Project A",
    "material_name": "Cement",
    "unit": "Bags",
    "quantity_requested": 10,
    "submitted_by": "Test Supervisor",
    "status": "pending"
})

# Case 2: project_name (standard)
test_cols("material_requests", {
    "project_id": 1,
    "project_name": "Project A",
    "material_name": "Cement",
    "unit": "Bags",
    "quantity_requested": 10,
    "submitted_by": "Test Supervisor",
    "status": "pending"
})
