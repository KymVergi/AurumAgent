import { NextResponse } from "next/server";
import { mockThesisPost } from "@/lib/mock-data";
import type { ApiResponse, ThesisPost } from "@/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const response: ApiResponse<ThesisPost> = {
    data: mockThesisPost,
    error: null,
    cached: false,
    generatedAt: new Date().toISOString(),
  };
  return NextResponse.json(response, {
    headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200" },
  });
}
