// app/(dashboard)/concierge/layout.tsx
import { supabaseServer } from '@/utils/supabase-server'
import { redirect } from 'next/navigation'
import type { ReactNode } from 'react'

// ⚠️ adapte ce chemin si besoin (où est ton fichier de types supabase ?)
import type { Database } from '@/types/supabase'

type ProfileRow = Database['public']['Tables']['profiles']['Row']

export default async function ConciergeLayout({ children }: { children: ReactNode }) {
  const supabase = supabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  // ✅ Requête tapée sur 'user_id' (la clé qui relie auth.user.id à profiles)
  const { data: prof } = await supabase
    .from('profiles')
    .select('role, display_name')
    .eq('user_id' as keyof ProfileRow, user.id as ProfileRow['user_id'])
    .single()

  if (prof?.role !== 'conciergerie') redirect('/')

  return <>{children}</>
}
