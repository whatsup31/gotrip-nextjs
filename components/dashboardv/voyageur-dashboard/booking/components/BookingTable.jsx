'use client'

import React, { useState } from 'react'

const BookingTable = () => {
  const tabItems = [
    'Toutes les réservations',
    'Terminée',
    'En cours',
    'Annulées',
    'Payées',
    'En cours de paiement',
  ]

  const [active, setActive] = useState(0)

  return (
    <>
      {/* Onglets simples */}
      <div className="row x-gap-20 y-gap-10 items-center pb-20">
        {tabItems.map((label, i) => (
          <div key={label} className="col-auto">
            <button
              type="button"
              onClick={() => setActive(i)}
              className={`tabs__button text-15 fw-500 pb-5 ${
                active === i ? 'text-dark-1 border-bottom' : 'text-light-1'
              }`}
              style={active === i ? { borderColor: 'currentColor', borderWidth: 2 } : {}}
            >
              {label}
            </button>
          </div>
        ))}
      </div>

      {/* Tableau */}
      <div className="overflow-auto">
        <table className="table-3 -border-bottom-none">
          <thead className="bg-light-2">
            <tr>
              <th>Type</th>
              <th>Titre</th>
              <th>Date de réservation</th>
              <th>Montant</th>
              <th>Statut</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {/* Exemple vide — remplace par tes données */}
            <tr>
              <td colSpan={6}>
                <div className="py-20 text-center text-15 text-light-1">
                  Aucune réservation à afficher pour “{tabItems[active]}”.
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}

export default BookingTable
