import { NextResponse } from "next/server";

function isExpiredAccessToken(authorization: string) {
  try {
    const token = authorization.replace(/^Bearer\s+/i, "");
    const payload = token.split(".")[1];
    if (!payload) return false;

    const claims = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    ) as { exp?: unknown };

    return typeof claims.exp === "number" && Date.now() >= claims.exp * 1000;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const authorization = request.headers.get("authorization");
  if (!authorization) {
    return NextResponse.json(
      { message: "로그인이 필요해요." },
      { status: 401 }
    );
  }
  if (isExpiredAccessToken(authorization)) {
    return NextResponse.json(
      { message: "로그인 시간이 만료됐어요. 다시 로그인해 주세요." },
      { status: 401 }
    );
  }

  try {
    const base =
      process.env.MAEUL_API_BASE_URL || "https://api.maeul.duckdns.org";
    const response = await fetch(new URL("/api/surveys", base), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: authorization
      },
      body: JSON.stringify(await request.json()),
      cache: "no-store",
      signal: AbortSignal.timeout(15000)
    });

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    return new NextResponse(await response.text(), {
      status: response.status,
      headers: { "Content-Type": "application/json" }
    });
  } catch {
    return NextResponse.json(
      { message: "취향 정보를 저장할 수 없어요." },
      { status: 502 }
    );
  }
}
