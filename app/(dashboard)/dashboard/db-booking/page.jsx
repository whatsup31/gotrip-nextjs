import React from "react";
import DashboardPage from "../../../../components/dashboard/dashboard/db-booking";

export const metadata = {
  title: "Booking History | ômi",
  description: "ômi - votre voyage commence ici",
};

export default function page() {
  return (
    <>
      <DashboardPage />
    </>
  );
}
