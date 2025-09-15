'use client';

import { useState } from 'react';
import { uploadListingImage } from '@/utils/upload-listing-image';
import { supabaseBrowser } from '@/utils/supabase-browser';

export default function SimplePhotoUploader() {
  const [busy, setBusy] = useState(false);
  const [urls, setUrls] = useState([]);

  async function onFiles(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setBusy(true);
    try {
      const supabase = supabaseBrowser();
      const { data: ures } = await supabase.auth.getUser();
      if (!ures || !ures.user) throw new Error('Not authenticated');

      const uploaded = [];
      for (const f of files) {
        const url = await uploadListingImage(f, ures.user.id);
        uploaded.push(url);
      }
      const next = [...urls, ...uploaded];
      setUrls(next);

      // met à jour le champ caché du formulaire parent
      const hidden = document.querySelector('input[name="photos"]');
      if (hidden) hidden.value = next.join(', ');
    } finally {
      setBusy(false);
      e.target.value = ''; // reset input
    }
  }

  return (
    <div className="mt-20">
      <div className="form-input">
        <input type="file" accept="image/*" multiple onChange={onFiles} />
        <label className="lh-1 text-16 text-light-1">
          Importer des images (elles seront stockées et reliées à l’annonce)
        </label>
      </div>

      {!!urls.length && (
        <div className="row x-gap-10 y-gap-10 mt-10">
          {urls.map((u, i) => (
            <div key={i} className="col-auto">
              <img
                src={u}
                alt=""
                style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }}
              />
            </div>
          ))}
        </div>
      )}

      {/* champ caché consommé par AddPropertyForm */}
      <input type="hidden" name="photos" value={urls.join(', ')} />
      {busy && <div className="text-13 text-light-1 mt-5">Upload…</div>}
    </div>
  );
}
