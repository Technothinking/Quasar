from supabase import create_client

SUPABASE_URL = "https://bvgldfaxakvodhrnheyq.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2Z2xkZmF4YWt2b2Rocm5oZXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTI4NDIsImV4cCI6MjA4NDI2ODg0Mn0.iBa6qkONJ0Bm7vspCoVGb9Evri6f-gvWZW6YX8f4SIM"

client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

# Try to insert a dummy row to discover ALL columns if they are not restricted
# Or just try common synonyms
synonyms = ["on_time", "is_on_time", "delivery_time", "proper", "is_proper", "condition", "is_approved", "approved", "status", "verification_status"]
found = []
for s in synonyms:
    try:
        client.table("stock_verification").select(s).limit(1).execute()
        found.append(s)
    except: pass

print(f"Found synonyms: {found}")
