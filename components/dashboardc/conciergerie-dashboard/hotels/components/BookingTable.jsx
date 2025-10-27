// components/dashbaordc/conciergerie-dashboard/hotels/components/BookingTable.jsx
'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import Pagination from '../../common/Pagination';
import ActionsButton from './ActionsButton';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const PAGE_SIZE = 10;

function cityFromLocation(location) {
  if (!location) return '-';
  const [city] = String(location).split(',').map((s) => s.trim());
  return city || '-';
}

export default function BookingTable() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]); // listings enrichis
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const [activeTab, setActiveTab] = useState(0);
  const tabItems = useMemo(() => [], []);

  useEffect(() => {
    const supabase = createClientComponentClient();

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        // utilisateur courant
        const { data: ures, error: uerr } = await supabase.auth.getUser();
        if (uerr) throw uerr;
        const user = ures?.user;
        if (!user) {
          setRows([]);
          setLoading(false);
          return;
        }

        // Récup des listings liés à l'utilisateur.
        // NOTE: si tu ajoutes un champ conciergerie_id côté DB, remplace .eq('host_id', user.id)
        // par .eq('conciergerie_id', user.id) ou un .or('host_id.eq.XXX,conciergerie_id.eq.XXX').
        const { data, error } = await supabase
          .from('listings')
          .select(`
            id, title, location, created_at, rating_avg, reviews_count, host_id, price_per_night,
            owner:host_id ( display_name )
          `) // alias "owner" sur la relation FK profiles(user_id)
          .eq('host_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setRows(data || []);
      } catch (e) {
        console.error('[conciergerie/hotels] fetch listings error:', e);
        setError(e?.message || 'Erreur inattendue');
        setRows([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const pageRows = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <div className="tabs -underline-2 js-tabs">
        <div className="tabs__controls row x-gap-40 y-gap-30 lg:x-gap-20 js-tabs-controls">
          {tabItems.map((item, index) => (
            <div className="col-auto" key={index}>
              <button
                className={`tabs__button text-18 lg:text-16 text-light-1 fw-500 pb-5 lg:pb-0 js-tabs-button ${
                  activeTab === index ? 'is-tab-el-active' : ''
                }`}
                onClick={() => setActiveTab(index)}
              >
                {item}
              </button>
            </div>
          ))}
        </div>

        <div className="tabs__content pt-30 js-tabs-content">
          <div className="tabs__pane -tab-item-1 is-tab-el-active">
            <div className="overflow-scroll scroll-bar-1">
              <table className="table-4 -border-bottom col-12">
                <thead className="bg-light-2">
                  <tr>
                    <th>
                      <div className="d-flex items-center">
                        <div className="form-checkbox">
                          <input type="checkbox" name="name" />
                          <div className="form-checkbox__mark">
                            <div className="form-checkbox__icon icon-check" />
                          </div>
                        </div>
                      </div>
                    </th>
                    <th>Nom</th>
                    <th>Ville</th>
                    <th>Propriétaire</th>
                    <th>Status</th>
                    <th>Note</th>
                    <th>Inscription</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {loading && (
                    <tr>
                      <td colSpan={8} className="py-30 text-center opacity-70">
                        Chargement…
                      </td>
                    </tr>
                  )}

                  {!loading && error && (
                    <tr>
                      <td colSpan={8} className="py-30 text-center text-red-500">
                        {error}
                      </td>
                    </tr>
                  )}

                  {!loading && !error && pageRows.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-30 text-center opacity-70">
                        Aucun logement.
                      </td>
                    </tr>
                  )}

                  {!loading &&
                    !error &&
                    pageRows.map((l) => {
                      const ownerName = l.owner?.display_name || '—';
                      const hotelHref = `/hotel-single-v2/${l.id}`;

                      return (
                        <tr key={l.id}>
                          <td>
                            <div className="d-flex items-center">
                              <div className="form-checkbox">
                                <input type="checkbox" name={`select-${l.id}`} />
                                <div className="form-checkbox__mark">
                                  <div className="form-checkbox__icon icon-check" />
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Nom → lien vers la page du logement */}
                          <td className="fw-500">
                            <Link href={hotelHref} className="text-blue-1">
                              {l.title || `#${l.id}`}
                            </Link>
                          </td>

                          <td>{cityFromLocation(l.location)}</td>

                          {/* Propriétaire → display_name depuis profiles */}
                          <td>
                            <span className="opacity-90">{ownerName}</span>
                          </td>

                          <td>
                            {/* listings n'a pas de champ status : badge statique */}
                            <span className="rounded-100 py-4 px-10 text-center text-14 fw-500 bg-blue-1-05 text-blue-1">
                              Actif
                            </span>
                          </td>

                          <td>
                            <div className="rounded-4 size-35 bg-blue-1 text-white flex-center text-12 fw-600">
                              {Number(l.rating_avg ?? 0).toFixed(1)}
                            </div>
                          </td>

                          <td>{l.created_at ? new Date(l.created_at).toLocaleDateString() : '-'}</td>

                          <td>
                            <div className="row x-gap-10 y-gap-10 items-center">
                              <div className="col-auto">
                                {/* Bouton Voir → même destination */}
                                <Link
                                  href={hotelHref}
                                  className="flex-center bg-light-2 rounded-4 size-35"
                                  title="Voir"
                                  aria-label="Voir"
                                >
                                  <i className="icon-eye text-16 text-light-1" />
                                </Link>
                              </div>
                              <div className="col-auto">
                                <button className="flex-center bg-light-2 rounded-4 size-35" title="Éditer">
                                  <i className="icon-edit text-16 text-light-1" />
                                </button>
                              </div>
                              <div className="col-auto">
                                <button className="flex-center bg-light-2 rounded-4 size-35" title="Supprimer">
                                  <i className="icon-trash-2 text-16 text-light-1" />
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} />
    </>
  );
}
