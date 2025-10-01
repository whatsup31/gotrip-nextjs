"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const PopularRoutes = () => {
  const rentalRoutes = [
    { id: 1, img: "/img/rentals/1.png", destination: "Istanbul - New York", tripType: "Round-trip", date: "Wed, Jun 1 - Sun, Jun 5", price: "72", delayAnimation: "100" },
    { id: 2, img: "/img/rentals/2.png", destination: "Istanbul - Paris", tripType: "Round-trip", date: "Wed, Jun 1 - Sun, Jun 5", price: "72", delayAnimation: "200" },
    { id: 3, img: "/img/rentals/3.png", destination: "Istanbul - Antalya", tripType: "Round-trip", date: "Wed, Jun 1 - Sun, Jun 5", price: "72", delayAnimation: "300" },
    { id: 4, img: "/img/rentals/4.png", destination: "Istanbul - London", tripType: "Round-trip", date: "Wed, Jun 1 - Sun, Jun 5", price: "72", delayAnimation: "400" },
    { id: 5, img: "/img/rentals/1.png", destination: "Istanbul - New York", tripType: "Round-trip", date: "Wed, Jun 1 - Sun, Jun 5", price: "72", delayAnimation: "500" },
    { id: 6, img: "/img/rentals/2.png", destination: "Istanbul - Paris", tripType: "Round-trip", date: "Wed, Jun 1 - Sun, Jun 5", price: "72", delayAnimation: "600" },
  ];

  return (
    <>
      <Swiper
        modules={[Navigation]}
        spaceBetween={30}
        loop
        navigation={{ nextEl: ".js-routes_next", prevEl: ".js-routes_prev" }}
        breakpoints={{
          500: { slidesPerView: 2, spaceBetween: 20 },
          768: { slidesPerView: 2, spaceBetween: 22 },
          1024: { slidesPerView: 3 },
          1200: { slidesPerView: 4 },
        }}
      >
        {rentalRoutes.map((item) => (
          <SwiperSlide key={item.id}>
            {/* Carte cliquable + bouton en bas à droite */}
            <div className="rentalCard -type-2" data-aos="fade" data-aos-delay={item.delayAnimation} style={{ position: "relative" }}>
              {/* Image cliquable */}
              <Link href="/rental-list-v2" className="rentalCard__image">
                <div className="cardImage ratio ratio-6:5">
                  <div className="cardImage__content">
                    <Image width={300} height={250} className="rounded-4 col-12" src={item.img} alt={item.destination} />
                  </div>
                </div>
              </Link>

              {/* Contenu cliquable (titre) */}
              <div className="rentalCard__content mt-10">
                <h4 className="rentalCard__title text-dark-1 text-18 lh-16 fw-500">
                  <Link href="/rental-list-v2">
                    <span>{item.destination}</span>
                  </Link>
                </h4>

                <div className="d-flex items-center text-light-1">
                  <div className="text-14">{item.tripType}</div>
                  <div className="size-3 bg-light-1 rounded-full ml-10 mr-10" />
                  <div className="text-14">{item.date}</div>
                </div>

                {/* Footer prix + bouton */}
                <div className="d-flex items-center justify-between mt-10">
                  <div className="text-light-1">
                    <span className="fw-500 text-dark-1">US${item.price}</span>
                    <span> / per night</span>
                  </div>

                  {/* Bouton en bas à droite, même style que “Réserver” */}
                  <Link
                    href="/rental-list-v2"
                    className="button -md -dark-1 bg-blue-1 text-white"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Ajouter
                    <i className="icon-plus ml-10" />
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* flèches */}
      <button className="section-slider-nav -prev flex-center button -blue-1 bg-white text-dark-1 size-40 rounded-full shadow-1 sm:d-none js-routes_prev">
        <i className="icon icon-chevron-left text-12" />
      </button>
      <button className="section-slider-nav -next flex-center button -blue-1 bg-white text-dark-1 size-40 rounded-full shadow-1 sm:d-none js-routes_next">
        <i className="icon icon-chevron-right text-12" />
      </button>
    </>
  );
};

export default PopularRoutes;
