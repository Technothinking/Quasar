from supabase import create_client
import json

SUPABASE_URL = "https://bvgldfaxakvodhrnheyq.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2Z2xkZmF4YWt2b2Rocm5oZXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTI4NDIsImV4cCI6MjA4NDI2ODg0Mn0.iBa6qkONJ0Bm7vspCoVGb9Evri6f-gvWZW6YX8f4SIM"

client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

try:
    res = client.table("taska").select("*").limit(1).execute()
    if res.data:
        print("Taska table columns:", list(res.data[0].keys()))
        print("\nSample data:", json.dumps(res.data[0], indent=2))
    else:
        print("Taska table exists but is empty")
        # Try inserting a test record to see what columns are required
        print("\nAttempting test insert to discover schema...")
except Exception as e:
    print(f"Error: {e}")
