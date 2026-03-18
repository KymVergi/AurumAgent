import type { PolymarketSnapshot } from "@/types";
import { mockPolymarketSnapshots } from "@/lib/mock-data";

const USE_MOCK = false;

// Keywords estrictamente macro — elimina crypto memes y deportes
const MACRO_KEYWORDS = [
  "Fed ", "federal reserve", "interest rate", "rate cut", "rate hike",
  "CPI", "inflation", "recession", "GDP", "unemployment",
  "Bitcoin price", "BTC price", "ETH price", "crypto market",
  "dollar index", "treasury", "bond yield", "S&P", "nasdaq",
  "Trump tariff", "election", "war", "geopolit",
];

export async function fetchPolymarketMacroMarkets(limit = 6): Promise<PolymarketSnapshot[]> {
  if (USE_MOCK) return mockPolymarketSnapshots;

  try {
    const res = await fetch(
      "https://gamma-api.polymarket.com/markets?active=true&closed=false&limit=200&_sort=volume&_order=desc",
      {
        headers: { "Accept": "application/json", "User-Agent": "AURUM-Agent/1.0" },
        next: { revalidate: 300 },
      }
    );

    if (!res.ok) throw new Error(`Polymarket API error: ${res.status}`);
    const data = await res.json();
    const markets = Array.isArray(data) ? data : (data.markets ?? data.data ?? []);

    // Filter strictly macro markets with real volume
    const relevant = markets.filter((m: any) =>
      m.active &&
      !m.closed &&
      parseFloat(m.volume ?? "0") > 10000 &&
      MACRO_KEYWORDS.some((k) =>
        m.question?.toLowerCase().includes(k.toLowerCase())
      )
    ).slice(0, limit);

    if (!relevant.length) {
      console.warn("[AURUM Polymarket] No macro markets found, using mock");
      return mockPolymarketSnapshots;
    }

    return relevant.map((m: any) => {
      // Gamma API uses bestBid/bestAsk or outcomes array for prices
      let yesOdds = 0.5;
      let noOdds = 0.5;

      if (m.outcomePrices && Array.isArray(m.outcomePrices)) {
        const prices = m.outcomePrices.map(Number).filter((n: number) => !isNaN(n));
        if (prices.length >= 2) { yesOdds = prices[0]; noOdds = prices[1]; }
      } else if (m.bestBid) {
        yesOdds = parseFloat(m.bestBid);
        noOdds = 1 - yesOdds;
      } else if (m.lastTradePrice) {
        yesOdds = parseFloat(m.lastTradePrice);
        noOdds = 1 - yesOdds;
      }

      const id = m.id ?? m.conditionId ?? Math.random().toString(36).slice(2);

      return {
        id: `pm_${id}`,
        marketId: String(id),
        question: m.question,
        yesOdds: Math.min(Math.max(yesOdds, 0.01), 0.99),
        noOdds: Math.min(Math.max(noOdds, 0.01), 0.99),
        volume: parseFloat(m.volume ?? "0"),
        liquidity: parseFloat(m.liquidity ?? "0"),
        relevanceScore: 75,
        macroImplication: "Scoring via Anthropic layer",
        snapshotAt: new Date().toISOString(),
      };
    });
  } catch (err) {
    console.error("[AURUM Polymarket] Failed:", err);
    return mockPolymarketSnapshots;
  }
}
