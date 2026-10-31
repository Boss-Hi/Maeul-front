"use client";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  LoaderCircle,
  MapPin
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getFestival, type Festival } from "@/lib/api/festivals";
import { generateItinerary, ItineraryError } from "@/lib/api/itinerary";
import { MaeulLogo } from "@/components/maeul-logo";

function dateValue(value: string) {
  const date = value.replaceAll(".", "-");
  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : "";
}

export default function NewPlanPage() {
  const [festival, setFestival] = useState<Festival | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [today, setToday] = useState("");
  const [saving, setSaving] = useState(false);
  const [created, setCreated] = useState<number | null>(null);
  const [loginRequired, setLoginRequired] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const submitting = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      const now = new Date();
      setToday(
        [
          now.getFullYear(),
          String(now.getMonth() + 1).padStart(2, "0"),
          String(now.getDate()).padStart(2, "0")
        ].join("-")
      );
      const id = new URLSearchParams(window.location.search).get("contentId");
      if (!id || !/^\d+$/.test(id)) {
        setError("먼저 머물고 싶은 장소나 행사를 골라주세요.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError("");
      void getFestival(id, controller.signal)
        .then((value) => {
          if (!controller.signal.aborted) setFestival(value);
        })
        .catch((cause: unknown) => {
          if (!controller.signal.aborted)
            setError(
              cause instanceof Error
                ? cause.message
                : "장소를 불러오지 못했어요."
            );
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    }, 0);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [attempt]);

  const eventStart = festival ? dateValue(festival.start) : "";
  const eventEnd = festival ? dateValue(festival.end) : "";
  const minDate = eventStart > today ? eventStart : today;
  const maxDate = eventEnd || undefined;
  const valid = Boolean(
    start &&
    end &&
    start >= minDate &&
    end >= start &&
    (!maxDate || end <= maxDate)
  );
  const days = valid
    ? Math.round((Date.parse(end) - Date.parse(start)) / 86400000) + 1
    : 0;
  const ended = Boolean(eventEnd && today && eventEnd < today);

  async function generate() {
    if (!valid || !festival?.id || submitting.current || created) return;
    submitting.current = true;
    setSaving(true);
    setError("");
    setLoginRequired(false);
    try {
      const id = await generateItinerary({
        tour_id: Number(festival.id),
        startDate: start.replaceAll("-", ""),
        endDate: end.replaceAll("-", "")
      });
      setCreated(id);
    } catch (cause) {
      setLoginRequired(cause instanceof ItineraryError && cause.status === 401);
      setError(
        cause instanceof Error ? cause.message : "일정을 만들지 못했어요."
      );
    } finally {
      submitting.current = false;
      setSaving(false);
    }
  }

  return (
    <main className="min-h-dvh bg-[#e8efed] text-[#24584d]">
      <div className="mx-auto min-h-dvh max-w-[800px] bg-[#f5f8f6] px-5 py-6 sm:px-8">
        <header className="flex items-center justify-between">
          <Link
            href={festival?.id ? `/event?contentId=${festival.id}` : "/home"}
            aria-label="뒤로가기"
            className="flex size-10 items-center justify-center rounded-full bg-white"
          >
            <ArrowLeft size={20} />
          </Link>
          <span className="flex items-center gap-2 font-bold">
            <MaeulLogo size={24} /> MAEUL
          </span>
          <span className="text-xs">마이 로컬 플랜</span>
        </header>
        <h1 className="mt-8 text-2xl font-black">얼마나 머물러볼까요?</h1>
        {loading ? (
          <p role="status" className="mt-8 flex items-center gap-2">
            <LoaderCircle className="animate-spin" size={18} /> 장소를 확인하고
            있어요.
          </p>
        ) : (
          festival && (
            <>
              <section className="mt-6 overflow-hidden border-b border-[#dce7df] pb-6">
                {festival.image && (
                  <img
                    src={festival.image}
                    alt={festival.title}
                    className="mb-5 max-h-72 w-full rounded-lg object-contain"
                  />
                )}
                <h2 className="text-xl font-bold">{festival.title}</h2>
                <p className="mt-2 flex items-start gap-2 text-sm">
                  <MapPin size={16} className="shrink-0" />
                  {festival.address || "주소 미등록"}
                </p>
                {eventStart && eventEnd && (
                  <p className="mt-2 text-sm">
                    행사 기간 · {eventStart} ~ {eventEnd}
                  </p>
                )}
              </section>
              {ended ? (
                <p className="mt-6">종료된 행사예요. 다른 장소를 찾아볼까요?</p>
              ) : (
                <fieldset
                  disabled={saving || created !== null}
                  className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2"
                >
                  <legend className="mb-4 flex items-center gap-2 font-bold">
                    <CalendarDays size={18} /> 체류 기간
                  </legend>
                  {(["start", "end"] as const).map((field) => (
                    <label
                      key={field}
                      className="min-w-0 text-sm font-semibold"
                    >
                      {field === "start" ? "도착하는 날" : "떠나는 날"}
                      <input
                        type="date"
                        value={field === "start" ? start : end}
                        min={field === "end" && start ? start : minDate}
                        max={maxDate}
                        onChange={(event) => {
                          if (field === "start") {
                            setStart(event.target.value);
                            if (end < event.target.value) setEnd("");
                          } else setEnd(event.target.value);
                        }}
                        className="mt-2 block h-12 w-full min-w-0 rounded-lg border border-[#cbdcd0] bg-white px-3 text-base"
                      />
                    </label>
                  ))}
                </fieldset>
              )}
              {valid && (
                <p className="mt-4 text-sm">
                  {days === 1 ? "당일치기" : `${days - 1}박 ${days}일`}{" "}
                  머물러요.
                </p>
              )}
              {saving && (
                <p role="status" className="mt-6 flex items-center gap-2">
                  <LoaderCircle size={18} className="animate-spin" /> 나에게
                  맞는 일정을 만들고 있어요.
                </p>
              )}
              {created && (
                <p role="status" className="mt-6 font-bold">
                  일정 생성 요청이 완료됐어요.
                </p>
              )}
            </>
          )
        )}
        {error && (
          <p role="alert" className="mt-6 text-sm text-[#b34f42]">
            {error}
          </p>
        )}
        <footer className="mt-8 space-y-3">
          {loginRequired ? (
            <Link
              href="/"
              className="block rounded-lg bg-[#478264] p-4 text-center font-bold text-white"
            >
              로그인하러 가기
            </Link>
          ) : created ? (
            <Link
              href={`/plan?itineraryId=${created}`}
              className="flex items-center justify-center gap-2 rounded-lg bg-[#478264] p-4 font-bold text-white"
            >
              마이로컬 보기 <ArrowRight size={18} />
            </Link>
          ) : festival && !ended ? (
            <button
              onClick={generate}
              disabled={!valid || saving}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#478264] p-4 font-bold text-white disabled:opacity-40"
            >
              {saving ? "일정 만드는 중" : "이 일정으로 떠나기"}
              <ArrowRight size={18} />
            </button>
          ) : (
            !loading && (
              <Link
                href="/home"
                className="block rounded-lg bg-[#478264] p-4 text-center font-bold text-white"
              >
                마을 둘러보기
              </Link>
            )
          )}
          {!loading && !festival && (
            <button
              onClick={() => setAttempt((value) => value + 1)}
              className="w-full p-3 text-sm"
            >
              다시 불러오기
            </button>
          )}
        </footer>
      </div>
    </main>
  );
}
