import { createClient } from '@supabase/supabase-js';

/**
 * Supabase Client Configuration
 * 
 * Initialized Supabase client untuk storage operations.
 */

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check SUPABASE_URL and SUPABASE_ANON_KEY in .env file');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'qr-codes';
