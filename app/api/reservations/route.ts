// app/api/reservations/route.ts
// Liste des réservations DU VOYAGEUR connecté
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function GET() {
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

  const { data, error } = await supabase
    .from("reservations")
    .select(
      `
      id,
      listing_id,
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
    .eq("user_id", user.id) // ← ici c'est bien le voyageur
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }

  const items = (data || []).map((r) => ({
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
    payment_status: "pending",
  }));

  return NextResponse.json({
    ok: true,
    data: { items },
  });
}
