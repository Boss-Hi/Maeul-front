import { parseFirstSurveyResponse, type Survey } from "./surveys";

export async function getInitialSurvey(): Promise<Survey | null> {
  try {
    const base =
      process.env.MAEUL_API_BASE_URL || "https://api.maeul.duckdns.org";
    const response = await fetch(new URL("/api/surveys/first", base), {
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(15000)
    });

    if (!response.ok) return null;
    return parseFirstSurveyResponse(await response.json());
  } catch {
    return null;
  }
}
