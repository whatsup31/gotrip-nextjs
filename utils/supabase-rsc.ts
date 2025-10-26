// utils/supabase-rsc.ts
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

export function supabaseRSC() {
  return createServerComponentClient({ cookies });
}

export default supabaseRSC;
