from supabase import create_client

SUPABASE_URL = "https://bvgldfaxakvodhrnheyq.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2Z2xkZmF4YWt2b2Rocm5oZXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTI4NDIsImV4cCI6MjA4NDI2ODg0Mn0.iBa6qkONJ0Bm7vspCoVGb9Evri6f-gvWZW6YX8f4SIM"

client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

fields = ["id", "project_id", "material_name", "unit", "current_qty", "quantity", "updated_by", "created_at", "Project_name"]

for f in fields:
    try:
        # Just select the field to see if it exists
        client.table("stock_update").select(f).limit(1).execute()
        print(f"[{f}] EXISTS")
    except Exception as e:
        msg = str(e)
        if "Could not find the" in msg:
            print(f"[{f}] NOT FOUND")
        else:
            print(f"[{f}] ERROR: {msg[:50]}")
