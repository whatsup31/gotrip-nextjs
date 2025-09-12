// app/host/new-listing/page.tsx
import { supabaseServer } from '@/utils/supabase-server'
import { redirect } from 'next/navigation'

export default async function NewListingPage() {
  const supabase = supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // (Optionnel) vérifier que c'est un host
  const { data: prof } = await supabase.from('profiles').select('role').eq('user_id', user.id).single()
  if (prof?.role !== 'host') redirect('/')

  // Formulaire minimal qui poste sur l'API
  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Create a listing</h1>
      <form action="/api/listings" method="post" className="space-y-3">
        <input name="title" placeholder="Title" className="w-full border rounded p-2" required />
        <input name="location" placeholder="Location" className="w-full border rounded p-2" required />
        <textarea name="description" placeholder="Description" className="w-full border rounded p-2" />
        <input name="price_per_night" type="number" placeholder="120" className="w-full border rounded p-2" required />
        <button className="border rounded p-2 w-full">Create</button>
      </form>
    </div>
  )
}
