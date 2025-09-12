import { supabaseServer } from '@/utils/supabase-server'
import { redirect } from 'next/navigation'

export default async function Trips() {
  const supabase = supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data, error } = await supabase
    .from('bookings')
    .select('id, start_date, end_date, total_price, nights, listing_id, created_at, listings:listing_id(title, location)')
    .eq('user_id', user.id)
    .order('id', { ascending: false })

  if (error) return <div className="p-6 text-red-600">{error.message}</div>

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-3">
      <h1 className="text-2xl font-semibold">My trips</h1>
      <ul className="space-y-2">
        {data?.map(b => (
          <li key={b.id} className="border rounded p-3">
            <div className="font-medium">{b.listings?.title} — {b.listings?.location}</div>
            <div className="text-sm">From {b.start_date} to {b.end_date} • {b.nights} nights</div>
            <div className="text-sm">Total: €{b.total_price}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
