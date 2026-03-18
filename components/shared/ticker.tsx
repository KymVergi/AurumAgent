"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const DEFAULT_ITEMS = [
  { symbol: "BTC/USD", price: 71840, change: +1.24 },
  { symbol: "ETH/USD", price: 3612, change: -0.38 },
  { symbol: "SOL/USD", price: 182.4, change: +2.11 },
  { symbol: "DXY", price: 103.2, change: -0.22 },
  { symbol: "GOLD", price: 2341, change: +0.54 },
  { symbol: "SPX", price: 5480, change: +0.87 },
  { symbol: "10Y", price: 4.28, change: +0.04 },
  { symbol: "BTC DOMINANCE", price: 54.8, change: +0.3 },
];

interface TickerItem {
  symbol: string;
  price: number;
  change: number;
}

async function fetchLivePrices(): Promise<TickerItem[]> {
  try {
    const res = await fetch("/api/ticker", { next: { revalidate: 60 } });
    if (!res.ok) return DEFAULT_ITEMS;
    const data = await res.json();
    return data.items ?? DEFAULT_ITEMS;
  } catch {
    return DEFAULT_ITEMS;
  }
}

export function TickerTape() {
  const [items, setItems] = useState<TickerItem[]>(DEFAULT_ITEMS);

  useEffect(() => {
    fetchLivePrices().then(setItems);
    // Refresh every 60 seconds
    const interval = setInterval(() => {
      fetchLivePrices().then(setItems);
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  const doubled = [...items, ...items];

  return (
    <div className="w-full overflow-hidden border-y border-aurum-bg-border/50 bg-aurum-bg-card/60 py-2">
      <div className="flex animate-ticker whitespace-nowrap" style={{ width: "max-content" }}>
        {doubled.map((item, i) => (
          <div key={i} className="flex items-center gap-3 px-6">
            <span className="text-xs font-mono text-aurum-text-dim tracking-wider">{item.symbol}</span>
            <span className="text-xs font-mono text-aurum-text-secondary">
              {item.symbol === "10Y" ? `${item.price.toFixed(2)}%` : item.price.toFixed(item.price > 100 ? 0 : 2)}
            </span>
            <span className={cn("text-xs font-mono", item.change >= 0 ? "text-emerald-400" : "text-rose-400")}>
              {item.change >= 0 ? "+" : ""}{item.change.toFixed(2)}%
            </span>
            <span className="text-aurum-bg-border">·</span>
          </div>
        ))}
      </div>
    </div>
  );
}
