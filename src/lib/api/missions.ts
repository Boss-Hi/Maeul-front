import { z } from "zod";
import {
  ACCESS_TOKEN_STORAGE_KEY,
  isAccessTokenExpired
} from "@/lib/auth/session";

export const currentMissionSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  description: z.string().nullable(),
  startDate: z.string(),
  endDate: z.string(),
  completedCount: z.number().int().nonnegative(),
  totalCount: z.number().int().nonnegative(),
  percentage: z.number().min(0).max(100),
  neighborhoodCount: z.number().int().nonnegative(),
  missionTasks: z.array(
    z.object({
      id: z.number().int().positive(),
      name: z.string(),
      description: z.string().nullable(),
      isComplete: z.boolean()
    })
  )
});
export type CurrentMission = z.infer<typeof currentMissionSchema>;
export class MissionError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
  }
}
export async function getCurrentMission(
  signal?: AbortSignal
): Promise<CurrentMission | null> {
  const token = sessionStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  if (!token || isAccessTokenExpired(token))
    throw new MissionError("다시 로그인해 주세요.", 401);
  const response = await fetch("/api/missions/current", {
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    cache: "no-store",
    signal
  });
  if (!response.ok)
    throw new MissionError(
      response.status === 401
        ? "로그인 시간이 만료됐어요. 다시 로그인해 주세요."
        : "미션을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.",
      response.status
    );
  if (response.status === 204) return null;
  const result = z
    .object({ success: z.literal(true), data: currentMissionSchema.nullable() })
    .safeParse(await response.json());
  if (!result.success)
    throw new MissionError(
      "미션 응답을 확인하지 못했어요. 다시 시도해 주세요.",
      502
    );
  return result.data.data;
}
