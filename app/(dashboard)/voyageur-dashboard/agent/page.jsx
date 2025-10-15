import React from "react";
import DashboardPage from "../../../../components/dashboardv/voyageur-dashboard/agent";

export const metadata = {
  title: "Agent Voyage | ômi",
  description: "ômi - votre voyage commence ici",
};

export default function page() {
  return (
    <>
      <DashboardPage />
    </>
  );
}
