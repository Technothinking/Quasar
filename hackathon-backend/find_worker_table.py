from supabase import create_client
import json

SUPABASE_URL = "https://bvgldfaxakvodhrnheyq.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2Z2xkZmF4YWt2b2Rocm5oZXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTI4NDIsImV4cCI6MjA4NDI2ODg0Mn0.iBa6qkONJ0Bm7vspCoVGb9Evri6f-gvWZW6YX8f4SIM"

client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

# Try different table names
table_names = ["worker_task", "worker_tasks", "Worker_task", "Worker_tasks"]

for table_name in table_names:
    try:
        print(f"\n=== Trying table: {table_name} ===")
        res = client.table(table_name).select("*").limit(1).execute()
        if res.data:
            print(f"✓ Table exists! Columns: {list(res.data[0].keys())}")
            print(f"Sample: {json.dumps(res.data[0], indent=2)}")
        else:
            print(f"✓ Table exists but is empty")
    except Exception as e:
        error_msg = str(e)
        if "does not exist" in error_msg or "Could not find" in error_msg:
            print(f"✗ Table does not exist")
        else:
            print(f"Error: {error_msg[:100]}")
