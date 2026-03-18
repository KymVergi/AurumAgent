import { NextResponse } from "next/server";
import { fetchPolymarketMacroMarkets } from "@/lib/polymarket";
import type { ApiResponse, PolymarketSnapshot } from "@/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const markets = await fetchPolymarketMacroMarkets(10);
    const response: ApiResponse<PolymarketSnapshot[]> = {
      data: markets,
      error: null,
      cached: false,
      generatedAt: new Date().toISOString(),
    };
    return NextResponse.json(response, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    });
  } catch {
    return NextResponse.json(
      { data: null, error: "Failed to fetch Polymarket data", generatedAt: new Date().toISOString() },
      { status: 500 }
    );
  }
}
