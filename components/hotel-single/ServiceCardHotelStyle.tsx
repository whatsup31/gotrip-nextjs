// components/hotel-single/ServiceCardHotelStyle.jsx
"use client";

import Link from "next/link";

export default function ServiceCardHotelStyle(props) {
  const {
    id,
    title,
    image = "/img/services/placeholder.jpg",
    category = "",
    location = "",
    rating = 4.8,
    reviews = 0,
    price = 0,
    href = "#",
    // badge, // (on ne l'utilise plus)
  } = props;

  const priceText = price > 0 ? `€${Number(price).toLocaleString("fr-FR")}` : "—";

  return (
    <div className="col-xl-4 col-md-6">
      <div className="tourCard -type-1 rounded-4 hover-shadow-1">
        {/* Image */}
        <div className="tourCard__image">
          <div className="cardImage ratio ratio-1:1" style={{ position: "relative" }}>
            {/* Bouton coeur */}
            <button className="cardImage__wishlist" aria-label="Add to wishlist">
              <i className="icon-heart" />
            </button>

            {/* L'image occupe tout le carré 1:1 */}
            <div className="cardImage__content" style={{ position: "absolute", inset: 0 }}>
              <img
                src={image}
                alt={title || "Service"}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "8px",
                  display: "block",
                }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="tourCard__content mt-10 px-10 pb-10">
          {/* catégorie + localisation */}
          <div className="d-flex items-center text-13 text-light-1">
            {category && <div>{category}</div>}
            {location && (
              <>
                {category ? <div className="size-3 rounded-full bg-light-1 mx-10" /> : null}
                <div className="d-flex items-center">
                  <i className="icon-pin text-14 mr-5" />
                  {location}
                </div>
              </>
            )}
          </div>

          {/* Titre */}
          <h3 className="text-18 lh-16 fw-600 mt-5">{title || "Service"}</h3>

          {/* Rating + reviews */}
          <div className="d-flex items-center mt-8">
            <div className="d-flex items-center text-blue-1">
              <i className="icon-star text-12 mr-5" />
              <i className="icon-star text-12 mr-5" />
              <i className="icon-star text-12 mr-5" />
              <i className="icon-star text-12 mr-5" />
              <i className="icon-star text-12" />
            </div>
            <div className="text-13 ml-10">
              <span className="fw-600">
                {Number.isFinite(Number(rating)) ? Number(rating).toFixed(1) : "4.8"}
              </span>{" "}
              <span className="text-light-1">Exceptional</span>{" "}
              <span className="text-light-1">· {Number(reviews) || 0} reviews</span>
            </div>
          </div>

          {/* Footer prix + CTA */}
          <div className="d-flex items-center justify-between mt-12">
            <div className="text-14 text-light-1">
              Starting from <span className="text-16 text-dark-1 fw-700">{priceText}</span>
            </div>

            <Link href={href} className="button -md -blue-1 bg-blue-1-05 text-blue-1">
              Voir le service
              <i className="icon-arrow-top-right ml-10" />
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hover-shadow-1:hover {
          box-shadow: 0 14px 30px rgba(0, 0, 0, 0.08);
          transform: translateY(-2px);
          transition: all 0.2s ease;
        }
        .cardImage__wishlist {
          position: absolute;
          right: 10px;
          top: 10px;
          height: 36px;
          width: 36px;
          border-radius: 999px;
          border: none;
          background: rgba(255, 255, 255, 0.9);
          display: grid;
          place-items: center;
          z-index: 2;
        }
      `}</style>
    </div>
  );
}
