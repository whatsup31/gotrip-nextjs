// components/hotel-single/AvailableServices.jsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

/* -------- Utils -------- */
function ensureJpg(src = "") {
  try {
    const url = String(src || "");
    const last = url.split("/").pop() || "";
    if (!last.includes(".")) return `${url}.jpg`;
    return url;
  } catch {
    return "/img/others/placeholder.jpg";
  }
}

function coverFrom(service) {
  if (Array.isArray(service?.images) && service.images.length) {
    return ensureJpg(service.images[0]);
  }
  if (service?.cover_url) return ensureJpg(service.cover_url);
  return "/img/others/placeholder.jpg";
}

function asLevels(svc) {
  // Accepte différents schémas: levels | tiers | variants | pakkages…
  const raw =
    (Array.isArray(svc?.levels) && svc.levels) ||
    (Array.isArray(svc?.tiers) && svc.tiers) ||
    (Array.isArray(svc?.variants) && svc.variants) ||
    [];

  if (raw.length) {
    return raw.map((lv, i) => ({
      id: lv.id ?? `lv-${svc.id}-${i}`,
      name: lv.name ?? lv.title ?? `Option ${i + 1}`,
      price: Number(lv.price ?? lv.amount ?? svc.price ?? 0),
      description: lv.description ?? "",
    }));
  }

  // Fallback: un seul niveau basé sur le prix du service
  return [
    {
      id: `std-${svc.id}`,
      name: "Standard",
      price: Number(svc.price ?? 0),
      description: "",
    },
  ];
}

function formatPrice(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  return `${n.toLocaleString("fr-FR")}€`;
}
/* ------------------------ */

