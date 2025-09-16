'use client';

// Patch du runtime JSX pour forcer className à être une string
import * as JSX from 'react/jsx-runtime';

const origJsx  = JSX.jsx;
const origJsxs = JSX.jsxs;

function coerceProps(props) {
  if (!props) return props;

  // className booléen -> ''
  if (typeof props.className === 'boolean') {
    return { ...props, className: '' };
  }

  // className non-string -> string
  if (props.className != null && typeof props.className !== 'string') {
    try { return { ...props, className: String(props.className) }; }
    catch { return { ...props, className: '' }; }
  }

  return props;
}

JSX.jsx  = (type, props, key) => origJsx(type,  coerceProps(props),  key);
JSX.jsxs = (type, props, key) => origJsxs(type, coerceProps(props), key);
