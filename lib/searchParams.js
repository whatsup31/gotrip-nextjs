// lib/searchParams.js
export const KEYS = ["city", "checkin", "checkout", "adults", "children", "rooms"];

export function parseSearch(searchParamsLike) {
  const obj = {};
  for (const k of KEYS) {
    const v = searchParamsLike?.get ? searchParamsLike.get(k) : searchParamsLike?.[k];
    if (v != null && v !== "") obj[k] = String(v);
  }
  return obj;
}

export function toQS(obj = {}) {
  const usp = new URLSearchParams();
  for (const k of KEYS) if (obj[k] != null && obj[k] !== "") usp.set(k, String(obj[k]));
  return usp.toString();
}

// petit secours côté client
export function saveToSession(obj = {}) {
  if (typeof window === "undefined") return;
  try { sessionStorage.setItem("omi.search", JSON.stringify(obj)); } catch {}
}
export function loadFromSession() {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(sessionStorage.getItem("omi.search") || "{}"); } catch { return {}; }
}

// fusion URL > session > defaults
export function hydrate(initial = {}, fromUrl = {}, fromSession = {}) {
  return { ...initial, ...fromSession, ...fromUrl };
}
