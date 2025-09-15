// utils/supabase-browser.ts
'use client';
import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/utils/types_db' 

export const supabaseBrowser = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
