// components/booking-page/BookingForm.jsx
"use client";

import { useState, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function BookingForm({ listingId, pricePerNight = 0 }) {
  const router = useRouter();
  const [checkIn, setCheckIn]   = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests]     = useState(1);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const d1 = Date.parse(checkIn);
    const d2 = Date.parse(checkOut);
    if (Number.isNaN(d1) || Number.isNaN(d2) || d2 <= d1) return 0;
    return Math.ceil((d2 - d1) / (1000*60*60*24));
  }, [checkIn, checkOut]);

  const total = useMemo(() => Math.max(0, nights * pricePerNight), [nights, pricePerNight]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId, checkIn, checkOut, guests }),
    });
    const json = await res.json();

    if (!res.ok || !json?.ok) {
      setError(json?.error || "Erreur inattendue");
      return;
    }

    startTransition(() => router.push(`/reservation/${json.data.id}`));
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="row y-gap-15">
        <div className="col-12">
          <label className="text-14">Check-in</label>
          <input type="date" className="form-control" value={checkIn} onChange={(e)=>setCheckIn(e.target.value)} required />
        </div>
        <div className="col-12">
          <label className="text-14">Check-out</label>
          <input type="date" className="form-control" value={checkOut} onChange={(e)=>setCheckOut(e.target.value)} required />
        </div>
        <div className="col-12">
          <label className="text-14">Guests</label>
          <input type="number" min={1} className="form-control" value={guests} onChange={(e)=>setGuests(Number(e.target.value))} />
        </div>

        <div className="col-12">
          <div className="d-flex justify-between mt-10">
            <div className="text-14 text-light-1">{nights} nuit(s)</div>
            <div className="text-18 fw-700">Total: €{total.toLocaleString("fr-FR")}</div>
          </div>
        </div>

        {error && <div className="col-12 text-red-2">{error}</div>}

        <div className="col-12">
          <button className="button -dark-1 bg-blue-1 text-white w-100" disabled={pending || nights === 0}>
            {pending ? "Création..." : "Confirmer la réservation"}
          </button>
          <div className="text-13 text-light-1 mt-10">Paiement simulé — aucun débit réel.</div>
        </div>
      </div>
    </form>
  );
}
