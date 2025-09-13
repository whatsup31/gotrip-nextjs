import { supabaseServer } from '@/utils/supabase-server'
import { redirect } from 'next/navigation'

export default async function ConciergeLayout({ children }: { children: React.ReactNode }) {
  const supabase = supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: prof } = await supabase
    .from('profiles')
    .select('role, display_name')
    .eq('user_id', user.id)
    .single()

  if (prof?.role !== 'conciergerie') redirect('/')

  const nav = [
    { label: 'Dashboard', href: '/concierge' },
    { label: 'Requests', href: '/concierge/requests' },
    { label: 'Bookings', href: '/concierge/bookings' },
    { label: 'Customers', href: '/concierge/customers' },
    { label: 'Settings', href: '/concierge/settings' },
  ]
  
  return <>{children}</>
}
