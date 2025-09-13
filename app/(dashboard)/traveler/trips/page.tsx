import { supabaseServer } from '@/utils/supabase-server'
import { redirect } from 'next/navigation'

type BookingRow = {
  id: number
  start_date: string
  end_date: string
  nights: number | null
  total_price: number | null
  created_at: string
  listing_id: number
  listings: {
    title: string | null
    location: string | null
  } | null
}

export default async function Page() {
  const supabase = supabaseServer()

  // Auth guard
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Récupération des réservations du voyageur
  const { data, error } = await supabase
    .from('bookings')
    .select(
      'id, start_date, end_date, nights, total_price, listing_id, created_at, listings:listing_id(title, location)'
    )
    .eq('user_id', user.id)               // ← garde le même filtre que ta version existante
    .order('id', { ascending: false })

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-red-600">
        {error.message}
      </div>
    )
  }

  const bookings = (data ?? []) as BookingRow[]

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">My trips</h1>

      {bookings.length === 0 && (
        <div className="rounded-3 border p-4 text-sm opacity-80">
          You have no trips yet.
        </div>
      )}

      <ul className="space-y-3">
        {bookings.map((b) => {
          const start = new Date(b.start_date)
          const end = new Date(b.end_date)
          const dateRange = `From ${start.toLocaleDateString()} to ${end.toLocaleDateString()}`
          const nights = b.nights != null ? `${b.nights} nights` : ''

          return (
            <li key={b.id} className="rounded-3 border p-4">
              <div className="font-medium">
                {b.listings?.title ?? '—'}{` `}
                <span className="opacity-70">— {b.listings?.location ?? '—'}</span>
              </div>
              <div className="text-sm mt-1">
                {dateRange} {nights && `• ${nights}`}
              </div>
              <div className="text-sm mt-1">
                Total: {b.total_price != null ? `€${b.total_price}` : '—'}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
