import React from "react";
import DashboardPage from "../../../../components/dashboardv/voyageur-dashboard/booking";

export const metadata = {
  title: "Réservations | ômi",
  description: "ômi - votre voyage commence ici",
};

export default function page() {
  return (
    <>
      <DashboardPage />
    </>
  );
}
