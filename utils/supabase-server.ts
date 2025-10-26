// utils/supabase-server.ts
import { cookies } from 'next/headers';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';

export function supabaseServer() {
  return createServerActionClient({ cookies });
}

export default supabaseServer;
