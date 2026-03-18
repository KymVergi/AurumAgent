import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/marketing/hero";
import { HowAurumThinks } from "@/components/marketing/how-aurum-thinks";
import { SignalStack, FeeFlywheelSection } from "@/components/marketing/sections";
import { PublicTerminalPreview } from "@/components/marketing/terminal-preview";
import { TickerTape } from "@/components/shared/ticker";
import { supabaseAdmin } from "@/lib/supabase";
import { mockAgentStatus, mockNewsItems, mockPolymarketSnapshots } from "@/lib/mock-data";

export const revalidate = 60;

async function getLandingData() {
  try {
    const [
      { data: snapshot },
      { data: news },
      { data: polymarket },
    ] = await Promise.all([
      supabaseAdmin
        .from("agent_status_snapshots")
        .select("*")
        .order("snapshot_at", { ascending: false })
        .limit(1)
        .single(),
      supabaseAdmin
        .from("news_items")
        .select("*")
        .order("published_at", { ascending: false })
        .limit(4),
      supabaseAdmin
        .from("polymarket_snapshots")
        .select("*")
        .order("snapshot_at", { ascending: false })
        .limit(3),
    ]);

    return {
      status: snapshot ? {
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
      news: news?.length ? news.map(n => ({
        id: n.id, headline: n.headline, source: n.source,
        url: n.url ?? "#", sentiment: n.sentiment,
        relevanceScore: n.relevance_score, category: n.category,
        summary: n.summary, publishedAt: n.published_at, classifiedAt: n.classified_at,
      })) : mockNewsItems,
      polymarket: polymarket?.length ? polymarket.map(p => ({
        id: p.id, marketId: p.market_id, question: p.question,
        yesOdds: p.yes_odds, noOdds: p.no_odds, volume: p.volume,
        liquidity: p.liquidity, relevanceScore: p.relevance_score,
        macroImplication: p.macro_implication, snapshotAt: p.snapshot_at,
      })) : mockPolymarketSnapshots,
    };
  } catch {
    return {
      status: mockAgentStatus,
      news: mockNewsItems,
      polymarket: mockPolymarketSnapshots,
    };
  }
}

export default async function HomePage() {
  const { status, news, polymarket } = await getLandingData();

  return (
    <main className="min-h-screen bg-aurum-bg">
      <Nav />
      <Hero status={status} />
      <TickerTape />
      <HowAurumThinks />
      <SignalStack />
      <PublicTerminalPreview status={status} news={news} polymarket={polymarket} />
      <FeeFlywheelSection />
      <Footer />
    </main>
  );
}
