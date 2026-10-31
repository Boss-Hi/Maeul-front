"use client";

import { ArrowDown, ArrowUp, Check, Pencil, Plus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getFestivals, type Festival } from "@/lib/api/festivals";
import {
  getSchedule,
  reorderSchedules,
  saveSchedule,
  type ItineraryDay,
  type Schedule
} from "@/lib/api/itinerary";

const button =
  "inline-flex min-h-10 min-w-10 items-center justify-center gap-2 rounded-lg border border-[#d3e5d8] bg-white px-3 text-sm font-semibold disabled:opacity-40";
const field = "mt-2 w-full rounded-lg border border-[#d3e5d8] bg-white p-3";
const titleOf = (schedule: Schedule) =>
  schedule.title || schedule.tour?.title || "이름 없는 일정";

export default function ScheduleEditor({
  itineraryId,
  day,
  onRefresh,
  disabled
}: {
  itineraryId: number;
  day: ItineraryDay;
  onRefresh: () => Promise<void>;
  disabled: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const lock = useRef(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<number | "new" | null>(null);
  const [type, setType] = useState<"NORMAL" | "TOUR">("NORMAL");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [place, setPlace] = useState<{ id: string; title: string } | null>(
    null
  );
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [needsRefresh, setNeedsRefresh] = useState(false);
  const [retry, setRetry] = useState(0);
  const schedules = [...day.schedules].sort((a, b) => a.sequence - b.sequence);

  useEffect(() => {
    if (open) dialog.current?.showModal();
    else dialog.current?.close();
  }, [open]);

  useEffect(() => {
    if (typeof editing !== "number") return;
    const controller = new AbortController();
    setLoading(true);
    setError("");
    getSchedule(itineraryId, day.id, editing, controller.signal)
      .then((schedule) => {
        if (controller.signal.aborted) return;
        setType(schedule.type);
        setTitle(schedule.title || "");
        setDescription(schedule.description || "");
        setPlace(
          schedule.tour?.contentId
            ? { id: schedule.tour.contentId, title: schedule.tour.title }
            : null
        );
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setError("일정 상세를 불러오지 못했어요.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [itineraryId, day.id, editing, retry]);

  function add() {
    setType("NORMAL");
    setTitle("");
    setDescription("");
    setPlace(null);
    setError("");
    setNotice("");
    setEditing("new");
  }
  async function refresh() {
    await onRefresh();
    setNeedsRefresh(false);
  }
  async function mutate(action: () => Promise<unknown>) {
    if (lock.current || needsRefresh) return;
    lock.current = true;
    setBusy(true);
    setError("");
    setNotice("");
    let saved = false;
    try {
      await action();
      saved = true;
      setEditing(null);
      setNeedsRefresh(true);
      await refresh();
      setNotice("일정에 반영했어요.");
    } catch (cause) {
      setError(
        saved
          ? "저장됐지만 최신 일정을 불러오지 못했어요. 다시 조회해 주세요."
          : cause instanceof Error
            ? cause.message
            : "저장하지 못했어요."
      );
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  function move(index: number, delta: number) {
    const ids = schedules.map((item) => item.id);
    [ids[index], ids[index + delta]] = [ids[index + delta], ids[index]];
    void mutate(() => reorderSchedules(itineraryId, day.id, ids));
  }
  const blocked = busy || needsRefresh;
  return (
    <>
      <button
        className={button}
        disabled={disabled}
        onClick={() => setOpen(true)}
      >
        <Pencil size={16} /> 일정 편집
      </button>
      <dialog
        ref={dialog}
        onCancel={(event) => {
          if (busy) event.preventDefault();
        }}
        onClose={() => {
          setOpen(false);
          setEditing(null);
          setError("");
        }}
        aria-label={`Day ${day.dayNumber} 일정 편집`}
        className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%_-_32px)] max-w-2xl overflow-y-auto rounded-lg bg-[#f5f8f5] p-5 text-[#285b4c] shadow-xl backdrop:bg-black/40 sm:p-7"
      >
        <header className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm">{day.date}</p>
            <h2 className="text-xl font-bold">Day {day.dayNumber} 일정 편집</h2>
          </div>
          <button
            className={button}
            disabled={busy}
            title="닫기"
            aria-label="닫기"
            onClick={() => setOpen(false)}
          >
            <X size={20} />
          </button>
        </header>
        {notice && (
          <p role="status" className="mb-4">
            {notice}
          </p>
        )}
        {error && (
          <p role="alert" className="mb-4 text-red-700">
            {error}
          </p>
        )}
        {needsRefresh && (
          <button
            className={button}
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              try {
                await refresh();
                setError("");
              } catch {
                setError("다시 조회하지 못했어요. 잠시 후 시도해 주세요.");
              } finally {
                setBusy(false);
              }
            }}
          >
            다시 조회
          </button>
        )}
        {editing === null ? (
          <>
            <ul className="divide-y divide-[#d3e5d8]">
              {schedules.map((schedule, index) => (
                <li
                  key={schedule.id}
                  className="flex flex-wrap items-center gap-2 py-3"
                >
                  <span className="text-sm">{index + 1}</span>
                  <button
                    className="min-w-0 flex-1 break-words py-2 text-left font-bold"
                    disabled={blocked}
                    onClick={() => {
                      setError("");
                      setNotice("");
                      setLoading(true);
                      setEditing(schedule.id);
                    }}
                  >
                    {titleOf(schedule)}
                  </button>
                  <div className="flex gap-1">
                    <button
                      className={button}
                      title="위로 이동"
                      aria-label={`${titleOf(schedule)} 위로 이동`}
                      disabled={blocked || index === 0}
                      onClick={() => move(index, -1)}
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button
                      className={button}
                      title="아래로 이동"
                      aria-label={`${titleOf(schedule)} 아래로 이동`}
                      disabled={blocked || index === schedules.length - 1}
                      onClick={() => move(index, 1)}
                    >
                      <ArrowDown size={16} />
                    </button>
                    <button
                      className={button}
                      title="상세 수정"
                      aria-label={`${titleOf(schedule)} 수정`}
                      disabled={blocked}
                      onClick={() => {
                        setError("");
                        setNotice("");
                        setLoading(true);
                        setEditing(schedule.id);
                      }}
                    >
                      <Pencil size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            {!schedules.length && (
              <p className="py-5">이날의 첫 일정을 담아보세요.</p>
            )}
            <button
              className={button + " mt-5"}
              disabled={blocked}
              onClick={add}
            >
              <Plus size={16} /> 일정 추가
            </button>
          </>
        ) : loading ? (
          <p role="status">상세 일정을 불러오고 있어요.</p>
        ) : error && typeof editing === "number" ? (
          <div className="flex gap-2">
            <button
              className={button}
              onClick={() => setRetry((value) => value + 1)}
            >
              다시 조회
            </button>
            <button
              className={button}
              onClick={() => {
                setEditing(null);
                setError("");
              }}
            >
              목록으로
            </button>
          </div>
        ) : (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void mutate(() =>
                saveSchedule(
                  itineraryId,
                  day.id,
                  type === "NORMAL"
                    ? {
                        type,
                        title: title.trim(),
                        description: description.trim()
                      }
                    : { type, contentId: place!.id },
                  typeof editing === "number" ? editing : undefined
                )
              );
            }}
          >
            <fieldset disabled={blocked} className="space-y-5">
              <div className="flex gap-2" role="group" aria-label="일정 종류">
                {(["NORMAL", "TOUR"] as const).map((value) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={type === value}
                    className={
                      button +
                      (type === value ? " !bg-[#478264] text-white" : "")
                    }
                    onClick={() => setType(value)}
                  >
                    {value === "NORMAL" ? "직접 작성" : "장소 선택"}
                  </button>
                ))}
              </div>
              {type === "NORMAL" ? (
                <>
                  <label className="block">
                    일정 이름
                    <input
                      required
                      maxLength={200}
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      className={field}
                    />
                  </label>
                  <label className="block">
                    메모
                    <textarea
                      maxLength={2000}
                      rows={4}
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      className={field}
                    />
                  </label>
                </>
              ) : (
                <>
                  {place && (
                    <p className="flex items-center gap-2 font-bold">
                      <Check size={18} />
                      {place.title}
                    </p>
                  )}
                  <PlacePicker selectedId={place?.id} onSelect={setPlace} />
                </>
              )}
              <footer className="flex justify-end gap-2 border-t border-[#d3e5d8] pt-4">
                <button
                  type="button"
                  className={button}
                  onClick={() => {
                    setEditing(null);
                    setError("");
                  }}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className={button + " !bg-[#478264] text-white"}
                  disabled={type === "NORMAL" ? !title.trim() : !place}
                >
                  {busy ? "저장 중…" : "저장"}
                </button>
              </footer>
            </fieldset>
          </form>
        )}
      </dialog>
    </>
  );
}

function PlacePicker({
  selectedId,
  onSelect
}: {
  selectedId?: string;
  onSelect: (place: { id: string; title: string }) => void;
}) {
  const [category, setCategory] = useState("EV");
  const [page, setPage] = useState(0);
  const [items, setItems] = useState<Festival[]>([]);
  const [last, setLast] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    getFestivals({ page, category, size: 8 }, controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) {
          setItems(result.content);
          setLast(result.last);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setError("장소를 불러오지 못했어요.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [page, category, retry]);
  return (
    <section className="space-y-3">
      <label className="block">
        카테고리
        <select
          className={field}
          value={category}
          onChange={(event) => {
            setCategory(event.target.value);
            setPage(0);
          }}
        >
          <option value="EV">축제/공연/행사</option>
          <option value="EX">체험관광</option>
          <option value="HS">역사관광</option>
          <option value="VE">문화관광</option>
        </select>
      </label>
      {loading ? (
        <p role="status">장소를 불러오고 있어요.</p>
      ) : error ? (
        <>
          <p role="alert">{error}</p>
          <button
            type="button"
            className={button}
            onClick={() => setRetry((value) => value + 1)}
          >
            다시 시도
          </button>
        </>
      ) : (
        <>
          <ul className="divide-y divide-[#d3e5d8]">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  aria-pressed={selectedId === item.id}
                  className="flex w-full items-center gap-3 py-3 text-left"
                  onClick={() => onSelect({ id: item.id!, title: item.title })}
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt=""
                      className="h-14 w-14 shrink-0 rounded object-cover"
                    />
                  )}
                  <span className="min-w-0 flex-1">
                    <strong className="block break-words">{item.title}</strong>
                    <small>{item.address}</small>
                  </span>
                  {selectedId === item.id && <Check size={18} />}
                </button>
              </li>
            ))}
          </ul>
          {!items.length && <p>등록된 장소가 없어요.</p>}
        </>
      )}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          className={button}
          disabled={loading || page === 0}
          onClick={() => setPage((value) => value - 1)}
        >
          이전
        </button>
        <span>{page + 1}</span>
        <button
          type="button"
          className={button}
          disabled={loading || !!error || last}
          onClick={() => setPage((value) => value + 1)}
        >
          다음
        </button>
      </div>
    </section>
  );
}
