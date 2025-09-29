'use client'

import React from 'react'
import ContentTabContent from './ContentTabContent'
import LocationTabContent from './LocationTabContent'
import PricingTabContent from './PricingTabContent'
import AttributesTabContent from './AttributesTabContent'

const Index = () => {
  return (
    <div className="space-y-15">
      <section className="bg-white rounded-4 shadow-3 px-30 py-30">
        <ContentTabContent />
      </section>

      <section className="bg-white rounded-4 shadow-3 px-30 py-30">
        <h2 className="text-20 fw-600 mb-20">2. Localisation</h2>
        <LocationTabContent />
      </section>

      <section className="bg-white rounded-4 shadow-3 px-30 py-30">
        <h2 className="text-20 fw-600 mb-20">3. Tarif par nuit</h2>
        <PricingTabContent />
      </section>

      <section className="bg-white rounded-4 shadow-3 px-30 py-30">
        <h2 className="text-20 fw-600 mb-20">4. Type de logement</h2>
        <AttributesTabContent />
      </section>

      <div className="pt-20 text-center">
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
