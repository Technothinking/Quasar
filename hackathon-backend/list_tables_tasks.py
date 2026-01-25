from supabase import create_client
import json

SUPABASE_URL = "https://bvgldfaxakvodhrnheyq.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2Z2xkZmF4YWt2b2Rocm5oZXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTI4NDIsImV4cCI6MjA4NDI2ODg0Mn0.iBa6qkONJ0Bm7vspCoVGb9Evri6f-gvWZW6YX8f4SIM"

client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

try:
    # Querying the database to list tables is tricky via client if not allowed by API.
    # But usually we can check profiles or other standard ones.
    # Let's try to query an RPC if defined, or just try common names.
    
    # We can try to see what's in the schema via a select on information_schema if enabled (usually not for anon).
    # Instead, let's look at the implementation history or common models.
    
    # User said: "the table naem is taska" in step 1449.
    # User said: "the table is named worker_ task" in step 1511. (Notice the space).
    
    names = ["taska", "worker_task", "worker_tasks", "tasks"]
    for n in names:
        try:
            res = client.table(n).select("*").limit(1).execute()
            print(f"Table {n} EXISTS. Columns: {list(res.data[0].keys()) if res.data else 'EMPTY'}")
        except Exception as e:
            print(f"Table {n} NOT FOUND or ERROR: {str(e)[:50]}")

except Exception as e:
    print(f"Error: {e}")
