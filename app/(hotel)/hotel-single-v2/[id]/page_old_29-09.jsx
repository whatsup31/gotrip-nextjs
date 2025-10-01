// app/(hotel)/hotel-single-v2/[id]/page.jsx
import "photoswipe/dist/photoswipe.css";
import DefaultHeader from "@/components/header/default-header";
import DefaultFooter from "@/components/footer/default";
import FilterBox2 from "@/components/hotel-single/filter-box-2";
import { notFound } from "next/navigation";
//import { supabaseServer } from "@/utils/supabase-server"; // même util que pour les routes API
import { supabaseRSC } from "@/utils/supabase-rsc";

import Link from "next/link";

export const metadata = {
  title: "Logement | Détail",
  description: "Fiche logement avec données Supabase",
};

export default async function HotelSingleV2Page({ params }) {
  const id = Number(params?.id);
  if (!id || Number.isNaN(id)) notFound();

  //const supabase = supabaseServer();
  const supabase = supabaseRSC();

  const { data: item, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !item) notFound();

  // Photos: on traitera dans un second temps → on ignore pour l’instant
  const amenities = Array.isArray(item?.amenities) ? item.amenities : [];

  return (
    <>
      <div className="header-margin" />
      <DefaultHeader />

      {/* Bandeau filtre (optionnel) */}
      <div className="py-10 bg-dark-2">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <FilterBox2 />
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal : infos réelles du logement */}
      <section className="pt-40">
        <div className="container">
          <div className="row y-gap-30">
            <div className="col-12">
              <h1 className="text-30 fw-600">{item.title}</h1>
              <div className="text-16 text-light-1 mt-5">{item.location}</div>
            </div>

            <div className="col-lg-8">
              <div className="border-light rounded-4 p-30">
                <h3 className="text-20 fw-600 mb-10">Description</h3>
                <p className="text-15">{item.description || "—"}</p>

                <div className="mt-30">
                  <h3 className="text-20 fw-600 mb-10">Équipements</h3>
                  {amenities.length === 0 ? (
                    <div className="text-15 text-light-1">Aucun équipement déclaré.</div>
                  ) : (
                    <div className="row x-gap-10 y-gap-10">
                      {amenities.map((a, i) => (
                        <div key={i} className="col-auto">
                          <span className="border-light rounded-100 py-5 px-15 text-14 lh-14">{a}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <aside className="col-lg-4">
              <div className="border-light rounded-4 p-30 bg-light-2">
                <div className="text-14 text-light-1">Tarif</div>
                <div className="text-28 fw-700 mt-5">
                  €{Number(item.price_per_night || 0).toLocaleString("fr-FR")}
                  <span className="text-14 fw-400"> / nuit</span>
                </div>	
                <Link href={`/booking-page?listingId=${item.id}`} className="button -dark-1 bg-blue-1 text-white w-100 mt-20">
					Réserver <i className="icon-arrow-right ml-10" />
				</Link>
                <div className="text-13 text-light-1 mt-15">
                  Paiement à l’étape suivante.
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <DefaultFooter />
    </>
  );
}
