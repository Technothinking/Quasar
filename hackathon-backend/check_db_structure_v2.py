from supabase import create_client

SUPABASE_URL = "https://bvgldfaxakvodhrnheyq.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2Z2xkZmF4YWt2b2Rocm5oZXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTI4NDIsImV4cCI6MjA4NDI2ODg0Mn0.iBa6qkONJ0Bm7vspCoVGb9Evri6f-gvWZW6YX8f4SIM"

client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

try:
    res = client.table("User_Profile").select("*").limit(1).execute()
    if res.data:
        print("Columns in User_Profile:", res.data[0].keys())
    else:
        print("User_Profile table is empty.")
except Exception as e:
    print("Error querying User_Profile:", e)

try:
    res = client.table("project_user_roles").select("*").limit(1).execute()
    if res.data:
        print("Columns in project_user_roles:", res.data[0].keys())
except Exception as e:
    print("Error querying project_user_roles:", e)
