// components/booking-page/BookingForm.jsx
"use client";

import { useEffect, useMemo, useState, useTransition } from "react";

const STORAGE_KEY = "booking_services";

/* ---------- Local storage helpers (services sélectionnés) ---------- */
function readSelected(listingId) {
  if (typeof window === "undefined") return [];
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return listingId ? all.filter((x) => !x.listingId || x.listingId === listingId) : all;
  } catch {
    return [];
  }
}
function writeSelected(items) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("booking:services-changed"));
}

/* ========================== BookingForm =========================== */
export default function BookingForm({
  listingId,
  pricePerNight = 0,
  initialCheckIn = "",
  initialCheckOut = "",
  initialGuests = 1,
  initialRooms = 1,
  initialAdults = 0,
  initialChildren = 0,
  listing = {},
}) {
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [guests, setGuests] = useState(initialGuests || 1);
  const [services, setServices] = useState([]);
  const [error, setError] = useState("");
  const [mustLogin, setMustLogin] = useState(false);
  const [pending, startTransition] = useTransition();

  const { title, location, rating_avg, reviews_count } = listing || {};

  const cover = useMemo(() => {
    if (!listing) return "/img/backgrounds/1.png";
    let photos = listing.photos;
    try {
      if (typeof photos === "string") photos = JSON.parse(photos || "[]");
    } catch {
      photos = [];
    }
    return Array.isArray(photos) && photos.length ? photos[0] : "/img/backgrounds/1.png";
  }, [listing]);

  useEffect(() => {
    setCheckIn(initialCheckIn || "");
    setCheckOut(initialCheckOut || "");
    setGuests(initialGuests || 1);
  }, [initialCheckIn, initialCheckOut, initialGuests]);

  useEffect(() => {
    const load = () => setServices(readSelected(listingId));
    load();
    const onChange = () => load();
    if (typeof window !== "undefined") {
      window.addEventListener("booking:services-changed", onChange);
      window.addEventListener("storage", onChange);
      return () => {
        window.removeEventListener("booking:services-changed", onChange);
        window.removeEventListener("storage", onChange);
      };
    }
  }, [listingId]);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const d1 = Date.parse(checkIn);
    const d2 = Date.parse(checkOut);
    if (Number.isNaN(d1) || Number.isNaN(d2) || d2 <= d1) return 0;
    return Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
  }, [checkIn, checkOut]);

  const lodgingTotal = useMemo(() => Math.max(0, nights * pricePerNight), [nights, pricePerNight]);

  const servicesTotal = useMemo(
    () =>
      services.reduce((sum, s) => {
        const unit = Number.isFinite(Number(s.unitPrice)) ? Number(s.unitPrice) : Number(s.price) || 0;
        const qty = Number(s.qty) || 1;
        return sum + unit * qty;
      }, 0),
    [services]
  );

  const grandTotal = useMemo(() => lodgingTotal + servicesTotal, [lodgingTotal, servicesTotal]);

  const removeService = (serviceId) => {
    const all = readSelected();
    const next = all.filter((x) => x.serviceId !== serviceId);
    writeSelected(next);
    setServices(next.filter((x) => !listingId || x.listingId === listingId));
  };

  const clearServices = () => {
    const all = readSelected();
    const next = all.filter((x) => listingId && x.listingId !== listingId);
    writeSelected(next);
    setServices([]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMustLogin(false);

    const payload = {
      listingId,
      checkIn,
      checkOut,
      guests,
      services: services.map(({ serviceId, levelId, unitPrice, qty }) => ({
        serviceId,
        levelId,
        unitPrice: Number(unitPrice) || undefined,
        qty: Number(qty) || 1,
      })),
    };

    let res, json;
    try {
      res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (res.status === 401) {
        setMustLogin(true);
        return;
      }
      json = await res.json();
    } catch {
      setError("Erreur réseau. Merci de réessayer.");
      return;
    }

    if (!res.ok || !json?.ok) {
      setError(json?.error || "Erreur inattendue");
      return;
    }

    clearServices();
    startTransition(() => (window.location.href = `/reservation/${json.data.id}`));
  };

  const goToLogin = () => {
    const current =
      typeof window !== "undefined" ? window.location.pathname + window.location.search : "/booking-page";
    window.location.href = `/login?redirect=${encodeURIComponent(current)}`;
  };

  /* =========================== UI ============================ */
  return (
    <form onSubmit={onSubmit}>
      <div className="bg-white rounded-4 shadow-3 px-30 py-30 md:px-24 md:py-24">

        {/* Titre */}
        <h2 className="text-22 fw-600 mb-30">Détails de votre réservation</h2>

        {/* En-tête : visuel + infos hôtel */}
        <div className="row x-gap-20 y-gap-20">
          <div className="col-auto">
            <img
              src={cover}
              alt="cover"
              width={160}
              height={120}
              className="rounded-4 object-cover"
              style={{ width: 160, height: 120 }}
            />
          </div>

          <div className="col">
            <div className="d-flex x-gap-5">
              <i className="icon-star text-yellow-1 text-12" />
              <i className="icon-star text-yellow-1 text-12" />
              <i className="icon-star text-yellow-1 text-12" />
              <i className="icon-star text-yellow-1 text-12" />
              <i className="icon-star text-yellow-1 text-12" />
            </div>

            <div className="mt-5 lh-17 fw-600 text-18">{title || "Logement sélectionné"}</div>
            {location && <div className="text-14 text-dark-1 mt-4">{location}</div>}

            {(rating_avg || reviews_count) && (
              <div className="row x-gap-12 y-gap-10 items-center pt-10">
                {rating_avg && (
                  <div className="col-auto">
                    <div className="d-flex items-center">
                      <div className="size-30 flex-center bg-blue-1 rounded-4">
                        <div className="text-12 fw-700 text-white">
                          {Number(rating_avg).toFixed(1)}
                        </div>
                      </div>
                      <div className="text-14 fw-600 ml-10">Exceptionnel</div>
                    </div>
                  </div>
                )}
                {Number.isFinite(Number(reviews_count)) && (
                  <div className="col-auto">
                    <div className="text-14">{Number(reviews_count).toLocaleString("fr-FR")} avis</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="border-top-light mt-30 mb-20" />

        {/* Check-in / Check-out */}
        <div className="row y-gap-24 items-start">
          <div className="col-md-5">
            <div className="text-15 text-dark-1 mb-6">Arrivée</div>
            <input
              type="date"
              className="form-control"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              required
            />
            <div className="text-13 text-light-1 mt-6">15:00 — 23:00</div>
          </div>

          <div className="col-auto d-none d-md-block">
            <div className="w-px bg-border" style={{ height: 80 }} />
          </div>

          <div className="col-md-5">
            <div className="text-15 text-dark-1 mb-6">Départ</div>
            <input
              type="date"
              className="form-control"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              required
            />
            <div className="text-13 text-light-1 mt-6">01:00 — 11:00</div>
          </div>
        </div>

        <div className="border-top-light mt-30 mb-20" />

        {/* Séjour + sélection */}
        <div className="row y-gap-16">
          <div className="col-12">
            <div className="text-15 text-dark-1">Durée totale du séjour :</div>
            <div className="fw-700 text-16">{nights} nuit{nights > 1 ? "s" : ""}</div>
          </div>

          <div className="col-12">
            <div className="text-15 text-dark-1">Vous avez sélectionné :</div>
            <div className="fw-600">
              {initialRooms} chambre{initialRooms > 1 ? "s" : ""}, {initialAdults} adulte{initialAdults > 1 ? "s" : ""} · {initialChildren} enfant{initialChildren > 1 ? "s" : ""}
            </div>
          </div>

          <div className="col-12">
            <div className="text-15 text-dark-1">Voyageurs</div>
            <input
              type="number"
              min={1}
              className="form-control mt-6"
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="border-top-light mt-30 mb-20" />

        {/* Services sélectionnés */}
        <div className="d-flex justify-between items-center mb-10">
          <div className="text-15 text-dark-1">Services sélectionnés</div>
          {services.length > 0 && (
            <button type="button" onClick={clearServices} className="text-13 text-blue-1 underline">
              Vider
            </button>
          )}
        </div>

        {services.length === 0 ? (
          <div className="text-14 text-light-1">
            Aucun service ajouté. Retournez à la fiche logement pour en ajouter.
          </div>
        ) : (
          <ul className="y-gap-10">
            {services.map((s) => {
              const unit = Number.isFinite(Number(s.unitPrice)) ? Number(s.unitPrice) : Number(s.price) || 0;
              const qty = Number(s.qty) || 1;
              return (
                <li key={s.serviceId} className="d-flex justify-between items-center">
                  <div className="d-flex items-center">
                    <img
                      src={s.cover}
                      alt=""
                      width={44}
                      height={44}
                      className="rounded-4 mr-10"
                      style={{ objectFit: "cover" }}
                    />
                    <div>
                      <div className="text-14 fw-600">{s.title}</div>
                      <div className="text-12 text-light-1">{s.levelName}</div>
                    </div>
                  </div>
                  <div className="d-flex items-center">
                    <div className="text-14 fw-700 mr-15">{(unit * qty).toLocaleString("fr-FR")}€</div>
                    <button
                      type="button"
                      className="button -blue-1 bg-light-2 px-10 py-5"
                      onClick={() => removeService(s.serviceId)}
                    >
                      Retirer
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <div className="border-top-light mt-30 mb-20" />

        {/* Totaux */}
        <div className="row y-gap-8">
          <div className="col-12 d-flex justify-between">
            <div className="text-14 text-light-1">
              {nights} nuit(s) × {pricePerNight.toLocaleString("fr-FR")}€
            </div>
            <div className="text-16 fw-700">{lodgingTotal.toLocaleString("fr-FR")}€</div>
          </div>
          <div className="col-12 d-flex justify-between">
            <div className="text-14 text-light-1">Services</div>
            <div className="text-16 fw-700">{servicesTotal.toLocaleString("fr-FR")}€</div>
          </div>
          <div className="col-12 d-flex justify-between mt-10">
            <div className="text-18 fw-800">Total</div>
            <div className="text-20 fw-800">{grandTotal.toLocaleString("fr-FR")}€</div>
          </div>
        </div>

        {(mustLogin || error) && <div className="border-top-light mt-30 mb-20" />}

        {mustLogin && (
          <div className="alert alert-warning">
            <div className="mb-10">
              Utilisateur non authentifié. Connectez-vous pour confirmer votre réservation.
            </div>
            <button type="button" className="button h-50 px-24 text-white" style={{ backgroundColor: "#0d6efd" }} onClick={goToLogin}>
              Se connecter
            </button>
          </div>
        )}

        {error && <div className="alert alert-danger">{error}</div>}

        {/* Bouton principal aligné Booking.com-like */}
        <div className="mt-30">
  <button
    type="submit"
    disabled={pending || nights === 0}
    className="w-100 py-15 rounded-4 fw-500 d-flex justify-center align-center gap-10"
    style={{
      backgroundColor: "#0071c2",
      color: "white",
      border: "none",
      fontSize: "16px",
      transition: "background-color 0.2s ease",
    }}
    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#005fa3")}
    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#0071c2")}
  >
    {pending ? "Création..." : "Confirmer la réservation"}
  </button>
</div>
      </div>
    </form>
  );
}
