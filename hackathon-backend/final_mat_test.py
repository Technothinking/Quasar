from supabase import create_client
import json

SUPABASE_URL = "https://bvgldfaxakvodhrnheyq.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2Z2xkZmF4YWt2b2Rocm5oZXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTI4NDIsImV4cCI6MjA4NDI2ODg0Mn0.iBa6qkONJ0Bm7vspCoVGb9Evri6f-gvWZW6YX8f4SIM"

client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

cases = [
    {"project_id": 1, "Project_name": "Project A", "material_name": "Cement", "unit": "Bags", "quantity_requested": 10, "submitted_by": "Test", "status": "pending"},
    {"project_id": 1, "project_name": "Project A", "material_name": "Cement", "unit": "Bags", "quantity_requested": 10, "submitted_by": "Test", "status": "pending"}
]

final_results = []

for idx, c in enumerate(cases):
    try:
        res = client.table("material_requests").insert(c).execute()
        final_results.append({"case": idx, "status": "SUCCESS"})
    except Exception as e:
        final_results.append({"case": idx, "status": "FAIL", "error": str(e)})

with open("mat_check_final.json", "w") as f:
    json.dump(final_results, f, indent=2)
