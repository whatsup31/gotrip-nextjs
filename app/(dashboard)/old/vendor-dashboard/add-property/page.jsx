// app/(dashboard)/vendor-dashboard/add-property/page.jsx
'use client';
import './_shim-jsx-runtime.js'; // ← DOIT être la 1re importation

import { useActionState } from 'react';
import { createListingAction } from './actions';
import DashboardPage from '@/components/dashboard/vendor-dashboard/add-property';
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