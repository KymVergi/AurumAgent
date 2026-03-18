import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import Image from "next/image";
import { DecisionBadge, ConfidenceBar, Badge, SignalRow, Card, Stat } from "@/components/shared/ui";
import { Sparkline } from "@/components/shared/charts";
import { supabaseAdmin } from "@/lib/supabase";
import {
  mockAgentStatus, mockDecisionLog, mockTokenMetrics,
  mockComputeMetrics, mockBTCBars
} from "@/lib/mock-data";
import { formatCurrency, formatNumber, timeAgo } from "@/lib/utils";
import { Twitter, Shield, Target, BarChart2, Coins, Cpu } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AURUM",
  description: "Public profile of AURUM — the self-funding macro intelligence agent.",
};

export const revalidate = 60;

async function getAgentData() {
  try {
    const [
      { data: snapshot },
      { data: decisions },
    ] = await Promise.all([
      supabaseAdmin
        .from("agent_status_snapshots")
        .select("*")
        .order("snapshot_at", { ascending: false })
        .limit(1)
        .single(),
      supabaseAdmin
        .from("decision_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5),
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
      decisions: decisions?.length ? decisions.map(d => ({
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
  } catch {
    return { status: mockAgentStatus, decisions: mockDecisionLog };
  }
}

export default async function AgentProfilePage() {
  const { status, decisions } = await getAgentData();
  const token = mockTokenMetrics;
  const compute = mockComputeMetrics;

  return (
    <main className="min-h-screen bg-aurum-bg">
      <Nav />

      {/* Hero */}
      <div className="pt-24 pb-16 border-b border-aurum-bg-border/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-aurum-hero pointer-events-none opacity-40" />
        <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar */}
            <div className="relative w-20 h-20 flex-shrink-0">
              <Image
                src="/logos/aurum_logo.png"
                alt="AURUM"
                width={80}
                height={80}
                className="rounded-full border-2 border-aurum-gold/30"
                style={{ mixBlendMode: "screen" }}
              />
              <div className="absolute inset-0 rounded-full bg-aurum-gold/10 blur-xl pointer-events-none" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400/20 border border-emerald-400/40 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
            </div>

            {/* Identity */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="font-display text-4xl text-aurum-text-primary font-light tracking-tight">AURUM</h1>
                <Badge variant="gold">Public Agent</Badge>
                <DecisionBadge decision={status.decision} />
              </div>
              <p className="text-lg text-aurum-text-secondary font-body mb-4">The self-funding macro agent</p>
              <p className="text-sm text-aurum-text-secondary max-w-2xl leading-relaxed mb-6">
                AURUM is an autonomous macro intelligence agent that studies chart structure,
                classifies news, reads prediction market odds, and decides whether to act.
                Every analysis, every decision, and every thesis is published publicly.
              </p>
              <a
                href="https://x.com/AurumAgent"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 border border-aurum-bg-border text-aurum-text-secondary text-xs font-mono uppercase tracking-wide hover:border-aurum-text-dim transition-colors rounded-sm"
              >
                <Twitter className="w-3.5 h-3.5" />
                @AurumAgent
              </a>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-4 min-w-[200px]">
              <div className="text-center p-4 rounded-lg border border-aurum-bg-border bg-aurum-bg-card">
                <p className="text-xl font-display text-emerald-400 font-light">{status.computeRunway}d</p>
                <p className="text-xs font-mono text-aurum-text-dim mt-1">Runway</p>
              </div>
              <div className="text-center p-4 rounded-lg border border-aurum-bg-border bg-aurum-bg-card">
                <p className="text-xl font-display text-aurum-gold font-light">{status.confidence}%</p>
                <p className="text-xs font-mono text-aurum-text-dim mt-1">Confidence</p>
              </div>
              <div className="text-center p-4 rounded-lg border border-aurum-bg-border bg-aurum-bg-card">
                <p className="text-xl font-display text-aurum-text-primary font-light">{decisions.length}</p>
                <p className="text-xs font-mono text-aurum-text-dim mt-1">Decisions</p>
              </div>
              <div className="text-center p-4 rounded-lg border border-aurum-bg-border bg-aurum-bg-card">
                <p className="text-xl font-display text-aurum-purple-light font-light">{formatNumber(token.holders)}</p>
                <p className="text-xs font-mono text-aurum-text-dim mt-1">Holders</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left */}
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-4 h-4 text-aurum-text-dim" />
                <h2 className="text-xs font-mono tracking-[0.12em] uppercase text-aurum-text-dim">Mission</h2>
              </div>
              <p className="text-aurum-text-secondary leading-relaxed">
                AURUM exists to demonstrate that an autonomous AI agent can operate as a disciplined
                macro market participant — reading structure, filtering noise, and acting only when
                conviction is earned. The agent&apos;s decisions are public. Its treasury is transparent.
                Its performance is verifiable.
              </p>
            </Card>

            <Card>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-4 h-4 text-aurum-text-dim" />
                <h2 className="text-xs font-mono tracking-[0.12em] uppercase text-aurum-text-dim">Risk Framework</h2>
              </div>
              <div className="space-y-1">
                <SignalRow label="Long Bias Threshold" value="Composite ≥ +35, Confidence ≥ 65%" />
                <SignalRow label="Short Bias Threshold" value="Composite ≤ −35, Confidence ≥ 65%" />
                <SignalRow label="No Trade Trigger" value="Confidence < 50% or Risk Budget < 20%" />
                <SignalRow label="Max Risk Per Decision" value="20% of risk budget" />
                <SignalRow label="Pre-Event Protocol" value="No new positions 4H before major events" />
              </div>
            </Card>

            {/* Decision History */}
            <Card>
              <div className="flex items-center gap-2 mb-5">
                <BarChart2 className="w-4 h-4 text-aurum-text-dim" />
                <h2 className="text-xs font-mono tracking-[0.12em] uppercase text-aurum-text-dim">Decision History</h2>
              </div>
              <div className="space-y-4">
                {decisions.map((dec) => (
                  <div key={dec.id} className="p-4 rounded-md border border-aurum-bg-border/60 bg-aurum-bg-elevated/30">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <DecisionBadge decision={dec.decision} />
                      <span className="text-xs font-mono text-aurum-text-dim">{dec.confidence}% confidence</span>
                      <span className="text-xs font-mono text-aurum-text-dim ml-auto">{timeAgo(dec.createdAt)}</span>
                    </div>
                    <p className="text-xs text-aurum-text-secondary leading-relaxed">{dec.reasoning}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right */}
          <div className="space-y-6">
            <Card>
              <h3 className="text-xs font-mono tracking-[0.12em] uppercase text-aurum-text-dim mb-4">Market Focus</h3>
              <div className="flex flex-wrap gap-2">
                {["BTC/USD", "ETH/USD", "DXY", "GOLD", "SPX", "10Y Yield", "Fed Funds", "CPI"].map((m) => (
                  <Badge key={m} variant="default">{m}</Badge>
                ))}
              </div>
            </Card>

            <Card glow="gold">
              <div className="flex items-center gap-2 mb-4">
                <Coins className="w-4 h-4 text-aurum-gold" />
                <h3 className="text-xs font-mono tracking-[0.12em] uppercase text-aurum-text-dim">Token Panel</h3>
              </div>
              <div className="mb-4">
                <Sparkline data={mockBTCBars.slice(-30)} color="#D4A843" height={48} />
              </div>
              <div className="space-y-1">
                <SignalRow label="Price" value={`$${token.price.toFixed(5)}`} mono />
                <SignalRow label="Market Cap" value={formatCurrency(token.marketCap)} mono />
                <SignalRow label="Holders" value={formatNumber(token.holders)} mono />
                <SignalRow label="Fees 24H" value={formatCurrency(token.feesCollected24h)} mono color="text-aurum-gold" />
                <SignalRow label="Treasury" value={formatCurrency(token.treasuryBalance)} mono color="text-aurum-gold" />
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-2 mb-4">
                <Cpu className="w-4 h-4 text-aurum-text-dim" />
                <h3 className="text-xs font-mono tracking-[0.12em] uppercase text-aurum-text-dim">Compute</h3>
              </div>
              <ConfidenceBar
                value={Math.round(Math.min((status.computeRunway / 365) * 100, 100))}
                label={`${status.computeRunway}d runway`}
                showValue
                className="mb-4"
              />
              <div className="space-y-1">
                <SignalRow label="Daily Cost" value={`$${compute.dailyCost}`} mono />
                <SignalRow label="Total Spent" value={formatCurrency(compute.totalSpent)} mono />
                <SignalRow label="Treasury" value={formatCurrency(compute.treasuryBalance)} mono color="text-emerald-400" />
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
