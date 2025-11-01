// app/(dashboard)/partenaire-dashboard/add-service/page.jsx
import React from "react";
import { createServiceAction } from './actions'
import InPlaceSubmit from '@/components/common/InPlaceSubmit'
import AddServiceTabs from "../../../../components/dashboardp/partenaire-dashboard/add-service";

export const metadata = {
  title: "Vendor Add Hotel | ômi",
  description: "ômi - votre voyage commence ici",
};

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
