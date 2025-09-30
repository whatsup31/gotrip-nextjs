// components/services/TopServicesV2.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import isTextMatched from "@/utils/isTextMatched";
import { createClient } from "@supabase/supabase-js";

// Supabase public client
const supabase =
  typeof window !== "undefined" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ? createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      )
    : null;

// helpers
const toArr = (v) => (Array.isArray(v) ? v : []);
const normalizeImages = (imgs) => toArr(imgs).map(String).filter(Boolean);

export default function TopServicesV2() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        if (!supabase) {
          setItems([]);
          return;
        }

        // adapte les colonnes à ton schéma (cf. screenshot)
        const { data, error } = await supabase
          .from("services")
          .select(
            "id,title,description,price,category,area,rating_avg,images"
          )
          .order("created_at", { ascending: false })
          .limit(12);

        if (error) throw error;

        const mapped = toArr(data).map((s, idx) => ({
          id: s.id,
          title: s.title || "Service",
          location: s.area || "",                 // même emplacement que Hotels3 -> "location"
          price: s.price ?? 0,
          tag: s.category || "",
          ratings: s.rating_avg ?? 4.8,
          numberOfReviews: 12,                    // valeur de démo pour garder le rendu
          slideImg: (() => {
            const imgs = normalizeImages(s.images);
            return imgs.length ? imgs.slice(0, 5) : ["/img/services/placeholder.jpg"];
          })(),
          delayAnimation: (idx % 5) * 50,
        }));

        if (!alive) return;
        setItems(mapped);
      } catch (e) {
        console.error("load services error:", e);
        if (!alive) return;
        setItems([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
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
          nextEl: ".js-topservices-next",
          prevEl: ".js-topservices-prev",
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
              href={`/service/${item.id}`} // adapte si ta route diffère
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
                              alt={`${item.title} - ${i + 1}`}
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
{/* 
                <div className="cardImage__leftBadge">
                  <div
                    className={`py-5 px-15 rounded-right-4 text-12 lh-16 fw-500 uppercase ${
                      isTextMatched(item.tag, "massage")
                        ? "bg-dark-1 text-white"
                        : ""
                    } ${
                      isTextMatched(item.tag, "visite")
                        ? "bg-blue-1 text-white"
                        : ""
                    } ${
                      isTextMatched(item.tag, "dégustation")
                        ? "bg-brown-1 text-white"
                        : ""
                    } ${
                      isTextMatched(item.tag, "top")
                        ? "bg-yellow-1 text-dark-1"
                        : ""
                    }`}
                  >
                    {item.tag}
                  </div>
                </div>
*/}
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
                    À partir de{" "}
                    <span className="text-blue-1">
                      €{item.price}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      <button className="section-slider-nav -prev flex-center button -blue-1 bg-white shadow-1 size-40 rounded-full sm:d-none js-topservices-prev">
        <i className="icon icon-chevron-left text-12" />
      </button>
      <button className="section-slider-nav -next flex-center button -blue-1 bg-white shadow-1 size-40 rounded-full sm:d-none js-topservices-next">
        <i className="icon icon-chevron-right text-12" />
      </button>
    </>
  );
}
