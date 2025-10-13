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

  // Sync props si l’URL change
  useEffect(() => {
    setCheckIn(initialCheckIn || "");
    setCheckOut(initialCheckOut || "");
    setGuests(initialGuests || 1);
  }, [initialCheckIn, initialCheckOut, initialGuests]);

  // Charger les services depuis localStorage
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

  // Calculs totaux
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
      // on transmet qty et unitPrice pour fiabiliser côté serveur
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
        body: JSON.stringify(payload),
      });
      // si 401 → non authentifié
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

    // succès → on vide les services liés à ce listing et on redirige
    clearServices();
    startTransition(() => router.push(`/reservation/${json.data.id}`));
  };

  const goToLogin = () => {
    // On reconstruit l’URL actuelle pour revenir ici après connexion
    const current = typeof window !== "undefined" ? window.location.pathname + window.location.search : "/booking-page";
    router.push(`/login?redirect=${encodeURIComponent(current)}`);
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="row y-gap-15">
        {/* Dates & Guests */}
        <div className="col-12">
          <label className="text-14">Check-in</label>
          <input type="date" className="form-control" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} required />
        </div>
        <div className="col-12">
          <label className="text-14">Check-out</label>
          <input type="date" className="form-control" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} required />
        </div>
        <div className="col-12">
          <label className="text-14">Guests</label>
          <input type="number" min={1} className="form-control" value={guests} onChange={(e) => setGuests(Number(e.target.value))} />
          {(initialAdults || initialChildren) ? (
            <div className="text-12 text-light-1 mt-5">
              {initialAdults} adultes · {initialChildren} enfants · {initialRooms} chambre(s)
            </div>
          ) : null}
        </div>

        {/* Récap services */}
        <div className="col-12">
          <div className="border-light rounded-4 p-15 bg-white">
            <div className="d-flex justify-between items-center">
              <h4 className="text-16 fw-600 mb-10">Services sélectionnés</h4>
              {services.length ? (
                <button type="button" onClick={clearServices} className="text-13 text-blue-1 underline">
                  Vider
                </button>
              ) : null}
            </div>

            {services.length === 0 ? (
              <div className="text-14 text-light-1">Aucun service ajouté. Retournez à la fiche logement pour en ajouter.</div>
            ) : (
              <ul className="y-gap-10">
                {services.map((s) => {
                  const unit = Number.isFinite(Number(s.unitPrice)) ? Number(s.unitPrice) : Number(s.price) || 0;
                  const qty = Number(s.qty) || 1;
                  return (
                    <li key={s.serviceId} className="d-flex justify-between items-center">
                      <div className="d-flex items-center">
                        <img src={s.cover} alt="" width={44} height={44} className="rounded-4 mr-10" style={{ objectFit: "cover" }} />
                        <div>
                          <div className="text-14 fw-500">{s.title}</div>
                          <div className="text-12 text-light-1">{s.levelName}</div>
                        </div>
                      </div>
                      <div className="d-flex items-center">
                        <div className="text-14 fw-600 mr-15">{(unit * qty).toLocaleString("fr-FR")}€</div>
                        <button type="button" className="button -blue-1 bg-light-2 px-10 py-5" onClick={() => removeService(s.serviceId)}>
                          Retirer
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Totaux */}
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

        {/* Erreurs / Auth */}
        {mustLogin && (
          <div className="col-12">
            <div className="alert alert-warning">
              <div className="mb-10">Utilisateur non authentifié. Connectez-vous pour confirmer votre réservation.</div>
              <button type="button" className="button -dark-1 bg-blue-1 text-white" onClick={goToLogin}>
                Se connecter
              </button>
            </div>
          </div>
        )}
        {error && (
          <div className="col-12">
            <div className="alert alert-danger">{error}</div>
          </div>
        )}

        <div className="col-12">
          <button className="button -dark-1 bg-blue-1 text-white w-100" disabled={pending || nights === 0}>
            {pending ? "Création..." : "Confirmer la réservation"}
          </button>
        </div>
      </div>
    </form>
  );
}
