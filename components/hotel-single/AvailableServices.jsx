// components/hotel-single/AvailableServices.jsx
import ServiceCardHotels3 from "./ServiceCardHotels3";

function pickImage(s) {
  const arr = Array.isArray(s?.photos) ? s.photos : [];
  const first = arr.length ? arr[0] : null;

  const candidates = [
    s?.image,
    s?.image_url,
    s?.picture,
    s?.photo,
    s?.cover,
    s?.cover_url,
    first,
    "/img/others/placeholder.jpg",
  ];

  for (const u of candidates) {
    if (u && typeof u === "string") {
      return u.startsWith("//") ? `https:${u}` : u;
    }
  }
  return "/img/others/placeholder.jpg";
}

function toCardProps(s) {
  return {
    id: s?.id ?? Math.random().toString(36).slice(2),
    title: s?.title || s?.name || "Service",
    image: pickImage(s),
    location: s?.location || s?.city || "",
    rating: typeof s?.rating === "number" ? s.rating : 4.8,
    reviews: typeof s?.reviews === "number" ? s.reviews : 0,
    price: Number(s?.price ?? 0) || 0,
    href: "#",
  };
}

export default function AvailableServices({ services = [] }) {
  if (!Array.isArray(services) || services.length === 0) return null;

  return (
    <div className="row y-gap-30">
      {services.map((s) => (
        <div key={String(s?.id ?? Math.random())} className="col-xl-4 col-md-6">
          <ServiceCardHotels3 {...toCardProps(s)} />
        </div>
      ))}
    </div>
  );
}
