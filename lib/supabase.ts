import { createClient } from '@supabase/supabase-js'

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return v;
}

// Export a getter so creation happens at call time, not at module evaluation time
export const supabase = createClient(
  requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
  requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
)

// For server-side usage, prefer server env vars if provided
export function createServerSupabase() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error('Missing Supabase URL or Key for server');
  }
  return createClient(url, key);
}
