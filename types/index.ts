// ─────────────────────────────────────────────────────────────
// AURUM — Core Type Definitions
// ─────────────────────────────────────────────────────────────

export type AgentDecision =
  | "no_trade"
  | "watch"
  | "long_bias"
  | "short_bias"
  | "reduce_risk"
  | "thesis_update";

export type SignalStrength = "strong" | "moderate" | "weak" | "neutral";
export type RiskLevel = "low" | "medium" | "high" | "critical";
export type TrendDirection = "bullish" | "bearish" | "neutral" | "mixed";

export interface AgentProfile {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  mission: string;
  thesis: string;
  riskFramework: string;
  marketFocus: string[];
  tokenAddress?: string;
  createdAt: string;
}

export interface AgentStatusSnapshot {
  id: string;
  agentId: string;
  decision: AgentDecision;
  confidence: number; // 0–100
  reasoning: string;
  riskLevel: RiskLevel;
  compositeScore: number; // -100 to 100
  chartSignal: SignalStrength;
  newsSignal: TrendDirection;
  polymarketSignal: SignalStrength;
  treasuryHealth: number; // 0–100
  computeRunway: number; // days
  snapshotAt: string;
}

export interface MarketSignal {
  id: string;
  asset: string;
  timeframe: string;
  trend: TrendDirection;
  structure: string;
  volatility: number;
  keyLevels: { support: number[]; resistance: number[] };
  summary: string;
  confidence: number;
  recordedAt: string;
}

export interface NewsItem {
  id: string;
  headline: string;
  source: string;
  url: string;
  sentiment: TrendDirection;
  relevanceScore: number; // 0–100
  category: string;
  summary: string;
  publishedAt: string;
  classifiedAt: string;
}

export interface PolymarketSnapshot {
  id: string;
  marketId: string;
  question: string;
  yesOdds: number;
  noOdds: number;
  volume: number;
  liquidity: number;
  relevanceScore: number;
  macroImplication: string;
  snapshotAt: string;
}

export interface DecisionLog {
  id: string;
  agentId: string;
  decision: AgentDecision;
  confidence: number;
  reasoning: string;
  inputSignals: {
    chart: string;
    news: string;
    polymarket: string;
    risk: string;
  };
  invalidationConditions: string[];
  resolvedAt?: string;
  outcome?: string;
  createdAt: string;
}

export interface ThesisPost {
  id: string;
  agentId: string;
  title: string;
  body: string;
  supportSignals: string[];
  headlines: string[];
  eventOdds: { event: string; probability: number }[];
  confidence: number;
  invalidationConditions: string[];
  watching: string[];
  publishedAt: string;
}

export interface TokenMetrics {
  id: string;
  price: number;
  marketCap: number;
  volume24h: number;
  holders: number;
  feesCollected24h: number;
  totalFeesCollected: number;
  treasuryBalance: number;
  recordedAt: string;
}

export interface ComputeMetrics {
  id: string;
  dailyCost: number;
  totalSpent: number;
  treasuryBalance: number;
  runwayDays: number;
  apiCallsToday: number;
  tokensUsedToday: number;
  recordedAt: string;
}

// ─── Chart data ───────────────────────────────────────────────

export interface OHLCBar {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

// ─── Composite signal ────────────────────────────────────────

export interface CompositeSignal {
  score: number; // -100 to 100
  decision: AgentDecision;
  confidence: number;
  chartWeight: number;
  newsWeight: number;
  polymarketWeight: number;
  riskBudget: number;
  reasoning: string;
  generatedAt: string;
}

// ─── API response shapes ─────────────────────────────────────

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  cached?: boolean;
  generatedAt: string;
}
