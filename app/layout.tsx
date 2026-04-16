import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP, Outfit } from "next/font/google";
import "./globals.css";

// Google Fontsをnext/fontでセルフホスト化（CLS防止・リクエスト削減）
const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
  variable: "--font-noto-sans-jp",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "株式会社ファンエクス | FunEx Inc.",
  description: "株式会社ファンエクスの公式サイトです。",
};

// モバイル実機表示用のviewport設定（Next.js 15 App Routerではmetadataと分離）
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} ${outfit.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
