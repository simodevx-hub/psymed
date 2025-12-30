import { createClient } from '@supabase/supabase-js';

// Vite uses import.meta.env for environment variables, not process.env
const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Provide dummy values if env vars are missing to prevent client crash on init.
// The app will still fail to fetch data, but it won't crash with "supabaseUrl is required".
const supabaseUrl = envUrl || 'https://placeholder.supabase.co';
const supabaseAnonKey = envKey || 'placeholder';

// We create a client. If keys are missing, this will throw errors when used,
// which we will handle gracefully in the UI components.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = () => {
  return !!envUrl && !!envKey;
};