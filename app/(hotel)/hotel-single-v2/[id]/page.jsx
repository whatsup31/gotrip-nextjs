// app/(hotel)/hotel-single-v2/[id]/page.jsx
import "photoswipe/dist/photoswipe.css";

import DefaultHeader from "@/components/header/default-header";
import DefaultFooter from "@/components/footer/default";

import FilterBox2 from "@/components/hotel-single/filter-box-2";
import StickyHeader2 from "@/components/hotel-single/StickyHeader2";
import TopBreadCrumb from "@/components/hotel-single/TopBreadCrumb";
import GalleryTwo from "@/components/hotel-single/GalleryTwo";
import RatingTag from "@/components/hotel-single/RatingTag";
import Facilities from "@/components/hotel-single/Facilities";

import ReviewProgress2 from "@/components/hotel-single/guest-reviews/ReviewProgress2";
import DetailsReview2 from "@/components/hotel-single/guest-reviews/DetailsReview2";
import ReplyForm from "@/components/hotel-single/ReplyForm";
import ReplyFormReview2 from "@/components/hotel-single/ReplyFormReview2";

import Surroundings from "@/components/hotel-single/Surroundings";
import HelpfulFacts from "@/components/hotel-single/HelpfulFacts";
import CallToActions from "@/components/common/CallToActions";

import AvailableServices from "@/components/hotel-single/AvailableServices";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseRSC } from "@/utils/supabase-rsc";

export const metadata = {
  title: "Logement | Détail",
  description: "Fiche logement avec données Supabase + services (POC)",
};

/** POC: sélection de services “pertinents”
 * mélange + tri prix croissant si dispo, limite 6
 */
function selectRelevantServices(allServices, listing, limit = 6) {
  if (!Array.isArray(allServices)) return [];
  const shuffled = [...allServices].sort(() => Math.random() - 0.5);
  shuffled.sort((a, b) => {
    const pa = Number(a.price);
    const pb = Number(b.price);
    const aa = Number.isFinite(pa) ? pa : Number.POSITIVE_INFINITY;
    const bb = Number.isFinite(pb) ? pb : Number.POSITIVE_INFINITY;
    return aa - bb;
  });
  return shuffled.slice(0, limit);
}

