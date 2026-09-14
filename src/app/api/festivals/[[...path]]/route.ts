import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path?: string[] }> }
) {
  const { path = [] } = await context.params;
  if (
    path.length &&
    (path.length !== 1 || (path[0] !== "categories" && !/^\d+$/.test(path[0])))
  )
    return NextResponse.json(
      { message: "요청한 API가 없어요." },
      { status: 404 }
    );
  try {
    const base =
      process.env.MAEUL_API_BASE_URL || "https://api.maeul.duckdns.org";
    const url = new URL(
      `/api/festivals${path.length ? `/${path[0]}` : ""}`,
      base
    );
    if (!path.length) {
      for (const key of ["page", "size", "tourCategoryCode"]) {
        const value = request.nextUrl.searchParams.get(key);
        if (value !== null) {
          const valid =
            key === "tourCategoryCode"
              ? /^[A-Z0-9]{2,8}$/.test(value)
              : /^\d+$/.test(value) &&
                Number(value) <= (key === "size" ? 100 : 100000) &&
                (key !== "size" || Number(value) > 0);
          if (!valid)
            return NextResponse.json(
              { message: "조회 조건을 확인해 주세요." },
              { status: 400 }
            );
          url.searchParams.set(key, value);
        }
      }
    }
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(15000)
    });
    if (!response.ok)
      return NextResponse.json(
        { message: "마을 소식을 가져오지 못했어요." },
        { status: response.status >= 500 ? 502 : response.status }
      );
    return NextResponse.json(await response.json());
  } catch {
    return NextResponse.json(
      { message: "서버에 연결하지 못했어요." },
      { status: 502 }
    );
  }
}
