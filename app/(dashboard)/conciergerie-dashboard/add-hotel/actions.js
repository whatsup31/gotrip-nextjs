// app/(dashboard)/vendor-dashboard/add-hotel/actions.jsx
'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';

export async function createListingAction(_prevState, formData) {
  const title = String(formData.get('title') || '').trim();
  const description = String(formData.get('description') || '').trim();
  const locationRaw = String(formData.get('location') || '').trim();
  const city = String(formData.get('city') || '').trim();
  const country = String(formData.get('country') || '').trim();
  const price = Number(formData.get('price_per_night') || 0);

  const photosAuto = String(formData.get('photos') || '');
  const photosManual = String(formData.get('photos_manual') || '');
  const photos = [...photosAuto.split(','), ...photosManual.split(',')]
    .map((s) => s.trim())
    .filter(Boolean);

  const amenities = Array.from(formData.getAll('amenities')).map(String);

  if (!title) return { error: 'title_' };
  const location = locationRaw || [city, country].filter(Boolean).join(', ');

  // ---- Supabase via auth-helpers (Server Action) ----
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: () => cookieStore });

  const {
    data: { user },
    error: uerr,
  } = await supabase.auth.getUser();

  if (uerr || !user) return { error: 'unauthorized' };

  const payload = {
    host_id: user.id,
    title,
    description,
    location,
    price_per_night: price,
    photos,
    amenities,
  };

  const { error } = await supabase
    .from('listings')
    .insert(payload)
    .select('id')
    .single();

  if (error) return { error: error.message };

  redirect('/hotel-list-v3');
}
