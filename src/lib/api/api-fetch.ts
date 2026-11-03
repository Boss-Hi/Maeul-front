import { ACCESS_TOKEN_STORAGE_KEY } from "@/lib/auth/session";
import { safeReturnPath } from "@/lib/auth/return-path";

let redirecting = false;

export async function apiFetch(input: RequestInfo | URL, init?: RequestInit) {
  const response = await fetch(input, init);
  if (response.status === 401 && typeof window !== "undefined" && !redirecting) {
    try {
      sessionStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    } catch { /* Redirect even if storage is unavailable. */ }
    if (window.location.pathname !== "/login") {
      redirecting = true;
      const next = safeReturnPath(window.location.pathname + window.location.search);
      window.location.replace(`/login?next=${encodeURIComponent(next)}`);
    }
  }
  return response;
}
