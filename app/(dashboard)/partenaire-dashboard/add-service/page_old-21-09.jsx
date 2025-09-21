// app/(dashboard)/partenaire-dashboard/add-service/page.jsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useActionState } from 'react'

import { createServiceFormAction } from './actions'
import InPlaceSubmit from '@/components/common/InPlaceSubmit'
import AddServiceTabs from '@/components/dashboardp/partenaire-dashboard/add-service'

const initialState = { ok: false, error: null, fieldErrors: null, redirectTo: null }

export default function AddServicePage() {
  const router = useRouter()
  const [state, formAction] = useActionState(createServiceFormAction, initialState)

  useEffect(() => {
    if (state?.ok && state?.redirectTo) {
      router.push(state.redirectTo)
    }
  }, [state, router])

  return (
    <form action={formAction}>
      <AddServiceTabs />
      <div className="mt-30 d-flex justify-end">
        <InPlaceSubmit label="Ajouter le service" error={state?.error || null} />
      </div>
    </form>
  )
}
