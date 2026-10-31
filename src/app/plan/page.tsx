"use client";

import {
  ArrowLeft,
  BookOpenText,
  BriefcaseBusiness,
  Car,
  Coffee,
  House,
  Leaf,
  MapPin,
  Navigation,
  PartyPopper,
  X,
  Trees
} from "lucide-react";
import Link from "next/link";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";
import styles from "./plan.module.css";
import { useSearchParams } from "next/navigation";
import PlanList from "./plan-list";
import { BottomNav } from "@/components/bottom-nav";
import ScheduleEditor from "./schedule-editor";
import {
  getCurrentItinerary,
  getItinerary,
  getItineraryDay,
  ItineraryError,
  type Itinerary
} from "@/lib/api/itinerary";

type Day = number;
type Spot = {
  hasLocation: boolean;
  time: string;
  title: string;
  meta: string;
  tag: string;
  color: string;
  position: [number, number];
};
function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ]!
  );
}
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

export default function PlanRoute() {
  return (
    <Suspense fallback={<p>일정을 불러오고 있어요.</p>}>
      <PlanRouter />
    </Suspense>
  );
}
function PlanRouter() {
  const params = useSearchParams();
  const id = params.get("itineraryId");
  return id === null ? <PlanList /> : <PlanPage key={id} />;
}
function PlanPage() {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loginRequired, setLoginRequired] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    const id = new URLSearchParams(window.location.search).get("itineraryId");
    (async () => {
      setLoading(true);
      setError("");
      setLoginRequired(false);
      try {
        const data =
          id === null
            ? await getCurrentItinerary(controller.signal)
            : await getItinerary(Number(id), controller.signal);
        if (!controller.signal.aborted) setItinerary(data);
      } catch (cause) {
        if (!controller.signal.aborted) {
          setError(
            cause instanceof ItineraryError
              ? cause.message
              : "일정 정보를 확인하지 못했어요."
          );
          setLoginRequired(
            cause instanceof ItineraryError && cause.status === 401
          );
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [attempt]);
  if (loading || error || !itinerary || !itinerary.days.length)
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-5 bg-[#f5f8f5] px-6 text-center text-[#285b4c]">
        <h1 className="text-2xl font-bold">마이로컬</h1>
        <p role="status">
          {loading
            ? "일정을 불러오고 있어요."
            : error || "아직 진행 중이거나 예정된 일정이 없어요."}
        </p>
        {!loading && error && !loginRequired && (
          <button
            className="rounded-lg border p-3"
            onClick={() => setAttempt((value) => value + 1)}
          >
            다시 시도
          </button>
        )}
        {!loading && (
          <Link
            href={loginRequired ? "/" : "/home"}
            className="rounded-lg bg-[#478264] px-5 py-3 text-white"
          >
            {loginRequired ? "로그인하기" : "마을 둘러보기"}
          </Link>
        )}
      </main>
    );
  return <PlanDetail key={itinerary.id} itinerary={itinerary} />;
}

function PlanDetail({ itinerary: initial }: { itinerary: Itinerary }) {
  const [itinerary, setItinerary] = useState(initial);
  const [dayLoading, setDayLoading] = useState(true);
  const [dayError, setDayError] = useState("");
  const [dayAttempt, setDayAttempt] = useState(0);
  const plans = useMemo(
    () =>
      Object.fromEntries(
        itinerary.days.map((entry) => {
          const spots: Spot[] = [...entry.schedules]
            .sort((a, b) => a.sequence - b.sequence)
            .map((schedule) => {
              const lat = schedule.tour?.mapY;
              const lng = schedule.tour?.mapX;
              const hasLocation =
                typeof lat === "number" &&
                typeof lng === "number" &&
                Math.abs(lat) <= 90 &&
                Math.abs(lng) <= 180 &&
                (lat !== 0 || lng !== 0);
              return {
                title:
                  schedule.title || schedule.tour?.title || "이름 없는 장소",
                time:
                  schedule.startTime?.slice(0, 5) || String(schedule.sequence),
                meta:
                  schedule.description ||
                  schedule.tour?.addr1 ||
                  "상세 정보 미등록",
                tag: "방문",
                color: "#4c9872",
                hasLocation,
                position: hasLocation
                  ? ([lat, lng] as [number, number])
                  : ([0, 0] as [number, number])
              };
            });
          return [
            entry.dayNumber,
            {
              spots,
              center:
                spots.find((spot) => spot.hasLocation)?.position ||
                ([36, 127] as [number, number])
            }
          ];
        })
      ),
    [itinerary]
  );

  const [day, setDay] = useState<Day>(itinerary.days[0].dayNumber);
  const [selected, setSelected] = useState(0);
  const [focusMap, setFocusMap] = useState(false);
  const [routeSpot, setRouteSpot] = useState<Spot | null>(null);
  const plan = plans[day];
  const activeDay = itinerary.days.find((entry) => entry.dayNumber === day)!;
  const refreshDay = useCallback(
    async (signal?: AbortSignal) => {
      const updated = await getItineraryDay(initial.id, activeDay.id, signal);
      if (signal?.aborted) return;
      setItinerary((previous) => ({
        ...previous,
        days: previous.days.map((entry) =>
          entry.id === updated.id ? updated : entry
        )
      }));
      setRouteSpot(null);
      setFocusMap(false);
      setSelected(0);
    },
    [initial.id, activeDay.id]
  );
  useEffect(() => {
    const controller = new AbortController();
    setDayLoading(true);
    setDayError("");
    refreshDay(controller.signal)
      .catch(() => {
        if (!controller.signal.aborted)
          setDayError(
            "최신 일정을 불러오지 못했어요. 이전 조회 내용을 표시하고 있어요."
          );
      })
      .finally(() => {
        if (!controller.signal.aborted) setDayLoading(false);
      });
    return () => controller.abort();
  }, [refreshDay, dayAttempt]);

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.scroll}>
          <header
            className={styles.hero}
            style={{
              backgroundImage: itinerary.tour.firstImage
                ? `url("${itinerary.tour.firstImage.replaceAll('"', "%22")}")`
                : "none"
            }}
          >
            <Link
              href="/plan"
              aria-label="내 일정으로 돌아가기"
              className={styles.back}
            >
              <ArrowLeft size={20} />
            </Link>
          </header>
          <div className={styles.body}>
            <div className={styles.heroCopy}>
              <p>마이 로컬 플랜</p>
              <h1>{itinerary.tour.title}</h1>
              <p>
                {itinerary.startDate} ~ {itinerary.endDate}
              </p>
            </div>

            {itinerary.days.some(
              (entry) =>
                entry.date < itinerary.startDate ||
                entry.date > itinerary.endDate
            ) && (
              <p role="status" className={styles.notice}>
                일부 일정이 선택한 체류 기간을 벗어나 있어요.
              </p>
            )}
            <nav
              className={styles.days}
              style={{ display: "flex", overflowX: "auto" }}
              aria-label="일차 선택"
            >
              {itinerary.days.map(({ dayNumber: item }) => (
                <button
                  key={item}
                  style={{ flex: "1 0 90px" }}
                  onClick={() => {
                    if (day === item) return;
                    setDayLoading(true);
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
            {dayLoading && (
              <p role="status" className={styles.notice}>
                선택한 날의 일정을 확인하고 있어요.
              </p>
            )}
            {dayError && (
              <div className={styles.notice} role="alert">
                {dayError}
                <button
                  className="ml-3 underline"
                  onClick={() => setDayAttempt((value) => value + 1)}
                >
                  다시 조회
                </button>
              </div>
            )}
            <MapView
              day={day}
              center={plan.center}
              spots={plan.spots}
              selected={selected}
              focusMap={focusMap}
              onFocusHandled={() => setFocusMap(false)}
              onDirectionsOpen={setRouteSpot}
            />
            <div className={styles.sectionTitle}>
              <h2>
                <Leaf size={21} /> 선택한 날의 일정
              </h2>
              <span>{plan.spots.length}곳</span>
              <ScheduleEditor
                key={activeDay.id}
                itineraryId={itinerary.id}
                day={activeDay}
                onRefresh={refreshDay}
                disabled={dayLoading || !!dayError}
              />
            </div>
            {!plan.spots.length && (
              <p className={styles.notice}>아직 담긴 일정이 없어요.</p>
            )}
            <div className={styles.list}>
              {plan.spots.map((spot, index) => (
                <div
                  key={`${spot.time}-${escapeHtml(spot.title)}`}
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
                    disabled={!spot.hasLocation}
                    title={spot.hasLocation ? "길찾기" : "위치 정보가 없어요"}
                    onClick={() => setRouteSpot(spot)}
                    className={styles.directions}
                    aria-label={`${spot.title} 길찾기`}
                  >
                    <Navigation size={17} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
        <BottomNav />
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
            title={`${escapeHtml(spot.title)} 길찾기`}
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
  const markers = useRef<(LeafletMarker | null)[]>([]);
  const route = useMemo(
    () => spots.filter((spot) => spot.hasLocation).map((spot) => spot.position),
    [spots]
  );
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
        if (!spot.hasLocation) return null;
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
            `<div style="display:flex;min-width:190px;gap:10px"><div style="min-width:0;flex:1;padding-right:4px"><b>${spot.time} ${escapeHtml(spot.title)}</b><span style="display:block;margin-top:4px;color:#66756c;font-size:12px;line-height:1.45">${escapeHtml(spot.meta)}</span></div><button type="button" class="maeul-map-directions" aria-label="${escapeHtml(spot.title)} 길찾기" title="길찾기" style="align-self:flex-end;display:flex;width:34px;height:34px;align-items:center;justify-content:center;border:0;border-radius:50%;background:#edf7ed;color:#397b55;cursor:pointer"><svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 11 19-8-8 19-2-8-9-3Z"/></svg></button></div>`,
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
      if (route.length)
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
    if (focusMap && spot?.hasLocation && map.current) {
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
        <p>방문할 장소</p>
      </div>
      <span>Day {day}</span>
      <div ref={element} className={styles.map} />
    </section>
  );
}
