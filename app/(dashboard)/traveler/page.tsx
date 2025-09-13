export default function Page() {
  return (
    <div className="space-y-16">
      <h1 className="text-24 fw-600">Traveler — Dashboard</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-20">
        <div className="rounded-3 border p-20">Next trip (placeholder)</div>
        <div className="rounded-3 border p-20">Upcoming trips</div>
        <div className="rounded-3 border p-20">Favorites count</div>
        <div className="rounded-3 border p-20">Messages</div>
      </div>

      <div className="rounded-3 border p-20">
        <p>Recent activity / recommendations (placeholder)</p>
      </div>
    </div>
  )
}
