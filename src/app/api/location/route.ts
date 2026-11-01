import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const lat = params.get("latitude");
  const lon = params.get("longitude");
  const latitude = Number(lat);
  const longitude = Number(lon);
  if (
    !lat?.trim() ||
    !lon?.trim() ||
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    Math.abs(latitude) > 90 ||
    Math.abs(longitude) > 180
  ) {
    return NextResponse.json(
      { message: "유효한 좌표가 필요해요." },
      { status: 400 }
    );
  }
  try {
    const url = new URL(
      "/api/location",
      process.env.MAEUL_API_BASE_URL || "https://api.maeul.duckdns.org"
    );
    url.search = new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude)
    }).toString();
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(15000)
    });
    if (!response.ok)
      return NextResponse.json(
        { message: "주소를 조회하지 못했어요." },
        { status: response.status }
      );
    return NextResponse.json(await response.json(), {
      headers: { "Cache-Control": "no-store" }
    });
  } catch {
    return NextResponse.json(
      { message: "주소 서버에 연결하지 못했어요." },
      { status: 502 }
    );
  }
}
