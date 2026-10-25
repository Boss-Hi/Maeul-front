import { z } from "zod";

const surveyOptionSchema = z.object({
  optionId: z.number().int(),
  label: z.string().min(1)
});

const surveySchema = z.object({
  surveyId: z.number().int(),
  questions: z.array(
    z.object({
      questionId: z.number().int(),
      questionType: z.enum(["SINGLE_CHOICE", "MULTIPLE_CHOICE"]),
      stepBadge: z.string().nullish(),
      stepOrder: z.number().int(),
      title: z.string().min(1),
      subTitle: z.string().nullish(),
      options: z.array(
        surveyOptionSchema.extend({ subLabel: z.string().nullish() })
      )
    })
  )
});

const surveyResponseSchema = z.object({
  success: z.literal(true),
  data: surveySchema
});

export type Survey = z.infer<typeof surveySchema>;

export function parseFirstSurveyResponse(payload: unknown) {
  return surveyResponseSchema.parse(payload).data;
}

export async function getFirstSurvey(signal?: AbortSignal) {
  const response = await fetch("/api/surveys/first", {
    headers: { Accept: "application/json" },
    signal
  });
  if (!response.ok) throw new Error("취향 질문을 불러오지 못했어요.");
  return parseFirstSurveyResponse(await response.json());
}

export async function storeSurvey(
  payload: {
    surveyId: number;
    answers: { questionId: number; selectedOptionIds: number[] }[];
  },
  token: string
) {
  const response = await fetch("/api/surveys", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("로그인 시간이 만료됐어요. 다시 로그인해 주세요.");
    }
    throw new Error(
      "취향 정보를 저장하지 못했어요. 잠시 후 다시 시도해 주세요."
    );
  }
}
