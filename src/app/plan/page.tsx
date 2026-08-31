"use client";

import {
  BookOpenText,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  CircleUserRound,
  Home,
  MapPin,
  Search,
  Star
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";

type Day = 1 | 2 | 3;

type Spot = {
  time: string;
  title: string;
  meta: string;
  tag: string;
  color: string;
  position: [number, number];
};

const dayTabs: Day[] = [1, 2, 3];

const missionSummary = {
  title: "바다책방 독서광",
  desc: "로컬 서점 2곳에서 30분 독서 인증",
  progress: "2/3 완료"
};

const dayPlans: Record<
  Day,
  {
    area: string;
    summary: string;
    center: [number, number];
    spots: Spot[];
  }
> = {
  1: {
    area: "안목 · 경포",
    summary: "행사장 주변 적응과 저녁 페스타 중심",
    center: [37.776, 128.93],
    spots: [
      {
        time: "09:30",
        title: "경포 파도소리 오피스",
        meta: "오전 집중 업무 · 지자체 할인 좌석",
        tag: "업무",
        color: "#2b6cb0",
        position: [37.795, 128.91]
      },
      {
        time: "14:00",
        title: "안목 커피거리",
        meta: "로스터리 산책 · 커피 미션 가능",
        tag: "산책",
        color: "#1E7F3C",
        position: [37.7714, 128.9488]
      },
      {
        time: "17:00",
        title: "커피 페스타 메인 무대",
        meta: "핸드드립 체험과 야간 버스킹",
        tag: "행사",
        color: "#d9a520",
        position: [37.7724, 128.9471]
      },
      {
        time: "21:30",
        title: "웨이브 코리빙 하우스",
        meta: "행사장 도보권 · 라운지 이용",
        tag: "숙소",
        color: "#e07a3f",
        position: [37.7688, 128.936]
      }
    ]
  },
  2: {
    area: "책방 · 초당",
    summary: "독서 미션과 로컬 맛집을 가볍게 연결",
    center: [37.785, 128.924],
    spots: [
      {
        time: "10:00",
        title: "파도책방 안목점",
        meta: "바다뷰 독립서점 · 30분 독서",
        tag: "미션",
        color: "#1E7F3C",
        position: [37.7734, 128.9465]
      },
      {
        time: "13:00",
        title: "초당 순두부 거리",
        meta: "점심과 짧은 동네 산책",
        tag: "식사",
        color: "#d1621f",
        position: [37.7914, 128.9143]
      },
      {
        time: "15:00",
        title: "경포 워케이션 카페",
        meta: "2시간 작업 · 콘센트 좌석",
        tag: "업무",
        color: "#2b6cb0",
        position: [37.7963, 128.9068]
      },
      {
        time: "18:00",
        title: "안목 로스터리 테이스팅",
        meta: "핸드드립 3종 비교 시음",
        tag: "체험",
        color: "#8a5a12",
        position: [37.7718, 128.9496]
      }
    ]
  },
  3: {
    area: "마무리 · 강릉역",
    summary: "체크아웃 전 미션 정리와 귀가 동선",
    center: [37.765, 128.916],
    spots: [
      {
        time: "09:30",
        title: "코워킹 마무리",
        meta: "체크아웃 정리 · 짐 보관",
        tag: "업무",
        color: "#2b6cb0",
        position: [37.795, 128.91]
      },
      {
        time: "11:00",
        title: "책방 인증 마무리",
        meta: "한 줄 감상 기록과 미션 리포트",
        tag: "미션",
        color: "#1E7F3C",
        position: [37.7734, 128.9465]
      },
      {
        time: "12:30",
        title: "교동 로컬 점심",
        meta: "기차 전 여유 식사",
        tag: "식사",
        color: "#d1621f",
        position: [37.7628, 128.8998]
      },
      {
        time: "17:00",
        title: "강릉역 이동",
        meta: "KTX 탑승 전 카페 대기",
        tag: "이동",
        color: "#66758a",
        position: [37.7641, 128.8995]
      }
    ]
  }
};

const tabs = [
  { label: "탐색", Icon: Search, href: "/", active: false },
  { label: "마이로컬", Icon: CalendarDays, href: "/plan", active: true },
  { label: "미션", Icon: Star, href: "/mission", active: false },
  { label: "MY", Icon: CircleUserRound, href: "/my", active: false }
];

export default function PlanPage() {
  const [day, setDay] = useState<Day>(1);
  const [selectedSpotIndex, setSelectedSpotIndex] = useState(0);
  const plan = dayPlans[day];
  const mainSpot =
    plan.spots.find((spot) => spot.tag === "행사") ?? plan.spots[0];

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
                마이 로컬 플랜
              </div>
              <h1 className="mt-1 truncate text-[18px] font-black text-white">
                강릉 3일 살기 · 커피 페스타
              </h1>
            </div>
          </div>
        </header>

        <section className="min-h-0 flex-1 overflow-y-auto px-5 pt-4 pb-24">
          <div className="rounded-[18px] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#1E7F3C]">
                  <MapPin size={15} />
                  {plan.area}
                </div>
                <h2 className="mt-1.5 text-[20px] leading-snug font-black text-[#16211a]">
                  Day {day} 동선
                </h2>
                <p className="mt-1 text-[12px] leading-relaxed text-[#7b847d]">
                  {plan.summary}
                </p>
              </div>
              <Link
                href="/mission"
                className="shrink-0 rounded-full bg-[#EAF6EE] px-3 py-2 text-[12px] font-bold text-[#1E7F3C]"
              >
                미션 보기
              </Link>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {dayTabs.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setDay(item);
                    setSelectedSpotIndex(0);
                  }}
                  className={`h-10 rounded-xl border text-sm font-bold transition ${
                    day === item
                      ? "border-[#1E7F3C] bg-[#1E7F3C] text-white"
                      : "border-black/8 bg-[#F8FAF9] text-[#4a544c]"
                  }`}
                >
                  Day {item}
                </button>
              ))}
            </div>
          </div>

          <InteractiveMap
            day={day}
            center={plan.center}
            selectedIndex={selectedSpotIndex}
            spots={plan.spots}
          />

          <Link
            href="/mission"
            className="mt-4 flex items-center gap-3 rounded-2xl border border-[#cfe0d5] bg-[#EAF6EE] p-4"
          >
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#1E7F3C]">
              <BookOpenText size={21} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#1E7F3C]">
                <CheckCircle2 size={14} />
                진행 중 미션
              </div>
              <div className="mt-1 truncate text-[15px] font-black text-[#16211a]">
                {missionSummary.title}
              </div>
              <div className="mt-0.5 truncate text-[12px] text-[#5f7266]">
                {missionSummary.desc}
              </div>
            </div>
            <span className="shrink-0 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-[#1E7F3C]">
              {missionSummary.progress}
            </span>
          </Link>

          <div className="mt-4 flex items-baseline justify-between gap-3">
            <h2 className="text-[17px] font-black text-[#16211a]">
              오늘의 핵심 일정
            </h2>
            <span className="text-xs font-medium text-[#8a938c]">
              {plan.spots.length}곳
            </span>
          </div>

          <div className="mt-3 grid gap-2">
            {plan.spots.map((spot, index) => (
              <button
                key={`${spot.time}-${spot.title}`}
                onClick={() => setSelectedSpotIndex(index)}
                className={`flex items-center gap-3 rounded-2xl border bg-white p-3 text-left transition ${
                  selectedSpotIndex === index
                    ? "border-[#1E7F3C] shadow-[0_8px_20px_rgba(30,127,60,0.12)]"
                    : "border-black/6"
                }`}
              >
                <div
                  className="flex size-10 shrink-0 items-center justify-center rounded-xl text-[12px] font-black text-white"
                  style={{ backgroundColor: spot.color }}
                >
                  {spot.time}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[14px] font-black text-[#16211a]">
                    {spot.title}
                  </div>
                  <div className="mt-0.5 truncate text-[12px] text-[#7b847d]">
                    {spot.meta}
                  </div>
                </div>
                <span
                  className="shrink-0 rounded-lg px-2.5 py-1.5 text-[11px] font-bold"
                  style={{
                    backgroundColor: `${spot.color}14`,
                    color: spot.color
                  }}
                >
                  {spot.tag}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-[1fr_auto] items-center gap-3 rounded-2xl border border-black/6 bg-white p-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[12px] font-bold text-[#1E7F3C]">
                <Home size={16} />
                숙소
              </div>
              <div className="mt-1 truncate text-[15px] font-black text-[#16211a]">
                웨이브 코리빙 하우스 강릉
              </div>
              <div className="mt-0.5 truncate text-[12px] text-[#7b847d]">
                {mainSpot.title} 기준 이동 편한 위치
              </div>
            </div>
            <button className="rounded-[10px] bg-[#EAF6EE] px-3 py-2 text-[12px] font-bold text-[#1E7F3C]">
              변경
            </button>
          </div>

          <p className="mt-3 rounded-[13px] bg-[#EDF1EE] p-3 text-[12px] leading-relaxed text-[#6f7872]">
            주요 행사는 플랜 기준점으로 고정되고, 주변 일정과 숙소는 대체할 수
            있어요.
          </p>
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

function InteractiveMap({
  day,
  center,
  selectedIndex,
  spots
}: Readonly<{
  day: Day;
  center: [number, number];
  selectedIndex: number;
  spots: Spot[];
}>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRefs = useRef<LeafletMarker[]>([]);
  const route = useMemo(() => spots.map((spot) => spot.position), [spots]);

  useEffect(() => {
    let cancelled = false;

    async function renderMap() {
      const L = await import("leaflet");
      if (!containerRef.current || cancelled) return;

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      const map = L.map(containerRef.current, {
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false
      }).setView(center, 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19
      }).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);
      L.polyline(route, {
        color: "#1E7F3C",
        dashArray: "5 7",
        opacity: 0.78,
        weight: 4
      }).addTo(map);

      markerRefs.current = [];
      spots.forEach((spot, index) => {
        const selected = index === selectedIndex;
        const icon = L.divIcon({
          className: "",
          html: `<div style="width:${selected ? 36 : 30}px;height:${selected ? 36 : 30}px;border-radius:13px;background:${spot.color};color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:900;box-shadow:0 8px 18px rgba(20,34,25,.24);border:${selected ? 4 : 2}px solid #fff">${index + 1}</div>`,
          iconAnchor: [selected ? 18 : 15, selected ? 18 : 15],
          iconSize: [selected ? 36 : 30, selected ? 36 : 30]
        });

        const marker = L.marker(spot.position, { icon })
          .addTo(map)
          .bindPopup(`<b>${spot.time} ${spot.title}</b><br />${spot.meta}`);
        markerRefs.current[index] = marker;
      });

      map.fitBounds(route, { maxZoom: 14, padding: [26, 26] });
      mapRef.current = map;
      const selectedSpot = spots[selectedIndex];
      if (selectedSpot) {
        map.flyTo(selectedSpot.position, 15, { duration: 0.55 });
      }
      markerRefs.current[selectedIndex]?.openPopup();
    }

    renderMap();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [center, day, route, selectedIndex, spots]);

  useEffect(() => {
    const selectedSpot = spots[selectedIndex];
    const marker = markerRefs.current[selectedIndex];
    if (!selectedSpot || !marker || !mapRef.current) return;

    mapRef.current.flyTo(selectedSpot.position, 15, { duration: 0.55 });
    marker.openPopup();
  }, [selectedIndex, spots]);

  return (
    <div className="mt-4 overflow-hidden rounded-[18px] border border-black/6 bg-white">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div>
          <div className="text-[12px] font-bold text-[#1E7F3C]">
            인터랙티브 지도
          </div>
          <div className="mt-0.5 text-[11px] text-[#8a938c]">
            이동, 확대, 마커 확인 가능
          </div>
        </div>
        <span className="rounded-full bg-[#F2F4F2] px-3 py-1.5 text-[11px] font-bold text-[#4a544c]">
          Day {day}
        </span>
      </div>
      <div ref={containerRef} className="h-[230px] w-full" />
    </div>
  );
}
