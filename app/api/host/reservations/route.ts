// app/api/host/reservations/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function GET() {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<{ [key: string]: any }>({
    cookies: () => cookieStore,
  });

  // 1. user connecté
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

  // 2. récupérer les logements de ce host / conciergerie
  const { data: listings, error: listingsError } = await supabase
    .from("listings")
    .select("id, title")
    .eq("host_id", user.id);

  if (listingsError) {
    return NextResponse.json(
      { ok: false, error: listingsError.message },
      { status: 500 }
    );
  }

  if (!listings || listings.length === 0) {
    return NextResponse.json({
      ok: true,
      data: { items: [] },
    });
  }

  const listingIds = listings.map((l) => l.id);

  // 3. récupérer les réservations liées à ces logements
  // ici on ne fait PLUS le join vers profiles, seulement vers listings (FK existante)
  const { data: reservations, error: reservationsError } = await supabase
    .from("reservations")
    .select(
      `
      id,
      listing_id,
      user_id,
      check_in,
      check_out,
      guests,
      total_amount,
      status,
      created_at,
      listings (
        title,
        location
      )
    `
    )
    .in("listing_id", listingIds)
    .order("created_at", { ascending: false });

  if (reservationsError) {
    return NextResponse.json(
      { ok: false, error: reservationsError.message },
      { status: 500 }
    );
  }

  // s'il n'y a pas de résa, on s'arrête là
  if (!reservations || reservations.length === 0) {
    return NextResponse.json({
      ok: true,
      data: { items: [] },
    });
  }

  // 4. récupérer les voyageurs correspondants (2e requête)
  const travelerIds = Array.from(
    new Set(reservations.map((r) => r.user_id).filter(Boolean))
  );

  let travelersById: Record<string, string> = {};

  if (travelerIds.length > 0) {
    const { data: travelers, error: travelersError } = await supabase
      .from("profiles")
      .select("user_id, display_name")
      .in("user_id", travelerIds);

    if (!travelersError && travelers) {
      travelersById = travelers.reduce((acc, t) => {
        acc[t.user_id] = t.display_name || "";
        return acc;
      }, {} as Record<string, string>);
    }
  }

  // 5. formatter pour le BookingTable
  const items = reservations.map((r) => ({
    reservation_id: r.id,
    reservation_created_at: r.created_at,
    check_in: r.check_in,
    check_out: r.check_out,
    guests: r.guests,
    total_amount: r.total_amount,
    status: r.status,
    listing_id: r.listing_id,
    listing_title: r.listings?.title ?? "—",
    location: r.listings?.location ?? "",
    traveler_name: travelersById[r.user_id] ?? "",
    payment_status: "pending",
  }));

  return NextResponse.json({
    ok: true,
    data: { items },
  });
}
