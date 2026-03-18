import { NextResponse } from "next/server";
import { fetchMarketNews } from "@/lib/market";
import type { ApiResponse, NewsItem } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = (searchParams.get("category") as "general" | "crypto" | "forex") ?? "general";

  try {
    const news = await fetchMarketNews(category, 10);
    const response: ApiResponse<NewsItem[]> = {
      data: news,
      error: null,
      cached: false,
      generatedAt: new Date().toISOString(),
    };
    return NextResponse.json(response, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    });
  } catch {
    return NextResponse.json(
      { data: null, error: "Failed to fetch news", generatedAt: new Date().toISOString() },
      { status: 500 }
    );
  }
}
