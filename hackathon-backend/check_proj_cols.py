from supabase import create_client
import json

SUPABASE_URL = "https://bvgldfaxakvodhrnheyq.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2Z2xkZmF4YWt2b2Rocm5oZXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTI4NDIsImV4cCI6MjA4NDI2ODg0Mn0.iBa6qkONJ0Bm7vspCoVGb9Evri6f-gvWZW6YX8f4SIM"

client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

def check_field(f):
    try:
        # We use a select filter on a likely non-existent row to avoid data issues
        res = client.table("projects").select("*").eq(f, "NON_EXISTENT_VALUE").execute()
        return "FOUND"
    except Exception as e:
        msg = str(e)
        if "Could not find the" in msg:
            return "MISSING"
        return f"ERROR: {msg[:100]}"

fields = ["id", "ID", "name", "Project_name", "Project_Name"]
results = {f: check_field(f) for f in fields}
print(json.dumps(results, indent=2))
