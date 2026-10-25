import { NextResponse } from "next/server";

export async function GET() {
  try {
    const base =
      process.env.MAEUL_API_BASE_URL || "https://api.maeul.duckdns.org";
    const response = await fetch(new URL("/api/surveys/first", base), {
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(15000)
    });

    const body = await response.text();
    return new NextResponse(body, {
      status: response.status,
      headers: { "Content-Type": "application/json" }
    });
  } catch {
    return NextResponse.json(
      { message: "취향 질문 서버에 연결하지 못했어요." },
      { status: 502 }
    );
  }
}
