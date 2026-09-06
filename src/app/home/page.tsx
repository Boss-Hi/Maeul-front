"use client";

import {
  CalendarDays,
  ChevronDown,
  ChevronUp,
  CircleUserRound,
  MapPin,
  MessageCircle,
  Search,
  Sparkles,
  Star,
  Trees,
  UsersRound
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const filters = ["전체", "축제", "공연", "행사"];

const events = [
  {
    category: "축제",
    rate: "98%",
    dday: "D-3 개최",
    region: "강원 강릉시 42150",
    title: "2026 강릉 솔향 야간 버스킹 & 커피 페스타",
    desc: "안목 커피거리와 경포호수 일대의 로컬 바리스타 핸드드립 체험 & 야간 버스킹",
    date: "2026.08.15 ~ 08.22",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80"
  },
  {
    category: "행사",
    rate: "94%",
    dday: "D-6 개최",
    region: "강원 양양군 42830",
    title: "양양 서피비치 썬셋 비치 워케이션 위크",
    desc: "낮에는 비치 뷰 오피스에서 네트워킹 근무, 노을에는 일몰 서핑 클래스",
    date: "2026.08.18 ~ 08.25",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
  },
  {
    category: "축제",
    rate: "89%",
    dday: "D-9 개최",
    region: "강원 속초시 42210",
    title: "속초 로스터리 커피 위크",
    desc: "속초 원도심 로스터리 12곳이 참여하는 원두 테이스팅 투어",
    date: "2026.08.20 ~ 08.27",
    image:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80"
  }
];

const topEvents = [
  ["1", "강릉 커피 페스타", "강원 강릉시 · 8월 15일-22일"],
  ["2", "속초 로스터리 커피 위크", "강원 속초시 · 8월 20일-27일"],
  ["3", "양양 썬셋 비치 워케이션", "강원 양양군 · 9월 1일-15일"],
  ["4", "제주 조천 귤밭 코리빙 토크", "제주 제주시 · 9월 1일-15일"],
  ["5", "부산 영도 미식 & 로컬 크리에이터 페어", "부산 영도구 · 8월 20일-27일"],
  ["6", "전주 한옥마을 전통 다도 & 명상 위크", "전북 전주시 · 8월 20일-27일"]
];

const tabs = [
  { label: "탐색", Icon: Search, active: true },
  { label: "마이로컬", Icon: CalendarDays, active: false },
  { label: "미션", Icon: Star, active: false },
  { label: "MY", Icon: CircleUserRound, active: false }
];

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("전체");
  const [topsOpen, setTopsOpen] = useState(false);

  const visibleEvents = useMemo(() => {
    if (activeFilter === "전체") return events;
    return events.filter((event) => event.category === activeFilter);
  }, [activeFilter]);

  const visibleTops = topsOpen ? topEvents : topEvents.slice(0, 4);

  return (
    <main className="h-dvh overflow-hidden bg-[#e2ebe5] text-[#16211a]">
      <div className="mx-auto flex h-dvh w-full max-w-[600px] flex-col overflow-hidden bg-[#F6FAF7] shadow-[0_0_38px_rgba(20,34,25,0.08)]">
        <header className="shrink-0 bg-[#12592C] px-5 pt-5 pb-4 text-white">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Trees size={23} className="text-[#a6e5b9]" />
              <span className="text-[16px] font-black tracking-[0.1em]">
                MAEUL
              </span>
            </div>

            <div className="flex items-center gap-3">
              <HeaderIcon label="메시지" badge>
                <MessageCircle size={17} />
              </HeaderIcon>
              <HeaderIcon label="메이트" badge>
                <UsersRound size={17} />
              </HeaderIcon>
              <HeaderIcon label="내 정보">
                <CircleUserRound size={17} />
              </HeaderIcon>
            </div>
          </div>

          <button className="mt-4 flex h-11 w-full items-center gap-2 rounded-[15px] border border-white/10 bg-white/12 px-3 text-left">
            <Search size={18} className="shrink-0 text-[#a9e6bd]" />
            <span className="shrink-0 text-[12px] font-bold text-[#a9e6bd]">
              강원 강릉시 42150
            </span>
            <span className="min-w-0 truncate text-[13px] text-white/55">
              축제, 코리빙 검색...
            </span>
          </button>
        </header>

        <div className="flex shrink-0 items-center gap-2 border-b border-[#dce9df] bg-[#eaf3e8] px-5 py-2.5">
          <span className="shrink-0 rounded-full bg-[#12592C] px-2.5 py-1 text-[11px] font-bold text-white">
            예정된 여행 D-2
          </span>
          <span className="min-w-0 truncate text-[12px] font-medium text-[#52705a]">
            강릉 · 솔향 야간 버스킹 & 커피 페스타
          </span>
        </div>

        <section className="min-h-0 flex-1 overflow-y-auto px-5 pt-5 pb-7">
          <Link
            href="/plan"
            className="relative isolate block w-full overflow-hidden rounded-[24px] bg-[linear-gradient(125deg,#12592C,#287446)] p-5 text-left shadow-[0_10px_26px_rgba(18,89,44,0.12)]"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-8 -bottom-16 -z-10 size-48 rounded-full border-[24px] border-[#a6d4ad]/10"
            />
            <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.06em] text-[#c8f0d5]">
              <CalendarDays size={15} />
              나의 스케줄
            </div>
            <div className="mt-3 text-[20px] leading-snug font-bold break-keep text-white">
              2026 강릉 솔향 야간 버스킹 & 커피 페스타
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="min-w-0 truncate text-[13px] text-white/80">
                안목 커피거리 · 3일 살기
              </span>
              <span className="shrink-0 rounded-full bg-white px-3.5 py-2 text-xs font-bold text-[#12592C]">
                내 플랜 보기
              </span>
            </div>
          </Link>

          <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                aria-pressed={activeFilter === filter}
                className={`shrink-0 rounded-full border px-4 py-2.5 text-sm font-bold transition ${
                  activeFilter === filter
                    ? "border-[#12592C] bg-[#12592C] text-white"
                    : "border-[#dce7df] bg-white text-[#617668] hover:border-[#95bba1]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="mt-5 flex items-baseline justify-between gap-4">
            <h1 className="text-[19px] font-bold tracking-tight text-[#24432d]">
              취향에 맞는 마을 소식
            </h1>
            <span className="text-xs text-[#8a938c]">18건</span>
          </div>

          <div className="mt-4 grid gap-4">
            {visibleEvents.map((event) => (
              <Link
                href="/event"
                key={event.title}
                className="overflow-hidden rounded-[22px] border border-[#e0e9e2] bg-white shadow-[0_5px_18px_rgba(25,65,35,0.04)] transition-shadow hover:shadow-[0_8px_24px_rgba(25,65,35,0.09)]"
              >
                <div
                  className="relative h-[148px] bg-cover bg-center"
                  style={{ backgroundImage: `url(${event.image})` }}
                >
                  <div className="absolute inset-0 bg-black/10" />
                  <span className="absolute top-3 left-3 rounded-full bg-[#12592C]/95 px-3 py-1.5 text-[11px] font-bold text-white">
                    매칭률 {event.rate}
                  </span>
                  <span className="absolute top-3 right-3 rounded-full bg-white/92 px-3 py-1 text-[11px] font-bold text-[#16211a]">
                    {event.dday}
                  </span>
                </div>

                <div className="p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-[#EAF6EE] px-2 py-1 text-[11px] font-bold text-[#1E7F3C]">
                      {event.region}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-[#F2F4F2] px-2 py-1 text-[11px] font-bold text-[#7b847d]">
                      <Sparkles size={12} />
                      {event.category}
                    </span>
                  </div>
                  <h2 className="mt-3 text-[18px] leading-snug font-bold break-keep text-[#24432d]">
                    {event.title}
                  </h2>
                  <p className="mt-2 text-[13px] leading-6 text-[#738378]">
                    {event.desc}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#edf2ee] pt-3">
                    <span className="text-xs font-medium text-[#809086]">
                      {event.date}
                    </span>
                    <span className="shrink-0 rounded-xl bg-[#EAF6EE] px-3.5 py-2.5 text-xs font-bold text-[#12592C]">
                      일정 플랜 선택
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <h2 className="mt-8 text-[19px] font-bold tracking-tight text-[#24432d]">
            실시간 인기 축제 TOP
          </h2>

          <div className="mt-4 overflow-hidden rounded-[22px] border border-[#e0e9e2] bg-white">
            {visibleTops.map(([no, title, meta], index) => (
              <div
                key={title}
                className="flex items-center gap-3 border-b border-[#edf2ee] px-4 py-4 last:border-b-0"
              >
                <div
                  className={`flex size-7 shrink-0 items-center justify-center rounded-lg text-xs font-extrabold ${
                    index === 0
                      ? "bg-[#12592C] text-white"
                      : "bg-[#EDF1EE] text-[#8a938c]"
                  }`}
                >
                  {no}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold text-[#16211a]">
                    {title}
                  </div>
                  <div className="mt-0.5 flex items-center gap-1 text-[11px] text-[#8a938c]">
                    <MapPin size={12} />
                    <span className="truncate">{meta}</span>
                  </div>
                </div>
                <button className="shrink-0 rounded-[9px] border border-[#cfe0d5] bg-[#EAF6EE] px-2.5 py-2 text-[11px] font-bold text-[#1E7F3C]">
                  플랜 선택
                </button>
              </div>
            ))}
            <button
              onClick={() => setTopsOpen((open) => !open)}
              aria-expanded={topsOpen}
              className="flex w-full items-center justify-center gap-1 bg-[#FAFCFB] px-3 py-3 text-sm font-bold text-[#1E7F3C]"
            >
              {topsOpen ? (
                <>
                  접기 <ChevronUp size={16} />
                </>
              ) : (
                <>
                  TOP 100 더보기 <ChevronDown size={16} />
                </>
              )}
            </button>
          </div>
        </section>

        <nav
          aria-label="메인 메뉴"
          className="grid min-h-[72px] shrink-0 grid-cols-4 border-t border-[#e0e9e2] bg-white px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
        >
          {tabs.map(({ label, Icon, active }) => (
            <Link
              href={
                label === "마이로컬"
                  ? "/plan"
                  : label === "미션"
                    ? "/mission"
                    : label === "MY"
                      ? "/my"
                      : "/home"
              }
              key={label}
              aria-current={active ? "page" : undefined}
              className="flex flex-col items-center justify-center gap-1"
            >
              <span
                className={`flex h-8 w-12 items-center justify-center rounded-full ${active ? "bg-[#EAF6EE]" : ""}`}
              >
                <Icon
                  size={20}
                  className={active ? "text-[#1E7F3C]" : "text-[#98a19a]"}
                />
              </span>
              <span
                className={`text-[11px] ${
                  active
                    ? "font-bold text-[#12592C]"
                    : "font-medium text-[#98a19a]"
                }`}
              >
                {label}
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </main>
  );
}

function HeaderIcon({
  children,
  label,
  badge = false
}: Readonly<{
  children: React.ReactNode;
  label: string;
  badge?: boolean;
}>) {
  return (
    <button
      aria-label={label}
      className="relative flex size-[26px] items-center justify-center rounded-[9px] bg-white/16 text-white"
    >
      {children}
      {badge ? (
        <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-[#ff6b4a]" />
      ) : null}
    </button>
  );
}
