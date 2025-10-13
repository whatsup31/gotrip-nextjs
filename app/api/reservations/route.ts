// app/api/reservations/route.ts
import { NextRequest } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/**
 * Crée une réservation + les service_orders associées.
 * - Identifie le voyageur via auth-helpers-nextjs (cookies Supabase)
 * - Calcule le total serveur (nuits * price_per_night + Σ services)
 * - Renseigne reservations.user_id + service_orders.traveler_id/provider_id/…
 */
export async function POST(req: NextRequest) {
  try {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return Response.json(
        { ok: false, error: "Supabase env missing (URL/ANON KEY)" },
        { status: 500 }
      );
    }

    // 0) Contexte utilisateur via auth-helpers (fiable)
    const supaAuth = createRouteHandlerClient({ cookies });
    const { data: userRes, error: uErr } = await supaAuth.auth.getUser();
    if (uErr || !userRes?.user) {
      return Response.json(
        { ok: false, error: "Utilisateur non authentifié" },
        { status: 401 }
      );
    }
    const travelerId = userRes.user.id;

    // 1) Payload
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

    // 2) Client DB “classique” pour requêtes (on garde le SDK standard)
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      // on propage aussi le token auth pour les policies si RLS activé
      global: {
        headers: { Authorization: `Bearer ${(await supaAuth.auth.getSession()).data.session?.access_token ?? ""}` },
      },
    });

    // 3) Listing & tarifs
    const { data: listing, error: listingErr } = await supabase
      .from("listings")
      .select("id, host_id, price_per_night")
      .eq("id", listingId)
      .single();

    if (listingErr || !listing) {
      return Response.json({ ok: false, error: "Listing introuvable" }, { status: 404 });
    }

    // 4) Calculs
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

      // provider & prix service
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
        reservation_id: null, // on ajoutera l'id après insert
        listing_id: listingId,
        traveler_id: travelerId,                 // ✅ VOYAGEUR
        provider_id: svc?.provider_id || null,   // ✅ PRESTATAIRE
        service_id: serviceId,
        level_id: it?.levelId || null,
        unit_price: unitPrice,
        qty,
        total_price,
        status: "pending",
        scheduled_at: checkIn ? new Date(`${checkIn}T10:00:00Z`).toISOString() : null, // POC: 10h jour du check-in
        address_text: null,
      });
    }

    const totalAmount = lodgingTotal + servicesTotal;

    // 5) Création de la réservation
    const { data: created, error: insErr } = await supabase
      .from("reservations")
      .insert({
        listing_id: listingId,
        user_id: travelerId,  // ✅ user_id rempli
        check_in: checkIn,
        check_out: checkOut,
        guests,
        services: items,      // trace JSON
        total_amount: totalAmount,
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

    // 6) Service orders
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
