// utils/supabase-server.ts
import { cookies, headers } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function supabaseServer() {
  const c = await cookies();
  const h = await headers();

  const client = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return c.get(name)?.value;
        },
        set(name: string, value: string, options?: any) {
          c.set({ name, value, ...options });
        },
        remove(name: string, options?: any) {
          c.set({ name, value: "", ...options });
        },
      },
      headers: () => h,
    }
  );

  return client;
}
