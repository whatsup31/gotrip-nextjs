// components/hotel-single/AvailableServices.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

/* =========================
   Supabase (client public)
========================= */
const supabase =
  typeof window !== "undefined" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ? createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      )
    : null;

/* =========================
   Local storage helpers
========================= */
const STORAGE_KEY = "booking_services";

function readServices() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}
function writeServices(items) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("booking:services-changed"));
}
function upsertService(payload) {
  const items = readServices();
  const i = items.findIndex((x) => x.serviceId === payload.serviceId);
  if (i >= 0) items[i] = { ...items[i], ...payload };
  else items.push(payload);
  writeServices(items);
}
function removeService(serviceId) {
  const items = readServices().filter((x) => x.serviceId !== serviceId);
  writeServices(items);
}

/* =========================
   UI helpers
========================= */
function ensureJpg(src = "") {
  try {
    const url = String(src || "");
    const last = url.split("/").pop() || "";
    return last.includes(".") ? url : `${url}.jpg`;
  } catch {
    return "/img/others/placeholder.jpg";
  }
}
function coverFrom(service) {
  if (Array.isArray(service?.images) && service.images.length)
    return ensureJpg(service.images[0]);
  if (service?.cover_url) return ensureJpg(service.cover_url);
  return "/img/others/placeholder.jpg";
}
function asLevels(svc) {
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
  return [
    {
      id: `std-${svc.id}`,
      name: "Standard",
      price: Number(svc.price ?? 0),
      description: "",
    },
  ];
}
function formatPrice(v) {
  const n = Number(v);
  return Number.isFinite(n) ? `${n.toLocaleString("fr-FR")}€` : "—";
}

