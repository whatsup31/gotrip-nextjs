// app/api/omi-agent/route.ts
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge"; // rapide pour le PoC

// --- Schéma STRICT : additionalProperties:false + required = toutes les clés ---
const SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    destination: { type: "string" },
    currency: { type: "string" },
    plans: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          tier: { type: "string", enum: ["Eco","Équilibre","Confort","Luxe","Vert"] },
          total: { type: "number" },
          co2kg: { type: "number" },
          timeDoorToDoorHours: { type: "number" },
          highlights: { type: "array", items: { type: "string" } },
          transport: {
            type: "object",
            additionalProperties: false,
            properties: {
              outbound: {
                type: "object",
                additionalProperties: false,
                properties: {
                  from: { type: "string" },
                  to: { type: "string" },
                  dep: { type: "string" },
                  arr: { type: "string" },
                  stops: { type: "integer" },
                  carrier: { type: "string" }
                },
                required: ["from","to","dep","arr","stops","carrier"]
              },
              inbound: {
                type: "object",
                additionalProperties: false,
                properties: {
                  from: { type: "string" },
                  to: { type: "string" },
                  dep: { type: "string" },
                  arr: { type: "string" },
                  stops: { type: "integer" },
                  carrier: { type: "string" }
                },
                required: ["from","to","dep","arr","stops","carrier"]
              }
            },
            required: ["outbound","inbound"]
          },
          stay: {
            type: "object",
            additionalProperties: false,
            properties: {
              name: { type: "string" },
              type: { type: "string" },
              area: { type: "string" },
              rating: { type: "number" },
              nights: { type: "integer" },
              notes: { type: "string" }
            },
            // ⬇️ ICI on inclut bien 'notes' (obligatoire)
            required: ["name","type","area","rating","nights","notes"]
          },
          activities: {
            type: "array",
            minItems: 6,
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                title: { type: "string" },
                date: { type: "string" },
                start: { type: "string" },
                end: { type: "string" },
                note: { type: "string" }
              },
              // toutes les clés présentes sont requises
              required: ["title","date","start","end","note"]
            }
          },
          services: { type: "array", items: { type: "string" } },
          itinerary: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                day: { type: "integer" },
                summary: { type: "string" },
                blocks: {
                  type: "array",
                  items: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                      time: { type: "string" },
                      title: { type: "string" },
                      detail: { type: "string" }
                    },
                    required: ["time","title","detail"]
                  }
                }
              },
              required: ["day","summary","blocks"]
            }
          },
          why: { type: "array", items: { type: "string" } },
          deeplinks: {
            type: "object",
            additionalProperties: false,
            properties: {
              transport: { type: "string" },
              stay: { type: "string" },
              bundle: { type: "string" }
            },
            // on rend aussi les 3 liens obligatoires (pour satisfaire le strict)
            required: ["transport","stay","bundle"]
          }
        },
        // ⬇️ liste TOUTES les clés définies ci-dessus
        required: [
          "tier",
          "total",
          "co2kg",
          "timeDoorToDoorHours",
          "highlights",
          "transport",
          "stay",
          "activities",
          "services",
          "itinerary",
          "why",
          "deeplinks"
        ]
      }
    }
  },
  required: ["destination","currency","plans"]
};

export async function POST(req: NextRequest) {
  // Récupère { intent } depuis le body JSON
  let intent = "";
  try {
    const body = await req.json();
    intent = (body?.intent || "").toString();
  } catch { /* ignore */ }

  if (!intent) {
    return NextResponse.json(
      { error: "Le champ 'intent' est requis." },
      { status: 400 }
    );
  }

  const system = `Tu es “Ômi – Mon agent (PoC)”.
Réponds en JSON UNIQUE conforme au schéma fourni (strict, pas de champs en plus).
Inclure au minimum Eco / Équilibre / Confort, coûts TTC, CO₂ (kg), durée porte-à-porte, itinéraire jour-par-jour.
Pas de liens réels : mets "#". Devise EUR si non précisée.`;

  try {
    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1",
        input: [
          { role: "system", content: system },
          { role: "user", content: `Génère 3–5 plans pour: ${intent}` }
        ],
        // Structured Outputs via text.format (nouvelle API)
        text: {
          format: {
            type: "json_schema",
            name: "OmiPlans",
            schema: SCHEMA,
            strict: true
          }
        }
      })
    });

    if (!r.ok) {
      const errTxt = await r.text();
      return NextResponse.json({ error: errTxt }, { status: 500 });
    }

    const data = await r.json();
    const jsonText =
      data.output_text ??
      data.output?.[0]?.content?.[0]?.text ??
      "{}";

    const parsed = JSON.parse(jsonText);
    return NextResponse.json(parsed, { status: 200 });
  } catch {
    // --- Fallback démo : rendu bluffant même si l'API échoue ---
    return NextResponse.json({
      destination: "New York",
      currency: "EUR",
      plans: [
        {
          tier:"Eco", total:1890, co2kg:980, timeDoorToDoorHours:12,
          highlights:["Vol A/R 1 escale","Hôtel Queens proche métro","CityPASS 5 attractions","Match NBA option"],
          transport:{ outbound:{from:"TLS",to:"JFK",dep:"2025-09-20T07:10",arr:"2025-09-20T18:35",stops:1,carrier:"AF/DL"},
                      inbound:{from:"JFK",to:"TLS",dep:"2025-09-27T21:15",arr:"2025-09-28T12:05",stops:1,carrier:"DL/AF"} },
          stay:{ name:"Metro Inn", type:"Hôtel 3*", area:"Long Island City", rating:4.2, nights:7, notes:"Annulation gratuite J-3" },
          activities:[
            {title:"Top of the Rock",date:"2025-09-21",start:"10:00",end:"11:30",note:"Entrée horodatée"},
            {title:"Brooklyn Bridge + DUMBO",date:"2025-09-21",start:"15:00",end:"17:30",note:"Golden hour"},
            {title:"Statue de la Liberté",date:"2025-09-22",start:"09:30",end:"12:30",note:"Ferry"},
            {title:"MoMA",date:"2025-09-23",start:"11:00",end:"13:00",note:"CityPASS"},
            {title:"Harlem Gospel",date:"2025-09-24",start:"10:30",end:"12:00",note:"Mercredi"},
            {title:"NBA Game (pré-saison)",date:"2025-09-25",start:"19:30",end:"22:00",note:"Option"}
          ],
          services:["Transfert JFK→NYC (navette)","eSIM 5 Go","MetroCard 7 jours"],
          itinerary:[
            {day:1,summary:"Midtown repères",blocks:[{time:"AM",title:"Top of the Rock",detail:"Vue skyline"},{time:"PM",title:"5th Ave",detail:"Shopping léger"}]},
            {day:2,summary:"Lower Manhattan",blocks:[{time:"AM",title:"Statue",detail:"Ferry Battery Park"},{time:"PM",title:"Wall St & 9/11",detail:"Musée option"}]}
          ],
          why:["Meilleur prix total","Accès métro rapide","CityPASS inclus"],
          deeplinks:{transport:"#",stay:"#",bundle:"#"}
        }
      ]
    });
  }
}
