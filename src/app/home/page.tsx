"use client";

import {
  CalendarDays,
  PartyPopper,
  Camera,
  Landmark,
  Leaf,
  ArrowUpRight,
  ImageOff,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleUserRound,
  MapPin,
  MessageCircle,
  Search,
  Sparkles,
  Star,
  Trees,
  UsersRound
} from "lucide-react";
import Link from "next/link";
import styles from "./home.module.css";
import { RegionBanner } from "./region-banner";
import { useRef, useState, useSyncExternalStore } from "react";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient
} from "@tanstack/react-query";
import { getFestivals, getFestivalCategories } from "@/lib/api/festivals";

const categoryIcons = { EV: PartyPopper, EX: Camera, HS: Landmark, VE: Trees };

const topEvents = [
  ["1", "강릉 커피 페스타", "강원 강릉시 · 8월 15일-22일"],
  ["2", "속초 로스터리 커피 위크", "강원 속초시 · 8월 20일-27일"],
  ["3", "양양 썬셋 비치 워케이션", "강원 양양군 · 9월 1일-15일"],
  ["4", "제주 조천 귤밭 코리빙 토크", "제주 제주시 · 9월 1일-15일"],
  ["5", "부산 영도 미식 & 로컬 크리에이터 페어", "부산 영도구 · 8월 20일-27일"],
  ["6", "전주 한옥마을 전통 다도 & 명상 위크", "전북 전주시 · 8월 20일-27일"]
];

const tabs = [
  { label: "탐색", Icon: Search, active: true },
  { label: "마이로컬", Icon: CalendarDays, active: false },
  { label: "미션", Icon: Star, active: false },
  { label: "MY", Icon: CircleUserRound, active: false }
];

const desktopQuery = "(min-width: 1024px)";
function subscribeViewport(onChange: () => void) {
  const media = window.matchMedia(desktopQuery);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}
const getDesktopSnapshot = () => window.matchMedia(desktopQuery).matches;
const getServerSnapshot = () => false;