/* =========================
   Component
========================= */
export default function AvailableServices({
  services = [],
  moreLink = "/services",
  title = "Available services",
  listingId,
}) {
  // { [serviceId]: { checked, levelId, qty } }
  const [selected, setSelected] = useState({});
  const [query, setQuery] = useState("");

  // Infos complémentaires depuis la DB si manquantes en props
  // shape: { [id]: { description, rating_avg } }
  const [dbDetails, setDbDetails] = useState({});

  // Hydrate l'état à partir du localStorage (si retour sur la page)
  useEffect(() => {
    const stored = readServices();
    if (!Array.isArray(stored) || !stored.length) return;
    setSelected((prev) => {
      const next = { ...prev };
      stored.forEach((it) => {
        next[it.serviceId] = {
          ...(next[it.serviceId] || {}),
          checked: true,
          levelId: it.levelId,
          qty: it.qty || 1,
        };
      });
      return next;
    });
  }, []);

  // Récupère description + rating_avg depuis Supabase si non présents
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        if (!supabase) return;
        const ids = (services || [])
          .map((s) => s?.id)
          .filter((x) => x !== undefined && x !== null);
        if (!ids.length) return;

        const { data, error } = await supabase
          .from("services")
          .select("id, description, rating_avg")
          .in("id", ids);

        if (error) throw error;

        const map = {};
        (data || []).forEach((row) => {
          map[row.id] = {
            description: row.description ?? "",
            rating_avg: row.rating_avg != null ? Number(row.rating_avg) : null,
          };
        });

        if (alive) setDbDetails(map);
      } catch (e) {
        console.error("AvailableServices: supabase fetch error", e);
      }
    })();
    return () => {
      alive = false;
    };
  }, [services]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    let arr = Array.isArray(services) ? services.slice() : [];
    if (needle) {
      arr = arr.filter((s) =>
        `${s.title ?? ""} ${s.description ?? ""} ${s.category ?? ""}`
          .toLowerCase()
          .includes(needle)
      );
    }
    return arr;
  }, [services, query]);

  const setLocalState = (serviceId, patch) =>
    setSelected((prev) => ({
      ...prev,
      [serviceId]: { ...(prev[serviceId] || {}), ...patch },
    }));

  const persistAdd = (svc, level, qty) => {
    const unitPrice = Number(level.price ?? svc.price ?? 0);
    upsertService({
      serviceId: svc.id,
      title: svc.title || "Service",
      levelId: level.id,
      levelName: level.name,
      unitPrice,
      qty,
      price: unitPrice * qty, // utilisé par BookingForm pour totaliser
      listingId: listingId ?? svc.listing_id ?? null,
      cover: coverFrom(svc),
    });
  };

  const handleLevelChange = (serviceId, levelId, svc) => {
    setLocalState(serviceId, { levelId });
    // MAJ panier si déjà coché
    const levels = asLevels(svc);
    const lv = levels.find((l) => l.id === levelId) || levels[0];
    const qty = Number(selected[serviceId]?.qty || 1);
    if (selected[serviceId]?.checked) persistAdd(svc, lv, qty);
  };

  const handleQtyChange = (serviceId, value, svc) => {
    const qty = Math.max(1, Number(value) || 1);
    setLocalState(serviceId, { qty });
    // MAJ panier si déjà coché
    const levels = asLevels(svc);
    const levelId = selected[serviceId]?.levelId || levels[0]?.id;
    const lv = levels.find((l) => l.id === levelId) || levels[0];
    if (selected[serviceId]?.checked) persistAdd(svc, lv, qty);
  };

  const handleCheck = (serviceId, checked, svc) => {
    const levels = asLevels(svc);
    const levelId = selected[serviceId]?.levelId || levels[0]?.id;
    const lv = levels.find((l) => l.id === levelId) || levels[0];
    const qty = Number(selected[serviceId]?.qty || 1);

    setLocalState(serviceId, { checked });

    if (checked) {
      persistAdd(svc, lv, qty);
    } else {
      removeService(serviceId);
    }
  };

  const handleAddClick = (svc) => {
    const levels = asLevels(svc);
    const sel = selected[svc.id] || {};
    const lv = levels.find((l) => l.id === sel.levelId) || levels[0];
    const qty = Number(sel.qty || 1);

    // ajoute + coche
    persistAdd(svc, lv, qty);
    setLocalState(svc.id, { checked: true });
  };

  // largeur fixe pour uniformiser “Ajouter” et “Ajouté”
  const BUTTON_WIDTH = 160;

  return (
    <div className="layout-pt-md layout-pb-lg">
      <div className="row y-gap-10 justify-between items-end">
        <div className="col-auto">
          <div className="sectionTitle -md">
            <h2 className="sectionTitle__title">{title}</h2>
            <p className="sectionTitle__text mt-5 sm:mt-0">
              {filtered.length} service{filtered.length > 1 ? "s" : ""} trouvé
              {filtered.length > 1 ? "s" : ""}
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
              <Link
                href={moreLink}
                className="button -md -blue-1 bg-blue-1 text-white"
              >
                Voir plus de services <i className="icon-arrow-top-right ml-10" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* LISTE */}
      <div className="y-gap-30 mt-20">
        {filtered.map((svc, idx) => {
          const cover = coverFrom(svc);
          const levels = asLevels(svc);
          const sel = selected[svc.id] || {};
          const level = levels.find((l) => l.id === sel.levelId) || levels[0];
          const qty = Number(sel.qty || 1);
          const isChecked = !!sel.checked;

          // description : props > DB
          const desc =
            (typeof svc.description === "string" && svc.description?.trim()) ||
            dbDetails[svc.id]?.description ||
            "";

          // rating_avg : props > DB
          const rating =
            (svc.rating_avg != null ? Number(svc.rating_avg) : null) ??
            (dbDetails[svc.id]?.rating_avg != null
              ? Number(dbDetails[svc.id]?.rating_avg)
              : null);

          return (
            <div
              key={svc.id ?? idx}
              className={`bg-blue-2 rounded-4 px-30 py-30 sm:px-20 sm:py-20 ${
                idx === 0 ? "mt-0" : "mt-30"
              }`}
            >
              <div className="row y-gap-30">
                {/* Image + résumé */}
                <div className="col-xl-auto">
                  <div className="ratio ratio-1:1 col-12 col-md-4 col-xl-12">
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
                    <div className="d-flex items-center">
                      <div className="text-18 fw-500">
                        {svc.title || "Service"}
                      </div>

                      {/* Pastille note (style TopServicesV2) */}
                      {Number.isFinite(rating) ? (
                        <div className="flex-center bg-blue-1 rounded-4 size-30 text-12 fw-600 text-white ml-10">
                          {Number(rating).toFixed(1)}
                        </div>
                      ) : null}
                    </div>

                    {svc.category ? (
                      <div className="text-14 text-light-1 mt-5">
                        {svc.category}
                      </div>
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

                {/* Détails + options */}
                <div className="col-xl">
                  <div className="bg-white rounded-4 px-30 py-30">
                    <div className="row y-gap-30">
                      {/* Description */}
                      <div className="col-lg col-md-6">
                        <div className="text-15 fw-500 mb-10">Description</div>
                        <div className="text-14">{desc || "—"}</div>
                        <div className="d-flex items-center text-green-2 mt-10">
                          <i className="icon-check text-12 mr-10" />
                          <div className="text-15">Prestataire vérifié</div>
                        </div>
                      </div>

                      {/* Sélecteur de niveau + quantité */}
                      <div className="col-lg-auto col-md-6 border-left-light lg:border-none">
                        <div className="px-10 lg:px-0">
                          <div className="text-15 fw-500 mb-10">Niveau</div>
                          <select
                            style={{ minWidth: 180 }}
                            className="form-select rounded-4 border-light px-15 h-50 text-14 mb-10"
                            value={sel.levelId || levels[0]?.id}
                            onChange={(e) =>
                              handleLevelChange(svc.id, e.target.value, svc)
                            }
                          >
                            {levels.map((lv) => (
                              <option key={lv.id} value={lv.id}>
                                {lv.name}{" "}
                                {Number.isFinite(lv.price)
                                  ? `(${formatPrice(lv.price)})`
                                  : ""}
                              </option>
                            ))}
                          </select>

                          <div className="text-15 fw-500 mb-8">
                            Nombre de prestations
                          </div>
                          <input
                            type="number"
                            min={1}
                            className="form-control rounded-4 border-light px-15 h-50 text-14"
                            value={qty}
                            onChange={(e) =>
                              handleQtyChange(svc.id, e.target.value, svc)
                            }
                          />
                        </div>
                      </div>

                      {/* Sélection + prix */}
                      <div className="col-lg-auto col-md-6 border-left-light lg:border-none text-right lg:text-left">
                        <div className="pl-40 lg:pl-0">
                          <div className="mb-10">
                            <label className="d-flex items-center">
                              <input
                                type="checkbox"
                                className="form-checkbox mr-10"
                                checked={isChecked}
                                onChange={(e) =>
                                  handleCheck(
                                    svc.id,
                                    e.target.checked,
                                    svc
                                  )
                                }
                              />
                              <span className="text-15 lh-14">
                                Sélectionner ce service
                              </span>
                            </label>
                          </div>

                          <div className="text-14 lh-14 text-light-1 mb-5">
                            {level?.name || "Standard"} • {qty} prestation
                            {qty > 1 ? "s" : ""}
                          </div>
                          <div className="text-20 lh-14 fw-500">
                            {formatPrice(
                              (Number(level?.price ?? svc.price) || 0) * qty
                            )}
                          </div>

                          {/* Bouton Ajouter / Ajouté (taille uniforme) */}
                          <button
                            type="button"
                            onClick={() => handleAddClick(svc)}
                            className={`button h-50 px-35 mt-10 ${
                              isChecked
                                ? "" // on gère le style en inline pour forcer le vert visible en disabled
                                : "-dark-1 bg-blue-1 text-white"
                            }`}
                            disabled={isChecked}
                            style={{
                              // taille fixe + centrage pour uniformiser
                              width: BUTTON_WIDTH,
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 8,
                              // style du bouton "Ajouté" (disabled) pour rester vert et visible
                              ...(isChecked
                                ? {
                                    backgroundColor: "#22c55e",
                                    color: "#ffffff",
                                    opacity: 1,
                                    cursor: "default",
                                  }
                                : null),
                            }}
                            title={isChecked ? "Ajouté" : "Ajouter ce service"}
                          >
                            {isChecked ? (
                              "Ajouté"
                            ) : (
                              <>
                                Ajouter <div className="icon-plus" />
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                      {/* /Sélection + prix */}
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
