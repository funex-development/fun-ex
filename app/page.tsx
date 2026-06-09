import { notFound } from "next/navigation";

/**
 * ルート「/」は next.config.ts の beforeFiles rewrite が
 * 静的ホーム public/index.html を 200 で配信するため、通常このコンポーネントには到達しない。
 *
 * 以前はここで redirect('/index.html') していたが、それが「/ → /index.html」への
 * 307 リダイレクトを生み、Google に「正規ページは /index.html」と誤って伝える原因だった。
 * リダイレクトを除去し、万一 rewrite が外れて到達した場合は空の 200 ページ（白紙インデックス）
 * ではなく 404 を返して異常を検知できるようにする。
 */
export default function Home() {
  notFound();
}
