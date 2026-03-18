// ─────────────────────────────────────────────────────────────
// AURUM — Finnhub Webhook Receiver
// Finnhub pushes real-time news and price events here.
// URL to set in Finnhub dashboard: https://tudominio.com/api/webhooks/finnhub
// ─────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";

const FINNHUB_SECRET = process.env.FINNHUB_WEBHOOK_SECRET ?? "";

// Finnhub webhook payload types
interface FinnhubNewsEvent {
  type: "news";
  data: {
    category: string;
    datetime: number;
    headline: string;
    id: number;
    image: string;
    related: string;
    source: string;
    summary: string;
    url: string;
  }[];
}

interface FinnhubPriceEvent {
  type: "price";
  data: {
    p: number;  // price
    s: string;  // symbol
    t: number;  // timestamp
    v: number;  // volume
  }[];
}

type FinnhubEvent = FinnhubNewsEvent | FinnhubPriceEvent;

export async function POST(req: NextRequest) {
  // 1. Verify secret from Finnhub header
  const secret = req.headers.get("X-Finnhub-Secret");
  if (FINNHUB_SECRET && secret !== FINNHUB_SECRET) {
    console.warn("[AURUM Webhook] Invalid Finnhub secret");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Acknowledge immediately (Finnhub requires 2xx fast)
  const body: FinnhubEvent = await req.json();

  // 3. Process async (don't block the response)
  processEvent(body).catch((err) =>
    console.error("[AURUM Webhook] Processing error:", err)
  );

  return NextResponse.json({ ok: true }, { status: 200 });
}

async function processEvent(event: FinnhubEvent) {
  if (event.type === "news") {
    console.log(`[AURUM Webhook] News event — ${event.data.length} items`);

    for (const item of event.data) {
      console.log(`[AURUM Webhook] News: ${item.headline} (${item.source})`);

      // TODO: classify with Anthropic and save to Supabase
      // Example:
      // const classified = await classifyNewsBatch([{
      //   id: String(item.id),
      //   headline: item.headline,
      //   source: item.source,
      // }]);
      // await supabaseAdmin.from("news_items").insert({ ... });
    }
  }

  if (event.type === "price") {
    console.log(`[AURUM Webhook] Price event — ${event.data.length} ticks`);

    for (const tick of event.data) {
      console.log(`[AURUM Webhook] ${tick.s}: $${tick.p}`);

      // TODO: update market signals table in Supabase
      // await supabaseAdmin.from("market_signals").upsert({ ... });
    }
  }
}
