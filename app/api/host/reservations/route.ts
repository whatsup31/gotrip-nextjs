// app/api/host/reservations/route.ts

import { NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabase-server";

export async function GET(req: Request) {
  const supabase = supabaseServer();
  const { searchParams } = new URL(req.url);

  // Auth courante
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok:false, error:"Not authenticated" }, { status: 401 });

  // Filtres simples (facultatif)
  const q = (searchParams.get("q") || "").trim().toLowerCase();

  const { data, error } = await supabase
    .from("host_reservations")
    .select("*")
    .eq("host_id", user.id)
    .order("reservation_created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ ok:false, error: error.message }, { status: 400 });
  }

  // filtre 'q' (recherche sur titre / location)
  const items = (data || []).filter((r) => {
    if (!q) return true;
    const hay = `${r.listing_title ?? ""} ${r.listing_location ?? ""}`.toLowerCase();
    return hay.includes(q);
  });

  return NextResponse.json({ ok:true, data:{ items } }, { status: 200 });
}
