'use client'

import React, { useState } from 'react'
import ContentTabContent from './ContentTabContent'
import LocationTabContent from './LocationTabContent'
import PricingTabContent from './PricingTabContent'
import AttributesTabContent from './AttributesTabContent'

// Un item d'accordéon simple (JS pur, pas de TypeScript)
const AccordionItem = ({ title, defaultOpen = false, children }) => {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <section className="bg-white rounded-4 shadow-3">
      {/* En-tête */}
      <button
        type="button"
        className="w-100 px-30 py-20 lg:px-20 lg:py-16 d-flex items-center justify-between text-left"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
      >
        <span className="text-18 lg:text-16 fw-600">{title}</span>
        <span className={`icon ${open ? 'icon-minus' : 'icon-plus'}`} />
      </button>

      {/* Contenu */}
      <div
        className="px-30 pb-30 lg:px-20 lg:pb-20"
        style={{
          display: open ? 'block' : 'none',
          borderTop: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        {children}
      </div>
    </section>
  )
}

const Index = () => {
  return (
    <div className="space-y-15">
      <AccordionItem title="1. Informations" defaultOpen>
        <ContentTabContent />
      </AccordionItem>

      <AccordionItem title="2. Localisation">
        <LocationTabContent />
      </AccordionItem>

      <AccordionItem title="3. Tarif par nuit">
        <PricingTabContent />
      </AccordionItem>

      <AccordionItem title="4. Type de logement">
        <AttributesTabContent />
      </AccordionItem>

      {/* Bouton unique en bas */}
      <div className="pt-10 text-center">
        <button
          className="button h-50 px-24 -dark-1 text-white"
          style={{ backgroundColor: '#0d6efd' }}
        >
          Publier le logement
          <div className="icon-arrow-top-right ml-15" />
        </button>
      </div>
    </div>
  )
}

export default Index
