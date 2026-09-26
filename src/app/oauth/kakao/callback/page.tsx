"use client";

import { AlertCircle, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";

const accessTokenKey = "maeul-access-token";

export default function KakaoCallbackPage() {
  const router = useRouter();
  const isClient = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false
  );
  const token = isClient
    ? new URLSearchParams(window.location.search).get("token")
    : null;
  const hasValidToken = Boolean(token && token.split(".").length === 3);

  useEffect(() => {
    if (!hasValidToken || !token) return;

    sessionStorage.setItem(accessTokenKey, token);
    window.history.replaceState({}, "", "/oauth/kakao/callback");
    router.replace("/onboarding");
  }, [hasValidToken, router, token]);

  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#e8efed] px-5 text-[#24584d]">
      <section className="w-full max-w-[420px] rounded-[28px] border border-[#dce7d8] bg-[#fffefb] p-7 text-center shadow-[0_12px_36px_rgba(49,95,80,0.1)]">
        {isClient && !hasValidToken ? (
          <>
            <span className="mx-auto flex size-14 items-center justify-center rounded-[20px] bg-[#fff0eb] text-[#c2634e]">
              <AlertCircle size={27} />
            </span>
            <h1 className="mt-4 text-[22px] font-black">
              로그인을 확인하지 못했어요
            </h1>
            <p className="mt-2 text-[13px] leading-relaxed text-[#72877a]">
              다시 로그인한 뒤 이어서 시작해 주세요.
            </p>
            <Link
              href="/"
              className="mt-6 flex min-h-[52px] items-center justify-center rounded-[16px] bg-[#4b906c] text-[14px] font-bold text-white"
            >
              처음으로 돌아가기
            </Link>
          </>
        ) : (
          <>
            <span className="mx-auto flex size-14 items-center justify-center rounded-[20px] bg-[#e4f1e5] text-[#4b906c]">
              <LoaderCircle size={27} className="animate-spin" />
            </span>
            <h1 className="mt-4 text-[22px] font-black">로그인하는 중이에요</h1>
            <p className="mt-2 text-[13px] leading-relaxed text-[#72877a]">
              나만의 마을 취향을 준비하고 있어요.
            </p>
          </>
        )}
      </section>
    </main>
  );
}
