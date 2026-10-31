"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Award,
  Check,
  MessageCircle,
  Users,
  UserRoundPlus,
  X,
  ArrowRight
} from "lucide-react";
import { MaeulLogo } from "@/components/maeul-logo";
import { BottomNav } from "@/components/bottom-nav";
import { getMyProfile } from "@/lib/api/profile";
import { getCurrentItinerary, type Itinerary } from "@/lib/api/itinerary";
import { getFestival, type Festival } from "@/lib/api/festivals";
import {
  ACCESS_TOKEN_STORAGE_KEY,
  getOnboardingCompletionKey
} from "@/lib/auth/session";
import styles from "./main.module.css";

export default function MainPage() {
  const [name, setName] = useState("");
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [recent, setRecent] = useState<Festival[]>([]);
  const [today, setToday] = useState("");
  const [activeRegion, setActiveRegion] = useState(0);
  const [arrivals, setArrivals] = useState<number[]>([]);
  const [progressReady, setProgressReady] = useState(false);
  const [storageWarning, setStorageWarning] = useState(false);
  const [feature, setFeature] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const controller = new AbortController();
    const date = new Date();
    setToday(
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
    );
    const token = sessionStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
    if (token) {
      getMyProfile(token, controller.signal)
        .then((profile) => {
          if (!controller.signal.aborted)
            setName(profile.nickname || profile.name || "마을 여행자");
        })
        .catch(() => {});
      getCurrentItinerary(controller.signal)
        .then((data) => {
          if (!controller.signal.aborted) setItinerary(data);
        })
        .catch(() => {
          if (!controller.signal.aborted)
            setError("현재 일정을 확인하지 못했어요.");
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    } else setLoading(false);
    try {
      const raw: unknown = JSON.parse(
        localStorage.getItem("maeul-recent-events") || "[]"
      );
      const ids = Array.isArray(raw)
        ? raw
            .filter(
              (id): id is string => typeof id === "string" && /^\d+$/.test(id)
            )
            .slice(0, 6)
        : [];
      Promise.allSettled(
        ids.map((id) => getFestival(id, controller.signal))
      ).then((results) => {
        if (!controller.signal.aborted)
          setRecent(
            results.flatMap((result) =>
              result.status === "fulfilled" ? [result.value] : []
            )
          );
      });
    } catch {
      /* Empty recent history is a valid state. */
    }
    return () => controller.abort();
  }, []);
  const day =
    itinerary?.days.find((item) => item.date === today) ||
    itinerary?.days.find((item) => item.date > today);
  const schedules = [...(day?.schedules || [])].sort(
    (a, b) => a.sequence - b.sequence
  );
  const completed = schedules.filter((item) =>
    arrivals.includes(item.id)
  ).length;
  const spot = schedules.find((item) => !arrivals.includes(item.id));
  const progressKey = useRef<string | null>(null);
  useEffect(() => {
    setProgressReady(false);
    setArrivals([]);
    setStorageWarning(false);
    progressKey.current = null;
    try {
      const token = sessionStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
      const owner = token && getOnboardingCompletionKey(token);
      if (owner && itinerary && day) {
        const key = `maeul-arrivals:${owner}:${itinerary.id}:${day.id}`;
        progressKey.current = key;
        const saved: unknown = JSON.parse(localStorage.getItem(key) || "[]");
        if (Array.isArray(saved))
          setArrivals(
            saved.filter(
              (id): id is number => Number.isSafeInteger(id) && id > 0
            )
          );
      }
    } catch {
      setStorageWarning(true);
    }
    setProgressReady(true);
  }, [itinerary?.id, day?.id]);
  function checkArrival() {
    if (!spot || !progressReady) return;
    const next = [...new Set([...arrivals, spot.id])];
    setArrivals(next);
    try {
      if (!progressKey.current) throw new Error("Missing progress owner");
      localStorage.setItem(progressKey.current, JSON.stringify(next));
    } catch {
      setStorageWarning(true);
    }
  }
  function announce(title: string) {
    setFeature(title);
    dialog.current?.showModal();
  }
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <header className={styles.header}>
          <Link href="/main" className={styles.brand}>
            <MaeulLogo /> <strong>MAEUL</strong>
          </Link>
          <Link href="/my" aria-label="내 정보" className={styles.profile}>
            <img src="/images/main/profile.svg" alt="" />
          </Link>
        </header>
        <div className={styles.greeting}>
          <p>어서오세요.</p>
          <h2>{name ? `${name}님` : "오늘도, 마을에서"}</h2>
        </div>
        <section className={styles.recommendation}>
          <p className={styles.eyebrow}>
            <img src="/images/main/leaf.svg" alt="" />
            마을에서 만나는 특별한 하루
          </p>
          <h1>이번 주말, 마을 축제 어때요?</h1>
          <div className={styles.carousel} aria-label="추천 지역">
            {[
              {
                region: "강릉",
                query: "region=gangwon&city=gangneung",
                description: "바다와 커피, 그리고 느긋한 일상",
                image: "/images/main/region.png"
              },
              {
                region: "부산",
                query: "region=busan",
                description: "바다 곁에서 만나는 마을의 하루",
                image: "/images/main/busan.png"
              }
            ].map((item, index) => (
              <article
                key={item.region}
                className={`${styles.region} ${index === activeRegion ? styles.front : styles.back}`}
                aria-hidden={index !== activeRegion}
                inert={index !== activeRegion}
                style={{ backgroundImage: `url(${item.image})` }}
              >
                <span className={styles.regionLabel}>
                  <img src="/images/main/pin.svg" alt="" />
                  {item.region}
                </span>
                <div className={styles.regionCopy}>
                  <p>
                    여행이 아닌,
                    <br />
                    이제는 살아보는 {item.region}
                  </p>
                  <h2>
                    {item.region}에서 즐기는
                    <br />
                    오늘
                  </h2>
                  <p>{item.description}</p>
                  <Link href={`/home?${item.query}`}>
                    {item.region} 마을 콘텐츠 보기
                    <img src="/images/main/arrow.svg" alt="" />
                  </Link>
                </div>
              </article>
            ))}
            <button
              className={styles.next}
              aria-label="다음 추천 지역"
              title="다음 추천 지역"
              onClick={() => setActiveRegion((value) => (value + 1) % 2)}
            >
              <ArrowRight size={26} />
            </button>
          </div>
        </section>
        <div className={styles.dashboard}>
          <section className={styles.route}>
            <div className={styles.sectionHeader}>
              <div>
                <h2>
                  {day?.date === today ? "오늘의 길" : "다가오는 마을의 하루"}
                </h2>
                <p>
                  {day
                    ? `${schedules.length}곳 중 ${completed}곳 도착${spot ? ` · 다음: ${spot.title || spot.tour?.title || "다음 장소"}` : ""}`
                    : "나만의 마을 일정을 만나보세요"}
                </p>
              </div>
              <Link href="/plan">전체 일정</Link>
            </div>
            {loading ? (
              <p role="status">일정을 불러오고 있어요.</p>
            ) : error ? (
              <p role="alert">
                {error} <Link href="/plan">다시 확인</Link>
              </p>
            ) : schedules.length ? (
              <>
                <div
                  className={styles.steps}
                  aria-label={`${schedules.length}곳 중 ${completed}곳 도착`}
                >
                  {schedules.map((item, index) => (
                    <div
                      key={item.id}
                      className={styles.step}
                      data-complete={arrivals.includes(item.id)}
                      data-current={spot?.id === item.id}
                      aria-label={`${index + 1}번째 ${item.title || item.tour?.title || "일정"}, ${arrivals.includes(item.id) ? "도착 완료" : spot?.id === item.id ? "진행 중" : "대기"}`}
                    >
                      <span>
                        {arrivals.includes(item.id) ? (
                          <Check size={18} />
                        ) : (
                          index + 1
                        )}
                      </span>
                    </div>
                  ))}
                </div>
                {spot ? (
                  <div className={styles.spot}>
                    <h3>
                      {spot.title || spot.tour?.title}{" "}
                      <span className={styles.status}>진행 중</span>
                    </h3>
                    <p>
                      {spot.description || spot.tour?.addr1 || "나만의 일정"}
                    </p>
                    <button onClick={checkArrival} disabled={!progressReady}>
                      도착 체크 · 다음 장소로 <ArrowRight size={18} />
                    </button>
                  </div>
                ) : (
                  <div className={styles.spot}>
                    <h3>오늘의 길을 모두 걸었어요</h3>
                    <p>{schedules.length}곳의 도착 체크를 마쳤어요.</p>
                    <Link href={`/plan?itineraryId=${itinerary!.id}`}>
                      내 일정 보기 <ArrowRight size={16} />
                    </Link>
                  </div>
                )}
                <p className={styles.progressNote} role="status">
                  {storageWarning
                    ? "이 기기에 저장하지 못했어요. 새로고침하면 체크가 사라질 수 있어요."
                    : "도착 기록은 이 기기에 저장돼요."}
                </p>
              </>
            ) : (
              <Link href="/home" className={styles.emptyAction}>
                어느 마을에서 머물러볼까요? <ArrowRight size={18} />
              </Link>
            )}
          </section>
          <div className={styles.secondary}>
            <section className={styles.mission}>
              <div>
                <p>나의 미션</p>
                <h2>마을에서 작은 도전</h2>
                <small>나만의 로컬 경험을 만나보세요.</small>
              </div>
              <Link href="/mission">미션 보기</Link>
            </section>
            <div className={styles.shortcuts}>
              <button onClick={() => announce("메시지")}>
                <span>
                  <MessageCircle size={18} />
                </span>
                메시지
              </button>
              <button onClick={() => announce("체류자 매칭")}>
                <span>
                  <Users size={18} />
                </span>
                체류자 매칭
              </button>
              <button onClick={() => announce("친구")}>
                <span>
                  <UserRoundPlus size={18} />
                </span>
                친구
              </button>
              <Link href="/bedge">
                <span>
                  <Award size={18} />
                </span>
                배지
              </Link>
            </div>
          </div>
        </div>
        <section className={styles.recent}>
          <div className={styles.sectionHeader}>
            <h2>최근 본 행사</h2>
            <Link href="/home">탐색하기</Link>
          </div>
          {recent.length ? (
            <div className={styles.events}>
              {recent.map((event) => (
                <Link
                  key={event.id}
                  href={`/event?contentId=${event.id}`}
                  className={styles.event}
                >
                  {event.image && <img src={event.image} alt="" />}
                  <div>
                    <h3>{event.title}</h3>
                    <p>
                      {event.start
                        ? `${event.start} ~ ${event.end}`
                        : event.address}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className={styles.emptyRecent}>마음에 드는 행사를 둘러보세요.</p>
          )}
        </section>
      </div>
      <BottomNav />
      <dialog ref={dialog} className={styles.dialog}>
        <button aria-label="닫기" onClick={() => dialog.current?.close()}>
          <X size={20} />
        </button>
        <h2>{feature}</h2>
        <p>마을에서 만난 인연과 이어지는 경험을 추후 선보일 예정이에요.</p>
        <button onClick={() => dialog.current?.close()}>확인</button>
      </dialog>
    </main>
  );
}
