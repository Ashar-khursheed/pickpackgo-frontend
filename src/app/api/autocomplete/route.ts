import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";
  const limit = request.nextUrl.searchParams.get("limit") ?? "7";

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/public/search/autocomplete?q=${encodeURIComponent(q)}&limit=${limit}`,
    );
    const json = await res.json();
    return NextResponse.json(json);
  } catch {
    return NextResponse.json({ success: false, data: [] });
  }
}
