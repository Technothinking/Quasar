from supabase import create_client
import json

SUPABASE_URL = "https://bvgldfaxakvodhrnheyq.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2Z2xkZmF4YWt2b2Rocm5oZXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTI4NDIsImV4cCI6MjA4NDI2ODg0Mn0.iBa6qkONJ0Bm7vspCoVGb9Evri6f-gvWZW6YX8f4SIM"

client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

# Try varieties
tables = ["milestones", "milestone", "project_milestones", "projects"]

for t in tables:
    try:
        res = client.table(t).select("*").limit(2).execute()
        print(f"Table {t}: Found with {len(res.data)} rows.")
        if res.data:
            print(f"  First Row Keys: {list(res.data[0].keys())}")
            print(f"  Sample Data: {res.data[0]}")
    except Exception as e:
        print(f"Table {t}: Error: {e}")
