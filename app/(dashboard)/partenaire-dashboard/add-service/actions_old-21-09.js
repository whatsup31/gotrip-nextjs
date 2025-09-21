// app/(dashboard)/partenaire-dashboard/add-service/actions.js
'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import { supabaseServer } from '@/utils/supabase-server'

const schema = z.object({
  title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères.'),
  category: z.string().min(1, 'La catégorie est requise.'),
  description: z.string().optional().default(''),
  price: z.coerce.number().nonnegative('Le prix doit être un nombre >= 0.'),
  duration_min: z.coerce.number().optional(),
  area: z.string().optional().default(''),
})

async function createServiceCore(payload, userId) {
  const supabase = supabaseServer()
  const { error } = await supabase.from('services').insert([{
    user_id: userId,
    title: payload.title,
    category: payload.category,
    description: payload.description,
    price: payload.price,
    duration_min: payload.duration_min,
    area: payload.area,
    status: 'draft',
  }])
  if (error) throw new Error(error.message)
}

function readPayload(formData) {
  return {
    title: formData.get('title'),
    category: formData.get('category'),
    description: formData.get('description'),
    price: formData.get('price'),
    duration_min: formData.get('duration_min'),
    area: formData.get('area'),
  }
}

// ⚙️ Action actuelle (submit classique via <form>, redirige en cas de succès)
export async function createServiceAction(formData) {
  const supabase = supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const parsed = schema.safeParse(readPayload(formData))
  if (!parsed.success) {
    // Laisser remonter une erreur claire (sera attrapée par notre bouton côté client)
    const msg = parsed.error.issues?.[0]?.message || 'Données invalides.'
    throw new Error(msg)
  }

  await createServiceCore(parsed.data, user.id)
  redirect('/partner/services')
}

// useActionState : retourne un state au lieu de rediriger
export async function createServiceFormAction(prevState, formData) {
  const supabase = supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Non authentifié', fieldErrors: null }

  const parsed = schema.safeParse(readPayload(formData))
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors
    const message = parsed.error.issues?.[0]?.message || 'Données invalides.'
    return { ok: false, error: message, fieldErrors }
  }

  try {
    await createServiceCore(parsed.data, user.id)
    // on laisse la page gérer la navigation (router.push)
    return { ok: true, redirectTo: '/partner/services' }
  } catch (e) {
    return { ok: false, error: e?.message || 'Erreur inconnue', fieldErrors: null }
  }
}
