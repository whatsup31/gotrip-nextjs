// app/(dashboard)/vendor-dashboard/add-hotel/page.jsx
'use client';
import './_shim-jsx-runtime.js'; // ← DOIT être la 1re importation
//import React from "react";
import { useActionState } from 'react';
import { createListingAction } from './actions';
import DashboardPage from "../../../../components/dashboardc/conciergerie-dashboard/add-hotel";
import InPlaceSubmit from '@/components/common/InPlaceSubmit';

const initialState = { error: null };

export default function Page() {
  const [state, formAction] = useActionState(createListingAction, initialState);
  return (
    <form action={formAction}>
      <DashboardPage />
      <InPlaceSubmit error={state.error} />
    </form>
  );
}
