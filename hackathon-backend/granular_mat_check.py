from supabase import create_client
import json

SUPABASE_URL = "https://bvgldfaxakvodhrnheyq.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2Z2xkZmF4YWt2b2Rocm5oZXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTI4NDIsImV4cCI6MjA4NDI2ODg0Mn0.iBa6qkONJ0Bm7vspCoVGb9Evri6f-gvWZW6YX8f4SIM"

client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

def check_field(f):
    try:
        # Minimum record that might work? Assuming project_id is basic.
        res = client.table("material_requests").insert({f: "Test" if "id" not in f else 1}).execute()
        return "FOUND"
    except Exception as e:
        msg = str(e)
        if "Could not find the" in msg:
            return "MISSING"
        return f"ERROR: {msg[:50]}"

fields = [
    "project_id", "Project_id", "Project_ID",
    "project_name", "Project_name", "Project_Name",
    "material_name", "Material_name", "Material_Name",
    "unit", "Unit",
    "quantity_requested", "Quantity_requested", "Quantity_Requested",
    "submitted_by", "Submitted_by", "Supervisor_name",
    "status", "Status"
]

results = {f: check_field(f) for f in fields}

with open("granular_mat_check.json", "w") as f:
    json.dump(results, f, indent=2)
