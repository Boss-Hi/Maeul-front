"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ACCESS_TOKEN_STORAGE_KEY,
  isAccessTokenExpired
} from "@/lib/auth/session";
import { safeReturnPath } from "@/lib/auth/return-path";

export function RequireLogin({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    function check() {
      let token: string | null = null;
      try {
        token = sessionStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
      } catch {}
      if (token && !isAccessTokenExpired(token)) {
        setAllowed(true);
        return;
      }
      setAllowed(false);
      const next = safeReturnPath(
        window.location.pathname + window.location.search
      );
      router.replace(`/login?next=${encodeURIComponent(next)}`);
    }
    check();
    const timer = window.setInterval(check, 15000);
    window.addEventListener("focus", check);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", check);
    };
  }, [pathname, router]);
  return allowed ? (
    children
  ) : (
    <main
      className="grid min-h-dvh place-items-center bg-white text-[#478264]"
      role="status"
    >
      로그인 정보를 확인하고 있어요.
    </main>
  );
}
