from supabase import create_client

SUPABASE_URL = "https://bvgldfaxakvodhrnheyq.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2Z2xkZmF4YWt2b2Rocm5oZXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTI4NDIsImV4cCI6MjA4NDI2ODg0Mn0.iBa6qkONJ0Bm7vspCoVGb9Evri6f-gvWZW6YX8f4SIM"

client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

table = "stock_verification"
vars = ["on_time", "On_Time", "is_proper", "Is_Proper", "is_approved", "Is_Approved", "approval", "proper", "proper_condition", "status", "Status", "verification", "Verified", "OnTime", "IsProper", "IsApproved"]

found = []
for v in vars:
    try:
        client.table(table).select(v).limit(1).execute()
        found.append(v)
    except: pass

print(f"FOUND: {found}")
