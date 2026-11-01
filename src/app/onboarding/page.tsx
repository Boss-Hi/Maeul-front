import { OnboardingFlow } from "./onboarding-flow";
import { getInitialSurvey } from "@/lib/api/surveys-server";
import { safeReturnPath } from "@/lib/auth/return-path";

export const dynamic = "force-dynamic";

export default async function OnboardingPage({
  searchParams
}: {
  searchParams: Promise<{ mode?: string; next?: string }>;
}) {
  const { mode, next } = await searchParams;
  const initialSurvey = await getInitialSurvey();
  return (
    <OnboardingFlow
      initialSurvey={initialSurvey}
      editRequested={mode === "edit"}
      returnTo={safeReturnPath(next)}
    />
  );
}
