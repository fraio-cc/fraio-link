const requiredEnvVars = [
  'AUTH_SECRET',
  'NEXTAUTH_URL',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
] as const;

export function validateEnv() {
  const missing: string[] = [];
  
  requiredEnvVars.forEach(key => {
    if (key === 'AUTH_SECRET') {
      if (!process.env.AUTH_SECRET && !process.env.NEXTAUTH_SECRET) {
        missing.push('AUTH_SECRET (or NEXTAUTH_SECRET)');
      }
    } else if (!process.env[key]) {
      missing.push(key);
    }
  });

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.map(v => `  - ${v}`).join('\n')}\n` +
      'Please check your .env.local file.'
    );
  }
}

if (typeof window === 'undefined') {
  validateEnv();
}

export const config = {
  nextAuth: {
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET!,
    url: process.env.NEXTAUTH_URL!,
  },
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  },
} as const;
