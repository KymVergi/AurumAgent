import { NextRequest, NextResponse } from "next/server";
import { generatePublicThesis } from "@/lib/anthropic";
import { supabaseAdmin } from "@/lib/supabase";
import { mockMarketSignals, mockNewsItems, mockPolymarketSnapshots } from "@/lib/mock-data";

export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get latest status from Supabase if available
    const { data: latestSnapshot } = await supabaseAdmin
      .from("agent_status_snapshots")
      .select("*")
      .order("snapshot_at", { ascending: false })
      .limit(1)
      .single();

    const decision = latestSnapshot?.decision ?? "watch";
    const confidence = latestSnapshot?.confidence ?? 58;

    // Get recent news from Supabase
    const { data: recentNews } = await supabaseAdmin
      .from("news_items")
      .select("*")
      .order("published_at", { ascending: false })
      .limit(8);

    // Get recent polymarket from Supabase
    const { data: recentPM } = await supabaseAdmin
      .from("polymarket_snapshots")
      .select("*")
      .order("snapshot_at", { ascending: false })
      .limit(5);

    const thesis = await generatePublicThesis(
      mockMarketSignals,
      recentNews?.length ? recentNews.map(n => ({
        ...n,
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
      recentPM?.length ? recentPM.map(p => ({
        ...p,
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
      decision,
      confidence,
    );

    // Save thesis to Supabase
    await supabaseAdmin.from("thesis_posts").insert({
      agent_id: "aurum",
      title: thesis.title,
      body: thesis.body,
      support_signals: thesis.supportSignals,
      headlines: thesis.headlines,
      event_odds: thesis.eventOdds,
      confidence: thesis.confidence,
      invalidation_conditions: thesis.invalidationConditions,
      watching: thesis.watching,
    });

    console.log("[AURUM Cron] Thesis saved:", thesis.title);

    return NextResponse.json({ success: true, thesis });

  } catch (err) {
    console.error("[AURUM Cron] Thesis failed:", err);
    return NextResponse.json({ error: "Thesis generation failed", detail: String(err) }, { status: 500 });
  }
}
