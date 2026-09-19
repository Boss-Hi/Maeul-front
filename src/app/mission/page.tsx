import {
  ArrowLeft,
  BookOpenText,
  Leaf,
  CalendarDays,
  CheckCircle2,
  CircleUserRound,
  Coffee,
  Mountain,
  Navigation,
  Search,
  Star,
  Waves
} from "lucide-react";
import Link from "next/link";
import styles from "./mission.module.css";

const missionSteps = [
  { label: "파도책방 안목점", state: "완료", active: true },
  { label: "고래책방 커피 코너", state: "진행 가능", active: true },
  { label: "30분 독서 인증", state: "대기", active: false }
];

/* TODO: 매칭·커뮤니티 시스템 도입 시 예시 체류자를 실제 매칭 API 데이터로 교체한다.
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
*/

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
  { label: "탐색", Icon: Search, href: "/home", active: false },
  { label: "마이로컬", Icon: CalendarDays, href: "/plan", active: false },
  { label: "미션", Icon: Star, href: "/mission", active: true },
  { label: "MY", Icon: CircleUserRound, href: "/my", active: false }
];

export default function MissionPage() {
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.scroll}>
          <header className={styles.hero}>
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <Link
                  href="/home"
                  aria-label="탐색으로 돌아가기"
                  className={styles.backLink}
                >
                  <ArrowLeft size={20} />
                </Link>
                <div className={styles.kicker}>
                  지역을 여행하고, 일상을 경험하는
                </div>
                <h1 className={styles.title}>
                  나의 미션 <Leaf size={25} strokeWidth={1.6} />
                </h1>
              </div>
              <Link href="/plan" className={styles.planLink}>
                <Navigation size={15} />
                플랜
              </Link>
            </div>
          </header>

          <div className={styles.body}>
            <div className={styles.primaryColumn}>
              <div className={styles.progress}>
                <div className="flex items-center justify-between gap-3">
                  <span className={styles.status}>진행 중</span>
                  <span className={styles.progressLabel}>체류 진행률 66%</span>
                </div>
                <h2 className={styles.missionTitle}>강릉 독서 미션</h2>
                <p className={styles.description}>
                  바다 보이는 로컬 서점 2곳에서 각 30분 이상 독서하고, 장소 반경
                  100m 안에서 인증해요.
                </p>
                <div
                  role="progressbar"
                  aria-label="미션 진행률"
                  aria-valuenow={66}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  className={styles.progressTrack}
                >
                  <div className={styles.progressFill} />
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="text-[11px] text-[#6e8b79]">2/3 완료</span>
                  <span className="text-[11px] font-bold text-[#477a60]">
                    획득 예정 배지 · 강릉 독서광
                  </span>
                </div>
              </div>

              <div className={styles.stats}>
                {[
                  ["남은 시간", "1일 8시간"],
                  ["주변 체류자", "12명"],
                  ["예상 점수", "+38점"]
                ].map(([label, value]) => (
                  <div key={label} className={styles.stat}>
                    <div className="text-[11px] font-medium text-[#8a938c]">
                      {label}
                    </div>
                    <div className="mt-1 text-[14px] font-black text-[#16211a]">
                      {value}
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.checklist}>
                <div className="flex items-center justify-between gap-3">
                  <h2 className={styles.sectionTitle}>
                    <Leaf size={23} strokeWidth={1.5} /> 인증 체크리스트
                  </h2>
                  <span className="rounded-full bg-[#EAF6EE] px-3 py-1.5 text-[11px] font-bold text-[#1E7F3C]">
                    GPS 인증 가능
                  </span>
                </div>
                <div className={styles.checkRows}>
                  {missionSteps.map((step, index) => (
                    <div key={step.label} className={styles.checkRow}>
                      <div
                        className={`flex size-10 shrink-0 items-center justify-center rounded-full ${
                          step.active
                            ? "bg-[#4e9470] text-white"
                            : "bg-[#e7eae8] text-[#a3afaa]"
                        }`}
                      >
                        {step.active ? (
                          <CheckCircle2 size={17} />
                        ) : (
                          <span className="text-xs font-black">
                            {index + 1}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm leading-6 font-bold break-words text-[#315f50]">
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

              {/* TODO: 매칭 시스템 도입 시 팀 미션 제안 조건과 요청 API를 연결하고 복원한다.
                  UsersRound 아이콘 import도 함께 복원한다.
              <div className={styles.teamNotice}>
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#F4D690] text-[#8a5a12]">
                    <UsersRound size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[14px] font-black text-[#16211a]">
                      2인 팀 미션 제안 대기 중
                    </div>
                    <p className="mt-1 text-[12px] leading-relaxed text-[#8a6a2c]">
                      여행 50% 지점을 지나면 같은 미션을 하는 체류자와 팀 미션을
                      열 수 있어요.
                    </p>
                  </div>
                </div>
              </div>
              */}
            </div>
            {/* TODO: 매칭·커뮤니티 시스템 도입 시 체류자 조회, 함께하기·가이드 요청,
                메시지 목록·채팅 이동을 실제 API에 연결하고 복원한다.
                MessageCircle 아이콘 import도 함께 복원한다.
            <div className={styles.secondaryColumn}>
              <div className={styles.mates}>
                <h2 className={styles.sectionTitle}>
                  <Leaf size={23} strokeWidth={1.5} /> 같은 미션 체류자
                </h2>
                <p className="mt-1 text-[12px] leading-relaxed text-[#3d6b4d]">
                  진행 중이거나 체류 일정이 겹치는 사람만 보여줘요.
                </p>
                <div className="mt-3 grid gap-2.5">
                  {sameMates.map((mate) => (
                    <div key={mate.name} className={styles.mate}>
                      <div className={styles.mateProfile}>
                        <div className={styles.avatar}>
                          <CircleUserRound size={21} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className={styles.mateHeading}>
                            <div className="text-sm font-black text-[#16211a]">
                              {mate.name}
                            </div>
                            <span className={styles.mateTag}>{mate.tag}</span>
                          </div>
                          <div className={styles.mateMeta}>{mate.meta}</div>
                        </div>
                      </div>
                      <button className={styles.outlineButton}>
                        {mate.cta}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <Link href="/mission" className={styles.message}>
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
            </div>
            */}
            <div className={styles.collection}>
              <h2 className={styles.collectionTitle}>배지 컬렉션</h2>
              <div className="mt-2 flex justify-end">
                <Link
                  href="/bedge"
                  className="rounded-full bg-[#EAF6EE] px-3 py-1.5 text-[11px] font-bold text-[#1E7F3C]"
                >
                  전체 배지 보기
                </Link>
              </div>
              <div
                className={`${styles.badgeGrid} mt-3 grid grid-cols-2 gap-2.5`}
              >
                {badges.map((badge) => (
                  <div
                    key={badge.name}
                    className={`${styles.badge} ${
                      badge.got ? "border-black/6" : "border-black/6"
                    }`}
                  >
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
                      className="relative flex size-14 items-center justify-center rounded-full border bg-white"
                      style={{
                        borderColor: badge.got ? `${badge.color}30` : "#dfe5e1",
                        color: badge.got ? badge.color : "#98a19a"
                      }}
                    >
                      <div
                        className="absolute inset-1.5 rounded-full"
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
            </div>

            <button className={styles.completeButton}>
              <Leaf size={20} /> 미션 완료 인증하기
            </button>
            <div aria-hidden="true" className={styles.coastFooter} />
          </div>
        </section>

        <nav className={styles.bottomNav}>
          {tabs.map(({ label, Icon, href, active }) => (
            <Link
              key={label}
              aria-current={active ? "page" : undefined}
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
