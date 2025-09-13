// app/(dashboards)/host/payouts/page.tsx
export default function Page() {
  // Page purement UI – ton collègue pose la maquette ici
  return (
    <div className="space-y-20">
      <h2 className="text-20 fw-600">Payouts</h2>

      {/* TODO: tableau des paiements, filtres, export, etc. */}
      <div className="rounded-3 border p-20">
        <p>Payments summary (placeholder)</p>
      </div>

      {/* Ex: <PayoutsTable /> quand tu feras le vrai composant */}
    </div>
  )
}
