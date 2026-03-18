import type { PolymarketSnapshot } from "@/types";
import { mockPolymarketSnapshots } from "@/lib/mock-data";

const USE_MOCK = false;
const MACRO_KEYWORDS = ["Fed", "Bitcoin", "BTC", "CPI", "rate", "inflation", "ETH", "crypto", "recession", "dollar"];

export async function fetchPolymarketMacroMarkets(limit = 10): Promise<PolymarketSnapshot[]> {
  if (USE_MOCK) return mockPolymarketSnapshots;

  try {
    // Gamma API — best for active markets sorted by volume
    const res = await fetch(
      "https://gamma-api.polymarket.com/markets?active=true&closed=false&limit=100&_sort=volume&_order=desc",
      {
        headers: { "Accept": "application/json", "User-Agent": "AURUM-Agent/1.0" },
        next: { revalidate: 300 },
      }
    );

    if (!res.ok) throw new Error(`Polymarket API error: ${res.status}`);

    const data = await res.json();
    const markets = Array.isArray(data) ? data : (data.markets ?? data.data ?? []);

    // Filter for macro-relevant active markets with real volume
    const relevant = markets
      .filter((m: any) =>
        m.active &&
        !m.closed &&
        parseFloat(m.volume ?? "0") > 1000 &&
        MACRO_KEYWORDS.some((k) => m.question?.toLowerCase().includes(k.toLowerCase()))
      )
      .slice(0, limit);

    if (!relevant.length) {
      console.warn("[AURUM Polymarket] No relevant markets found, using mock");
      return mockPolymarketSnapshots;
    }

    return relevant.map((m: any) => {
      const prices = Array.isArray(m.outcomePrices)
        ? m.outcomePrices.map(Number)
        : [0.5, 0.5];
      const yesOdds = prices[0] ?? 0.5;
      const noOdds = prices[1] ?? (1 - yesOdds);
      const id = m.id ?? m.marketId ?? m.conditionId ?? Math.random().toString(36).slice(2);

      return {
        id: `pm_${id}`,
        marketId: String(id),
        question: m.question,
        yesOdds: Math.min(Math.max(yesOdds, 0), 1),
        noOdds: Math.min(Math.max(noOdds, 0), 1),
        volume: parseFloat(m.volume ?? "0"),
        liquidity: parseFloat(m.liquidity ?? "0"),
        relevanceScore: 70,
        macroImplication: "Scoring via Anthropic layer",
        snapshotAt: new Date().toISOString(),
      };
    });
  } catch (err) {
    console.error("[AURUM Polymarket] Failed:", err);
    return mockPolymarketSnapshots;
  }
}
