// components/dashboardc/conciergerie-dashboard/booking/components/BookingTable.jsx
'use client'

import { useEffect, useMemo, useState } from "react";
import Pagination from "../../common/Pagination";
import ActionsButton from "./ActionsButton";

function fmtDate(d) {
  try {
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return "—";
    return dt.toLocaleDateString("fr-FR");
  } catch { return "—"; }
}

function computeBucket(row) {
  // Classement métier pour les onglets
  // Terminées: check_out < aujourd'hui && status != 'cancelled'
  // En cours : check_in <= aujourd'hui <= check_out && status != 'cancelled'
  // À venir  : aujourd'hui < check_in && status != 'cancelled'
  // Annulées : status == 'cancelled'
  const today = new Date(); today.setHours(0,0,0,0);
  const ci = new Date(row.check_in);  ci.setHours(0,0,0,0);
  const co = new Date(row.check_out); co.setHours(0,0,0,0);
  const cancelled = (row.status || "").toLowerCase() === "cancelled";

  if (cancelled) return "Annulées";
  if (co < today) return "Terminées";
  if (ci > today) return "À venir";
  return "En cours";
}

export default function BookingTable() {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  
  // pagination simple (client)
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const tabItems = [
    "Toutes les réservations",
    "Terminées",
    "En cours",
    "À venir",
    "Annulées",
    "Payées",
    "En cours de paiement",
  ];

const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/host/reservations", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok || !json?.ok) throw new Error(json?.error || "Erreur");
      setRows(json.data.items || []);
    } catch (e) {
      setError(e?.message || "Erreur inattendue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      await fetchData();
    })();
    return () => { mounted = false; };
  }, []);

  // Filtrage par onglet
  const filtered = useMemo(() => {
    if (activeTab === 0) return rows;

    const label = tabItems[activeTab];
    if (label === "Payées") {
      return rows.filter(r => (r.payment_status || "").toLowerCase() === "paid");
    }
    if (label === "En cours de paiement") {
      return rows.filter(r => (r.payment_status || "").toLowerCase() === "pending");
    }
    // Buckets temporels
    return rows.filter(r => computeBucket(r) === label);
  }, [rows, activeTab]);

  // Pagination client
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page-1)*pageSize, (page)*pageSize);

  const handleTabClick = (i) => {
    setActiveTab(i);
    setPage(1);
  };

  return (
    <>
      <div className="tabs -underline-2 js-tabs">
        <div className="tabs__controls row x-gap-40 y-gap-10 lg:x-gap-20 js-tabs-controls">
          {tabItems.map((item, index) => (
            <div className="col-auto" key={index}>
              <button
                className={`tabs__button text-18 lg:text-16 text-light-1 fw-500 pb-5 lg:pb-0 js-tabs-button ${activeTab === index ? "is-tab-el-active" : ""}`}
                onClick={() => handleTabClick(index)}
              >
                {item}
              </button>
            </div>
          ))}
        </div>

        <div className="tabs__content pt-30 js-tabs-content">
          <div className="tabs__pane -tab-item-1 is-tab-el-active">
            <div className="overflow-scroll scroll-bar-1">
              {loading ? (
                <div className="py-30 text-15">Chargement…</div>
              ) : error ? (
                <div className="py-30 text-red-2">{error}</div>
              ) : pageRows.length === 0 ? (
                <div className="py-30 text-15">Aucune réservation.</div>
              ) : (
                <table className="table-3 -border-bottom col-12">
                  <thead className="bg-light-2">
                    <tr>
                      <th>Numéro</th>
                      <th>Titre</th>
                      <th>Réservation</th>
                      <th>Séjour</th>
                      <th>Status</th>
                      <th>Total</th>
                      <th>Commission</th>
                      <th>Paiment</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageRows.map((r) => {
                      const bucket = computeBucket(r);
                      const statusBadge = {
                        "Annulées": "bg-red-3 text-red-2",
                        "Terminées": "bg-blue-1-05 text-blue-1",
                        "En cours": "bg-yellow-4 text-yellow-3",
                        "À venir": "bg-yellow-4 text-yellow-3",
                      }[bucket] || "bg-yellow-4 text-yellow-3";

                      return (
                        <tr key={r.reservation_id}>
                          <td>#{r.reservation_id}</td>
                          <td>{r.listing_title || "—"}</td>
                          <td>{fmtDate(r.reservation_created_at)}</td>
                          <td className="lh-16">
                            Check in : {fmtDate(r.check_in)}<br/>
                            Check out : {fmtDate(r.check_out)}
                          </td>
                          <td>
                            <span className={`rounded-100 py-4 px-10 text-center text-14 fw-500 ${statusBadge}`}>
                              {bucket}
                            </span>
                          </td>
                          <td>€{Number(r.total_amount || 0).toLocaleString("fr-FR")}</td>
                          <td>€0</td>
                          <td>
                            <span className="rounded-100 py-4 px-10 text-center text-14 fw-500 bg-yellow-4 text-yellow-3">
                              {(r.payment_status || "Pending")}
                            </span>
                          </td>
                          <td>
                            <ActionsButton 
								reservationId={r.reservation_id}
								status={r.status}
								onActionDone={fetchData}
								/>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pagination (garde ta pagination commune) */}
      <div className="mt-20">
        <Pagination
          total={filtered.length}
          page={page}
          pageSize={pageSize}
          onPageChange={(p) => setPage(p)}
        />
      </div>
    </>
  );
}
