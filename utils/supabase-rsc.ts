// utils/supabase-rsc.ts

import { cookies, headers } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export function supabaseRSC() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // lecture OK
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        // écriture interdite en RSC → no-op
        set() {},
        remove() {},
      },
      // (facultatif) propage quelques headers utiles si tu es derrière un proxy
      headers: {
        "x-forwarded-host": headers().get("x-forwarded-host") ?? undefined,
        "x-forwarded-proto": headers().get("x-forwarded-proto") ?? undefined,
      },
    }
  );
}
