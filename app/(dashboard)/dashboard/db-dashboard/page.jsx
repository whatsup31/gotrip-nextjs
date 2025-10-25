import React from "react";
import DashboardPage from "../../../../components/dashboard/dashboard/db-dashboard";

export const metadata = {
  title: "Dashboard | ômi",
  description: "ômi - votre voyage commence ici",
};

export default function page() {
  return (
    <>
      <DashboardPage />
    </>
  );
}
