import { supabaseServer } from '@/utils/supabase-server';

export async function insertListing(row: {
  host_id: string;
  title: string;
  location: string;
  description?: string;
  price_per_night: number;
  photos?: string[];
  amenities?: string[];
}) {
  const supabase = supabaseServer();
  return await supabase.from('listings').insert(row).select('id').single();
}

export async function listHostListings(hostId: string) {
  const supabase = supabaseServer();
  return await supabase.from('listings').select('*').eq('host_id', hostId).order('id', { ascending: false });
}
