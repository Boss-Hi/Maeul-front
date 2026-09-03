import {
  ArrowLeft,
  BadgeCheck,
  Bike,
  BookOpenText,
  CalendarDays,
  Camera,
  ClipboardCheck,
  CircleUserRound,
  Coffee,
  Footprints,
  Handshake,
  HeartHandshake,
  Mountain,
  Music2,
  Palette,
  Search,
  Sparkles,
  Star,
  Store,
  Trophy,
  UsersRound,
  Utensils,
  Waves
} from "lucide-react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type BadgeItem = {
  name: string;
  group: string;
  cond: string;
  earned: boolean;
  progress: string;
  mark: string;
  Icon: LucideIcon;
  color: string;
  soft: string;
};

const groups = ["전체", "로컬 루틴", "취향 탐색", "함께하기", "시즌 챌린지"];

const badges: BadgeItem[] = [
  {
    name: "바다책방 독서광",
    group: "취향 탐색",
    cond: "바다 보이는 로컬 서점 2곳에서 각 30분 이상 독서 인증",
    earned: false,
    progress: "2/3",
    mark: "BOOK",
    Icon: BookOpenText,
    color: "#1E7F3C",
    soft: "#EAF6EE"
  },
  {
    name: "로스터리 메이트",
    group: "취향 탐색",
    cond: "로스터리 3곳을 팀으로 방문하고 테이스팅 기록 남기기",
    earned: true,
    progress: "3/3",
    mark: "CAFE",
    Icon: Coffee,
    color: "#8a5a12",
    soft: "#FBF0DA"
  },
  {
    name: "마을길 투어왕",
    group: "로컬 루틴",
    cond: "서로 다른 동네 코스 3곳에서 산책 미션 클리어",
    earned: false,
    progress: "2/3",
    mark: "TOUR",
    Icon: Mountain,
    color: "#2b6cb0",
    soft: "#E8F1FB"
  },
  {
    name: "파도 입문자",
    group: "취향 탐색",
    cond: "해변 액티비티 참여 후 현장 인증",
    earned: false,
    progress: "0/1",
    mark: "WAVE",
    Icon: Waves,
    color: "#2d8c9c",
    soft: "#E6F6F7"
  },
  {
    name: "야간 공연러",
    group: "시즌 챌린지",
    cond: "야간 버스킹 2팀 관람 후 한 줄 후기 남기기",
    earned: false,
    progress: "1/2",
    mark: "LIVE",
    Icon: Music2,
    color: "#8b4bb3",
    soft: "#F1E9F7"
  },
  {
    name: "로컬 미식가",
    group: "로컬 루틴",
    cond: "추천 로컬 식당 3곳 방문 인증",
    earned: false,
    progress: "2/3",
    mark: "FOOD",
    Icon: Utensils,
    color: "#c6532d",
    soft: "#FDEDE8"
  },
  {
    name: "기록 여행자",
    group: "로컬 루틴",
    cond: "추천 동선 안의 포토 스팟 4곳 기록",
    earned: false,
    progress: "3/4",
    mark: "SHOT",
    Icon: Camera,
    color: "#5b668c",
    soft: "#EEF0F7"
  },
  {
    name: "오천보 산책러",
    group: "로컬 루틴",
    cond: "추천 산책 코스에서 5천 보 이상 걷기",
    earned: true,
    progress: "1/1",
    mark: "WALK",
    Icon: Footprints,
    color: "#6b7f2a",
    soft: "#F0F5DE"
  },
  {
    name: "해변 라이더",
    group: "로컬 루틴",
    cond: "자전거로 해변-시장-숙소 동선 완주",
    earned: false,
    progress: "0/1",
    mark: "RIDE",
    Icon: Bike,
    color: "#287681",
    soft: "#E6F3F4"
  },
  {
    name: "4인 페스타 완주",
    group: "함께하기",
    cond: "4명이 서로 다른 커피 페스타 부스 스탬프 모으기",
    earned: false,
    progress: "0/4",
    mark: "TEAM",
    Icon: UsersRound,
    color: "#9d6b16",
    soft: "#FBF0DA"
  },
  {
    name: "마을 새싹 주민",
    group: "시즌 챌린지",
    cond: "첫 지역 체류 플랜과 첫 미션 달성",
    earned: true,
    progress: "2/2",
    mark: "MAEUL",
    Icon: Sparkles,
    color: "#15945a",
    soft: "#E7F8EF"
  },
  {
    name: "시즌 챔피언",
    group: "시즌 챌린지",
    cond: "시즌 대표 미션 3종 모두 달성",
    earned: false,
    progress: "1/3",
    mark: "CROWN",
    Icon: Trophy,
    color: "#b68118",
    soft: "#FFF2D2"
  },
  {
    name: "시장 탐험가",
    group: "로컬 루틴",
    cond: "전통시장 추천 점포 5곳 방문",
    earned: false,
    progress: "3/5",
    mark: "MARKET",
    Icon: Store,
    color: "#b64d32",
    soft: "#FCECE7"
  },
  {
    name: "공방 체험러",
    group: "취향 탐색",
    cond: "로컬 공방 클래스 2회 참여",
    earned: false,
    progress: "1/2",
    mark: "CRAFT",
    Icon: Palette,
    color: "#7b4ca0",
    soft: "#F0E8F6"
  },
  {
    name: "친절한 동행",
    group: "함께하기",
    cond: "팀 미션 후 좋은 평가 5회 받기",
    earned: false,
    progress: "4/5",
    mark: "MATE",
    Icon: HeartHandshake,
    color: "#c45172",
    soft: "#FBEAF0"
  },
  {
    name: "약속 지킴이",
    group: "함께하기",
    cond: "팀 미션 약속 시간 3회 지키기",
    earned: true,
    progress: "3/3",
    mark: "PROMISE",
    Icon: Handshake,
    color: "#287681",
    soft: "#E6F3F4"
  },
  {
    name: "미션 기록관",
    group: "시즌 챌린지",
    cond: "미션 리포트 10개 남기기",
    earned: false,
    progress: "7/10",
    mark: "LOG",
    Icon: ClipboardCheck,
    color: "#5b668c",
    soft: "#EEF0F7"
  },
  {
    name: "별빛 체류자",
    group: "시즌 챌린지",
    cond: "야간 콘텐츠 미션 5회 달성",
    earned: false,
    progress: "2/5",
    mark: "NIGHT",
    Icon: Star,
    color: "#7357b8",
    soft: "#EEE9FA"
  }
];

