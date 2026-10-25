export const ACCESS_TOKEN_STORAGE_KEY = "maeul-access-token";

function getTokenClaims(token: string) {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const paddedPayload = payload.padEnd(
      payload.length + ((4 - (payload.length % 4)) % 4),
      "="
    );
    const claims = JSON.parse(
      atob(paddedPayload.replace(/-/g, "+").replace(/_/g, "/"))
    ) as { sub?: unknown; exp?: unknown };
    return claims;
  } catch {
    return null;
  }
}

export function isAccessTokenExpired(token: string) {
  const exp = getTokenClaims(token)?.exp;
  return typeof exp === "number" && Date.now() >= exp * 1000;
}

export function getOnboardingCompletionKey(token: string) {
  const sub = getTokenClaims(token)?.sub;
  return typeof sub === "string" && sub
    ? `maeul-onboarding-complete:${sub}`
    : null;
}
