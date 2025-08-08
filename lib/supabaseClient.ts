import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Default singleton client (useful for most cases)
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);

// Factory function for fresh clients if needed
export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}
