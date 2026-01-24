from supabase import create_client

SUPABASE_URL = "https://bvgldfaxakvodhrnheyq.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2Z2xkZmF4YWt2b2Rocm5oZXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTI4NDIsImV4cCI6MjA4NDI2ODg0Mn0.iBa6qkONJ0Bm7vspCoVGb9Evri6f-gvWZW6YX8f4SIM"

client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

# Hacky way to list tables via a non-existent table error details or common names
common_tables = [
    "profiles", "user_profiles", "users", "User_Profile", "User_Profiles",
    "projects", "daily_dprs", "project_user_roles"
]

found = []
for t in common_tables:
    try:
        res = client.table(t).select("*").limit(1).execute()
        found.append(t)
    except:
        pass

print("Tables Found:", found)
