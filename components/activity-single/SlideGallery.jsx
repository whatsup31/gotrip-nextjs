// components/activity-single/SlideGallery.jsx
"use client";

import { useMemo } from "react";

const SlideGallery = ({ images }) => {
  // Normalisation des images venant de Supabase (jsonb)
  const galleryImages = useMemo(() => {
    if (!images) return [];

    // Supabase renvoie normalement déjà un array JS,
    // mais on gère aussi le cas string JSON.
    let arr = images;

    if (typeof images === "string") {
      try {
        arr = JSON.parse(images);
      } catch {
        arr = [];
      }
    }

    if (Array.isArray(arr)) {
      return arr
        .map((item) =>
          typeof item === "string"
            ? item
            : item?.src || item?.url || null
        )
        .filter(Boolean);
    }

    return [];
  }, [images]);

  const hasImages = galleryImages.length > 0;

  // fallback si jamais aucun visuel n’est défini
  const fallback = ["/img/placeholder/451x450.png"];

  const toRender = hasImages ? galleryImages : fallback;

  return (
    <div className="row x-gap-10 y-gap-10">
      {toRender.map((src, index) => (
        <div
          className="col-12 col-md-4 col-lg-3"
          key={`${src}-${index}`}
        >
          <div className="ratio ratio-3:2 rounded-4 overflow-hidden bg-light-2">
            <img
              src={src}
              alt={`Service image ${index + 1}`}
              className="img-ratio js-lazy"
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SlideGallery;
