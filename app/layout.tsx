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
  metadataBase: new URL("https://funex.co.jp"),
  title: {
    default: "株式会社ファンエクス | Z世代・α世代向け体験づくり｜ゲーム・生成AI・SNS運用",
    template: "%s | 株式会社ファンエクス",
  },
  description:
    "株式会社ファンエクス（FunEx Inc.）公式サイト。中小企業のためのテクノロジー活用で、Z世代・α世代に届く体験をつくる東京のエンターテインメント・テック企業。ゲーム/メタバース制作、生成AI活用、SNS運用、Web制作を提供。",
  keywords: [
    "株式会社ファンエクス",
    "FunEx",
    "ゲーム制作",
    "メタバース",
    "生成AI活用",
    "SNS運用",
    "Web制作",
    "Z世代マーケティング",
    "α世代マーケティング",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "https://funex.co.jp",
    siteName: "株式会社ファンエクス",
    title: "株式会社ファンエクス | Z世代・α世代向け体験づくり",
    description:
      "中小企業のためのテクノロジー活用で、Z世代・α世代に届く体験をつくるエンターテインメント・テック企業。ゲーム制作、生成AI活用、SNS運用などを提供します。",
    images: [
      {
        url: "/funexB.png",
        width: 1200,
        height: 630,
        alt: "株式会社ファンエクス",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "株式会社ファンエクス",
    description: "Z世代・α世代に届く体験をつくるエンターテインメント・テック企業",
    images: ["/funexB.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/funexB.png",
    apple: "/funexB.png",
  },
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
      <head>
        {/* Font Awesome CDN への接続を事前開始（DNS/TLSを前倒し） */}
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />

        {/* 静的HTMLページと共通のCSS（public/配下）を<head>で読み込み、レンダブロックとCLSを回避 */}
        <link rel="stylesheet" href="/style.css" />
        <link rel="stylesheet" href="/mvv.css" />
        <link rel="stylesheet" href="/subpage.css" />

        {/* Font Awesome（アイコンフォント） */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
