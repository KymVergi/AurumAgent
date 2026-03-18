import { NextRequest, NextResponse } from "next/server";
import { fetchMarketNews } from "@/lib/market";
import { fetchPolymarketMacroMarkets } from "@/lib/polymarket";
import {
  summarizeChartContext,
  classifyNewsBatch,
  scorePolymarketContext,
  buildCompositeSignal,
} from "@/lib/anthropic";
import { supabaseAdmin } from "@/lib/supabase";
import { mockBTCBars } from "@/lib/mock-data";

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
      "BTC/USD", "4H",
      mockBTCBars.slice(-20).map(b => ({ open: b.open, high: b.high, low: b.low, close: b.close })),
      currentPrice
    );

    // 2. Save market signal to Supabase
    await supabaseAdmin.from("market_signals").insert({
      asset: "BTC/USD",
      timeframe: "4H",
      trend: chartSummary.trend,
      structure: chartSummary.structure,
      volatility: 0,
      key_levels: { support: [], resistance: [] },
      summary: chartSummary.keyInsight,
      confidence: chartSummary.confidence,
    });

    // 3. Fetch and classify news
    const news = await fetchMarketNews("general", 8);
    const classified = await classifyNewsBatch(
      news.map(n => ({ id: n.id, headline: n.headline, source: n.source }))
    );

    // 4. Save news to Supabase
    for (const item of news) {
      const cls = classified.find(c => c.id === item.id);
      await supabaseAdmin.from("news_items").insert({
        headline: item.headline,
        source: item.source,
        url: item.url,
        sentiment: cls?.sentiment ?? "neutral",
        relevance_score: cls?.relevanceScore ?? 50,
        category: cls?.category ?? "other",
        summary: item.summary,
        published_at: item.publishedAt,
        classified_at: new Date().toISOString(),
      });
    }

    // 5. Polymarket
    const markets = await fetchPolymarketMacroMarkets(5);
    const pmScores = await scorePolymarketContext(
      markets.map(m => ({ marketId: m.marketId, question: m.question, yesOdds: m.yesOdds, volume: m.volume }))
    );

    // 6. Save polymarket snapshots
    for (const market of markets) {
      const score = pmScores.find(s => s.marketId === market.marketId);
      await supabaseAdmin.from("polymarket_snapshots").insert({
        market_id: market.marketId,
        question: market.question,
        yes_odds: market.yesOdds,
        no_odds: market.noOdds,
        volume: market.volume,
        liquidity: market.liquidity,
        relevance_score: score?.relevanceScore ?? 50,
        macro_implication: score?.macroImplication ?? "",
      });
    }

    // 7. Build composite signal
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

    // 8. Save agent status snapshot
    await supabaseAdmin.from("agent_status_snapshots").insert({
      agent_id: "aurum",
      decision: composite.decision,
      confidence: composite.confidence,
      reasoning: composite.reasoning,
      risk_level: "low",
      composite_score: composite.score,
      chart_signal: chartSummary.signalStrength,
      news_signal: newsSentiment,
      polymarket_signal: pmScores[0]?.signalDirection ?? "neutral",
      treasury_health: 84,
      compute_runway: 312,
    });

    // 9. Save decision log
    await supabaseAdmin.from("decision_logs").insert({
      agent_id: "aurum",
      decision: composite.decision,
      confidence: composite.confidence,
      reasoning: composite.reasoning,
      input_signals: {
        chart: chartSummary.keyInsight,
        news: newsSentiment,
        polymarket: pmScores[0]?.macroImplication ?? "",
        risk: "Budget healthy",
      },
      invalidation_conditions: [],
    });

    console.log("[AURUM Cron] Pipeline complete:", composite.decision, composite.confidence + "%");

    return NextResponse.json({
      success: true,
      decision: composite.decision,
      confidence: composite.confidence,
      score: composite.score,
      generatedAt: composite.generatedAt,
    });

  } catch (err) {
    console.error("[AURUM Cron] Pipeline failed:", err);
    return NextResponse.json({ error: "Pipeline failed", detail: String(err) }, { status: 500 });
  }
}
