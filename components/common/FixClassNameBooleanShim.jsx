'use client';

import React from 'react';
import { useEffect } from 'react';

export default function FixClassNameBooleanShim() {
  useEffect(() => {
    const origCreate = React.createElement;

    React.createElement = function patchedCreate(type, props, ...children) {
      // Si un composant reçoit className booléen, le convertir en string
      if (props && typeof props.className === 'boolean') {
        props = { ...props, className: props.className ? '' : '' };
      }
      // Si className arrive comme autre chose que string (rare), fallback en string
      if (props && props.className != null && typeof props.className !== 'string') {
        try {
          props = { ...props, className: String(props.className) };
        } catch {
          props = { ...props, className: '' };
        }
      }
      return origCreate(type, props, ...children);
    };

    return () => {
      React.createElement = origCreate;
    };
  }, []);

  return null;
}
