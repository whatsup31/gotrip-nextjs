// app/api/service-orders/[id]/route.ts
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

type Action = "accept" | "refuse" | "in_progress" | "done";
type PatchBody = { action?: Action };

const MAP: Record<Action, string> = {
  accept: "accepted",
  refuse: "refused",
  in_progress: "in_progress",
  done: "done",
};

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "unauthorized" }, { status: 401 });

  let body: PatchBody;
  try { body = await req.json(); } catch { return Response.json({ error: "invalid JSON" }, { status: 400 }); }

  const next = body?.action ? MAP[body.action as Action] : null;
  if (!next) return Response.json({ error: "invalid action" }, { status: 400 });

  const id = Number(params.id);

  // 1) lire l’ordre
  const { data: so, error: readErr } = await supabase
    .from("service_orders")
    .select("id, provider_id, status")
    .eq("id", id)
    .single();

  if (readErr || !so) return Response.json({ error: readErr?.message || "not found" }, { status: 404 });

  // 2) autorisation POC
  if (so.provider_id && so.provider_id !== user.id) {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }

  const patch: any = {
    status: next,
    updated_at: new Date().toISOString(),
  };
  if (!so.provider_id) patch.provider_id = user.id; // claim si non assigné

  const { data, error: updErr } = await supabase
    .from("service_orders")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (updErr) return Response.json({ error: updErr.message }, { status: 400 });

  return Response.json({ ok: true, data }, { status: 200 });
}
