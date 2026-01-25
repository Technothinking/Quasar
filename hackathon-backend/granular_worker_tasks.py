from supabase import create_client

SUPABASE_URL = "https://bvgldfaxakvodhrnheyq.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2Z2xkZmF4YWt2b2Rocm5oZXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTI4NDIsImV4cCI6MjA4NDI2ODg0Mn0.iBa6qkONJ0Bm7vspCoVGb9Evri6f-gvWZW6YX8f4SIM"

client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

fields = ["project_id", "task_description", "assigned_to", "status", "created_at"]
for f in fields:
    try:
        # We don't want to actually insert if we can help it, but just check existence
        # select(f) is best
        res = client.table("worker_tasks").select(f).limit(1).execute()
        print(f"[{f}] EXISTS")
    except Exception as e:
        msg = str(e)
        if "Could not find the" in msg:
            print(f"[{f}] NOT FOUND")
        else:
            print(f"[{f}] ERROR: {msg[:50]}")
