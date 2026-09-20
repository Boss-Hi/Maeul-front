"use client";

import {
  ArrowLeft,
  BookOpenText,
  BriefcaseBusiness,
  Car,
  CalendarDays,
  CircleUserRound,
  Coffee,
  Home,
  House,
  Leaf,
  MapPin,
  Navigation,
  PartyPopper,
  Search,
  Star,
  X,
  Trees
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";
import styles from "./plan.module.css";

type Day = 1 | 2 | 3;
type Spot = {
  time: string;
  title: string;
  meta: string;
  tag: string;
  color: string;
  position: [number, number];
};
const tabs = [
  { label: "탐색", Icon: Search, href: "/home" },
  { label: "마이로컬", Icon: CalendarDays, href: "/plan", active: true },
  { label: "미션", Icon: Star, href: "/mission" },
  { label: "MY", Icon: CircleUserRound, href: "/my" }
];
const plans: Record<Day, { center: [number, number]; spots: Spot[] }> = {
  1: {
    center: [37.776, 128.93],
    spots: [
      {
        time: "09:30",
        title: "경포 파도소리 오피스",
        meta: "오전 집중 업무 · 지자체 협업 참석",
        tag: "업무",
        color: "#4c9872",
        position: [37.795, 128.91]
      },
      {
        time: "14:00",
        title: "안목 커피거리",
        meta: "로스터리 산책 · 커피 미션 가능",
        tag: "산책",
        color: "#4d9b68",
        position: [37.7714, 128.9488]
      },
      {
        time: "17:00",
        title: "커피 페스타 메인 무대",
        meta: "핸드드립 체험과 야간 버스킹",
        tag: "행사",
        color: "#e9aa2c",
        position: [37.7724, 128.9471]
      },
      {
        time: "21:30",
        title: "웨이브 코리빙 하우스",
        meta: "행사장 도보권 · 라운지 이용",
        tag: "숙소",
        color: "#e77c4d",
        position: [37.7688, 128.936]
      }
    ]
  },
  2: {
    center: [37.785, 128.924],
    spots: [
      {
        time: "10:00",
        title: "파도책방 안목점",
        meta: "바다뷰 독립서점 · 30분 독서",
        tag: "미션",
        color: "#4d9b68",
        position: [37.7734, 128.9465]
      },
      {
        time: "13:00",
        title: "초당 순두부 거리",
        meta: "점심과 짧은 동네 산책",
        tag: "식사",
        color: "#d47a32",
        position: [37.7914, 128.9143]
      },
      {
        time: "15:00",
        title: "경포 워케이션 카페",
        meta: "2시간 작업 · 콘센트 좌석",
        tag: "업무",
        color: "#4c9872",
        position: [37.7963, 128.9068]
      },
      {
        time: "18:00",
        title: "안목 로스터리 테이스팅",
        meta: "핸드드립 3종 비교 시음",
        tag: "체험",
        color: "#a87528",
        position: [37.7718, 128.9496]
      }
    ]
  },
  3: {
    center: [37.765, 128.916],
    spots: [
      {
        time: "09:30",
        title: "코워킹 마무리",
        meta: "체크아웃 정리 · 짐 보관",
        tag: "업무",
        color: "#4c9872",
        position: [37.795, 128.91]
      },
      {
        time: "11:00",
        title: "책방 인증 마무리",
        meta: "한 줄 감상 기록과 미션 리포트",
        tag: "미션",
        color: "#4d9b68",
        position: [37.7734, 128.9465]
      },
      {
        time: "12:30",
        title: "교동 로컬 점심",
        meta: "기차 전 여유 식사",
        tag: "식사",
        color: "#d47a32",
        position: [37.7628, 128.8995]
      },
      {
        time: "17:00",
        title: "강릉역 이동",
        meta: "KTX 탑승 전 카페 대기",
        tag: "이동",
        color: "#697e8a",
        position: [37.7641, 128.8995]
      }
    ]
  }
};
function SpotIcon({ tag }: { tag: string }) {
  const Icon =
    tag === "업무"
      ? BriefcaseBusiness
      : tag === "산책"
        ? Trees
        : tag === "행사"
          ? PartyPopper
          : tag === "숙소"
            ? House
            : tag === "미션"
              ? BookOpenText
              : tag === "식사" || tag === "체험"
                ? Coffee
                : MapPin;
  return <Icon size={21} />;
}

export default function PlanPage() {
  const [day, setDay] = useState<Day>(1);
  const [selected, setSelected] = useState(0);
  const [focusMap, setFocusMap] = useState(false);
  const [routeSpot, setRouteSpot] = useState<Spot | null>(null);
  const plan = plans[day];
  const main = plan.spots.find((spot) => spot.tag === "행사") ?? plan.spots[0];
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.scroll}>
          <header className={styles.hero}>
            <Link
              href="/home"
              aria-label="탐색으로 돌아가기"
              className={styles.back}
            >
              <ArrowLeft size={22} />
            </Link>
            <div className={styles.heroCopy}>
              <p>마이 로컬 플랜</p>
              <h1>강릉 3일 살기 · 커피 페스타</h1>
            </div>
          </header>
          <div className={styles.body}>
            <nav className={styles.days} aria-label="일차 선택">
              {([1, 2, 3] as Day[]).map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setDay(item);
                    setSelected(0);
                    setFocusMap(false);
                  }}
                  aria-pressed={day === item}
                >
                  {`Day ${item}`}
                  {day === item && <Leaf size={16} />}
                </button>
              ))}
            </nav>
            <MapView
              day={day}
              center={plan.center}
              spots={plan.spots}
              selected={selected}
              focusMap={focusMap}
              onFocusHandled={() => setFocusMap(false)}
              onDirectionsOpen={setRouteSpot}
            />
            <Link href="/mission" className={styles.mission}>
              <span>
                <BookOpenText size={27} />
              </span>
              <div>
                <p>
                  <Leaf size={15} /> 진행 중 미션
                </p>
                <h2>바다책방 독서광</h2>
                <small>로컬 서점 2곳에서 30분 독서 인증</small>
              </div>
              <strong>2/3 완료</strong>
            </Link>
            <div className={styles.sectionTitle}>
              <h2>
                <Leaf size={21} /> 오늘의 핵심 일정
              </h2>
              <span>{plan.spots.length}곳</span>
            </div>
            <div className={styles.list}>
              {plan.spots.map((spot, index) => (
                <div
                  key={`${spot.time}-${spot.title}`}
                  className={selected === index ? styles.selected : ""}
                >
                  <button
                    onClick={() => {
                      setFocusMap(true);
                      setSelected(index);
                    }}
                    className={styles.scheduleButton}
                  >
                    <b style={{ backgroundColor: spot.color }}>{spot.time}</b>
                    <i
                      style={{
                        color: spot.color,
                        backgroundColor: `${spot.color}18`
                      }}
                    >
                      <SpotIcon tag={spot.tag} />
                    </i>
                    <span>
                      <strong>{spot.title}</strong>
                      <small>{spot.meta}</small>
                    </span>
                    <em
                      style={{
                        color: spot.color,
                        backgroundColor: `${spot.color}14`
                      }}
                    >
                      {spot.tag}
                    </em>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRouteSpot(spot)}
                    className={styles.directions}
                    aria-label={`${spot.title} 길찾기`}
                  >
                    <Navigation size={17} />
                  </button>
                </div>
              ))}
            </div>
            <section className={styles.stay}>
              <div>
                <p>
                  <Home size={17} /> 숙소
                </p>
                <h2>웨이브 코리빙 하우스 강릉</h2>
                <small>{main.title} 기준 이동 편한 위치</small>
              </div>
              <button>변경</button>
            </section>
            <p className={styles.notice}>
              <Leaf size={16} /> 주요 행사는 플랜 기준점으로 고정되고, 주변
              일정과 숙소는 대체할 수 있어요.
            </p>
          </div>
        </section>
        <nav className={styles.bottom}>
          {tabs.map(({ label, Icon, href, active }) => (
            <Link
              key={label}
              href={href}
              aria-current={active ? "page" : undefined}
            >
              <Icon size={21} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        {routeSpot && (
          <DirectionsModal
            spot={routeSpot}
            onClose={() => setRouteSpot(null)}
          />
        )}
      </div>
    </main>
  );
}

function DirectionsModal({
  spot,
  onClose
}: Readonly<{ spot: Spot; onClose: () => void }>) {
  const [mode, setMode] = useState("walking");
  const [showDirections, setShowDirections] = useState(false);
  const [origin, setOrigin] = useState<string | null>(null);
  const [locationError, setLocationError] = useState(false);
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY;
  const destination = `${spot.position[0]},${spot.position[1]}`;
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      ({ coords }) => setOrigin(`${coords.latitude},${coords.longitude}`),
      () => setLocationError(true),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  }, []);
  const placeSrc = key
    ? `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(key)}&q=${encodeURIComponent(destination)}&zoom=16&language=ko&region=KR`
    : "";
  const directionsSrc =
    key && origin
      ? `https://www.google.com/maps/embed/v1/directions?key=${encodeURIComponent(key)}&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=${mode}&language=ko&region=KR`
      : "";
  const src = showDirections ? directionsSrc : placeSrc;
  return (
    <div className={styles.modalBackdrop} onMouseDown={onClose}>
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label="Google 지도 길찾기"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <div>
            <p>길찾기</p>
            <h2>{spot.title}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="닫기">
            <X size={20} />
          </button>
        </div>
        <div className={styles.modes}>
          {[
            { value: "walking", label: "도보", Icon: Leaf },
            { value: "transit", label: "대중교통", Icon: Navigation },
            { value: "driving", label: "차량", Icon: Car }
          ].map(({ value, label, Icon }) => {
            return (
              <button
                key={value}
                type="button"
                aria-pressed={showDirections && mode === value}
                onClick={() => {
                  setMode(value as string);
                  setShowDirections(true);
                }}
              >
                <Icon size={16} />
                {label}
              </button>
            );
          })}
        </div>
        {src ? (
          <iframe
            className={styles.googleMap}
            title={`${spot.title} 길찾기`}
            src={src}
            allow="geolocation"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <div className={styles.routeLoading}>
            <Navigation size={22} />
            <strong>
              {locationError
                ? "현재 위치 권한이 필요해요."
                : "현재 위치를 확인하고 있어요."}
            </strong>
            <span>
              {locationError
                ? "브라우저 위치 권한을 허용한 뒤 다시 열어주세요."
                : "위치를 확인하면 선택한 장소까지 경로를 보여드려요."}
            </span>
          </div>
        )}
      </section>
    </div>
  );
}

