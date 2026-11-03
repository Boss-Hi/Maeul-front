import { z } from "zod";
import { apiFetch as fetch } from "./api-fetch";

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

const surveyAnswerSchema = z.object({
  id: z.number().int().positive().optional(),
  questionId: z.number().int(),
  optionId: z.number().int()
});

const currentSurveyResponseSchema = z.object({
  success: z.literal(true),
  data: z
    .object({
      id: z.number().int(),
      answers: z.array(surveyAnswerSchema)
    })
    .nullable()
});

export type Survey = z.infer<typeof surveySchema>;
export type SurveyResponse = z.infer<
  typeof currentSurveyResponseSchema
>["data"];

export function hasSavedSurveyAnswers(response: SurveyResponse): boolean {
  return Boolean(response && response.answers.length > 0);
}

export function parseFirstSurveyResponse(payload: unknown) {
  return surveyResponseSchema.parse(payload).data;
}

export async function getFirstSurvey(signal?: AbortSignal) {
  const response = await fetch("/api/surveys/first", {
    headers: { Accept: "application/json" },
    signal
  });
  if (response.status === 400) return null;
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

export async function getCurrentSurveyResponse(
  token: string,
  signal?: AbortSignal
): Promise<SurveyResponse> {
  const response = await fetch("/api/surveys/responses/current", {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    },
    cache: "no-store",
    signal
  });

  // Current-survey lookup uses 400 for users without a saved response.
  if (response.status === 400 || response.status === 404) return null;
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("로그인 시간이 만료됐어요. 다시 로그인해 주세요.");
    }
    throw new Error("저장된 취향 정보를 불러오지 못했어요.");
  }

  return currentSurveyResponseSchema.parse(await response.json()).data;
}

export function toSurveyUpdateAnswers(
  current: NonNullable<SurveyResponse>,
  answers: { questionId: number; selectedOptionIds: number[] }[]
) {
  const used = new Set<number>();
  return answers.flatMap(({ questionId, selectedOptionIds }) => {
    const saved = current.answers.filter((answer) => answer.questionId === questionId);
    // Keep unchanged options attached to their existing records before reusing changed records.
    const remaining = saved.filter((answer) => !selectedOptionIds.includes(answer.optionId));
    return selectedOptionIds.map((optionId) => {
      const answer = saved.find((item) => item.optionId === optionId) ?? remaining.shift();
      if (!answer?.id || used.has(answer.id)) {
        throw new Error("최신 설문을 조회했지만 선택한 항목에 연결할 답변 ID가 없어요. 새 답변 추가 방식 확인이 필요해요.");
      }
      used.add(answer.id);
      return { id: answer.id, optionId };
    });
  });
}

export async function updateSurveyResponse(
  current: NonNullable<SurveyResponse>,
  payload: {
    surveyId: number;
    answers: { questionId: number; selectedOptionIds: number[] }[];
  },
  token: string
) {
  const latest = await getCurrentSurveyResponse(token);
  if (!latest || latest.id !== current.id) {
    throw new Error("저장된 설문이 변경됐어요. 수정 화면을 다시 열어 주세요.");
  }
  const responseId = latest.id;
  const answers = toSurveyUpdateAnswers(latest, payload.answers);
  const response = await fetch(`/api/surveys/responses/${responseId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    // The update endpoint has a different contract from the create endpoint.
    body: JSON.stringify({
      surveyResponseId: responseId,
      answers
    })
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("로그인 시간이 만료됐어요. 다시 로그인해 주세요.");
    }
    throw new Error(
      "취향 정보를 수정하지 못했어요. 잠시 후 다시 시도해 주세요."
    );
  }
  const saved = await getCurrentSurveyResponse(token);
  const expected = payload.answers.flatMap(({ questionId, selectedOptionIds }) =>
    selectedOptionIds.map((optionId) => `${questionId}:${optionId}`)
  ).sort();
  const actual = saved?.answers.map(({ questionId, optionId }) => `${questionId}:${optionId}`).sort();
  if (saved?.id !== responseId || JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error("수정 요청 후 조회한 답변이 선택 내용과 달라요. 마이페이지에서 저장된 취향을 확인해 주세요.");
  }
}
