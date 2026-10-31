"use client";
import { BottomNav } from "@/components/bottom-nav";

import {
  ArrowLeft,
  BadgeCheck,
  ChevronRight,
  CircleUserRound,
  Coffee,
  Leaf,
  LogOut,
  MapPin,
  Sprout,
  Tag,
  Trophy,
  UsersRound,
  X
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { getMyProfile, type UserProfile } from "@/lib/api/profile";
import {
  getCurrentSurveyResponse,
  getFirstSurvey,
  type Survey,
  type SurveyResponse
} from "@/lib/api/surveys";
import {
  ACCESS_TOKEN_STORAGE_KEY,
  isAccessTokenExpired
} from "@/lib/auth/session";

const stats = [
  { label: "완료 미션", value: "12", Icon: Leaf },
  { label: "획득 배지", value: "4", Icon: Sprout }
];

const badges = [
  { name: "로스터리 메이트", date: "2026.08.02", Icon: Coffee },
  { name: "오래된 생각줍기", date: "2026.07.28", Icon: Trophy },
  { name: "마을 새싹 주민", date: "2026.07.18", Icon: BadgeCheck }
];

const mates = [
  {
    name: "김민준 · 28",
    meta: "강릉 3일 살기 · 함께한 미션 2회",
    tag: "강릉 여행메이트"
  },
  {
    name: "박서연 · 31",
    meta: "강릉 5일 살기 · 취향이 잘 맞아요",
    tag: "가까운 친구"
  }
];

export default function MyPage() {
  const [matePreviewOpen, setMatePreviewOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [profileLoadError, setProfileLoadError] = useState("");
  const [tasteSurvey, setTasteSurvey] = useState<Survey | null>(null);
  const [tasteResponse, setTasteResponse] = useState<
    SurveyResponse | undefined
  >(undefined);
  const [isTasteLoading, setIsTasteLoading] = useState(false);
  const [tasteLoadError, setTasteLoadError] = useState("");
  const router = useRouter();
  const token = useSyncExternalStore(
    () => () => undefined,
    () => sessionStorage.getItem(ACCESS_TOKEN_STORAGE_KEY),
    () => null
  );
  const isSignedIn = Boolean(token && !isAccessTokenExpired(token));
  const displayName =
    profile?.nickname?.trim() ||
    profile?.name?.trim() ||
    (isSignedIn ? "마을 여행자" : "로그인하고 시작해요");
  const profileDescription = profile?.description?.trim();
  const selectedTasteLabels = (questionId: number) => {
    const question = tasteSurvey?.questions.find(
      (item) => item.questionId === questionId
    );
    if (!question || !tasteResponse) return [];

    const selectedOptionIds = new Set(
      tasteResponse.answers
        .filter((answer) => answer.questionId === questionId)
        .map((answer) => answer.optionId)
    );
    return question.options
      .filter((option) => selectedOptionIds.has(option.optionId))
      .map((option) => option.label);
  };
  const tasteTags = selectedTasteLabels(4);
  const tastePurpose = selectedTasteLabels(3)[0];

  useEffect(() => {
    if (!token || !isSignedIn) {
      return;
    }

    const controller = new AbortController();
    const requestId = window.setTimeout(() => {
      setIsProfileLoading(true);
      setProfileLoadError("");

      void getMyProfile(token, controller.signal)
        .then((nextProfile) => setProfile(nextProfile))
        .catch((error: unknown) => {
          if (controller.signal.aborted) return;
          setProfileLoadError(
            error instanceof Error
              ? error.message
              : "프로필 정보를 불러오지 못했어요."
          );
        })
        .finally(() => {
          if (!controller.signal.aborted) setIsProfileLoading(false);
        });
    }, 0);

    return () => {
      controller.abort();
      window.clearTimeout(requestId);
    };
  }, [isSignedIn, token]);

  useEffect(() => {
    if (!token || !isSignedIn) return;

    const controller = new AbortController();
    const requestId = window.setTimeout(() => {
      setIsTasteLoading(true);
      setTasteLoadError("");

      void Promise.all([
        getFirstSurvey(controller.signal),
        getCurrentSurveyResponse(token, controller.signal)
      ])
        .then(([nextSurvey, nextResponse]) => {
          if (controller.signal.aborted) return;
          setTasteSurvey(nextSurvey);
          setTasteResponse(nextResponse);
        })
        .catch((error: unknown) => {
          if (controller.signal.aborted) return;
          setTasteLoadError(
            error instanceof Error
              ? error.message
              : "저장된 취향 정보를 불러오지 못했어요."
          );
        })
        .finally(() => {
          if (!controller.signal.aborted) setIsTasteLoading(false);
        });
    }, 0);

    return () => {
      controller.abort();
      window.clearTimeout(requestId);
    };
  }, [isSignedIn, token]);

  function logOut() {
    sessionStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    setProfile(null);
    router.replace("/");
  }

  return (
    <main className="h-dvh overflow-hidden bg-[#e8efed] text-[#24584d]">
      <div className="mx-auto flex h-dvh w-full max-w-[1080px] flex-col overflow-hidden bg-[#f8fbf6] shadow-[0_0_60px_rgba(49,95,80,0.07)]">
        <section className="min-h-0 flex-1 overflow-y-auto">
          <header className="relative min-h-[250px] overflow-hidden bg-[#c7e9ef] bg-[url('/images/profile-hero-v2.png')] bg-cover bg-center px-5 pt-7">
            <div className="absolute inset-0 bg-[#f7fbf62b]" />
            <div className="relative flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  if (window.history.length > 1) router.back();
                  else router.replace("/main");
                }}
                aria-label="뒤로가기"
                className="flex size-10 items-center justify-center rounded-full border border-white/85 bg-[#fffefbeb] text-[#315f50]"
              >
                <ArrowLeft size={20} />
              </button>
              {isSignedIn ? (
                <button
                  type="button"
                  onClick={logOut}
                  className="flex min-h-10 items-center gap-1.5 rounded-full border border-white/85 bg-[#fffefbeb] px-3 text-[12px] font-bold text-[#315f50]"
                >
                  <LogOut size={16} />
                  로그아웃
                </button>
              ) : (
                <Link
                  href="/"
                  className="flex min-h-10 items-center rounded-full border border-white/85 bg-[#fffefbeb] px-3 text-[12px] font-bold text-[#315f50]"
                >
                  로그인
                </Link>
              )}
            </div>
            <div className="relative mt-3.5 max-w-[500px]">
              <p className="text-[11px] leading-[1.8] font-bold text-[#315f50]">
                MY LOCAL PROFILE
              </p>
              <h1 className="mt-2.5 text-[32px] leading-[1.2] font-black text-[#205b52]">
                마이페이지
              </h1>
            </div>
          </header>

          <div className="relative -mt-[30px] rounded-t-[30px] border-t-[5px] border-[#fffefb] bg-[#f8fbf6] px-4 pt-3 pb-7 sm:px-6">
            <section className="relative overflow-hidden rounded-[24px] border border-[#dce7d8] bg-[#fffefbed] p-4 shadow-[0_5px_18px_rgba(49,95,80,0.06)] sm:p-5">
              <Leaf className="absolute -right-3 bottom-1 size-20 rotate-[20deg] text-[#b6d9ae]/55" />
              <div className="relative flex items-center gap-3.5">
                <div className="flex size-[74px] shrink-0 items-center justify-center rounded-[24px] bg-[#e7f4e8] text-[#4b906c] shadow-inner">
                  {profile?.avatarUrl ? (
                    <span
                      aria-hidden="true"
                      className="size-full rounded-[24px] bg-cover bg-center"
                      style={{ backgroundImage: `url(${profile.avatarUrl})` }}
                    />
                  ) : (
                    <CircleUserRound size={43} strokeWidth={1.7} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="truncate text-[24px] font-black tracking-normal text-[#24584d]">
                      {displayName}
                    </h1>
                  </div>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-[#72877a]">
                    {profileDescription ||
                      (isProfileLoading
                        ? "프로필 정보를 불러오는 중이에요."
                        : profileLoadError ||
                          profile?.email ||
                          (isSignedIn
                            ? "등록된 계정 정보를 불러오고 있어요."
                            : "로그인하고 나만의 마을 취향을 만들어 보세요."))}
                  </p>
                </div>
              </div>
            </section>

            <div className="mt-3 grid grid-cols-2 gap-2.5">
              {stats.map(({ label, value, Icon }) => (
                <div
                  key={label}
                  className="rounded-[20px] border border-[#dce7d8] bg-[#fffefbe8] p-4"
                >
                  <div className="flex items-center gap-2 text-[13px] font-bold text-[#579167]">
                    <Icon size={19} />
                    {label}
                  </div>
                  <strong className="mt-2 block text-[27px] leading-none text-[#24584d]">
                    {value}
                  </strong>
                </div>
              ))}
            </div>

            <Link
              href="/plan"
              className="relative mt-5 block overflow-hidden rounded-[22px] border border-[#c9e5cf] bg-[#eff9ed] bg-cover bg-center p-4 shadow-[0_4px_14px_rgba(49,95,80,0.04)]"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, rgba(239,249,237,0.96), rgba(239,249,237,0.83), rgba(239,249,237,0.58)), url('/images/regions/gangneung.webp')"
              }}
            >
              <Leaf className="absolute -right-4 -bottom-5 size-24 rotate-[28deg] text-[#a7d1a7]/60" />
              <div className="relative flex items-center gap-3">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[#c9e5cf] bg-white text-[#4b906c]">
                  <MapPin size={25} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-bold text-[#579167]">
                    진행 중인 축제
                  </p>
                  <h2 className="mt-1 truncate text-[17px] font-black text-[#24584d]">
                    강릉 3일 살기 · Day 2
                  </h2>
                  <span className="mt-1 block truncate text-[12px] text-[#72877a]">
                    강릉 해변에서 머문 인증 중
                  </span>
                </div>
                <span className="flex shrink-0 items-center gap-1 rounded-full border border-[#d5e8d6] bg-white px-3 py-2 text-[11px] font-bold text-[#397757]">
                  플랜 보기 <ChevronRight size={14} />
                </span>
              </div>
            </Link>

            <section className="mt-5 rounded-[20px] border border-[#dce7d8] bg-[#fffefbe8] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="flex items-center gap-2 text-[17px] font-black text-[#24584d]">
                    <Tag size={19} className="text-[#64a071]" /> 나를 보여주는
                    취향
                  </h2>
                  <p className="mt-1.5 text-[12px] text-[#72877a]">
                    {isTasteLoading
                      ? "저장한 취향을 불러오는 중이에요."
                      : tasteLoadError ||
                        (tasteResponse
                          ? `${tastePurpose ? `${tastePurpose}을 위해, ` : ""}${tasteTags.length ? `${tasteTags.slice(0, 2).join(" · ")} 같은 순간을 좋아해요.` : "나만의 마을 취향을 담아뒀어요."}`
                          : "아직 나만의 마을 취향을 정하지 않았어요.")}
                  </p>
                </div>
                <Link
                  href={tasteResponse ? "/onboarding?mode=edit" : "/onboarding"}
                  className="flex shrink-0 items-center gap-0.5 text-[12px] font-bold text-[#579167]"
                >
                  {tasteResponse ? "수정하기" : "설정하기"}{" "}
                  <ChevronRight size={15} />
                </Link>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {tasteTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[#eff5ed] px-3 py-2 text-[12px] font-bold text-[#5b7865]"
                  >
                    {tag}
                  </span>
                ))}
                {!isTasteLoading && !tasteLoadError && !tasteResponse && (
                  <span className="rounded-full bg-[#eff5ed] px-3 py-2 text-[12px] font-bold text-[#7a907f]">
                    취향 산책을 시작해 보세요
                  </span>
                )}
              </div>
            </section>

            <section className="mt-5 rounded-[20px] border border-[#d4e7d5] bg-[#eff8ee] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="flex items-center gap-2 text-[17px] font-black text-[#24584d]">
                    <UsersRound size={20} className="text-[#64a071]" /> 나의
                    메이트
                  </h2>
                  <p className="mt-1.5 text-[12px] text-[#72877a]">
                    함께한 미션으로 이어진 마을 친구들이에요.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMatePreviewOpen(true)}
                  className="shrink-0 rounded-full border border-[#cce1cf] bg-[#fffefbdd] px-2.5 py-1.5 text-[10px] font-bold text-[#397757]"
                >
                  미리보기
                </button>
              </div>
              <div className="mt-3 overflow-hidden rounded-[16px] border border-[#d8e8d8] bg-[#fffefbe8]">
                {mates.map((mate, index) => (
                  <button
                    key={mate.name}
                    type="button"
                    onClick={() => setMatePreviewOpen(true)}
                    className={`flex w-full items-center gap-3 p-3 text-left ${index > 0 ? "border-t border-[#e5eee5]" : ""}`}
                  >
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#e5f2e7] text-[#52876b]">
                      <CircleUserRound size={23} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <strong className="block truncate text-[14px] font-black text-[#24584d]">
                        {mate.name}
                      </strong>
                      <span className="mt-0.5 block truncate text-[11px] text-[#789083]">
                        {mate.meta}
                      </span>
                    </span>
                    <span className="shrink-0 rounded-full bg-[#eaf6ee] px-2 py-1 text-[10px] font-bold text-[#397757]">
                      {mate.tag}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <SectionHeading icon={Leaf} title="획득한 배지" link="/bedge" />
            <div className="mt-3 grid gap-2.5">
              {badges.map(({ name, date, Icon }) => (
                <Link
                  key={name}
                  href="/bedge"
                  className="flex items-center gap-3 rounded-[20px] border border-[#dce7d8] bg-[#fffefbe8] p-3.5"
                >
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#fff3da] text-[#b98535]">
                    <Icon size={23} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-[15px] font-black text-[#24584d]">
                      {name}
                    </h3>
                    <p className="mt-0.5 text-[12px] text-[#87958b]">
                      {date} 획득
                    </p>
                  </div>
                  <BadgeCheck size={19} className="shrink-0 text-[#71ad79]" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <BottomNav />
        {matePreviewOpen && (
          <MatePreviewModal onClose={() => setMatePreviewOpen(false)} />
        )}
      </div>
    </main>
  );
}

function MatePreviewModal({ onClose }: Readonly<{ onClose: () => void }>) {
  return (
    <div
      className="fixed inset-0 z-[2000] flex items-end justify-center bg-[#14271c80]"
      onMouseDown={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label="나의 메이트 서비스 안내"
        className="relative w-full max-w-[1080px] rounded-t-[28px] bg-[#fffefb] px-5 pt-3 pb-[max(24px,env(safe-area-inset-bottom))] text-center shadow-[0_-16px_40px_rgba(23,50,36,0.14)] motion-safe:animate-[riseIn_.22s_ease-out_both]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="mx-auto h-1 w-10 rounded-full bg-[#dce7d8]" />
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="absolute top-5 right-5 flex size-10 items-center justify-center rounded-full bg-[#edf5eb] text-[#397757]"
        >
          <X size={20} />
        </button>
        <span className="mt-4 inline-flex size-14 items-center justify-center rounded-[20px] bg-[#e4f1e5] text-[#4b906c]">
          <UsersRound size={25} />
        </span>
        <p className="mt-3 text-[12px] font-bold text-[#579167]">나의 메이트</p>
        <h2 className="mt-1 text-[21px] font-black text-[#24584d]">
          함께한 시간이, 관계가 되도록
        </h2>
        <div className="mt-5 rounded-[17px] border border-[#d7e7d7] bg-[#f3f9f1] p-4 text-left">
          <strong className="text-[13px] font-black text-[#397757]">
            추후 제공 예정
          </strong>
          <p className="mt-2 text-[12px] leading-[1.65] text-[#678172]">
            함께 완료한 미션과 취향을 바탕으로 메이트를 기록하고, 다음 마을의
            미션도 함께 제안할 수 있어요.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 min-h-[52px] w-full rounded-[16px] bg-[#4b906c] text-[14px] font-bold text-white"
        >
          확인
        </button>
      </section>
    </div>
  );
}

function SectionHeading({
  icon: Icon,
  title,
  link
}: Readonly<{ icon: typeof Leaf; title: string; link?: string }>) {
  const content = (
    <>
      <span className="flex items-center gap-2 text-[18px] font-black text-[#24584d]">
        <Icon size={21} className="text-[#64a071]" />
        {title}
      </span>
      {link && (
        <span className="flex items-center gap-0.5 text-[12px] font-bold text-[#579167]">
          전체 보기 <ChevronRight size={15} />
        </span>
      )}
    </>
  );
  return link ? (
    <Link href={link} className="mt-6 flex items-center justify-between gap-3">
      {content}
    </Link>
  ) : (
    <div className="mt-6 flex items-center justify-between gap-3">
      {content}
    </div>
  );
}
