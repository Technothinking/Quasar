from supabase import create_client
import json

SUPABASE_URL = "https://bvgldfaxakvodhrnheyq.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2Z2xkZmF4YWt2b2Rocm5oZXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTI4NDIsImV4cCI6MjA4NDI2ODg0Mn0.iBa6qkONJ0Bm7vspCoVGb9Evri6f-gvWZW6YX8f4SIM"

client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

try:
    # Insert a dummy row with minimum required fields
    res = client.table("material_requests").insert({
        "material_name": "DUMMY_SCHEMA_CHECK",
        "unit": "DUMMY",
        "quantity_requested": 0.0,
        "project_id": 1,
        "status": "pending"
    }).execute()
    
    if res.data:
        cols = list(res.data[0].keys())
        with open("revealed_mat_cols.json", "w") as f:
            json.dump({"columns": cols, "data": res.data[0]}, f, indent=2)
    else:
        with open("revealed_mat_cols.json", "w") as f:
            json.dump({"error": "No data returned after insert"}, f, indent=2)
except Exception as e:
    with open("revealed_mat_cols.json", "w") as f:
        json.dump({"error": str(e)}, f, indent=2)
