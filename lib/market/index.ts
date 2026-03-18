// ─────────────────────────────────────────────────────────────
// AURUM — Finnhub Adapter (free tier)
// Market data, news, and quote feeds.
// ─────────────────────────────────────────────────────────────

import type { NewsItem, OHLCBar } from "@/types";
import { mockNewsItems, mockBTCBars } from "@/lib/mock-data";

const FINNHUB_BASE = "https://finnhub.io/api/v1";
const API_KEY = process.env.FINNHUB_API_KEY ?? "";
const USE_MOCK = !API_KEY;

// ─── Market News ──────────────────────────────────────────────

export async function fetchMarketNews(
  category: "general" | "crypto" | "forex" = "general",
  limit = 10
): Promise<NewsItem[]> {
  if (USE_MOCK) return mockNewsItems;

  try {
    const res = await fetch(
      `${FINNHUB_BASE}/news?category=${category}&token=${API_KEY}`,
      { next: { revalidate: 300 } }
    );

    if (!res.ok) throw new Error(`Finnhub news error: ${res.status}`);

    const data: Array<{
      id: number;
      headline: string;
      source: string;
      url: string;
      summary: string;
      datetime: number;
      category: string;
    }> = await res.json();

    return data.slice(0, limit).map((item) => ({
      id: `news_${item.id}`,
      headline: item.headline,
      source: item.source,
      url: item.url,
      sentiment: "neutral" as const, // classified by Anthropic
      relevanceScore: 50,
      category: item.category,
      summary: item.summary ?? item.headline,
      publishedAt: new Date(item.datetime * 1000).toISOString(),
      classifiedAt: new Date().toISOString(),
    }));
  } catch (error) {
    console.error("[AURUM Finnhub news]", error);
    return mockNewsItems;
  }
}

// ─── Quote ────────────────────────────────────────────────────

export async function fetchQuote(symbol: string): Promise<{
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  prevClose: number;
} | null> {
  if (USE_MOCK) return null;

  try {
    const res = await fetch(
      `${FINNHUB_BASE}/quote?symbol=${symbol}&token=${API_KEY}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const d = await res.json();
    return {
      price: d.c,
      change: d.d,
      changePercent: d.dp,
      high: d.h,
      low: d.l,
      open: d.o,
      prevClose: d.pc,
    };
  } catch {
    return null;
  }
}

// ─── Crypto Candles ──────────────────────────────────────────

export async function fetchCryptoCandles(
  symbol: string,
  resolution = "60",
  from?: number,
  to?: number
): Promise<OHLCBar[]> {
  if (USE_MOCK) return mockBTCBars;

  const now = to ?? Math.floor(Date.now() / 1000);
  const start = from ?? now - 7 * 24 * 60 * 60;

  try {
    const res = await fetch(
      `${FINNHUB_BASE}/crypto/candle?symbol=${symbol}&resolution=${resolution}&from=${start}&to=${now}&token=${API_KEY}`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return mockBTCBars;

    const d = await res.json();
    if (d.s !== "ok") return mockBTCBars;

    return d.t.map((time: number, i: number) => ({
      time: time * 1000,
      open: d.o[i],
      high: d.h[i],
      low: d.l[i],
      close: d.c[i],
      volume: d.v[i],
    }));
  } catch {
    return mockBTCBars;
  }
}
