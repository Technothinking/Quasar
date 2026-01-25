from supabase import create_client

# Ensuring the URL ends with a slash if needed by storage client
SUPABASE_URL = "https://bvgldfaxakvodhrnheyq.supabase.co/"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2Z2xkZmF4YWt2b2Rocm5oZXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTI4NDIsImV4cCI6MjA4NDI2ODg0Mn0.iBa6qkONJ0Bm7vspCoVGb9Evri6f-gvWZW6YX8f4SIM"

client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

try:
    # We use service role key usually for total list if anon is restricted, 
    # but let's see what anon can see.
    buckets = client.storage.list_buckets()
    print("BUCKETS:", [b.name for b in buckets])
except Exception as e:
    print("ERROR:", e)
