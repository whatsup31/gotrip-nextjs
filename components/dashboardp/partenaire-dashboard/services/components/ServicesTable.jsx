// components/dashboardp/partenaire-dashboard/services/components/ServicesTable.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Pagination from "../../common/Pagination";
import ActionsButton from "./ActionsButton";

const fmtDate = (iso) => {
  try { const d = new Date(iso); return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString("fr-FR"); }
  catch { return "—"; }
};

const ReviewsBadge = ({ value }) => {
  const n = Number(value || 0);
  return (
    <div className="rounded-4 size-35 bg-blue-1 text-white flex-center text-12 fw-600">
      {Number.isFinite(n) && n > 0 ? n.toFixed(1) : "—"}
    </div>
  );
};

export default function ServicesTable() {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const tabs = useMemo(
    () => [
      "Liste de tous les produits", "Completed", "Processing", "Confirmed",
      "Cancelled", "Paid", "Unpaid", "Partial Payment",
    ],
    []
  );

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      // 1) Essayer d'envoyer le Bearer depuis le client (si Supabase Auth est utilisé)
      let headers = {};
      try {
        const { supabaseBrowser } = await import("@/utils/supabase-browser");
        const supabase = supabaseBrowser();
        const { data } = await supabase.auth.getSession();
        const token = data?.session?.access_token;
        if (token) headers = { Authorization: `Bearer ${token}` };
      } catch {
        // pas de supabase-browser dispo → on laisse headers vide
      }

      const res = await fetch("/api/services/provider", {
        cache: "no-store",
        headers,
      });

      const ct = res.headers.get("content-type") || "";
      const json = ct.includes("application/json") ? await res.json() : { ok: false, error: await res.text() };

      if (!res.ok || !json?.ok) throw new Error(json?.error || `HTTP ${res.status}`);

      setRows(Array.isArray(json.data) ? json.data : []);
    } catch (e) {
      setRows([]);
      setError(e?.message || "Erreur inattendue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = rows; // pas de statut -> tout
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <>
      <div className="tabs -underline-2 js-tabs">
        <div className="tabs__controls row x-gap-40 y-gap-10 lg:x-gap-20 js-tabs-controls">
          {tabs.map((t, i) => (
            <div className="col-auto" key={i}>
              <button
                className={`tabs__button text-18 lg:text-16 text-light-1 fw-500 pb-5 lg:pb-0 js-tabs-button ${
                  activeTab === i ? "is-tab-el-active" : ""
                }`}
                onClick={() => { setActiveTab(i); setPage(1); }}
              >
                {t}
              </button>
            </div>
          ))}
        </div>

        <div className="tabs__content pt-30 js-tabs-content">
          <div className="tabs__pane -tab-item-1 is-tab-el-active">
            <div className="overflow-scroll scroll-bar-1">
              {loading ? (
                <div className="py-30">Chargement…</div>
              ) : error ? (
                <div className="py-30 text-red-2">{error}</div>
              ) : pageRows.length === 0 ? (
                <div className="py-30">Aucun service.</div>
              ) : (
                <table className="table-3 -border-bottom col-12">
                  <thead className="bg-light-2">
                    <tr>
                      <th>
                        <div className="d-flex items-center">
                          <div className="form-checkbox ">
                            <input type="checkbox" name="select_all" />
                            <div className="form-checkbox__mark">
                              <div className="form-checkbox__icon icon-check" />
                            </div>
                          </div>
                        </div>
                      </th>
                      <th>Name</th>
                      <th>Location</th>
                      <th>Status</th>
                      <th>Reviews</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {pageRows.map((s) => (
                      <tr key={s.id}>
                        <td>
                          <div className="d-flex items-center">
                            <div className="form-checkbox ">
                              <input type="checkbox" name={`srv_${s.id}`} />
                              <div className="form-checkbox__mark">
                                <div className="form-checkbox__icon icon-check" />
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="text-blue-1 fw-500">{s.title || "—"}</td>
                        <td>{s.area || "—"}</td>
                        <td>
                          <span className="rounded-100 py-4 px-10 text-center text-14 fw-500 bg-blue-1-05 text-blue-1">
                            Live
                          </span>
                        </td>
                        <td><ReviewsBadge value={s.rating_avg} /></td>
                        <td>{fmtDate(s.created_at)}</td>

                        <td>
                          <div className="row x-gap-10 y-gap-10 items-center">
                            <div className="col-auto">
                              <a href={`/services/${s.id}`} className="flex-center bg-light-2 rounded-4 size-35" title="Voir">
                                <i className="icon-eye text-16 text-light-1" />
                              </a>
                            </div>
                            <div className="col-auto">
                              <a href={`/partenaire-dashboard/services/${s.id}/edit`} className="flex-center bg-light-2 rounded-4 size-35" title="Éditer">
                                <i className="icon-edit text-16 text-light-1" />
                              </a>
                            </div>
                            <div className="col-auto">
                              <button type="button" className="flex-center bg-light-2 rounded-4 size-35" title="Supprimer" onClick={() => alert("Suppression à implémenter")}>
                                <i className="icon-trash-2 text-16 text-light-1" />
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="d-flex items-center gap-10 mt-20">
              <button className="button -md bg-light-2" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>←</button>
              <div>Page {page} / {totalPages}</div>
              <button className="button -md bg-light-2" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>→</button>
            </div>
          </div>
        </div>
      </div>

      <Pagination />
    </>
  );
}