const tabs = [
  { label: "탐색", Icon: Search, href: "/home", active: false },
  { label: "마이로컬", Icon: CalendarDays, href: "/plan", active: false },
  { label: "미션", Icon: Star, href: "/mission", active: true },
  { label: "MY", Icon: CircleUserRound, href: "/my", active: false }
];

export default function BedgePage() {
  const earnedCount = badges.filter((badge) => badge.earned).length;
  const remainingCount = badges.length - earnedCount;
  const completionRate = Math.round((earnedCount / badges.length) * 100);

  return (
    <main className="h-lvh overflow-hidden bg-[#e7eae7] text-[#16211a]">
      <div className="mx-auto flex h-lvh w-full max-w-[600px] flex-col overflow-hidden bg-[#F5F8F6] shadow-[0_0_38px_rgba(20,34,25,0.08)]">
        <header className="shrink-0 bg-[#12592C] px-5 py-4 text-white">
          <div className="flex items-center gap-3">
            <Link
              href="/mission"
              aria-label="미션으로 돌아가기"
              className="flex size-9 items-center justify-center rounded-xl bg-white/14"
            >
              <ArrowLeft size={18} />
            </Link>
            <div className="min-w-0">
              <div className="text-[11px] font-bold tracking-[0.08em] text-[#a9e6bd]">
                BADGE COLLECTION
              </div>
              <h1 className="mt-1 truncate text-[22px] font-black text-white">
                배지 보관함
              </h1>
            </div>
          </div>
        </header>

        <section className="min-h-0 flex-1 overflow-y-auto px-5 pt-4 pb-24">
          <div className="rounded-[18px] bg-[linear-gradient(135deg,#16211a,#26392d)] p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-[12px] font-bold text-[#8fdca8]">
                  로컬 미션 배지
                </div>
                <div className="mt-1 text-[26px] font-black text-white">
                  {earnedCount} / {badges.length}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {badges.slice(0, 12).map((badge) => (
                  <div
                    key={badge.name}
                    className="flex size-8 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: badge.earned
                        ? badge.soft
                        : "rgba(255,255,255,.1)",
                      color: badge.earned
                        ? badge.color
                        : "rgba(255,255,255,.42)"
                    }}
                  >
                    <badge.Icon size={15} strokeWidth={2.5} />
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/14">
              <div
                className="h-full rounded-full bg-[#8fdca8]"
                style={{ width: `${(earnedCount / badges.length) * 100}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px]">
              <span className="text-white/55">
                컬렉션 달성률 {completionRate}%
              </span>
              <span className="font-bold text-[#8fdca8]">
                남은 배지 {remainingCount}개
              </span>
            </div>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {groups.map((group) => (
              <button
                key={group}
                className={`shrink-0 rounded-full border px-4 py-2.5 text-sm font-bold ${
                  group === "전체"
                    ? "border-[#1E7F3C] bg-[#1E7F3C] text-white"
                    : "border-black/8 bg-white text-[#4a544c]"
                }`}
              >
                {group}
              </button>
            ))}
          </div>

          <div className="mt-5 flex items-baseline justify-between gap-4">
            <h2 className="text-[18px] font-black text-[#16211a]">
              배지 타입 모음
            </h2>
            <span className="text-xs font-medium text-[#8a938c]">
              {badges.length}개
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2.5">
            {badges.map((badge) => (
              <BadgeCard key={badge.name} badge={badge} />
            ))}
          </div>
        </section>

        <nav className="grid h-[72px] shrink-0 grid-cols-4 border-t border-black/6 bg-white px-3">
          {tabs.map(({ label, Icon, href, active }) => (
            <Link
              key={label}
              href={href}
              className="flex flex-col items-center justify-center gap-1.5"
            >
              <Icon
                size={20}
                className={active ? "text-[#1E7F3C]" : "text-[#98a19a]"}
              />
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

function BadgeCard({ badge }: Readonly<{ badge: BadgeItem }>) {
  return (
    <article
      className={`relative overflow-hidden rounded-2xl border border-black/6 bg-white p-3.5 ${
        badge.earned ? "" : "opacity-[.82]"
      }`}
    >
      <div
        className="absolute inset-x-0 top-0 h-[74px]"
        style={{
          background: `linear-gradient(135deg, ${badge.soft}, transparent 74%)`
        }}
      />
      <div
        className="absolute top-3 right-3 rounded-md px-2 py-1 text-[9px] font-black tracking-[0.08em]"
        style={{
          backgroundColor: badge.earned ? badge.color : "#EDF1EE",
          color: badge.earned ? "#ffffff" : "#98a19a"
        }}
      >
        {badge.mark}
      </div>

      <div
        className="relative flex size-[72px] items-center justify-center rounded-[24px] border bg-white shadow-[0_10px_22px_rgba(20,34,25,0.08)]"
        style={{
          borderColor: badge.earned ? `${badge.color}30` : "#dfe5e1",
          color: badge.earned ? badge.color : "#98a19a"
        }}
      >
        <div
          className="absolute inset-2 rounded-[19px]"
          style={{ backgroundColor: badge.earned ? badge.soft : "#EDF1EE" }}
        />
        <badge.Icon className="relative" size={30} strokeWidth={2.4} />
      </div>

      <div className="relative mt-3 flex items-center gap-1.5">
        <span
          className="rounded-md px-2 py-1 text-[10px] font-black"
          style={{
            backgroundColor: badge.earned ? badge.soft : "#EDF1EE",
            color: badge.earned ? badge.color : "#8a938c"
          }}
        >
          {badge.group}
        </span>
        {badge.earned ? (
          <BadgeCheck size={15} className="text-[#1E7F3C]" />
        ) : null}
      </div>

      <h3 className="relative mt-2 text-[14px] leading-snug font-black text-[#16211a]">
        {badge.name}
      </h3>
      <p className="relative mt-1.5 min-h-[48px] text-[11px] leading-relaxed text-[#8a938c]">
        {badge.cond}
      </p>

      <div className="relative mt-3 flex items-center justify-between gap-2">
        <span className="text-[10px] font-bold text-[#8a938c]">
          {badge.earned ? "획득" : "남은 조건"}
        </span>
        <span className="rounded-full bg-[#F2F4F2] px-2.5 py-1 text-[10px] font-black text-[#4a544c]">
          {badge.progress}
        </span>
      </div>
    </article>
  );
}
