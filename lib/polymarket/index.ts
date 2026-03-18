// ─────────────────────────────────────────────────────────────
// AURUM — Polymarket Adapter
// Read-only public endpoint integration.
// ─────────────────────────────────────────────────────────────

import type { PolymarketSnapshot } from "@/types";
import { mockPolymarketSnapshots } from "@/lib/mock-data";

const USE_MOCK = false;

export interface PolymarketMarket {
  id: string;
  question: string;
  outcomes: string[];
  outcomePrices: string[];
  volume: string;
  liquidity: string;
  active: boolean;
  closed: boolean;
}

const MACRO_KEYWORDS = ["Fed", "Bitcoin", "BTC", "CPI", "recession", "rate", "crypto", "inflation", "ETH", "election"];

export async function fetchPolymarketMacroMarkets(
  limit = 10
): Promise<PolymarketSnapshot[]> {
  if (USE_MOCK) return mockPolymarketSnapshots;

  // Try multiple endpoints in order
  const endpoints = [
    `https://gamma-api.polymarket.com/markets?active=true&closed=false&limit=50&_sort=volume&_order=desc`,
    `https://clob.polymarket.com/markets?next_cursor=&limit=50`,
  ];

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        headers: {
          "Accept": "application/json",
          "User-Agent": "AURUM-Agent/1.0",
        },
        next: { revalidate: 300 },
      });

      if (!res.ok) continue;

      const data = await res.json();
      const markets: PolymarketMarket[] = Array.isArray(data) ? data : (data.markets ?? data.data ?? []);

      if (!markets.length) continue;

      // Filter for macro-relevant markets
      const relevant = markets.filter((m) =>
        MACRO_KEYWORDS.some((k) =>
          m.question?.toLowerCase().includes(k.toLowerCase())
        )
      );

      const results = (relevant.length ? relevant : markets).slice(0, limit);

      return results.map((m) => {
        const prices = (m.outcomePrices ?? ["0.5", "0.5"]).map(Number);
        const yesOdds = prices[0] ?? 0.5;
        const noOdds = prices[1] ?? 1 - yesOdds;

        return {
          id: `pm_${m.id}`,
          marketId: m.id,
          question: m.question,
          yesOdds,
          noOdds,
          volume: parseFloat(m.volume ?? "0"),
          liquidity: parseFloat(m.liquidity ?? "0"),
          relevanceScore: 70,
          macroImplication: "Scoring via Anthropic layer",
          snapshotAt: new Date().toISOString(),
        };
      });
    } catch (err) {
      console.error(`[AURUM Polymarket] Endpoint failed: ${url}`, err);
      continue;
    }
  }

  // All endpoints failed — return mock
  console.warn("[AURUM Polymarket] All endpoints failed, using mock data");
  return mockPolymarketSnapshots;
}
