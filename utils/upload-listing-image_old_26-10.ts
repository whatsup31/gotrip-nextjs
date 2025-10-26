// utils/upload-listing-image.ts
import { supabaseBrowser } from '@/utils/supabase-browser';

export async function uploadListingImage(file: File, userId: string) {
  const supabase = supabaseBrowser();
  const ext = file.name.split('.').pop() || 'jpg';
  const path = `listings/${userId}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage.from('listings').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw error;

  const { data } = supabase.storage.from('listings').getPublicUrl(path);
  return data.publicUrl; // URL publique à stocker dans photos[]
}
