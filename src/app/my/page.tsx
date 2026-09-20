import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  ChevronRight,
  CircleUserRound,
  Coffee,
  Leaf,
  MapPin,
  Search,
  Settings,
  Sprout,
  Star,
  Tag,
  Trophy
} from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "완료 미션", value: "12", Icon: Leaf },
  { label: "획득 배지", value: "4", Icon: Sprout }
];

const badges = [
  { name: "로스터리 메이트", date: "2026.08.02", Icon: Coffee },
  { name: "오래된 생각줍기", date: "2026.07.28", Icon: Trophy },
  { name: "마을 새싹 주민", date: "2026.07.18", Icon: BadgeCheck }
];

const tabs = [
  { label: "탐색", Icon: Search, href: "/home", active: false },
  { label: "마이로컬", Icon: CalendarDays, href: "/plan", active: false },
  { label: "미션", Icon: Star, href: "/mission", active: false },
  { label: "MY", Icon: CircleUserRound, href: "/my", active: true }
];

export default function MyPage() {
  return (
    <main className="h-dvh overflow-hidden bg-[#e8efed] text-[#24584d]">
      <div className="mx-auto flex h-dvh w-full max-w-[1080px] flex-col overflow-hidden bg-[#f8fbf6] shadow-[0_0_60px_rgba(49,95,80,0.07)]">
        <section className="min-h-0 flex-1 overflow-y-auto">
          <header className="relative min-h-[250px] overflow-hidden bg-[#c7e9ef] bg-[url('/images/profile-hero-v2.png')] bg-cover bg-center px-5 pt-7">
            <div className="absolute inset-0 bg-[#f7fbf62b]" />
            <div className="relative flex items-center justify-between">
              <Link
                href="/home"
                aria-label="탐색으로 돌아가기"
                className="flex size-10 items-center justify-center rounded-full border border-white/85 bg-[#fffefbeb] text-[#315f50]"
              >
                <ArrowLeft size={20} />
              </Link>
              <button
                aria-label="설정"
                className="flex size-10 items-center justify-center rounded-full border border-white/85 bg-[#fffefbeb] text-[#315f50]"
              >
                <Settings size={20} />
              </button>
            </div>
            <div className="relative mt-3.5 max-w-[500px]">
              <p className="text-[11px] leading-[1.8] font-bold text-[#315f50]">
                MY LOCAL PROFILE
              </p>
              <h1 className="mt-2.5 text-[32px] leading-[1.2] font-black text-[#205b52]">
                마이페이지
              </h1>
            </div>
          </header>

          <div className="relative -mt-[30px] rounded-t-[30px] border-t-[5px] border-[#fffefb] bg-[#f8fbf6] px-4 pt-3 pb-7 sm:px-6">
            <section className="relative overflow-hidden rounded-[24px] border border-[#dce7d8] bg-[#fffefbed] p-4 shadow-[0_5px_18px_rgba(49,95,80,0.06)] sm:p-5">
              <Leaf className="absolute -right-3 bottom-1 size-20 rotate-[20deg] text-[#b6d9ae]/55" />
              <div className="relative flex items-center gap-3.5">
                <div className="flex size-[74px] shrink-0 items-center justify-center rounded-[24px] bg-[#e7f4e8] text-[#4b906c] shadow-inner">
                  <CircleUserRound size={43} strokeWidth={1.7} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="truncate text-[24px] font-black tracking-normal text-[#24584d]">
                      데이비드
                    </h1>
                  </div>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-[#72877a]">
                    커피와 독서를 좋아하는 강릉 체류자
                  </p>
                </div>
              </div>
            </section>

            <div className="mt-3 grid grid-cols-2 gap-2.5">
              {stats.map(({ label, value, Icon }) => (
                <div
                  key={label}
                  className="rounded-[20px] border border-[#dce7d8] bg-[#fffefbe8] p-4"
                >
                  <div className="flex items-center gap-2 text-[13px] font-bold text-[#579167]">
                    <Icon size={19} />
                    {label}
                  </div>
                  <strong className="mt-2 block text-[27px] leading-none text-[#24584d]">
                    {value}
                  </strong>
                </div>
              ))}
            </div>

            <Link
              href="/plan"
              className="relative mt-5 block overflow-hidden rounded-[22px] border border-[#c9e5cf] bg-[#eff9ed] bg-cover bg-center p-4 shadow-[0_4px_14px_rgba(49,95,80,0.04)]"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, rgba(239,249,237,0.96), rgba(239,249,237,0.83), rgba(239,249,237,0.58)), url('/images/regions/gangneung.webp')"
              }}
            >
              <Leaf className="absolute -right-4 -bottom-5 size-24 rotate-[28deg] text-[#a7d1a7]/60" />
              <div className="relative flex items-center gap-3">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[#c9e5cf] bg-white text-[#4b906c]">
                  <MapPin size={25} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-bold text-[#579167]">
                    진행 중인 축제
                  </p>
                  <h2 className="mt-1 truncate text-[17px] font-black text-[#24584d]">
                    강릉 3일 살기 · Day 2
                  </h2>
                  <span className="mt-1 block truncate text-[12px] text-[#72877a]">
                    강릉 해변에서 머문 인증 중
                  </span>
                </div>
                <span className="flex shrink-0 items-center gap-1 rounded-full border border-[#d5e8d6] bg-white px-3 py-2 text-[11px] font-bold text-[#397757]">
                  플랜 보기 <ChevronRight size={14} />
                </span>
              </div>
            </Link>

            <section className="mt-5 rounded-[20px] border border-[#dce7d8] bg-[#fffefbe8] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="flex items-center gap-2 text-[17px] font-black text-[#24584d]">
                    <Tag size={19} className="text-[#64a071]" /> 나를 보여주는
                    취향
                  </h2>
                  <p className="mt-1.5 text-[12px] text-[#72877a]">
                    커피와 독서, 느긋한 동네 산책을 좋아해요.
                  </p>
                </div>
                <Link
                  href="/onboarding"
                  className="flex shrink-0 items-center gap-0.5 text-[12px] font-bold text-[#579167]"
                >
                  수정하기 <ChevronRight size={15} />
                </Link>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {["커피", "독서", "음악/공연", "로컬 맛집", "바다/자연"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[#eff5ed] px-3 py-2 text-[12px] font-bold text-[#5b7865]"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </section>

            <SectionHeading icon={Leaf} title="획득한 배지" link="/bedge" />
            <div className="mt-3 grid gap-2.5">
              {badges.map(({ name, date, Icon }) => (
                <Link
                  key={name}
                  href="/bedge"
                  className="flex items-center gap-3 rounded-[20px] border border-[#dce7d8] bg-[#fffefbe8] p-3.5"
                >
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#fff3da] text-[#b98535]">
                    <Icon size={23} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-[15px] font-black text-[#24584d]">
                      {name}
                    </h3>
                    <p className="mt-0.5 text-[12px] text-[#87958b]">
                      {date} 획득
                    </p>
                  </div>
                  <BadgeCheck size={19} className="shrink-0 text-[#71ad79]" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <nav className="grid h-[74px] shrink-0 grid-cols-4 border-t border-[#dce7d8] bg-[#fffefbf2] px-3 backdrop-blur-sm">
          {tabs.map(({ label, Icon, href, active }) => (
            <Link
              key={label}
              href={href}
              className="flex flex-col items-center justify-center gap-1.5"
            >
              <Icon
                size={21}
                className={active ? "text-[#397757]" : "text-[#a3aaa4]"}
              />
              <span
                className={`text-[11px] ${active ? "font-bold text-[#397757]" : "font-medium text-[#98a19a]"}`}
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

function SectionHeading({
  icon: Icon,
  title,
  link
}: Readonly<{ icon: typeof Leaf; title: string; link?: string }>) {
  const content = (
    <>
      <span className="flex items-center gap-2 text-[18px] font-black text-[#24584d]">
        <Icon size={21} className="text-[#64a071]" />
        {title}
      </span>
      {link && (
        <span className="flex items-center gap-0.5 text-[12px] font-bold text-[#579167]">
          전체 보기 <ChevronRight size={15} />
        </span>
      )}
    </>
  );
  return link ? (
    <Link href={link} className="mt-6 flex items-center justify-between gap-3">
      {content}
    </Link>
  ) : (
    <div className="mt-6 flex items-center justify-between gap-3">
      {content}
    </div>
  );
}
