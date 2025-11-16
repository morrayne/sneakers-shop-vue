import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://orbeuskseobrpwovgtdw.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yYmV1c2tzZW9icnB3b3ZndGR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMjgxODUsImV4cCI6MjA3MTcwNDE4NX0.NMEXFIuoYFkOxphgsksKF4WUPtjbaNW_TuMtt0PR7Lw";
export const supabase = createClient(supabaseUrl, supabaseKey);