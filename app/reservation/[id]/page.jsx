// app/reservation/[id]/page.jsx

import { supabaseRSC } from "@/utils/supabase-rsc";
import { notFound } from "next/navigation";
import Header11 from "@/components/header/header-11";
import DefaultFooter from "@/components/footer/default";
import Link from "next/link";

export const metadata = { title: "Confirmation", description: "Booking confirmation" };

export default async function Page({ params }) {
  const id = Number(params?.id);
  if (!id) notFound();

  const supabase = supabaseRSC();
  const { data: r } = await supabase
    .from("reservations")
    .select("id, check_in, check_out, guests, total_amount, status, listing_id, listings:listing_id (title, location)")
    .eq("id", id)
    .single();

  if (!r) notFound();

  return (
    <>
      <div className="header-margin" />
      <Header11 />
      <section className="pt-40 pb-40">
        <div className="container">
          <h1 className="text-24 fw-700">Réservation #{r.id}</h1>
          <p className="mt-5">{r.listings?.title} — {r.listings?.location}</p>
          <p className="mt-5">Du {r.check_in} au {r.check_out} — {r.guests} voyageur(s)</p>
          <p className="mt-10 fw-700">Total: €{Number(r.total_amount||0).toLocaleString("fr-FR")}</p>
          <p className="mt-10">Statut: {r.status}</p>
          <div className="mt-20 text-14 text-light-1">Paiement simulé — aucun débit réel.</div>
        </div>
		<div className="mt-30">
			<Link href="/traveler-dashboard/booking" className="button -dark-1 bg-blue-1 text-white px-20 py-10">
			Voir mes réservations
			<i className="icon-arrow-top-right ml-10" />
			</Link>
		</div>
      </section>
      <DefaultFooter />
    </>
  );
}
