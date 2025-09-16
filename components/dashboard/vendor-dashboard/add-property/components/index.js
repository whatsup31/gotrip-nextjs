'use client';

import React, { useState } from 'react';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import ContentTabContent from './ContentTabContent';
import LocationTabContent from './LocationTabContent';
import PricingTabContent from './PricingTabContent';
import AttributesTabContent from './AttributesTabContent';

export default function SettingsTabs() {
  const tabs = [
    { no: 1, label: 'Description',  content: <ContentTabContent /> },
    { no: 2, label: 'Localisation', content: <LocationTabContent /> },
    { no: 3, label: 'Tarification', content: <PricingTabContent /> },
    { no: 4, label: 'Équipements', content: <AttributesTabContent /> },
  ];

  const [selected, setSelected] = useState(0);

  return (
    <Tabs
      className="tabs -underline-2 js-tabs"
      selectedIndex={selected}
      onSelect={setSelected}
      selectedTabClassName="is-tab-active"           // toujours une string
      selectedTabPanelClassName="is-tab-el-active"   // toujours une string
      focusTabOnClick={false}
    >
      <TabList className="tabs__controls row x-gap-40 y-gap-10 lg:x-gap-20">
        {tabs.map((t, i) => (
          <Tab key={t.no} className="col-auto">
            <button
              type="button"
              className={`tabs__button text-18 lg:text-16 text-light-1 fw-500 pb-5 lg:pb-0 js-tabs-button ${i === selected ? 'is-tab-active' : ''}`}
            >
              {t.no}. {t.label}
            </button>
          </Tab>
        ))}
      </TabList>

      <div className="tabs__content pt-30 js-tabs-content">
        {tabs.map((t, i) => (
          <TabPanel key={t.no} className={`-tab-item-${i + 1}`}>
            {t.content}
          </TabPanel>
        ))}
      </div>
    </Tabs>
  );
}
