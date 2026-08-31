import {
  BookOpenText,
  CalendarDays,
  CheckCircle2,
  CircleUserRound,
  Coffee,
  MessageCircle,
  Mountain,
  Navigation,
  Search,
  Star,
  UsersRound,
  Waves
} from "lucide-react";
import Link from "next/link";

const missionSteps = [
  { label: "파도책방 안목점", state: "완료", active: true },
  { label: "고래책방 커피 코너", state: "진행 가능", active: true },
  { label: "30분 독서 인증", state: "대기", active: false }
];

const sameMates = [
  {
    name: "김민준 · 28",
    meta: "Lv.3 주민 · 강릉 3일 살기 · 반경 220m",
    tag: "같은 미션 진행 중",
    cta: "미션 같이하기 요청"
  },
  {
    name: "박서연 · 31",
    meta: "Lv.4 메이트 · 체류 일정 겹침 8/17-8/19",
    tag: "미션 클리어",
    cta: "가이드 요청"
  }
];

const badges = [
  {
    name: "바다책방 독서광",
    cond: "로컬 독서 미션 3회 클리어",
    state: "획득 예정",
    got: true,
    Icon: BookOpenText,
    color: "#1E7F3C",
    soft: "#EAF6EE",
    mark: "BOOK"
  },
  {
    name: "로스터리 메이트",
    cond: "로스터리 3곳 팀 미션",
    state: "2026.08.02 획득",
    got: true,
    Icon: Coffee,
    color: "#8a5a12",
    soft: "#FBF0DA",
    mark: "CAFE"
  },
  {
    name: "마을길 투어왕",
    cond: "서로 다른 동네 코스 미션 클리어 2/3",
    state: "진행 중",
    got: false,
    Icon: Mountain,
    color: "#2b6cb0",
    soft: "#E8F1FB",
    mark: "TOUR"
  },
  {
    name: "파도 입문자",
    cond: "해변 액티비티 미션 1회",
    state: "잠김",
    got: false,
    Icon: Waves,
    color: "#2d8c9c",
    soft: "#E6F6F7",
    mark: "WAVE"
  }
];

const tabs = [
  { label: "탐색", Icon: Search, href: "/", active: false },
  { label: "마이로컬", Icon: CalendarDays, href: "/plan", active: false },
  { label: "미션", Icon: Star, href: "/mission", active: true },
  { label: "MY", Icon: CircleUserRound, href: "/my", active: false }
];

