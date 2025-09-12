import { supabaseServer } from '@/utils/supabase-server'
import { redirect } from 'next/navigation'

export default async function NewBooking({ searchParams }: { searchParams: { listing?: string } }) {
  const supabase = supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const listingId = Number(searchParams?.listing || 0)
  if (!listingId) redirect('/')

  const { data: listing } = await supabase.from('listings').select('id,title,price_per_night,location').eq('id', listingId).single()

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Book: {listing?.title}</h1>
      <form action="/api/bookings" method="post" className="space-y-3">
        <input type="hidden" name="listing_id" value={listingId} />
        <label className="block">
          <span>Start date</span>
          <input name="start_date" type="date" className="w-full border rounded p-2" required />
        </label>
        <label className="block">
          <span>End date</span>
          <input name="end_date" type="date" className="w-full border rounded p-2" required />
        </label>
        {/* POC: pas de services via form; on les passera plus tard par JSON */}
        <button className="w-full border rounded p-2">Confirm booking</button>
      </form>
    </div>
  )
}
