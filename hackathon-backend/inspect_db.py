from supabase import create_client
import json

SUPABASE_URL = "https://bvgldfaxakvodhrnheyq.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2Z2xkZmF4YWt2b2Rocm5oZXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTI4NDIsImV4cCI6MjA4NDI2ODg0Mn0.iBa6qkONJ0Bm7vspCoVGb9Evri6f-gvWZW6YX8f4SIM"

client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

def inspect_table(table_name):
    print(f"\n--- Inspecting Table: {table_name} ---")
    try:
        # We try to get one row to see column names
        res = client.table(table_name).select("*").limit(1).execute()
        if res.data:
            print(f"Sample row in {table_name}:")
            print(json.dumps(res.data[0], indent=2))
        else:
            print(f"Table {table_name} is empty.")
            # Try to fetch columns via RPC or REST if possible, but standard select * is easiest if not empty
    except Exception as e:
        print(f"Error inspecting {table_name}: {e}")

inspect_table("User_Profile")
inspect_table("project_user_roles")
inspect_table("user_profile") # check lowercase too
