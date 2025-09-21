// app/(dashboard)/partenaire-dashboard/add-service/actions.js
'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import { supabaseServer } from '@/utils/supabase-server'

// Helpers Zod ultra-tolérants pour FormData.get(...) qui peut renvoyer null,
// et pour les inputs vides '' (on convertit tout ça en null)
const toNullableString = z
  .union([z.string(), z.null(), z.undefined()])
  .transform(v => (v == null || v === '' ? null : v))

const toNullableInt = z
  .union([z.coerce.number().int(), z.null(), z.undefined(), z.literal('')])
  .transform(v => (v === '' || v == null ? null : v))

const toNullableNumber = z
  .union([z.coerce.number(), z.null(), z.undefined(), z.literal('')])
  .transform(v => (v === '' || v == null ? null : v))

// Seul "title" est requis (et on tolère null/undefined/'')
const schema = z.object({
  title: z
    .union([z.string(), z.null(), z.undefined()])
    .transform(v => (v == null ? '' : String(v)))
    .pipe(z.string().min(1, 'Le titre est requis.')),

  category: toNullableString,     // -> null si vide
  description: toNullableString,  // -> null si vide
  price: toNullableNumber,        // -> null si vide
  duration_min: toNullableInt,    // -> null si vide
  area: toNullableString,         // -> null si vide
})

function readPayload(formData) {
  // NE PAS trafiquer ici : on laisse Zod gérer null/''/undefined
  return {
    title: formData.get('title'),
    category: formData.get('category'),
    description: formData.get('description'),
    price: formData.get('price'),
    duration_min: formData.get('duration_min'),
    area: formData.get('area'),
  }
}

export async function createServiceAction(formData) {
  const supabase = supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // (Option) Restreindre aux providers si vous gérez un rôle
  const { data: prof } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .single()
  if (prof?.role && prof.role !== 'provider') {
    throw new Error('Seuls les prestataires peuvent créer un service.')
  }

  const parsed = schema.safeParse(readPayload(formData))
  if (!parsed.success) {
    const issue = parsed.error.issues?.[0]
    const path = issue?.path?.join('.') || ''
    const message = issue?.message || 'Données invalides.'
    // Message plus parlant (champ + message)
    throw new Error(path ? `${path}: ${message}` : message)
  }
  const d = parsed.data

  const { error } = await supabase.from('services').insert([{
    provider_id: user.id,      // FK propriétaire
    title: d.title,
    category: d.category,      // null OK
    description: d.description,// null OK
    price: d.price,            // null OK si colonne nullable
    duration_min: d.duration_min,
    area: d.area,
  }])

  if (error) throw new Error(error.message)
  redirect('/partner/services')
}
