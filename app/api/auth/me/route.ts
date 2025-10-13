// app/api/auth/me/route.ts
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET() {
  const supa = createRouteHandlerClient({ cookies });
  const { data, error } = await supa.auth.getUser();
  if (error) return Response.json({ ok: false, error: error.message }, { status: 401 });
  return Response.json({ ok: true, user: data.user });
}
