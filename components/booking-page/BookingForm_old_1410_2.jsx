// components/booking-page/BookingForm.jsx
"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const STORAGE_KEY = "booking_services";

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

export default function BookingForm({
  listingId,
  pricePerNight = 0,
  initialCheckIn = "",
  initialCheckOut = "",
  initialGuests = 1,
  initialRooms = 1,
  initialAdults = 0,
  initialChildren = 0,

  // ---- Props visuelles façon BookingDetails
  hotelCover = "/img/backgrounds/1.png",
  hotelTitle,
  hotelLocation,
  hotelRating = null,   // ex: 4.8
  hotelReviews = null,  // ex: 3014
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [guests, setGuests] = useState(initialGuests || 1);
  const [services, setServices] = useState([]);
  const [error, setError] = useState("");
  const [mustLogin, setMustLogin] = useState(false);
  const [pending, startTransition] = useTransition();

  // sync des props quand l’URL change
  useEffect(() => {
    setCheckIn(initialCheckIn || "");
    setCheckOut(initialCheckOut || "");
    setGuests(initialGuests || 1);
  }, [initialCheckIn, initialCheckOut, initialGuests]);

  // charger services choisis
  useEffect(() => {
    const load = () => setServices(readSelected(listingId));
    load();
    const onChange = () => load();
    window.addEventListener("booking:services-changed", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("booking:services-changed", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, [listingId]);

  // ------ calculs
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
    } catch (err) {
      setError("Erreur réseau. Merci de réessayer.");
      return;
    }

    if (!res.ok || !json?.ok) {
      setError(json?.error || "Erreur inattendue");
      return;
    }

    // succès → purge des services de ce listing + redirection
    clearServices();
    startTransition(() => router.push(`/reservation/${json.data.id}`));
  };

  const goToLogin = () => {
    const current =
      typeof window !== "undefined" ? window.location.pathname + window.location.search : "/booking-page";
    router.push(`/login?redirect=${encodeURIComponent(current)}`);
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="px-30 py-30 border-light rounded-4 bg-white">
        <div className="text-20 fw-500 mb-30">Your booking details</div>

        {/* --- en-tête visuel façon BookingDetails (photo, étoiles, rating, reviews) */}
        {(hotelTitle || hotelLocation || hotelRating || hotelReviews) && (
          <>
            <div className="row x-gap-15 y-gap-20">
              <div className="col-auto">
                <img
                  width={140}
                  height={140}
                  src={hotelCover}
                  alt="cover"
                  className="size-140 rounded-4 object-cover"
                />
              </div>
              <div className="col">
                <div className="d-flex x-gap-5 pb-10">
                  <i className="icon-star text-yellow-1 text-10" />
                  <i className="icon-star text-yellow-1 text-10" />
                  <i className="icon-star text-yellow-1 text-10" />
                  <i className="icon-star text-yellow-1 text-10" />
                  <i className="icon-star text-yellow-1 text-10" />
                </div>
                <div className="lh-17 fw-500">{hotelTitle || "Your selected property"}</div>
                {hotelLocation && <div className="text-14 lh-15 mt-5">{hotelLocation}</div>}
                {(hotelRating || hotelReviews) && (
                  <div className="row x-gap-10 y-gap-10 items-center pt-10">
                    {hotelRating != null && (
                      <div className="col-auto">
                        <div className="d-flex items-center">
                          <div className="size-30 flex-center bg-blue-1 rounded-4">
                            <div className="text-12 fw-600 text-white">{Number(hotelRating).toFixed(1)}</div>
                          </div>
                          <div className="text-14 fw-500 ml-10">Exceptional</div>
                        </div>
                      </div>
                    )}
                    {hotelReviews != null && (
                      <div className="col-auto">
                        <div className="text-14">{hotelReviews.toLocaleString("en-US")} reviews</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="border-top-light mt-30 mb-20" />
          </>
        )}

        {/* --- Dates */}
        <div className="row y-gap-20 justify-between">
          <div className="col-md-6">
            <div className="text-15 mb-5">Check-in</div>
            <input
              type="date"
              className="form-control"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              required
            />
            <div className="text-13 text-light-1 mt-5">À partir de 15:00 (indicatif)</div>
          </div>

          <div className="col-auto md:d-none">
            <div className="h-full w-1 bg-border" />
          </div>

          <div className="col-md-6">
            <div className="text-15 mb-5">Check-out</div>
            <input
              type="date"
              className="form-control"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              required
            />
            <div className="text-13 text-light-1 mt-5">Jusqu’à 11:00 (indicatif)</div>
          </div>
        </div>

        <div className="border-top-light mt-30 mb-20" />

        {/* --- Guests */}
        <div className="row y-gap-20 justify-between items-center">
          <div className="col-md-6">
            <div className="text-15 mb-5">Guests</div>
            <input
              type="number"
              min={1}
              className="form-control"
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
            />
          </div>
          {(initialAdults || initialChildren) ? (
            <div className="col-md-6 text-right md:text-left">
              <div className="text-15">You selected:</div>
              <div className="fw-500">
                {initialRooms} room{initialRooms > 1 ? "s" : ""},{" "}
                {initialAdults} adult{initialAdults > 1 ? "s" : ""} ·{" "}
                {initialChildren} child{initialChildren > 1 ? "ren" : ""}
              </div>
            </div>
          ) : null}
        </div>

        <div className="border-top-light mt-30 mb-20" />

        {/* --- Services sélectionnés */}
        <div className="d-flex justify-between items-center mb-10">
          <div className="text-15">Services sélectionnés</div>
          {services.length ? (
            <button type="button" onClick={clearServices} className="text-13 text-blue-1 underline">
              Vider
            </button>
          ) : null}
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
                      <div className="text-14 fw-500">{s.title}</div>
                      <div className="text-12 text-light-1">{s.levelName}</div>
                    </div>
                  </div>
                  <div className="d-flex items-center">
                    <div className="text-14 fw-600 mr-15">{(unit * qty).toLocaleString("fr-FR")}€</div>
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

        {/* --- Totaux */}
        <div className="row y-gap-10">
          <div className="col-12">
            <div className="text-15">Total length of stay:</div>
            <div className="fw-500">
              {nights} night{nights > 1 ? "s" : ""}
            </div>
          </div>

          <div className="col-12">
            <div className="d-flex justify-between mt-10">
              <div className="text-14 text-light-1">
                {nights} nuit(s) × {pricePerNight.toLocaleString("fr-FR")}€
              </div>
              <div className="text-16 fw-600">{lodgingTotal.toLocaleString("fr-FR")}€</div>
            </div>
            <div className="d-flex justify-between mt-5">
              <div className="text-14 text-light-1">Services</div>
              <div className="text-16 fw-600">{servicesTotal.toLocaleString("fr-FR")}€</div>
            </div>
            <div className="d-flex justify-between mt-10">
              <div className="text-18 fw-700">Total</div>
              <div className="text-20 fw-700">{grandTotal.toLocaleString("fr-FR")}€</div>
            </div>
          </div>
        </div>

        {/* --- Erreurs / Auth */}
        {(mustLogin || error) && <div className="border-top-light mt-30 mb-20" />}

        {mustLogin && (
          <div className="alert alert-warning">
            <div className="mb-10">Utilisateur non authentifié. Connectez-vous pour confirmer votre réservation.</div>
            <button type="button" className="button -dark-1 bg-blue-1 text-white" onClick={goToLogin}>
              Se connecter
            </button>
          </div>
        )}

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mt-20">
          <button className="button -dark-1 bg-blue-1 text-white w-100" disabled={pending || nights === 0}>
            {pending ? "Création..." : "Confirmer la réservation"}
          </button>
        </div>
      </div>
    </form>
  );
}
