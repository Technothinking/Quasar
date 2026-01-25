from supabase import create_client
import json

SUPABASE_URL = "https://bvgldfaxakvodhrnheyq.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2Z2xkZmF4YWt2b2Rocm5oZXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTI4NDIsImV4cCI6MjA4NDI2ODg0Mn0.iBa6qkONJ0Bm7vspCoVGb9Evri6f-gvWZW6YX8f4SIM"

client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

try:
    # Try an insert with minimal fields to see what comes back or what errors out
    # We'll use field "material_name" as a guess
    res = client.table("stock_update").insert({
        "material_name": "PROBE",
        "unit": "UNIT",
        "current_qty": 0,
        "project_id": 1
    }).execute()
    
    if res.data:
        print(f"Columns: {list(res.data[0].keys())}")
        # Clean up
        client.table("stock_update").delete().eq("id", res.data[0]["id"]).execute()
except Exception as e:
    print(f"Error: {e}")
