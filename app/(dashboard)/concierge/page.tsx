export default function Page() {
  return (
    <div className="space-y-16">
      <h1 className="text-24 fw-600">Concierge – Dashboard</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-20">
        <div className="rounded-3 border p-20">New requests (today)</div>
        <div className="rounded-3 border p-20">Bookings in progress</div>
        <div className="rounded-3 border p-20">Customers</div>
        <div className="rounded-3 border p-20">Revenue (WIP)</div>
      </div>

      <div className="rounded-3 border p-20">
        <p>Recent activity (placeholder)</p>
      </div>
    </div>
  )
}
