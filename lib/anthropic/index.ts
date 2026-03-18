// ─────────────────────────────────────────────────────────────
// AURUM — Anthropic Intelligence Layer
// All AI-powered helpers live here. Strongly typed, modular.
// ─────────────────────────────────────────────────────────────

import Anthropic from "@anthropic-ai/sdk";
import type {
  AgentDecision,
  CompositeSignal,
  MarketSignal,
  NewsItem,
  PolymarketSnapshot,
  ThesisPost,
} from "@/types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODEL = "claude-sonnet-4-20250514";

// ─── Helper: call Claude with error handling ─────────────────

async function callClaude(
  systemPrompt: string,
  userMessage: string,
  maxTokens = 1024
): Promise<string> {
  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    });

    const content = response.content[0];
    if (content.type !== "text") throw new Error("Unexpected content type");
    return content.text;
  } catch (error) {
    console.error("[AURUM Anthropic]", error);
    throw new Error("AI analysis unavailable — using fallback data");
  }
}

// ─── Helper: parse JSON safely ────────────────────────────────

function safeParseJSON<T>(text: string, fallback: T): T {
  try {
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned) as T;
  } catch {
    return fallback;
  }
}

// ─── summarizeChartContext ────────────────────────────────────

export interface ChartContextSummary {
  trend: "bullish" | "bearish" | "neutral";
  structure: string;
  keyInsight: string;
  riskNote: string;
  confidence: number;
  signalStrength: "strong" | "moderate" | "weak" | "neutral";
}

export async function summarizeChartContext(
  asset: string,
  timeframe: string,
  priceData: { open: number; high: number; low: number; close: number }[],
  currentPrice: number
): Promise<ChartContextSummary> {
  const recent = priceData.slice(-20);
  const highs = recent.map((b) => b.high);
  const lows = recent.map((b) => b.low);
  const closes = recent.map((b) => b.close);

  const systemPrompt = `You are AURUM's chart analysis engine. You analyze market structure with precision.
Your output must be JSON only, with no prose, no markdown fences.
Be direct, analytical, and concise. Do not hedge excessively.`;

  const userMessage = `Analyze ${asset} on the ${timeframe} chart.
Current price: ${currentPrice}
Recent 20-bar highs: ${highs.map((h) => h.toFixed(0)).join(", ")}
Recent 20-bar lows: ${lows.map((l) => l.toFixed(0)).join(", ")}
Recent 20-bar closes: ${closes.map((c) => c.toFixed(0)).join(", ")}

Return JSON: { "trend": "bullish|bearish|neutral", "structure": "...", "keyInsight": "...", "riskNote": "...", "confidence": 0-100, "signalStrength": "strong|moderate|weak|neutral" }`;

  const fallback: ChartContextSummary = {
    trend: "neutral",
    structure: "Analysis unavailable — chart context could not be processed",
    keyInsight: "Insufficient data to form a view",
    riskNote: "Do not trade without updated analysis",
    confidence: 0,
    signalStrength: "neutral",
  };

  try {
    const raw = await callClaude(systemPrompt, userMessage, 512);
    return safeParseJSON(raw, fallback);
  } catch {
    return fallback;
  }
}

// ─── classifyNewsBatch ────────────────────────────────────────

export interface NewsClassification {
  id: string;
  sentiment: "bullish" | "bearish" | "neutral" | "mixed";
  relevanceScore: number;
  category: string;
  macroImplication: string;
}

export async function classifyNewsBatch(
  headlines: { id: string; headline: string; source: string }[]
): Promise<NewsClassification[]> {
  const systemPrompt = `You are AURUM's news classification engine. 
Classify each headline for macro trading relevance and sentiment.
Output must be JSON array only. No prose. No markdown fences.`;

  const userMessage = `Classify these headlines for macro relevance:
${JSON.stringify(headlines)}

Return JSON array: [{ "id": "...", "sentiment": "bullish|bearish|neutral|mixed", "relevanceScore": 0-100, "category": "macro|crypto|regulatory|geopolitical|earnings|other", "macroImplication": "one clear sentence" }]`;

  const fallback: NewsClassification[] = headlines.map((h) => ({
    id: h.id,
    sentiment: "neutral" as const,
    relevanceScore: 50,
    category: "other",
    macroImplication: "Classification unavailable",
  }));

  try {
    const raw = await callClaude(systemPrompt, userMessage, 1024);
    return safeParseJSON(raw, fallback);
  } catch {
    return fallback;
  }
}

// ─── scorePolymarketContext ───────────────────────────────────

export interface PolymarketContextScore {
  marketId: string;
  relevanceScore: number;
  macroImplication: string;
  signalDirection: "bullish" | "bearish" | "neutral";
  weight: number;
}

