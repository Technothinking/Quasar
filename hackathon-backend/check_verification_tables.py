from supabase import create_client
import json

SUPABASE_URL = "https://bvgldfaxakvodhrnheyq.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2Z2xkZmF4YWt2b2Rocm5oZXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTI4NDIsImV4cCI6MjA4NDI2ODg0Mn0.iBa6qkONJ0Bm7vspCoVGb9Evri6f-gvWZW6YX8f4SIM"

client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

def check_table(name):
    try:
        res = client.table(name).select("*").limit(1).execute()
        return {"exists": True, "columns": list(res.data[0].keys()) if res.data else "EMPTY"}
    except Exception as e:
        return {"exists": False, "error": str(e)}

search_names = ["stock_verification", "stocks_verification", "material_verification", "stock_approval"]
results = {}

for name in search_names:
    results[name] = check_table(name)

print(json.dumps(results, indent=2))
