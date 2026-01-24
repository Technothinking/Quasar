from app.core.supabase import supabase

try:
    # Attempt to get one record to see structure
    res = supabase.table("User_Profile").select("*").limit(1).execute()
    if res.data:
        print("Columns in User_Profile:", res.data[0].keys())
    else:
        print("User_Profile table is empty, but checking structure via empty select...")
        res = supabase.table("User_Profile").select("*").limit(0).execute()
        print("Res metadata or columns might be here if we use a different method, but usually we need at least one row.")
except Exception as e:
    print("Error querying User_Profile:", e)

try:
    res = supabase.table("project_user_roles").select("*").limit(1).execute()
    if res.data:
        print("Columns in project_user_roles:", res.data[0].keys())
except Exception as e:
    print("Error querying project_user_roles:", e)
