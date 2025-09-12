// utils/supabase-browser.ts
import { createBrowserClient } from '@supabase/auth-helpers-nextjs'

export const supabaseBrowser = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
