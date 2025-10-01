// components/hotel-single/AvailableServices.jsx
import ServiceCardHotelStyle from "./ServiceCardHotelStyle";

function toCardProps(s) {
  const title = s?.title || s?.name || "Service";
  const image = s?.image || s?.image_url || s?.picture || "/img/others/placeholder.jpg";
  const priceNum = Number(s?.price ?? 0);
  const rating =
    typeof s?.rating === "number" ? s.rating : 4.7 + Math.random() * 0.2; // look & feel
  const reviews =
    typeof s?.reviews === "number" ? s.reviews : Math.floor(100 + Math.random() * 1200);
  const location = s?.location || s?.city || "";

  // petit badge démo pour matcher GoTrip
  const badges = [undefined, "BEST SELLER", "TOP RATED", "POPULAR"];
  const badge = badges[Math.floor(Math.random() * badges.length)];

  return {
    id: s?.id ?? Math.random().toString(36).slice(2),
    title,
    image,
    category: s?.category || "",
    location,
    rating,
    reviews,
    price: Number.isFinite(priceNum) ? priceNum : 0,
    href: "#",
    badge,
  };
}

export default function AvailableServices({ services = [] }) {
  if (!Array.isArray(services) || services.length === 0) return null;

  return (
    <div className="row y-gap-30">
      {services.map((s) => (
        <ServiceCardHotelStyle key={String(s?.id ?? Math.random())} {...toCardProps(s)} />
      ))}
    </div>
  );
}
