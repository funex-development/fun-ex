import type { NextConfig } from "next";

/**
 * SEO 正規化（canonical 統一）のためのルーティング設定。
 *
 * 目的:
 *  - ホームの正規 URL を「https://funex.co.jp/」（非 www・ルート）に一本化する。
 *  - 「/index.html」直アクセスは「/」へ恒久リダイレクトし、重複インデックスを解消する。
 *  - www は非 www へ正規化する（サイトの全 canonical 宣言が非 www のため）。
 *
 * 注意（実機検証済み）:
 *  - Next.js の `permanent: true` は HTTP 301 ではなく 308 を返す。
 *    Google は 308 を 301 相当の「恒久リダイレクト」として扱うため SEO 上の問題はない。
 *  - リダイレクトは redirects フェーズ、配信は beforeFiles rewrite フェーズで処理され、
 *    両者は別フェーズのため「/ ⇄ /index.html」の無限ループは発生しない（検証済み）。
 */
const nextConfig: NextConfig = {
  async redirects() {
    return [
      // (1) www + /index.html → 非 www ルートへ「1 ホップ」で正規化。
      //     Google が現在インデックスしている www.funex.co.jp/index.html の
      //     リダイレクトチェーンを最短化するため、最も具体的なこのルールを先頭に置く。
      {
        source: "/index.html",
        has: [{ type: "host", value: "www.funex.co.jp" }],
        destination: "https://funex.co.jp/",
        permanent: true,
      },
      // (2) www のルート「/」→ 非 www ルートへ。末尾スラッシュを確実に保持するため
      //     リテラル指定にする（canonical「https://funex.co.jp/」と完全一致させる）。
      //     host 完全一致のためプレビュー（*.vercel.app）では発火しない。
      {
        source: "/",
        has: [{ type: "host", value: "www.funex.co.jp" }],
        destination: "https://funex.co.jp/",
        permanent: true,
      },
      // (3) www のルート以外の全パス → 非 www へ。名前付きパラメータ「:path+」で
      //     パスを引き継ぐ（Next.js は `$1` 形式の後方参照を展開しないため :param を使う）。
      //     「:path+」は 1 セグメント以上にマッチし、ルート「/」には (2) を使わせる。
      {
        source: "/:path+",
        has: [{ type: "host", value: "www.funex.co.jp" }],
        destination: "https://funex.co.jp/:path+",
        permanent: true,
      },
      // (4) /index.html → /（正規 URL は「/」）。重複コンテンツの解消。
      {
        source: "/index.html",
        destination: "/",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return {
      // beforeFiles: ファイルシステム/ルート解決より「前」に評価される。
      // URL は「/」のまま、静的ホーム public/index.html の中身を 200 で配信する
      // （リダイレクトではなく内部リライトのため URL バーは「/」のまま）。
      beforeFiles: [
        { source: "/", destination: "/index.html" },
      ],
    };
  },
};

export default nextConfig;
