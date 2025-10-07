// /components/hotels/Hotels3.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import isTextMatched from "../../utils/isTextMatched";
import { createClient } from "@supabase/supabase-js";

// --- Supabase client public (clé NEXT_PUBLIC_*) ---
const supabase =
  typeof window !== "undefined" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ? createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      )
    : null;

// --- helpers ---
const toArray = (v) => (Array.isArray(v) ? v : []);
const normalizePhotos = (photos) =>
  toArray(photos).map((s) => String(s)).filter(Boolean);

const Hotels3 = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        if (!supabase) {
          console.warn("Supabase env vars manquantes, aucun fetch effectué.");
          setItems([]);
          return;
        }

        const { data, error } = await supabase
          .from("listings")
          .select("id,title,location,price_per_night,photos,amenities")
          .order("created_at", { ascending: false })
          .limit(12);

        if (error) throw error;

        const mapped = toArray(data).map((it, idx) => {
          const arr = normalizePhotos(it.photos);
          return {
            id: it.id,
            title: it.title || "Listing",
            location: it.location || "",
            price: it.price_per_night ?? 0,
            tag: "",
            // on garde le tableau existant pour compat, mais on affichera seulement la première image
            slideImg: arr.length ? arr.slice(0, 5) : ["/img/hotels/1.jpg"],
            ratings: 4.8,
            numberOfReviews: 12,
            delayAnimation: (idx % 5) * 50,
          };
        });

        if (!alive) return;
        setItems(mapped);
      } catch (e) {
        console.error("Failed to load listings:", e);
        if (!alive) return;
        setItems([]);
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, []);

  const slides = useMemo(() => items, [items]);

  if (loading) {
    return (
      <div className="d-flex justify-center py-40">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <>
      <Swiper
        spaceBetween={30}
        modules={[Navigation]}
        navigation={{
          nextEl: ".js-filter2-next",
          prevEl: ".js-filter2-prev",
        }}
        breakpoints={{
          540: { slidesPerView: 2, spaceBetween: 20 },
          768: { slidesPerView: 2, spaceBetween: 22 },
          1024: { slidesPerView: 3 },
          1200: { slidesPerView: 4 },
        }}
      >
        {slides.map((item) => {
          const cover = item.slideImg?.[0] || "/img/hotels/1.jpg";
          return (
            <SwiperSlide key={item.id}>
              <Link
                href={`/hotel-single-v2/${item.id}`}
                className="hotelsCard -type-1 hover-inside-slider"
                data-aos="fade"
                data-aos-delay={item.delayAnimation}
              >
                {/* Image UNIQUE, pas de slider interne */}
                <div className="hotelsCard__image">
                  <div className="cardImage ratio ratio-1:1">
                    <div className="cardImage__content">
                      <img
                        src={cover}
                        alt={item.title || "Listing"}
                        className="rounded-4 col-12 js-lazy"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover", // remplit, zoom/crop propre
                          display: "block",
                        }}
                      />
                    </div>
                  </div>

                  {/* Wishlist */}
                  <div className="cardImage__wishlist">
                    <button
                      className="button -blue-1 bg-white size-30 rounded-full shadow-2"
                      type="button"
                      onClick={(e) => e.preventDefault()}
                    >
                      <i className="icon-heart text-12" />
                    </button>
                  </div>

                  {/* Badge éventuel */}
                  {item.tag ? (
                    <div className="cardImage__leftBadge">
                      <div
                        className={`py-5 px-15 rounded-right-4 text-12 lh-16 fw-500 uppercase ${
                          isTextMatched(item.tag, "breakfast included")
                            ? "bg-dark-1 text-white"
                            : ""
                        } ${
                          isTextMatched(item.tag, "best seller")
                            ? "bg-blue-1 text-white"
                            : ""
                        } ${
                          isTextMatched(item.tag, "-25% today")
                            ? "bg-brown-1 text-white"
                            : ""
                        } ${
                          isTextMatched(item.tag, "top rated")
                            ? "bg-yellow-1 text-dark-1"
                            : ""
                        }`}
                      >
                        {item.tag}
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* Contenu carte */}
                <div className="hotelsCard__content mt-10">
                  <h4 className="hotelsCard__title text-dark-1 text-18 lh-16 fw-500">
                    <span>{item.title}</span>
                  </h4>
                  <p className="text-light-1 lh-14 text-14 mt-5">{item.location}</p>

                  <div className="d-flex items-center mt-20">
                    <div className="flex-center bg-blue-1 rounded-4 size-30 text-12 fw-600 text-white">
                      {item.ratings}
                    </div>
                    <div className="text-14 text-dark-1 fw-500 ml-10">Exceptional</div>
                    <div className="text-14 text-light-1 ml-10">
                      {item.numberOfReviews} reviews
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="fw-500">
                      Starting from <span className="text-blue-1">€{item.price}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* flèches carrousel */}
      <button className="section-slider-nav -prev flex-center button -blue-1 bg-white shadow-1 size-40 rounded-full sm:d-none js-filter2-prev">
        <i className="icon icon-chevron-left text-12" />
      </button>
      <button className="section-slider-nav -next flex-center button -blue-1 bg-white shadow-1 size-40 rounded-full sm:d-none js-filter2-next">
        <i className="icon icon-chevron-right text-12" />
      </button>
    </>
  );
};

export default Hotels3;
