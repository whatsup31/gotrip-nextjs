import DashboardPage from '@/components/dashboardc/conciergerie-dashboard/add-hotel';
import { supabaseServer } from '@/utils/supabase-server'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Create Listing || GoTrip',
  description: 'Host create listing page',
}

export default async function Page() {
  // Vérification utilisateur
  const supabase = supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Vérification du rôle host
  const { data: prof } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (prof?.role !== 'host') redirect('/')

  // Rend directement le composant UI du formulaire
  return <DashboardPage />
}
