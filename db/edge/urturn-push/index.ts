import webpush from "npm:web-push@3.6.7";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
let ready = false;
const MAX_PUSHES = 11; // first ring + 10 repeats (every ~30s for 5 minutes)

async function init() {
  if (ready) return;
  const { data } = await db.from("urturn_secrets").select("k,v");
  const m = Object.fromEntries((data || []).map((r: any) => [r.k, r.v]));
  webpush.setVapidDetails("mailto:urturnapp1@gmail.com", m.vapid_pub, m.vapid_priv);
  ready = true;
}

async function send(order_id: string, p: any, o: any, n: number) {
  const { data: s } = await db.from("urturn_shops").select("name,slug").eq("id", o.shop_id).maybeSingle();
  const ar = (p.sub.lang || "ar") !== "en";
  const again = n > 1;
  const payload = JSON.stringify({
    title: ar ? `🔔 طلبك جاهز! رقم ${o.num}` : `🔔 Your order is ready! #${o.num}`,
    body: again
      ? (ar ? `لسا بستناك عند ${s?.name || "الكاونتر"} ⏰` : `Still waiting for you at ${s?.name || "the counter"} ⏰`)
      : (ar ? `تفضّل استلمه من ${s?.name || "الكاونتر"}` : `Please pick it up at ${s?.name || "the counter"}`),
    url: p.sub.url || "",
    tag: "urturn-" + order_id,
  });
  try {
    await webpush.sendNotification({ endpoint: p.sub.endpoint, keys: p.sub.keys }, payload, { TTL: 120, urgency: "high" });
  } catch (e: any) {
    if (e?.statusCode === 404 || e?.statusCode === 410) await db.from("urturn_push").delete().eq("order_id", order_id);
    return false;
  }
  await db.from("urturn_push").update({ sent_ring: o.ring_at, last_push: new Date().toISOString(), push_n: n }).eq("order_id", order_id);
  return true;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const out = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...cors, "Content-Type": "application/json" } });
  try {
    const body = await req.json();
    await init();

    // Repeat mode (called by the 30s timer): re-send to customers who haven't picked up yet.
    if (body.repeat) {
      const { data: rows } = await db.from("urturn_push").select("order_id,sub,last_push,push_n,sent_ring")
        .gte("push_n", 1).lt("push_n", MAX_PUSHES).lt("last_push", new Date(Date.now() - 25000).toISOString());
      let sent = 0;
      for (const p of rows || []) {
        const { data: o } = await db.from("urturn_orders").select("num,status,ring_at,shop_id").eq("id", p.order_id).maybeSingle();
        if (!o || o.status !== "ready" || !o.ring_at) continue;
        if (Date.now() - new Date(o.ring_at).getTime() > 300000) continue;
        if (await send(p.order_id, p, o, (p.push_n || 1) + 1)) sent++;
      }
      return out({ ok: true, repeat: true, sent });
    }

    const { order_id } = body;
    if (!order_id || !/^[0-9a-f-]{36}$/i.test(order_id)) return out({ ok: false, err: "bad_id" }, 400);
    const { data: p } = await db.from("urturn_push").select("sub,sent_ring").eq("order_id", order_id).maybeSingle();
    if (!p) return out({ ok: true, sent: false, why: "no_sub" });
    const { data: o } = await db.from("urturn_orders").select("num,status,ring_at,shop_id").eq("id", order_id).maybeSingle();
    if (!o || o.status !== "ready" || !o.ring_at) return out({ ok: true, sent: false, why: "not_ready" });
    if (Date.now() - new Date(o.ring_at).getTime() > 120000) return out({ ok: true, sent: false, why: "old" });
    if (p.sent_ring && new Date(p.sent_ring).getTime() === new Date(o.ring_at).getTime()) return out({ ok: true, sent: false, why: "dup" });
    const ok = await send(order_id, p, o, 1);
    return out({ ok, sent: ok });
  } catch (e) {
    return out({ ok: false, err: String(e) }, 500);
  }
});
