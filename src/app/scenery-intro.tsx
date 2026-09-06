"use client";

import { useEffect, useRef } from "react";

export function SceneryIntro({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = windowRef.current;
    if (
      !element ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;

    let openTimer: number | undefined;
    let finishTimer: number | undefined;
    let textReady = false;
    let visible = false;
    let cancelled = false;
    element.dataset.intro = "waiting";

    function openWhenReady() {
      if (cancelled || !textReady || !visible || openTimer !== undefined)
        return;
      openTimer = window.setTimeout(() => {
        element!.dataset.intro = "opening";
        finishTimer = window.setTimeout(() => {
          delete element!.dataset.intro;
        }, 1800);
      }, 80);
    }

    // Follow the actual text animation instead of starting a second fixed delay.
    const textAnimations =
      document.getElementById("intro-description")?.getAnimations() ?? [];
    void Promise.allSettled(
      textAnimations.map((animation) => animation.finished)
    ).then(() => {
      textReady = true;
      openWhenReady();
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        visible = true;
        openWhenReady();
      },
      { threshold: 0.25 }
    );

    observer.observe(element);
    return () => {
      cancelled = true;
      observer.disconnect();
      window.clearTimeout(openTimer);
      window.clearTimeout(finishTimer);
      delete element.dataset.intro;
    };
  }, []);

  return (
    <div
      ref={windowRef}
      className="scenery-intro relative isolate overflow-hidden rounded-[32px] shadow-[0_18px_42px_rgba(20,34,25,0.1)]"
    >
      {children}
    </div>
  );
}
