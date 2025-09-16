'use client';

import React from 'react';

declare global {
  interface Window { __patchedReactCreateEl?: boolean }
}

if (typeof window !== 'undefined' && !window.__patchedReactCreateEl) {
  const orig = React.createElement;

  React.createElement = function patchedCreate(type: any, props: any, ...children: any[]) {
    if (props && typeof props.className === 'boolean') {
      // convertit true/false -> ''
      props = { ...props, className: '' };
    }
    if (props && props.className != null && typeof props.className !== 'string') {
      try {
        props = { ...props, className: String(props.className) };
      } catch {
        props = { ...props, className: '' };
      }
    }
    return orig(type, props, ...children);
  };

  window.__patchedReactCreateEl = true;
}
