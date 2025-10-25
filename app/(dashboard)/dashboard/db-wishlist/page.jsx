import React from "react";
import DashboardPage from "../../../../components/dashboard/dashboard/db-wishlist";

export const metadata = {
  title: "Wishlist | ômi",
  description: "ômi - votre voyage commence ici",
};

export default function page() {
  return (
    <>
      <DashboardPage />
    </>
  );
}
