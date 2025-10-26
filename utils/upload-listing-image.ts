// utils/upload-listing-image.ts
'use server';

import { cookies } from 'next/headers';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';

export async function uploadListingImage(file: File, folder = 'listings') {
  const supabase = createServerActionClient({ cookies });

  if (!file) throw new Error('No file provided');

  const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
  const { data, error } = await supabase.storage
    .from('images')
    .upload(`${folder}/${fileName}`, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw error;

  const { data: publicUrl } = supabase.storage
    .from('images')
    .getPublicUrl(`${folder}/${fileName}`);

  return publicUrl.publicUrl;
}
