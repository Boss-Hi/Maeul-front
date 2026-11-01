import { RequireLogin } from "@/components/require-login";
export default function MissionLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <RequireLogin>{children}</RequireLogin>;
}
