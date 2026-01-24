import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://zyhqvvyxlpvkdvbegrgx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5aHF2dnl4bHB2a2R2YmVncmd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2NDY5MDAsImV4cCI6MjA4NDIyMjkwMH0.K_MQRyrYQK0hp1_SmYKgP81LSC6WNu1PnwWz56dFKPc";

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