function MapView({
  day,
  center,
  spots,
  selected,
  focusMap,
  onFocusHandled,
  onDirectionsOpen
}: {
  day: Day;
  center: [number, number];
  spots: Spot[];
  selected: number;
  focusMap: boolean;
  onFocusHandled: () => void;
  onDirectionsOpen: (spot: Spot) => void;
}) {
  const element = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const markers = useRef<LeafletMarker[]>([]);
  const route = useMemo(() => spots.map((spot) => spot.position), [spots]);
  useEffect(() => {
    let cancelled = false;
    async function draw() {
      const L = await import("leaflet");
      if (!element.current || cancelled) return;
      map.current?.remove();
      const current = L.map(element.current, {
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false
      }).setView(center, 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19
      }).addTo(current);
      L.control.zoom({ position: "bottomright" }).addTo(current);
      L.polyline(route, {
        color: "#4d936b",
        dashArray: "5 7",
        opacity: 0.72,
        weight: 4
      }).addTo(current);
      markers.current = spots.map((spot, index) => {
        const size = 32;
        const icon = L.divIcon({
          className: "",
          html: `<div style="display:flex;width:${size}px;height:${size}px;align-items:center;justify-content:center;border:3px solid white;border-radius:50%;background:${spot.color};color:white;font:800 12px system-ui;box-shadow:0 5px 12px rgba(20,34,25,.24)">${index + 1}</div>`,
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2]
        });
        const marker = L.marker(spot.position, {
          icon,
          keyboard: false,
          autoPanOnFocus: false
        })
          .addTo(current)
          .bindPopup(
            `<div style="display:flex;min-width:190px;gap:10px"><div style="min-width:0;flex:1;padding-right:4px"><b>${spot.time} ${spot.title}</b><span style="display:block;margin-top:4px;color:#66756c;font-size:12px;line-height:1.45">${spot.meta}</span></div><button type="button" class="maeul-map-directions" aria-label="${spot.title} 길찾기" title="길찾기" style="align-self:flex-end;display:flex;width:34px;height:34px;align-items:center;justify-content:center;border:0;border-radius:50%;background:#edf7ed;color:#397b55;cursor:pointer"><svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 11 19-8-8 19-2-8-9-3Z"/></svg></button></div>`,
            { autoPan: false }
          );
        marker.on("popupopen", (event) => {
          const directionsButton = event.popup
            .getElement()
            ?.querySelector<HTMLButtonElement>(".maeul-map-directions");
          if (!directionsButton) return;

          L.DomEvent.disableClickPropagation(directionsButton);
          L.DomEvent.disableScrollPropagation(directionsButton);
          directionsButton.addEventListener(
            "click",
            (clickEvent) => {
              clickEvent.preventDefault();
              clickEvent.stopPropagation();
              current.closePopup();
              if (document.activeElement instanceof HTMLElement)
                document.activeElement.blur();
              onDirectionsOpen(spot);
            },
            { once: true }
          );
        });
        return marker;
      });
      current.fitBounds(route, { maxZoom: 14, padding: [26, 26] });
      map.current = current;
    }
    draw();
    return () => {
      cancelled = true;
      map.current?.remove();
      map.current = null;
    };
  }, [center, day, onDirectionsOpen, route, spots]);
  useEffect(() => {
    const spot = spots[selected];
    if (focusMap && spot && map.current) {
      map.current.flyTo(spot.position, map.current.getZoom(), {
        duration: 0.55
      });
      markers.current[selected]?.openPopup();
      onFocusHandled();
    }
  }, [focusMap, onFocusHandled, selected, spots]);
  return (
    <section className={styles.mapCard}>
      <div>
        <h2>
          <MapPin size={22} /> 인터랙티브 지도
        </h2>
        <p>이동, 위치, 미션 확인 가능</p>
      </div>
      <span>Day {day}</span>
      <div ref={element} className={styles.map} />
    </section>
  );
}
