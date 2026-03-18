// ─────────────────────────────────────────────────────────────
// AURUM — Polymarket Adapter
// Read-only public endpoint integration.
// ─────────────────────────────────────────────────────────────

import type { PolymarketSnapshot } from "@/types";
import { mockPolymarketSnapshots } from "@/lib/mock-data";

const POLYMARKET_BASE = "https://gamma-api.polymarket.com";
const USE_MOCK = process.env.NODE_ENV === "development"; // set to false to use real endpoints

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

// Fetch active markets matching macro keywords
export async function fetchPolymarketMacroMarkets(
  limit = 10
): Promise<PolymarketSnapshot[]> {
  if (USE_MOCK) return mockPolymarketSnapshots;

  try {
    const keywords = ["Fed", "Bitcoin", "CPI", "recession", "rate", "crypto", "inflation"];
    const query = keywords.join("|");

    const res = await fetch(
      `${POLYMARKET_BASE}/markets?active=true&closed=false&limit=${limit}&_sort=volume&_order=desc`,
      { next: { revalidate: 300 } }
    );

    if (!res.ok) throw new Error(`Polymarket API error: ${res.status}`);

    const data: PolymarketMarket[] = await res.json();

    // Filter for macro-relevant markets
    const relevant = data.filter((m) =>
      keywords.some((k) => m.question.toLowerCase().includes(k.toLowerCase()))
    );

    return relevant.map((m) => {
      const prices = m.outcomePrices.map(Number);
      const yesOdds = prices[0] ?? 0.5;
      const noOdds = prices[1] ?? 0.5;

      return {
        id: `pm_${m.id}`,
        marketId: m.id,
        question: m.question,
        yesOdds,
        noOdds,
        volume: parseFloat(m.volume),
        liquidity: parseFloat(m.liquidity),
        relevanceScore: 70, // scored by Anthropic layer
        macroImplication: "Scoring via Anthropic layer",
        snapshotAt: new Date().toISOString(),
      };
    });
  } catch (error) {
    console.error("[AURUM Polymarket]", error);
    return mockPolymarketSnapshots;
  }
}
