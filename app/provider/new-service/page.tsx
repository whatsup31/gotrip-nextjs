import { supabaseServer } from '@/utils/supabase-server'
import { redirect } from 'next/navigation'

export default async function NewServicePage() {
  const supabase = supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // (optionnel) n’autoriser que le rôle provider
  const { data: prof } = await supabase.from('profiles').select('role').eq('user_id', user.id).single()
  if (prof?.role !== 'provider') redirect('/')

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Create a service</h1>
      <form action="/api/services" method="post" className="space-y-3">
        <input name="title" className="w-full border rounded p-2" placeholder="Title" required />
        <input name="category" className="w-full border rounded p-2" placeholder="Category (e.g., Activity)" required />
        <textarea name="description" className="w-full border rounded p-2" placeholder="Description" />
        <input name="price" type="number" className="w-full border rounded p-2" placeholder="Price" required />
        <input name="duration_min" type="number" className="w-full border rounded p-2" placeholder="Duration (min)" />
        <input name="area" className="w-full border rounded p-2" placeholder="Area (e.g., Lyon Center)" />
        <button className="w-full border rounded p-2">Create</button>
      </form>
    </div>
  )
}
