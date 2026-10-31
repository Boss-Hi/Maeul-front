import { z } from "zod";
import { rememberItinerary } from "@/lib/itinerary-history";
import {
  ACCESS_TOKEN_STORAGE_KEY,
  isAccessTokenExpired
} from "@/lib/auth/session";

import {
  itinerarySchema,
  daySchema,
  scheduleSchema,
  scheduleInputSchema,
  reorderSchema,
  type ScheduleInput
} from "@/lib/itinerary-contract";
export type {
  Itinerary,
  ItineraryDay,
  Schedule,
  ScheduleInput
} from "@/lib/itinerary-contract";
export class ItineraryError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
  }
}

async function request(
  path: string,
  options: RequestInit = {}
): Promise<unknown> {
  const token = sessionStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  if (!token || isAccessTokenExpired(token))
    throw new ItineraryError("로그인 후 일정을 확인할 수 있어요.", 401);
  const response = await fetch(`/api/itinerary/${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    cache: "no-store"
  });
  if (path === "current" && response.status === 400) {
    const error = await response
      .clone()
      .json()
      .catch(() => null);
    if (
      typeof error?.message === "string" &&
      error.message.startsWith("일정을 찾을 수 없습니다")
    )
      return null;
  }
  if (!response.ok)
    throw new ItineraryError(
      response.status === 401
        ? "로그인 시간이 만료됐어요. 다시 로그인해 주세요."
        : options.method === "PUT"
          ? "변경 내용을 저장하지 못했어요. 다시 조회한 후 시도해 주세요."
          : options.method === "POST"
            ? "일정 생성 결과를 확인하지 못했어요. 마이로컬에서 생성 여부를 확인해 주세요."
            : "일정을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.",
      response.status
    );
  if (response.status === 204) return null;
  const text = await response.text();
  if (!text) return null;
  const payload = JSON.parse(text);
  if (payload.success === false)
    throw new ItineraryError("일정 요청을 처리하지 못했어요.", 502);
  return payload.data ?? null;
}

export async function generateItinerary(payload: {
  tour_id: number;
  startDate: string;
  endDate: string;
}) {
  const id = z
    .number()
    .int()
    .positive()
    .parse(
      await request("generate", {
        method: "POST",
        body: JSON.stringify(payload)
      })
    );
  rememberItinerary(id);
  return id;
}
export async function getCurrentItinerary(signal?: AbortSignal) {
  const data = itinerarySchema
    .nullable()
    .parse(await request("current", { signal }));
  if (data) rememberItinerary(data.id);
  return data;
}
export async function getItinerary(id: number, signal?: AbortSignal) {
  if (!Number.isSafeInteger(id) || id <= 0)
    throw new Error("일정 번호를 확인해 주세요.");
  const data = itinerarySchema.parse(await request(String(id), { signal }));
  rememberItinerary(data.id);
  return data;
}

function dayPath(itineraryId: number, dayId: number) {
  if (![itineraryId, dayId].every((id) => Number.isSafeInteger(id) && id > 0))
    throw new Error("일정 번호를 확인해 주세요.");
  return `${itineraryId}/days/${dayId}`;
}
export async function getItineraryDay(
  itineraryId: number,
  dayId: number,
  signal?: AbortSignal
) {
  return daySchema.parse(
    await request(dayPath(itineraryId, dayId), { signal })
  );
}
export async function getSchedule(
  itineraryId: number,
  dayId: number,
  id: number,
  signal?: AbortSignal
) {
  if (!Number.isSafeInteger(id) || id <= 0)
    throw new Error("상세 일정 번호를 확인해 주세요.");
  return scheduleSchema.parse(
    await request(`${dayPath(itineraryId, dayId)}/schedules/${id}`, { signal })
  );
}
export async function saveSchedule(
  itineraryId: number,
  dayId: number,
  input: ScheduleInput,
  id?: number
) {
  if (id !== undefined && (!Number.isSafeInteger(id) || id <= 0))
    throw new Error("상세 일정 번호를 확인해 주세요.");
  const payload = scheduleInputSchema.parse(input);
  return request(
    `${dayPath(itineraryId, dayId)}/schedules${id === undefined ? "" : `/${id}`}`,
    {
      method: id === undefined ? "POST" : "PUT",
      body: JSON.stringify(payload)
    }
  );
}
export async function reorderSchedules(
  itineraryId: number,
  dayId: number,
  ids: number[]
) {
  const payload = reorderSchema.parse({
    schedules: ids.map((id, index) => ({ id, sequence: index + 1 }))
  });
  return request(`${dayPath(itineraryId, dayId)}/schedules/reorder`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}
