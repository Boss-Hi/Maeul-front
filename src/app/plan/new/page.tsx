"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Leaf,
  CalendarDays,
  Users,
  Sun,
  Flag,
  MapPin,
  Search,
  Trees
} from "lucide-react";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";

const titles = [
  "이번 여행,\n어디에 머무를까요?",
  "낯선 마을에서,\n얼마나 쉬어갈까요?",
  "이번 여행길,\n누구와 함께하나요?",
  "머무는 동안,\n어떤 하루를 보낼까요?",
  "작은 도전 하나,\n여행에 담아볼까요?",
  "이렇게 떠나볼까요?"
];
const stepDetails = [
  {
    label: "지역",
    kicker: "머물 곳을 찾아서",
    Icon: MapPin,
    desc: "행사가 열리는 강릉도, 가까운 다른 마을도 좋아요. 마음이 가는 곳을 골라주세요."
  },
  {
    label: "기간",
    kicker: "잠시 쉬어가는 시간",
    Icon: CalendarDays,
    desc: "하루의 짧은 쉼부터 일주일의 여유까지. 이번 여행에 내어줄 시간을 골라주세요."
  },
  {
    label: "동행",
    kicker: "함께 걷는 사람",
    Icon: Users,
    desc: "오롯이 나에게 집중해도, 소중한 사람과 함께해도 좋아요."
  },
  {
    label: "스타일",
    kicker: "나만의 하루",
    Icon: Sun,
    desc: "느긋한 산책, 맛있는 한 끼, 새로운 경험. 마음이 가는 것들을 담아주세요."
  },
  {
    label: "미션",
    kicker: "여행에 남길 한 조각",
    Icon: Flag,
    desc: "이제 마지막이에요. 이 마을에서 기억하고 싶은 작은 도전을 골라볼까요?"
  },
  {
    label: "완료",
    kicker: "떠날 준비 끝",
    Icon: Check,
    desc: "하나씩 고른 마음을 모았어요. 우리, 이런 여행을 떠나봐요."
  }
];
const regionDescriptions = [
  "버스킹과 커피 향이 있는 바닷마을",
  "무릉계곡과 한적한 해변",
  "서핑과 바닷가 카페",
  "시장 먹거리와 호수 산책",
  "숲길과 고원의 여유"
];
const missionDescriptions = [
  "안목 커피거리에서 서로 다른 커피 향을 만나봐요.",
  "야간 공연을 즐기고 기억에 남는 한 줄을 남겨요.",
  "바다 보이는 책방에서 책 한 권과 느긋하게 머물러요.",
  "정해진 도전 없이, 내 마음이 이끄는 대로 걸어요."
];
const durations = ["당일치기", "1박 2일", "2박 3일", "3박 4일", "1주 살기"];
const regions = [
  "강원 강릉시",
  "강원 동해시",
  "강원 양양군",
  "강원 속초시",
  "강원 평창군"
];
const styles = [
  "자연과 산책",
  "로컬 맛집",
  "카페와 독서",
  "문화와 공연",
  "공방 체험",
  "워케이션"
];
const missions = [
  "로스터리 3곳 방문",
  "버스킹 2팀 관람",
  "바다책방 30분 독서",
  "이번에는 쉬어가기"
];
const initial = {
  region: "강원 강릉시",
  start: "",
  end: "",
  companion: "",
  transport: "",
  styles: [] as string[],
  pace: "",
  mission: ""
};
type Draft = typeof initial;
const storageKey = "maeul-plan-draft";
const inputClass =
  "h-14 w-full min-w-0 rounded-lg border border-[#cbdcd0] bg-white px-3 text-base text-[#24432d] outline-none focus:ring-2 focus:ring-[#86b796]";

function validDates(start: string, end: string) {
  return (
    /^2026-08-(1[5-9]|2[0-2])$/.test(start) &&
    /^2026-08-(1[5-9]|2[0-2])$/.test(end) &&
    start <= end
  );
}

