import { OnboardingFlow } from "./onboarding-flow";
import { getInitialSurvey } from "@/lib/api/surveys-server";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const initialSurvey = await getInitialSurvey();
  return <OnboardingFlow initialSurvey={initialSurvey} />;
}
