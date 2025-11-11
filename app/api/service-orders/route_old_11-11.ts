// app/api/service-orders/route.ts
import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") ?? "";
  const limit  = Math.min(Number(searchParams.get("limit") ?? 50), 200);
  const offset = Number(searchParams.get("offset") ?? 0);

  let q = supabase
    .from("service_orders")
    .select(
      "id, reservation_id, service_id, listing_id, traveler_id, level_name, unit_price, qty, total_price, scheduled_at, address_text, provider_id, status, created_at, updated_at"
    )
    .eq("provider_id", user.id)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) q = q.eq("status", status);

  const { data, error } = await q;
  if (error) return Response.json({ error: error.message }, { status: 400 });

  return Response.json({ ok: true, data, meta: { limit, offset } }, { status: 200 });
}
