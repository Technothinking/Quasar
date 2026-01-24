from supabase import create_client
import json

SUPABASE_URL = "https://bvgldfaxakvodhrnheyq.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2Z2xkZmF4YWt2b2Rocm5oZXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTI4NDIsImV4cCI6MjA4NDI2ODg0Mn0.iBa6qkONJ0Bm7vspCoVGb9Evri6f-gvWZW6YX8f4SIM"

client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

try:
    # We need to find a way to get columns if it's empty.
    # Usually select('*').limit(1) returns empty list if empty.
    # Let's try to insert a dummy row if possible to see error or columns?
    # Or just select and check if there's any data at all in the system.
    res = client.table("material_requests").select("*").limit(1).execute()
    cols = []
    if res.data:
        cols = list(res.data[0].keys())
    
    with open("mat_req_cols.json", "w") as f:
        json.dump({"columns": cols, "table": "material_requests", "empty": len(res.data) == 0}, f)
except Exception as e:
    with open("mat_req_cols.json", "w") as f:
        json.dump({"error": str(e)}, f)
