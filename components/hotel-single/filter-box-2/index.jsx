// components/hotel-single/filter-box-2/index.jsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import DateSearch from "./DateSearch";
import GuestSearch from "./GuestSearch";
import LocationSearch from "./LocationSearch";

export default function MainFilterSearchBox() {
  const sp = useSearchParams();
  const router = useRouter();

  // état contrôlé centralisé
  const [city, setCity] = useState("");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);

  // hydrate depuis la query
  useEffect(() => {
    const get = (k) => sp?.get(k) || "";
    setCity(get("city") || "");
    setCheckin(get("checkin") || "");
    setCheckout(get("checkout") || "");
    setAdults(Number(get("adults") || 2));
    setChildren(Number(get("children") || 0));
    setRooms(Number(get("rooms") || 1));
  }, [sp]);

  // relancer une recherche (ici: maj de la même page ; tu peux router.push vers /hotel-list-v3 si besoin)
  const onSubmit = () => {
    const qs = new URLSearchParams({
      ...(city ? { city } : {}),
      ...(checkin ? { checkin } : {}),
      ...(checkout ? { checkout } : {}),
      adults: String(adults),
      children: String(children),
      rooms: String(rooms),
    }).toString();

    router.replace(`?${qs}`, { scroll: false });
  };

  return (
    <div className="mainSearch bg-white px-10 py-10 lg:px-20 lg:pt-5 lg:pb-20 rounded-4">
      <div className="button-grid items-center">
        <LocationSearch value={city} onChange={setCity} />

        <div className="searchMenu-date px-30 lg:py-20 sm:px-20 js-form-dd js-calendar">
          <div>
            <h4 className="text-15 fw-500 ls-2 lh-16">Check in - Check out</h4>
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

        <div className="button-item h-full">
          <button
            className="button -dark-1 py-15 px-40 h-full col-12 rounded-0 bg-blue-1 text-white"
            onClick={onSubmit}
          >
            <i className="icon-search text-20 mr-10" />
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
