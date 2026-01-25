from supabase import create_client
import json

SUPABASE_URL = "https://bvgldfaxakvodhrnheyq.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2Z2xkZmF4YWt2b2Rocm5oZXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTI4NDIsImV4cCI6MjA4NDI2ODg0Mn0.iBa6qkONJ0Bm7vspCoVGb9Evri6f-gvWZW6YX8f4SIM"

client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

try:
    # Use a dummy row that is likely to fail if there are constraints, but if it succeeds we get columns
    res = client.table("stock_verification").insert({"project_id": 1, "material_name": "PROBE"}).execute()
    if res.data:
        print(f"COLS: {list(res.data[0].keys())}")
        client.table("stock_verification").delete().eq("id", res.data[0]["id"]).execute()
except Exception as e:
    # If it fails, maybe we can see the expected columns in the error
    print(f"ERR: {e}")
