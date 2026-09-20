"use client";

import {
  ArrowLeft,
  BookOpenText,
  Leaf,
  CalendarDays,
  CheckCircle2,
  CircleUserRound,
  Coffee,
  LoaderCircle,
  MapPin,
  MessageCircle,
  Mountain,
  Navigation,
  Search,
  Star,
  UsersRound,
  Waves,
  X
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "./mission.module.css";

const missionSteps = [
  {
    label: "파도책방 안목점",
    detail: "바다뷰 독립서점에서 30분 독서",
    place: "강릉시 창해로 14"
  },
  {
    label: "고래책방 커피 코너",
    detail: "커피 한 잔과 함께 독서 기록 남기기",
    place: "강릉시 안목길 28"
  },
  {
    label: "30분 독서 인증",
    detail: "선택한 서점에서 30분간 머물며 독서하기",
    place: "앞선 두 장소 인증 후 시작"
  }
];

const sameMates = [
  {
    name: "김민준 · 28",
    meta: "강릉 3일 살기 · 도보 8분",
    tag: "같은 미션 진행 중",
    cta: "미션 같이하기 제안"
  },
  {
    name: "박서연 · 31",
    meta: "강릉 5일 살기 · 도보 4분",
    tag: "오늘 근처에 있어요",
    cta: "메시지 보내기"
  }
];

const badges = [
  {
    name: "바다책방 독서광",
    cond: "로컬 독서 미션 3회 클리어",
    state: "획득 예정",
    got: true,
    Icon: BookOpenText,
    color: "#1E7F3C",
    soft: "#EAF6EE",
    mark: "BOOK"
  },
  {
    name: "로스터리 메이트",
    cond: "로스터리 3곳 팀 미션",
    state: "2026.08.02 획득",
    got: true,
    Icon: Coffee,
    color: "#8a5a12",
    soft: "#FBF0DA",
    mark: "CAFE"
  },
  {
    name: "마을길 투어왕",
    cond: "서로 다른 동네 코스 미션 클리어 2/3",
    state: "진행 중",
    got: false,
    Icon: Mountain,
    color: "#2b6cb0",
    soft: "#E8F1FB",
    mark: "TOUR"
  },
  {
    name: "파도 입문자",
    cond: "해변 액티비티 미션 1회",
    state: "잠김",
    got: false,
    Icon: Waves,
    color: "#2d8c9c",
    soft: "#E6F6F7",
    mark: "WAVE"
  }
];

const tabs = [
  { label: "탐색", Icon: Search, href: "/home", active: false },
  { label: "마이로컬", Icon: CalendarDays, href: "/plan", active: false },
  { label: "미션", Icon: Star, href: "/mission", active: true },
  { label: "MY", Icon: CircleUserRound, href: "/my", active: false }
];

export default function MissionPage() {
  const [completedCount, setCompletedCount] = useState(1);
  const [previewStep, setPreviewStep] = useState<number | null>(null);
  const [verificationState, setVerificationState] = useState<
    "idle" | "verifying" | "success"
  >("idle");
  const [missionFinished, setMissionFinished] = useState(false);
  const [matchingPreviewOpen, setMatchingPreviewOpen] = useState(false);
  const verificationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progress = Math.round((completedCount / missionSteps.length) * 100);
  const canCompleteMission = completedCount === missionSteps.length;

  useEffect(
    () => () => {
      if (verificationTimer.current) clearTimeout(verificationTimer.current);
    },
    []
  );

  function openVerification(index: number) {
    if (index !== completedCount || missionFinished) return;
    setPreviewStep(index);
    setVerificationState("idle");
  }

  function simulateVerification() {
    if (previewStep === null || verificationState !== "idle") return;
    setVerificationState("verifying");
    verificationTimer.current = setTimeout(() => {
      setCompletedCount((count) => Math.min(count + 1, missionSteps.length));
      setVerificationState("success");
    }, 1200);
  }

  function closeVerification() {
    if (verificationState === "verifying") return;
    setPreviewStep(null);
  }

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.scroll}>
          <header className={styles.hero}>
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <Link
                  href="/home"
                  aria-label="탐색으로 돌아가기"
                  className={styles.backLink}
                >
                  <ArrowLeft size={20} />
                </Link>
                <div className={styles.kicker}>
                  지역을 여행하고, 일상을 경험하는
                </div>
                <h1 className={styles.title}>
                  나의 미션 <Leaf size={25} strokeWidth={1.6} />
                </h1>
              </div>
              <Link href="/plan" className={styles.planLink}>
                <Navigation size={15} />
                플랜
              </Link>
            </div>
          </header>

          <div className={styles.body}>
            <div className={styles.primaryColumn}>
              <div className={styles.progress}>
                <div className="flex items-center justify-between gap-3">
                  <span className={styles.status}>
                    {missionFinished ? "완료" : "진행 중"}
                  </span>
                  <span className={styles.progressLabel}>
                    진행률 {progress}%
                  </span>
                </div>
                <h2 className={styles.missionTitle}>강릉 독서 미션</h2>
                <p className={styles.description}>
                  바다 보이는 로컬 서점 2곳에서 각 30분 이상 독서하고, 장소 반경
                  100m 안에서 인증해요.
                </p>
                <div
                  role="progressbar"
                  aria-label="미션 진행률"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  className={styles.progressTrack}
                >
                  <div
                    className={styles.progressFill}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="text-[11px] text-[#6e8b79]">
                    {completedCount}/3 완료
                  </span>
                  <span className="text-[11px] font-bold text-[#477a60]">
                    획득 예정 배지 · 강릉 독서광
                  </span>
                </div>
              </div>

              <div className={styles.nearbyStay}>
                <span className={styles.nearbyIcon}>
                  <UsersRound size={19} />
                </span>
                <div>
                  <p>주변 체류자</p>
                  <strong>12명</strong>
                </div>
                <span className={styles.nearbyDescription}>
                  지금 강릉에 머무르고 있어요
                </span>
              </div>

              <div className={styles.checklist}>
                <div className="flex items-center justify-between gap-3">
                  <h2 className={styles.sectionTitle}>
                    <Leaf size={23} strokeWidth={1.5} /> 인증 체크리스트
                  </h2>
                </div>
                <div className={styles.checkRows}>
                  {missionSteps.map((step, index) => (
                    <button
                      key={step.label}
                      type="button"
                      onClick={() => openVerification(index)}
                      disabled={index > completedCount || missionFinished}
                      className={`${styles.checkRow} ${
                        index === completedCount && !missionFinished
                          ? styles.checkRowAvailable
                          : ""
                      }`}
                    >
                      <div
                        className={`flex size-10 shrink-0 items-center justify-center rounded-full ${
                          index < completedCount
                            ? "bg-[#4e9470] text-white"
                            : index === completedCount && !missionFinished
                              ? "bg-[#e4f1e5] text-[#4e9470]"
                              : "bg-[#e7eae8] text-[#a3afaa]"
                        }`}
                      >
                        {index < completedCount ? (
                          <CheckCircle2 size={17} />
                        ) : index === completedCount && !missionFinished ? (
                          <MapPin size={18} />
                        ) : (
                          <span className="text-xs font-black">
                            {index + 1}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm leading-6 font-bold break-words text-[#315f50]">
                          {step.label}
                        </div>
                        <div className="mt-0.5 text-[11px] font-medium text-[#8a938c]">
                          {index < completedCount
                            ? "완료"
                            : index === completedCount && !missionFinished
                              ? "인증하기"
                              : "대기"}
                        </div>
                      </div>
                      {index === completedCount && !missionFinished && (
                        <span className={styles.verifyLabel}>미리보기</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <section
                className={styles.matchingPreview}
                aria-label="동행 매칭 미리보기"
              >
                <div className={styles.mates}>
                  <div className={styles.matesHeader}>
                    <div>
                      <h2 className={styles.sectionTitle}>
                        <Leaf size={23} strokeWidth={1.5} /> 같은 미션 체류자
                      </h2>
                      <p>근처에서 같은 미션을 즐기는 체류자를 만나보세요.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setMatchingPreviewOpen(true)}
                    >
                      전체 체류자 보기
                    </button>
                  </div>
                  <div className={styles.mateGrid}>
                    {sameMates.map((mate) => (
                      <article key={mate.name} className={styles.mate}>
                        <div className={styles.mateProfile}>
                          <span className={styles.avatar}>
                            <CircleUserRound size={22} />
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className={styles.mateHeading}>
                              <strong>{mate.name}</strong>
                              <span className={styles.mateTag}>{mate.tag}</span>
                            </div>
                            <p className={styles.mateMeta}>{mate.meta}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          className={styles.outlineButton}
                          onClick={() => setMatchingPreviewOpen(true)}
                        >
                          <MessageCircle size={15} /> {mate.cta}
                        </button>
                      </article>
                    ))}
                  </div>
                </div>
              </section>
            </div>
            <div className={styles.collection}>
              <h2 className={styles.collectionTitle}>배지 컬렉션</h2>
              <div className="mt-2 flex justify-end">
                <Link
                  href="/bedge"
                  className="rounded-full bg-[#EAF6EE] px-3 py-1.5 text-[11px] font-bold text-[#1E7F3C]"
                >
                  전체 배지 보기
                </Link>
              </div>
              <div
                className={`${styles.badgeGrid} mt-3 grid grid-cols-2 gap-2.5`}
              >
                {badges.map((badge) => (
                  <div
                    key={badge.name}
                    className={`${styles.badge} ${
                      badge.got ? "border-black/6" : "border-black/6"
                    }`}
                  >
                    <div
                      className="absolute top-3 right-3 rounded-md px-2 py-1 text-[9px] font-black tracking-[0.08em]"
                      style={{
                        backgroundColor: badge.got ? badge.color : "#EDF1EE",
                        color: badge.got ? "#ffffff" : "#98a19a"
                      }}
                    >
                      {badge.mark}
                    </div>

                    <div
                      className="relative flex size-14 items-center justify-center rounded-full border bg-white"
                      style={{
                        borderColor: badge.got ? `${badge.color}30` : "#dfe5e1",
                        color: badge.got ? badge.color : "#98a19a"
                      }}
                    >
                      <div
                        className="absolute inset-1.5 rounded-full"
                        style={{
                          backgroundColor: badge.got ? badge.soft : "#EDF1EE"
                        }}
                      />
                      <badge.Icon
                        className="relative"
                        size={28}
                        strokeWidth={2.4}
                      />
                    </div>
                    <div className="relative mt-3 text-[13px] font-black text-[#16211a]">
                      {badge.name}
                    </div>
                    <div className="relative mt-1.5 min-h-8 text-[11px] leading-relaxed text-[#8a938c]">
                      {badge.cond}
                    </div>
                    <div
                      className="relative mt-3 inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold"
                      style={{
                        backgroundColor: badge.got ? badge.soft : "#EDF1EE",
                        color: badge.got ? badge.color : "#8a938c"
                      }}
                    >
                      {badge.state}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              disabled={!canCompleteMission || missionFinished}
              onClick={() => setMissionFinished(true)}
              className={styles.completeButton}
            >
              <Leaf size={20} />
              {missionFinished
                ? "강릉 독서 미션 완료"
                : canCompleteMission
                  ? "미션 완료하기"
                  : `${completedCount}/3 미션 진행 중`}
            </button>
            {missionFinished && (
              <div className={styles.completionNotice} role="status">
                <CheckCircle2 size={18} /> 강릉 독서광 배지를 획득했어요.
              </div>
            )}
            <div aria-hidden="true" className={styles.coastFooter} />
          </div>
        </section>

        <nav className={styles.bottomNav}>
          {tabs.map(({ label, Icon, href, active }) => (
            <Link
              key={label}
              aria-current={active ? "page" : undefined}
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
        {previewStep !== null && (
          <VerificationModal
            step={missionSteps[previewStep]}
            state={verificationState}
            onClose={closeVerification}
            onVerify={simulateVerification}
          />
        )}
        {matchingPreviewOpen && (
          <MatchingPreviewModal onClose={() => setMatchingPreviewOpen(false)} />
        )}
      </div>
    </main>
  );
}

function MatchingPreviewModal({ onClose }: Readonly<{ onClose: () => void }>) {
  return (
    <div className={styles.modalBackdrop} onMouseDown={onClose}>
      <section
        role="dialog"
        aria-modal="true"
        aria-label="동행 매칭 서비스 안내"
        className={styles.matchingModal}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className={styles.modalHandle} />
        <button
          type="button"
          onClick={onClose}
          className={styles.matchingClose}
          aria-label="닫기"
        >
          <X size={20} />
        </button>
        <span className={styles.matchingModalIcon}>
          <UsersRound size={25} />
        </span>
        <p>동행 매칭 서비스</p>
        <h2>같은 마을에서, 함께하는 미션</h2>
        <div className={styles.matchingComingSoon}>
          <strong>추후 제공 예정</strong>
          <span>
            체류 일정과 취향이 맞는 사람에게 안전하게 제안하고, 팀 미션을 함께
            시작할 수 있어요.
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className={styles.matchingConfirm}
        >
          확인
        </button>
      </section>
    </div>
  );
}

function VerificationModal({
  step,
  state,
  onClose,
  onVerify
}: Readonly<{
  step: (typeof missionSteps)[number];
  state: "idle" | "verifying" | "success";
  onClose: () => void;
  onVerify: () => void;
}>) {
  const isSuccess = state === "success";
  return (
    <div className={styles.modalBackdrop} onMouseDown={onClose}>
      <section
        role="dialog"
        aria-modal="true"
        aria-label={`${step.label} 인증 절차 미리보기`}
        className={styles.verificationModal}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className={styles.modalHandle} />
        <div className={styles.modalHeader}>
          <div>
            <p>인증 절차 미리보기</p>
            <h2>{step.label}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="닫기">
            <X size={20} />
          </button>
        </div>
        {isSuccess ? (
          <div className={styles.verificationSuccess}>
            <span>
              <CheckCircle2 size={29} />
            </span>
            <strong>인증이 완료됐어요</strong>
            <p>다음 미션이 열렸어요. 계속 이어가 볼까요?</p>
            <button type="button" onClick={onClose}>
              확인
            </button>
          </div>
        ) : (
          <>
            <div className={styles.verificationPlace}>
              <MapPin size={20} />
              <div>
                <strong>{step.place}</strong>
                <p>{step.detail}</p>
              </div>
            </div>
            <p className={styles.demoNote}>
              실제 서비스에서는 위치, 체류 시간 또는 사진 인증 결과를 확인해요.
            </p>
            <button
              type="button"
              disabled={state === "verifying"}
              onClick={onVerify}
              className={styles.verificationButton}
            >
              {state === "verifying" ? (
                <>
                  <LoaderCircle size={18} className="animate-spin" /> 인증을
                  확인하고 있어요
                </>
              ) : (
                <>
                  <MapPin size={18} /> 인증 절차 미리보기
                </>
              )}
            </button>
          </>
        )}
      </section>
    </div>
  );
}
