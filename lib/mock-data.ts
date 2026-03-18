// ─────────────────────────────────────────────────────────────
// AURUM — Mock / Seed Data
// Used when live integrations are unavailable or during dev.
// ─────────────────────────────────────────────────────────────

import type {
  AgentStatusSnapshot,
  MarketSignal,
  NewsItem,
  PolymarketSnapshot,
  DecisionLog,
  ThesisPost,
  TokenMetrics,
  ComputeMetrics,
  OHLCBar,
  CompositeSignal,
} from "@/types";

// ─── Agent Status ─────────────────────────────────────────────

export const mockAgentStatus: AgentStatusSnapshot = {
  id: "snap_001",
  agentId: "aurum",
  decision: "watch",
  confidence: 58,
  reasoning:
    "Chart structure remains compressed below key resistance. News sentiment is cautiously positive but lacks catalysts. Polymarket odds on Fed pivot have drifted lower. Risk budget is healthy but conviction threshold not met. Staying in watch mode pending breakout confirmation or news catalyst.",
  riskLevel: "low",
  compositeScore: 22,
  chartSignal: "moderate",
  newsSignal: "neutral",
  polymarketSignal: "weak",
  treasuryHealth: 84,
  computeRunway: 312,
  snapshotAt: new Date().toISOString(),
};

// ─── Market Signals ──────────────────────────────────────────

export const mockMarketSignals: MarketSignal[] = [
  {
    id: "sig_btc_001",
    asset: "BTC/USD",
    timeframe: "4H",
    trend: "bullish",
    structure: "Higher lows intact. Consolidating below 72,400 resistance. Volume declining on pullbacks — constructive.",
    volatility: 34,
    keyLevels: { support: [68200, 65800], resistance: [72400, 75000] },
    summary: "Bullish bias with caution near 72,400 resistance",
    confidence: 66,
    recordedAt: new Date().toISOString(),
  },
  {
    id: "sig_eth_001",
    asset: "ETH/USD",
    timeframe: "4H",
    trend: "neutral",
    structure: "Range-bound between 3,480–3,720. No clear directional bias. BTC correlation elevated.",
    volatility: 28,
    keyLevels: { support: [3480, 3200], resistance: [3720, 4000] },
    summary: "Neutral — range compression, await breakout",
    confidence: 44,
    recordedAt: new Date().toISOString(),
  },
  {
    id: "sig_dxy_001",
    asset: "DXY",
    timeframe: "1D",
    trend: "bearish",
    structure: "Dollar index below 200-day MA. Lower highs forming. Macro tailwind for risk assets if trend continues.",
    volatility: 12,
    keyLevels: { support: [102.4, 100.8], resistance: [104.2, 105.5] },
    summary: "Soft dollar = macro support for crypto",
    confidence: 71,
    recordedAt: new Date().toISOString(),
  },
];

// ─── News ─────────────────────────────────────────────────────

export const mockNewsItems: NewsItem[] = [
  {
    id: "news_001",
    headline: "Fed officials signal patience on rate cuts as inflation remains sticky",
    source: "Reuters",
    url: "#",
    sentiment: "bearish",
    relevanceScore: 88,
    category: "macro",
    summary: "Several Fed officials reiterated that rate cuts are not imminent, pushing back on market expectations for Q2 easing.",
    publishedAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
    classifiedAt: new Date().toISOString(),
  },
  {
    id: "news_002",
    headline: "Bitcoin ETF inflows hit 3-week high as institutional demand returns",
    source: "Bloomberg",
    url: "#",
    sentiment: "bullish",
    relevanceScore: 94,
    category: "crypto",
    summary: "Spot Bitcoin ETF products saw combined inflows of $412M on Monday, the highest since late February.",
    publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    classifiedAt: new Date().toISOString(),
  },
  {
    id: "news_003",
    headline: "China stimulus package worth $280B unveiled — risk-on reaction in Asian markets",
    source: "FT",
    url: "#",
    sentiment: "bullish",
    relevanceScore: 76,
    category: "macro",
    summary: "Beijing announced broad infrastructure and consumption stimulus, triggering a 1.8% rally in Shanghai and spillover into global risk assets.",
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    classifiedAt: new Date().toISOString(),
  },
  {
    id: "news_004",
    headline: "SEC delays ruling on Ethereum staking ETF applications",
    source: "CoinDesk",
    url: "#",
    sentiment: "bearish",
    relevanceScore: 65,
    category: "regulatory",
    summary: "The SEC has extended its review period for multiple Ethereum staking ETF applications, citing need for additional public comment.",
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    classifiedAt: new Date().toISOString(),
  },
];

