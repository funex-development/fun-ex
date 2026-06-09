import type { Metadata } from "next";

/**
 * /contact 用の metadata を定義するための segment layout（Server Component）。
 *
 * page.tsx は "use client" のため metadata を export できず、そのままだと
 * ルート layout.tsx の `alternates.canonical: "/"` を継承して
 * 「/contact の正規 URL はホーム」という誤った canonical になっていた。
 * ここで canonical を「/contact」に上書きして正す。
 */
export const metadata: Metadata = {
  title: "お問い合わせ",
  description:
    "株式会社ファンエクスへのお問い合わせフォーム。ゲーム・メタバース制作、生成AI活用、SNS運用、Web制作などのご相談・お見積もりはこちらから。",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    url: "https://funex.co.jp/contact",
    title: "お問い合わせ | 株式会社ファンエクス",
  },
};

export default function ContactLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
