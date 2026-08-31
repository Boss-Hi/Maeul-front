import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Route,
  Sparkles
} from "lucide-react";
import Link from "next/link";

const highlights = [
  { label: "체류 추천", value: "3일 살기" },
  { label: "로컬 미션", value: "6개 개방" }
];

const infoRows = [
  { Icon: CalendarDays, label: "행사 기간", value: "2026.08.15 ~ 08.22" },
  { Icon: MapPin, label: "개최 지역", value: "강원 강릉시 42150" },
  { Icon: Clock3, label: "주요 시간", value: "체험 18:00 · 공연 19:30" }
];

const missionPreview = [
  "안목 커피거리 로스터리 3곳 방문",
  "경포호수 야간 버스킹 2팀 관람",
  "바다 보이는 책방에서 30분 독서 인증"
];

export default function EventPage() {
  return (
    <main className="h-lvh overflow-hidden bg-[#e7eae7] text-[#16211a]">
      <div className="mx-auto flex h-lvh w-full max-w-[600px] flex-col overflow-hidden bg-[#F5F8F6] shadow-[0_0_38px_rgba(20,34,25,0.08)]">
        <section className="min-h-0 flex-1 overflow-y-auto pb-28">
          <div
            className="relative h-[242px] bg-cover bg-center"
            style={{
              backgroundImage:
                "linear-gradient(180deg,rgba(18,89,44,0.08),rgba(18,33,26,0.42)),url(https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80)"
            }}
          >
            <Link
              href="/"
              aria-label="메인 탐색으로 돌아가기"
              className="absolute top-4 left-4 flex size-9 items-center justify-center rounded-xl bg-white/92 text-[#16211a] shadow-[0_4px_14px_rgba(0,0,0,0.12)]"
            >
              <ArrowLeft size={18} />
            </Link>

            <div className="absolute right-4 bottom-4 left-4">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/92 px-3 py-1.5 text-[11px] font-bold text-[#12592C]">
                <Sparkles size={12} />
                매칭률 98%
              </span>
              <h1 className="mt-3 text-[26px] leading-tight font-black text-white">
                2026 강릉 솔향 야간
                <br />
                버스킹 & 커피 페스타
              </h1>
            </div>
          </div>

          <div className="px-5 pt-5">
            <span className="rounded-md bg-[#EAF6EE] px-2.5 py-1.5 text-[11px] font-bold text-[#1E7F3C]">
              강원 강릉시 42150 · 매칭률 98%
            </span>

            <p className="mt-4 text-[15px] leading-[1.75] font-medium text-[#6f7872]">
              안목 커피거리와 경포호수 일대에서 열리는 로컬 바리스타 핸드드립
              체험과 야간 버스킹. 행사 기간 안에 머물면 체류 일정과 로컬 미션을
              함께 만들 수 있어요.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {highlights.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[13px] border border-black/6 bg-white p-4"
                >
                  <div className="text-xs font-medium text-[#8a938c]">
                    {item.label}
                  </div>
                  <div className="mt-1.5 text-lg font-black text-[#16211a]">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-black/6 bg-white p-4">
              <h2 className="text-base font-black text-[#16211a]">행사 정보</h2>
              <div className="mt-4 grid gap-3">
                {infoRows.map(({ Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#EAF6EE] text-[#1E7F3C]">
                      <Icon size={18} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-[#8a938c]">
                        {label}
                      </div>
                      <div className="mt-0.5 truncate text-sm font-bold text-[#16211a]">
                        {value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-[#EAF6EE] p-4">
              <div className="flex items-center gap-2 text-sm font-black text-[#12592C]">
                <CheckCircle2 size={18} />
                체류 기간 교집합 검증
              </div>
              <p className="mt-2 text-[13px] leading-relaxed font-medium text-[#3d6b4d]">
                내가 머무는 기간이 행사 기간에 포함되어야 플랜을 만들 수 있어요.
                8/16 - 8/18 선택 시 검증 통과.
              </p>
            </div>

            <div className="mt-5 rounded-2xl border border-black/6 bg-white p-4">
              <div className="flex items-center gap-2">
                <div className="flex size-9 items-center justify-center rounded-xl bg-[#F2F4F2] text-[#1E7F3C]">
                  <Route size={18} />
                </div>
                <div>
                  <h2 className="text-base font-black text-[#16211a]">
                    열리는 로컬 미션
                  </h2>
                  <p className="mt-0.5 text-xs font-medium text-[#8a938c]">
                    행사 동선 안에서 자연스럽게 완료할 수 있어요
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-2">
                {missionPreview.map((mission) => (
                  <div
                    key={mission}
                    className="rounded-xl bg-[#F7FAF8] px-3.5 py-3 text-sm font-bold text-[#4a544c]"
                  >
                    {mission}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="shrink-0 border-t border-black/6 bg-white px-5 py-4">
          <Link
            href="/plan"
            className="flex h-[54px] w-full items-center justify-center rounded-[15px] bg-[#1E7F3C] text-[15px] font-bold text-white shadow-[0_6px_18px_rgba(30,127,60,0.28)]"
          >
            이 행사로 일정 만들기
          </Link>
        </div>
      </div>
    </main>
  );
}
