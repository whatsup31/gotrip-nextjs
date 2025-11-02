// app/api/reservations/route.ts
import { NextRequest } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

/**
 * Crée une réservation + les service_orders associées.
 * - Lit l'utilisateur via auth-helpers (cookies sb-*)
 * - Utilise le même client auth-helpers pour TOUTES les requêtes DB
 * - Calcule le total (nuits + services)
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // 1) Utilisateur connecté (voyageur)
    const { data: userRes, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userRes?.user) {
      return Response.json(
        { ok: false, error: "Utilisateur non authentifié" },
        { status: 401 }
      );
    }
    const travelerId = userRes.user.id;

    // 2) Payload
    const body = await req.json();
    const listingId: number = Number(body?.listingId);
    const checkIn: string = String(body?.checkIn || "");
    const checkOut: string = String(body?.checkOut || "");
    const guests: number = Number(body?.guests || 1);

    // services: [{ serviceId, levelId, unitPrice?, qty? }]
    const items: Array<{
      serviceId: number | string;
      levelId?: string;
      unitPrice?: number;
      qty?: number;
    }> = Array.isArray(body?.services) ? body.services : [];

    if (!listingId || !checkIn || !checkOut) {
      return Response.json({ ok: false, error: "Champs manquants" }, { status: 400 });
    }

    // 3) Récup listing & prix
    const { data: listing, error: listingErr } = await supabase
      .from("listings")
      .select("id, host_id, price_per_night")
      .eq("id", listingId)
      .single();

    if (listingErr || !listing) {
      return Response.json({ ok: false, error: "Listing introuvable" }, { status: 404 });
    }

    // 4) Calculs (nuits + totaux)
    const d1 = Date.parse(checkIn);
    const d2 = Date.parse(checkOut);
    const nights =
      Number.isFinite(d1) && Number.isFinite(d2) && d2 > d1
        ? Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24))
        : 0;

    const pricePerNight = Number(listing.price_per_night || 0);
    const lodgingTotal = Math.max(0, nights * pricePerNight);

    let servicesTotal = 0;
    const ordersToInsert: any[] = [];

    for (const it of items) {
      const serviceId = Number(it?.serviceId);
      if (!serviceId) continue;

      const { data: svc } = await supabase
        .from("services")
        .select("id, provider_id, price")
        .eq("id", serviceId)
        .single();

      const unitPrice = Number.isFinite(Number(it?.unitPrice))
        ? Number(it.unitPrice)
        : Number(svc?.price || 0);

      const qty = Math.max(1, Number(it?.qty || 1));
      const total_price = unitPrice * qty;
      servicesTotal += total_price;

      ordersToInsert.push({
        reservation_id: null,             // on mettra l'id après
        listing_id: listingId,
        traveler_id: travelerId,          // ✅ voyageur
        provider_id: svc?.provider_id || null, // ✅ prestataire
        service_id: serviceId,
        level_id: it?.levelId || null,
        unit_price: unitPrice,
        qty,
        total_price,
        status: "pending",
        scheduled_at: checkIn ? new Date(`${checkIn}T10:00:00Z`).toISOString() : null, // POC
        address_text: null,
      });
    }

    const totalAmount = lodgingTotal + servicesTotal;

    // 5) Réservation
    const { data: created, error: insErr } = await supabase
      .from("reservations")
      .insert({
        listing_id: listingId,
        user_id: travelerId,         // ✅ lie au voyageur
        check_in: checkIn,
        check_out: checkOut,
        guests,
        services: items,             // trace JSON
        total_amount: totalAmount,   // ✅ total côté serveur
        status: "pending",
      })
      .select("id")
      .single();

    if (insErr || !created) {
      return Response.json(
        { ok: false, error: insErr?.message || "Insert reservation failed" },
        { status: 400 }
      );
    }

    // 6) service_orders liées
    if (ordersToInsert.length) {
      await supabase.from("service_orders").insert(
        ordersToInsert.map((o) => ({ ...o, reservation_id: created.id }))
      );
    }

    return Response.json({
      ok: true,
      data: { id: created.id, total_amount: totalAmount },
    });
  } catch (err: any) {
    console.error(err);
    return Response.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}
