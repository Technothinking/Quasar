from supabase import create_client
import json

SUPABASE_URL = "https://bvgldfaxakvodhrnheyq.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2Z2xkZmF4YWt2b2Rocm5oZXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTI4NDIsImV4cCI6MjA4NDI2ODg0Mn0.iBa6qkONJ0Bm7vspCoVGb9Evri6f-gvWZW6YX8f4SIM"

client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

def get_table_columns(table_name):
    try:
        res = client.table(table_name).select("*").limit(1).execute()
        if res.data:
            return {"exists": True, "columns": list(res.data[0].keys()), "sample": res.data[0]}
        return {"exists": True, "columns": "EMPTY", "sample": None}
    except Exception as e:
        return {"exists": False, "error": str(e)}

# Check different possible task table names
task_tables = ["tasks", "Tasks", "project_tasks", "task_assignments", "task_management"]
results = {}

for table in task_tables:
    results[table] = get_table_columns(table)

with open("task_tables_check.json", "w") as f:
    json.dump(results, f, indent=2)

print(json.dumps(results, indent=2))
