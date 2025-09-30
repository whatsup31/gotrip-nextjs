// components/OmiChat.tsx
"use client";
import { useMemo, useState } from "react";

/* ===== Types ===== */
type Block = { time: string; title: string; detail: string };
type Day = { day: number; summary: string; blocks: Block[] };
type Plan = {
  tier: "Eco" | "Équilibre" | "Confort" | "Luxe" | "Vert" | string;
  total: number; co2kg: number; timeDoorToDoorHours?: number;
  highlights: string[]; transport: any;
  stay: { name: string; area: string; rating?: number; type?: string };
  itinerary: Day[]; why: string[];
  services?: string[]; deeplinks?: { transport?: string; stay?: string; bundle?: string };
};
type Payload = { destination: string; currency: string; plans: Plan[] };

/* ===== Emojis tiers ===== */
const EMOJI: Record<string,string> = { Eco:"🪙", "Équilibre":"⚖️", Confort:"💎", Luxe:"👑", Vert:"🍃" };

/* ===== Carte Plan (sobre & aérée) ===== */
function PlanCard({ p, currency }: { p: Plan; currency: string }) {
  return (
    <div className="planCard">
      {/* Header clair et respirant */}
      <div className="planHead">
        <div className="planTier">{(EMOJI[p.tier]||"🧭")} {p.tier}</div>
        <div className="planPrice">{Math.round(p.total)} {currency}</div>
      </div>

      {/* Badges clés */}
      <div className="planMeta">
        <span className="pill">🌍 {Math.round(p.co2kg)} kg CO₂</span>
        {typeof p.timeDoorToDoorHours === "number" && (
          <span className="pill">⏱ {p.timeDoorToDoorHours} h</span>
        )}
      </div>

      {/* Highlights */}
      {!!p.highlights?.length && (
        <ul className="planList">
          {p.highlights.slice(0,3).map((h,i)=><li key={i}>{h}</li>)}
        </ul>
      )}

      {/* Transport */}
      <div className="planSection">
        <div className="sectionTitle">🚖 Transport</div>
        <div className="sectionBox">
          <div><b>Aller :</b> {p.transport?.outbound?.dep} → {p.transport?.outbound?.arr} ({p.transport?.outbound?.stops ?? 0} esc.)</div>
          <div><b>Retour :</b> {p.transport?.inbound?.dep} → {p.transport?.inbound?.arr} ({p.transport?.inbound?.stops ?? 0} esc.)</div>
        </div>
      </div>

      {/* Hébergement */}
      <div className="planSection">
        <div className="sectionTitle">🏨 Hébergement</div>
        <div className="sectionBox">
          {p.stay?.name} — {p.stay?.area}{p.stay?.rating ? ` • ${p.stay.rating}/5` : ""}
        </div>
      </div>

      {/* Itinéraire */}
      <details className="planSection">
        <summary className="sectionTitle summaryClickable">🗺️ Itinéraire (aperçu)</summary>
        <div className="timeline">
          {p.itinerary?.slice(0,4).map((d,idx)=>(
            <div key={idx} className="timelineItem">
              <div className="timelineDay"><b>Jour {d.day}</b> — {d.summary}</div>
              <ul>
                {d.blocks?.slice(0,3).map((b,j)=><li key={j}>{b.time} • {b.title}{b.detail?` — ${b.detail}`:""}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </details>

      {/* Pourquoi */}
      <details className="planSection">
        <summary className="sectionTitle summaryClickable">💡 Pourquoi ce plan</summary>
        <ul className="planList">
          {p.why?.map((w,i)=><li key={i}>{w}</li>)}
        </ul>
      </details>

      {/* Liens factices */}
      <div className="planLinks">
        <a href="#">🔗 Transport</a>
        <a href="#">🔗 Hébergement</a>
        <a href="#">🧺 Panier</a>
      </div>
    </div>
  );
}

/* ===== Bulle assistant (titre + grille de cartes) ===== */
function AssistantBubble({ payload }: { payload: Payload }) {
  if (!payload?.plans?.length) {
    return <div className="empty">Désolé, aucun plan n’a été généré.</div>;
  }
  return (
    <div className="assistantWrap">
      <div className="assistantHeader">
        <div className="assistantTitle">Propositions pour {payload.destination} — {payload.currency}</div>
        <div className="assistantHint">Sélectionne un plan pour consulter l’itinéraire.</div>
      </div>
      <div className="cardsGrid">
        {payload.plans.map((p,i)=>(
          <div key={i} className="gridCol">
            <PlanCard p={p} currency={payload.currency}/>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===== Skeleton (cartes fantômes) ===== */
function SkeletonCard() {
  return (
    <div className="planCard">
      <div className="shimmer h24" />
      <div className="metaRow">
        <div className="shimmer dot" /><div className="shimmer dot wide" />
      </div>
      <div className="shimmer l" />
      <div className="shimmer m" />
      <div className="shimmer s" />
    </div>
  );
}

/* ===== Composant principal (chat) ===== */
export default function OmiChat() {
  const [input, setInput] = useState("");
  const [thread, setThread] = useState<{ role:"user"|"assistant"; content:string|Payload }[]>([]);
  const [loading, setLoading] = useState(false);
  const hasResults = useMemo(()=>thread.some(t=>t.role==="assistant"),[thread]);

  async function send() {
    const text = input.trim();
    if (!text) return;
    setThread(t=>[...t, { role:"user", content:text }]);
    setInput("");
    setLoading(true);
    try{
      const r = await fetch("/api/omi-agent", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ intent:text })
      });
      const data: Payload = await r.json();
      setThread(t=>[...t, { role:"assistant", content:data }]);
    } catch {
      setThread(t=>[...t, { role:"assistant", content:{ destination:"—", currency:"EUR", plans:[] } }]);
    } finally { setLoading(false); }
  }

  return (
    <div className="omi">
      {/* Fil de chat */}
      <div className="thread">
        {thread.map((m,i)=>(
          <div key={i} className={`row ${m.role==="user" ? "right" : "left"}`}>
            {m.role==="user" ? (
              <div className="bubble user">{m.content as string}</div>
            ) : (
              <div className="bubble assistant"><AssistantBubble payload={m.content as Payload}/></div>
            )}
          </div>
        ))}

        {loading && (
          <div className="row left">
            <div className="bubble assistant">
              <div className="assistantHeader">
                <div className="assistantTitle">✨ Je prépare tes plans…</div>
              </div>
              <div className="cardsGrid">
                <div className="gridCol"><SkeletonCard/></div>
                <div className="gridCol"><SkeletonCard/></div>
                <div className="gridCol"><SkeletonCard/></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Saisie */}
      <div className="inputCard">
        <textarea
          placeholder="Bali 10 jours en couple en juin, plage + temples, budget 2500€, départ Lyon…"
          rows={6}
          value={input}
          onChange={(e)=>setInput(e.target.value)}
        />
        <div className="actions">
          <button onClick={send} disabled={loading} className="btnPrimary">{loading ? "Génération…" : "Envoyer"}</button>
          {!hasResults && <span className="hint">Astuce : précise dates, style (détente/aventure/romance), budget...</span>}
        </div>
      </div>

      {/* ===== CSS local (styled-jsx) ===== */}
      <style jsx>{`
        .omi { display:flex; flex-direction:column; gap:24px; }
        .thread { display:flex; flex-direction:column; gap:14px; }
        .row { display:flex; }
        .row.right { justify-content:flex-end; }
        .row.left { justify-content:flex-start; }
        .bubble { max-width:1100px; }
        .bubble.user {
          background:#007cd2; color:#fff; padding:16px 18px; border-radius:20px; border-top-right-radius:10px;
          box-shadow:0 6px 14px rgba(0,0,0,.08); white-space:pre-wrap; font-size:15px; line-height:1.45;
        }
        .bubble.assistant {
          background:#fff; border:1px solid #E5E7EB; border-radius:20px; border-top-left-radius:10px;
          overflow:hidden; box-shadow:0 6px 18px rgba(0,0,0,.05);
        }

        /* Assistant bloc titre */
        .assistantWrap { }
        .assistantHeader { padding:18px 18px 8px; }
        .assistantTitle { font-weight:700; font-size:16px; color:#0f172a; }
        .assistantHint { margin-top:4px; font-size:13px; color:#6b7280; }

        /* Grille cartes */
        .cardsGrid { display:grid; grid-template-columns:repeat(3, minmax(0,1fr)); gap:16px; padding:12px 18px 18px; }
        .gridCol { min-width:0; }
        @media (max-width:1024px) { .cardsGrid { grid-template-columns:1fr; } }

        /* Carte plan (sobre) */
        .planCard {
          border:1px solid #E5E7EB; border-radius:16px; background:#fff; padding:18px;
          display:flex; flex-direction:column; gap:16px;
          box-shadow:0 4px 12px rgba(0,0,0,.04); transition:box-shadow .2s, transform .2s;
        }
        .planCard:hover { box-shadow:0 10px 28px rgba(0,0,0,.08); transform:translateY(-2px); }
        .planHead { display:flex; justify-content:space-between; align-items:center; gap:12px; }
        .planTier { font-size:18px; font-weight:600; color:#111827; }
        .planPrice { font-size:18px; font-weight:700; color:#007cd2; }
        .planMeta { display:flex; gap:12px; flex-wrap:wrap; }
        .pill {
          display:inline-flex; align-items:center; gap:6px; padding:6px 10px; border-radius:999px;
          border:1px solid #E5E7EB; background:#F8FAFC; font-size:12px; color:#374151;
        }

        .planList { font-size:14px; margin:0; padding-left:18px; color:#1f2937; display:flex; flex-direction:column; gap:6px; }
        .planSection { display:flex; flex-direction:column; gap:8px; }
        .sectionTitle { font-weight:600; color:#0f172a; }
        .summaryClickable { cursor:pointer; }
        .sectionBox {
          background:#F8FAFC; border:1px solid #E5E7EB; border-radius:12px; padding:12px 14px;
          font-size:13px; color:#374151; line-height:1.5;
        }

        /* Timeline */
        .timeline { display:flex; flex-direction:column; gap:12px; margin-top:4px; }
        .timelineItem { border-left:2px solid #E5E7EB; padding-left:12px; }
        .timelineItem ul { margin:6px 0 0; padding-left:18px; font-size:13px; color:#374151; }
        .timelineDay { color:#111827; }

        /* Liens */
        .planLinks { display:flex; gap:10px; flex-wrap:wrap; }
        .planLinks a {
          font-size:13px; border:1px solid #E5E7EB; border-radius:999px; padding:8px 12px;
          background:#fff; color:#007cd2; font-weight:500;
        }

        /* Skeleton */
        .shimmer { background:linear-gradient(90deg,#f3f4f6,#e5e7eb,#f3f4f6); animation:pulse 1.6s infinite; border-radius:8px; }
        .h24 { height:24px; }
        .metaRow { display:flex; gap:10px; }
        .dot { height:18px; width:90px; border-radius:999px; }
        .dot.wide { width:140px; }
        .l { height:14px; width:85%; margin-top:8px; }
        .m { height:14px; width:70%; margin-top:6px; }
        .s { height:14px; width:55%; margin-top:6px; }
        @keyframes pulse { 0%{opacity:.6} 50%{opacity:1} 100%{opacity:.6} }

        /* Input card */
        .inputCard {
          background:#fff; border:1px solid #E5E7EB; border-radius:16px; padding:20px 20px 16px;
          box-shadow:0 6px 18px rgba(0,0,0,.05);
        }
        .inputCard textarea {
          width:100%; min-height:140px; border:1px solid #E5E7EB; border-radius:12px; padding:16px;
          font-size:15px; color:#111827;
        }
        .actions { display:flex; align-items:center; gap:10px; margin-top:12px; }
        .btnPrimary { background:#007cd2; color:#fff; border:none; border-radius:10px; height:46px; padding:0 22px; font-weight:600; }
        .btnPrimary:disabled { opacity:.65; }
        .hint { font-size:13px; color:#6b7280; }
        .empty { padding:18px; font-size:14px; color:#374151; }
      `}</style>
    </div>
  );
}
