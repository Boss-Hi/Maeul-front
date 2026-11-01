import { safeReturnPath } from "@/lib/auth/return-path";
import { LoginPrompt } from "./login-prompt";

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const url = new URL(
    "/oauth2/authorization/kakao",
    process.env.MAEUL_API_BASE_URL ?? "https://api.maeul.duckdns.org"
  );
  return <LoginPrompt next={safeReturnPath(next)} loginUrl={url.toString()} />;
}
