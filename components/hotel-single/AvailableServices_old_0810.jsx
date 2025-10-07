// components/hotel-single/AvailableServices.jsx
'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

function formatPrice(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return 'Prix sur demande';
  return `€${n.toLocaleString('fr-FR')}`;
}

// Ajouter .jpg si le dernier segment n'a pas d'extension
function ensureJpg(src = '') {
  try {
    const url = String(src);
    const last = url.split('/').pop() || '';
    if (!last.includes('.')) return `${url}.jpg`;
    return url;
  } catch {
    return src;
  }
}

// Extrait une image de couverture depuis s.images (JSONB) ou s.cover_url
function coverFrom(service) {
  if (Array.isArray(service?.images) && service.images.length) {
    return ensureJpg(service.images[0]);
  }
  if (service?.cover_url) return ensureJpg(service.cover_url);
  return null;
}

/**
 * AvailableServices
 * - Affiche une grille de services avec recherche, tri et "Voir plus"
 *
 * Props:
 *  - services: Array<{
 *      id: string|number,
 *      title: string,
 *      description?: string,
 *      price?: number,
 *      duration?: string,      // ex: "2h"
 *      category?: string,      // ex: "Ménage"
 *      images?: string[],      // ex: ["/img/services/6.1", ...] (extension auto .jpg)
 *      cover_url?: string,
 *      avg_rating?: number,
 *      reviews_count?: number
 *    }>
 *  - initialPageSize?: number  // défaut 6
 *  - onSelect?: (service) => void // si fourni, le CTA appelle onSelect au lieu de rediriger
 */
