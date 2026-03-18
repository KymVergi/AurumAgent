"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { DecisionBadge, ConfidenceBar, LiveDot } from "@/components/shared/ui";
import { mockAgentStatus, mockNewsItems, mockPolymarketSnapshots } from "@/lib/mock-data";
import { trendColor, timeAgo } from "@/lib/utils";

export function PublicTerminalPreview() {
  return (
    <section className="py-32 border-t border-aurum-bg-border/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: copy */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:sticky lg:top-32"
          >
            <p className="text-xs font-mono tracking-[0.2em] uppercase text-aurum-text-dim mb-4">
              Public Intelligence
            </p>
            <h2 className="font-display text-5xl text-aurum-text-primary font-light leading-none mb-6">
              Fully public.<br />
              <span className="text-gradient-purple italic">Fully transparent.</span>
            </h2>
            <p className="text-aurum-text-secondary leading-relaxed mb-8">
              Every signal AURUM processes, every decision it makes, every thesis
              it publishes — is available to anyone. The agent has no private feed.
              Public proof is the product.
            </p>
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-3 px-6 py-3 border border-aurum-bg-border text-aurum-text-secondary text-sm font-mono tracking-wide uppercase hover:text-aurum-text-primary hover:border-aurum-text-dim transition-all rounded-sm"
            >
              Open Full Terminal
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </motion.div>

          {/* Right: terminal cards */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            {/* Agent Status Card */}
            <div className="rounded-lg border border-aurum-bg-border bg-aurum-bg-card p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <LiveDot color="emerald" />
                  <span className="text-xs font-mono tracking-[0.12em] uppercase text-aurum-text-dim">
                    Agent Status
                  </span>
                </div>
                <DecisionBadge decision={mockAgentStatus.decision} />
              </div>
              <ConfidenceBar
                value={mockAgentStatus.confidence}
                label="Confidence"
                showValue
              />
              <p className="text-xs text-aurum-text-secondary mt-4 leading-relaxed line-clamp-3">
                {mockAgentStatus.reasoning}
              </p>
            </div>

            {/* News Pulse */}
            <div className="rounded-lg border border-aurum-bg-border bg-aurum-bg-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-mono tracking-[0.12em] uppercase text-aurum-text-dim">
                  News Pulse
                </span>
              </div>
              <div className="space-y-3">
                {mockNewsItems.slice(0, 3).map((item) => {
                  const Icon =
                    item.sentiment === "bullish"
                      ? TrendingUp
                      : item.sentiment === "bearish"
                      ? TrendingDown
                      : Minus;
                  const color = trendColor(item.sentiment);
                  return (
                    <div key={item.id} className="flex items-start gap-3">
                      <Icon className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${color}`} />
                      <div className="min-w-0">
                        <p className="text-xs text-aurum-text-secondary line-clamp-1 leading-relaxed">
                          {item.headline}
                        </p>
                        <p className="text-xs text-aurum-text-dim mt-0.5">
                          {item.source} · {timeAgo(item.publishedAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Polymarket */}
            <div className="rounded-lg border border-aurum-gold/15 bg-aurum-gold/3 p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-mono tracking-[0.12em] uppercase text-aurum-text-dim">
                  Polymarket Signals
                </span>
              </div>
              <div className="space-y-3">
                {mockPolymarketSnapshots.slice(0, 2).map((market) => (
                  <div key={market.id}>
                    <div className="flex justify-between items-start mb-1.5">
                      <p className="text-xs text-aurum-text-secondary leading-relaxed line-clamp-2 flex-1 mr-4">
                        {market.question}
                      </p>
                      <span className="text-xs font-mono text-aurum-gold flex-shrink-0">
                        {(market.yesOdds * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-aurum-bg-border rounded-full h-1 overflow-hidden">
                      <div
                        className="h-full bg-aurum-gold/50 rounded-full"
                        style={{ width: `${market.yesOdds * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
