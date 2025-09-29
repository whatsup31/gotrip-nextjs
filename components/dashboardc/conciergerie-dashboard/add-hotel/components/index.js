'use client'

import React from 'react'
import ContentTabContent from './ContentTabContent'
import LocationTabContent from './LocationTabContent'
import PricingTabContent from './PricingTabContent'
import AttributesTabContent from './AttributesTabContent'

const Index = () => {
<<<<<<< Updated upstream
  const tabs = [
    {
      label: "Description",
      labelNo: 1,
      content: <ContentTabContent />,
    },
    {
      label: "Localisation",
      labelNo: 2,
      content: <LocationTabContent />,
    },
    {
      label: "Tarification",
      labelNo: 3,
      content: <PricingTabContent />,
    },
    {
      label: "Équipements",
      labelNo: 4,
      content: <AttributesTabContent />,
    },
  ];

  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Tabs
      className="tabs -underline-2 js-tabs"
      selectedIndex={tabIndex}
      onSelect={(index) => setTabIndex(index)}
    >
      <TabList className="tabs__controls row x-gap-40 y-gap-10 lg:x-gap-20">
        {tabs.map((tab, index) => (
          <Tab key={index} className="col-auto">
            <button className="tabs__button text-18 lg:text-16 text-light-1 fw-500 pb-5 lg:pb-0 js-tabs-button">
              {tab.labelNo}. {tab.label}
            </button>
          </Tab>
        ))}
      </TabList>
=======
  return (
    <div className="space-y-30">
      {/* 1. Informations */}
      <section className="bg-white rounded-4 shadow-3 px-30 py-30 lg:px-20 lg:py-20">
        <ContentTabContent />
      </section>
>>>>>>> Stashed changes

      {/* 2. Localisation */}
      <section className="bg-white rounded-4 shadow-3 px-30 py-30 lg:px-20 lg:py-20">
        <h2 className="text-20 fw-600 mb-20">2. Localisation</h2>
        <LocationTabContent />
      </section>

      {/* 3. Tarif par nuit */}
      <section className="bg-white rounded-4 shadow-3 px-30 py-30 lg:px-20 lg:py-20">
        <h2 className="text-20 fw-600 mb-20">3. Tarif par nuit</h2>
        <PricingTabContent />
      </section>

      {/* 4. Type de logement */}
      <section className="bg-white rounded-4 shadow-3 px-30 py-30 lg:px-20 lg:py-20">
        <h2 className="text-20 fw-600 mb-20">4. Type de logement</h2>
        <AttributesTabContent />
      </section>

      {/* Bouton unique en bas */}
      <div className="pt-10">
        <button className="button h-50 px-24 -dark-1 text-white" style={{ backgroundColor: '#0d6efd' }}>
          Publier le logement
          <div className="icon-arrow-top-right ml-15" />
        </button>
      </div>
    </div>
  )
}

export default Index
