import { createClient } from "@supabase/supabase-js";
import { config } from "../config";

if (!config.supabase.url || !config.supabase.anonKey) {
  console.warn("⚠️ Supabase credentials missing in config");
}

export const supabase = createClient(
  config.supabase.url,
  config.supabase.anonKey
);
