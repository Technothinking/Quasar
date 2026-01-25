from supabase import create_client

SUPABASE_URL = "https://bvgldfaxakvodhrnheyq.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2Z2xkZmF4YWt2b2Rocm5oZXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTI4NDIsImV4cCI6MjA4NDI2ODg0Mn0.iBa6qkONJ0Bm7vspCoVGb9Evri6f-gvWZW6YX8f4SIM"

client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

table = "stock_verification"
# Common columns
cols = ["id", "project_id", "material_name", "on_time", "is_proper", "is_approved", "created_at", "verified_by"]

for c in cols:
    try:
        client.table(table).select(c).limit(1).execute()
        print(f"COL [{c}] EXISTS")
    except Exception as e:
        msg = str(e)
        if "Could not find" in msg:
            print(f"COL [{c}] MISSING")
        else:
            print(f"ERROR on {c}: {msg[:50]}")
