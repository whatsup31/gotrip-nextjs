// app/(hotel)/booking-page/page.jsx

import CallToActions from "@/components/common/CallToActions";
import Header11 from "@/components/header/header-11";
import DefaultFooter from "@/components/footer/default";
import { supabaseRSC } from "@/utils/supabase-rsc";
import BookingForm from "@/components/booking-page/BookingForm";

export const metadata = {
  title: "Booking",
  description: "Processus de réservation",
};

export default async function Page({ searchParams }) {
  const listingId = Number(searchParams?.listingId);

  const checkin  = searchParams?.checkin || "";
  const checkout = searchParams?.checkout || "";
  const adults   = Number(searchParams?.adults ?? 0);
  const children = Number(searchParams?.children ?? 0);
  const rooms    = Number(searchParams?.rooms ?? 1);
  const guests   = Math.max(1, (adults || 0) + (children || 0));

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
    .select("id, title, location, price_per_night, rating_avg, reviews_count, photos")
    .eq("id", listingId)
    .single();

  return (
    <>
      <div className="header-margin" />
      <Header11 />

      {/* SECTION CENTRÉE + LARGEUR CONFORTABLE */}
      <section className="pt-40 pb-60">
        <div className="container">
          <div className="row justify-center">
            <div className="col-xl-8 col-lg-9 col-md-10">
              {listing ? (
                <BookingForm
                  listingId={listing.id}
                  pricePerNight={Number(listing.price_per_night || 0)}
                  initialCheckIn={checkin}
                  initialCheckOut={checkout}
                  initialGuests={guests}
                  initialRooms={rooms}
                  initialAdults={adults}
                  initialChildren={children}
                  listing={{
                    title: listing.title,
                    location: listing.location,
                    rating_avg: listing.rating_avg,
                    reviews_count: listing.reviews_count,
                    photos: listing.photos,
                  }}
                />
              ) : (
                <div className="text-15">Logement introuvable.</div>
              )}
            </div>
          </div>
        </div>
      </section>

      <CallToActions />
      <DefaultFooter />
    </>
  );
}