function Choices({
  label,
  options,
  selected,
  onSelect,
  multi = false
}: {
  label: string;
  options: string[];
  selected: string[];
  onSelect: (value: string) => void;
  multi?: boolean;
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-3 text-sm font-bold text-[#52685a]">{label}</legend>
      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => (
          <label
            key={option}
            className={`relative flex min-h-20 cursor-pointer items-center justify-center gap-2 rounded-[20px] border p-4 text-center text-[15px] font-bold break-keep transition duration-200 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#1E7F3C] motion-safe:active:scale-[0.98] ${selected.includes(option) ? "border-[#1E7F3C] bg-[#EAF6EE] text-[#12592C] shadow-[0_5px_18px_rgba(18,89,44,0.08)]" : "border-[#dce7df] bg-white text-[#52685a] hover:border-[#86b796]"}`}
          >
            <input
              type={multi ? "checkbox" : "radio"}
              name={label}
              checked={selected.includes(option)}
              onChange={() => onSelect(option)}
              className="sr-only"
            />
            {option}
            <span
              aria-hidden="true"
              className={`absolute top-2 right-2 flex size-4 items-center justify-center rounded-full ${selected.includes(option) ? "bg-[#12592C] text-white" : "border border-[#bed5c5]"}`}
            >
              {selected.includes(option) && <Check size={11} />}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

const subscribe = () => () => {};

export default function NewPlanPage() {
  const ready = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
  return ready ? (
    <PlanForm />
  ) : (
    <main className="h-dvh bg-[#F5F8F6]" aria-busy="true" />
  );
}

function PlanForm() {
  const [step, setStep] = useState(0);
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const detail = stepDetails[step];
  const StepIcon = detail.Icon;

  const [draft, setDraft] = useState<Draft>(() => {
    try {
      const value: unknown = JSON.parse(
        sessionStorage.getItem(storageKey) ?? "null"
      );
      if (value && typeof value === "object") {
        const record = value as Record<string, unknown>;
        const restored = { ...initial };
        for (const key of [
          "region",
          "start",
          "end",
          "companion",
          "transport",
          "pace",
          "mission"
        ] as const) {
          if (typeof record[key] === "string") restored[key] = record[key];
        }
        if (Array.isArray(record.styles))
          restored.styles = record.styles.filter(
            (item): item is string =>
              typeof item === "string" && styles.includes(item)
          );
        return restored;
      }
    } catch {
      /* An unavailable or expired draft starts a fresh flow. */
    }
    return initial;
  });

  const datesValid = validDates(draft.start, draft.end);
  const valid = [
    regions.includes(draft.region),
    datesValid,
    Boolean(draft.companion && draft.transport),
    Boolean(draft.styles.length && draft.pace),
    Boolean(draft.mission)
  ];
  const nights = datesValid
    ? Math.round((Date.parse(draft.end) - Date.parse(draft.start)) / 86400000)
    : 0;
  const summary = [
    ["머무를 지역", draft.region],
    [
      "체류 기간",
      `${draft.start} ~ ${draft.end} · ${nights ? `${nights}박 ${nights + 1}일` : "당일치기"}`
    ],
    ["동행 · 이동", `${draft.companion} · ${draft.transport}`],
    ["체류 스타일", `${draft.styles.join(", ")} · ${draft.pace}`],
    ["로컬 미션", draft.mission]
  ];

  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function next() {
    if (step < 5) {
      if (!valid[step]) return;
      setStep(step + 1);
      return;
    }
    if (!valid.every(Boolean)) return;
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(draft));
      setSaved(true);
      setError("");
    } catch {
      setError(
        "저장하지 못했어요. 브라우저 저장 공간을 확인하고 다시 시도해 주세요."
      );
    }
  }

  return (
    <main className="h-dvh overflow-hidden bg-[#e7eae7] text-[#16211a]">
      <div className="mx-auto flex h-dvh w-full max-w-[600px] flex-col bg-[#F5F8F6]">
        <header className="shrink-0 px-5 pt-4 pb-3">
          <div className="flex items-center justify-between">
            {step ? (
              <button
                onClick={() => {
                  setStep(step - 1);
                  setSaved(false);
                }}
                aria-label="이전 단계"
                className="flex size-10 items-center justify-center rounded-full bg-white text-[#12592C]"
              >
                <ArrowLeft size={20} />
              </button>
            ) : (
              <Link
                href="/event"
                aria-label="행사로 돌아가기"
                className="flex size-10 items-center justify-center rounded-full bg-white text-[#12592C]"
              >
                <ArrowLeft size={20} />
              </Link>
            )}
            <span className="flex items-center gap-2 text-sm font-bold text-[#12592C]">
              <Trees size={18} /> MAEUL
            </span>
            <span className="text-xs text-[#52685a]">
              {step < 5 ? `${detail.label} ${step + 1}/5` : "여행 준비 완료"}
            </span>
          </div>
          <div
            className="mt-4 flex gap-1.5"
            aria-label={`${Math.min(step + 1, 5)} / 5 단계`}
          >
            {titles.slice(0, 5).map((title, index) => (
              <div
                key={title}
                className={`h-1.5 flex-1 rounded-full ${index <= step ? "bg-[#1E7F3C]" : "bg-[#dce7df]"}`}
              />
            ))}
          </div>
        </header>
        <section
          key={step}
          className="min-h-0 flex-1 overflow-y-auto px-5 pt-4 pb-8 motion-safe:animate-[riseIn_.35s_ease-out_both]"
        >
          <div className="mb-5 flex items-center justify-between">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#c8e2cf] bg-[#EAF6EE] px-3 py-1.5 text-[11px] font-bold text-[#12592C]">
              <span>0{Math.min(step + 1, 5)}</span>
              <span className="h-3 w-px bg-[#b6d9bf]" />
              {detail.kicker}
            </span>
            <div
              aria-hidden="true"
              className="mr-2 flex size-16 items-center justify-center rounded-[24px] bg-[#12592C] text-[#a6e5b9]"
            >
              <StepIcon size={29} strokeWidth={1.5} />
            </div>
          </div>
          <h1 className="text-[29px] leading-[1.3] font-black whitespace-pre-line text-[#12592C]">
            {titles[step]}
          </h1>
          <p className="mt-3 max-w-[370px] text-[13px] leading-6 break-keep text-[#52685a]">
            {detail.desc}
          </p>
          <div className="mt-7 space-y-6">
            {step === 0 && (
              <>
                <button
                  onClick={() => update("region", regions[0])}
                  aria-pressed={draft.region === regions[0]}
                  className={`w-full rounded-[20px] border p-5 text-left transition ${draft.region === regions[0] ? "border-[#1E7F3C] bg-[#EAF6EE]" : "border-[#dce7df] bg-white"}`}
                >
                  <span className="text-[11px] font-bold text-[#1E7F3C]">
                    행사가 열리는 마을
                  </span>
                  <span className="mt-3 flex items-center justify-between text-xl font-black text-[#12592C]">
                    {regions[0]}
                    {draft.region === regions[0] && <Check size={20} />}
                  </span>
                  <span className="mt-2 block text-xs leading-5 text-[#627c6a]">
                    강릉 버스킹 & 커피 페스타 · 08.15 ~ 08.22
                  </span>
                </button>
                <div className="relative">
                  <Search
                    size={18}
                    className="absolute top-4 left-3 text-[#73877a]"
                  />
                  <input
                    aria-label="지역 검색"
                    placeholder="지역명 검색"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className={`${inputClass} pl-10`}
                  />
                </div>
                <div className="space-y-3">
                  <h2 className="text-xs font-semibold text-[#627c6a]">
                    {query ? "검색한 마을" : "근처 마을도 둘러볼까요?"}
                  </h2>
                  {regions
                    .filter(
                      (region) =>
                        region.includes(query.trim()) &&
                        (query || region !== regions[0])
                    )
                    .map((region) => (
                      <button
                        key={region}
                        onClick={() => update("region", region)}
                        aria-pressed={draft.region === region}
                        className={`flex min-h-20 w-full items-center justify-between gap-3 rounded-[20px] border p-4 text-left transition ${draft.region === region ? "border-[#1E7F3C] bg-[#EAF6EE]" : "border-[#dce7df] bg-white"}`}
                      >
                        <span>
                          <span className="block text-[15px] font-bold text-[#354d3c]">
                            {region}
                          </span>
                          <span className="mt-1 block text-xs text-[#6c8072]">
                            {regionDescriptions[regions.indexOf(region)]}
                          </span>
                        </span>
                        <span
                          className={`flex size-5 shrink-0 items-center justify-center rounded-full ${draft.region === region ? "bg-[#12592C] text-white" : "border border-[#bed5c5]"}`}
                        >
                          {draft.region === region && <Check size={13} />}
                        </span>
                      </button>
                    ))}
                </div>
                {!regions.some((region) => region.includes(query.trim())) && (
                  <p className="text-sm text-[#73877a]">검색 결과가 없어요.</p>
                )}
              </>
            )}
            {step === 1 && (
              <>
                <Choices
                  label="얼마만큼의 여유를 담을까요?"
                  options={durations}
                  selected={
                    datesValid
                      ? [durations[[0, 1, 2, 3, 6].indexOf(nights)]]
                      : []
                  }
                  onSelect={(value) => {
                    const length = [0, 1, 2, 3, 6][durations.indexOf(value)];
                    const start =
                      draft.start &&
                      draft.start >= "2026-08-15" &&
                      draft.start <= `2026-08-${22 - length}`
                        ? draft.start
                        : "2026-08-15";
                    const end = new Date(Date.parse(start) + length * 86400000)
                      .toISOString()
                      .slice(0, 10);
                    setDraft((prev) => ({ ...prev, start, end }));
                  }}
                />
                <p className="text-sm text-[#52685a]">
                  행사 기간 · 2026.08.15 ~ 08.22
                </p>
                <div className="grid grid-cols-1 gap-4 min-[380px]:grid-cols-2">
                  {(["start", "end"] as const).map((key) => (
                    <label
                      key={key}
                      className="block min-w-0 text-sm font-bold text-[#52685a]"
                    >
                      {key === "start" ? "도착하는 날" : "떠나는 날"}
                      <input
                        type="date"
                        aria-describedby="date-status"
                        min={
                          key === "end" && draft.start
                            ? draft.start
                            : "2026-08-15"
                        }
                        max="2026-08-22"
                        value={draft[key]}
                        onChange={(e) => update(key, e.target.value)}
                        className={`${inputClass} mt-2 block`}
                      />
                    </label>
                  ))}
                </div>
                <p
                  id="date-status"
                  aria-live="polite"
                  className="text-sm text-[#52685a]"
                >
                  {datesValid
                    ? `${nights ? `${nights}박 ${nights + 1}일` : "당일치기"} 머물러요.`
                    : draft.start && draft.end
                      ? "행사 기간 안에서 도착일 이후의 출발일을 골라주세요."
                      : ""}
                </p>
              </>
            )}
            {step === 2 && (
              <>
                <Choices
                  label="동행"
                  options={["혼자", "친구와", "연인과", "가족과", "동료와"]}
                  selected={[draft.companion]}
                  onSelect={(value) => update("companion", value)}
                />
                <Choices
                  label="이동 수단"
                  options={[
                    "자차 / 렌터카",
                    "대중교통 + 택시",
                    "도보 & 자전거"
                  ]}
                  selected={[draft.transport]}
                  onSelect={(value) => update("transport", value)}
                />
              </>
            )}
            {step === 3 && (
              <>
                <Choices
                  label="체류 스타일"
                  options={styles}
                  selected={draft.styles}
                  multi
                  onSelect={(value) =>
                    update(
                      "styles",
                      draft.styles.includes(value)
                        ? draft.styles.filter((item) => item !== value)
                        : [...draft.styles, value]
                    )
                  }
                />
                <Choices
                  label="하루 페이스"
                  options={["느긋하게", "적당히 알차게", "촘촘하게"]}
                  selected={[draft.pace]}
                  onSelect={(value) => update("pace", value)}
                />
              </>
            )}
            {step === 4 && (
              <div className="space-y-3">
                {missions.map((mission, index) => (
                  <button
                    key={mission}
                    aria-pressed={draft.mission === mission}
                    onClick={() => update("mission", mission)}
                    className={`w-full rounded-[20px] border p-5 text-left transition motion-safe:active:scale-[0.98] ${draft.mission === mission ? "border-[#1E7F3C] bg-[#EAF6EE] shadow-[0_5px_18px_rgba(18,89,44,0.08)]" : "border-[#dce7df] bg-white"}`}
                  >
                    <span className="flex items-center justify-between gap-3 text-[15px] font-bold text-[#12592C]">
                      {mission}
                      <span
                        className={`flex size-5 shrink-0 items-center justify-center rounded-full ${draft.mission === mission ? "bg-[#12592C] text-white" : "border border-[#bed5c5]"}`}
                      >
                        {draft.mission === mission && <Check size={13} />}
                      </span>
                    </span>
                    <span className="mt-2 block text-xs leading-6 text-[#6c8072]">
                      {missionDescriptions[index]}
                    </span>
                    {index < 3 && (
                      <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#8a5a12]">
                        <Flag size={13} />
                        {
                          [
                            "커피 향을 따라",
                            "음악이 머무는 밤",
                            "책 한 권의 여유"
                          ][index]
                        }
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
            {step === 5 && (
              <>
                <dl className="divide-y divide-[#dce7df]">
                  {summary.map(([label, value], index) => (
                    <div
                      key={label}
                      className="flex items-start justify-between gap-3 py-4 first:pt-0"
                    >
                      <div className="min-w-0">
                        <dt className="text-xs text-[#73877a]">{label}</dt>
                        <dd className="mt-2 text-sm leading-6 font-semibold break-words">
                          {value}
                        </dd>
                      </div>
                      <button
                        onClick={() => {
                          setStep(index);
                          setSaved(false);
                        }}
                        className="shrink-0 py-1 text-xs font-bold text-[#1E7F3C]"
                      >
                        수정
                      </button>
                    </div>
                  ))}
                </dl>
                {saved && (
                  <p
                    role="status"
                    className="flex items-center gap-2 text-sm text-[#1E7F3C]"
                  >
                    <Check size={18} /> 체류 계획을 저장했어요.
                  </p>
                )}
                {error && (
                  <p role="alert" className="text-sm text-red-700">
                    {error}
                  </p>
                )}
              </>
            )}
          </div>
          <p className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-[#799381]">
            <Leaf size={12} />
            {step === 4
              ? "작은 도전이 특별한 여행의 기억으로"
              : step === 5
                ? "나답게 머무를 준비가 됐어요"
                : "하나씩 고를수록, 조금 더 나다운 여행"}
          </p>
        </section>
        <footer className="shrink-0 border-t border-[#dce7df] px-5 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          {saved ? (
            <Link
              href="/plan"
              className="flex h-14 items-center justify-center gap-2 rounded-[17px] bg-[#12592C] text-[15px] font-bold text-white"
            >
              마이로컬 보기 <ArrowRight size={18} />
            </Link>
          ) : (
            <button
              disabled={step < 5 ? !valid[step] : !valid.every(Boolean)}
              onClick={next}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-[17px] bg-[#12592C] text-[15px] font-bold text-white shadow-[0_8px_22px_rgba(30,127,60,0.16)] disabled:bg-[#e2e8e4] disabled:text-[#95a89a] disabled:shadow-none"
            >
              {step === 5
                ? "체류 계획 저장하기"
                : step === 4
                  ? "선택 내용 확인하기"
                  : [
                      "좋아요, 이 마을로",
                      "좋아요, 이만큼 머물게요",
                      "좋아요, 함께 떠나요",
                      "좋아요, 내 여행에 담기"
                    ][step]}
              <ArrowRight size={18} />
            </button>
          )}
        </footer>
      </div>
    </main>
  );
}
