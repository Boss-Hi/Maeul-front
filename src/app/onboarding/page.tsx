"use client";

import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronRight,
  Coffee,
  Heart,
  Home,
  MapPinned,
  Palette,
  Sparkles,
  UserRound,
  Utensils
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";

type StepId = "age" | "job" | "purpose" | "theme" | "stay" | "food" | "pace";

type Option = {
  label: string;
  desc?: string;
  Icon?: LucideIcon;
};

type OnboardingStep = {
  id: StepId;
  kicker: string;
  title: string;
  subtitle: string;
  multi?: boolean;
  options: Option[];
};

const steps: OnboardingStep[] = [
  {
    id: "age",
    kicker: "BASIC 01",
    title: "나이대를 알려주세요",
    subtitle: "비슷한 체류 리듬과 관심사를 가진 일정을 먼저 추천해요.",
    options: [
      { label: "10대" },
      { label: "20대" },
      { label: "30대" },
      { label: "40대" },
      { label: "50대" },
      { label: "60대 이상" }
    ]
  },
  {
    id: "job",
    kicker: "BASIC 02",
    title: "요즘 어떤 일을 하나요?",
    subtitle: "업무 가능 시간, 동행 추천, 워케이션 장소를 맞추는 데 사용해요.",
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
    kicker: "TRIP 03",
    title: "이번 체류의 목적은요?",
    subtitle: "하나만 골라도 충분해요. MAEUL이 일정의 밀도를 조절할게요.",
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
    kicker: "TASTE 04",
    title: "끌리는 테마를 골라주세요",
    subtitle: "여러 개를 골라도 좋아요. 추천 행사의 결이 달라져요.",
    multi: true,
    options: [
      { label: "커피" },
      { label: "독서" },
      { label: "음악/공연" },
      { label: "로컬 맛집" },
      { label: "바다/자연" },
      { label: "공방 체험" },
      { label: "역사 산책" },
      { label: "웰니스" }
    ]
  },
  {
    id: "stay",
    kicker: "STAY 05",
    title: "선호하는 숙소는요?",
    subtitle: "이동 거리와 체류 감도를 같이 맞춰볼게요.",
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
    kicker: "TASTE 06",
    title: "식사는 어떤 쪽이 좋아요?",
    subtitle: "추천 동선 안의 점심, 카페, 저녁 장소를 고를 때 반영해요.",
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
    kicker: "ROUTE 07",
    title: "일정 템포는요?",
    subtitle: "마지막이에요. 이 선택으로 하루 일정 간격이 정해져요.",
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

export default function OnboardingPage() {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState(initialAnswers);
  const isComplete = stepIndex >= steps.length;
  const currentStep = steps[Math.min(stepIndex, steps.length - 1)];
  const progress = isComplete
    ? 100
    : Math.round(((stepIndex + 1) / steps.length) * 100);
  const selected = answers[currentStep.id];

  const canGoNext = isComplete || selected.length > 0;

  const summary = useMemo(
    () =>
      steps
        .map((step) => ({
          label: step.title.replace("요?", "").replace("알려주세요", ""),
          value: answers[step.id].join(", ")
        }))
        .filter((item) => item.value),
    [answers]
  );

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

  function goNext() {
    if (!canGoNext) return;
    setStepIndex((index) => index + 1);
  }

  function goBack() {
    if (stepIndex === 0) return;
    setStepIndex((index) => index - 1);
  }

  return (
    <main className="h-lvh overflow-hidden bg-[#e7eae7] text-[#16211a]">
      <div className="mx-auto flex h-lvh w-full max-w-[600px] flex-col overflow-hidden bg-[#F5F8F6] shadow-[0_0_38px_rgba(20,34,25,0.08)]">
        <header className="shrink-0 bg-white px-5 pt-4 pb-3">
          <div className="flex items-center justify-between gap-3">
            {stepIndex > 0 && !isComplete ? (
              <button
                aria-label="이전 단계"
                onClick={goBack}
                className="flex size-9 items-center justify-center rounded-xl bg-[#EDF1EE] text-[#4a544c]"
              >
                <ArrowLeft size={18} />
              </button>
            ) : (
              <Link
                href="/home"
                aria-label="홈으로 돌아가기"
                className="flex size-9 items-center justify-center rounded-xl bg-[#EDF1EE] text-[#4a544c]"
              >
                <ArrowLeft size={18} />
              </Link>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] font-black tracking-[0.08em] text-[#1E7F3C]">
                  MAEUL TASTE
                </span>
                <span className="text-[11px] font-bold text-[#8a938c]">
                  {isComplete ? "완료" : `${stepIndex + 1} / ${steps.length}`}
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#E2E8E4]">
                <div
                  className="h-full rounded-full bg-[#1E7F3C] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </header>

        {isComplete ? (
          <CompleteView summary={summary} />
        ) : (
          <section className="flex min-h-0 flex-1 flex-col px-5 pt-5 pb-5">
            <div className="shrink-0">
              <div className="inline-flex rounded-full bg-[#EAF6EE] px-3 py-1.5 text-[11px] font-black tracking-[0.06em] text-[#12592C]">
                {currentStep.kicker}
              </div>
              <h1 className="mt-4 text-[28px] leading-tight font-black text-[#16211a]">
                {currentStep.title}
              </h1>
              <p className="mt-3 text-[14px] leading-relaxed font-medium text-[#7b847d]">
                {currentStep.subtitle}
              </p>
            </div>

            <div className="mt-6 min-h-0 flex-1 overflow-y-auto pb-4">
              <div
                className={
                  currentStep.options.some((option) => option.desc)
                    ? "grid gap-3"
                    : "grid grid-cols-2 gap-2.5"
                }
              >
                {currentStep.options.map(({ label, desc, Icon }) => {
                  const active = selected.includes(label);

                  return (
                    <button
                      key={label}
                      onClick={() => toggleOption(label)}
                      className={`relative min-h-[58px] overflow-hidden rounded-[16px] border bg-white p-4 text-left transition ${
                        active
                          ? "border-[#1E7F3C] shadow-[0_10px_24px_rgba(30,127,60,0.13)]"
                          : "border-black/7"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {Icon ? (
                          <div
                            className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
                              active
                                ? "bg-[#1E7F3C] text-white"
                                : "bg-[#EDF1EE] text-[#6f7872]"
                            }`}
                          >
                            <Icon size={19} />
                          </div>
                        ) : null}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`text-[15px] font-black ${
                                active ? "text-[#12592C]" : "text-[#16211a]"
                              }`}
                            >
                              {label}
                            </span>
                            {active ? (
                              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#1E7F3C] text-white">
                                <Check size={14} strokeWidth={3} />
                              </span>
                            ) : null}
                          </div>
                          {desc ? (
                            <p className="mt-1.5 text-[12px] leading-relaxed text-[#7b847d]">
                              {desc}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="shrink-0 border-t border-black/6 bg-[#F5F8F6] pt-4">
              <button
                onClick={goNext}
                disabled={!canGoNext}
                className={`flex h-[54px] w-full items-center justify-center gap-2 rounded-[15px] text-[15px] font-bold transition ${
                  canGoNext
                    ? "bg-[#1E7F3C] text-white shadow-[0_8px_22px_rgba(30,127,60,0.22)]"
                    : "bg-[#E2E8E4] text-[#a3aca5]"
                }`}
              >
                {stepIndex === steps.length - 1 ? "내 취향 확인하기" : "다음"}
                <ChevronRight size={18} />
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function CompleteView({
  summary
}: Readonly<{
  summary: { label: string; value: string }[];
}>) {
  return (
    <section className="min-h-0 flex-1 overflow-y-auto px-5 pt-5 pb-5">
      <div className="rounded-[22px] bg-[linear-gradient(135deg,#12592C,#1E7F3C)] p-5 text-white shadow-[0_14px_34px_rgba(30,127,60,0.2)]">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-white/16">
          <Sparkles size={24} />
        </div>
        <h1 className="mt-5 text-[28px] leading-tight font-black">
          취향 프로필이
          <br />
          준비됐어요
        </h1>
        <p className="mt-3 text-[14px] leading-relaxed text-white/72">
          이제 행사, 숙소, 로컬 미션을 이 취향 기준으로 먼저 보여드릴게요.
        </p>
      </div>

      <div className="mt-5 grid gap-2.5">
        {summary.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-black/6 bg-white p-4"
          >
            <div className="text-[11px] font-bold text-[#8a938c]">
              {item.label}
            </div>
            <div className="mt-1.5 text-[15px] leading-relaxed font-black text-[#16211a]">
              {item.value}
            </div>
          </div>
        ))}
      </div>

      <Link
        href="/home"
        className="mt-5 flex h-[54px] w-full items-center justify-center rounded-[15px] bg-[#1E7F3C] text-[15px] font-bold text-white shadow-[0_8px_22px_rgba(30,127,60,0.22)]"
      >
        내 취향으로 시작하기
      </Link>
    </section>
  );
}
