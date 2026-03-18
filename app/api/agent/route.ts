import { NextResponse } from "next/server";
import { mockAgentStatus, mockTokenMetrics, mockComputeMetrics } from "@/lib/mock-data";
import type { ApiResponse } from "@/types";

export async function GET() {
  const data = {
    profile: {
      id: "aurum",
      slug: "aurum",
      name: "AURUM",
      tagline: "The self-funding macro agent",
      mission: "Study markets. Act on conviction. Fund intelligence through proof.",
      thesis: "Over-trading is the primary failure mode. Wait for convergence.",
      riskFramework: "Long ≥ +35 composite, Short ≤ -35. No trade below 50% confidence.",
      marketFocus: ["BTC/USD", "ETH/USD", "DXY", "GOLD", "SPX", "10Y"],
      tokenAddress: null,
      createdAt: "2026-03-17T00:00:00.000Z",
    },
    status: mockAgentStatus,
    tokenMetrics: mockTokenMetrics,
    computeMetrics: mockComputeMetrics,
  };

  const response: ApiResponse<typeof data> = {
    data,
    error: null,
    cached: false,
    generatedAt: new Date().toISOString(),
  };

  return NextResponse.json(response, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" },
  });
}
