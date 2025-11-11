// app/api/service-orders/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const scope = url.searchParams.get("scope") || "provider"; // provider par défaut
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<{ [key: string]: any }>({
    cookies: () => cookieStore,
  });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      { ok: false, error: "not authenticated" },
      { status: 401 }
    );
  }

  let filterField = "provider_id"; // par défaut
  if (scope === "traveler") filterField = "traveler_id";
  if (scope === "host") filterField = "host_id";

  const { data: orders, error: ordersError } = await supabase
    .from("service_orders")
    .select(
      `
      id,
      service_id,
      reservation_id,
      traveler_id,
      provider_id,
      listing_id,
      qty,
      unit_price,
      total_price,
      status,
      scheduled_at,
      created_at
    `
    )
    .eq(filterField, user.id)
    .order("created_at", { ascending: false });

  if (ordersError) {
    return NextResponse.json(
      { ok: false, error: ordersError.message },
      { status: 500 }
    );
  }

  // récupérer les services liés pour enrichir les infos
  const serviceIds = Array.from(
    new Set((orders || []).map((o) => o.service_id).filter(Boolean))
  );

  let serviceById: Record<string, string> = {};
  if (serviceIds.length > 0) {
    const { data: services, error: servicesError } = await supabase
      .from("services")
      .select("id, title")
      .in("id", serviceIds);

    if (!servicesError && services) {
      serviceById = services.reduce((acc, s) => {
        acc[String(s.id)] = s.title || "";
        return acc;
      }, {} as Record<string, string>);
    }
  }

  const items = (orders || []).map((o) => ({
    order_id: o.id,
    service_id: o.service_id, // ⬅️ AJOUT IMPORTANT pour le lien vers /activity-single/[id]
    order_created_at: o.created_at,
    scheduled_at: o.scheduled_at,
    service_title: serviceById[String(o.service_id)] ?? "",
    qty: o.qty,
    total_price:
      o.total_price ?? (Number(o.unit_price || 0) * Number(o.qty || 1)),
    status: o.status,
    payment_status: "pending",
    paid_amount: 0,
  }));

  return NextResponse.json({
    ok: true,
    data: { items },
  });
}
