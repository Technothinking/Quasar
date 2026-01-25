from supabase import create_client

SUPABASE_URL = "https://bvgldfaxakvodhrnheyq.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2Z2xkZmF4YWt2b2Rocm5oZXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTI4NDIsImV4cCI6MjA4NDI2ODg0Mn0.iBa6qkONJ0Bm7vspCoVGb9Evri6f-gvWZW6YX8f4SIM"

client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

# Broad probe
candidates = [
    "site_logs", "project_logs", "daily_logs", "logs",
    "delays", "site_delays", "project_delays",
    "reports", "daily_reports", "site_reports",
    "events", "site_events", "project_events",
    "blockers", "site_blockers",
    "site_status", "project_status",
    "notifications", "alerts"
]

for t in candidates:
    try:
        client.table(t).select("*").limit(1).execute()
        print(f"FOUND_{t}")
    except Exception:
        pass
