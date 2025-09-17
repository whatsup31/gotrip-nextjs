'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/utils/supabase-browser';

import Sidebar from '@/components/dashboard/vendor-dashboard/common/Sidebar';
import Header from '@/components/header/dashboard-header';
import SettingsTabs from '@/components/dashboard/vendor-dashboard/add-property/components';
import Footer from '@/components/dashboard/vendor-dashboard/common/Footer';

export default function Page() {
  const router = useRouter();
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const fd = new FormData(e.currentTarget);
      const supabase = supabaseBrowser();

      const { data: ures, error: uerr } = await supabase.auth.getUser();
      if (uerr || !ures?.user) throw uerr || new Error('Not authenticated');

      const title = String(fd.get('title') || '').trim();
      const description = String(fd.get('description') || '').trim();
      const city = String(fd.get('city') || '').trim();
      const country = String(fd.get('country') || '').trim();
      const location = String(fd.get('location') || `${city}${city && country ? ', ' : ''}${country}`).trim();
      const price = Number(fd.get('price_per_night') || 0);

      const photosAuto = String(fd.get('photos') || '');
      const photosManual = String(fd.get('photos_manual') || '');
      const photos = [...photosAuto.split(','), ...photosManual.split(',')]
        .map(s => s.trim())
        .filter(Boolean);

      const amenities = Array.from(fd.getAll('amenities')).map(String);

      const payload = {
        host_id: ures.user.id,
        title,
        description,
        location,
        price_per_night: price,
        photos,
        amenities,
      };

      const { data, error } = await supabase.from('listings').insert(payload).select('id').single();
      if (error) throw error;

      router.replace(`/host/listings`);
    } catch (e) {
      console.error(e);
      setErr(e?.message || 'Erreur inattendue');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="header-margin" />
      <Header />

      <div className="dashboard">
        <div className="dashboard__sidebar bg-white scroll-bar-1">
          <Sidebar />
        </div>

        <div className="dashboard__main">
          <div className="dashboard__content bg-light-2">
            <div className="row y-gap-20 justify-between items-end pb-60 lg:pb-40 md:pb-32">
              <div className="col-12">
                <h1 className="text-30 lh-14 fw-600">Proposer un logement</h1>
                <div className="text-15 text-light-1">Ajoutez un nouveau logement en quelques clics</div>
              </div>
            </div>

            <div className="py-30 px-30 rounded-4 bg-white shadow-3">
              {/* form englobe les onglets pour conserver le design */}
              <form onSubmit={handleSubmit}>
                <SettingsTabs />
                {err && <div className="text-red-500 text-sm mt-15">{String(err)}</div>}
                <div className="d-inline-block pt-30">
                  <button className="button h-50 px-24 -dark-1 bg-blue-1 text-white" disabled={loading}>
                    {loading ? 'Création…' : 'Créer le logement'}
                    <div className="icon-arrow-top-right ml-15" />
                  </button>
                </div>
              </form>
            </div>

            <Footer />
          </div>
        </div>
      </div>
    </>
  );
}
