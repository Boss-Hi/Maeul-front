export const LOGIN_RETURN_KEY = "maeul-login-return";

export function safeReturnPath(value: string | null | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//"))
    return "/main";
  try {
    const url = new URL(value, "https://maeul.local");
    if (url.origin !== "https://maeul.local") return "/main";
    if (
      !["/main", "/home", "/event", "/plan", "/plan/new", "/mission", "/my"].includes(url.pathname)
    )
      return "/main";
    return `${url.pathname}${url.search}`;
  } catch {
    return "/main";
  }
}
