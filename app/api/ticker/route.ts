import { NextResponse } from "next/server";

const FINNHUB_KEY = process.env.FINNHUB_API_KEY ?? "";

const SYMBOLS = [
  { symbol: "BTC/USD",       finnhub: "BINANCE:BTCUSDT" },
  { symbol: "ETH/USD",       finnhub: "BINANCE:ETHUSDT" },
  { symbol: "SOL/USD",       finnhub: "BINANCE:SOLUSDT" },
  { symbol: "GOLD",          finnhub: "OANDA:XAUUSD"    },
  { symbol: "SPX",           finnhub: "OANDA:SPX500USD" },
  { symbol: "DXY",           finnhub: "OANDA:US30USD"   },
];

async function fetchQuote(finnhubSymbol: string): Promise<{ price: number; change: number } | null> {
  try {
    const res = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(finnhubSymbol)}&token=${FINNHUB_KEY}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const d = await res.json();
    if (!d.c || d.c === 0) return null;
    const changePercent = d.pc > 0 ? ((d.c - d.pc) / d.pc) * 100 : 0;
    return { price: d.c, change: parseFloat(changePercent.toFixed(2)) };
  } catch {
    return null;
  }
}

// Fallback static data
const FALLBACK = [
  { symbol: "BTC/USD",       price: 71840, change: +1.24 },
  { symbol: "ETH/USD",       price: 3612,  change: -0.38 },
  { symbol: "SOL/USD",       price: 182.4, change: +2.11 },
  { symbol: "DXY",           price: 103.2, change: -0.22 },
  { symbol: "GOLD",          price: 2341,  change: +0.54 },
  { symbol: "SPX",           price: 5480,  change: +0.87 },
  { symbol: "10Y",           price: 4.28,  change: +0.04 },
  { symbol: "BTC DOMINANCE", price: 54.8,  change: +0.3  },
];

export async function GET() {
  if (!FINNHUB_KEY) {
    return NextResponse.json({ items: FALLBACK }, {
      headers: { "Cache-Control": "public, s-maxage=60" },
    });
  }

  try {
    const results = await Promise.all(
      SYMBOLS.map(async ({ symbol, finnhub }) => {
        const quote = await fetchQuote(finnhub);
        if (!quote) {
          const fallback = FALLBACK.find(f => f.symbol === symbol);
          return fallback ?? { symbol, price: 0, change: 0 };
        }
        return { symbol, price: quote.price, change: quote.change };
      })
    );

    // Add 10Y and BTC Dominance as static (Finnhub free tier doesn't cover these well)
    const tenYear = FALLBACK.find(f => f.symbol === "10Y")!;
    const btcDom = FALLBACK.find(f => f.symbol === "BTC DOMINANCE")!;

    return NextResponse.json(
      { items: [...results, tenYear, btcDom] },
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" } }
    );
  } catch {
    return NextResponse.json({ items: FALLBACK }, {
      headers: { "Cache-Control": "public, s-maxage=60" },
    });
  }
}
