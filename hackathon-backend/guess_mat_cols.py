from supabase import create_client
import json

SUPABASE_URL = "https://bvgldfaxakvodhrnheyq.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2Z2xkZmF4YWt2b2Rocm5oZXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTI4NDIsImV4cCI6MjA4NDI2ODg0Mn0.iBa6qkONJ0Bm7vspCoVGb9Evri6f-gvWZW6YX8f4SIM"

client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

def check_field(f):
    try:
        res = client.table("material_requests").insert({f: "Test"}).execute()
        return "FOUND"
    except Exception as e:
        msg = str(e)
        if "Could not find the" in msg:
            return "MISSING"
        return "ERROR"

fields = ["requested_by", "Requested_by", "Submitted_By", "supervisor_id", "user_id", "created_by"]
results = {f: check_field(f) for f in fields}
print(json.dumps(results, indent=2))
