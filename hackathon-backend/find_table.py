from supabase import create_client

SUPABASE_URL = "https://bvgldfaxakvodhrnheyq.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2Z2xkZmF4YWt2b2Rocm5oZXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTI4NDIsImV4cCI6MjA4NDI2ODg0Mn0.iBa6qkONJ0Bm7vspCoVGb9Evri6f-gvWZW6YX8f4SIM"

client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

tables = ["User_Profile", "user_profile", "Profiles", "profiles", "Users", "users", "User", "user"]

for t in tables:
    try:
        res = client.table(t).select("*").limit(1).execute()
        print(f"Table {t}: {'FOUND and HAS DATA' if res.data else 'EMPTY or NOT FOUND'}")
        if res.data:
            print(f"  Columns: {res.data[0].keys()}")
    except Exception as e:
        print(f"Table {t}: ERROR {str(e)[:50]}")
