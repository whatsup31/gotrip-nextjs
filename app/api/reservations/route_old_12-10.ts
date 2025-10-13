// app/api/reservations/route.ts

import { NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabase-server";

export async function POST(req: Request) {
  try {
    const supabase = supabaseServer();
    const body = await req.json();

    const listingId = Number(body?.listingId);
    const checkIn   = body?.checkIn;
    const checkOut  = body?.checkOut;
    const guests    = Number(body?.guests ?? 1);

    if (!listingId || !checkIn || !checkOut) {
      return NextResponse.json({ ok:false, error:"Missing fields" }, { status: 400 });
    }

    const { data: listing, error: listingErr } = await supabase
      .from("listings")
      .select("id, price_per_night, title")
      .eq("id", listingId)
      .single();

    if (listingErr || !listing) {
      return NextResponse.json({ ok:false, error:"Listing not found" }, { status: 404 });
    }

    const nights = Math.max(
      1,
      Math.ceil((Date.parse(checkOut) - Date.parse(checkIn)) / (1000*60*60*24))
    );
    const totalAmount = Number(listing.price_per_night ?? 0) * nights;

    const { data: created, error: insErr } = await supabase
      .from("reservations")
      .insert({
        listing_id: listingId,
        check_in: checkIn,
        check_out: checkOut,
        guests,
        total_amount: totalAmount,
        status: "pending",
      })
      .select("id")
      .single();

    if (insErr) {
      return NextResponse.json({ ok:false, error: insErr.message }, { status: 400 });
    }

    return NextResponse.json({ ok:true, data:{ id: created.id } }, { status: 201 });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error: e?.message ?? "Unknown error" }, { status: 500 });
  }
}
