// components/hotel-list/hotel-list-v3/HotelProperties.jsx
"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination as SwiperPagination } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";

export default function HotelProperties({ listings = [] }) {
  if (!Array.isArray(listings) || listings.length === 0) {
    return (
      <div className="col-12">
        <div className="border-top-light pt-20">
          <div className="px-20 py-20 rounded-4 border-1">
            Aucun logement trouvé.
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {listings.map((item) => {
        const photos = Array.isArray(item?.photos) ? item.photos.filter(Boolean) : [];
        const slides = photos.length ? photos.slice(0, 5) : ["/img/placeholder.jpg"];
        const price = Number(item?.price_per_night ?? 0);

        return (
          <div className="col-12" key={item?.id}>
            <div className="border-top-light pt-20">
              <div className="row x-gap-20 y-gap-20">
                {/* Image / slider */}
                <div className="col-md-auto">
                  <div className="cardImage ratio ratio-1:1 w-200 md:w-1/1 rounded-4">
                    <div className="cardImage__content custom_inside-slider">
                      <Swiper
                        className="mySwiper"
                        modules={[SwiperPagination, Navigation]}
                        pagination={{ clickable: true }}
                        navigation
                      >
                        {slides.map((src, i) => (
                          <SwiperSlide key={i}>
                            <Image
                              width={200}
                              height={200}
                              src={src}
                              alt={item?.title || "listing"}
                              className="w-100"
                            />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>

                    <div className="cardImage__wishlist">
                      <button className="button -blue-1 bg-white size-30 rounded-full shadow-2" aria-label="wishlist">
                        <i className="icon-heart text-12" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Infos */}
                <div className="col-md">
                  <h3 className="text-16 lh-17 fw-500">
                    {item?.title}
                    <br className="lg:d-none" /> {item?.location}
                  </h3>

                  {/* Badges (amenities) */}
                  <div className="row x-gap-10 y-gap-10 pt-20">
                    {(item?.amenities ?? []).slice(0, 4).map((a, i) => (
                      <div className="col-auto" key={i}>
                        <div className="border-light rounded-100 py-5 px-20 text-14 lh-14">{a}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prix + CTA */}
                <div className="col-md-auto text-right md:text-left">
                  <div className="text-14 text-light-1 mt-10">
                    <span className="text-22 lh-12 fw-600 text-dark-1 ml-5">
                      €{price.toLocaleString("fr-FR")}
                    </span>{" "}
                    / nuit
                  </div>

                  <Link
                    href={`/hotel-single-v2/${item.id}`}
                    className="button py-10 px-20 -dark-1 bg-blue-1 text-white mt-10"
                  >
                    Voir la dispo <div className="icon-arrow-top-right ml-15"></div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
