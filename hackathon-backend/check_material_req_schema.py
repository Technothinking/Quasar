from supabase import create_client
import json

SUPABASE_URL = "https://bvgldfaxakvodhrnheyq.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2Z2xkZmF4YWt2b2Rocm5oZXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTI4NDIsImV4cCI6MjA4NDI2ODg0Mn0.iBa6qkONJ0Bm7vspCoVGb9Evri6f-gvWZW6YX8f4SIM"

client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

def check_material_requests():
    print("--- Checking material_requests schema ---")
    try:
        res = client.table("material_requests").select("*").limit(1).execute()
        if res.data:
            print("Columns:", list(res.data[0].keys()))
            print("Sample Data:", res.data[0])
        else:
            print("Table is empty.")
    except Exception as e:
        print(f"Error: {e}")

check_material_requests()
