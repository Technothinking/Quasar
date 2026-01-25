import { createClient } from "@supabase/supabase-js";

// Core Connection Details
export const SUPABASE_URL = "https://bvgldfaxakvodhrnheyq.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2Z2xkZmF4YWt2b2Rocm5oZXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTI4NDIsImV4cCI6MjA4NDI2ODg0Mn0.iBa6qkONJ0Bm7vspCoVGb9Evri6f-gvWZW6YX8f4SIM";

// Bucket Identifiers (Centralized Management)
export const BUCKETS = {
  VERIFICATIONS: 'material-photos', // Ensure this exists in Supabase Storage
  RA_BILL: 'RA_BILL',
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
