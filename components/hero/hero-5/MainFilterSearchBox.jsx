// components/hero/hero-5/MainFilterSearchBox.jsx
"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import DateSearch from "@/components/hero/DateSearch";
import GuestSearch from "@/components/hero/hero-5/GuestSearch";
import LocationSearch from "@/components/hero/hero-5/LocationSearch";
import { parseSearch, toQS, saveToSession, loadFromSession, hydrate } from "@/lib/searchParams";

export default function MainFilterSearchBox() {
  const router = useRouter();
  const sp = useSearchParams();

  // état contrôlé
  const [city, setCity] = useState("");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(1);
  const [rooms, setRooms] = useState(1);

  // hydrate avec URL et session (si l'utilisateur revient)
  useEffect(() => {
    const urlObj = parseSearch(sp);
    const sesObj = loadFromSession();
    const h = hydrate(
      { city: "", checkin: "", checkout: "", adults: 2, children: 0, rooms: 1 },
      urlObj,
      sesObj
    );
    setCity(h.city || "");
    setCheckin(h.checkin || "");
    setCheckout(h.checkout || "");
    setAdults(Number(h.adults || 2));
    setChildren(Number(h.children || 0));
    setRooms(Number(h.rooms || 1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = () => {
    const q = { city, checkin, checkout, adults, children, rooms };
    saveToSession(q);
    router.push(`/hotel-list-v3?${toQS(q)}`);
  };

  return (
    <div
      className="mainSearch bg-white pr-20 py-20 lg:px-20 lg:pt-5 lg:pb-20 rounded-4 shadow-1 mt-35"
      data-aos="fade-up"
      data-aos-delay="600"
    >
      <div className="button-grid items-center">
        <LocationSearch value={city} onChange={setCity} />

        <div className="searchMenu-date px-30 lg:py-20 lg:px-0 js-form-dd js-calendar">
          <div>
            <h4 className="text-15 fw-500 ls-2 lh-16">Arrivée - Départ</h4>
            <DateSearch
              checkin={checkin}
              checkout={checkout}
              onChange={({ checkin, checkout }) => {
                setCheckin(checkin);
                setCheckout(checkout);
              }}
            />
          </div>
        </div>

        <GuestSearch
          adults={adults}
          children={children}
          rooms={rooms}
          onChange={({ adults, children, rooms }) => {
            setAdults(adults);
            setChildren(children);
            setRooms(rooms);
          }}
        />

        <div className="button-item">
          <button
            className="mainSearch__submit button -dark-1 py-15 px-35 h-60 col-12 rounded-4 text-white"
            onClick={onSubmit}
            style={{ backgroundColor: "#007cd2" }}
          >
            <i className="icon-search text-20 mr-10" />
            Rechercher
          </button>
        </div>
      </div>
    </div>
  );
}
