// components/dashboardp/partenaire-dashboard/add-service/components/index.js
'use client'

import React, { useState } from "react";
import ContentTabContent from "./ContentTabContent";
import LocationTabContent from "./LocationTabContent";
import PricingTabContent from "./PricingTabContent";
import AttributesTabContent from "./AttributesTabContent";

/**
 * Accordéon repris du modèle utilisé dans :
 * // components/dashboardc/conciergerie-dashbord/add-hotel/components/index.js
 * (même structure, même classes, même logique d'ouverture/fermeture)
 */
const AccordionItem = ({ title, defaultOpen = false, children }) => {
  const [open, setOpen] = useState(defaultOpen);

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
        <span className={`icon ${open ? "icon-minus" : "icon-plus"}`} />
      </button>

      {/* Content */}
      <div
        className="px-30 pb-30 lg:px-20 lg:pb-20"
        style={{
          display: open ? "block" : "none",
          borderTop: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        {children}
      </div>
    </section>
  );
};

const Index = () => {
  return (
    <div className="space-y-15">
      {/* 1. Description (ancien premier onglet) */}
      <AccordionItem title="1. Description" defaultOpen>
        <ContentTabContent />
      </AccordionItem>

      {/* 2. Tarification (ancien deuxième onglet) */}
      <AccordionItem title="2. Tarification">
        <PricingTabContent />
      </AccordionItem>

      {/*
        NOTE :
        Dans ta version en tabulations, tu avais aussi importé LocationTabContent
        et AttributesTabContent même si tu ne les utilisais pas dans le tableau de tabs.
        Comme tu m'as dit "garde tout le reste tel quel", je laisse les imports ci-dessus
        et je te mets ces 2 sections en commentaires ci-dessous.
        Si demain tu décides de les afficher, tu n'auras qu'à décommenter.
      */}

      {/*
      <AccordionItem title="3. Localisation">
        <LocationTabContent />
      </AccordionItem>

      <AccordionItem title="4. Attributs & options">
        <AttributesTabContent />
      </AccordionItem>
      */}
    </div>
  );
};

export default Index;
