// components/dashboardc/conciergerie-dashboard/booking/components/ActionsButton.jsx
"use client";

import { useState } from "react";

export default function ActionsButton({ reservationId, status, onActionDone }) {
  const [busy, setBusy] = useState(false);

  const normalized = (status || "").toLowerCase();
  const isCancelled = normalized === "cancelled";
  const isConfirmed = normalized === "confirmed";

  // règles simples :
  // - Confirmer disponible si pas déjà confirmé ou annulé
  // - Annuler dispo si pas déjà annulé
  const canConfirm = !isConfirmed && !isCancelled;
  const canCancel = !isCancelled;

  const call = async (url) => {
    try {
      setBusy(true);
      const res = await fetch(url, { method: "POST" });
      const json = await res.json();
      if (!res.ok || !json?.ok) {
        alert(json?.error || "Erreur");
        return;
      }
      onActionDone?.(); // re-fetch déclenché par le parent
    } catch (e) {
      alert(e?.message || "Erreur");
    } finally {
      setBusy(false);
    }
  };

  const onConfirm = () => call(`/api/reservations/${reservationId}/confirm`);
  const onCancel  = () => call(`/api/reservations/${reservationId}/cancel`);

  const itemClass = (enabled) =>
    `js-dropdown-link ${enabled && !busy ? "" : "-disabled"}`;

  return (
    <div className="dropdown js-dropdown js-actions-1-active">
      <div
        className="dropdown__button d-flex items-center"
        data-el-toggle=".js-actions-1-toggle"
        data-el-toggle-active=".js-actions-1-active"
      >
        <span className="text-14 fw-500 text-blue-1">{busy ? "…" : "Actions"}</span>
        <i className="icon-chevron-sm-down text-7 ml-10"></i>
      </div>

      <div className="dropdown__menu mt-10 shadow-2 js-actions-1-toggle">
        <div className="bg-white px-20 py-20 rounded-4">
          <div className="y-gap-5 js-dropdown-list">
            <button
              className={itemClass(canConfirm)}
              onClick={canConfirm && !busy ? onConfirm : undefined}
              disabled={!canConfirm || busy}
            >
              Confirmer
            </button>
            <button
              className={itemClass(canCancel)}
              onClick={canCancel && !busy ? onCancel : undefined}
              disabled={!canCancel || busy}
            >
              Annuler
            </button>
            <div className="js-dropdown-link -disabled">Détails (bientôt)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
