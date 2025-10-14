// app/(dashboard)/vendor-dashboard/add-hotel/actions.jsx
'use server';

import { createServerClient } from '@supabase/ssr';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export async function createListingAction(prevState, formData) {
  const title = String(formData.get('title') || '').trim();
  const description = String(formData.get('description') || '').trim();
  const locationRaw = String(formData.get('location') || '').trim();
  const city = String(formData.get('city') || '').trim();
  const country = String(formData.get('country') || '').trim();
  const price = Number(formData.get('price_per_night') || 0);

  const photosAuto = String(formData.get('photos') || '');
  const photosManual = String(formData.get('photos_manual') || '');
  const photos = [...photosAuto.split(','), ...photosManual.split(',')].map(s=>s.trim()).filter(Boolean);
  const amenities = Array.from(formData.getAll('amenities')).map(String);

  if (!title) return { error: 'title_required' };
  //if (!description) return { error: 'description_required' };
  //if (!(price >= 0)) return { error: 'invalid_price' };

  const location = locationRaw || [city, country].filter(Boolean).join(', ');

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    cookies: {
      get(name) {
        return cookies().get(name)?.value;
      },
      set(name, value, options) {
        try {
          cookies().set({ name, value, ...options });
        } catch (error) {
          // "set" est appelé côté serveur pendant SSR, on peut ignorer
        }
      },
      remove(name, options) {
        try {
          cookies().set({ name, value: '', ...options });
        } catch (error) {
          // pareil, on ignore pendant SSR
        }
      },
    },
  }
  );

  const { data: { user }, error: uerr } = await supabase.auth.getUser();
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

  const { error } = await supabase.from('listings').insert(payload).select('id').single();
  if (error) return { error: error.message };

  redirect('/hotel-list-v3');
}
