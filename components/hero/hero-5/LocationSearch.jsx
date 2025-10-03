// components/hero/hero-5/LocationSearch.jsx
"use client";
export default function LocationSearch({ value = "", onChange }) {
  return (
    <div className="searchMenu-loc pl-20 lg:py-20 pr-20 lg:px-0 js-form-dd js-liverSearch">
      <div>
        <h4 className="text-15 fw-500 ls-2 lh-16">Destination</h4>
        <div className="text-15 text-light-1 ls-2 lh-16">
          <input
            autoComplete="off"
            type="search"
            placeholder="Rechercher un logement"
            className="js-search js-dd-focus"
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
