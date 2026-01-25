from supabase import create_client
import json

SUPABASE_URL = "https://bvgldfaxakvodhrnheyq.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2Z2xkZmF4YWt2b2Rocm5oZXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTI4NDIsImV4cCI6MjA4NDI2ODg0Mn0.iBa6qkONJ0Bm7vspCoVGb9Evri6f-gvWZW6YX8f4SIM"

client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

def get_cols(table):
    try:
        res = client.table(table).select("*").limit(1).execute()
        return list(res.data[0].keys()) if res.data else "EMPTY"
    except Exception as e:
        return str(e)

print(f"material_requests: {get_cols('material_requests')}")
print(f"stock_verification: {get_cols('stock_verification')}")

try:
    buckets = client.storage.list_buckets()
    print("Buckets:", [b.name for b in buckets])
except Exception as e:
    print("Bucket check failed:", e)
