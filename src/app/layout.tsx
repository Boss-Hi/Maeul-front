import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MAEUL | 체류형 관광 로컬 라이프 큐레이션 플래너",
  description: "체류형 관광 로컬 라이프 큐레이션 플래너 MAEUL"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
