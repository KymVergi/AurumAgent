"use client";

import {
  Activity, BarChart2, Newspaper, Target, Layers,
  Zap, Coins, Cpu, Clock, Shield, TrendingUp, TrendingDown,
  Minus, CheckCircle2, AlertCircle, Info
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Card, CardHeader, DecisionBadge, ConfidenceBar,
  Badge, Stat, SignalRow, LiveDot
} from "@/components/shared/ui";
import { Sparkline, ScoreGauge } from "@/components/shared/charts";
import {
  mockAgentStatus, mockMarketSignals, mockNewsItems,
  mockPolymarketSnapshots, mockDecisionLog, mockCompositeSignal,
  mockTokenMetrics, mockComputeMetrics, mockBTCBars, mockETHBars
} from "@/lib/mock-data";
import {
  formatCurrency, formatNumber, trendColor, timeAgo,
  decisionColor, decisionLabel, riskColor, signalColor
} from "@/lib/utils";

// ─── Agent Status ──────────────────────────────────────────────

export function AgentStatusCard() {
  const status = mockAgentStatus;
  return (
    <Card glow="gold" className="col-span-full md:col-span-2">
      <CardHeader
        title="Agent Status"
        icon={<Activity className="w-4 h-4" />}
        badge={<LiveDot color="emerald" />}
        action={
          <span className="text-xs font-mono text-aurum-text-dim">
            {timeAgo(status.snapshotAt)}
          </span>
        }
      />
      <div className="flex items-start gap-6">
        <div className="flex-1 space-y-4">
          <div>
            <DecisionBadge decision={status.decision} />
          </div>
          <ConfidenceBar value={status.confidence} label="Confidence" showValue />
          <p className="text-sm text-aurum-text-secondary leading-relaxed">
            {status.reasoning}
          </p>
        </div>
        <div className="hidden md:block w-px bg-aurum-bg-border self-stretch" />
        <div className="hidden md:block space-y-3 min-w-[140px]">
          <SignalRow
            label="Risk Level"
            value={status.riskLevel.toUpperCase()}
            color={riskColor(status.riskLevel)}
            mono
          />
          <SignalRow
            label="Composite"
            value={`${status.compositeScore > 0 ? "+" : ""}${status.compositeScore}`}
            color={status.compositeScore > 0 ? "text-emerald-400" : status.compositeScore < 0 ? "text-rose-400" : "text-aurum-text-secondary"}
            mono
          />
          <SignalRow
            label="Treasury"
            value={`${status.treasuryHealth}%`}
            color="text-emerald-400"
            mono
          />
          <SignalRow
            label="Runway"
            value={`${status.computeRunway}d`}
            color="text-aurum-gold"
            mono
          />
        </div>
      </div>
    </Card>
  );
}

// ─── Market Overview ───────────────────────────────────────────

