import { supabaseServer } from '@/utils/supabase-server'
import { redirect } from 'next/navigation'

export default async function HostListings() {
  const supabase = supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('host_id', user.id)
    .order('id', { ascending: false })

  if (error) return <div className="p-6 text-red-600">{error.message}</div>

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-3">
      <h1 className="text-2xl font-semibold">My listings</h1>
      <a className="underline" href="/host/listings/new">+ New listing</a>
      <ul className="space-y-2">
        {data?.map(l => (
          <li key={l.id} className="border rounded p-3">
            <div className="font-medium">{l.title}</div>
            <div className="text-sm opacity-70">{l.location}</div>
            <div className="text-sm">€{l.price_per_night}/night</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
