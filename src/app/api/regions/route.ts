import { NextResponse } from "next/server";

export async function GET() {
  try {
    const base =
      process.env.MAEUL_API_BASE_URL || "https://api.maeul.duckdns.org";
    const response = await fetch(new URL("/api/regions", base), {
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(15000)
    });

    if (!response.ok)
      return NextResponse.json(
        { message: "지역 목록을 가져오지 못했어요." },
        { status: response.status >= 500 ? 502 : response.status }
      );

    return NextResponse.json(await response.json());
  } catch {
    return NextResponse.json(
      { message: "지역 서버에 연결하지 못했어요." },
      { status: 502 }
    );
  }
}
