// app/(dashboard)/concierge/layout.tsx
import { supabaseServer } from '@/utils/supabase-server'
import { redirect } from 'next/navigation'
import type { ReactNode } from 'react'

// ⚠️ adapte ce chemin si ton fichier de types n'est pas à cet endroit :
import type { Database } from '@/types/supabase'

type ProfileRow = Database['public']['Tables']['profiles']['Row']

export default async function ConciergeLayout({ children }: { children: ReactNode }) {
  const supabase = supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // ✅ clé primaire "id" avec types explicites sur .eq
  const { data: prof } = await supabase
    .from('profiles')
    .select('role, display_name')
    .eq('id' as keyof ProfileRow, user.id as ProfileRow['id'])
    .single()

  if (prof?.role !== 'conciergerie') redirect('/')

  return <>{children}</>
}
