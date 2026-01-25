from supabase import create_client
import json

SUPABASE_URL = "https://bvgldfaxakvodhrnheyq.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2Z2xkZmF4YWt2b2Rocm5oZXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTI4NDIsImV4cCI6MjA4NDI2ODg0Mn0.iBa6qkONJ0Bm7vspCoVGb9Evri6f-gvWZW6YX8f4SIM"

client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

# Try to insert a dummy record with only material_name and project_id
# Supabase will return the inserted row including all columns if it succeeds
try:
    res = client.table("stock_verification").insert({
        "project_id": 1,
        "material_name": "PROBE_COLUMNS"
    }).execute()
    
    if res.data:
        print("SUCCESS! Columns found:", list(res.data[0].keys()))
        print("Full object:", json.dumps(res.data[0], indent=2))
        # Delete it immediately
        client.table("stock_verification").delete().eq("id", res.data[0]["id"]).execute()
    else:
        print("Insert succeeded but returned no data.")
except Exception as e:
    err_str = str(e)
    # Often error messages like "null value in column 'X' violates not-null constraint" reveal missing column names
    print(f"Error during probe: {err_str}")
