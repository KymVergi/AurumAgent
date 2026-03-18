import { NextRequest, NextResponse } from "next/server";
import { fetchMarketNews } from "@/lib/market";
import { fetchPolymarketMacroMarkets } from "@/lib/polymarket";
import {
  summarizeChartContext,
  classifyNewsBatch,
  scorePolymarketContext,
  buildCompositeSignal,
} from "@/lib/anthropic";
import { mockBTCBars } from "@/lib/mock-data";

// Protected cron endpoint — requires CRON_SECRET header
export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("[AURUM Cron] Starting signal pipeline...");

    // 1. Chart analysis
    const currentPrice = mockBTCBars[mockBTCBars.length - 1].close;
    const chartSummary = await summarizeChartContext(
      "BTC/USD",
      "4H",
      mockBTCBars.slice(-20).map(b => ({ open: b.open, high: b.high, low: b.low, close: b.close })),
      currentPrice
    );
    console.log("[AURUM Cron] Chart analysis complete:", chartSummary.trend);

    // 2. News classification
    const news = await fetchMarketNews("general", 8);
    const classified = await classifyNewsBatch(
      news.map(n => ({ id: n.id, headline: n.headline, source: n.source }))
    );
    console.log("[AURUM Cron] News classified:", classified.length, "items");

    // 3. Polymarket scoring
    const markets = await fetchPolymarketMacroMarkets(5);
    const pmScores = await scorePolymarketContext(
      markets.map(m => ({ marketId: m.marketId, question: m.question, yesOdds: m.yesOdds, volume: m.volume }))
    );
    console.log("[AURUM Cron] Polymarket scored:", pmScores.length, "markets");

    // 4. Composite signal
    const bullishCount = classified.filter(c => c.sentiment === "bullish").length;
    const bearishCount = classified.filter(c => c.sentiment === "bearish").length;
    const newsSentiment = bullishCount > bearishCount ? "bullish" : bearishCount > bullishCount ? "bearish" : "mixed";

    const composite = await buildCompositeSignal({
      chartScore: chartSummary.confidence * (chartSummary.trend === "bullish" ? 1 : chartSummary.trend === "bearish" ? -1 : 0),
      chartTrend: chartSummary.trend,
      newsSentiment,
      newsHighlights: classified.slice(0, 3).map(c => c.macroImplication),
      polymarketContext: pmScores.map(s => s.macroImplication).join("; "),
      treasuryHealth: 84,
      riskBudget: 84,
    });

    console.log("[AURUM Cron] Composite signal:", composite.decision, composite.confidence + "%");

    // TODO: Persist to Supabase agent_status_snapshots and decision_logs

    return NextResponse.json({
      success: true,
      decision: composite.decision,
      confidence: composite.confidence,
      score: composite.score,
      generatedAt: composite.generatedAt,
    });
  } catch (err) {
    console.error("[AURUM Cron] Pipeline failed:", err);
    return NextResponse.json({ error: "Pipeline failed" }, { status: 500 });
  }
}
