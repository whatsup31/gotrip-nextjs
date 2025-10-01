// components/common/InPlaceSubmit.jsx
'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { collectServicePayload } from '@/lib/serviceFormBridge';

function SubmitButton({ onBeforeSubmit, label = 'Ajouter le service' }) {
  const { pending } = useFormStatus();

  // Important : on injecte les champs cachés juste avant le submit
  const handleClick = useCallback(
    (e) => {
      if (pending) return;
      try {
        onBeforeSubmit?.(e);
        // ne pas appeler preventDefault ici : on veut laisser le <form> soumettre
      } catch (err) {
        // en cas d'erreur de préparation, on annule le submit
        e.preventDefault();
        console.error(err);
      }
    },
    [onBeforeSubmit, pending]
  );

  return (
    <button
      type="submit"
      className="button h-50 px-24 text-white" 
	  style={{ backgroundColor: "#00d2b5" }}
      disabled={pending}
      onClick={handleClick}
      title={label}
    >
      {pending ? 'Envoi…' : label}
      <div className="icon-arrow-top-right ml-15" />
    </button>
  );
}

export default function InPlaceSubmit({ error, label = 'Publier le logement' }) {
  const holderRef = useRef(null);
  const [localError, setLocalError] = useState(null);

  // Conserve ton placement auto dans la carte blanche (comme ta version actuelle)
  useEffect(() => {
    const card = document.querySelector('.py-30.px-30.rounded-4.bg-white.shadow-3');
    if (card && holderRef.current) card.appendChild(holderRef.current);
  }, []);

  // Bridge : injecte des <input type="hidden"> dans le <form> référent
  const onBeforeSubmit = useCallback((e) => {
    setLocalError(null);
    const form = e.currentTarget.form;
    if (!form) return;

    // Nettoie les anciennes injections (double-clic, etc.)
    form.querySelectorAll('input[data-bridge="1"]').forEach((n) => n.remove());

    // Récupère les valeurs depuis l’UI (sans modifier /components/**)
    const payload = collectServicePayload(document);

    // Injecte chaque champ attendu par l’action serveur
	Object.entries(payload).forEach(([name, value]) => {
	  if (value == null || value === '') return
	  const input = document.createElement('input')
	  input.type = 'hidden'
	  input.name = name
	  input.value = typeof value === 'object' ? JSON.stringify(value) : String(value) // JSON pour openings/images
	  input.setAttribute('data-bridge', '1')
	  form.appendChild(input)
	});
  }, []);

  return (
    <div ref={holderRef} className="d-inline-block pt-30">
      {(error || localError) && (
        <div className="text-red-500 text-sm mb-10">{error || localError}</div>
      )}
      <SubmitButton onBeforeSubmit={onBeforeSubmit} label={label} />
    </div>
  );
}