export default function Home() {
  const isDesktop = useSyncExternalStore(
    subscribeViewport,
    getDesktopSnapshot,
    getServerSnapshot
  );
  const [desktopPage, setDesktopPage] = useState(0);
  const [activeFilter, setActiveFilter] = useState("EV");
  const queryClient = useQueryClient();
  const scrollRef = useRef<HTMLElement>(null);
  const categoryAnchorRef = useRef<HTMLDivElement>(null);
  const [topsOpen, setTopsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const festivals = useInfiniteQuery({
    queryKey: [
      "festivals-infinite",
      activeFilter,
      isDesktop,
      isDesktop ? desktopPage : 0
    ],
    initialPageParam: isDesktop ? desktopPage : 0,
    queryFn: ({ signal, pageParam }) =>
      getFestivals(
        { page: pageParam, category: activeFilter, size: isDesktop ? 6 : 5 },
        signal
      ),
    getNextPageParam: (lastPage) =>
      lastPage.last ? undefined : lastPage.number + 1
  });
  const categories = useQuery({
    queryKey: ["festival-categories"],
    queryFn: ({ signal }) => getFestivalCategories(signal)
  });
  const filters = [
    ...(categories.data ?? []).filter((category) => Boolean(category.code))
  ];
  const visibleEvents = (
    festivals.data?.pages.flatMap((page) => page.content) ?? []
  ).filter((event) =>
    `${event.title} ${event.address}`
      .toLocaleLowerCase()
      .includes(search.trim().toLocaleLowerCase())
  );

  const visibleTops = topsOpen ? topEvents : topEvents.slice(0, 4);
  const desktopData = festivals.data?.pages[0];

  function changeDesktopPage(page: number) {
    setDesktopPage(page);
    setSearch("");
    requestAnimationFrame(() => {
      const container = scrollRef.current;
      const anchor = categoryAnchorRef.current;
      if (container && anchor)
        container.scrollTo({
          top:
            container.scrollTop +
            anchor.getBoundingClientRect().top -
            container.getBoundingClientRect().top,
          behavior: "instant"
        });
    });
  }

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <div className={styles.headerTop}>
            <div className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-[14px] bg-[#12592C] text-[#a6e5b9]">
                <Trees size={21} />
              </span>
              <span className="text-[16px] font-black">MAEUL</span>
            </div>

            <div className="flex items-center gap-3">
              <HeaderIcon label="메시지" badge>
                <MessageCircle size={17} />
              </HeaderIcon>
              <HeaderIcon label="메이트" badge>
                <UsersRound size={17} />
              </HeaderIcon>
              <HeaderIcon label="내 정보">
                <CircleUserRound size={17} />
              </HeaderIcon>
            </div>
          </div>

          <div className={styles.search}>
            <Search size={18} className="shrink-0 text-[#528363]" />
            <input
              aria-label="불러온 마을 소식 검색"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="어떤 마을이 궁금하세요?"
              className="min-w-0 flex-1 bg-transparent text-base text-[#24432d] outline-none placeholder:text-[#8a9c90]"
            />
          </div>
        </header>

        <section ref={scrollRef} className={styles.content}>
          <RegionBanner />

          <div ref={categoryAnchorRef} className="mt-6" />
          <div className={styles.categoryBar}>
            <div className={styles.categoryList}>
              {filters.map((filter) => (
                <button
                  key={filter.code}
                  onClick={() => {
                    if (activeFilter === filter.code) return;
                    queryClient.removeQueries({
                      queryKey: ["festivals-infinite", filter.code],
                      exact: false
                    });
                    setActiveFilter(filter.code);
                    setDesktopPage(0);
                    setSearch("");
                    requestAnimationFrame(() => {
                      const container = scrollRef.current;
                      const anchor = categoryAnchorRef.current;
                      if (container && anchor)
                        container.scrollTo({
                          top:
                            container.scrollTop +
                            anchor.getBoundingClientRect().top -
                            container.getBoundingClientRect().top,
                          behavior: "instant"
                        });
                    });
                  }}
                  aria-pressed={activeFilter === filter.code}
                  className={`${styles.category} ${activeFilter === filter.code ? styles.categoryActive : ""}`}
                >
                  {(() => {
                    const Icon =
                      categoryIcons[
                        filter.code as keyof typeof categoryIcons
                      ] ?? Trees;
                    return <Icon size={21} strokeWidth={1.7} />;
                  })()}
                  {filter.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 flex items-baseline justify-between gap-4">
            <div>
              <p className={styles.eyebrow}>
                <Leaf size={16} /> 마을에서 만나는 특별한 하루
              </p>
              <h1 className={styles.heading}>
                {activeFilter === "EV"
                  ? "이런 축제는 어때요?"
                  : "이런 마을 여행은 어때요?"}
              </h1>
            </div>
            <span className="text-xs text-[#8a938c]">
              {festivals.isSuccess
                ? search
                  ? `불러온 목록 ${visibleEvents.length}건`
                  : `${festivals.data.pages[0].totalElements}건`
                : ""}
            </span>
          </div>

          {categories.isError && (
            <p role="alert" className="mt-3 text-xs text-[#738378]">
              카테고리를 불러오지 못했어요.{" "}
              <button
                disabled={categories.isFetching}
                onClick={() => void categories.refetch()}
                className="min-h-10 font-bold text-[#12592C]"
              >
                다시 시도
              </button>
            </p>
          )}
          {festivals.isPending && (
            <div role="status" className="mt-4 space-y-4">
              <p className="text-sm text-[#738378]">
                마을 소식을 가져오고 있어요.
              </p>
              {[0, 1].map((item) => (
                <div
                  key={item}
                  aria-hidden="true"
                  className="h-64 rounded-[22px] bg-[#e3ece6] motion-safe:animate-pulse"
                />
              ))}
            </div>
          )}
          {festivals.isError && !festivals.data && (
            <div
              role="alert"
              className="py-8 text-center text-sm text-[#738378]"
            >
              <p>마을 소식을 가져오지 못했어요.</p>
              <button
                disabled={festivals.isFetching}
                onClick={() => void festivals.refetch()}
                className="mt-3 min-h-11 rounded-xl bg-[#12592C] px-5 font-bold text-white disabled:opacity-50"
              >
                {festivals.isFetching ? "불러오는 중" : "다시 시도"}
              </button>
            </div>
          )}
          {festivals.isSuccess && !visibleEvents.length && (
            <p
              role="status"
              className="py-8 text-center text-sm text-[#738378]"
            >
              조건에 맞는 마을 소식이 없어요.
            </p>
          )}
          <div className={styles.festivalGrid}>
            {visibleEvents.map((event) => (
              <Link
                href={`/event?contentId=${encodeURIComponent(event.id ?? "")}`}
                key={event.id}
                className={styles.festivalCard}
              >
                <FestivalPoster
                  key={event.image}
                  src={event.image}
                  title={event.title}
                />

                <div className={styles.cardBody}>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={styles.cardCategory}>
                      <Sparkles size={12} />
                      {event.categoryName || "로컬 소식"}
                    </span>
                  </div>
                  <h2 className={styles.cardTitle}>{event.title}</h2>
                  <p className="mt-2 flex items-start gap-1.5 text-xs leading-5 text-[#738378]">
                    <MapPin size={14} className="mt-0.5 shrink-0" />
                    <span className="line-clamp-2 break-words">
                      {event.address || "지역 미등록"}
                    </span>
                  </p>
                  {event.description && (
                    <p className="mt-2 line-clamp-2 text-[13px] leading-6 text-[#738378]">
                      {event.description}
                    </p>
                  )}
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-dashed border-[#dce7df] pt-2">
                    <span className="flex min-w-0 flex-1 basis-24 items-start gap-1.5 text-[11px] leading-5 font-medium text-[#627567]">
                      <CalendarDays size={15} className="mt-0.5 shrink-0" />
                      {event.start
                        ? `${event.start}${event.end ? ` ~ ${event.end}` : ""}`
                        : "날짜 정보 준비 중"}
                    </span>
                    <span
                      aria-hidden="true"
                      className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#EAF6EE] text-[#12592C] transition-colors group-hover:bg-[#12592C] group-hover:text-white"
                    >
                      <ArrowUpRight size={19} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {isDesktop && desktopData && desktopData.totalPages > 1 && (
            <nav
              aria-label="마을 소식 페이지"
              className="mt-5 flex items-center justify-center gap-4"
            >
              <button
                title="이전 페이지"
                aria-label="이전 페이지"
                disabled={desktopPage === 0 || festivals.isFetching}
                onClick={() => changeDesktopPage(desktopPage - 1)}
                className="flex size-10 items-center justify-center rounded-xl border border-[#dce7df] bg-white text-[#12592C] disabled:opacity-30"
              >
                <ChevronLeft size={18} />
              </button>
              <span
                aria-live="polite"
                className="min-w-20 text-center text-sm text-[#627c6a]"
              >
                {desktopData.number + 1} / {desktopData.totalPages}
              </span>
              <button
                title="다음 페이지"
                aria-label="다음 페이지"
                disabled={desktopData.last || festivals.isFetching}
                onClick={() => changeDesktopPage(desktopPage + 1)}
                className="flex size-10 items-center justify-center rounded-xl border border-[#dce7df] bg-white text-[#12592C] disabled:opacity-30"
              >
                <ChevronRight size={18} />
              </button>
            </nav>
          )}
          {!isDesktop && festivals.hasNextPage && (
            <div className="mt-5">
              {festivals.isFetchNextPageError && (
                <p
                  role="alert"
                  className="mb-3 text-center text-xs text-[#738378]"
                >
                  다음 소식을 불러오지 못했어요. 다시 시도해 주세요.
                </p>
              )}
              <button
                disabled={festivals.isFetching}
                onClick={() => void festivals.fetchNextPage()}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#cfe0d5] bg-white text-sm font-bold text-[#12592C] disabled:opacity-50"
              >
                {festivals.isFetchingNextPage
                  ? "소식을 가져오고 있어요…"
                  : festivals.isFetchNextPageError
                    ? "다시 불러오기"
                    : "5개 더 보기"}{" "}
                <ChevronDown size={16} />
              </button>
            </div>
          )}
          <span role="status" className="sr-only">
            {visibleEvents.length}개의 마을 소식이 표시되어 있어요.
          </span>
          <h2 className="mt-8 text-[19px] font-bold tracking-tight text-[#24432d]">
            실시간 인기 축제 TOP
          </h2>

          <div className="mt-4 overflow-hidden rounded-[22px] border border-[#e0e9e2] bg-white">
            {visibleTops.map(([no, title, meta], index) => (
              <div
                key={title}
                className="flex items-center gap-3 border-b border-[#edf2ee] px-4 py-4 last:border-b-0"
              >
                <div
                  className={`flex size-7 shrink-0 items-center justify-center rounded-lg text-xs font-extrabold ${
                    index === 0
                      ? "bg-[#12592C] text-white"
                      : "bg-[#EDF1EE] text-[#8a938c]"
                  }`}
                >
                  {no}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold text-[#16211a]">
                    {title}
                  </div>
                  <div className="mt-0.5 flex items-center gap-1 text-[11px] text-[#8a938c]">
                    <MapPin size={12} />
                    <span className="truncate">{meta}</span>
                  </div>
                </div>
                <button className="shrink-0 rounded-[9px] border border-[#cfe0d5] bg-[#EAF6EE] px-2.5 py-2 text-[11px] font-bold text-[#1E7F3C]">
                  플랜 선택
                </button>
              </div>
            ))}
            <button
              onClick={() => setTopsOpen((open) => !open)}
              aria-expanded={topsOpen}
              className="flex w-full items-center justify-center gap-1 bg-[#FAFCFB] px-3 py-3 text-sm font-bold text-[#1E7F3C]"
            >
              {topsOpen ? (
                <>
                  접기 <ChevronUp size={16} />
                </>
              ) : (
                <>
                  TOP 100 더보기 <ChevronDown size={16} />
                </>
              )}
            </button>
          </div>
        </section>

        <nav aria-label="메인 메뉴" className={styles.bottomNav}>
          {tabs.map(({ label, Icon, active }) => (
            <Link
              href={
                label === "마이로컬"
                  ? "/plan"
                  : label === "미션"
                    ? "/mission"
                    : label === "MY"
                      ? "/my"
                      : "/home"
              }
              key={label}
              aria-current={active ? "page" : undefined}
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

function FestivalPoster({ src, title }: { src: string; title: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={styles.poster}>
      {src && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={title}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover object-center"
        />
      ) : (
        <ImageOff
          size={30}
          className="text-[#91a398]"
          aria-label="이미지 없음"
        />
      )}
    </div>
  );
}

function HeaderIcon({
  children,
  label,
  badge = false
}: Readonly<{
  children: React.ReactNode;
  label: string;
  badge?: boolean;
}>) {
  return (
    <Link
      href={label === "메이트" || label === "내 정보" ? "/my" : "/mission"}
      aria-label={label}
      title={label}
      className={styles.headerIcon}
    >
      {children}
      {badge ? (
        <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-[#ff6b4a]" />
      ) : null}
    </Link>
  );
}