export default function AvailableServices({
  services = [],
  initialPageSize = 6,
  onSelect,
}) {
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('recommended'); // 'recommended' | 'price_asc' | 'price_desc'
  const [visible, setVisible] = useState(initialPageSize);

  const filtered = useMemo(() => {
    let arr = Array.isArray(services) ? [...services] : [];

    // filtre texte
    const needle = q.trim().toLowerCase();
    if (needle) {
      arr = arr.filter((s) => {
        const hay = `${s.title ?? ''} ${s.description ?? ''} ${s.category ?? ''}`.toLowerCase();
        return hay.includes(needle);
      });
    }

    // tri
    if (sort === 'price_asc') {
      arr.sort((a, b) => (Number(a.price) || 9e9) - (Number(b.price) || 9e9));
    } else if (sort === 'price_desc') {
      arr.sort((a, b) => (Number(b.price) || -1) - (Number(a.price) || -1));
    } else {
      // Pertinence POC: note desc, puis prix asc, puis titre
      arr.sort((a, b) => {
        const ra = Number(a.avg_rating) || 0;
        const rb = Number(b.avg_rating) || 0;
        if (rb !== ra) return rb - ra;

        const pa = Number(a.price);
        const pb = Number(b.price);
        const aa = Number.isFinite(pa) ? pa : 9e9;
        const bb = Number.isFinite(pb) ? pb : 9e9;
        if (aa !== bb) return aa - bb;

        return String(a.title || '').localeCompare(String(b.title || ''));
      });
    }

    return arr;
  }, [services, q, sort]);

  const toShow = filtered.slice(0, visible);
  const canShowMore = visible < filtered.length;

  return (
    <div className="mt-10">
      {/* Header + contrôles */}
      <div className="row y-gap-10 justify-between items-end">
        <div className="col-auto">
          <div className="sectionTitle -md">
            <h3 className="sectionTitle__title">Services proposés</h3>
            <p className="sectionTitle__text">
              {filtered.length} service{filtered.length > 1 ? 's' : ''} trouvés
            </p>
          </div>
        </div>
        <div className="col-auto">
          <div className="row x-gap-10">
            <div className="col-auto">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Rechercher un service…"
                className="form-control h-50 rounded-200 px-20"
                style={{ minWidth: 240 }}
                aria-label="Rechercher un service"
              />
            </div>

            <div className="col-auto">
              <div className="dropdown js-dropdown js-category-active">
                <div
                  className="dropdown__button d-flex items-center rounded-200 border-light px-20 h-50"
                  data-bs-toggle="dropdown"
                  data-bs-auto-close="true"
                  aria-expanded="false"
                  role="button"
                >
                  <span className="js-dropdown-title">
                    {sort === 'recommended'
                      ? 'Pertinence'
                      : sort === 'price_asc'
                      ? 'Prix ↑'
                      : 'Prix ↓'}
                  </span>
                  <i className="icon-chevron-down ml-10 text-10" />
                </div>

                <div className="dropdown-menu">
                  <div className="px-20 py-10">
                    <button
                      className={`dropdown-item ${sort === 'recommended' ? 'active' : ''}`}
                      onClick={() => setSort('recommended')}
                    >
                      Pertinence
                    </button>
                    <button
                      className={`dropdown-item ${sort === 'price_asc' ? 'active' : ''}`}
                      onClick={() => setSort('price_asc')}
                    >
                      Prix (croissant)
                    </button>
                    <button
                      className={`dropdown-item ${sort === 'price_desc' ? 'active' : ''}`}
                      onClick={() => setSort('price_desc')}
                    >
                      Prix (décroissant)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>  

      {/* Grid */}
      <div className="row y-gap-30 pt-30">
        {toShow.length === 0 && (
          <div className="col-12">
            <div className="px-24 py-20 rounded-4 bg-light-2">
              Aucun service ne correspond à votre recherche.
            </div>
          </div>
        )}

        {toShow.map((s) => {
          const href = `/services/${s.id}`;
          const price = formatPrice(s.price);
          const cover = coverFrom(s);

          return (
            <div key={s.id} className="col-xl-4 col-md-6">
              <div className="border-light rounded-4 h-100 d-flex flex-column">
                {/* Image / cover */}
                <div className="ratio ratio-16x9 rounded-top-4 overflow-hidden bg-light-2">
                  {cover ? (
                    /* next/image pour meilleures perfs */
                    <Image
                      src={cover}
                      alt={s.title || 'Service'}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                      priority={false}
                    />
                  ) : (
                    <div className="w-100 h-100 d-flex align-items-center justify-content-center text-light-1">
                      <i className="icon-image text-24" />
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="p-20 d-flex flex-column gap-10 flex-grow-1">
                  <div className="d-flex justify-between items-start">
                    <h4 className="text-18 fw-500 pr-10">{s.title}</h4>

                    {/* Rating (optionnel) */}
                    {typeof s.avg_rating !== 'undefined' && (
                      <div className="d-flex items-center">
                        <div className="size-30 bg-blue-1 rounded-4 text-center text-white lh-30 text-13 fw-600">
                          {Number(s.avg_rating).toFixed(1)}
                        </div>
                        {typeof s.reviews_count !== 'undefined' && (
                          <div className="text-13 text-light-1 ml-8">
                            ({s.reviews_count})
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {s.category && (
                    <div className="text-13 text-blue-1 fw-500">{s.category}</div>
                  )}

                  <p className="text-14 text-light-1 line-clamp-3">
                    {s.description || 'Service sans description.'}
                  </p>

                  <div className="d-flex justify-between items-center mt-auto pt-5">
                    <div className="text-16 fw-600">{price}</div>
                    <div className="text-13 text-light-1">
                      {s.duration ? `~ ${s.duration}` : '\u00A0'}
                    </div>
                  </div>

                  {/* CTA */}
                  {typeof onSelect === 'function' ? (
                    <button
                      className="button -dark-1 bg-blue-1 text-white w-100 mt-10"
                      onClick={() => onSelect(s)}
                    >
                      Commander <i className="icon-arrow-top-right ml-10" />
                    </button>
                  ) : (
                    <Link href={href} className="button -dark-1 bg-blue-1 text-white w-100 mt-10">
                      Voir le service <i className="icon-arrow-top-right ml-10" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Voir plus */}
      {canShowMore && (
        <div className="d-flex justify-center mt-30">
          <button
            className="button -outline-blue-1 text-blue-1"
            onClick={() => setVisible((v) => v + initialPageSize)}
          >
            Voir plus
          </button>
        </div>
      )}
    </div>
  );
}
