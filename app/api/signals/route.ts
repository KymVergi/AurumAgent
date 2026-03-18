import { NextResponse } from "next/server";
import { mockAgentStatus, mockCompositeSignal } from "@/lib/mock-data";
import type { ApiResponse } from "@/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = {
      agentStatus: mockAgentStatus,
      compositeSignal: mockCompositeSignal,
      generatedAt: new Date().toISOString(),
    };

    const response: ApiResponse<typeof data> = {
      data,
      error: null,
      cached: false,
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (err) {
    return NextResponse.json(
      { data: null, error: "Failed to fetch signals", generatedAt: new Date().toISOString() },
      { status: 500 }
    );
  }
}