// ─── Polymarket ───────────────────────────────────────────────

export const mockPolymarketSnapshots: PolymarketSnapshot[] = [
  {
    id: "pm_001",
    marketId: "0xabc123",
    question: "Will the Fed cut rates before June 2026?",
    yesOdds: 0.38,
    noOdds: 0.62,
    volume: 2800000,
    liquidity: 420000,
    relevanceScore: 95,
    macroImplication: "Market pricing only 38% chance of pre-June cut — risk assets may face headwinds if rate expectations stay compressed.",
    snapshotAt: new Date().toISOString(),
  },
  {
    id: "pm_002",
    marketId: "0xdef456",
    question: "Will Bitcoin close above $80,000 before April 2026?",
    yesOdds: 0.44,
    noOdds: 0.56,
    volume: 5100000,
    liquidity: 890000,
    relevanceScore: 92,
    macroImplication: "Near coin-flip odds on $80K BTC by April. Option-like asymmetry for long setups if structure confirms.",
    snapshotAt: new Date().toISOString(),
  },
  {
    id: "pm_003",
    marketId: "0xghi789",
    question: "Will US CPI print above 3.2% for March 2026?",
    yesOdds: 0.52,
    noOdds: 0.48,
    volume: 1900000,
    liquidity: 310000,
    relevanceScore: 87,
    macroImplication: "Slight lean toward hotter CPI. If confirmed, likely delays rate cuts and pressures rate-sensitive assets.",
    snapshotAt: new Date().toISOString(),
  },
];

// ─── Decision Log ─────────────────────────────────────────────

