// components/hotel-single/AvailableServices.jsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

/* --------- Utils --------- */
function formatPrice(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return "Prix sur demande";
  return `€${n.toLocaleString("fr-FR")}`;
}

function ensureJpg(src = "") {
  try {
    const url = String(src);
    const last = url.split("/").pop() || "";
    if (!last.includes(".")) return `${url}.jpg`;
    return url;
  } catch {
    return src;
  }
}

// On ne garde qu’UNE image : la première dispo (images[0] -> cover_url -> placeholder)
function coverFrom(service) {
  if (Array.isArray(service?.images) && service.images.length) {
    return ensureJpg(service.images[0]);
  }
  if (service?.cover_url) return ensureJpg(service.cover_url);
  return "/img/others/placeholder.jpg";
}

function badgeClasses(tag = "") {
  const t = String(tag).toLowerCase();
  if (!t) return "";
  if (t.includes("breakfast included")) return "bg-dark-1 text-white";
  if (t.includes("best seller")) return "bg-blue-1 text-white";
  if (t.includes("-25% today")) return "bg-brown-1 text-white";
  if (t.includes("top rated")) return "bg-yellow-1 text-dark-1";
  return "bg-dark-1 text-white";
}
/* ------------------------- */

export default function AvailableServices({
  services = [],
  initialPageSize = 12,
  onSelect,
  title = "Services proposés",
}) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("recommended");

  const filtered = useMemo(() => {
    let arr = Array.isArray(services) ? [...services] : [];

    const needle = q.trim().toLowerCase();
    if (needle) {
      arr = arr.filter((s) => {
        const hay = `${s.title ?? ""} ${s.description ?? ""} ${s.category ?? ""}`.toLowerCase();
        return hay.includes(needle);
      });
    }

    if (sort === "price_asc") {
      arr.sort((a, b) => (Number(a.price) || 9e9) - (Number(b.price) || 9e9));
    } else if (sort === "price_desc") {
      arr.sort((a, b) => (Number(b.price) || -1) - (Number(a.price) || -1));
    } else {
      arr.sort((a, b) => {
        const ra = Number(a.avg_rating) || 0;
        const rb = Number(b.avg_rating) || 0;
        if (rb !== ra) return rb - ra;
        const pa = Number(a.price);
        const pb = Number(b.price);
        const aa = Number.isFinite(pa) ? pa : 9e9;
        const bb = Number.isFinite(pb) ? pb : 9e9;
        if (aa !== bb) return aa - bb;
        return String(a.title || "").localeCompare(String(b.title || ""));
      });
    }

    return arr.slice(0, initialPageSize);
  }, [services, q, sort, initialPageSize]);

  return (
    <section className="layout-pt-md layout-pb-lg">
      <div className="container">
        {/* Header */}
        <div className="row y-gap-10 justify-between items-end">
          <div className="col-auto">
            <div className="sectionTitle -md">
              <h2 className="sectionTitle__title">{title}</h2>
              <p className="sectionTitle__text mt-5 sm:mt-0">
                {filtered.length} service{filtered.length > 1 ? "s" : ""} disponibles
              </p>
            </div>
          </div>
          <div className="col-sm-auto">
            <div className="row x-gap-10">
              <div className="col-auto">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Rechercher un service…"
                  className="form-control h-50 rounded-200 px-20"
                  style={{ minWidth: 240 }}
                  aria-label="Rechercher un service"
                />
              </div>
              <div className="col-auto">
                <div className="dropdown js-dropdown js-category-active">
                  <div
                    className="dropdown__button d-flex items-center rounded-200 border-light px-20 h-50"
                    data-bs-toggle="dropdown"
                    data-bs-auto-close="true"
                    aria-expanded="false"
                    role="button"
                  >
                    <span className="js-dropdown-title">
                      {sort === "recommended" ? "Pertinence" : sort === "price_asc" ? "Prix ↑" : "Prix ↓"}
                    </span>
                    <i className="icon-chevron-down ml-10 text-10" />
                  </div>
                  <div className="dropdown-menu">
                    <div className="px-20 py-10">
                      <button className={`dropdown-item ${sort === "recommended" ? "active" : ""}`} onClick={() => setSort("recommended")}>Pertinence</button>
                      <button className={`dropdown-item ${sort === "price_asc" ? "active" : ""}`} onClick={() => setSort("price_asc")}>Prix (croissant)</button>
                      <button className={`dropdown-item ${sort === "price_desc" ? "active" : ""}`} onClick={() => setSort("price_desc")}>Prix (décroissant)</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carrousel (cartes style “Hotels”, SANS slider photo) */}
        <div className="relative overflow-hidden pt-40 sm:pt-20">
          <Swiper
            spaceBetween={30}
            modules={[Navigation, Pagination]}
            navigation={{ nextEl: ".js-services-next", prevEl: ".js-services-prev" }}
            pagination={{ el: ".js-services-pag", clickable: true }}
            breakpoints={{
              540: { slidesPerView: 2, spaceBetween: 20 },
              768: { slidesPerView: 2, spaceBetween: 22 },
              1024: { slidesPerView: 3 },
              1200: { slidesPerView: 4 },
            }}
          >
            {filtered.map((s) => {
              const href = `/services/${s.id}`;
              const cover = coverFrom(s);
              const rating = Number(s?.avg_rating ?? 0);
              const reviews = Number(s?.reviews_count ?? 0);
              const tag = s?.tag || "";
              const priceText = formatPrice(s?.price);

              return (
                <SwiperSlide key={s.id}>
                  <div className="hotelsCard -type-1 hover-inside-slider" data-aos="fade">
                    {/* Image UNIQUE (remplit le cadre, zoom si nécessaire) */}
                    <div className="hotelsCard__image">
                      <div className="cardImage ratio ratio-1:1">
                        <div className="cardImage__content">
                          <img
                            src={cover}
                            alt={s.title || "Service"}
                            className="rounded-4 col-12 js-lazy"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",   // ← remplit le cadre (zoom/crop propre)
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

                      {/* Badge (si présent) */}
                      {tag ? (
                        <div className="cardImage__leftBadge">
                          <div className={`py-5 px-15 rounded-right-4 text-12 lh-16 fw-500 uppercase ${badgeClasses(tag)}`}>
                            {tag}
                          </div>
                        </div>
                      ) : null}
                    </div>

                    {/* Contenu */}
                    <div className="hotelsCard__content mt-10">
                      <h4 className="hotelsCard__title text-dark-1 text-18 lh-16 fw-500">
                        <span>{s.title}</span>
                      </h4>

                      <p className="text-light-1 lh-14 text-14 mt-5">
                        {s.category || "Service"}
                        {s.duration ? (
                          <>
                            <span className="size-3 bg-light-1 rounded-full mx-10 inline-block" />
                            ~ {s.duration}
                          </>
                        ) : null}
                      </p>

                      <div className="d-flex items-center mt-20">
                        <div className="flex-center bg-blue-1 rounded-4 size-30 text-12 fw-600 text-white">
                          {rating ? rating.toFixed(1) : "4.8"}
                        </div>
                        <div className="text-14 text-dark-1 fw-500 ml-10">Exceptional</div>
                        <div className="text-14 text-light-1 ml-10">{reviews || 0} reviews</div>
                      </div>

                      {/* Footer prix + CTA “Select Room” */}
                      <div className="d-flex items-center justify-between mt-10">
                        <div className="fw-500">
                          Starting from <span className="text-blue-1">{priceText}</span>
                        </div>

                        <Link
                          href={href}
                          className="button -md -dark-1 bg-blue-1 text-white"
                          onClick={(e) => {
                            if (typeof onSelect === "function") {
                              e.preventDefault();
                              onSelect(s);
                            }
                          }}
                          style={{ whiteSpace: "nowrap" }}
                        >
                          Ajouter
                          <i className="icon-plus ml-10" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* flèches + pagination */}
          <div className="d-flex x-gap-15 items-center justify-center sm:justify-start pt-40 sm:pt-20">
            <div className="col-auto">
              <button className="d-flex items-center text-24 arrow-left-hover js-services-prev">
                <i className="icon icon-arrow-left" />
              </button>
            </div>
            <div className="col-auto">
              <div className="pagination -dots text-border js-services-pag" />
            </div>
            <div className="col-auto">
              <button className="d-flex items-center text-24 arrow-right-hover js-services-next">
                <i className="icon icon-arrow-right" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
