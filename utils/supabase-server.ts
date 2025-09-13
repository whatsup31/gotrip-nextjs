import { cookies, headers } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { Database } from '@/utils/types_db' // optionnel

export function supabaseServer() {
  const c = cookies()
  const h = headers()
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return c.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          c.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          c.set({ name, value: '', ...options })
        },
      },
      headers: () => h,
    }
  )
}
