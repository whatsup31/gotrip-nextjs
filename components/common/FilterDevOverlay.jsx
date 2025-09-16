'use client';
import { useEffect } from 'react';

export default function FilterDevOverlay() {
  useEffect(() => {
    const target = 'Received `true` for a non-boolean attribute `className`';
    const orig = console.error;
    console.error = function (...args) {
      const hit = args.some((a) => {
        if (typeof a === 'string') return a.includes(target);
        if (a && typeof a === 'object' && typeof a.message === 'string') return a.message.includes(target);
        return false;
      });
      if (hit) return; // on ignore juste CE warning
      return orig.apply(this, args);
    };
    return () => { console.error = orig; };
  }, []);
  return null;
}
