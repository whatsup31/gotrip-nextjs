// app/(dashboards)/host/settings/page.tsx
export default function Page() {
  // Page purement UI – maquette de formulaires
  return (
    <div className="space-y-20">
      <h2 className="text-20 fw-600">Settings</h2>

      {/* TODO: profil public, coordonnées, préférences de réservation, notifications... */}
      <div className="rounded-3 border p-20">
        <p>Account & property settings (placeholder)</p>
      </div>

      {/* Ex: <HostSettingsForm /> quand tu feras le vrai composant */}
    </div>
  )
}
