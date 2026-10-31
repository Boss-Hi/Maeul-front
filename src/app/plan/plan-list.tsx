"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, Plus } from "lucide-react";
import { BottomNav } from "@/components/bottom-nav";
import {
  getCurrentItinerary,
  getItinerary,
  type Itinerary
} from "@/lib/api/itinerary";
import { knownItineraryIds } from "@/lib/itinerary-history";
import { ACCESS_TOKEN_STORAGE_KEY } from "@/lib/auth/session";

export default function PlanList() {
  const [items, setItems] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [guest, setGuest] = useState(false);
  const [today, setToday] = useState("");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    const date = new Date();
    setToday(
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
    );
    (async () => {
      setLoading(true);
      setError("");
      if (!sessionStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)) {
        setGuest(true);
        setLoading(false);
        return;
      }
      try {
        const current = await getCurrentItinerary(controller.signal);
        const results = await Promise.allSettled(
          knownItineraryIds()
            .filter((id) => id !== current?.id)
            .map((id) => getItinerary(id, controller.signal))
        );
        if (controller.signal.aborted) return;
        setItems([
          ...(current ? [current] : []),
          ...results.flatMap((result) =>
            result.status === "fulfilled" ? [result.value] : []
          )
        ]);
        if (results.some((result) => result.status === "rejected"))
          setError("일부 일정을 불러오지 못했어요.");
      } catch {
        if (!controller.signal.aborted)
          setError("일정을 불러오지 못했어요. 로그인 상태를 확인해 주세요.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [attempt]);
  const groups = [
    {
      title: "진행 중",
      items: items.filter(
        (item) => item.startDate <= today && today <= item.endDate
      )
    },
    {
      title: "다가오는 일정",
      items: items
        .filter((item) => item.startDate > today)
        .sort((a, b) => a.startDate.localeCompare(b.startDate))
    },
    {
      title: "지난 일정",
      items: items
        .filter((item) => item.endDate < today)
        .sort((a, b) => b.startDate.localeCompare(a.startDate))
    }
  ];
  return (
    <main className="mx-auto flex min-h-dvh max-w-[1080px] flex-col bg-[#f5f8f6] text-[#315f50]">
      <div className="flex-1 px-5 py-7 sm:px-10">
        <header className="flex flex-wrap items-center gap-3">
          <Link
            href="/main"
            aria-label="메인으로"
            className="rounded-full border border-[#d3e5d8] bg-white p-3"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="flex-1 text-2xl font-bold">마이로컬</h1>
          <Link
            href="/home"
            className="flex items-center gap-1 rounded-lg bg-[#478264] px-4 py-3 text-sm font-bold text-white"
          >
            <Plus size={17} />
            일정 만들기
          </Link>
        </header>
        <p className="mt-7 text-lg font-semibold">내가 머물 마을과 일정</p>
        <p className="mt-2 text-xs text-[#7b8d82]">
          현재 일정 · 이 기기에서 확인한 일정
        </p>
        {loading && (
          <p role="status" className="py-16 text-center">
            내 일정을 불러오고 있어요.
          </p>
        )}
        {error && (
          <div role="alert" className="py-8">
            {error}
            <button
              className="ml-3 underline"
              onClick={() => setAttempt((value) => value + 1)}
            >
              다시 조회
            </button>
          </div>
        )}
        {!loading && !error && !items.length && (
          <div className="py-20 text-center">
            <CalendarDays className="mx-auto mb-4" size={36} />
            <h2 className="text-xl font-bold">
              {guest
                ? "나만의 마을 일정을 모아보세요"
                : "어느 마을에서 머물러볼까요?"}
            </h2>
            <Link
              href={guest ? "/" : "/home"}
              className="mt-5 inline-block rounded-lg bg-[#478264] px-5 py-3 text-white"
            >
              {guest ? "로그인하기" : "마을 둘러보기"}
            </Link>
          </div>
        )}
        {!loading &&
          groups.map(
            (group) =>
              !!group.items.length && (
                <section key={group.title} className="mt-9">
                  <h2 className="border-b border-[#dce7df] pb-3 text-lg font-bold">
                    {group.title}
                  </h2>
                  <ul className="divide-y divide-[#dce7df]">
                    {group.items.map((item) => (
                      <li key={item.id}>
                        <Link
                          href={`/plan?itineraryId=${item.id}`}
                          className="flex items-center gap-4 py-6"
                        >
                          {item.tour.firstImage ? (
                            <img
                              src={item.tour.firstImage}
                              alt=""
                              className="h-20 w-20 shrink-0 rounded-full object-cover sm:h-24 sm:w-24"
                            />
                          ) : (
                            <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#e2efe5]">
                              <CalendarDays size={28} />
                            </span>
                          )}
                          <span className="min-w-0 flex-1">
                            <strong className="block break-words text-lg">
                              {item.tour.title}
                            </strong>
                            <span className="mt-1 block text-sm text-[#78877d]">
                              {item.startDate} ~ {item.endDate}
                            </span>
                            <small className="mt-1 block">
                          방문 일정 {item.days.reduce((count, day) => count + day.schedules.length, 0)}개
                            </small>
                          </span>
                          <ArrowRight size={19} className="shrink-0" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )
          )}
      </div>
      <BottomNav />
    </main>
  );
}
