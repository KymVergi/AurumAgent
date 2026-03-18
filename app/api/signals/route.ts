import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { mockAgentStatus, mockCompositeSignal } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Try Supabase first
    const { data: snapshot } = await supabaseAdmin
      .from("agent_status_snapshots")
      .select("*")
      .order("snapshot_at", { ascending: false })
      .limit(1)
      .single();

    const agentStatus = snapshot ? {
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
    } : mockAgentStatus;

    return NextResponse.json({
      data: { agentStatus, compositeSignal: mockCompositeSignal },
      error: null,
      cached: false,
      generatedAt: new Date().toISOString(),
    }, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" },
    });
  } catch {
    return NextResponse.json({
      data: { agentStatus: mockAgentStatus, compositeSignal: mockCompositeSignal },
      error: null,
      cached: true,
      generatedAt: new Date().toISOString(),
    });
  }
}
