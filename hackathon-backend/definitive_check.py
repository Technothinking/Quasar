from supabase import create_client
import json

SUPABASE_URL = "https://bvgldfaxakvodhrnheyq.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2Z2xkZmF4YWt2b2Rocm5oZXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTI4NDIsImV4cCI6MjA4NDI2ODg0Mn0.iBa6qkONJ0Bm7vspCoVGb9Evri6f-gvWZW6YX8f4SIM"

client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

def get_keys(table):
    try:
        # Try to select one row if exists
        res = client.table(table).select("*").limit(1).execute()
        if res.data:
            return list(res.data[0].keys())
        else:
            return "EMPTY"
    except Exception as e:
        return str(e)

tables = ["daily_dprs", "material_requests", "profiles", "projects"]
data = {t: get_keys(t) for t in tables}

print("JSON_START")
print(json.dumps(data, indent=2))
print("JSON_END")