export async function scorePolymarketContext(
  markets: Pick<PolymarketSnapshot, "marketId" | "question" | "yesOdds" | "volume">[]
): Promise<PolymarketContextScore[]> {
  const systemPrompt = `You are AURUM's Polymarket signal engine.
Evaluate prediction market odds for macro trading relevance.
Output must be JSON array only. No prose. No markdown fences.`;

  const userMessage = `Score these Polymarket questions for macro relevance to BTC/ETH and risk assets:
${JSON.stringify(markets)}

Return JSON: [{ "marketId": "...", "relevanceScore": 0-100, "macroImplication": "...", "signalDirection": "bullish|bearish|neutral", "weight": 0.0-1.0 }]`;

  const fallback: PolymarketContextScore[] = markets.map((m) => ({
    marketId: m.marketId,
    relevanceScore: 50,
    macroImplication: "Scoring unavailable",
    signalDirection: "neutral" as const,
    weight: 0.5,
  }));

  try {
    const raw = await callClaude(systemPrompt, userMessage, 1024);
    return safeParseJSON(raw, fallback);
  } catch {
    return fallback;
  }
}

// ─── buildCompositeSignal ─────────────────────────────────────

interface SignalInputs {
  chartScore: number;
  chartTrend: string;
  newsSentiment: string;
  newsHighlights: string[];
  polymarketContext: string;
  treasuryHealth: number;
  riskBudget: number;
}

export async function buildCompositeSignal(
  inputs: SignalInputs
): Promise<CompositeSignal> {
  const systemPrompt = `You are AURUM's composite decision engine.
You combine chart structure, news sentiment, and Polymarket signals into one trading decision.
Valid decisions: no_trade, watch, long_bias, short_bias, reduce_risk, thesis_update
The decision "no_trade" is always valid and often the correct one.
Do not force trades. Preserve capital above all else.
Output must be JSON only. No prose. No markdown fences.`;

  const userMessage = `Build composite signal from these inputs:
Chart score (bullish/bearish -100 to +100): ${inputs.chartScore}
Chart trend: ${inputs.chartTrend}
News sentiment: ${inputs.newsSentiment}
News highlights: ${inputs.newsHighlights.join("; ")}
Polymarket context: ${inputs.polymarketContext}
Treasury health: ${inputs.treasuryHealth}%
Risk budget remaining: ${inputs.riskBudget}%

Decision thresholds:
- long_bias: composite > +35 with confidence >= 65
- short_bias: composite < -35 with confidence >= 65
- watch: composite between -35 and +35 with some directional lean
- no_trade: confidence < 50 or risk budget < 20 or pre-event
- reduce_risk: deteriorating conditions with open exposure

Return JSON: { "score": -100 to 100, "decision": "...", "confidence": 0-100, "chartWeight": 0-1, "newsWeight": 0-1, "polymarketWeight": 0-1, "riskBudget": ${inputs.riskBudget}, "reasoning": "...", "generatedAt": "${new Date().toISOString()}" }`;

  const fallback: CompositeSignal = {
    score: 0,
    decision: "no_trade",
    confidence: 0,
    chartWeight: 0.35,
    newsWeight: 0.3,
    polymarketWeight: 0.25,
    riskBudget: inputs.riskBudget,
    reasoning: "Composite signal generation unavailable — defaulting to no_trade for capital preservation.",
    generatedAt: new Date().toISOString(),
  };

  try {
    const raw = await callClaude(systemPrompt, userMessage, 1024);
    return safeParseJSON(raw, fallback);
  } catch {
    return fallback;
  }
}

// ─── generatePublicThesis ─────────────────────────────────────

export async function generatePublicThesis(
  signals: MarketSignal[],
  news: NewsItem[],
  polymarkets: PolymarketSnapshot[],
  decision: AgentDecision,
  confidence: number
): Promise<Omit<ThesisPost, "id" | "agentId" | "publishedAt">> {
  const systemPrompt = `You are AURUM — a public macro AI agent. 
You write your thesis in the first-person voice of the agent.
Be analytical, direct, and transparent about uncertainty.
Do not hype. Do not hedge excessively. Say what you actually see.
Output must be JSON only. No prose. No markdown fences.`;

  const userMessage = `Generate a public thesis post based on current signals.
Agent decision: ${decision}
Confidence: ${confidence}%
Market signals: ${JSON.stringify(signals.map((s) => ({ asset: s.asset, trend: s.trend, summary: s.summary })))}
Top news: ${JSON.stringify(news.slice(0, 4).map((n) => ({ headline: n.headline, sentiment: n.sentiment })))}
Polymarket: ${JSON.stringify(polymarkets.map((p) => ({ question: p.question, yes: p.yesOdds })))}

Return JSON: { "title": "...", "body": "3-4 paragraph analysis...", "supportSignals": ["..."], "headlines": ["..."], "eventOdds": [{"event":"...", "probability": 0.0}], "confidence": ${confidence}, "invalidationConditions": ["..."], "watching": ["..."] }`;

  const fallback: Omit<ThesisPost, "id" | "agentId" | "publishedAt"> = {
    title: "Thesis generation temporarily unavailable",
    body: "The agent is processing current signals. Check back shortly.",
    supportSignals: [],
    headlines: [],
    eventOdds: [],
    confidence,
    invalidationConditions: [],
    watching: [],
  };

  try {
    const raw = await callClaude(systemPrompt, userMessage, 2048);
    return safeParseJSON(raw, fallback);
  } catch {
    return fallback;
  }
}
