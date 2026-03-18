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
import { supabaseAdmin } from "@/lib/supabase";
import {
  mockAgentStatus, mockCompositeSignal, mockMarketSignals,
  mockNewsItems, mockPolymarketSnapshots, mockDecisionLog,
  mockTokenMetrics, mockComputeMetrics,
} from "@/lib/mock-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Live AURUM agent terminal.",
};

export const revalidate = 60; // revalidate every 60s

async function getDashboardData() {
  try {
    const [
      { data: snapshot },
      { data: signals },
      { data: news },
      { data: polymarket },
      { data: decisions },
    ] = await Promise.all([
      supabaseAdmin
        .from("agent_status_snapshots")
        .select("*")
        .order("snapshot_at", { ascending: false })
        .limit(1)
        .single(),
      supabaseAdmin
        .from("market_signals")
        .select("*")
        .order("recorded_at", { ascending: false })
        .limit(3),
      supabaseAdmin
        .from("news_items")
        .select("*")
        .order("published_at", { ascending: false })
        .limit(6),
      supabaseAdmin
        .from("polymarket_snapshots")
        .select("*")
        .order("snapshot_at", { ascending: false })
        .limit(3),
      supabaseAdmin
        .from("decision_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

    return {
      agentStatus: snapshot ? {
        id: snapshot.id,
        agentId: snapshot.agent_id,
        decision: snapshot.decision,
        confidence: snapshot.confidence,
        reasoning: snapshot.reasoning,
        riskLevel: snapshot.risk_level,
        compositeScore: snapshot.composite_score,
        chartSignal: snapshot.chart_signal,
        newsSignal: snapshot.news_signal,
        polymarketSignal: snapshot.polymarket_signal,
        treasuryHealth: snapshot.treasury_health,
        computeRunway: snapshot.compute_runway,
        snapshotAt: snapshot.snapshot_at,
      } : mockAgentStatus,
      marketSignals: signals?.length ? signals.map(s => ({
        id: s.id,
        asset: s.asset,
        timeframe: s.timeframe,
        trend: s.trend,
        structure: s.structure,
        volatility: s.volatility,
        keyLevels: s.key_levels,
        summary: s.summary,
        confidence: s.confidence,
        recordedAt: s.recorded_at,
      })) : mockMarketSignals,
      newsItems: news?.length ? news.map(n => ({
        id: n.id,
        headline: n.headline,
        source: n.source,
        url: n.url ?? "#",
        sentiment: n.sentiment,
        relevanceScore: n.relevance_score,
        category: n.category,
        summary: n.summary,
        publishedAt: n.published_at,
        classifiedAt: n.classified_at,
      })) : mockNewsItems,
      polymarketSnapshots: polymarket?.length ? polymarket.map(p => ({
        id: p.id,
        marketId: p.market_id,
        question: p.question,
        yesOdds: p.yes_odds,
        noOdds: p.no_odds,
        volume: p.volume,
        liquidity: p.liquidity,
        relevanceScore: p.relevance_score,
        macroImplication: p.macro_implication,
        snapshotAt: p.snapshot_at,
      })) : mockPolymarketSnapshots,
      decisionLog: decisions?.length ? decisions.map(d => ({
        id: d.id,
        agentId: d.agent_id,
        decision: d.decision,
        confidence: d.confidence,
        reasoning: d.reasoning,
        inputSignals: d.input_signals,
        invalidationConditions: d.invalidation_conditions,
        resolvedAt: d.resolved_at,
        outcome: d.outcome,
        createdAt: d.created_at,
      })) : mockDecisionLog,
    };
  } catch (err) {
    console.error("[Dashboard] Supabase error, using mock:", err);
    return {
      agentStatus: mockAgentStatus,
      marketSignals: mockMarketSignals,
      newsItems: mockNewsItems,
      polymarketSnapshots: mockPolymarketSnapshots,
      decisionLog: mockDecisionLog,
    };
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData();
  const isLive = data.agentStatus !== mockAgentStatus;

  return (
    <main className="min-h-screen bg-aurum-bg">
      <Nav />

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
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-sm border ${
                isLive
                  ? "border-emerald-500/20 bg-emerald-500/5"
                  : "border-aurum-gold/20 bg-aurum-gold/5"
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                  isLive ? "bg-emerald-400" : "bg-aurum-gold"
                }`} />
                <span className={`text-xs font-mono tracking-widest ${
                  isLive ? "text-emerald-400" : "text-aurum-gold"
                }`}>
                  {isLive ? "LIVE" : "MOCK"}
                </span>
              </div>
              <p className="text-xs font-mono text-aurum-text-dim">
                {new Date(data.agentStatus.snapshotAt).toLocaleTimeString("en-US", {
                  hour: "2-digit", minute: "2-digit"
                })}
              </p>
            </div>
          </div>
        </div>
        <TickerTape />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          <div className="md:col-span-2">
            <AgentStatusCard status={data.agentStatus} />
          </div>
          <CompositeSignalCard status={data.agentStatus} />
          <MarketOverviewCard signals={data.marketSignals} />
          <ChartAnalysisCard signals={data.marketSignals} />
          <NewsPulseCard news={data.newsItems} />
          <PolymarketContextCard markets={data.polymarketSnapshots} />
          <TreasuryFeesCard />
          <ComputeRunwayCard />
          <div className="md:col-span-2">
            <DecisionFeedCard decisions={data.decisionLog} />
          </div>
          <RecentActionsCard />
        </div>
      </div>

      <Footer />
    </main>
  );
}
