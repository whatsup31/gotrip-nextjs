// app/(dashboard)/conciergerie-dashboard/booking/page.jsx
import React from "react";
import DashboardPage from "../../../../components/dashboardc/conciergerie-dashboard/booking";

export const metadata = {
  title: "Vendor History | ômi",
  description: "ômi - votre voyage commence ici",
};

export default function page() {
  return (
    <>
      <DashboardPage />
    </>
  );
}
