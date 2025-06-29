import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with fallback for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-supabase-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

if (supabaseUrl.includes('placeholder') || supabaseAnonKey.includes('placeholder')) {
  console.warn('Using placeholder Supabase credentials. Some features may not work until proper credentials are provided.');
}

// Create the client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !supabaseUrl.includes('placeholder') && !supabaseAnonKey.includes('placeholder');
};

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error fetching session:', error.message);
    return null;
  }
  return data.session;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error signing out:', error.message);
    return false;
  }
  return true;
}