export function MarketOverviewCard() {
  const signals = mockMarketSignals;
  return (
    <Card>
      <CardHeader title="Market Overview" icon={<BarChart2 className="w-4 h-4" />} />
      <div className="space-y-4">
        {signals.map((sig) => {
          const bars = sig.asset.includes("BTC") ? mockBTCBars : mockETHBars;
          const lastBar = bars[bars.length - 1];
          const firstBar = bars[0];
          const pct = ((lastBar.close - firstBar.close) / firstBar.close) * 100;
          return (
            <div key={sig.id} className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-mono text-aurum-text-primary">{sig.asset}</span>
                  <span className={`text-xs font-mono ${trendColor(sig.trend)}`}>
                    {sig.trend.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-aurum-text-dim line-clamp-1">{sig.summary}</p>
              </div>
              <div className="w-20 flex-shrink-0">
                <Sparkline
                  data={bars.slice(-24)}
                  color={sig.trend === "bullish" ? "#34d399" : sig.trend === "bearish" ? "#f43f5e" : "#D4A843"}
                  height={36}
                />
              </div>
              <div className="text-right flex-shrink-0">
                <p className={`text-xs font-mono ${pct >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  {pct >= 0 ? "+" : ""}{pct.toFixed(2)}%
                </p>
                <p className="text-xs font-mono text-aurum-text-dim">{sig.timeframe}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ─── Chart Analysis ────────────────────────────────────────────

export function ChartAnalysisCard() {
  const btc = mockMarketSignals[0];
  return (
    <Card>
      <CardHeader
        title="Chart Analysis"
        icon={<BarChart2 className="w-4 h-4" />}
        badge={<Badge variant="gold">{btc.timeframe}</Badge>}
      />
      <div className="mb-4">
        <Sparkline data={mockBTCBars} color="#D4A843" height={80} showGradient />
      </div>
      <div className="space-y-1">
        <SignalRow label="Asset" value={btc.asset} mono />
        <SignalRow
          label="Trend"
          value={btc.trend.toUpperCase()}
          color={trendColor(btc.trend)}
          mono
        />
        <SignalRow
          label="Signal Strength"
          value={btc.confidence + "%"}
          color={signalColor(btc.structure.includes("Higher") ? "moderate" : "neutral")}
          mono
        />
        <SignalRow
          label="Support"
          value={btc.keyLevels.support.map(l => l.toLocaleString()).join(" / ")}
          mono
        />
        <SignalRow
          label="Resistance"
          value={btc.keyLevels.resistance.map(l => l.toLocaleString()).join(" / ")}
          mono
        />
      </div>
      <p className="mt-4 text-xs text-aurum-text-secondary leading-relaxed border-t border-aurum-bg-border pt-4">
        {btc.structure}
      </p>
    </Card>
  );
}

// ─── News Pulse ────────────────────────────────────────────────

export function NewsPulseCard() {
  const news = mockNewsItems;
  return (
    <Card>
      <CardHeader title="News Pulse" icon={<Newspaper className="w-4 h-4" />} />
      <div className="space-y-3">
        {news.map((item) => {
          const Icon =
            item.sentiment === "bullish" ? TrendingUp
            : item.sentiment === "bearish" ? TrendingDown
            : Minus;
          const color = trendColor(item.sentiment);
          return (
            <div key={item.id} className="flex items-start gap-3 py-2 border-b border-aurum-bg-border/40 last:border-0">
              <Icon className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${color}`} />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-aurum-text-secondary leading-relaxed">
                  {item.headline}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-mono text-aurum-text-dim">{item.source}</span>
                  <span className="text-aurum-text-dim">·</span>
                  <span className="text-xs font-mono text-aurum-text-dim">{timeAgo(item.publishedAt)}</span>
                  <span className={`text-xs font-mono ${color} ml-auto`}>
                    {item.relevanceScore}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ─── Polymarket Context ────────────────────────────────────────

export function PolymarketContextCard() {
  const markets = mockPolymarketSnapshots;
  return (
    <Card glow="gold">
      <CardHeader title="Polymarket Context" icon={<Target className="w-4 h-4" />} />
      <div className="space-y-5">
        {markets.map((m) => (
          <div key={m.id} className="space-y-2">
            <div className="flex justify-between items-start gap-4">
              <p className="text-xs text-aurum-text-secondary leading-relaxed flex-1">
                {m.question}
              </p>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-mono text-aurum-gold">
                  {(m.yesOdds * 100).toFixed(0)}%
                </p>
                <p className="text-xs font-mono text-aurum-text-dim">YES</p>
              </div>
            </div>
            <div className="w-full bg-aurum-bg-border rounded-full h-1 overflow-hidden">
              <div
                className="h-full bg-aurum-gold/60 rounded-full"
                style={{ width: `${m.yesOdds * 100}%` }}
              />
            </div>
            <p className="text-xs text-aurum-text-dim">{m.macroImplication}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── Composite Signal ──────────────────────────────────────────

export function CompositeSignalCard() {
  const sig = mockCompositeSignal;
  return (
    <Card glow="purple">
      <CardHeader title="Composite Signal" icon={<Layers className="w-4 h-4" />} />
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-display font-light text-aurum-text-primary">
              {sig.score > 0 ? "+" : ""}{sig.score}
            </p>
            <p className="text-xs font-mono text-aurum-text-dim mt-1">Composite Score</p>
          </div>
          <DecisionBadge decision={sig.decision} />
        </div>
        <ScoreGauge score={sig.score} size="md" />
        <ConfidenceBar value={sig.confidence} label="Confidence" showValue />
        <div className="pt-3 border-t border-aurum-bg-border space-y-1">
          <SignalRow label="Chart Weight" value={`${(sig.chartWeight * 100).toFixed(0)}%`} mono />
          <SignalRow label="News Weight" value={`${(sig.newsWeight * 100).toFixed(0)}%`} mono />
          <SignalRow label="Polymarket Weight" value={`${(sig.polymarketWeight * 100).toFixed(0)}%`} mono />
          <SignalRow label="Risk Budget" value={`${sig.riskBudget}%`} color="text-emerald-400" mono />
        </div>
        <p className="text-xs text-aurum-text-secondary leading-relaxed pt-2 border-t border-aurum-bg-border">
          {sig.reasoning}
        </p>
      </div>
    </Card>
  );
}

// ─── Decision Feed ─────────────────────────────────────────────

export function DecisionFeedCard() {
  const decisions = mockDecisionLog;
  return (
    <Card className="col-span-full md:col-span-2">
      <CardHeader title="Decision Feed" icon={<Zap className="w-4 h-4" />} />
      <div className="space-y-4">
        {decisions.map((dec) => {
          const isResolved = !!dec.resolvedAt;
          return (
            <div key={dec.id} className="flex gap-4 p-4 rounded-md border border-aurum-bg-border/60 bg-aurum-bg-elevated/40">
              <div className="flex-shrink-0 mt-0.5">
                {isResolved ? (
                  <CheckCircle2 className="w-4 h-4 text-aurum-text-dim" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-aurum-gold" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <DecisionBadge decision={dec.decision} />
                  <span className="text-xs font-mono text-aurum-text-dim">
                    {dec.confidence}% confidence
                  </span>
                  <span className="text-xs font-mono text-aurum-text-dim ml-auto">
                    {timeAgo(dec.createdAt)}
                  </span>
                </div>
                <p className="text-xs text-aurum-text-secondary leading-relaxed mb-2">
                  {dec.reasoning}
                </p>
                {dec.outcome && (
                  <p className="text-xs text-aurum-text-dim bg-aurum-bg-border/30 rounded px-3 py-2 font-mono">
                    Outcome: {dec.outcome}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ─── Treasury & Fees ───────────────────────────────────────────

export function TreasuryFeesCard() {
  const tok = mockTokenMetrics;
  return (
    <Card>
      <CardHeader title="Treasury / Fees" icon={<Coins className="w-4 h-4" />} />
      <div className="grid grid-cols-2 gap-4">
        <Stat label="Treasury" value={formatCurrency(tok.treasuryBalance)} mono large />
        <Stat
          label="Fees 24H"
          value={formatCurrency(tok.feesCollected24h)}
          change="+12.4%"
          changePositive
          mono
        />
        <Stat label="Token Price" value={`$${tok.price.toFixed(5)}`} mono />
        <Stat label="Market Cap" value={formatCurrency(tok.marketCap)} mono />
        <Stat label="Holders" value={formatNumber(tok.holders)} mono />
        <Stat label="Vol 24H" value={formatCurrency(tok.volume24h)} mono />
      </div>
    </Card>
  );
}

// ─── Compute Runway ────────────────────────────────────────────

export function ComputeRunwayCard() {
  const comp = mockComputeMetrics;
  const runwayPct = Math.min((comp.runwayDays / 365) * 100, 100);
  return (
    <Card>
      <CardHeader title="Compute Runway" icon={<Cpu className="w-4 h-4" />} />
      <div className="space-y-4">
        <div>
          <p className="text-3xl font-display font-light text-emerald-400">
            {comp.runwayDays}<span className="text-lg text-aurum-text-dim ml-1 font-body">days</span>
          </p>
          <p className="text-xs font-mono text-aurum-text-dim mt-1">Compute Runway</p>
        </div>
        <ConfidenceBar value={runwayPct} label="Treasury Coverage" showValue />
        <div className="space-y-1 pt-2 border-t border-aurum-bg-border">
          <SignalRow label="Daily Cost" value={`$${comp.dailyCost.toFixed(2)}`} mono />
          <SignalRow label="Total Spent" value={formatCurrency(comp.totalSpent)} mono />
          <SignalRow label="API Calls Today" value={formatNumber(comp.apiCallsToday)} mono />
          <SignalRow label="Tokens Used" value={formatNumber(comp.tokensUsedToday)} mono />
        </div>
      </div>
    </Card>
  );
}

// ─── Recent Actions ────────────────────────────────────────────

export function RecentActionsCard() {
  const actions = [
    { time: "2m ago", action: "Chart ingestion", status: "ok", detail: "BTC/USD 4H analyzed" },
    { time: "5m ago", action: "News classification", status: "ok", detail: "8 items processed" },
    { time: "12m ago", action: "Polymarket fetch", status: "ok", detail: "3 markets updated" },
    { time: "15m ago", action: "Signal synthesis", status: "ok", detail: "Composite: +22, WATCH" },
    { time: "30m ago", action: "Thesis generation", status: "ok", detail: "Published to /thesis" },
    { time: "1h ago", action: "Bankr check", status: "mocked", detail: "Integration pending" },
  ];
  return (
    <Card>
      <CardHeader title="Recent Actions" icon={<Clock className="w-4 h-4" />} />
      <div className="space-y-2">
        {actions.map((a, i) => (
          <div key={i} className="flex items-center gap-3 py-1.5">
            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
              a.status === "ok" ? "bg-emerald-400" : "bg-aurum-text-dim"
            }`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-aurum-text-secondary">{a.action}</span>
                <span className="text-xs font-mono text-aurum-text-dim">{a.time}</span>
              </div>
              <p className="text-xs text-aurum-text-dim">{a.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
