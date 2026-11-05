import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

/**
 * Checks whether Supabase environment variables have been properly configured
 * with non-placeholder values.
 */
export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('your-project-id') &&
    !supabaseAnonKey.includes('your-anon-key-here')
  );
};

// Fallback dummy credentials to allow the app to boot safely even if .env is unconfigured
const fallbackUrl = 'https://placeholder-project.supabase.co';
const fallbackKey = 'placeholder-key';

export const supabase = createClient(
  supabaseUrl && !supabaseUrl.includes('your-project-id') ? supabaseUrl : fallbackUrl,
  supabaseAnonKey && !supabaseAnonKey.includes('your-anon-key-here') ? supabaseAnonKey : fallbackKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
