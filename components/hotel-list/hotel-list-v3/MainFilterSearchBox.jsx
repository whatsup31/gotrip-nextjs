// components/hotel-list/hotel-list-v3/MainFilterSearchBox.jsx
"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DateSearch from "@/components/hero/DateSearch";
import GuestSearch from "@/components/hero/hero-5/GuestSearch";
import LocationSearch from "@/components/hero/hero-5/LocationSearch";
import { hydrate, parseSearch, toQS, saveToSession, loadFromSession } from "@/lib/searchParams";

export default function MainFilterSearchBox({ initial = {} }) {
  const router = useRouter();
  const sp = useSearchParams();

  const [city, setCity] = useState("");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);

  useEffect(() => {
    const urlObj = parseSearch(sp);
    const sesObj = loadFromSession();
    const h = hydrate(
      { city: "", checkin: "", checkout: "", adults: 2, children: 0, rooms: 1 },
      initial || urlObj,
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
    router.push(`/hotel-list-v3?${toQS(q)}`); // on reste sur la page mais avec QS
  };

  return (
    <div className="mainSearch bg-white pr-10 py-10 lg:px-20 lg:pt-5 lg:pb-20 bg-light-2 rounded-4">
      <div className="button-grid items-center">
        <LocationSearch value={city} onChange={setCity} />
        <div className="searchMenu-date px-30 lg:py-20 lg:px-0 -left js-form-dd js-calendar">
          <div>
            <h4 className="text-15 fw-500 ls-2 lh-16">Check in - Check out</h4>
            <DateSearch
              checkin={checkin}
              checkout={checkout}
              onChange={({ checkin, checkout }) => { setCheckin(checkin); setCheckout(checkout); }}
            />
          </div>
        </div>
        <GuestSearch
          adults={adults}
          children={children}
          rooms={rooms}
          onChange={({ adults, children, rooms }) => { setAdults(adults); setChildren(children); setRooms(rooms); }}
        />
        <div className="button-item">
          <button className="mainSearch__submit button -dark-1 size-60 lg:w-1/1 col-12 rounded-4 bg-blue-1 text-white" onClick={onSubmit}>
            <i className="icon-search text-20" />
          </button>
        </div>
      </div>
    </div>
  );
}
