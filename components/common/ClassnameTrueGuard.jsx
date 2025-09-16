'use client';
import { useEffect } from 'react';

export default function ClassnameTrueGuard() {
  useEffect(() => {
    const scrub = (el) => { if (el.getAttribute('class') === 'true') el.removeAttribute('class'); };

    // nettoyage initial
    document.querySelectorAll('[class="true"]').forEach(scrub);

    // observe et nettoie en continu
    const mo = new MutationObserver((muts) => {
      for (const m of muts) {
        if (m.type === 'attributes') scrub(m.target);
        for (const n of m.addedNodes || []) if (n.nodeType === 1) scrub(n);
      }
    });
    mo.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['class'] });
    return () => mo.disconnect();
  }, []);

  return null;
}
