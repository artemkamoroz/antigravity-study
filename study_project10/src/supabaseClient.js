import { createClient } from '@supabase/supabase-js';

// Replace with your actual Supabase credentials for production!
// These are placeholders that connect to the trial mode logic.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);
