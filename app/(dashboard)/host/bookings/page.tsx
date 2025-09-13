// app/host/bookings/page.tsx
import { supabaseServer } from '@/utils/supabase-server'
import { redirect } from 'next/navigation'
import BookingsRealtime from './realtime'

export default async function HostBookingsPage() {
  const supabase = supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // 1) récupérer mes listings (host)
  const { data: myListings, error: lerr } = await supabase
    .from('listings')
    .select('id, title, location')
    .eq('host_id', user.id)

  if (lerr) return <div className="p-6 text-red-600">{lerr.message}</div>
  const listingIds = (myListings ?? []).map(l => l.id)

  // 2) récupérer les bookings liés à mes listings
  let bookings: any[] = []
  if (listingIds.length) {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        id, start_date, end_date, nights, total_price, status, created_at, listing_id,
        listings:listing_id ( title, location )
      `)
      .in('listing_id', listingIds)
      .order('id', { ascending: false })

    if (error) return <div className="p-6 text-red-600">{error.message}</div>
    bookings = data ?? []
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Bookings (host)</h1>
        <a className="underline" href="/host/listings">My listings</a>
      </div>

      {!bookings.length && <div className="opacity-70">No bookings yet.</div>}

      <ul className="space-y-3">
        {bookings.map(b => (
          <li key={b.id} className="border rounded p-3">
            <div className="font-medium">{b.listings?.title} — {b.listings?.location}</div>
            <div className="text-sm">From {b.start_date} to {b.end_date} • {b.nights} nights</div>
            <div className="text-sm">Total: €{b.total_price} • Status: {b.status}</div>
            <div className="text-xs opacity-60">#{b.id} • created {new Date(b.created_at).toLocaleString()}</div>
          </li>
        ))}
      </ul>

      {/* Composant client qui écoute le temps réel et rafraîchit */}
      <BookingsRealtime />
    </div>
  )
}
