// app/(dashboard)/concierge/layout.tsx
import { supabaseServer } from '@/utils/supabase-server'
import { redirect } from 'next/navigation'
import type { ReactNode } from 'react'

// On définit un type minimal local aligné avec ta table `profiles`
type ProfileRow = {
  user_id: string
  role: string | null
  display_name: string | null
}

export default async function ConciergeLayout({ children }: { children: ReactNode }) {
  const supabase = supabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  // ✅ utilise bien la colonne `user_id` + typage explicite pour TS
  const { data: prof } = await supabase
    .from('profiles')
    .select('role, display_name')
    .eq('user_id' as keyof ProfileRow, user.id as ProfileRow['user_id'])
    .single()

  if (prof?.role !== 'conciergerie') redirect('/')

  return <>{children}</>
}
