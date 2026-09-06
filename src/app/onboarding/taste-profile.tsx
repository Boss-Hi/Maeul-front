"use client";

import {
  ArrowRight,
  Check,
  Coffee,
  Heart,
  House,
  Leaf,
  MapPinned,
  Sparkles,
  Sun,
  Trees
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const preparation = [
  {
    title: "흩어진 취향을 모으고 있어요",
    detail: "좋아하는 것들을 하나씩 담는 중이에요."
  },
  {
    title: "나만의 여행 리듬을 찾고 있어요",
    detail: "머무는 방식과 좋아하는 속도를 연결해요."
  },
  {
    title: "취향 프로필에 마지막 한 조각",
    detail: "당신다운 마을 여행이 곧 시작돼요."
  }
];

const travelTypes: Record<string, { title: string; description: string }> = {
  "쉼과 회복": {
    title: "여유를 수집하는 산책가",
    description: "잠깐 멈춰 바라볼 때, 동네의 작은 매력을 발견하는 당신."
  },
  "일과 여행": {
    title: "일상도 여행처럼, 로컬 워커",
    description: "일하는 순간과 쉬는 순간 사이에서 나만의 균형을 찾는 당신."
  },
  "새로운 경험": {
    title: "골목의 발견을 즐기는 탐험가",
    description: "처음 만나는 풍경과 작은 도전으로 하루를 채우는 당신."
  },
  "사람 만나기": {
    title: "만남을 이어가는 마을 친구",
    description: "새로운 인사와 함께 나누는 시간에서 여행의 의미를 찾는 당신."
  }
};

export function TasteProfile({
  answers
}: Readonly<{ answers: Record<string, string[]> }>) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // A short local transition; no remote recommendation request is made here.
    const timers = [800, 1600, 2500].map((delay, index) =>
      window.setTimeout(() => setPhase(index + 1), delay)
    );
    return () => timers.forEach(window.clearTimeout);
  }, []);

  const purpose = answers.purpose?.[0] ?? "";
  const profile = travelTypes[purpose] ?? {
    title: "나만의 마을을 찾는 여행자",
    description: "당신의 취향으로, 익숙하지 않은 동네에 조금 더 가까이."
  };
  const themes = answers.theme ?? [];
  const details = [
    {
      label: "머무는 공간",
      value: answers.stay?.join(", "),
      Icon: House,
      color: "bg-[#eaf3e7] text-[#4b7045]"
    },
    {
      label: "하루의 속도",
      value: answers.pace?.join(", "),
      Icon: Sun,
      color: "bg-[#fff2d9] text-[#a87826]"
    },
    {
      label: "좋아하는 한 끼",
      value: answers.food?.join(" · "),
      Icon: Coffee,
      color: "bg-[#f6ebe0] text-[#966b47]"
    }
  ];

  if (phase < preparation.length) {
    return (
      <section
        aria-busy="true"
        className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-[radial-gradient(ellipse_at_center,#e4f1e7,transparent_75%)] px-6 py-8"
      >
        <div className="my-auto py-6 text-center">
          <span className="text-[11px] font-black tracking-[0.2em] text-[#63866c]">
            GROWING YOUR TASTE
          </span>
          <div className="relative mx-auto mt-7 w-full max-w-[340px]">
            <div className="absolute inset-5 rounded-full border border-dashed border-[#bad5bf] motion-safe:animate-[spin_40s_linear_infinite]" />
            <VillageIllustration growing />
          </div>
          <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="mt-7 min-h-[88px]"
          >
            <h1 className="text-[23px] leading-snug font-black tracking-tight text-[#163d24]">
              {preparation[phase].title}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-[#728378]">
              {preparation[phase].detail}
            </p>
          </div>
          <div
            aria-hidden="true"
            className="mx-auto mt-6 flex max-w-[180px] gap-2"
          >
            {preparation.map((item, index) => (
              <div
                key={item.title}
                className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${index <= phase ? "bg-[#348252]" : "bg-[#dbe6dd]"}`}
              />
            ))}
          </div>
          <p className="mt-8 text-xs text-[#86958b]">
            일곱 가지 선택, 하나의 나다운 여행
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-0 flex-1 overflow-y-auto px-5 pt-6 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
      <div className="motion-safe:animate-[riseIn_.6s_ease-out_both]">
        <div className="mb-5 flex items-center gap-2 text-xs font-bold text-[#548262]">
          <span className="flex size-5 items-center justify-center rounded-full bg-[#dceede]">
            <Check size={12} strokeWidth={3} />
          </span>
          당신의 취향이 한 장에 담겼어요
        </div>

        <article className="relative overflow-hidden rounded-[28px] border border-[#d4e5d7] bg-[#edf5eb] shadow-[0_12px_32px_rgba(34,73,43,0.08)]">
          <div className="relative z-10 px-6 pt-6">
            <div className="flex items-center justify-between text-[#51765b]">
              <span className="flex items-center gap-1.5 text-[11px] font-black tracking-[0.16em]">
                <Trees size={15} /> MAEUL PERSONA
              </span>
              <span className="rounded-full border border-[#c2d9c5] px-2.5 py-1 text-[10px] font-bold">
                나의 취향 카드
              </span>
            </div>
            <h1 className="mt-6 max-w-[300px] text-[30px] leading-[1.25] font-black tracking-tight break-keep text-[#173e25]">
              {profile.title}
            </h1>
            <p className="mt-3 max-w-[320px] text-[13px] leading-6 break-keep text-[#637c69]">
              {profile.description}
            </p>
          </div>
          <div className="mx-auto -mt-2 max-w-[360px]">
            <VillageIllustration />
          </div>
          <div className="relative flex flex-wrap items-center gap-2 border-t border-dashed border-[#c4d9c8] bg-white/50 px-6 py-4">
            <Heart size={13} className="text-[#6c9373]" />
            {themes.map((theme) => (
              <span
                key={theme}
                className="rounded-full bg-white/85 px-3 py-1.5 text-xs font-bold text-[#4d7457]"
              >
                #{theme}
              </span>
            ))}
          </div>
        </article>

        <div className="mt-7 flex items-center justify-between">
          <h2 className="text-[17px] font-black text-[#243d2b]">
            내가 머무는 방식
          </h2>
          <Leaf size={17} className="text-[#7a9c70]" />
        </div>
        <div className="mt-3 grid gap-2.5">
          {details.map(({ label, value, Icon, color }) => (
            <div
              key={label}
              className="flex items-center gap-3.5 rounded-[19px] border border-[#e6ebe4] bg-white px-4 py-4"
            >
              <span
                className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${color}`}
              >
                <Icon size={21} strokeWidth={1.7} />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-[#889187]">
                  {label}
                </p>
                <p className="mt-1 text-sm leading-relaxed font-bold text-[#354b39]">
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 px-1 text-xs leading-6 text-[#829086]">
          <span>{answers.age?.join(", ")}</span>
          <span>{answers.job?.join(", ")}</span>
          <span>{purpose}</span>
        </div>

        <div className="mt-6 rounded-[20px] bg-[#e9f0e6] p-4">
          <p className="flex items-center gap-2 text-sm font-bold text-[#3d6347]">
            <MapPinned size={17} /> 이제, 취향을 따라 마을로
          </p>
          <p className="mt-2 text-xs leading-6 text-[#738477]">
            이 프로필을 시작으로 마음에 드는 장소와 로컬 미션을 만나보세요.
          </p>
        </div>
        <Link
          href="/home"
          className="mt-5 flex min-h-14 items-center justify-center gap-2 rounded-[17px] bg-[#12592C] px-4 py-3 text-[15px] font-bold text-white shadow-[0_10px_24px_rgba(18,89,44,0.18)]"
        >
          내 취향으로 마을 둘러보기 <ArrowRight size={18} />
        </Link>
        <p className="mt-3 text-center text-[11px] text-[#929d93]">
          이전 단계로 돌아가 선택을 바꿀 수 있어요
        </p>
      </div>
    </section>
  );
}

function VillageIllustration({
  growing = false
}: Readonly<{ growing?: boolean }>) {
  return (
    <div aria-hidden="true" className="relative aspect-[360/230] w-full">
      <svg viewBox="0 0 360 230" className="h-full w-full" fill="none">
        <circle cx="180" cy="119" r="92" fill="#e0eedc" />
        <circle cx="256" cy="64" r="22" fill="#f3dca0" />
        <path
          d="M57 164Q103 76 154 145Q206 75 305 166V199H57Z"
          fill="#b8d4af"
        />
        <path
          d="M36 186Q119 131 187 171Q249 126 325 184V207H36Z"
          fill="#92bb8b"
        />
        <ellipse cx="181" cy="203" rx="146" ry="16" fill="#c7dcbb" />
        <path d="M170 193Q175 204 208 219" stroke="#f7edd3" strokeWidth="15" />
        <rect x="140" y="130" width="78" height="64" rx="6" fill="#fff9e9" />
        <path d="M130 133L178 94L228 133Z" fill="#3e7550" />
        <path d="M143 132L178 105L214 132" stroke="#528760" strokeWidth="4" />
        <rect x="170" y="157" width="19" height="37" rx="8" fill="#a7bd91" />
        <rect x="149" y="146" width="13" height="15" rx="3" fill="#cfdfc4" />
        <path
          d="M155.5 146V161M149 153.5H162"
          stroke="#fff9e9"
          strokeWidth="2"
        />
        <rect x="196" y="146" width="13" height="15" rx="3" fill="#cfdfc4" />
        <rect x="243" y="155" width="43" height="38" rx="4" fill="#f3e8d0" />
        <path d="M236 157L263 135L293 157Z" fill="#6e9667" />
        <rect x="259" y="172" width="11" height="21" rx="4" fill="#a6ba8e" />
        <path
          d="M97 193V148"
          stroke="#8e9970"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <ellipse cx="97" cy="139" rx="23" ry="31" fill="#729c68" />
        <path
          d="M97 157V131M97 146L87 139M97 139L105 133"
          stroke="#97b888"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M119 201V184M115 187L119 192L124 186"
          stroke="#77985f"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="116" cy="184" r="4" fill="#f4d58d" />
        <circle cx="125" cy="183" r="3" fill="#fff9e9" />
        <path
          d="M64 79H110M226 99H266"
          stroke="#fffdf4"
          strokeWidth="9"
          strokeLinecap="round"
        />
      </svg>
      <span
        className={`absolute top-[22%] left-[26%] rounded-xl bg-[#fffdf3] p-2 text-[#719564] shadow-sm ${growing ? "motion-safe:animate-bounce" : ""}`}
      >
        <Leaf size={18} />
      </span>
      <span
        className={`absolute top-[38%] right-[17%] rounded-xl bg-[#fffdf3] p-2 text-[#b5944c] shadow-sm ${growing ? "motion-safe:animate-pulse" : ""}`}
      >
        <Sparkles size={16} />
      </span>
    </div>
  );
}
