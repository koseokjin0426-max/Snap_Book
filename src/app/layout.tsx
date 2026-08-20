import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "스냅 예약 | 촬영 예약하기",
  description: "링크 하나로 간편하게 스냅 촬영을 예약하세요.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fdfbf8",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-dvh font-sans antialiased">{children}</body>
    </html>
  );
}
