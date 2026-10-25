import { z } from "zod";

const profileSchema = z.object({
  userId: z.number().int(),
  email: z.string(),
  nickname: z.string().nullish(),
  name: z.string().nullish(),
  description: z.string().nullish(),
  avatarUrl: z.string().nullish(),
  year: z.number().int().nullish(),
  month: z.number().int().nullish(),
  day: z.number().int().nullish()
});

const profileResponseSchema = z.object({
  success: z.literal(true),
  data: profileSchema
});

export type UserProfile = z.infer<typeof profileSchema>;

export async function getMyProfile(token: string, signal?: AbortSignal) {
  const response = await fetch("/api/users/me/profile", {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    },
    cache: "no-store",
    signal
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("로그인 시간이 만료됐어요. 다시 로그인해 주세요.");
    }
    throw new Error("프로필 정보를 불러오지 못했어요.");
  }

  return profileResponseSchema.parse(await response.json()).data;
}
