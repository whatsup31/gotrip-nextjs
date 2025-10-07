// /components/hotels/Hotels3.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
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
        // Lecture directe dans la table listings
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

        const mapped = toArray(data).map((it, idx) => ({
          id: it.id,
          title: it.title || "Listing",
          location: it.location || "",
          price: it.price_per_night ?? 0,
          tag: "",

          slideImg: (() => {
            const arr = normalizePhotos(it.photos);
            return arr.length ? arr.slice(0, 5) : ["/img/hotels/1.jpg"];
          })(),

          ratings: 4.8,
          numberOfReviews: 12,
          delayAnimation: (idx % 5) * 50,
        }));

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
        {slides.map((item) => (
          <SwiperSlide key={item.id}>
            <Link
              href={`/hotel-single-v2/${item.id}`}
              className="hotelsCard -type-1 hover-inside-slider"
              data-aos="fade"
              data-aos-delay={item.delayAnimation}
            >
              <div className="hotelsCard__image">
                <div className="cardImage ratio ratio-1:1">
                  <div className="cardImage__content">
                    <div className="cardImage-slider rounded-4 overflow-hidden custom_inside-slider">
                      <Swiper
                        className="mySwiper"
                        modules={[Pagination, Navigation]}
                        pagination={{ clickable: true }}
                        navigation={true}
                      >
                        {item.slideImg.map((src, i) => (
                          <SwiperSlide key={i}>
                            <Image
                              width={300}
                              height={300}
                              className="rounded-4 col-12 js-lazy"
                              src={src}
                              alt={`image ${i + 1}`}
                            />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                  </div>
                </div>

                <div className="cardImage__wishlist">
                  <button className="button -blue-1 bg-white size-30 rounded-full shadow-2">
                    <i className="icon-heart text-12" />
                  </button>
                </div>

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
              </div>

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
        ))}
      </Swiper>

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
