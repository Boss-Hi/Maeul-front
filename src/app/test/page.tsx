"use client";

import {
  Bell,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Home,
  MapPin,
  MessageCircle,
  Search,
  Stamp,
  Star,
  UserRound,
  UsersRound
} from "lucide-react";
import { useMemo, useState } from "react";

const filters = ["전체", "강릉", "속초", "전주"];

const villages = [
  {
    city: "강릉",
    fit: 98,
    title: "솔향 야간 버스킹 & 커피 페스타",
    location: "안목 커피거리 · 경포호수",
    date: "8.15 - 8.22",
    stay: "2박 3일 추천",
    mission: "바다 보이는 책방에서 30분 머물기",
    neighbors: "같은 미션 12명",
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80"
  },
  {
    city: "속초",
    fit: 91,
    title: "원도심 로스터리 커피 위크",
    location: "속초 원도심 · 로스터리 골목",
    date: "8.20 - 8.27",
    stay: "3박 4일 추천",
    mission: "로스터리 3곳에서 원두 취향 기록하기",
    neighbors: "같은 미션 8명",
    image:
      "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=900&q=80"
  },
  {
    city: "전주",
    fit: 88,
    title: "한옥마을 다도 & 명상 위크",
    location: "전주 한옥마을 · 공방 골목",
    date: "8.20 - 8.27",
    stay: "1주 살기 추천",
    mission: "한옥 골목에서 다도 클래스 참여하기",
    neighbors: "같은 미션 6명",
    image:
      "https://images.unsplash.com/photo-1538485399081-7c8ed6dc274d?auto=format&fit=crop&w=900&q=80"
  }
];

const rankings = [
  ["1", "강릉 솔향마을", "커피 · 책방 · 야간공연"],
  ["2", "속초 로스터리 골목", "커피 · 원도심 · 산책"],
  ["3", "양양 노을해변", "서핑 · 워케이션"],
  ["4", "전주 한옥마을", "다도 · 공방 · 명상"],
  ["5", "제주 조천 귤밭", "코리빙 · 오름 산책"]
];

const tabs = [
  { label: "마을", Icon: Home, active: true },
  { label: "여권", Icon: Stamp, active: false },
  { label: "미션", Icon: Star, active: false },
  { label: "주민", Icon: UserRound, active: false }
];

