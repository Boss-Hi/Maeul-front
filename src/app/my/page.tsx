import {
  BadgeCheck,
  BookOpenText,
  CalendarDays,
  ChevronLeft,
  CircleUserRound,
  Coffee,
  HeartHandshake,
  MapPin,
  MessageCircle,
  Search,
  Settings,
  Star,
  Trophy,
  UsersRound
} from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "완료 미션", value: "12" },
  { label: "획득 배지", value: "4" },
  { label: "메이트", value: "8" }
];

const badges = [
  { name: "로스터리 메이트", date: "2026.08.02", Icon: Coffee },
  { name: "오천보 산책러", date: "2026.07.28", Icon: Trophy },
  { name: "마을 새싹 주민", date: "2026.07.18", Icon: BadgeCheck }
];

const mates = [
  {
    name: "김민준 · 28",
    meta: "Lv.3 주민 · 함께한 미션 2회",
    tag: "강릉 메이트"
  },
  {
    name: "박서연 · 31",
    meta: "Lv.4 메이트 · 최근 8/02",
    tag: "커피 취향"
  }
];

const activities = [
  ["오늘", "바다책방 독서 미션 2/3 달성"],
  ["8/17", "이도현님과 팀 미션 제안 대기"],
  ["8/02", "로스터리 메이트 배지 획득"]
];

const tabs = [
  { label: "탐색", Icon: Search, href: "/", active: false },
  { label: "마이로컬", Icon: CalendarDays, href: "/plan", active: false },
  { label: "미션", Icon: Star, href: "/mission", active: false },
  { label: "MY", Icon: CircleUserRound, href: "/my", active: true }
];

export default function MyPage() {
  return (
    <main className="h-lvh overflow-hidden bg-[#e7eae7] text-[#16211a]">
      <div className="mx-auto flex h-lvh w-full max-w-[600px] flex-col overflow-hidden bg-[#F5F8F6] shadow-[0_0_38px_rgba(20,34,25,0.08)]">
        <header className="shrink-0 bg-[#12592C] px-5 py-4 text-white">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <Link
                href="/"
                aria-label="메인 탐색으로 돌아가기"
                className="flex size-9 items-center justify-center rounded-xl bg-white/14"
              >
                <ChevronLeft size={20} />
              </Link>
              <div className="min-w-0">
                <div className="text-[11px] font-bold tracking-[0.08em] text-[#a9e6bd]">
                  MY LOCAL PROFILE
                </div>
                <h1 className="mt-1 truncate text-[20px] font-black text-white">
                  마이페이지
                </h1>
              </div>
            </div>
            <button
              aria-label="설정"
              className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/14"
            >
              <Settings size={18} />
            </button>
          </div>
        </header>

        <section className="min-h-0 flex-1 overflow-y-auto px-5 pt-4 pb-24">
          <div className="rounded-[18px] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-4">
              <div className="flex size-[72px] shrink-0 items-center justify-center rounded-[24px] bg-[#EAF6EE] text-[#1E7F3C]">
                <CircleUserRound size={42} strokeWidth={1.8} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="truncate text-[21px] font-black text-[#16211a]">
                    데이비드
                  </h2>
                  <span className="shrink-0 rounded-full bg-[#16211a] px-2.5 py-1 text-[10px] font-black text-[#8fdca8]">
                    Lv.3 주민
                  </span>
                </div>
                <p className="mt-1.5 text-[12px] leading-relaxed text-[#7b847d]">
                  커피 · 독서 · 워케이션을 좋아하는 강릉 체류자
                </p>
              </div>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#EDF1EE]">
              <div className="h-full w-[68%] rounded-full bg-[#1E7F3C]" />
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px]">
              <span className="font-medium text-[#8a938c]">다음 레벨까지</span>
              <span className="font-bold text-[#1E7F3C]">68 / 100점</span>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[13px] border border-black/6 bg-white p-3"
              >
                <div className="text-[11px] font-medium text-[#8a938c]">
                  {stat.label}
                </div>
                <div className="mt-1 text-[19px] font-black text-[#16211a]">
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/plan"
            className="mt-4 block rounded-2xl border border-[#cfe0d5] bg-[#EAF6EE] p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#1E7F3C]">
                  <MapPin size={15} />
                  현재 체류
                </div>
                <div className="mt-1.5 truncate text-[16px] font-black text-[#16211a]">
                  강릉 3일 살기 · Day 2
                </div>
                <div className="mt-1 truncate text-[12px] text-[#5f7266]">
                  안목 · 경포 동선에서 미션 진행 중
                </div>
              </div>
              <span className="shrink-0 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-[#1E7F3C]">
                플랜 보기
              </span>
            </div>
          </Link>

          <div className="mt-5 flex items-center justify-between gap-3">
            <h2 className="text-[17px] font-black text-[#16211a]">
              획득한 배지
            </h2>
            <Link
              href="/bedge"
              className="text-[12px] font-bold text-[#1E7F3C]"
            >
              전체 보기
            </Link>
          </div>

          <div className="mt-3 grid gap-2.5">
            {badges.map(({ name, date, Icon }) => (
              <div
                key={name}
                className="flex items-center gap-3 rounded-2xl border border-black/6 bg-white p-3"
              >
                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#FBF0DA] text-[#8a5a12]">
                  <Icon size={22} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[14px] font-black text-[#16211a]">
                    {name}
                  </div>
                  <div className="mt-0.5 text-[11px] text-[#8a938c]">
                    {date} 획득
                  </div>
                </div>
                <BadgeCheck size={18} className="text-[#1E7F3C]" />
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between gap-3">
            <h2 className="text-[17px] font-black text-[#16211a]">
              나의 메이트
            </h2>
            <span className="text-[12px] font-medium text-[#8a938c]">8명</span>
          </div>

          <div className="mt-3 grid gap-2.5">
            {mates.map((mate) => (
              <div
                key={mate.name}
                className="flex items-center gap-3 rounded-2xl border border-black/6 bg-white p-3"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#EDF1EE] text-[#1E7F3C]">
                  <UsersRound size={20} />
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
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-black/6 bg-white p-4">
            <div className="flex items-center gap-2">
              <HeartHandshake size={18} className="text-[#1E7F3C]" />
              <h2 className="text-[16px] font-black text-[#16211a]">
                최근 활동
              </h2>
            </div>
            <div className="mt-4 grid gap-3">
              {activities.map(([date, text]) => (
                <div key={`${date}-${text}`} className="flex gap-3">
                  <div className="w-10 shrink-0 text-[11px] font-black text-[#8a938c]">
                    {date}
                  </div>
                  <div className="min-w-0 flex-1 text-[13px] font-bold text-[#4a544c]">
                    {text}
                  </div>
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
                팀 미션 연락
              </div>
              <div className="mt-1 truncate text-[12px] text-[#7b847d]">
                이도현 · 26 · 제안 대기중
              </div>
            </div>
            <span className="rounded-full bg-[#FBF0DA] px-3 py-1.5 text-[11px] font-bold text-[#8a5a12]">
              대기 1
            </span>
          </Link>

          <div className="mt-5 rounded-2xl border border-black/6 bg-white p-4">
            <div className="flex items-center gap-2">
              <BookOpenText size={18} className="text-[#1E7F3C]" />
              <h2 className="text-[16px] font-black text-[#16211a]">
                관심 태그
              </h2>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {["커피", "독서", "워케이션", "산책", "로컬 맛집"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[#F2F4F2] px-3 py-2 text-[12px] font-bold text-[#4a544c]"
                >
                  {tag}
                </span>
              ))}
            </div>
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
