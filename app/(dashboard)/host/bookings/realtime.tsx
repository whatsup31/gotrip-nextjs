'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/utils/supabase-browser'

export default function BookingsRealtime() {
  const [notice, setNotice] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const supabase = supabaseBrowser()

    // Abonnement aux insertions sur "bookings"
    // Supabase Realtime respecte la RLS : le host ne recevra que ce qu'il a le droit de lire.
    const channel = supabase
      .channel('bookings-inserts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bookings' }, payload => {
        setNotice(`New booking #${payload.new.id} created`)
        // petit refresh des données serveur
        router.refresh()
        // auto-hide
        setTimeout(() => setNotice(null), 4000)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [router])

  if (!notice) return null
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        background: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        padding: '10px 14px',
        boxShadow: '0 10px 15px rgba(0,0,0,.08)',
      }}
    >
      {notice}
    </div>
  )
}
