// app/api/services/provider/route.ts
import { NextRequest } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(Number(searchParams.get("limit") ?? 100), 500);
    const offset = Number(searchParams.get("offset") ?? 0);
    const q = (searchParams.get("q") ?? "").trim();

    const supaAuth = createRouteHandlerClient({ cookies });
    const { data: userRes, error: uErr } = await supaAuth.auth.getUser();
    if (uErr || !userRes?.user) {
      return Response.json({ ok: false, error: "Utilisateur non authentifié" }, { status: 401 });
    }
    const providerId = userRes.user.id;

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: {
        headers: { Authorization: `Bearer ${(await supaAuth.auth.getSession()).data.session?.access_token ?? ""}` },
      },
    });

    let query = supabase
      .from("services")
      .select("id,title,area,category,rating_avg,price,created_at", { count: "exact" })
      .eq("provider_id", providerId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (q) {
      query = query.or(`title.ilike.%${q}%,category.ilike.%${q}%,area.ilike.%${q}%`);
    }

    const { data, error, count } = await query;
    if (error) return Response.json({ ok: false, error: error.message }, { status: 400 });

    return Response.json({
      ok: true,
      data: data ?? [],
      meta: { count: count ?? 0, limit, offset, q, providerId },
    });
  } catch (err: any) {
    return Response.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}
