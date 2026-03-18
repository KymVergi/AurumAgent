import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { TickerTape } from "@/components/shared/ticker";
import {
  AgentStatusCard,
  MarketOverviewCard,
  ChartAnalysisCard,
  NewsPulseCard,
  PolymarketContextCard,
  CompositeSignalCard,
  DecisionFeedCard,
  TreasuryFeesCard,
  ComputeRunwayCard,
  RecentActionsCard,
} from "@/components/dashboard/cards";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AURUM Terminal",
  description: "Live AURUM agent terminal. Charts, news, prediction markets, and composite signal in real-time.",
};

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-aurum-bg">
      <Nav />

      {/* Header */}
      <div className="pt-20 border-b border-aurum-bg-border/50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-mono tracking-[0.2em] uppercase text-aurum-text-dim mb-2">
                AURUM // Terminal
              </p>
              <h1 className="font-display text-4xl text-aurum-text-primary font-light">
                Intelligence Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm border border-emerald-500/20 bg-emerald-500/5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 text-xs font-mono tracking-widest">LIVE</span>
              </div>
              <p className="text-xs font-mono text-aurum-text-dim">
                Updated {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        </div>
        <TickerTape />
      </div>

      {/* Dashboard grid */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {/* Row 1: Agent status spans 2 cols */}
          <div className="md:col-span-2">
            <AgentStatusCard />
          </div>
          <CompositeSignalCard />

          {/* Row 2 */}
          <MarketOverviewCard />
          <ChartAnalysisCard />
          <NewsPulseCard />

          {/* Row 3 */}
          <PolymarketContextCard />
          <TreasuryFeesCard />
          <ComputeRunwayCard />

          {/* Row 4: Decision feed spans 2 */}
          <div className="md:col-span-2">
            <DecisionFeedCard />
          </div>
          <RecentActionsCard />
        </div>
      </div>

      <Footer />
    </main>
  );
}
