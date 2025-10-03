// components/hero/hero-5/GuestSearch.jsx
"use client";
import { useEffect, useState } from "react";

export default function GuestSearch({ adults=2, children=0, rooms=1, onChange }) {
  const [state, setState] = useState({ adults, children, rooms });
  useEffect(() => setState({ adults, children, rooms }), [adults, children, rooms]);

  const update = (key, val) => {
    const next = { ...state, [key]: Math.max(0, val) };
    setState(next);
    onChange?.(next);
  };

  const Counter = ({ label, keyName }) => (
    <div className="row y-gap-10 justify-between items-center">
      <div className="col-auto">
        <div className="text-15 lh-12 fw-500">{label}</div>
        {keyName === "children" && (
          <div className="text-14 lh-12 text-light-1 mt-5">Ages 0 - 17</div>
        )}
      </div>
      <div className="col-auto">
        <div className="d-flex items-center js-counter">
          <button className="button -outline-blue-1 text-blue-1 size-38 rounded-4" onClick={() => update(keyName, state[keyName]-1)}>
            <i className="icon-minus text-12" />
          </button>
          <div className="flex-center size-20 ml-15 mr-15"><div className="text-15">{state[keyName]}</div></div>
          <button className="button -outline-blue-1 text-blue-1 size-38 rounded-4" onClick={() => update(keyName, state[keyName]+1)}>
            <i className="icon-plus text-12" />
          </button>
        </div>
      </div>
      <div className="border-top-light mt-24 mb-24" />
    </div>
  );

  return (
    <div className="searchMenu-guests px-30 lg:py-20 sm:px-20 js-form-dd js-form-counters position-relative">
      <div data-bs-toggle="dropdown" data-bs-auto-close="outside" data-bs-offset="0,22">
        <h4 className="text-15 fw-500 ls-2 lh-16">Voyageurs</h4>
        <div className="text-15 text-light-1 ls-2 lh-16">
          {state.adults} adultes - {state.children} enfants - {state.rooms} chambre
        </div>
      </div>
      <div className="shadow-2 dropdown-menu min-width-400">
        <div className="bg-white px-30 py-30 rounded-4 counter-box">
          <Counter label="Adults" keyName="adults" />
          <Counter label="Children" keyName="children" />
          <Counter label="Rooms" keyName="rooms" />
        </div>
      </div>
    </div>
  );
}
