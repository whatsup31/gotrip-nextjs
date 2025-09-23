// components/hotel-list/hotel-list-v1/HotelProperties.jsx
"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination as SwiperPagination } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";

export default function HotelProperties({ listings = [] }) {
  return (
    <>
      {listings.map((item) => {
        const cover = (Array.isArray(item?.photos) && item.photos[0]) || "/img/placeholder.jpg";
        return (
          <div className="col-12" key={item?.id}>
            <div className="border-top-light pt-20">
              <div className="row x-gap-20 y-gap-20">
                <div className="col-md-auto">
                  <div className="cardImage ratio ratio-1:1 w-200 md:w-1/1 rounded-4">
                    <div className="cardImage__content custom_inside-slider">
                      <Swiper className="mySwiper" modules={[SwiperPagination, Navigation]} pagination={{ clickable: true }} navigation>
                        <SwiperSlide>
                          <Image width={200} height={200} src={cover} alt={item?.title || "listing"} className="w-100" />
                        </SwiperSlide>
                      </Swiper>
                    </div>
                    <div className="cardImage__wishlist">
                      <button className="button -blue-1 bg-white size-30 rounded-full shadow-2">
                        <i className="icon-heart text-12"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="col-md">
                  <h3 className="text-16 lh-17 fw-500">
                    {item?.title}
                    <br className="lg:d-none" /> {item?.location}
                  </h3>

                  {/* badges d'exemple : on peut mapper item.amenities si tu veux */}
                  <div className="row x-gap-10 y-gap-10 pt-20">
                    {(item?.amenities ?? []).slice(0, 3).map((a, i) => (
                      <div className="col-auto" key={i}>
                        <div className="border-light rounded-100 py-5 px-20 text-14 lh-14">{a}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="col-md-auto text-right md:text-left">
                  <div className="text-14 text-light-1 mt-10">
                    <span className="text-22 lh-12 fw-600 text-dark-1 ml-5">
                      €{Number(item?.price_per_night ?? 0).toLocaleString("fr-FR")}
                    </span>{" "}
                    / nuit
                  </div>

                  <Link href={`/hotel-single-v2/${item.id}`} className="button py-10 px-20 -dark-1 bg-blue-1 text-white mt-10">
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
