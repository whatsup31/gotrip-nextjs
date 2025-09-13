// app/(dashboards)/host/layout.tsx
import { supabaseServer } from '@/utils/supabase-server'
import { redirect } from 'next/navigation'

export default async function HostLayout({ children }: { children: React.ReactNode }) {
  // Auth + rôle une seule fois ici
  const supabase = supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: prof } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (prof?.role !== 'host') redirect('/')

  // Navigation du host
  const nav = [
    { label: 'Dashboard', href: '/host' },
    { label: 'My listings', href: '/host/listings' },
    { label: 'Bookings', href: '/host/bookings' },
    { label: 'Payouts', href: '/host/payouts' },
    { label: 'Settings', href: '/host/settings' },
  ]

    return <>{children}</>
}
