from supabase import create_client

SUPABASE_URL = "https://bvgldfaxakvodhrnheyq.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2Z2xkZmF4YWt2b2Rocm5oZXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTI4NDIsImV4cCI6MjA4NDI2ODg0Mn0.iBa6qkONJ0Bm7vspCoVGb9Evri6f-gvWZW6YX8f4SIM"

client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

# Tables to check
tables = ["projects", "milestones", "project_milestones"]

for t in tables:
    try:
        res = client.table(t).select("*").limit(1).execute()
        if res.data:
            print(f"Table {t}: Columns: {res.data[0].keys()}")
        else:
            print(f"Table {t}: Is empty or exists but no rows.")
    except Exception as e:
        print(f"Table {t}: Error: {e}")