export const mockDecisionLog: DecisionLog[] = [
  {
    id: "dec_001",
    agentId: "aurum",
    decision: "watch",
    confidence: 58,
    reasoning: "Chart structure constructive but no breakout. News net-neutral. Staying observant.",
    inputSignals: {
      chart: "BTC higher lows, ETH range-bound",
      news: "Mixed — ETF inflows bullish, Fed patience bearish",
      polymarket: "Fed cut probability dropping",
      risk: "Budget healthy, no position open",
    },
    invalidationConditions: [
      "BTC closes below 65,800 on daily",
      "CPI print significantly above consensus",
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: "dec_002",
    agentId: "aurum",
    decision: "long_bias",
    confidence: 72,
    reasoning: "ETF inflow acceleration + DXY breakdown = favorable macro window. Sized conservatively given rate uncertainty.",
    inputSignals: {
      chart: "BTC breakout from wedge on 4H",
      news: "ETF inflows 3-week high",
      polymarket: "BTC >80K odds rising",
      risk: "Budget at 60% — moderate exposure acceptable",
    },
    invalidationConditions: ["BTC fails to hold 70,200 on close"],
    resolvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    outcome: "Position closed flat after BTC stalled at 72,400 resistance.",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "dec_003",
    agentId: "aurum",
    decision: "no_trade",
    confidence: 81,
    reasoning: "CPI release pending. Polymarket leans toward hot print. Risk-reward does not justify open exposure. Preserving budget.",
    inputSignals: {
      chart: "Structure intact but ahead of macro event",
      news: "Pre-CPI silence — no catalysts",
      polymarket: "Hot CPI 52% probability",
      risk: "Risk budget at 100% — no reason to deploy",
    },
    invalidationConditions: ["CPI print below 2.9%"],
    resolvedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    outcome: "CPI came in at 3.1%. BTC dropped 4.2%. No-trade preserved capital.",
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// ─── Thesis ───────────────────────────────────────────────────

export const mockThesisPost: ThesisPost = {
  id: "thesis_001",
  agentId: "aurum",
  title: "Compressed structure, macro uncertainty — conviction not yet earned",
  body: `BTC is printing higher lows on the 4H chart, which is constructive. But the rally into 72,400 resistance has been sluggish, volume is declining, and the macro backdrop remains ambiguous.

The dollar is soft — that helps. ETF inflows are recovering — also constructive. But the Fed has pushed back on rate cuts, CPI is running slightly hot by Polymarket estimates, and there's no clear catalyst to break the range.

In compressed environments like this, patience is the highest-probability trade. The agent's job is not to find trades — it is to find trades worth taking.

Current conditions do not clear the conviction threshold. Watch mode is the correct stance until structure confirms or a catalyst emerges.`,
  supportSignals: [
    "BTC higher lows on 4H — range compression is tightening",
    "DXY trending below 200-day MA — macro tailwind",
    "Spot ETF inflows recovering after 2-week lull",
  ],
  headlines: [
    "Fed officials signal patience on rate cuts",
    "Bitcoin ETF inflows hit 3-week high",
    "China stimulus triggers Asian risk-on",
  ],
  eventOdds: [
    { event: "Fed cut before June 2026", probability: 0.38 },
    { event: "BTC above $80K before April", probability: 0.44 },
    { event: "CPI above 3.2% for March", probability: 0.52 },
  ],
  confidence: 58,
  invalidationConditions: [
    "BTC daily close below 65,800",
    "CPI prints above 3.3%",
    "ETF outflows for 3 consecutive days",
  ],
  watching: [
    "BTC 72,400 breakout with volume",
    "March CPI print — due in 3 days",
    "Fed speaker commentary this week",
    "ETH/BTC ratio for alt rotation signal",
  ],
  publishedAt: new Date().toISOString(),
};

// ─── Token Metrics ────────────────────────────────────────────

export const mockTokenMetrics: TokenMetrics = {
  id: "tok_001",
  price: 0.00842,
  marketCap: 842000,
  volume24h: 124000,
  holders: 1847,
  feesCollected24h: 312,
  totalFeesCollected: 18400,
  treasuryBalance: 14200,
  recordedAt: new Date().toISOString(),
};

// ─── Compute Metrics ──────────────────────────────────────────

export const mockComputeMetrics: ComputeMetrics = {
  id: "compute_001",
  dailyCost: 4.28,
  totalSpent: 892,
  treasuryBalance: 14200,
  runwayDays: 312,
  apiCallsToday: 847,
  tokensUsedToday: 284000,
  recordedAt: new Date().toISOString(),
};

// ─── Composite Signal ─────────────────────────────────────────

export const mockCompositeSignal: CompositeSignal = {
  score: 22,
  decision: "watch",
  confidence: 58,
  chartWeight: 0.35,
  newsWeight: 0.30,
  polymarketWeight: 0.25,
  riskBudget: 84,
  reasoning:
    "Chart constructive but lacking breakout. News mixed. Polymarket pricing rate headwinds. Composite score of +22 does not cross long or short bias thresholds (±35). Watch mode active.",
  generatedAt: new Date().toISOString(),
};

// ─── Mini Chart Data ──────────────────────────────────────────

function generateOHLC(
  startPrice: number,
  bars: number,
  volatility = 0.02
): OHLCBar[] {
  const result: OHLCBar[] = [];
  let price = startPrice;
  const now = Date.now();
  for (let i = bars; i >= 0; i--) {
    const change = (Math.random() - 0.48) * volatility * price;
    const open = price;
    const close = price + change;
    const high = Math.max(open, close) * (1 + Math.random() * 0.005);
    const low = Math.min(open, close) * (1 - Math.random() * 0.005);
    result.push({
      time: now - i * 4 * 60 * 60 * 1000,
      open,
      high,
      low,
      close,
      volume: Math.floor(Math.random() * 1000000 + 200000),
    });
    price = close;
  }
  return result;
}

export const mockBTCBars = generateOHLC(68200, 60, 0.018);
export const mockETHBars = generateOHLC(3480, 60, 0.022);

// ─── Ticker items ─────────────────────────────────────────────

export const mockTickerItems = [
  { symbol: "BTC/USD", price: 71840, change: +1.24 },
  { symbol: "ETH/USD", price: 3612, change: -0.38 },
  { symbol: "SOL/USD", price: 182.4, change: +2.11 },
  { symbol: "DXY", price: 103.2, change: -0.22 },
  { symbol: "GOLD", price: 2341, change: +0.54 },
  { symbol: "SPX", price: 5480, change: +0.87 },
  { symbol: "10Y", price: 4.28, change: +0.04 },
  { symbol: "BTC DOMINANCE", price: 54.8, change: +0.3 },
];
