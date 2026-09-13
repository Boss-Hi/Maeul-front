"use client";

import {
  CalendarDays,
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
import { useRef, useState, useSyncExternalStore } from "react";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient
} from "@tanstack/react-query";
import { getFestivals, getFestivalCategories } from "@/lib/api/festivals";

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
    <main className="fixed inset-0 h-dvh overflow-hidden overscroll-none bg-[#e2ebe5] text-[#16211a]">
      <div className="mx-auto flex h-full w-full max-w-[600px] flex-col overflow-hidden bg-[#F5F8F6] shadow-[0_0_38px_rgba(20,34,25,0.08)] lg:max-w-[1040px]">
        <header className="shrink-0 border-b border-[#dce7df] bg-[#F5F8F6] px-5 pt-4 pb-4 text-[#12592C]">
          <div className="flex items-center justify-between gap-4">
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

          <div className="mt-4 flex h-11 w-full items-center gap-2 rounded-[15px] border border-[#d3e5d8] bg-white px-3 text-left">
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

        <div className="flex shrink-0 items-center gap-2 border-b border-[#dce9df] bg-[#eaf3e8] px-5 py-2.5">
          <span className="shrink-0 rounded-full bg-[#12592C] px-2.5 py-1 text-[11px] font-bold text-white">
            예정된 여행 D-2
          </span>
          <span className="min-w-0 truncate text-[12px] font-medium text-[#52705a]">
            강릉 · 솔향 야간 버스킹 & 커피 페스타
          </span>
        </div>

        <section
          ref={scrollRef}
          className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain px-5 pb-7"
        >
          <div className="flex items-center justify-between gap-4 pt-6 pb-1">
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold text-[#528363]">
                <Leaf size={13} /> 나다운 여행의 다음 걸음
              </p>
              <h2 className="text-[25px] leading-snug font-black text-[#12592C]">
                오늘은 어떤 마을에
                <br className="sm:hidden" /> 마음이 가나요?
              </h2>
              <p className="mt-2 text-[13px] leading-6 text-[#627c6a]">
                작은 축제부터 느긋한 산책까지, 머물고 싶은 곳을 찾아봐요.
              </p>
            </div>
            <div
              aria-hidden="true"
              className="hidden size-16 shrink-0 items-center justify-center rounded-[24px] bg-[#EAF6EE] text-[#1E7F3C] sm:flex"
            >
              <Trees size={32} strokeWidth={1.4} />
            </div>
          </div>
          <Link
            href="/plan"
            className="mt-5 block w-full border-y border-[#d3e5d8] bg-[#EAF6EE] px-4 py-4 text-left"
          >
            <div className="flex items-center gap-2 text-[11px] font-bold text-[#528363]">
              <CalendarDays size={15} />
              나의 스케줄
            </div>
            <div className="mt-2 text-[16px] leading-snug font-bold break-keep text-[#12592C]">
              2026 강릉 솔향 야간 버스킹 & 커피 페스타
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="min-w-0 truncate text-[12px] text-[#627c6a]">
                안목 커피거리 · 3일 살기
              </span>
              <span className="shrink-0 rounded-full bg-white px-3.5 py-2 text-xs font-bold text-[#12592C]">
                내 플랜 보기
              </span>
            </div>
          </Link>

          <div ref={categoryAnchorRef} className="mt-6" />
          <div className="sticky top-0 z-20 -mx-5 border-b border-[#dce9df] bg-[#F5F8F6] shadow-[0_4px_10px_rgba(25,65,35,0.03)]">
            <div className="flex min-h-[68px] items-center gap-2 overflow-x-auto overscroll-x-contain px-5 py-3">
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
                  className={`shrink-0 rounded-full border px-4 py-2.5 text-sm font-bold transition ${
                    activeFilter === filter.code
                      ? "border-[#12592C] bg-[#12592C] text-white"
                      : "border-[#dce7df] bg-white text-[#617668] hover:border-[#95bba1]"
                  }`}
                >
                  {filter.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 flex items-baseline justify-between gap-4">
            <h1 className="text-[19px] font-bold tracking-tight text-[#24432d]">
              마음이 머무는 곳
            </h1>
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
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {visibleEvents.map((event) => (
              <Link
                href={`/event?contentId=${encodeURIComponent(event.id ?? "")}`}
                key={event.id}
                className="group grid grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] items-start gap-3 overflow-hidden rounded-[20px] border border-[#dce7df] bg-white p-3 shadow-[0_4px_16px_rgba(25,65,35,0.04)] transition hover:border-[#86b796] hover:shadow-[0_8px_24px_rgba(25,65,35,0.09)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#12592C] sm:grid-cols-[120px_minmax(0,1fr)] sm:gap-4 sm:p-4"
              >
                <FestivalPoster
                  key={event.image}
                  src={event.image}
                  title={event.title}
                />

                <div className="flex min-w-0 flex-col py-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#1E7F3C]">
                      <Sparkles size={12} />
                      {event.categoryName || "로컬 소식"}
                    </span>
                  </div>
                  <h2 className="mt-2 line-clamp-3 text-[15px] leading-6 font-bold break-words text-[#24432d] sm:text-[17px]">
                    {event.title}
                  </h2>
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

        <nav
          aria-label="메인 메뉴"
          className="grid min-h-[72px] shrink-0 grid-cols-4 border-t border-[#e0e9e2] bg-white px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
        >
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
    <div className="flex aspect-[2/3] w-full items-center justify-center overflow-hidden rounded-lg bg-[#f0f2f4]">
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
    <button
      aria-label={label}
      className="relative flex size-9 items-center justify-center rounded-full border border-[#dce7df] bg-white text-[#12592C]"
    >
      {children}
      {badge ? (
        <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-[#ff6b4a]" />
      ) : null}
    </button>
  );
}
