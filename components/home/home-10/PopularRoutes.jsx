"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// util du thème pour comparer les tags (optionnel mais identique à Hotels)
import isTextMatched from "@/utils/isTextMatched";

const PopularRoutes = () => {
  // ⚠️ CONTENU INCHANGÉ
  const rentalRoutes = [
    { id: 1, img: "/img/rentals/1.png", destination: "Istanbul - New York", tripType: "Round-trip", date: "Wed, Jun 1 - Sun, Jun 5", price: "72", delayAnimation: "100", tag: "" },
    { id: 2, img: "/img/rentals/2.png", destination: "Istanbul - Paris",   tripType: "Round-trip", date: "Wed, Jun 1 - Sun, Jun 5", price: "72", delayAnimation: "200", tag: "" },
    { id: 3, img: "/img/rentals/3.png", destination: "Istanbul - Antalya", tripType: "Round-trip", date: "Wed, Jun 1 - Sun, Jun 5", price: "72", delayAnimation: "300", tag: "" },
    { id: 4, img: "/img/rentals/4.png", destination: "Istanbul - London",  tripType: "Round-trip", date: "Wed, Jun 1 - Sun, Jun 5", price: "72", delayAnimation: "400", tag: "" },
    { id: 5, img: "/img/rentals/1.png", destination: "Istanbul - New York", tripType: "Round-trip", date: "Wed, Jun 1 - Sun, Jun 5", price: "72", delayAnimation: "500", tag: "" },
    { id: 6, img: "/img/rentals/2.png", destination: "Istanbul - Paris",   tripType: "Round-trip", date: "Wed, Jun 1 - Sun, Jun 5", price: "72", delayAnimation: "600", tag: "" },
  ];

  return (
    <>
      <Swiper
        spaceBetween={30}
        modules={[Navigation, Pagination]}
        navigation={{
          nextEl: ".js-routes-next",
          prevEl: ".js-routes-prev",
        }}
        pagination={{
          el: ".js-routes-pag",
          clickable: true,
        }}
        breakpoints={{
          540: { slidesPerView: 2, spaceBetween: 20 },
          768: { slidesPerView: 2, spaceBetween: 22 },
          1024: { slidesPerView: 3 },
          1200: { slidesPerView: 4 },
        }}
      >
        {rentalRoutes.map((item) => (
          <SwiperSlide key={item.id}>
            {/* même structure/skins que Hotels */}
            <Link
              href="/rental-list-v2"
              className="hotelsCard -type-1 hover-inside-slider"
              data-aos="fade"
              data-aos-delay={item.delayAnimation}
            >
              <div className="hotelsCard__image">
                <div className="cardImage ratio ratio-1:1">
                  <div className="cardImage__content">
                    {/* slider interne dans la vignette (comme Hotels) */}
                    <div className="cardImage-slider rounded-4 overflow-hidden custom_inside-slider">
                      <Swiper
                        className="mySwiper"
                        modules={[Pagination, Navigation]}
                        pagination={{ clickable: true }}
                        navigation
                      >
                        {/* ton contenu ne fournit qu’une image => on la duplique pour le slider interne */}
                        {[item.img, item.img, item.img].map((slide, i) => (
                          <SwiperSlide key={i}>
                            <Image
                              width={300}
                              height={300}
                              className="rounded-4 col-12 js-lazy"
                              src={slide}
                              alt={item.destination}
                            />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                  </div>
                </div>

                {/* bouton wishlist (identique) */}
                <div className="cardImage__wishlist">
                  <button className="button -blue-1 bg-white size-30 rounded-full shadow-2">
                    <i className="icon-heart text-12" />
                  </button>
                </div>

                {/* badge gauche (identique à Hotels, s’affiche si `tag` non vide) */}
                {item.tag ? (
                  <div className="cardImage__leftBadge">
                    <div
                      className={`py-5 px-15 rounded-right-4 text-12 lh-16 fw-500 uppercase
                        ${isTextMatched(item.tag, "breakfast included") ? "bg-dark-1 text-white" : ""}
                        ${isTextMatched(item.tag, "best seller") ? "bg-blue-1 text-white" : ""}
                        ${isTextMatched(item.tag, "-25% today") ? "bg-brown-1 text-white" : ""}
                        ${isTextMatched(item.tag, "top rated") ? "bg-yellow-1 text-dark-1" : ""}`
                      }
                    >
                      {item.tag}
                    </div>
                  </div>
                ) : null}
              </div>

              {/* contenu identique, mappé sur tes champs */}
              <div className="hotelsCard__content mt-10">
                <h4 className="hotelsCard__title text-dark-1 text-18 lh-16 fw-500">
                  <span>{item.destination}</span>
                </h4>

                <p className="text-light-1 lh-14 text-14 mt-5">
                  {item.tripType}
                  <span className="size-3 bg-light-1 rounded-full mx-10 inline-block" />
                  {item.date}
                </p>

                <div className="d-flex items-center mt-20">
                  <div className="flex-center bg-blue-1 rounded-4 size-30 text-12 fw-600 text-white">
                    4.8
                  </div>
                  <div className="text-14 text-dark-1 fw-500 ml-10">Exceptional</div>
                  <div className="text-14 text-light-1 ml-10">2345 reviews</div>
                </div>

                <div className="mt-5">
                  <div className="fw-500">
                    Starting from <span className="text-blue-1">US${item.price}</span>
                  </div>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* navigation & pagination identiques au composant Hotels */}
      <div className="d-flex x-gap-15 items-center justify-center sm:justify-start pt-40 sm:pt-20">
        <div className="col-auto">
          <button className="d-flex items-center text-24 arrow-left-hover js-routes-prev">
            <i className="icon icon-arrow-left" />
          </button>
        </div>

        <div className="col-auto">
          <div className="pagination -dots text-border js-routes-pag" />
        </div>

        <div className="col-auto">
          <button className="d-flex items-center text-24 arrow-right-hover js-routes-next">
            <i className="icon icon-arrow-right" />
          </button>
        </div>
      </div>
    </>
  );
};

export default PopularRoutes;
