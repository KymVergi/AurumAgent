"use client";

import { mockTickerItems } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function TickerTape() {
  const items = [...mockTickerItems, ...mockTickerItems]; // duplicate for loop

  return (
    <div className="w-full overflow-hidden border-y border-aurum-bg-border/50 bg-aurum-bg-card/60 py-2">
      <div className="flex animate-ticker whitespace-nowrap" style={{ width: "max-content" }}>
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-3 px-6">
            <span className="text-xs font-mono text-aurum-text-dim tracking-wider">
              {item.symbol}
            </span>
            <span className="text-xs font-mono text-aurum-text-secondary">
              {item.symbol === "10Y" ? `${item.price}%` : item.price.toFixed(item.price > 100 ? 0 : 2)}
            </span>
            <span
              className={cn(
                "text-xs font-mono",
                item.change >= 0 ? "text-emerald-400" : "text-rose-400"
              )}
            >
              {item.change >= 0 ? "+" : ""}
              {item.change}%
            </span>
            <span className="text-aurum-bg-border">·</span>
          </div>
        ))}
      </div>
    </div>
  );
}
