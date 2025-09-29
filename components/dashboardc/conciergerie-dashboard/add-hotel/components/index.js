'use client'

import React, { useState } from 'react'
import ContentTabContent from './ContentTabContent'
import LocationTabContent from './LocationTabContent'
import PricingTabContent from './PricingTabContent'
import AttributesTabContent from './AttributesTabContent'

const AccordionItem = ({ title, defaultOpen = false, children }) => {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <section className="bg-white rounded-4 shadow-3">
      {/* Header */}
      <button
        type="button"
        className="w-100 px-30 py-20 lg:px-20 lg:py-16 d-flex items-center justify-between text-left"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="text-18 lg:text-16 fw-600">{title}</span>
        <span className={`icon ${open ? 'icon-minus' : 'icon-plus'}`} />
      </button>

      {/* Content */}
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
<<<<<<< Updated upstream
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
=======
    <div className="space-y-15">
      <AccordionItem title="1. Informations" defaultOpen>
        <ContentTabContent />
      </AccordionItem>

      <AccordionItem title="2. Localisation">
>>>>>>> Stashed changes
        <LocationTabContent />
      </AccordionItem>

<<<<<<< Updated upstream
      {/* 3. Tarif par nuit */}
      <section className="bg-white rounded-4 shadow-3 px-30 py-30 lg:px-20 lg:py-20">
        <h2 className="text-20 fw-600 mb-20">3. Tarif par nuit</h2>
=======
      <AccordionItem title="3. Tarif par nuit">
>>>>>>> Stashed changes
        <PricingTabContent />
      </AccordionItem>

<<<<<<< Updated upstream
      {/* 4. Type de logement */}
      <section className="bg-white rounded-4 shadow-3 px-30 py-30 lg:px-20 lg:py-20">
        <h2 className="text-20 fw-600 mb-20">4. Type de logement</h2>
=======
      <AccordionItem title="4. Caractéristiques">
>>>>>>> Stashed changes
        <AttributesTabContent />
      </AccordionItem>

      {/* Bouton unique en bas */}
<<<<<<< Updated upstream
      <div className="pt-10">
        <button className="button h-50 px-24 -dark-1 text-white" style={{ backgroundColor: '#0d6efd' }}>
=======
      <div className="pt-10 text-center">
        <button
          className="button h-50 px-24 -dark-1 text-white"
          style={{ backgroundColor: '#0d6efd' }}
        >
>>>>>>> Stashed changes
          Publier le logement
          <div className="icon-arrow-top-right ml-15" />
        </button>
      </div>
    </div>
  )
}

export default Index
