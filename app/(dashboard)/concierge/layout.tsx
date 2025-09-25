// app/(dashboard)/concierge/layout.tsx
import { supabaseServer } from '@/utils/supabase-server'
import { redirect } from 'next/navigation'
import type { ReactNode } from 'react'

export default async function ConciergeLayout({ children }: { children: ReactNode }) {
  const supabase = supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // --- Choisis UNE des deux variantes ci-dessous ---

  // Variante A (recommandée, schéma classique Supabase)
  const { data: prof } = await supabase
    .from('profiles')
    .select('role, display_name')
    .eq('id', user.id) // <-- clé primaire 'id'
    .single()

  // // Variante B (si ta table a vraiment 'user_id')
  // const { data: prof } = await supabase
  //   .from('profiles')
  //   .select('role, display_name')
  //   .eq('user_id' as 'user_id', user.id as string)
  //   .single()

  if (prof?.role !== 'conciergerie') redirect('/')

  return <>{children}</>
}
