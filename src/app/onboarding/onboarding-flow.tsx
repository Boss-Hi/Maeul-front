"use client";

import {
  ArrowLeft,
  BookOpen,
  Leaf,
  Music,
  Sun,
  Waves,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronRight,
  Coffee,
  Compass,
  Flower2,
  Heart,
  Home,
  MapPinned,
  Palette,
  Sparkles,
  Sprout,
  Sunrise,
  Trees,
  UserRound,
  Utensils
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { TasteProfile } from "./taste-profile";
import { MaeulLogo } from "@/components/maeul-logo";
import {
  ACCESS_TOKEN_STORAGE_KEY,
  getOnboardingCompletionKey,
  isAccessTokenExpired
} from "@/lib/auth/session";
import { getFirstSurvey, storeSurvey, type Survey } from "@/lib/api/surveys";

type StepId = "age" | "job" | "purpose" | "theme" | "stay" | "food" | "pace";

type Option = {
  label: string;
  desc?: string;
  Icon?: LucideIcon;
};

type OnboardingStep = {
  id: StepId;
  questionId: number;
  kicker: string;
  Icon: LucideIcon;
  title: string;
  subtitle: string;
  multi?: boolean;
  options: Option[];
};

const steps: OnboardingStep[] = [
  {
    id: "age",
    questionId: 1,
    kicker: "첫 인사",
    Icon: Leaf,
    title: "반가워요!\n생일을 알려줄래요?",
    subtitle:
      "태어난 날짜로 나이대를 알아볼게요. 나이대를 따로 고르지 않아도 돼요.",
    options: []
  },
  {
    id: "job",
    questionId: 2,
    kicker: "일상의 한 조각",
    Icon: BriefcaseBusiness,
    title: "여행 가방 옆에,\n어떤 일상이 있나요?",
    subtitle:
      "요즘 하고 있는 일을 알려주세요. 당신의 일상에 어울리는 쉼을 찾아볼게요.",
    options: [
      {
        label: "직장인",
        desc: "퇴근 후 일정과 주말 체류에 잘 맞아요.",
        Icon: BriefcaseBusiness
      },
      {
        label: "프리랜서",
        desc: "작업 공간과 여유로운 동선을 함께 봐요.",
        Icon: Coffee
      },
      {
        label: "학생",
        desc: "가성비와 활동성 높은 미션을 우선해요.",
        Icon: UserRound
      },
      {
        label: "창업/자영업",
        desc: "로컬 네트워킹과 영감 스팟을 섞어봐요.",
        Icon: Sparkles
      }
    ]
  },
  {
    id: "purpose",
    questionId: 3,
    kicker: "떠나는 이유",
    Icon: Heart,
    title: "이번 여행에는\n어떤 마음을 담을까요?",
    subtitle:
      "푹 쉬어도, 새로운 걸 해봐도 좋아요. 지금 가장 끌리는 하나를 골라주세요.",
    options: [
      {
        label: "쉼과 회복",
        desc: "느린 산책, 좋은 숙소, 조용한 카페 중심",
        Icon: Heart
      },
      {
        label: "일과 여행",
        desc: "코워킹, 콘센트 카페, 저녁 로컬 행사 중심",
        Icon: BriefcaseBusiness
      },
      {
        label: "새로운 경험",
        desc: "공방, 공연, 액티비티, 동네 미션 중심",
        Icon: Palette
      },
      {
        label: "사람 만나기",
        desc: "팀 미션과 취향이 맞는 체류자 추천 중심",
        Icon: UserRound
      }
    ]
  },
  {
    id: "theme",
    questionId: 4,
    kicker: "마음이 가는 곳",
    Icon: Sparkles,
    title: "낯선 골목에서,\n어디에 눈길이 가나요?",
    subtitle: "좋아하는 것들을 주머니에 쏙. 마음이 가는 만큼 담아주세요.",
    multi: true,
    options: [
      { label: "커피", Icon: Coffee },
      { label: "독서", Icon: BookOpen },
      { label: "음악/공연", Icon: Music },
      { label: "로컬 맛집", Icon: Utensils },
      { label: "바다/자연", Icon: Waves },
      { label: "공방 체험", Icon: Palette },
      { label: "역사 산책", Icon: MapPinned },
      { label: "웰니스", Icon: Leaf }
    ]
  },
  {
    id: "stay",
    questionId: 5,
    kicker: "하룻밤의 취향",
    Icon: Home,
    title: "하루 끝, 어디에서\n쉬고 싶나요?",
    subtitle: "여행지에서의 작은 집. 가장 편안하게 느껴지는 곳을 골라주세요.",
    options: [
      {
        label: "코리빙",
        desc: "라운지, 커뮤니티, 워케이션 분위기",
        Icon: Home
      },
      {
        label: "펜션/민박",
        desc: "지역감 있는 조용한 체류",
        Icon: MapPinned
      },
      {
        label: "호텔",
        desc: "편의성과 안정적인 컨디션",
        Icon: CalendarDays
      },
      {
        label: "게스트하우스",
        desc: "가볍게 머물고 사람 만나기",
        Icon: UserRound
      }
    ]
  },
  {
    id: "food",
    questionId: 6,
    kicker: "맛있는 순간",
    Icon: Coffee,
    title: "맛있는 냄새를 따라\n어디로 가볼까요?",
    subtitle:
      "든든한 한 끼부터 느긋한 커피까지. 좋아하는 맛을 모두 담아주세요.",
    multi: true,
    options: [
      { label: "한식", Icon: Utensils },
      { label: "로컬 노포", Icon: Utensils },
      { label: "카페/찻집", Icon: Coffee },
      { label: "시장 음식", Icon: MapPinned },
      { label: "가벼운 브런치", Icon: Coffee },
      { label: "술집/펍", Icon: Sparkles }
    ]
  },
  {
    id: "pace",
    questionId: 7,
    kicker: "나만의 보폭",
    Icon: Sun,
    title: "이 마을을 걷는\n당신의 속도는?",
    subtitle:
      "이제 마지막 한 걸음이에요. 당신에게 편안한 하루의 리듬을 골라주세요.",
    options: [
      {
        label: "느긋하게",
        desc: "하루 2-3곳, 머무는 시간이 긴 일정"
      },
      {
        label: "적당히 알차게",
        desc: "하루 4-5곳, 미션과 쉼의 균형"
      },
      {
        label: "촘촘하게",
        desc: "하루 6곳 이상, 짧고 다양한 탐색"
      }
    ]
  }
];

const initialAnswers = steps.reduce(
  (acc, step) => ({ ...acc, [step.id]: [] }),
  {} as Record<StepId, string[]>
);

const ageIcons: Record<string, LucideIcon> = {
  "10대": Sprout,
  "20대": Sunrise,
  "30대": Compass,
  "40대": Trees,
  "50대": Coffee,
  "60대": Flower2
};

function toSurveyAnswers(survey: Survey, answers: Record<StepId, string[]>) {
  return [...survey.questions]
    .sort((first, second) => first.stepOrder - second.stepOrder)
    .flatMap((question) => {
      const step = steps.find(
        (item) => item.questionId === question.questionId
      );
      if (!step) return [];

      const selectedOptionIds = answers[step.id]
        .map(
          (label) =>
            question.options.find((option) => option.label === label)?.optionId
        )
        .filter((optionId): optionId is number => optionId !== undefined);

      if (selectedOptionIds.length !== answers[step.id].length) {
        throw new Error("선택한 취향 정보를 다시 확인해 주세요.");
      }

      return [{ questionId: question.questionId, selectedOptionIds }];
    });
}

function getConfiguredSteps(survey: Survey) {
  return [...survey.questions]
    .sort((first, second) => first.stepOrder - second.stepOrder)
    .flatMap((question) => {
      const presentation = steps.find(
        (step) => step.questionId === question.questionId
      );
      if (!presentation) return [];

      return [
        {
          ...presentation,
          kicker: question.stepBadge ?? presentation.kicker,
          title: question.title,
          subtitle: question.subTitle ?? presentation.subtitle,
          multi: question.questionType === "MULTIPLE_CHOICE",
          options: question.options.map((option) => ({
            label: option.label,
            desc: option.subLabel ?? undefined,
            Icon:
              presentation.options.find((item) => item.label === option.label)
                ?.Icon ?? presentation.Icon
          }))
        }
      ];
    });
}

export function OnboardingFlow({
  initialSurvey
}: Readonly<{ initialSurvey: Survey | null }>) {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [survey, setSurvey] = useState<Survey | null>(initialSurvey);
  const [surveyLoadError, setSurveyLoadError] = useState("");
  const [surveyRequest, setSurveyRequest] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [authExpired, setAuthExpired] = useState(false);
  const [answers, setAnswers] = useState(initialAnswers);

  useEffect(() => {
    window.history.replaceState(
      { ...window.history.state, maeulOnboardingStep: 0 },
      ""
    );

    function restoreStep(event: PopStateEvent) {
      if (window.location.pathname !== "/onboarding") return;

      const index: unknown = event.state?.maeulOnboardingStep;
      setStepIndex(
        typeof index === "number" &&
          Number.isInteger(index) &&
          index >= 0 &&
          index <= steps.length
          ? index
          : 0
      );
    }

    window.addEventListener("popstate", restoreStep);
    return () => window.removeEventListener("popstate", restoreStep);
  }, []);

  useEffect(() => {
    if (survey) return;

    let cancelled = false;
    const timerId = window.setTimeout(() => {
      void getFirstSurvey()
        .then((nextSurvey) => {
          if (cancelled) return;
          setSurvey(nextSurvey);
          setSurveyLoadError("");
        })
        .catch(() => {
          if (cancelled) return;
          setSurveyLoadError(
            "취향 질문을 준비하지 못했어요. 다시 시도해 주세요."
          );
        });
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timerId);
    };
  }, [survey, surveyRequest]);

  useEffect(() => {
    const token = sessionStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
    const completionKey = token ? getOnboardingCompletionKey(token) : null;
    if (completionKey && localStorage.getItem(completionKey) === "true") {
      router.replace("/home");
    }
  }, [router]);

  const configuredSteps = survey ? getConfiguredSteps(survey) : [];
  const isComplete = stepIndex >= configuredSteps.length;
  const currentStep =
    configuredSteps[Math.min(stepIndex, configuredSteps.length - 1)];

  if (!survey || !currentStep) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-[#e7eae7] px-5 text-[#16211a]">
        <section className="w-full max-w-[420px] rounded-[28px] border border-[#d3e5d8] bg-white p-7 text-center shadow-[0_8px_28px_rgba(52,78,34,0.04)]">
          <span className="mx-auto flex size-14 items-center justify-center rounded-[20px] bg-[#eaf6ee] text-[#1E7F3C]">
            <Leaf size={26} />
          </span>
          <h1 className="mt-4 text-[21px] font-black text-[#12592C]">
            {surveyLoadError
              ? "취향 질문을 준비하지 못했어요"
              : "취향 지도를 준비하고 있어요"}
          </h1>
          <p className="mt-2 text-[13px] leading-relaxed text-[#72877a]">
            {surveyLoadError || "마을에 맞는 질문을 불러오는 중이에요."}
          </p>
          {surveyLoadError && (
            <button
              type="button"
              onClick={() => setSurveyRequest((value) => value + 1)}
              className="mt-6 min-h-[50px] w-full rounded-[16px] bg-[#12592C] text-[14px] font-bold text-white"
            >
              다시 시도하기
            </button>
          )}
        </section>
      </main>
    );
  }

  const StepIcon = currentStep.Icon;
  const selected = answers[currentStep.id];

  const canGoNext = isComplete || selected.length > 0;

  function toggleOption(option: string) {
    setAnswers((prev) => {
      const values = prev[currentStep.id];
      const nextValues = currentStep.multi
        ? values.includes(option)
          ? values.filter((value) => value !== option)
          : [...values, option]
        : [option];

      return { ...prev, [currentStep.id]: nextValues };
    });
  }

  async function goNext() {
    if (!canGoNext || isComplete || isSaving) return;

    if (stepIndex === configuredSteps.length - 1) {
      const token = sessionStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
      if (!token) {
        setSaveError("로그인 정보를 찾지 못했어요. 다시 로그인해 주세요.");
        return;
      }
      if (isAccessTokenExpired(token)) {
        sessionStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
        setAuthExpired(true);
        setSaveError("로그인 시간이 만료됐어요. 다시 로그인해 주세요.");
        return;
      }
      if (!survey) {
        setSaveError(
          "취향 질문을 불러오는 중이에요. 잠시 후 다시 시도해 주세요."
        );
        return;
      }

      setIsSaving(true);
      setSaveError("");
      try {
        await storeSurvey(
          {
            surveyId: survey.surveyId,
            answers: toSurveyAnswers(survey, answers)
          },
          token
        );
        const completionKey = getOnboardingCompletionKey(token);
        if (completionKey) localStorage.setItem(completionKey, "true");
        const nextIndex = configuredSteps.length;
        window.history.pushState(
          { ...window.history.state, maeulOnboardingStep: nextIndex },
          ""
        );
        setStepIndex(nextIndex);
      } catch (error) {
        setSaveError(
          error instanceof Error
            ? error.message
            : "취향 정보를 저장하지 못했어요."
        );
      } finally {
        setIsSaving(false);
      }
      return;
    }

    const nextIndex = stepIndex + 1;
    window.history.pushState(
      { ...window.history.state, maeulOnboardingStep: nextIndex },
      ""
    );
    setStepIndex(nextIndex);
  }

  function goBack() {
    if (stepIndex === 0) return;
    window.history.back();
  }

  return (
    <main className="h-dvh overflow-hidden bg-[#e7eae7] text-[#16211a]">
      <div className="mx-auto flex h-dvh w-full max-w-[600px] flex-col overflow-hidden bg-[#F5F8F6] shadow-[0_0_38px_rgba(20,34,25,0.08)]">
        <header className="shrink-0 px-5 pt-4 pb-3">
          <div className="flex items-center justify-between gap-3">
            {stepIndex > 0 ? (
              <button
                aria-label="이전 단계"
                onClick={goBack}
                className="flex size-9 items-center justify-center rounded-full border border-[#dce7df] bg-white/70 text-[#12592C]"
              >
                <ArrowLeft size={18} />
              </button>
            ) : (
              <Link
                href="/"
                aria-label="시작 화면으로 돌아가기"
                className="flex size-9 items-center justify-center rounded-full border border-[#dce7df] bg-white/70 text-[#12592C]"
              >
                <ArrowLeft size={18} />
              </Link>
            )}
            <span className="flex items-center gap-1.5 text-sm font-black tracking-[0.12em] text-[#12592C]">
              <MaeulLogo size={24} className="rounded-[9px]" /> MAEUL
            </span>
            <span className="text-[11px] font-semibold text-[#52685a]">
              취향 산책
            </span>
          </div>
          <div
            className="mt-5 flex items-center gap-1.5"
            aria-label={`취향 산책 ${Math.min(stepIndex + 1, configuredSteps.length)} / ${configuredSteps.length} 단계`}
          >
            {configuredSteps.map((step, index) => (
              <div
                key={step.id}
                aria-current={
                  !isComplete && index === stepIndex ? "step" : undefined
                }
                className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${index < stepIndex ? "bg-[#12592C]" : index === stepIndex ? "bg-[#1E7F3C]" : "bg-[#dce8df]"}`}
              />
            ))}
          </div>
        </header>

        {isComplete ? (
          <TasteProfile answers={answers} survey={survey} />
        ) : (
          <section className="flex min-h-0 flex-1 flex-col">
            <div
              key={currentStep.id}
              className="min-h-0 flex-1 overflow-y-auto px-5 pt-4 pb-5"
            >
              <div className="motion-safe:animate-[riseIn_.35s_ease-out_both]">
                <div className="mb-5 flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#c8e2cf] bg-[#EAF6EE] px-3 py-1.5 text-[11px] font-bold text-[#12592C]">
                    <span className="font-black">0{stepIndex + 1}</span>
                    <span className="h-3 w-px bg-[#b6d9bf]" />
                    {currentStep.kicker}
                  </span>
                  <div
                    aria-hidden="true"
                    className="relative mr-2 flex size-16 items-center justify-center rounded-[24px] bg-[#12592C] text-[#a6e5b9]"
                  >
                    <StepIcon size={29} strokeWidth={1.5} />
                    <span className="absolute -top-1 -right-2 size-4 rounded-full bg-[#eddaa6]" />
                    <Leaf
                      size={15}
                      className="absolute -bottom-1 -left-2 -rotate-25 text-[#6eb784]"
                    />
                  </div>
                </div>
                <h1 className="text-[29px] leading-[1.3] font-black tracking-tight whitespace-pre-line text-[#12592C]">
                  {currentStep.title}
                </h1>
                <p className="mt-3 max-w-[370px] text-[13px] leading-6 break-keep text-[#52685a]">
                  {currentStep.subtitle}
                </p>

                <div className="mt-6">
                  <div className="mb-3 flex items-center justify-between text-[11px] font-semibold text-[#627c6a]">
                    <span>
                      {currentStep.multi
                        ? "마음 가는 만큼 골라요"
                        : "가장 나다운 하나를 골라요"}
                    </span>
                    <span aria-live="polite">
                      {selected.length > 0
                        ? `${selected.length}개 담았어요`
                        : ""}
                    </span>
                  </div>
                  <div
                    role="group"
                    aria-label={currentStep.title.replace(/\n/g, " ")}
                    className={
                      currentStep.options.some((option) => option.desc)
                        ? "grid gap-3"
                        : "grid grid-cols-2 gap-3"
                    }
                  >
                    {currentStep.options.map(({ label, desc, Icon }) => {
                      const active = selected.includes(label);
                      const AgeIcon =
                        currentStep.id === "age" ? ageIcons[label] : undefined;
                      return (
                        <button
                          key={label}
                          onClick={() => toggleOption(label)}
                          aria-pressed={active}
                          className={`relative rounded-[20px] border p-4 text-left transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E7F3C] motion-safe:active:scale-[0.98] ${active ? "border-[#1E7F3C] bg-[#EAF6EE] shadow-[0_5px_18px_rgba(18,89,44,0.12)]" : "border-[#dce7df] bg-white hover:border-[#86b796] hover:bg-[#F3F9F5]"}`}
                        >
                          <div
                            className={`flex gap-3 ${desc ? "items-center" : "flex-col"}`}
                          >
                            <span
                              className={`flex size-10 shrink-0 items-center justify-center rounded-[14px] ${active ? "bg-[#12592C] text-white" : "bg-[#EAF6EE] text-[#1E7F3C]"}`}
                            >
                              {AgeIcon ? (
                                <AgeIcon size={20} strokeWidth={1.7} />
                              ) : Icon ? (
                                <Icon size={20} strokeWidth={1.7} />
                              ) : (
                                <Sun size={20} strokeWidth={1.7} />
                              )}
                            </span>
                            <div className="min-w-0 flex-1 pr-5">
                              <span
                                className={`text-[15px] font-bold ${active ? "text-[#12592C]" : "text-[#354d3c]"}`}
                              >
                                {label}
                              </span>
                              {desc && (
                                <p className="mt-1 text-xs leading-5 text-[#6c8072]">
                                  {desc}
                                </p>
                              )}
                            </div>
                            <span
                              className={`absolute top-4 right-3 flex size-4 items-center justify-center rounded-full ${active ? "bg-[#12592C] text-white" : "border border-[#bed5c5]"}`}
                            >
                              {active && <Check size={11} strokeWidth={3} />}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <p className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-[#799381]">
                  <Leaf size={12} />
                  {stepIndex === 0
                    ? "작은 인사부터, 나다운 여행의 시작"
                    : stepIndex === configuredSteps.length - 1
                      ? "당신의 취향 지도가 거의 완성됐어요"
                      : "하나씩 고를수록, 조금 더 나다운 마을"}
                </p>
              </div>
            </div>

            <footer className="shrink-0 border-t border-[#dce7df] bg-[#F5F8F6] px-5 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
              {saveError && (
                <p
                  role="alert"
                  className="mb-2 text-center text-[11px] font-semibold text-[#bd5b4d]"
                >
                  {saveError}
                </p>
              )}
              {authExpired ? (
                <Link
                  href="/"
                  className="flex h-14 w-full items-center justify-center gap-2 rounded-[17px] bg-[#12592C] text-[15px] font-bold text-white shadow-[0_8px_22px_rgba(30,127,60,0.16)]"
                >
                  다시 로그인하기
                  <ChevronRight size={18} />
                </Link>
              ) : (
                <button
                  onClick={goNext}
                  disabled={!canGoNext || isSaving}
                  className={`flex h-14 w-full items-center justify-center gap-2 rounded-[17px] text-[15px] font-bold transition ${canGoNext && !isSaving ? "bg-[#12592C] text-white shadow-[0_8px_22px_rgba(30,127,60,0.16)]" : "bg-[#E2E8E4] text-[#95a89a]"}`}
                >
                  {isSaving
                    ? "취향 저장 중"
                    : stepIndex === configuredSteps.length - 1
                      ? "내 취향 확인하기"
                      : stepIndex === 0
                        ? "좋아요, 취향 산책 시작"
                        : "좋아요, 다음으로"}
                  <ChevronRight size={18} />
                </button>
              )}
            </footer>
          </section>
        )}
      </div>
    </main>
  );
}