export default function TestPage() {
  const [activeFilter, setActiveFilter] = useState("전체");
  const [rankingOpen, setRankingOpen] = useState(false);

  const visibleVillages = useMemo(() => {
    if (activeFilter === "전체") return villages;
    return villages.filter((village) => village.city === activeFilter);
  }, [activeFilter]);

  const visibleRankings = rankingOpen ? rankings : rankings.slice(0, 3);

  return (
    <main className="h-lvh overflow-hidden bg-[#e9ece8] text-[#171f1a]">
      <div className="mx-auto flex h-lvh w-full max-w-[600px] flex-col overflow-hidden bg-[#f7f8f6]">
        <header className="shrink-0 bg-white px-5 pt-5 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-lg bg-[#1f8a4c] text-white">
                <Home size={19} fill="currentColor" strokeWidth={2.4} />
              </div>
              <span className="text-xl font-black tracking-[0.03em]">
                MAEUL
              </span>
            </div>

            <div className="flex items-center gap-2">
              <TopIcon label="메시지" badge>
                <MessageCircle size={18} />
              </TopIcon>
              <TopIcon label="이웃">
                <UsersRound size={18} />
              </TopIcon>
              <TopIcon label="알림">
                <Bell size={18} />
              </TopIcon>
            </div>
          </div>

          <button className="mt-5 flex h-12 w-full items-center gap-2.5 rounded-lg bg-[#f1f3f1] px-4 text-left">
            <Search size={19} className="shrink-0 text-[#7d8780]" />
            <span className="min-w-0 truncate text-[15px] font-semibold text-[#7d8780]">
              머물고 싶은 마을, 미션, 축제 검색
            </span>
          </button>
        </header>

        <section className="min-h-0 flex-1 overflow-y-auto px-5 pt-5 pb-24">
          <p className="text-[15px] font-bold text-[#69726c]">
            강릉에서 머무는 중
          </p>
          <h1 className="mt-1 text-[27px] leading-tight font-black tracking-normal">
            오늘은 어떤 마을 미션을
            <br />
            이어가볼까요?
          </h1>

          <button className="mt-5 w-full rounded-lg bg-white p-4 text-left shadow-[0_2px_10px_rgba(18,31,23,0.05)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-1.5 text-[13px] font-black text-[#1f8a4c]">
                  <Stamp size={16} />
                  나의 체류 여권
                </div>
                <div className="mt-2 text-[19px] leading-snug font-black">
                  강릉 솔향마을 3일 살이
                </div>
                <div className="mt-1 text-sm font-semibold text-[#7d8780]">
                  주민 Lv.3 · 도장 2개 완료
                </div>
              </div>
              <ChevronRight
                size={22}
                className="mt-1 shrink-0 text-[#a4aaa6]"
              />
            </div>

            <div className="mt-4 h-2 rounded-full bg-[#e7ece8]">
              <div className="h-full w-[62%] rounded-full bg-[#1f8a4c]" />
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="min-w-0 truncate text-sm font-bold text-[#555f58]">
                다음 미션 · 파도책방 30분 독서
              </span>
              <span className="shrink-0 text-sm font-black text-[#1f8a4c]">
                62%
              </span>
            </div>
          </button>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <button className="rounded-lg bg-[#fff4e9] p-4 text-left">
              <div className="flex size-8 items-center justify-center rounded-lg bg-[#ff7a1a] text-white">
                <CalendarDays size={18} />
              </div>
              <div className="mt-3 text-base font-black">체류 D-2</div>
              <div className="mt-1 text-sm font-semibold text-[#7a6250]">
                커피 페스타 예정
              </div>
            </button>
            <button className="rounded-lg bg-[#eef7f1] p-4 text-left">
              <div className="flex size-8 items-center justify-center rounded-lg bg-[#1f8a4c] text-white">
                <UsersRound size={18} />
              </div>
              <div className="mt-3 text-base font-black">이웃 12명</div>
              <div className="mt-1 text-sm font-semibold text-[#5b7163]">
                같은 미션 진행 중
              </div>
            </button>
          </div>

          <div className="mt-7 flex items-center justify-between">
            <h2 className="text-xl font-black">추천 마을</h2>
            <span className="text-sm font-bold text-[#8d9690]">맞춤순</span>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-bold transition ${
                  activeFilter === filter
                    ? "bg-[#171f1a] text-white"
                    : "bg-white text-[#555f58]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="mt-4 grid gap-3">
            {visibleVillages.map((village) => (
              <article
                key={village.title}
                className="rounded-lg bg-white p-3.5 shadow-[0_2px_10px_rgba(18,31,23,0.05)]"
              >
                <div className="flex gap-3.5">
                  <div
                    className="h-[104px] w-[104px] shrink-0 rounded-lg bg-cover bg-center"
                    style={{ backgroundImage: `url(${village.image})` }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="rounded-full bg-[#eef7f1] px-2 py-1 text-[11px] font-black text-[#1f8a4c]">
                        {village.fit}% 맞음
                      </span>
                      <span className="rounded-full bg-[#f3f4f3] px-2 py-1 text-[11px] font-bold text-[#69726c]">
                        {village.stay}
                      </span>
                    </div>
                    <h3 className="mt-2 text-[17px] leading-snug font-black">
                      {village.title}
                    </h3>
                    <div className="mt-1.5 flex items-center gap-1 text-[13px] font-semibold text-[#7d8780]">
                      <MapPin size={14} className="shrink-0" />
                      <span className="truncate">{village.location}</span>
                    </div>
                    <div className="mt-2 text-[13px] font-bold text-[#1f8a4c]">
                      {village.neighbors}
                    </div>
                  </div>
                </div>

                <div className="mt-3 rounded-lg bg-[#f7f8f6] px-3 py-2.5 text-[13px] font-bold text-[#555f58]">
                  {village.mission}
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-bold text-[#8d9690]">
                    {village.date}
                  </span>
                  <button className="rounded-lg bg-[#1f8a4c] px-4 py-2.5 text-sm font-black text-white">
                    머물기
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-7 flex items-center justify-between">
            <h2 className="text-xl font-black">요즘 뜨는 마을</h2>
            <button className="text-sm font-black text-[#1f8a4c]">전체</button>
          </div>

          <div className="mt-3 overflow-hidden rounded-lg bg-white shadow-[0_2px_10px_rgba(18,31,23,0.05)]">
            {visibleRankings.map(([rank, title, meta]) => (
              <button
                key={title}
                className="flex w-full items-center gap-3 border-b border-[#edf0ed] px-4 py-3.5 text-left last:border-b-0"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#f1f3f1] text-sm font-black text-[#1f8a4c]">
                  {rank}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-black">
                    {title}
                  </span>
                  <span className="mt-0.5 block truncate text-[13px] font-semibold text-[#8d9690]">
                    {meta}
                  </span>
                </span>
                <ChevronRight size={18} className="shrink-0 text-[#b4bab6]" />
              </button>
            ))}
            <button
              onClick={() => setRankingOpen((open) => !open)}
              className="flex w-full items-center justify-center gap-1 bg-white px-4 py-3 text-sm font-black text-[#1f8a4c]"
            >
              {rankingOpen ? (
                <>
                  접기 <ChevronUp size={16} />
                </>
              ) : (
                <>
                  더보기 <ChevronDown size={16} />
                </>
              )}
            </button>
          </div>
        </section>

        <nav className="grid h-[72px] shrink-0 grid-cols-4 border-t border-[#e6e9e6] bg-white px-3">
          {tabs.map(({ label, Icon, active }) => (
            <button
              key={label}
              className="flex flex-col items-center justify-center gap-1.5"
            >
              <Icon
                size={20}
                className={active ? "text-[#1f8a4c]" : "text-[#a5ada8]"}
                fill={active && label !== "미션" ? "currentColor" : "none"}
              />
              <span
                className={`text-[11px] ${
                  active
                    ? "font-black text-[#1f8a4c]"
                    : "font-bold text-[#a5ada8]"
                }`}
              >
                {label}
              </span>
            </button>
          ))}
        </nav>
      </div>
    </main>
  );
}

function TopIcon({
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
      className="relative flex size-9 items-center justify-center rounded-lg bg-[#f1f3f1] text-[#555f58]"
    >
      {children}
      {badge ? (
        <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-[#ff7a1a]" />
      ) : null}
    </button>
  );
}
