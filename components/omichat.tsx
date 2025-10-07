// components/OmiChat.GoTrip.tsx
"use client";
import { useMemo, useState } from "react";

/* ===== Types ===== */
type Block = { time: string; title: string; detail?: string };
type Day = { day: number; summary: string; blocks: Block[] };
type Activity = { date: string; title: string };

type TransportLeg = {
  dep?: string; // e.g., TLS 06:35
  arr?: string; // e.g., MIA 15:05
  stops?: number; // number of stops
  baggage?: string; // e.g., 1×23 kg soute + 1×8 kg cabine
};

type Plan = {
  tier: "Eco" | "Équilibre" | "Confort" | "Luxe" | "Vert" | string;
  total: number; // total TTC in currency
  co2kg: number; // kg CO2
  timeDoorToDoorHours?: number; // indicative total time (one way)
  highlights?: string[];
  transport?: { outbound?: TransportLeg; inbound?: TransportLeg };
  stay: { name: string; area: string; rating?: number; type?: string; pricePerNight?: number };
  activities?: Activity[]; // 6–10 dated activities
  itinerary: Day[];
  why: string[]; // 2–3 reasons
  services?: string[]; // transfers, eSIM, pass, etc.
  deeplinks?: { transport?: string; stay?: string; bundle?: string };
};

type Payload = {
  destination: string;
  currency: string; // e.g., EUR
  dates?: string; // e.g., 8 nov. → 7 déc. 2025
  people?: number; // e.g., 1
  durationLabel?: string; // e.g., 1 mois, 10 jours
  plans: Plan[];
};

/* ===== Emojis tiers ===== */
const EMOJI: Record<string, string> = { Eco: "🟢", "Équilibre": "⚖️", Confort: "💎", Luxe: "👑", Vert: "🌱" };

/* ===== Utils ===== */
const nf = (n: number) => new Intl.NumberFormat("fr-FR").format(n);
const round = (n?: number) => (typeof n === "number" ? Math.round(n) : undefined);

