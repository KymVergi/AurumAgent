import { NextRequest, NextResponse } from "next/server";
import { generatePublicThesis } from "@/lib/anthropic";
import { mockMarketSignals, mockNewsItems, mockPolymarketSnapshots, mockAgentStatus } from "@/lib/mock-data";

export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const thesis = await generatePublicThesis(
      mockMarketSignals,
      mockNewsItems,
      mockPolymarketSnapshots,
      mockAgentStatus.decision,
      mockAgentStatus.confidence
    );

    console.log("[AURUM Cron] Thesis generated:", thesis.title);

    // TODO: Persist to Supabase thesis_posts

    return NextResponse.json({ success: true, thesis });
  } catch (err) {
    console.error("[AURUM Cron] Thesis generation failed:", err);
    return NextResponse.json({ error: "Thesis generation failed" }, { status: 500 });
  }
}
