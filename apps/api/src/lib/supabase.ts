import { createClient } from "@supabase/supabase-js";
import { config } from "../config";

const supabaseUrl = config.supabase.url;
const supabaseAnonKey = config.supabase.anonKey;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ CRITICAL: Supabase credentials missing in environment variables!");
}

// We only initialize if we have the credentials to prevent the 'supabaseUrl is required' crash
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as any); // Type cast as any to avoid breaking imports elsewhere
