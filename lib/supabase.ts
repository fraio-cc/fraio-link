import { createClient } from '@supabase/supabase-js';
import { config } from './config';

if (typeof window !== 'undefined') {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (url && !url.includes('.supabase.co')) {
    console.warn(
      '⚠️  SECURITY WARNING: Ensure Row Level Security (RLS) is enabled on all Supabase tables.\n' +
      'The anon key is exposed to the browser and can be extracted by attackers.'
    );
  }
}

const supabaseUrl = config.supabase.url;
const supabaseServiceKey = config.supabase.serviceRoleKey;

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export const supabase = createClient(
  config.supabase.url,
  config.supabase.anonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);
