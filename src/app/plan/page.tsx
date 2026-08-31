"use client";

import {
  CalendarDays,
  ChevronLeft,
  CircleUserRound,
  Home,
  MessageCircle,
  Search,
  Star
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const dayTabs = [1, 2, 3];

const mapPins = {
  1: [
    { label: "공유오피스", top: "26%", left: "18%", tone: "blue" },
    { label: "커피 페스타", top: "32%", left: "66%", tone: "green" },
    { label: "바닷길 열차", top: "70%", left: "47%", tone: "white" },
    { label: "웨이브 코리빙", top: "61%", left: "18%", tone: "orange" }
  ],
  2: [
    { label: "파도책방", top: "24%", left: "15%", tone: "white" },
    { label: "경포호수", top: "52%", left: "52%", tone: "white" },
    { label: "안목 로스터리", top: "28%", left: "62%", tone: "green" },
    { label: "웨이브 코리빙", top: "72%", left: "22%", tone: "orange" }
  ],
  3: [
    { label: "코워킹", top: "24%", left: "20%", tone: "blue" },
    { label: "책방 인증", top: "45%", left: "54%", tone: "green" },
    { label: "강릉역", top: "72%", left: "36%", tone: "white" }
  ]
};

const timelines = {
  1: [
    [
      "08:30",
      "안목 브런치 카페 아침",
      "바다뷰 브런치 · 로컬 원두 드립",
      "식사",
      "#d1621f"
    ],
    [
      "09:30",
      "공유오피스 근무",
      "경포 파도소리 오피스 · 지자체 50% 할인",
      "원격업무",
      "#2b6cb0"
    ],
    [
      "14:00",
      "안목 커피거리 산책",
      "로스터리 밀집 구간 · 테이크아웃 추천",
      "일정",
      "#1E7F3C"
    ],
    [
      "17:00",
      "커피 페스타 야간 참여",
      "안목 커피거리 메인 무대",
      "주요 행사",
      "#d9a520"
    ],
    [
      "21:30",
      "웨이브 코리빙 하우스",
      "행사장 도보 10분 · 라운지 이용",
      "숙소",
      "#e07a3f"
    ]
  ],
  2: [
    ["08:00", "코리빙 조식 라운지", "토스트 & 로컬 우유", "식사", "#d1621f"],
    [
      "10:00",
      "파도책방 안목점",
      "바다뷰 독립서점 · 30분 독서",
      "일정",
      "#1E7F3C"
    ],
    [
      "13:00",
      "강릉 순두부 젤라토 점심",
      "초당동 순두부 & 젤라토",
      "식사",
      "#d1621f"
    ],
    [
      "15:00",
      "테라로사 커피 경포",
      "워케이션 좌석 · 2시간 작업",
      "원격업무",
      "#2b6cb0"
    ],
    [
      "18:00",
      "안목 로스터리 테이스팅",
      "핸드드립 3종 비교 시음",
      "일정",
      "#1E7F3C"
    ]
  ],
  3: [
    [
      "09:30",
      "코워킹 마무리",
      "경포 파도소리 오피스 · 체크아웃 정리",
      "원격업무",
      "#2b6cb0"
    ],
    [
      "11:00",
      "파도책방 재방문",
      "미션 인증 마무리 · 책 한 권 구매",
      "일정",
      "#1E7F3C"
    ],
    ["12:30", "교동 짬뽕 점심", "로컬 노포 · 대기 20분", "식사", "#d1621f"],
    ["14:00", "배지 획득", "강릉 독서광 · 미션 리포트 확인", "배지", "#c9922b"],
    ["17:00", "강릉역 이동", "KTX 탑승 전 카페 대기", "이동", "#1E7F3C"]
  ]
};

const tabs = [
  { label: "탐색", Icon: Search, href: "/", active: false },
  { label: "마이로컬", Icon: CalendarDays, href: "/plan", active: true },
  { label: "미션", Icon: Star, href: "/plan", active: false },
  { label: "MY", Icon: CircleUserRound, href: "/plan", active: false }
];

export default function PlanPage() {
  const [day, setDay] = useState<1 | 2 | 3>(1);

  const pins = useMemo(() => mapPins[day], [day]);
  const timeline = useMemo(() => timelines[day], [day]);

  return (
    <main className="h-lvh overflow-hidden bg-[#e7eae7] text-[#16211a]">
      <div className="mx-auto flex h-lvh w-full max-w-[600px] flex-col overflow-hidden bg-[#F5F8F6] shadow-[0_0_38px_rgba(20,34,25,0.08)]">
        <header className="shrink-0 bg-[#12592C] px-5 py-4 text-white">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              aria-label="메인 탐색으로 돌아가기"
              className="flex size-9 items-center justify-center rounded-xl bg-white/14"
            >
              <ChevronLeft size={20} />
            </Link>
            <div className="min-w-0">
              <div className="text-[11px] font-bold text-[#a9e6bd]">
                마이 로컬 플랜 · 강원 강릉시
              </div>
              <h1 className="mt-1 truncate text-[18px] font-black text-white">
                3일 살기 · 커피 페스타
              </h1>
            </div>
          </div>
        </header>

        <section className="min-h-0 flex-1 overflow-y-auto px-5 pt-4 pb-24">
          <div className="relative h-[172px] overflow-hidden rounded-2xl border border-black/6 bg-[repeating-linear-gradient(135deg,#e2eae4_0_10px,#edf2ee_10px_20px)]">
            <span className="absolute top-3 left-3 rounded-lg bg-white/90 px-3 py-1.5 text-[11px] font-bold text-[#16211a]">
              Day {day} 동선 · 인터랙티브 지도
            </span>
            {pins.map((pin) => (
              <span
                key={pin.label}
                className={`absolute rounded-lg px-2.5 py-1.5 text-[11px] font-bold shadow-sm ${
                  pin.tone === "green"
                    ? "bg-[#1E7F3C] text-white"
                    : pin.tone === "blue"
                      ? "bg-[#2b6cb0] text-white"
                      : pin.tone === "orange"
                        ? "bg-[#e07a3f] text-white"
                        : "border border-[#cfe0d5] bg-white text-[#16211a]"
                }`}
                style={{ top: pin.top, left: pin.left }}
              >
                {pin.label}
              </span>
            ))}
            <span className="absolute right-3 bottom-3 text-[10px] font-medium text-[#8a938c]">
              map placeholder
            </span>
          </div>

          <div className="mt-3 rounded-2xl bg-[#16211a] p-4">
            <div className="flex items-start justify-between gap-3">
              <Link href="/plan" className="min-w-0">
                <div className="text-[11px] font-bold tracking-[0.06em] text-[#8fdca8]">
                  나의 미션 · 진행중
                </div>
                <div className="mt-2 truncate text-[16px] font-black text-white">
                  강릉 독서 미션
                </div>
                <div className="mt-1 text-[11px] text-white/60">
                  획득 예정 배지 · 강릉 독서광
                </div>
              </Link>
              <button className="shrink-0 rounded-full bg-[#8fdca8] px-3 py-2 text-[12px] font-bold text-[#16211a]">
                미션 완료
              </button>
            </div>
          </div>

          <Link
            href="/plan"
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

          <div className="mt-5 flex gap-2">
            {dayTabs.map((item) => (
              <button
                key={item}
                onClick={() => setDay(item as 1 | 2 | 3)}
                className={`rounded-full border px-4 py-2.5 text-sm font-bold transition ${
                  day === item
                    ? "border-[#1E7F3C] bg-[#1E7F3C] text-white"
                    : "border-black/8 bg-white text-[#4a544c]"
                }`}
              >
                Day {item}
              </button>
            ))}
          </div>

          <div className="mt-3 grid gap-2.5">
            {timeline.map(([time, title, sub, tag, color]) => (
              <button
                key={`${time}-${title}`}
                className="flex items-center gap-3 overflow-hidden rounded-2xl border border-black/6 bg-white py-3 pr-3 text-left"
              >
                <span
                  className="self-stretch rounded-r-full"
                  style={{ width: 4, backgroundColor: color }}
                />
                <div className="w-11 shrink-0 text-[12px] font-black text-[#8a938c]">
                  {time}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-black text-[#16211a]">
                    {title}
                  </div>
                  <div className="mt-1 truncate text-[12px] text-[#7b847d]">
                    {sub}
                  </div>
                </div>
                <span
                  className="shrink-0 rounded-lg border px-2.5 py-1.5 text-[11px] font-bold"
                  style={{
                    color,
                    backgroundColor: `${color}14`,
                    borderColor: `${color}33`
                  }}
                >
                  {tag}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-6">
            <h2 className="text-[17px] font-black text-[#16211a]">
              나의 숙소{" "}
              <span className="text-[12px] font-medium text-[#8a938c]">
                1순위 선호: 코리빙
              </span>
            </h2>
            <div className="mt-3 flex items-center gap-3 rounded-2xl border border-black/6 bg-white p-3.5">
              <div className="flex size-[58px] shrink-0 items-center justify-center rounded-xl bg-[#EAF6EE] text-[#1E7F3C]">
                <Home size={25} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[15px] font-black text-[#16211a]">
                  웨이브 코리빙 하우스 강릉
                </div>
                <div className="mt-1 text-[12px] text-[#7b847d]">
                  행사장 도보 10분 · 동일 법정동 내
                </div>
                <div className="mt-1 text-sm font-black text-[#1E7F3C]">
                  주 25만원
                </div>
              </div>
              <button className="shrink-0 rounded-[9px] bg-[#EAF6EE] px-3 py-2 text-[12px] font-bold text-[#1E7F3C]">
                변경
              </button>
            </div>
          </div>

          <div className="mt-3 rounded-[13px] border border-[#f2d9d4] bg-[#FDF3F1] p-3">
            <div className="text-[12px] font-black text-[#b04a3c]">
              주요 행사는 변경 불가
            </div>
            <p className="mt-1 text-[12px] leading-relaxed text-[#95655c]">
              커피 페스타 일정을 바꾸려면 새 플랜을 만들어야 해요. 그 외 일정은
              대체할 수 있습니다.
            </p>
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
