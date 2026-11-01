import { RequireLogin } from "@/components/require-login";
export default function PlanLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <RequireLogin>{children}</RequireLogin>;
}
