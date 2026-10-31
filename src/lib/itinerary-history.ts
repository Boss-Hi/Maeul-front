import {
  ACCESS_TOKEN_STORAGE_KEY,
  getOnboardingCompletionKey
} from "@/lib/auth/session";
function key() {
  if (typeof window === "undefined") return null;
  const token = sessionStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  const owner = token && getOnboardingCompletionKey(token);
  return owner ? `maeul-itinerary-history:${owner}` : null;
}
export function knownItineraryIds(): number[] {
  try {
    const name = key();
    const value: unknown = JSON.parse(
      name ? localStorage.getItem(name) || "[]" : "[]"
    );
    return Array.isArray(value)
      ? value
          .filter((id): id is number => Number.isSafeInteger(id) && id > 0)
          .slice(0, 30)
      : [];
  } catch {
    return [];
  }
}
export function rememberItinerary(id: number) {
  try {
    const name = key();
    if (name)
      localStorage.setItem(
        name,
        JSON.stringify(
          [id, ...knownItineraryIds().filter((value) => value !== id)].slice(
            0,
            30
          )
        )
      );
  } catch {
    /* Browsing remains available when storage is blocked. */
  }
}
