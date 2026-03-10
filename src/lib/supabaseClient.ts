import { createClient } from '@supabase/supabase-js';

const fallbackUrl = 'https://xpupfrmdghlwavtyijmc.supabase.co';
const fallbackAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwdXBmcm1kZ2hsd2F2dHlpam1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyMzA0NDUsImV4cCI6MjA3OTgwNjQ0NX0.L1-NwpmYDH6cg-J-3AJ6IiW8KOpERN8PkryC7Ra2Ioo';

const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ?? fallbackUrl;
const supabaseAnonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ??
  fallbackAnonKey;

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn(
    'Using fallback Supabase credentials. For security, set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.'
  );
}

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    detectSessionInUrl: true,
  },
});

export type SupabaseClient = typeof supabase;

