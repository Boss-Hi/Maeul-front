"use client";

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
import { useQuery } from "@tanstack/react-query";
import { getFestival } from "@/lib/api/festivals";

export function EventDetail({ contentId }: { contentId: string }) {
  const validContentId = /^\d+$/.test(contentId);
  const query = useQuery({
    queryKey: ["festival", contentId],
    queryFn: ({ signal }) => getFestival(contentId, signal),
    enabled: validContentId
  });
  const event = query.data;
  if (!event)
    return (
      <main className="mx-auto flex h-dvh max-w-[600px] flex-col bg-[#F5F8F6] p-5 text-[#12592C]">
        <Link
          href="/home"
          aria-label="메인 탐색으로 돌아가기"
          className="flex size-10 items-center justify-center rounded-xl bg-white"
        >
          <ArrowLeft size={18} />
        </Link>
        <div
          role={query.isError ? "alert" : "status"}
          className="my-auto text-center"
        >
          <p>
            {!validContentId
              ? "홈에서 행사를 먼저 골라주세요."
              : query.isError
                ? "행사 정보를 불러오지 못했어요."
                : "행사 소식을 가져오고 있어요."}
          </p>
          {query.isError && (
            <button
              onClick={() => void query.refetch()}
              disabled={query.isFetching}
              className="mt-4 min-h-11 rounded-xl bg-[#12592C] px-5 text-white"
            >
              다시 시도
            </button>
          )}
        </div>
      </main>
    );
  const period = event.start
    ? `${event.start}${event.end ? ` ~ ${event.end}` : ""}`
    : "일정 미등록";
  const highlights = [
    { label: "시작일", value: event.start || "미등록" },
    { label: "종료일", value: event.end || "미등록" }
  ];
  const infoRows = [
    { Icon: CalendarDays, label: "행사 기간", value: period },
    { Icon: MapPin, label: "개최 지역", value: event.address || "미등록" },
    { Icon: Clock3, label: "문의 연락처", value: event.tel || "미등록" }
  ];
  const missionPreview = ["아직 연결된 로컬 미션이 없어요."];
  return (
    <main className="h-lvh overflow-hidden bg-[#e7eae7] text-[#16211a]">
      <div className="mx-auto flex h-lvh w-full max-w-[600px] flex-col overflow-hidden bg-[#F5F8F6] shadow-[0_0_38px_rgba(20,34,25,0.08)]">
        <section className="min-h-0 flex-1 overflow-y-auto pb-28">
          <div
            className="relative min-h-[242px] bg-[#365f45] bg-cover bg-center pt-16"
            style={{
              backgroundImage: event.image
                ? `linear-gradient(180deg,rgba(18,89,44,0.08),rgba(18,33,26,0.65)),url(${JSON.stringify(event.image)})`
                : undefined
            }}
          >
            <Link
              href="/home"
              aria-label="메인 탐색으로 돌아가기"
              className="absolute top-4 left-4 flex size-9 items-center justify-center rounded-xl bg-white/92 text-[#16211a] shadow-[0_4px_14px_rgba(0,0,0,0.12)]"
            >
              <ArrowLeft size={18} />
            </Link>

            <div className="px-4 pt-4 pb-4">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/92 px-3 py-1.5 text-[11px] font-bold text-[#12592C]">
                <Sparkles size={12} />
                {event.categoryName || "마을 소식"}
              </span>
              <h1 className="mt-3 text-[26px] leading-tight font-black text-white">
                {event.title}
              </h1>
            </div>
          </div>

          <div className="px-5 pt-5">
            <span className="rounded-md bg-[#EAF6EE] px-2.5 py-1.5 text-[11px] font-bold text-[#1E7F3C]">
              {event.address || "지역 미등록"}
            </span>

            <p className="mt-4 text-[15px] leading-[1.75] font-medium text-[#6f7872]">
              {event.description || "아직 등록된 상세 소개가 없어요."}
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
                      <div className="mt-0.5 text-sm font-bold break-words text-[#16211a]">
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
                {event.start
                  ? `행사 기간: ${period}`
                  : "행사 날짜가 등록되면 체류 기간을 확인할 수 있어요."}
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
            href={`/plan/new?contentId=${encodeURIComponent(contentId)}`}
            className="flex h-[54px] w-full items-center justify-center rounded-[15px] bg-[#1E7F3C] text-[15px] font-bold text-white shadow-[0_6px_18px_rgba(30,127,60,0.28)]"
          >
            이 행사로 일정 만들기
          </Link>
        </div>
      </div>
    </main>
  );
}
