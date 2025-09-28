// app/checkout/page.jsx
import { supabaseRSC } from "@/utils/supabase-rsc";
import { notFound } from "next/navigation";
import CheckoutForm from "@/components/checkout/CheckoutForm";

export const metadata = { title: "Checkout", description: "Simulate booking" };

export default async function Page({ searchParams }) {
  const listingId = Number(searchParams?.listingId);
  if (!listingId) notFound();

  const supabase = supabaseRSC();
  const { data: listing } = await supabase
    .from("listings")
    .select("id, title, location, price_per_night")
    .eq("id", listingId)
    .single();

  if (!listing) notFound();

  return (
    <div className="container py-40">
      <h1 className="text-24 fw-700">Réservation</h1>
      <p className="mt-5">{listing.title} — {listing.location}</p>
      <p className="mt-5">Tarif: €{Number(listing.price_per_night||0).toLocaleString("fr-FR")} / nuit</p>

      <div className="mt-30">
        <CheckoutForm listingId={listing.id} />
      </div>
    </div>
  );
}
