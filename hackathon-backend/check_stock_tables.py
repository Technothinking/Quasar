from supabase import create_client
import json

SUPABASE_URL = "https://bvgldfaxakvodhrnheyq.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2Z2xkZmF4YWt2b2Rocm5oZXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTI4NDIsImV4cCI6MjA4NDI2ODg0Mn0.iBa6qkONJ0Bm7vspCoVGb9Evri6f-gvWZW6YX8f4SIM"

client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

names = ["stock_update", "stock_updates", "daily_stock", "site_stock"]
for n in names:
    try:
        res = client.table(n).select("*").limit(1).execute()
        print(f"[{n}] EXISTS. Columns: {list(res.data[0].keys()) if res.data else 'EMPTY'}")
    except Exception as e:
        msg = str(e)
        if "Could not find" in msg:
            print(f"[{n}] NOT FOUND")
        else:
            print(f"[{n}] ERROR: {msg[:100]}")
