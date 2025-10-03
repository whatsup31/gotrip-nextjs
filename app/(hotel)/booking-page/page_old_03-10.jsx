// app/(hotel)/booking-page/page.jsx

import CallToActions from "@/components/common/CallToActions";
import Header11 from "@/components/header/header-11";
import DefaultFooter from "@/components/footer/default";
import StepperBooking from "@/components/booking-page/stepper-booking";
import { supabaseRSC } from "@/utils/supabase-rsc";
import BookingForm from "@/components/booking-page/BookingForm";

export const metadata = {
  title: "Booking",
  description: "Processus de réservation",
};

export default async function Page({ searchParams }) {
  const listingId = Number(searchParams?.listingId);
  if (!listingId) {
    return (
      <>
        <div className="header-margin" />
        <Header11 />
        <section className="pt-40">
          <div className="container">
            <div className="alert alert-danger">
              Paramètre manquant : <code>listingId</code>.
            </div>
          </div>
        </section>
        <DefaultFooter />
      </>
    );
  }

  const supabase = supabaseRSC();
  const { data: listing } = await supabase
    .from("listings")
    .select("id, title, location, price_per_night")
    .eq("id", listingId)
    .single();

  return (
    <>
      <div className="header-margin"></div>
      <Header11 />

      <section className="pt-40 layout-pb-md">
        <div className="container">
          <div className="row y-gap-30">
            <div className="col-lg-7">
              {/* Visuel existant de la template */}
              <StepperBooking />
            </div>

            <aside className="col-lg-5">
              {/* Formulaire réellement connecté */}
              <div className="border-light rounded-4 p-20 bg-light-2">
                {listing ? (
                  <>
                    <h3 className="text-20 fw-700">{listing.title}</h3>
                    <div className="text-14 text-light-1">{listing.location}</div>
                    <div className="text-18 fw-700 mt-10">
                      €{Number(listing.price_per_night || 0).toLocaleString("fr-FR")}
                      <span className="text-14 fw-400"> / nuit</span>
                    </div>
                    <div className="mt-20">
                      <BookingForm listingId={listing.id} pricePerNight={Number(listing.price_per_night || 0)} />
                    </div>
                  </>
                ) : (
                  <div className="text-15">Logement introuvable.</div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <CallToActions />
      <DefaultFooter />
    </>
  );
}
