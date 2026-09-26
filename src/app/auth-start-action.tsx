"use client";

import { ArrowRight, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { ACCESS_TOKEN_STORAGE_KEY } from "@/lib/auth/session";

export function AuthStartAction({
  kakaoLoginUrl
}: Readonly<{ kakaoLoginUrl: string }>) {
  const isSignedIn = useSyncExternalStore(
    () => () => undefined,
    () => Boolean(sessionStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)),
    () => false
  );

  return isSignedIn ? (
    <Link
      href="/home"
      className="flex h-[56px] w-full items-center justify-center gap-2 rounded-[17px] bg-[#478264] text-[16px] font-black text-white shadow-[0_12px_28px_rgba(42,91,68,0.25)] transition-transform active:scale-[0.98]"
    >
      시작하기
      <ArrowRight size={19} />
    </Link>
  ) : (
    <Link
      href={kakaoLoginUrl}
      className="flex h-[56px] w-full items-center justify-center gap-2 rounded-[17px] bg-[#FEE500] text-[16px] font-black text-[#191919] shadow-[0_12px_28px_rgba(82,73,0,0.18)] transition-transform active:scale-[0.98]"
    >
      <MessageCircle size={19} fill="currentColor" strokeWidth={2} />
      카카오로 로그인하기
    </Link>
  );
}
