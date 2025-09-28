// app/api/reservations/[id]/confirm/route.ts

import { NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabase-server";

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = supabaseServer();
  const id = Number(params?.id);
  if (!id) return NextResponse.json({ ok:false, error:"Bad id" }, { status: 400 });

  // utilisateur connecté
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok:false, error:"Not authenticated" }, { status: 401 });

  // vérifier que la résa appartient à un listing de cet hôte
  const { data: rec, error: selErr } = await supabase
    .from("reservations")
    .select("id, status, listing_id, listings:listing_id(host_id)")
    .eq("id", id)
    .single();

  if (selErr || !rec) return NextResponse.json({ ok:false, error:"Reservation not found" }, { status: 404 });

  if (rec.listings?.host_id !== user.id) {
    return NextResponse.json({ ok:false, error:"Forbidden" }, { status: 403 });
  }

  // update status → confirmed
  const { error: updErr } = await supabase
    .from("reservations")
    .update({ status: "confirmed" })
    .eq("id", id);

  if (updErr) return NextResponse.json({ ok:false, error: updErr.message }, { status: 400 });

  return NextResponse.json({ ok:true }, { status: 200 });
}