/* ===== Carte Plan (classes GoTrip/Bootstrap) ===== */
function PlanCard({ p, currency }: { p: Plan; currency: string }) {
  return (
    <div className="card border rounded-3 shadow-sm h-100">
      {/* Header */}
      <div className="card-header bg-white d-flex align-items-center justify-content-between">
        <h6 className="mb-0 fw-semibold text-dark">
          {(EMOJI[p.tier] || "🧭")} {p.tier}
        </h6>
        <div className="fs-6 fw-bold text-primary">
          {nf(round(p.total) ?? 0)} {currency}
        </div>
      </div>

      <div className="card-body d-flex flex-column gap-2">
        {/* Résumé badges */}
        <div className="d-flex flex-wrap gap-2 mb-2">
          <span className="badge bg-light text-dark border">💰 {nf(round(p.total) ?? 0)} {currency}</span>
          <span className="badge bg-light text-dark border">🌍 {nf(round(p.co2kg) ?? 0)} kg CO₂</span>
          {typeof p.timeDoorToDoorHours === "number" && (
            <span className="badge bg-light text-dark border">⏱️ {p.timeDoorToDoorHours} h</span>
          )}
        </div>

        {/* ✈️ Transport */}
        <div className="mb-2">
          <div className="fw-semibold mb-1">✈️ Transport</div>
          <div className="bg-light border rounded-3 p-3 small text-secondary">
            <div><b>Aller :</b> {p.transport?.outbound?.dep} → {p.transport?.outbound?.arr} ({p.transport?.outbound?.stops ?? 0} esc.)</div>
            <div><b>Retour :</b> {p.transport?.inbound?.dep} → {p.transport?.inbound?.arr} ({p.transport?.inbound?.stops ?? 0} esc.)</div>
            {p.transport?.outbound?.baggage && (
              <div className="mt-1"><b>Bagages :</b> {p.transport.outbound.baggage}</div>
            )}
          </div>
        </div>

        {/* 🏨 Hébergement */}
        <div className="mb-2">
          <div className="fw-semibold mb-1">🏨 Hébergement</div>
          <div className="bg-light border rounded-3 p-3 small text-secondary">
            <div>
              <b>{p.stay?.name}</b> — {p.stay?.area}
              {p.stay?.type ? ` • ${p.stay.type}` : ""}
              {typeof p.stay?.rating === "number" ? ` • ${p.stay.rating.toFixed(1)}/10` : ""}
              {typeof p.stay?.pricePerNight === "number" ? ` • ${nf(p.stay.pricePerNight)} ${currency}/nuit` : ""}
            </div>
          </div>
        </div>

        {/* 🎟️ Activités */}
        {!!p.activities?.length && (
          <div className="mb-2">
            <div className="fw-semibold mb-1">🎟️ Activités</div>
            <ul className="list-unstyled small mb-0">
              {p.activities.slice(0, 10).map((a, i) => (
                <li key={i} className="mb-1">• <b>{a.date}</b> {a.title}</li>
              ))}
            </ul>
          </div>
        )}

        {/* 🛠️ Services */}
        {!!p.services?.length && (
          <div className="mb-2">
            <div className="fw-semibold mb-1">🛠️ Services</div>
            <ul className="list-unstyled small mb-0">
              {p.services.map((s, i) => (
                <li key={i} className="mb-1">• {s}</li>
              ))}
            </ul>
          </div>
        )}

        {/* 📅 Itinéraire (collapse natif) */}
        <div className="mb-2">
          <details>
            <summary className="fw-semibold">📅 Itinéraire (aperçu)</summary>
            <div className="pt-2">
              {p.itinerary?.slice(0, 4).map((d, idx) => (
                <div key={idx} className="ps-3 border-start">
                  <div className="text-dark"><b>Jour {d.day}</b> — {d.summary}</div>
                  <ul className="small text-secondary">
                    {d.blocks?.slice(0, 3).map((b, j) => (
                      <li key={j}>{b.time} • {b.title}{b.detail ? ` — ${b.detail}` : ""}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </details>
        </div>

        {/* 💡 Pourquoi */}
        {!!p.why?.length && (
          <div className="mb-2">
            <details>
              <summary className="fw-semibold">💡 Pourquoi ce plan</summary>
              <ul className="small mt-2 mb-0">
                {p.why.map((w, i) => (
                  <li key={i}>✅ {w}</li>
                ))}
              </ul>
            </details>
          </div>
        )}
      </div>

      {/* Footer: deeplinks */}
      <div className="card-footer bg-white d-flex gap-2 flex-wrap">
        <a className="btn btn-outline-primary btn-sm" href={p.deeplinks?.transport || "#"}>🔗 Transport</a>
        <a className="btn btn-outline-primary btn-sm" href={p.deeplinks?.stay || "#"}>🔗 Hébergement</a>
        <a className="btn btn-outline-primary btn-sm" href={p.deeplinks?.bundle || "#"}>🧺 Panier</a>
      </div>
    </div>
  );
}

/* ===== Bulle assistant (titre + grille + tableau comparatif) ===== */
function AssistantBubble({ payload }: { payload: Payload }) {
  if (!payload?.plans?.length) {
    return <div className="alert alert-secondary mb-0">Désolé, aucun plan n’a été généré.</div>;
  }
  const title = `🌴 ${payload.destination} – ${payload.durationLabel || "séjour"} – ${payload.people || 1} personne${(payload.people || 1) > 1 ? "s" : ""}${payload.dates ? ` (${payload.dates})` : ""}`;

  return (
    <div className="p-2 p-md-3">
      {/* Titre */}
      <div className="mb-2">
        <h5 className="mb-1 fw-bold text-dark">{title}</h5>
        <div className="text-muted small">Sélectionne un plan pour consulter l’itinéraire et les détails.</div>
      </div>

      {/* Grille */}
      <div className="row g-3">
        {payload.plans.map((p, i) => (
          <div key={i} className="col-12 col-lg-4 d-flex">
            <PlanCard p={p} currency={payload.currency} />
          </div>
        ))}
      </div>

      {/* Tableau comparatif */}
      <div className="mt-3">
        <div className="fw-bold mb-2">📊 Tableau comparatif</div>
        <div className="table-responsive">
          <table className="table table-striped align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Plan</th>
                <th>Prix TTC</th>
                <th>CO₂</th>
                <th>Temps trajet</th>
                <th>Hébergement</th>
              </tr>
            </thead>
            <tbody>
              {payload.plans.map((p, i) => (
                <tr key={i}>
                  <td>{(EMOJI[p.tier] || "🧭")} {p.tier}</td>
                  <td>{nf(round(p.total) ?? 0)} {payload.currency}</td>
                  <td>{nf(round(p.co2kg) ?? 0)} kg</td>
                  <td>{typeof p.timeDoorToDoorHours === "number" ? `${p.timeDoorToDoorHours} h / ${p.timeDoorToDoorHours} h` : "—"}</td>
                  <td>{[p.stay?.type, p.stay?.area].filter(Boolean).join(" • ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ===== Skeleton (cartes fantômes) ===== */
function SkeletonCard() {
  return (
    <div className="card border rounded-3 shadow-sm h-100">
      <div className="card-body">
        <div className="placeholder-glow">
          <span className="placeholder col-6"></span>
        </div>
        <div className="mt-2 d-flex gap-2">
          <span className="badge bg-light text-dark border">&nbsp;&nbsp;&nbsp;</span>
          <span className="badge bg-light text-dark border">&nbsp;&nbsp;&nbsp;</span>
          <span className="badge bg-light text-dark border">&nbsp;&nbsp;&nbsp;</span>
        </div>
        <div className="mt-3">
          <div className="placeholder-glow"><span className="placeholder col-9"></span></div>
          <div className="placeholder-glow mt-1"><span className="placeholder col-7"></span></div>
          <div className="placeholder-glow mt-1"><span className="placeholder col-5"></span></div>
        </div>
      </div>
      <div className="card-footer bg-white">
        <div className="btn btn-outline-secondary btn-sm disabled">…</div>
      </div>
    </div>
  );
}

/* ===== Composant principal (chat) ===== */
export default function OmiChatGoTrip() {
  const [input, setInput] = useState("");
  const [thread, setThread] = useState<{ role: "user" | "assistant"; content: string | Payload }[]>([]);
  const [loading, setLoading] = useState(false);
  const hasResults = useMemo(() => thread.some((t) => t.role === "assistant"), [thread]);

  async function send() {
    const text = input.trim();
    if (!text) return;
    setThread((t) => [...t, { role: "user", content: text }]);
    setInput("");
    setLoading(true);
    try {
      const r = await fetch("/api/omi-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intent: text })
      });
      const data: Payload = await r.json();
      setThread((t) => [...t, { role: "assistant", content: data }]);
    } catch {
      setThread((t) => [...t, { role: "assistant", content: { destination: "—", currency: "EUR", plans: [] } }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-l">
      {/* Fil de chat */}
      <div className="d-flex flex-column gap-3 mb-3">
        {thread.map((m, i) => (
          <div key={i} className={`d-flex ${m.role === "user" ? "justify-content-end" : "justify-content-start"}`}>
            {m.role === "user" ? (
              <div className="bg-primary text-white p-3 rounded-4" style={{maxWidth: 1100, borderTopRightRadius: 12}}>
                <div className="small mb-1">Vous</div>
                <div className="fw-medium" style={{whiteSpace: 'pre-wrap'}}>{m.content as string}</div>
              </div>
            ) : (
              <div className="bg-white border rounded-4 shadow-sm p-0" style={{maxWidth: 1100, borderTopLeftRadius: 12}}>
                <AssistantBubble payload={m.content as Payload} />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="d-flex justify-content-start">
            <div className="bg-white border rounded-4 shadow-sm p-3" style={{maxWidth: 1100}}>
              <div className="fw-bold mb-2">✨ Je prépare tes plans…</div>
              <div className="row g-3">
                <div className="col-12 col-lg-4 d-flex"><SkeletonCard /></div>
                <div className="col-12 col-lg-4 d-flex"><SkeletonCard /></div>
                <div className="col-12 col-lg-4 d-flex"><SkeletonCard /></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Saisie */}
      <div className="card border rounded-4 shadow-sm">
        <div className="card-body">
          <textarea
            className="form-control"
            placeholder="Bali 10 jours en couple en juin, plage + temples, budget 2500€, départ Lyon…"
            rows={6}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="d-flex align-items-center gap-2 mt-3">
          <button
          onClick={send}
          disabled={loading}
          className="button h-50 px-24 text-white d-flex items-center justify-center"
          style={{ backgroundColor: "#007ad5" }}
          >
          {loading ? "Génération…" : "Envoyer"}
          </button>
            {!hasResults && <span className="text-muted small">Astuce : précise dates, style (détente/aventure/romance), budget…</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
