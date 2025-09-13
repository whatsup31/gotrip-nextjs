import { supabaseServer } from '@/utils/supabase-server'
import { redirect } from 'next/navigation'

export default async function ProviderLayout({ children }: { children: React.ReactNode }) {
  const supabase = supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: prof } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (prof?.role !== 'provider') redirect('/')

  const nav = [
    { label: 'Dashboard', href: '/provider' },
    { label: 'Services', href: '/provider/services' },
    { label: 'New service', href: '/provider/services/new' },
    { label: 'Settings', href: '/provider/settings' },
  ]

  return <>{children}</>
}
