import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const authorization = request.headers.get("authorization");
  const { id } = await context.params;
  if (!authorization) {
    return NextResponse.json(
      { message: "로그인이 필요해요." },
      { status: 401 }
    );
  }
  if (!/^\d+$/.test(id)) {
    return NextResponse.json(
      { message: "설문 응답을 확인해 주세요." },
      { status: 400 }
    );
  }

  try {
    const base =
      process.env.MAEUL_API_BASE_URL || "https://api.maeul.duckdns.org";
    const response = await fetch(
      new URL(`/api/surveys/responses/${id}`, base),
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: authorization
        },
        body: JSON.stringify(await request.json()),
        cache: "no-store",
        signal: AbortSignal.timeout(15000)
      }
    );

    return new NextResponse(await response.text(), {
      status: response.status,
      headers: { "Content-Type": "application/json" }
    });
  } catch {
    return NextResponse.json(
      { message: "취향 정보를 수정하지 못했어요." },
      { status: 502 }
    );
  }
}
