from supabase import create_client

SUPABASE_URL = "https://bvgldfaxakvodhrnheyq.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2Z2xkZmF4YWt2b2Rocm5oZXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTI4NDIsImV4cCI6MjA4NDI2ODg0Mn0.iBa6qkONJ0Bm7vspCoVGb9Evri6f-gvWZW6YX8f4SIM"

client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

table = "stock_verification"
# I will check these specific ones requested by the user
checks = ["on_time", "is_proper", "is_approved", "Quantity", "Unit", "project_id", "material_name", "status"]

for c in checks:
    try:
        client.table(table).select(c).limit(1).execute()
        print(f"CHECK_{c}_OK")
    except Exception as e:
        print(f"CHECK_{c}_FAIL: {str(e)[:50]}")
