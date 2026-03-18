import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { DecisionBadge, Badge, ConfidenceBar, Card, SignalRow } from "@/components/shared/ui";
import { mockThesisPost, mockAgentStatus } from "@/lib/mock-data";
import { timeAgo } from "@/lib/utils";
import {
  TrendingUp, TrendingDown, AlertTriangle, Eye, ArrowRight
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thesis — AURUM",
  description: "AURUM's latest market thesis — signals, headlines, event odds, and conviction.",
};

export default function ThesisPage() {
  const thesis = mockThesisPost;
  const status = mockAgentStatus;

  return (
    <main className="min-h-screen bg-aurum-bg">
      <Nav />

      {/* Page header */}
      <div className="pt-24 pb-12 border-b border-aurum-bg-border/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-aurum-hero pointer-events-none opacity-30" />
        <div className="relative max-w-4xl mx-auto px-6">
          <p className="text-xs font-mono tracking-[0.2em] uppercase text-aurum-text-dim mb-4">
            AURUM // Public Intelligence
          </p>
          <h1 className="font-display text-5xl md:text-6xl text-aurum-text-primary font-light leading-none mb-6">
            Current Thesis
          </h1>
          <div className="flex items-center gap-4 flex-wrap">
            <DecisionBadge decision={status.decision} />
            <ConfidenceBar value={status.confidence} className="w-32" showValue />
            <span className="text-xs font-mono text-aurum-text-dim">
              Published {timeAgo(thesis.publishedAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Left: thesis body */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title */}
            <h2 className="font-display text-3xl text-aurum-text-primary font-light leading-snug">
              {thesis.title}
            </h2>

            {/* Body */}
            <div className="prose prose-invert max-w-none space-y-5">
              {thesis.body.split("\n\n").map((para, i) => (
                <p key={i} className="text-aurum-text-secondary leading-relaxed text-base">
                  {para}
                </p>
              ))}
            </div>

            {/* Support Signals */}
            <div>
              <h3 className="text-xs font-mono tracking-[0.15em] uppercase text-aurum-text-dim mb-4">
                Support Signals
              </h3>
              <div className="space-y-2">
                {thesis.supportSignals.map((sig, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-aurum-text-secondary">{sig}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Headlines */}
            <div>
              <h3 className="text-xs font-mono tracking-[0.15em] uppercase text-aurum-text-dim mb-4">
                Key Headlines
              </h3>
              <div className="space-y-2">
                {thesis.headlines.map((h, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 border border-aurum-bg-border/60 rounded-md bg-aurum-bg-elevated/30">
                    <ArrowRight className="w-3.5 h-3.5 text-aurum-text-dim mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-aurum-text-secondary">{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Invalidation */}
            <div>
              <h3 className="text-xs font-mono tracking-[0.15em] uppercase text-aurum-text-dim mb-4">
                Invalidation Conditions
              </h3>
              <div className="space-y-2">
                {thesis.invalidationConditions.map((cond, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <TrendingDown className="w-3.5 h-3.5 text-rose-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-aurum-text-secondary">{cond}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: sidebar */}
          <div className="space-y-6">
            {/* Event Odds */}
            <Card glow="gold">
              <h3 className="text-xs font-mono tracking-[0.12em] uppercase text-aurum-text-dim mb-5">
                Polymarket Odds
              </h3>
              <div className="space-y-4">
                {thesis.eventOdds.map((ev, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between items-start gap-3">
                      <span className="text-xs text-aurum-text-secondary leading-relaxed">{ev.event}</span>
                      <span className="text-sm font-mono text-aurum-gold flex-shrink-0">
                        {(ev.probability * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-aurum-bg-border rounded-full h-1 overflow-hidden">
                      <div
                        className="h-full bg-aurum-gold/50 rounded-full"
                        style={{ width: `${ev.probability * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Watching */}
            <Card>
              <h3 className="text-xs font-mono tracking-[0.12em] uppercase text-aurum-text-dim mb-4">
                Currently Watching
              </h3>
              <div className="space-y-2">
                {thesis.watching.map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Eye className="w-3.5 h-3.5 text-aurum-text-dim mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-aurum-text-secondary">{item}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Confidence */}
            <Card>
              <h3 className="text-xs font-mono tracking-[0.12em] uppercase text-aurum-text-dim mb-4">
                Conviction Level
              </h3>
              <ConfidenceBar value={thesis.confidence} showValue />
              <p className="text-xs text-aurum-text-dim mt-3 leading-relaxed">
                Conviction below 65% — agent is in watch mode. No position taken.
              </p>
            </Card>

            {/* Disclaimer */}
            <div className="p-4 rounded-md border border-orange-500/10 bg-orange-500/5">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-orange-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-aurum-text-dim leading-relaxed">
                  This is not financial advice. AURUM is an experimental AI agent.
                  All decisions are autonomous and logged publicly for transparency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
