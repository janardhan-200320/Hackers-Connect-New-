// filepath: d:\ZETPEAK Intern\hacker-social-ctf\frontend\src\lib\supabase.ts
import { createClient } from '@supabase/supabase-js';
import { getAuthToken } from '../utils/auth'; // Import your function that gets the token

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key must be defined in .env file");
}

// The Supabase client will automatically look for a 'supabase.auth.token' key in localStorage.
// We will store our token there.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storageKey: 'auth_token', // Tell Supabase to use our custom key
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// This function updates the client with the user's auth token when they are logged in
export const updateSupabaseAuth = () => {
  const token = getAuthToken();
  if (token) {
    supabase.auth.setSession({
      access_token: token,
      refresh_token: '', // You can leave this empty if you're not using Supabase refresh tokens
    });
  }
};