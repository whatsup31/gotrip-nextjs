import { supabaseServer } from '@/utils/supabase-server'
import { redirect } from 'next/navigation'

export default async function ProviderServices() {
  const supabase = supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('provider_id', user.id)
    .order('id', { ascending: false })

  if (error) return <div className="p-6 text-red-600">{error.message}</div>

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-3">
      <h1 className="text-2xl font-semibold">My services</h1>
      <a className="underline" href="/provider/new-service">+ New service</a>
      <ul className="space-y-2">
        {data?.map(s => (
          <li key={s.id} className="border rounded p-3">
            <div className="font-medium">{s.title} — {s.category}</div>
            <div className="text-sm opacity-70">{s.area || '—'}</div>
            <div className="text-sm">€{s.price}{s.duration_min ? ` • ${s.duration_min} min` : ''}</div>
            {s.description && <div className="text-sm mt-1">{s.description}</div>}
          </li>
        ))}
      </ul>
    </div>
  )
}
