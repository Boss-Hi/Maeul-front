import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const authorization = request.headers.get("authorization");
  if (!authorization) {
    return NextResponse.json(
      { message: "로그인이 필요해요." },
      { status: 401 }
    );
  }

  try {
    const base =
      process.env.MAEUL_API_BASE_URL || "https://api.maeul.duckdns.org";
    const response = await fetch(new URL("/api/users/me/profile", base), {
      headers: {
        Accept: "application/json",
        Authorization: authorization
      },
      cache: "no-store",
      signal: AbortSignal.timeout(15000)
    });

    return new NextResponse(await response.text(), {
      status: response.status,
      headers: { "Content-Type": "application/json" }
    });
  } catch {
    return NextResponse.json(
      { message: "프로필 서버에 연결하지 못했어요." },
      { status: 502 }
    );
  }
}
