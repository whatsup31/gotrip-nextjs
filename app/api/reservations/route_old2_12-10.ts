// app/api/reservations/route.ts
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

type IncomingService = {
  serviceId: number | string;
  levelId?: string | null;
  levelName?: string | null;
  unitPrice?: number | string | null;
  qty?: number | string | null;
  total?: number | string | null; 
  price?: number | string | null; 
  providerId?: string | null;
  scheduledAt?: string | null;
  address?: string | null;
};

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const listingId: number = payload?.listingId;
  const checkIn: string = payload?.checkIn;   // attendu: "YYYY-MM-DD"
  const checkOut: string = payload?.checkOut; // attendu: "YYYY-MM-DD"
  const guests: number = Number(payload?.guests || 1);
  const services: IncomingService[] = Array.isArray(payload?.services)
    ? payload.services
    : [];

  // total services 
  const servicesTotal = services.reduce((sum, s) => {
    const val =
      s.total ?? s.price ?? (Number(s.unitPrice || 0) * Number(s.qty || 1));
    const n = Number(val || 0);
    return sum + (Number.isFinite(n) ? n : 0);
  }, 0);

  const { data: reservation, error: rErr } = await supabase
    .from("reservations")
    .insert({
      listing_id: listingId,
      user_id: user?.id ?? null,
      check_in: checkIn,
      check_out: checkOut,
      guests,
      services,                 
      total_amount: servicesTotal,
      status: "pending",
    })
    .select("*")
    .single();

  if (rErr) {
    return Response.json({ error: rErr.message }, { status: 400 });
  }

  if (services.length) {
    const missionRows = services.map((s) => {
      const unit = Number(s.unitPrice ?? 0);
      const qty = Math.max(1, Number(s.qty ?? 1));
      const total = Number(
        s.total ?? s.price ?? (Number.isFinite(unit) ? unit * qty : 0)
      );

      return {
        reservation_id: reservation.id,     
        service_id: Number(s.serviceId) || null, 
        listing_id: listingId ?? null,
        traveler_id: reservation.user_id ?? null,

        level_id: s.levelId ?? null,
        level_name: s.levelName ?? null,
        unit_price: Number.isFinite(unit) ? unit : 0,
        qty,
        total_price: Number.isFinite(total) ? total : 0,

        provider_id: s.providerId ?? null, 
        status: "pending",

        scheduled_at: s.scheduledAt ?? null,
        address_text: s.address ?? null,
      };
    });

    const { error: mErr } = await supabase.from("service_orders").insert(missionRows);
    if (mErr) {
      console.warn("service_order insert error", mErr);
    }
  }

  return Response.json({ ok: true, data: { id: reservation.id } }, { status: 200 });
}
