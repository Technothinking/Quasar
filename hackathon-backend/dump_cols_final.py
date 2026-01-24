from supabase import create_client
import json

SUPABASE_URL = "https://bvgldfaxakvodhrnheyq.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2Z2xkZmF4YWt2b2Rocm5oZXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTI4NDIsImV4cCI6MjA4NDI2ODg0Mn0.iBa6qkONJ0Bm7vspCoVGb9Evri6f-gvWZW6YX8f4SIM"

client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

def dump_cols(t):
    try:
        res = client.table(t).select("*").limit(1).execute()
        if res.data:
            print(f"Table {t} columns: {list(res.data[0].keys())}")
        else:
            print(f"Table {t} is empty.")
    except Exception as e:
        print(f"Error {t}: {e}")

dump_cols("profiles")
dump_cols("daily_dprs")
