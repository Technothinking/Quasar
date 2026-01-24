from supabase import create_client
import json

SUPABASE_URL = "https://bvgldfaxakvodhrnheyq.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2Z2xkZmF4YWt2b2Rocm5oZXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTI4NDIsImV4cCI6MjA4NDI2ODg0Mn0.iBa6qkONJ0Bm7vspCoVGb9Evri6f-gvWZW6YX8f4SIM"

client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

def check_field(f):
    try:
        # We need a record that doesn't fail on other NOT NULL constraints if possible.
        # From project.py we know material_name, unit, quantity_requested are likely required.
        res = client.table("material_requests").insert({
            f: "TestVal",
            "material_name": "Test",
            "unit": "Test",
            "quantity_requested": 1.0,
            "project_id": 1
        }).execute()
        return "FOUND"
    except Exception as e:
        if "Could not find the" in str(e):
            return "MISSING"
        return f"ERROR: {str(e)[:100]}"

candidates = [
    "submitted_by", "requested_by", "supervisor", "supervisor_name", 
    "user_id", "created_by", "full_name", "Project_name", "project_name"
]

results = {c: check_field(c) for c in candidates}
with open("mat_col_audit.json", "w") as f:
    json.dump(results, f, indent=2)
