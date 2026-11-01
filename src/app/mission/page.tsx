"use client";
import { BottomNav } from "@/components/bottom-nav";
import {
  ArrowLeft,
  CheckCircle2,
  Leaf,
  LoaderCircle,
  MapPin,
  Navigation,
  RefreshCw,
  ChevronRight,
  UsersRound,
  X
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  getCurrentMission,
  MissionError,
  type CurrentMission
} from "@/lib/api/missions";
import { ACCESS_TOKEN_STORAGE_KEY } from "@/lib/auth/session";
import styles from "./mission.module.css";

export default function MissionPage() {
  const router = useRouter();
  const [mission, setMission] = useState<CurrentMission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [request, setRequest] = useState(0);
  const [preview, setPreview] = useState<{
    name: string;
    description: string;
    task: boolean;
  } | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    getCurrentMission(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setMission(data);
      })
      .catch((reason: unknown) => {
        if (controller.signal.aborted) return;
        if (reason instanceof MissionError && reason.status === 401) {
          sessionStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
          router.replace("/login?next=%2Fmission");
          return;
        }
        setError(
          reason instanceof MissionError
            ? reason.message
            : "미션을 불러오지 못했어요. 다시 시도해 주세요."
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [request, router]);
  function showPreview(name: string, description: string, task = false) {
    setPreview({ name, description, task });
    dialog.current?.showModal();
  }
  const finished = Boolean(
    mission &&
    mission.totalCount > 0 &&
    mission.completedCount >= mission.totalCount
  );
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.scroll}>
          <header className={styles.hero}>
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <button
                  type="button"
                  onClick={() =>
                    window.history.length > 1
                      ? router.back()
                      : router.replace("/main")
                  }
                  aria-label="뒤로가기"
                  className={styles.backLink}
                >
                  <ArrowLeft size={20} />
                </button>
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
            {loading ? (
              <div
                className="col-span-full flex items-center justify-center gap-2 py-16 text-[#478264]"
                role="status"
              >
                <LoaderCircle size={20} className="animate-spin" />
                미션을 불러오고 있어요.
              </div>
            ) : error ? (
              <div className="col-span-full py-12 text-center" role="alert">
                <p>{error}</p>
                <button
                  onClick={() => setRequest((value) => value + 1)}
                  className="mt-5 rounded-lg bg-[#478264] px-6 py-3 font-bold text-white"
                >
                  다시 시도
                </button>
              </div>
            ) : !mission ? (
              <div className="col-span-full py-16 text-center">
                <Leaf size={32} className="mx-auto mb-4 text-[#478264]" />
                <h2 className="text-xl font-bold">
                  아직 진행 중인 미션이 없어요
                </h2>
                <Link
                  href="/plan"
                  className="mt-6 inline-flex rounded-lg bg-[#478264] px-6 py-3 text-white"
                >
                  내 일정 보기
                </Link>
              </div>
            ) : (
              <>
                <div className={styles.primaryColumn}>
                  <section className={styles.progress}>
                    <div className="flex items-center justify-between gap-3">
                      <span className={styles.status}>
                        {finished ? "완료" : "진행 중"}
                      </span>
                      <span className={styles.progressLabel}>
                        진행률 {mission.percentage}%
                      </span>
                    </div>
                    <h2 className={styles.missionTitle}>{mission.name}</h2>
                    <p className={styles.description}>{mission.description}</p>
                    <p className="mt-3 text-xs text-[#718478]">
                      {mission.startDate} ~ {mission.endDate}
                    </p>
                    <div
                      role="progressbar"
                      aria-label="미션 진행률"
                      aria-valuenow={mission.percentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      className={styles.progressTrack}
                    >
                      <div
                        className={styles.progressFill}
                        style={{ width: `${mission.percentage}%` }}
                      />
                    </div>
                    <p className="mt-3 text-xs text-[#718478]">
                      {mission.completedCount}/{mission.totalCount} 완료
                    </p>
                  </section>
                  <div className={styles.nearbyStay}>
                    <span className={styles.nearbyIcon}>
                      <UsersRound size={19} />
                    </span>
                    <div>
                      <p>주변 체류자</p>
                      <strong>{mission.neighborhoodCount}명</strong>
                    </div>
                  </div>
                  <section className={styles.checklist}>
                    <h2 className={styles.sectionTitle}>
                      <Leaf size={23} strokeWidth={1.5} />
                      인증 체크리스트
                    </h2>
                    <div className={styles.checkRows}>
                      {mission.missionTasks.length ? (
                        mission.missionTasks.map((task) => (
                          <button
                            key={task.id}
                            type="button"
                            disabled={task.isComplete}
                            onClick={() =>
                              showPreview(
                                task.name,
                                task.description ||
                                  "장소에서 미션 인증 조건을 확인해요.",
                                true
                              )
                            }
                            className={`${styles.checkRow} ${task.isComplete ? "" : styles.checkRowAvailable}`}
                          >
                            <span
                              className={`flex size-10 shrink-0 items-center justify-center rounded-full ${task.isComplete ? "bg-[#478264] text-white" : "bg-[#e4f1e5] text-[#478264]"}`}
                            >
                              {task.isComplete ? (
                                <CheckCircle2 size={18} />
                              ) : (
                                <MapPin size={18} />
                              )}
                            </span>
                            <span className="min-w-0 flex-1">
                              <strong className="block text-sm leading-6 break-words text-[#315f50]">
                                {task.name}
                              </strong>
                              <span className="mt-1 block text-xs text-[#718478]">
                                {task.isComplete ? "완료" : "미완료"}
                              </span>
                            </span>
                            {!task.isComplete && (
                              <span className={styles.verifyLabel}>
                                인증 안내
                              </span>
                            )}
                          </button>
                        ))
                      ) : (
                        <p className="py-6 text-sm text-[#718478]">
                          등록된 인증 과제가 없어요.
                        </p>
                      )}
                    </div>
                  </section>
                  <section className={styles.matchingPreview}>
                    <div className={styles.matesHeader}>
                      <div>
                        <h2 className={styles.sectionTitle}>
                          <UsersRound size={23} />
                          같은 미션 체류자
                        </h2>
                        <p>마을에서 함께할 인연을 만나보세요.</p>
                      </div>
                      <button
                        onClick={() =>
                          showPreview(
                            "같은 마을에서, 함께하는 미션",
                            "체류 일정과 취향이 맞는 사람에게 제안하고 함께하는 경험을 추후 선보일 예정이에요."
                          )
                        }
                      >
                        전체 체류자 보기
                      </button>
                    </div>
                  </section>
                </div>
                <aside className={styles.collection}>
                  <h2 className={styles.collectionTitle}>미션 기록</h2>
                  <p className="mt-4 text-sm leading-6 text-[#718478]">
                    {finished
                      ? "이번 미션의 모든 과제를 마쳤어요."
                      : "하나씩 이어지는 경험으로 마을을 알아가요."}
                  </p>
                  <div className={styles.recordActions}>
                    <button onClick={() => setRequest((value) => value + 1)}>
                      <RefreshCw size={16} />
                      최신 진행 상태 확인
                    </button>
                    <Link href="/plan">
                      내 일정 보기 <ChevronRight size={16} />
                    </Link>
                  </div>
                </aside>
              </>
            )}
          </div>
        </section>
        <BottomNav />
        <dialog
          ref={dialog}
          className="fixed inset-0 m-auto w-[calc(100%-32px)] max-w-[420px] rounded-lg bg-white p-6 text-[#24584d] backdrop:bg-black/40"
        >
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-lg font-bold">{preview?.name}</h2>
            <button aria-label="닫기" onClick={() => dialog.current?.close()}>
              <X size={20} />
            </button>
          </div>
          <p className="my-5 text-sm leading-7">{preview?.description}</p>
          {preview?.task && (
            <p className="mb-5 text-sm leading-6 text-[#718478]">
              인증 기능은 추후 제공될 예정이에요. 현재 안내 확인으로 미션이
              완료되지는 않아요.
            </p>
          )}
          <button
            onClick={() => dialog.current?.close()}
            className="w-full rounded-lg bg-[#478264] px-4 py-3 font-bold text-white"
          >
            확인
          </button>
        </dialog>
      </div>
    </main>
  );
}
