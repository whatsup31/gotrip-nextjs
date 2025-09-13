import { supabaseServer } from '@/utils/supabase-server'
import { redirect } from 'next/navigation'

export default async function TravelerLayout({ children }: { children: React.ReactNode }) {
  const supabase = supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: prof, error } = await supabase
    .from('profiles')
    .select('role, display_name')
    .eq('user_id', user.id)
    .single()

  if (error) {
    // En POC, on renvoie à la home
    redirect('/')
  }

  if (prof?.role !== 'traveler') redirect('/')

  const nav = [
    { label: 'Dashboard', href: '/traveler' },
    { label: 'My trips', href: '/traveler/trips' },
    { label: 'Favorites', href: '/traveler/favorites' },
    { label: 'Messages', href: '/traveler/messages' },
    { label: 'Settings', href: '/traveler/settings' },
  ]

  return <div className="container mx-auto p-6">{children}</div>
}