export default async function HotelSingleV2Page({ params }) {
  const id = Number(params?.id);
  if (!id || Number.isNaN(id)) notFound();

  const supabase = supabaseRSC();

  // 1) Listing
  const { data: item, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !item) notFound();

  // 2) Services (non liés → POC)
  let services = [];
  try {
    const { data: allServices } = await supabase.from("services").select("*");
    services = selectRelevantServices(allServices || [], item, 6);
  } catch {
    services = [];
  }

  const amenities = Array.isArray(item?.amenities) ? item.amenities : [];
  const avgRating = Number(item?.avg_rating) || Number(item?.rating) || 4.8;
  const reviewsCount = Number(item?.reviews_count) || 0;

  // On NE traite pas ici les photos : on passe `item.photos` tel quel et la Gallery s’occupe de normaliser.
  const hotel = {
    id: item.id,
    name: item.title,
    title: item.title,
    location: item.location || item.city || "",
    address: item.address || "",
    description: item.description || "",
    price: Number(item.price_per_night || 0),
    photos: item.photos,    // <— JSONB: ['.../10.1.jpg','.../10.2.jpg',...]
    rating: avgRating,
    reviews: reviewsCount,
    amenities,
    services,
  };

  return (
    <>
      <div className="header-margin" />
      <DefaultHeader />

      <div className="py-10 bg-dark-2">
        <div className="container">
          <div className="row"><div className="col-12"><FilterBox2 /></div></div>
        </div>
      </div>

      <StickyHeader2 hotel={hotel} />
      <TopBreadCrumb />

      {/* Galerie d’images – utilise `hotel.photos` */}
      <GalleryTwo hotel={hotel} />

      <section className="pt-30">
        <div className="container">
          <div className="row y-gap-30"><div className="col-12"><RatingTag /></div></div>
        </div>
      </section>

      {/* Services proposés */}
      <section id="services" className="pt-30">
        <div className="container">
          <AvailableServices services={hotel.services} />
        </div>
      </section>

      {/* Facilities */}
      <section className="mt-40" id="facilities">
        <div className="container">
          <div className="row x-gap-40 y-gap-40">
            <div className="col-12">
              <h3 className="text-22 fw-500">Facilities of this Hotel</h3>
              <div className="row x-gap-40 y-gap-40 pt-20"><Facilities /></div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mt-40 mb-40"><div className="border-top-light" /></div>

      {/* Reviews */}
      <section className="pt-40" id="reviews">
        <div className="container">
          <div className="row y-gap-40 justify-between">
            <div className="col-xl-3">
              <h3 className="text-22 fw-500">Guest reviews</h3>
              <ReviewProgress2 />
            </div>
            <div className="col-xl-8"><DetailsReview2 /></div>
          </div>
        </div>
      </section>

      <div className="container mt-40 mb-40"><div className="border-top-light" /></div>

      {/* Reply */}
      <section>
        <div className="container">
          <div className="row y-gap-30 justify-between">
            <div className="col-xl-3">
              <h3 className="text-22 fw-500">Leave a Reply</h3>
              <p className="text-15 text-dark-1 mt-5">Your email address will not be published.</p>
              <ReplyFormReview2 />
            </div>
            <div className="col-xl-8"><ReplyForm /></div>
          </div>
        </div>
      </section>

      {/* Health & safety */}
      <section className="pt-40">
        <div className="container">
          <div className="row"><div className="col-12">
            <div className="px-24 py-20 rounded-4 bg-light-2">
              <div className="row x-gap-20 y-gap-20 items-center">
                <div className="col-auto"><div className="flex-center size-60 rounded-full bg-white">
                  <Image width={30} height={30} src="/img/icons/health.svg" alt="icon" /></div></div>
                <div className="col-auto">
                  <h4 className="text-18 lh-15 fw-500">Extra health &amp; safety measures</h4>
                  <div className="text-15 lh-15">
                    This property has taken extra health and hygiene measures to ensure that your safety is their priority
                  </div>
                </div>
              </div>
            </div>
          </div></div>
        </div>
      </section>

      {/* Surroundings */}
      <section className="pt-40">
        <div className="container">
          <div className="row"><div className="col-12"><h3 className="text-22 fw-500">Hotel surroundings</h3></div></div>
          <div className="row x-gap-50 y-gap-30 pt-20"><Surroundings /></div>
        </div>
      </section>

      {/* Helpful facts */}
      <section className="pt-40">
        <div className="container">
          <div className="pt-40 border-top-light">
            <div className="row"><div className="col-12"><h3 className="text-22 fw-500">Some helpful facts</h3></div></div>
            <div className="row x-gap-50 y-gap-30 pt-20"><HelpfulFacts /></div>
          </div>
        </div>
      </section>

      {/* Booking quick box */}
      <section className="pt-30">
        <div className="container">
          <div className="row y-gap-30"><aside className="col-lg-4 ml-auto">
            <div className="border-light rounded-4 p-30 bg-light-2">
              <div className="text-14 text-light-1">Tarif</div>
              <div className="text-28 fw-700 mt-5">
                €{Number(item.price_per_night || 0).toLocaleString("fr-FR")}
                <span className="text-14 fw-400"> / nuit</span>
              </div>
              <Link href={`/booking-page?listingId=${item.id}`} className="button -dark-1 bg-blue-1 text-white w-100 mt-20">
                Réserver <i className="icon-arrow-top-right ml-10" />
              </Link>
              <div className="text-13 text-light-1 mt-15">Paiement à l’étape suivante.</div>
            </div>
          </aside></div>
        </div>
      </section>

      <CallToActions />
      <DefaultFooter />
    </>
  );
}
