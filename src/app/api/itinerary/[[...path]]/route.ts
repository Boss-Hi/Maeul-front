import { NextRequest, NextResponse } from "next/server";
import {
  itineraryRouteAllowed,
  scheduleInputSchema,
  reorderSchema
} from "@/lib/itinerary-contract";

type Context = { params: Promise<{ path?: string[] }> };

async function proxy(request: NextRequest, context: Context) {
  const { path = [] } = await context.params;
  const allowed = itineraryRouteAllowed(request.method, path);
  if (!allowed)
    return NextResponse.json(
      { message: "요청한 일정이 없어요." },
      { status: 404 }
    );
  const authorization = request.headers.get("authorization");
  if (!authorization)
    return NextResponse.json(
      { message: "로그인이 필요해요." },
      { status: 401 }
    );

  let body: string | undefined;
  if (request.method === "POST" && path[0] === "generate") {
    try {
      const value = await request.json();
      const validDate = (date: unknown) => {
        if (typeof date !== "string" || !/^\d{8}$/.test(date)) return false;
        const iso = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6)}`;
        const parsed = new Date(iso);
        return (
          !Number.isNaN(parsed.getTime()) &&
          parsed.toISOString().slice(0, 10) === iso
        );
      };
      if (
        !Number.isSafeInteger(value.tour_id) ||
        value.tour_id <= 0 ||
        !validDate(value.startDate) ||
        !validDate(value.endDate) ||
        value.startDate > value.endDate
      ) {
        return NextResponse.json(
          { message: "장소와 체류 기간을 확인해 주세요." },
          { status: 400 }
        );
      }
      body = JSON.stringify({
        tour_id: value.tour_id,
        startDate: value.startDate,
        endDate: value.endDate
      });
    } catch {
      return NextResponse.json(
        { message: "일정 요청을 확인해 주세요." },
        { status: 400 }
      );
    }
  }
  if (
    request.method === "PUT" ||
    (request.method === "POST" && path[0] !== "generate")
  ) {
    try {
      const value = await request.json();
      body = JSON.stringify(
        (path.at(-1) === "reorder" ? reorderSchema : scheduleInputSchema).parse(
          value
        )
      );
    } catch {
      return NextResponse.json(
        { message: "일정 입력 내용을 확인해 주세요." },
        { status: 400 }
      );
    }
  }
  try {
    const response = await fetch(
      new URL(
        `/api/itinerary/${path.join("/")}`,
        process.env.MAEUL_API_BASE_URL || "https://api.maeul.duckdns.org"
      ),
      {
        method: request.method,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: authorization
        },
        body,
        cache: "no-store",
        signal: AbortSignal.timeout(request.method === "POST" ? 120000 : 15000)
      }
    );
    return new NextResponse(
      response.status === 204 ? null : await response.text(),
      {
        status: response.status,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch {
    return NextResponse.json(
      {
        message:
          request.method === "POST"
            ? "일정 생성 결과를 확인하지 못했어요. 마이로컬에서 생성 여부를 먼저 확인해 주세요."
            : "일정을 불러오지 못했어요. 잠시 후 다시 시도해 주세요."
      },
      { status: 502 }
    );
  }
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
