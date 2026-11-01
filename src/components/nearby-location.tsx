"use client";

import { useEffect, useId, useRef, useState } from "react";
import { LocateFixed, X } from "lucide-react";
import { getCurrentCoordinates, getLocationRegion } from "@/lib/api/location";
import { getRegions } from "@/lib/api/regions";
import { readNearbyRegion, writeNearbyRegion } from "@/lib/nearby-storage";

export type NearbyRegion = Awaited<ReturnType<typeof getLocationRegion>>;

export function NearbyLocation({
  onRegion,
  restore = true,
  compact = false,
  hideTrigger = false,
  openRequest = 0,
  className
}: {
  onRegion: (region: NearbyRegion) => void;
  restore?: boolean;
  compact?: boolean;
  hideTrigger?: boolean;
  openRequest?: number;
  className?: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const request = useRef<AbortController | null>(null);
  const callback = useRef(onRegion);
  const initialRestore = useRef(restore);
  const titleId = useId();
  const descriptionId = useId();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    callback.current = onRegion;
  }, [onRegion]);
  useEffect(() => {
    if (openRequest > 0) {
      setError("");
      try {
        const region = readNearbyRegion(localStorage, sessionStorage);
        if (region) {
          callback.current(region);
          return;
        }
      } catch {
        /* Without saved data, ask before requesting a fresh location. */
      }
      dialog.current?.showModal();
    }
  }, [openRequest]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      let remembered = false;
      try {
        const region = readNearbyRegion(localStorage, sessionStorage);
        remembered = Boolean(region);
        if (initialRestore.current && region) callback.current(region);
      } catch {
        /* Storage may be unavailable; location remains optional. */
      }
      if (!remembered) dialog.current?.showModal();
    });
    return () => {
      cancelAnimationFrame(frame);
      request.current?.abort();
      dialog.current?.close();
    };
  }, []);

  function dismiss() {
    request.current?.abort();
    setBusy(false);
    setError("");
    dialog.current?.close();
  }

  async function locate() {
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setBusy(true);
    setError("");
    try {
      const coords = await getCurrentCoordinates(navigator.geolocation);
      if (controller.signal.aborted) return;
      const regions = await getRegions(controller.signal);
      const region = await getLocationRegion(
        coords.latitude,
        coords.longitude,
        regions,
        controller.signal
      );
      if (controller.signal.aborted) return;
      try {
        writeNearbyRegion(localStorage, sessionStorage, region);
      } catch {
        /* Continue without persistence. */
      }
      callback.current(region);
      dialog.current?.close();
    } catch (cause) {
      if (!controller.signal.aborted)
        setError(
          cause instanceof Error ? cause.message : "위치를 확인하지 못했어요."
        );
    } finally {
      if (!controller.signal.aborted) setBusy(false);
    }
  }

  return (
    <>
      {!hideTrigger && (
        <button
          type="button"
          aria-label={compact ? "현재 위치 다시 확인" : "내 주변"}
          title={compact ? "현재 위치 다시 확인" : "내 주변"}
          onClick={() => {
            setError("");
            dialog.current?.showModal();
          }}
          className={
            className ??
            "inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#478264]"
          }
        >
          <LocateFixed size={17} />
          {!compact && "내 주변"}
        </button>
      )}
      <dialog
        ref={dialog}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onCancel={(event) => {
          event.preventDefault();
          dismiss();
        }}
        className="fixed inset-0 m-auto w-[calc(100%-40px)] max-w-[400px] rounded-lg border border-[#d3e5d8] bg-white p-6 text-[#24432d] shadow-xl backdrop:bg-black/40"
      >
        <div className="mb-5 flex items-center justify-between">
          <LocateFixed size={28} className="text-[#478264]" />
          <button
            type="button"
            aria-label="닫기"
            onClick={dismiss}
            className="flex h-11 w-11 items-center justify-center"
          >
            <X size={20} />
          </button>
        </div>
        <h2 id={titleId} className="text-xl font-bold">
          지금 있는 마을을 둘러볼까요?
        </h2>
        <p id={descriptionId} className="mt-3 text-sm leading-6 text-[#617569]">
          현재 위치로 가까운 지역의 축제와 즐길 거리를 찾아드려요. 위치를
          허용하지 않아도 직접 지역을 고를 수 있어요.
        </p>
        <p role="status" className="mt-3 text-sm text-[#a33b31]">
          {error}
        </p>
        <button
          type="button"
          onClick={locate}
          disabled={busy}
          aria-busy={busy}
          className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#478264] px-4 py-3 font-bold text-white disabled:opacity-60"
        >
          <LocateFixed size={18} />
          {busy
            ? "현재 위치 확인 중"
            : error
              ? "다시 확인하기"
              : "내 주변 둘러보기"}
        </button>
        <button
          type="button"
          onClick={dismiss}
          className="mt-2 min-h-11 w-full text-sm text-[#617569]"
        >
          나중에 할게요
        </button>
      </dialog>
    </>
  );
}