export default function MissionPage() {
  return (
    <main className="h-lvh overflow-hidden bg-[#e7eae7] text-[#16211a]">
      <div className="mx-auto flex h-lvh w-full max-w-[600px] flex-col overflow-hidden bg-[#F5F8F6] shadow-[0_0_38px_rgba(20,34,25,0.08)]">
        <header className="shrink-0 bg-[#12592C] px-5 pt-4 pb-4 text-white">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="text-[11px] font-bold tracking-[0.08em] text-[#a9e6bd]">
                STEP 05 · 로컬 미션
              </div>
              <h1 className="mt-1 truncate text-[22px] font-black text-white">
                나의 미션
              </h1>
            </div>
            <Link
              href="/plan"
              className="flex h-9 shrink-0 items-center gap-1.5 rounded-xl bg-white/14 px-3 text-[12px] font-bold text-white"
            >
              <Navigation size={15} />
              플랜
            </Link>
          </div>
        </header>

        <section className="min-h-0 flex-1 overflow-y-auto px-5 pt-4 pb-24">
          <div className="rounded-[18px] bg-[linear-gradient(135deg,#16211a,#1f3527)] p-4 shadow-[0_12px_28px_rgba(22,33,26,0.18)]">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[11px] font-bold tracking-[0.06em] text-[#8fdca8]">
                진행 중
              </span>
              <span className="rounded-full bg-white/12 px-3 py-1.5 text-[11px] font-bold text-[#8fdca8]">
                체류 진행률 66%
              </span>
            </div>
            <h2 className="mt-3 text-[21px] leading-snug font-black text-white">
              강릉 독서 미션
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-white/68">
              바다 보이는 로컬 서점 2곳에서 각 30분 이상 독서하고, 장소 반경
              100m 안에서 인증해요.
            </p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/14">
              <div className="h-full w-2/3 rounded-full bg-[#8fdca8]" />
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="text-[11px] text-white/55">2/3 완료</span>
              <span className="text-[11px] font-bold text-[#8fdca8]">
                획득 예정 배지 · 강릉 독서광
              </span>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              ["남은 시간", "1일 8시간"],
              ["주변 체류자", "12명"],
              ["예상 점수", "+38점"]
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-[13px] border border-black/6 bg-white p-3"
              >
                <div className="text-[11px] font-medium text-[#8a938c]">
                  {label}
                </div>
                <div className="mt-1 text-[14px] font-black text-[#16211a]">
                  {value}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-black/6 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-[16px] font-black text-[#16211a]">
                인증 체크리스트
              </h2>
              <span className="rounded-full bg-[#EAF6EE] px-3 py-1.5 text-[11px] font-bold text-[#1E7F3C]">
                GPS 인증 가능
              </span>
            </div>
            <div className="mt-4 grid gap-3">
              {missionSteps.map((step, index) => (
                <div key={step.label} className="flex items-center gap-3">
                  <div
                    className={`flex size-8 shrink-0 items-center justify-center rounded-xl ${
                      step.active
                        ? "bg-[#1E7F3C] text-white"
                        : "bg-[#EDF1EE] text-[#98a19a]"
                    }`}
                  >
                    {step.active ? (
                      <CheckCircle2 size={17} />
                    ) : (
                      <span className="text-xs font-black">{index + 1}</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-black text-[#16211a]">
                      {step.label}
                    </div>
                    <div className="mt-0.5 text-[11px] font-medium text-[#8a938c]">
                      {step.state}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 rounded-2xl border border-[#f0d8a6] bg-[#FFF9EC] p-4">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#F4D690] text-[#8a5a12]">
                <UsersRound size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-black text-[#16211a]">
                  2인 팀 미션 제안 대기 중
                </div>
                <p className="mt-1 text-[12px] leading-relaxed text-[#8a6a2c]">
                  여행 50% 지점을 지나면 같은 미션을 하는 체류자와 팀 미션을 열
                  수 있어요.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3 rounded-2xl border border-[#cfe0d5] bg-[#EAF6EE] p-4">
            <h2 className="text-[16px] font-black text-[#12592C]">
              같은 미션 체류자
            </h2>
            <p className="mt-1 text-[12px] leading-relaxed text-[#3d6b4d]">
              진행 중이거나 체류 일정이 겹치는 사람만 보여줘요.
            </p>
            <div className="mt-3 grid gap-2.5">
              {sameMates.map((mate) => (
                <div key={mate.name} className="rounded-[13px] bg-white p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#EDF1EE] text-[#1E7F3C]">
                      <CircleUserRound size={21} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-black text-[#16211a]">
                        {mate.name}
                      </div>
                      <div className="mt-0.5 truncate text-[11px] text-[#8a938c]">
                        {mate.meta}
                      </div>
                    </div>
                    <span className="shrink-0 rounded-full bg-[#EAF6EE] px-2.5 py-1 text-[10px] font-bold text-[#1E7F3C]">
                      {mate.tag}
                    </span>
                  </div>
                  <button className="mt-3 h-10 w-full rounded-xl border border-[#cfe0d5] bg-[#F8FCF9] text-[12px] font-bold text-[#1E7F3C]">
                    {mate.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/mission"
            className="mt-3 flex items-center gap-3 rounded-2xl border border-black/7 bg-white p-4"
          >
            <MessageCircle size={20} className="text-[#1E7F3C]" />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-black text-[#16211a]">
                메시지 · 팀 미션 연락
              </div>
              <div className="mt-1 truncate text-[12px] text-[#7b847d]">
                이도현 · 26 · 제안 대기중
              </div>
            </div>
            <span className="rounded-full bg-[#FBF0DA] px-3 py-1.5 text-[11px] font-bold text-[#8a5a12]">
              대기 1
            </span>
          </Link>

          <h2 className="mt-6 text-[17px] font-black text-[#16211a]">
            배지 컬렉션
          </h2>
          <div className="mt-2 flex justify-end">
            <Link
              href="/bedge"
              className="rounded-full bg-[#EAF6EE] px-3 py-1.5 text-[11px] font-bold text-[#1E7F3C]"
            >
              전체 배지 보기
            </Link>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2.5">
            {badges.map((badge) => (
              <div
                key={badge.name}
                className={`relative overflow-hidden rounded-2xl border bg-white p-3.5 ${
                  badge.got ? "border-black/6" : "border-black/6 opacity-72"
                }`}
              >
                <div
                  className="absolute inset-x-0 top-0 h-16"
                  style={{
                    background: `linear-gradient(135deg, ${badge.soft}, transparent 76%)`
                  }}
                />
                <div
                  className="absolute top-3 right-3 rounded-md px-2 py-1 text-[9px] font-black tracking-[0.08em]"
                  style={{
                    backgroundColor: badge.got ? badge.color : "#EDF1EE",
                    color: badge.got ? "#ffffff" : "#98a19a"
                  }}
                >
                  {badge.mark}
                </div>

                <div
                  className="relative flex size-[66px] items-center justify-center rounded-[22px] border bg-white shadow-[0_10px_22px_rgba(20,34,25,0.08)]"
                  style={{
                    borderColor: badge.got ? `${badge.color}30` : "#dfe5e1",
                    color: badge.got ? badge.color : "#98a19a"
                  }}
                >
                  <div
                    className="absolute inset-2 rounded-[17px]"
                    style={{
                      backgroundColor: badge.got ? badge.soft : "#EDF1EE"
                    }}
                  />
                  <badge.Icon
                    className="relative"
                    size={28}
                    strokeWidth={2.4}
                  />
                </div>
                <div className="relative mt-3 text-[13px] font-black text-[#16211a]">
                  {badge.name}
                </div>
                <div className="relative mt-1.5 min-h-8 text-[11px] leading-relaxed text-[#8a938c]">
                  {badge.cond}
                </div>
                <div
                  className="relative mt-3 inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold"
                  style={{
                    backgroundColor: badge.got ? badge.soft : "#EDF1EE",
                    color: badge.got ? badge.color : "#8a938c"
                  }}
                >
                  {badge.state}
                </div>
              </div>
            ))}
          </div>

          <button className="mt-4 flex h-[52px] w-full items-center justify-center rounded-[15px] bg-[#1E7F3C] text-[14px] font-bold text-white shadow-[0_6px_18px_rgba(30,127,60,0.24)]">
            미션 완료 인증하기
          </button>
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
