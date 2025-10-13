// app/api/services/bootstrap/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies as nextCookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export async function GET(req: NextRequest) {
  try {
    const jar = nextCookies();
    // 1) Si déjà présent, on le garde tel quel
    const existing = jar.get("provider_id")?.value;
    if (existing) {
      return NextResponse.json({ ok: true, provider_id: existing, source: "cookie" });
    }

    // 2) Sinon, essaye de le déduire d’un cookie user déjà posé par ton système
    // (adapte le nom si tu as un autre cookie d’user id)
    const userIdFromApp =
      jar.get("user_id")?.value ||
      jar.get("auth_user_id")?.value ||
      jar.get("host_id")?.value || // au cas où tu as ça côté conciergerie
      "";

    if (userIdFromApp) {
      const res = NextResponse.json({ ok: true, provider_id: userIdFromApp, source: "app_cookie" });
      res.cookies.set("provider_id", userIdFromApp, {
        path: "/",
        httpOnly: false,
        sameSite: "lax",
      });
      return res;
    }

    // 3) En dernier recours : si tu utilises Supabase Auth côté navigateur,
    //    récupère le JWT dans le cookie 'sb-access-token' et résous l'user.
    const sbToken = jar.get("sb-access-token")?.value || "";
    if (sbToken && SUPABASE_URL && SUPABASE_ANON_KEY) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        global: { headers: { Authorization: `Bearer ${sbToken}` } },
      });
      const { data: userRes, error } = await supabase.auth.getUser();
      if (!error && userRes?.user?.id) {
        const res = NextResponse.json({ ok: true, provider_id: userRes.user.id, source: "supabase_jwt" });
        res.cookies.set("provider_id", userRes.user.id, {
          path: "/",
          httpOnly: false,
          sameSite: "lax",
        });
        return res;
      }
    }

    // 4) Si on ne peut pas déterminer l’id → on donne l’info au front
    return NextResponse.json(
      { ok: false, error: "missing provider id (no cookie/user/jwt)" },
      { status: 401 }
    );
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
