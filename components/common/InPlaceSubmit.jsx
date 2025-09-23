// components/common/InPlaceSubmit.jsx
'use client';

import { useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="button h-50 px-24 -dark-1 bg-blue-1 text-white"
      disabled={pending}
    >
      {pending ? 'Création…' : 'Créer le logement'}
      <div className="icon-arrow-top-right ml-15" />
    </button>
  );
}

export default function InPlaceSubmit({ error }) {
  const holderRef = useRef(null);

  useEffect(() => {
    const card = document.querySelector('.py-30.px-30.rounded-4.bg-white.shadow-3');
    if (card && holderRef.current) card.appendChild(holderRef.current);
  }, []);

  return (
    <div ref={holderRef} className="d-inline-block pt-30">
      {error && <div className="text-red-500 text-sm mb-10">{error}</div>}
      <SubmitButton />
    </div>
  );
}
