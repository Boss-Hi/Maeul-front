"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { MaeulLogo } from "@/components/maeul-logo";
import {
  ACCESS_TOKEN_STORAGE_KEY,
  isAccessTokenExpired
} from "@/lib/auth/session";
import { LOGIN_RETURN_KEY } from "@/lib/auth/return-path";

export function LoginPrompt({
  next,
  loginUrl
}: {
  next: string;
  loginUrl: string;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  useEffect(() => {
    try {
      const token = sessionStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
      if (token && !isAccessTokenExpired(token))
        router.replace(`/onboarding?next=${encodeURIComponent(next)}`);
    } catch {}
  }, [next, router]);
  return (
    <main className="grid min-h-dvh place-items-center bg-[#f5f8f6] px-5 text-[#16211a]">
      <section className="w-full max-w-[420px] rounded-lg border border-[#dce7d8] bg-white p-8 text-center">
        <Link href="/main" aria-label="마을 메인으로 이동" className="mb-6 inline-flex justify-center">
          <MaeulLogo />
        </Link>
        <h1 className="text-xl font-bold">
          {next.startsWith("/mission")
            ? "로그인하고 마을 미션에 함께해요"
            : "로그인하고 내 일정을 만나보세요"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#718478]">
          로그인 후 이어서 시작할 수 있어요.
        </p>
        <a
          href={loginUrl}
          onClick={(event) => {
            try {
              sessionStorage.setItem(LOGIN_RETURN_KEY, next);
            } catch {
              event.preventDefault();
              setError(
                "브라우저 저장 공간을 사용할 수 없어요. 설정을 확인해 주세요."
              );
            }
          }}
          className="mt-7 flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#FEE500] text-sm font-bold text-[#191919]"
        >
          <MessageCircle size={19} />
          카카오로 로그인하기
        </a>
        {error && (
          <p role="alert" className="mt-3 text-sm text-red-700">
            {error}
          </p>
        )}
        <Link href="/main" className="mt-5 inline-block text-sm text-[#718478]">
          먼저 둘러보기
        </Link>
      </section>
    </main>
  );
}
