// app/(dashboard)/partenaire-dashboard/add-service/page.jsx
import React from "react";
import { createServiceAction } from './actions'
import InPlaceSubmit from '@/components/common/InPlaceSubmit'
import AddServiceTabs from "../../../../components/dashboardp/partenaire-dashboard/add-hotel";

export default function AddServicePage() {
  return (
    <form action={createServiceAction}>
      <AddServiceTabs />
      <div className="mt-30 d-flex justify-end">
        <InPlaceSubmit label="Publier le service" />
      </div>
    </form>
  )
}