export default function AvailableServices({
  services = [],
  moreLink = "/services",      // lien “Voir plus de services”
  title = "Available services",
  onAdd,                       // callback quand on ajoute un service
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState({});   // { [serviceId]: { checked: bool, levelId: string } }

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    let arr = Array.isArray(services) ? services.slice() : [];
    if (needle) {
      arr = arr.filter((s) => {
        const hay = `${s.title ?? ""} ${s.description ?? ""} ${s.category ?? ""}`.toLowerCase();
        return hay.includes(needle);
      });
    }
    return arr;
  }, [services, query]);

  const handleLevelChange = (serviceId, levelId) => {
    setSelected((prev) => ({ 
      ...prev, 
      [serviceId]: { ...(prev[serviceId] || {}), levelId } 
    }));
  };

  const handleCheck = (serviceId, checked) => {
    setSelected((prev) => ({ 
      ...prev, 
      [serviceId]: { ...(prev[serviceId] || {}), checked } 
    }));
  };

  const handleAdd = (svc) => {
    const levels = asLevels(svc);
    const sel = selected[svc.id] || {};
    const level = levels.find((l) => l.id === sel.levelId) || levels[0];

    if (typeof onAdd === "function") {
      onAdd({ service: svc, level });
    } else {
      // Fallback: simple console pour le POC
      // eslint-disable-next-line no-console
      console.log("ADD SERVICE →", { id: svc.id, title: svc.title, level });
    }
  };

  return (
    <div className="layout-pt-md layout-pb-lg">
      <div className="row y-gap-10 justify-between items-end">
        <div className="col-auto">
          <div className="sectionTitle -md">
            <h2 className="sectionTitle__title">{title}</h2>
            <p className="sectionTitle__text mt-5 sm:mt-0">
              {filtered.length} service{filtered.length > 1 ? "s" : ""} pertinent{filtered.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="col-sm-auto">
          <div className="row x-gap-10">
            <div className="col-auto">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher un service…"
                className="form-control h-50 rounded-200 px-20"
                style={{ minWidth: 260 }}
                aria-label="Rechercher un service"
              />
            </div>
            <div className="col-auto">
              <Link href={moreLink} className="button -md -blue-1 bg-blue-1 text-white">
                Voir plus de services
                <i className="icon-arrow-top-right ml-10" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* LISTE — style “Available Rooms” */}
      <div className="y-gap-30 mt-20">
        {filtered.map((svc, idx) => {
          const cover = coverFrom(svc);
          const levels = asLevels(svc);
          const sel = selected[svc.id] || {};
          const currentLevel =
            levels.find((l) => l.id === sel.levelId) || levels[0];

          return (
            <div
              key={svc.id ?? idx}
              className={`bg-blue-2 rounded-4 px-30 py-30 sm:px-20 sm:py-20 ${idx === 0 ? "mt-0" : "mt-30"}`}
            >
              <div className="row y-gap-30">
                {/* Col image + résumé */}
                <div className="col-xl-auto">
                  <div className="ratio ratio-1:1 col-12 col-md-4 col-xl-12">
                    {/* image */}
                    <img
                      src={cover}
                      alt={svc.title || "Service"}
                      width={180}
                      height={180}
                      className="img-ratio rounded-4"
                      style={{ objectFit: "cover" }}
                    />
                  </div>

                  <div className="mt-10">
                    <div className="text-18 fw-500">{svc.title || "Service"}</div>
                    {svc.category ? (
                      <div className="text-14 text-light-1 mt-5">{svc.category}</div>
                    ) : null}
                    <div className="mt-10">
                      <Link
                        href={`/services/${svc.id}`}
                        className="text-blue-1 underline"
                      >
                        Plus d’infos
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Col détails + options */}
                <div className="col-xl">
                  <div className="bg-white rounded-4 px-30 py-30">
                    <div className="row y-gap-30">
                      {/* Description courte */}
                      <div className="col-lg col-md-6">
                        <div className="text-15 fw-500 mb-10">
                          {svc.short_description || "Description"}
                        </div>
                        <div className="y-gap-5">
                          {svc?.highlights?.length
                            ? svc.highlights.slice(0, 3).map((h, i) => (
                                <div className="d-flex items-center text-green-2" key={i}>
                                  <i className="icon-check text-12 mr-10" />
                                  <div className="text-15">{h}</div>
                                </div>
                              ))
                            : (
                              <>
                                <div className="d-flex items-center text-green-2">
                                  <i className="icon-check text-12 mr-10" />
                                  <div className="text-15">Prestataire vérifié</div>
                                </div>
                                {svc.duration ? (
                                  <div className="d-flex items-center text-green-2">
                                    <i className="icon-check text-12 mr-10" />
                                    <div className="text-15">Durée ~ {svc.duration}</div>
                                  </div>
                                ) : null}
                                <div className="d-flex items-center">
                                  <i className="icon-arrow-right text-12 mr-10" />
                                  <div className="text-15">{svc.provider_name || "Voir le prestataire"}</div>
                                </div>
                              </>
                            )}
                        </div>
                      </div>

                      {/* Sélecteur de niveau */}
                      <div className="col-lg-auto col-md-6 border-left-light lg:border-none">
                        <div className="px-10 lg:px-0">
                          <div className="text-15 fw-500 mb-20">Niveau</div>
                          <div className="dropdown js-dropdown">
                            <select
                              style={{ minWidth: 180 }}
                              className="form-select dropdown__button d-flex items-center rounded-4 border-light px-15 h-50 text-14"
                              value={sel.levelId || levels[0]?.id}
                              onChange={(e) => handleLevelChange(svc.id, e.target.value)}
                            >
                              {levels.map((lv) => (
                                <option key={lv.id} value={lv.id}>
                                  {lv.name} {Number.isFinite(lv.price) ? `(${formatPrice(lv.price)})` : ""}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* (Optionnel) Date/heure simple placeholder, prêt pour raccord */}
                      <div className="col-lg-auto col-md-6 border-left-light lg:border-none">
                        <div className="px-10 lg:px-0">
                          <div className="text-15 fw-500 mb-20">Date</div>
                          <input
                            type="date"
                            className="form-control rounded-4 border-light px-15 h-50 text-14"
                            aria-label="Choisir une date"
                          />
                        </div>
                      </div>

                      {/* Sélection + CTA */}
                      <div className="col-lg-auto col-md-6 border-left-light lg:border-none text-right lg:text-left">
                        <div className="pl-40 lg:pl-0">
                          <div className="mb-10">
                            <label className="d-flex items-center">
                              <input
                                type="checkbox"
                                className="form-checkbox mr-10"
                                checked={!!sel.checked}
                                onChange={(e) => handleCheck(svc.id, e.target.checked)}
                              />
                              <span className="text-15 lh-14">Sélectionner ce service</span>
                            </label>
                          </div>

                          <div className="text-14 lh-14 text-light-1 mb-5">
                            {currentLevel?.name || "Standard"}
                          </div>
                          <div className="text-20 lh-14 fw-500">
                            {formatPrice(currentLevel?.price ?? svc.price)}
                          </div>

                          <button
                            type="button"
                            disabled={!sel.checked}
                            onClick={() => handleAdd(svc)}
                            className="button h-50 px-35 -dark-1 bg-blue-1 text-white mt-10"
                            title={!sel.checked ? "Coche d’abord le service" : "Ajouter ce service"}
                          >
                            Ajouter <div className="icon-plus ml-15" />
                          </button>
                        </div>
                      </div>
                      {/* /CTA */}
                    </div>
                  </div>
                </div>
                {/* /col content */}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
