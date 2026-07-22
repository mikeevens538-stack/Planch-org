import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  // Rappel utile en dev si .env.local n'est pas encore rempli
  console.warn(
    "Variables Supabase manquantes — copie .env.local.example vers .env.local et remplis-le."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
