// components/hotel-single/GalleryTwo.jsx
"use client";

import React, { useState, useMemo } from "react";
import { Gallery, Item } from "react-photoswipe-gallery";
import Overview from "@/components/hotel-single/Overview";
import PopularFacilities from "@/components/hotel-single/PopularFacilities";
import SidebarRight2 from "@/components/hotel-single/SidebarRight2";
import RatingBox from "@/components/hotel-single/RatingBox";
import PropertyHighlights2 from "@/components/hotel-single/PropertyHighlights2";
import ModalVideo from "../common/ModalVideo";

function ensureJpg(src = "") {
  // si le dernier segment n'a pas d'extension, on ajoute .jpg
  try {
    const url = String(src);
    const last = url.split("/").pop() || "";
    if (!last.includes(".")) return `${url}.jpg`;
    return url;
  } catch {
    return src;
  }
}

function normalizePhotos(photos) {
  if (Array.isArray(photos)) return photos.map(ensureJpg).filter(Boolean);
  if (typeof photos === "string") {
    const t = photos.trim();
    if (t.startsWith("[") && t.endsWith("]")) {
      try {
        const arr = JSON.parse(t);
        return Array.isArray(arr) ? arr.map(ensureJpg).filter(Boolean) : [];
      } catch {
        return [];
      }
    }
    return t.split(",").map((s) => ensureJpg(s.trim())).filter(Boolean);
  }
  return [];
}

export default function GalleryTwo({ hotel }) {
  const [isOpen, setOpen] = useState(false);
  const photos = useMemo(() => normalizePhotos(hotel?.photos), [hotel?.photos]);

  const thumbs = photos.slice(0, 4); // v1: on montre 4 vignettes; le reste sera visible dans la lightbox

  return (
    <>
      <ModalVideo isOpen={isOpen} videoId="oqNZOOWF8qM" setIsOpen={setOpen} />
      <section className="pt-40">
        <div className="container">
          <div className="hotelSingleGrid">
            <div>
              <Gallery>
                <div className="galleryGrid -type-2">
                  {thumbs.map((src, idx) => (
                    <div key={idx} className="galleryGrid__item relative d-flex justify-end">
                      <Item original={src} thumbnail={src} width={660} height={660}>
                        {({ ref, open }) => (
                          <img
                            src={src}
                            ref={ref}
                            onClick={open}
                            alt={`photo ${idx + 1}`}
                            role="button"
                            className="rounded-4"
                          />
                        )}
                      </Item>
                      {idx === 0 && (
                        <div className="absolute px-20 py-20">
                          <button className="button -blue-1 size-40 rounded-full bg-white">
                            <i className="icon-heart text-16" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}

                  {!!photos.length && (
                    <div className="galleryGrid__item relative d-flex justify-end items-end">
                      <img src={thumbs[3] || thumbs[2] || thumbs[1] || thumbs[0]} alt="image" className="rounded-4" />
                      <div className="absolute px-10 py-10 col-12 h-full d-flex justify-end items-end">
                        <Item original={photos[0]} thumbnail={photos[0]} width={362} height={302}>
                          {({ ref, open }) => (
                            <div className="button -blue-1 px-24 py-15 bg-white text-dark-1 js-gallery" ref={ref} onClick={open} role="button">
                              See All Photos
                            </div>
                          )}
                        </Item>
                      </div>
                    </div>
                  )}
                </div>
              </Gallery>

              <div className="row justify-between items-end pt-40">
                <div className="col-auto">
                  <div className="row x-gap-20  items-center">
                    <div className="col-auto">
                      <h1 className="text-30 sm:text-25 fw-600">{hotel?.title?.slice(0, 60)}</h1>
                    </div>
                    <div className="col-auto">
                      <i className="icon-star text-10 text-yellow-1" />
                      <i className="icon-star text-10 text-yellow-1" />
                      <i className="icon-star text-10 text-yellow-1" />
                      <i className="icon-star text-10 text-yellow-1" />
                      <i className="icon-star text-10 text-yellow-1" />
                    </div>
                  </div>

                  <div className="row x-gap-20 y-gap-20 items-center">
                    <div className="col-auto">
                      <div className="d-flex items-center text-15 text-light-1">
                        <i className="icon-location-2 text-16 mr-5" />
                        {hotel?.location}
                      </div>
                    </div>
                    <div className="col-auto">
                      <button data-x-click="mapFilter" className="text-blue-1 text-15 underline">
                        Show on map
                      </button>
                    </div>
                  </div>
                </div>

                <div className="col-auto">
                  <div className="text-14 text-md-end">
                    From <span className="text-22 text-dark-1 fw-500">€{hotel?.price}</span>
                  </div>
                  <a href="#rooms" className="button h-50 px-24 -dark-1 bg-blue-1 text-white">
                    Select Room <div className="icon-arrow-top-right ml-15" />
                  </a>
                </div>
              </div>

              <div id="overview" className="row y-gap-40 pt-40 ">
                <div className="col-12"><Overview /></div>
                <div className="col-12">
                  <h3 className="text-22 fw-500 pt-40 border-top-light">Most Popular Facilities</h3>
                  <div className="row y-gap-10 pt-20"><PopularFacilities /></div>
                </div>
              </div>
            </div>

            <div>
              <SidebarRight2 />
              <RatingBox hotel={hotel} />
              <PropertyHighlights2 />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
