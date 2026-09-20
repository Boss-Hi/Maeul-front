"use client";

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Leaf,
  MapPin,
  Phone,
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
      <main className="mx-auto flex h-dvh max-w-[1080px] flex-col bg-[#f8fbf6] p-5 text-[#315f50] shadow-[0_0_60px_rgba(49,95,80,0.07)]">
        <Link
          href="/home"
          aria-label="메인 탐색으로 돌아가기"
          className="flex size-10 items-center justify-center rounded-full border border-[#ffffffc9] bg-[#fffefbe8]"
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
  const isFestival =
    event.categoryCode === "EV" || Boolean(event.start || event.end);
  const placeGuide = {
    EX: {
      title: "직접 해보는 시간",
      style: "여유롭게 머물기",
      description: "평소와 다른 손길로 마을을 천천히 경험해 보세요."
    },
    HS: {
      title: "이야기를 따라 걷기",
      style: "천천히 둘러보기",
      description: "장소에 담긴 이야기를 따라 나만의 속도로 걸어 보세요."
    },
    VE: {
      title: "마을의 감각 만나기",
      style: "일정 사이 가볍게",
      description: "여행의 한 장면처럼 자연스럽게 들러 감상을 남겨 보세요."
    }
  }[event.categoryCode] ?? {
    title: "마을을 만나는 시간",
    style: "자유롭게 둘러보기",
    description: "이곳에서만 만날 수 있는 마을의 분위기를 느껴 보세요."
  };
  const highlights = isFestival
    ? [
        { label: "시작일", value: event.start || "미등록" },
        { label: "종료일", value: event.end || "미등록" }
      ]
    : [
        { label: "MAEUL 추천", value: placeGuide.title },
        { label: "방문 방식", value: placeGuide.style }
      ];
  const infoRows = [
    ...(isFestival
      ? [{ Icon: CalendarDays, label: "행사 기간", value: period }]
      : []),
    { Icon: MapPin, label: "개최 지역", value: event.address || "미등록" },
    { Icon: Phone, label: "문의 연락처", value: event.tel || "미등록" }
  ];
  return (
    <main className="h-dvh overflow-hidden bg-[#e8efed] text-[#24584d]">
      <div className="mx-auto flex h-dvh w-full max-w-[1080px] flex-col overflow-hidden bg-[#f8fbf6] shadow-[0_0_60px_rgba(49,95,80,0.07)]">
        <section className="min-h-0 flex-1 overflow-y-auto">
          <div
            className="relative min-h-[250px] bg-[#c7e9ef] bg-cover bg-center px-5 pt-7 sm:min-h-[275px] sm:px-7 lg:min-h-[300px] lg:px-10"
            style={{
              backgroundImage: event.image
                ? `linear-gradient(180deg,rgba(19,72,52,0.03),rgba(19,72,52,0.08) 45%,rgba(16,57,40,0.58)),url(${JSON.stringify(event.image)})`
                : "url('/images/regions/gangneung.webp')"
            }}
          >
            <Link
              href="/home"
              aria-label="메인 탐색으로 돌아가기"
              className="flex size-10 items-center justify-center rounded-full border border-[#ffffffc9] bg-[#fffefbe8] text-[#315f50]"
            >
              <ArrowLeft size={20} />
            </Link>

            <div className="mt-3.5 max-w-[650px]">
              <p className="text-[11px] leading-[1.8] font-bold text-white drop-shadow-[0_1px_3px_rgba(15,47,35,0.75)]">
                마을에서 만나는 특별한 하루
              </p>
              <span className="mt-2 inline-flex items-center gap-1 rounded-full border border-white/60 bg-white/90 px-3 py-1.5 text-[11px] font-bold text-[#397757]">
                <Sparkles size={12} />
                {event.categoryName || "마을 소식"}
              </span>
              <h1 className="mt-3 text-[30px] leading-[1.2] font-black text-white drop-shadow-[0_2px_5px_rgba(12,43,30,0.8)] sm:text-[34px]">
                {event.title}
              </h1>
            </div>
          </div>

          <div className="relative -mt-[30px] rounded-t-[30px] border-t-[5px] border-[#fffefb] bg-[#f8fbf6] px-4 pt-4 pb-5 sm:px-7 lg:px-10">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eaf6ee] px-3 py-1.5 text-[11px] font-bold text-[#397757]">
                <MapPin size={13} />
                {event.address || "지역 미등록"}
              </span>

              <p className="mt-4 text-[14px] leading-[1.85] font-medium text-[#657b6d] sm:text-[15px]">
                {event.description || "아직 등록된 상세 소개가 없어요."}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {highlights.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[17px] border border-[#dce7d8] bg-[#fffefbe8] p-3.5 sm:p-4"
                  >
                    <div className="text-[11px] font-medium text-[#839187]">
                      {item.label}
                    </div>
                    <div className="mt-1.5 text-[16px] font-black text-[#24584d] sm:text-lg">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-[20px] border border-[#dce7d8] bg-[#fffefbe8] p-4">
                <h2 className="flex items-center gap-2 text-[17px] font-black text-[#24584d]">
                  <Leaf size={19} className="text-[#64a071]" /> 행사 정보
                </h2>
                <div className="mt-4 grid gap-3">
                  {infoRows.map(({ Icon, label, value }) => (
                    <div key={label} className="flex items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#eaf6ee] text-[#4b906c]">
                        <Icon size={18} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] font-medium text-[#839187]">
                          {label}
                        </div>
                        <div className="mt-0.5 text-sm font-bold break-words text-[#315f50]">
                          {value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 rounded-[20px] border border-[#cfe4d0] bg-[#eaf6ee] p-4">
                <div className="flex items-center gap-2 text-sm font-black text-[#397757]">
                  {isFestival ? (
                    <CheckCircle2 size={18} />
                  ) : (
                    <Sparkles size={18} />
                  )}
                  {isFestival
                    ? "체류 기간 교집합 검증"
                    : "이곳을 일정에 담아보세요"}
                </div>
                <p className="mt-2 text-[13px] leading-relaxed font-medium text-[#557b69]">
                  {isFestival
                    ? event.start
                      ? `내가 머무는 기간이 행사 기간에 포함되어야 플랜을 만들 수 있어요. 행사 기간: ${period}`
                      : "행사 날짜가 등록되면 체류 기간을 확인할 수 있어요."
                    : placeGuide.description}
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="shrink-0 border-t border-[#dce7d8] bg-[#fffefbf2] px-4 py-3 sm:px-7 lg:px-10">
          <Link
            href={`/plan/new?contentId=${encodeURIComponent(contentId)}`}
            className="flex h-[54px] w-full items-center justify-center rounded-[16px] bg-[#4b906c] text-[15px] font-bold text-white shadow-[0_6px_18px_rgba(75,144,108,0.28)]"
          >
            {isFestival ? "이 행사로 일정 만들기" : "이곳을 일정에 담기"}
          </Link>
        </div>
      </div>
    </main>
  );
}
