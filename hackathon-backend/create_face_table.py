import os
from supabase import create_client
from dotenv import load_dotenv

# Note: Using the keys found in previous steps or current environment
SUPABASE_URL = "https://bvgldfaxakvodhrnheyq.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2Z2xkZmF4YWt2b2Rocm5oZXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTI4NDIsImV4cCI6MjA4NDI2ODg0Mn0.iBa6qkONJ0Bm7vspCoVGb9Evri6f-gvWZW6YX8f4SIM"

client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

# SQL for creating pgvector extension and face_col table
# Since anon key might not have permission for raw SQL, this is a 'best effort' attempt
# or we can check if table exists. 

# If the user has enabled the vector extension, vector(512) is valid.
sql = """
CREATE EXTENSION IF NOT EXISTS vector;
CREATE TABLE IF NOT EXISTS face_col (
    uuid UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    face_embedding vector(512),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
"""

try:
    # Trying to execute via a RPC or direct SQL if allowed (unlikely for anon)
    # Most likely I'll just check if it exists by querying it.
    res = client.table("face_col").select("*").limit(1).execute()
    print("TABLE_EXISTS: face_col already exists.")
except Exception as e:
    print(f"TABLE_CHECK: {str(e)}")
    print("MANUAL_ACTION_REQUIRED: Please run the SQL command in Supabase Dashboard.")

print("\n--- SQL COMMAND TO RUN IN SUPABASE ---")
print(sql)
print("---------------------------------------")
