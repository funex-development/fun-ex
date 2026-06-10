# トップページ「Particle Continuum」リッチ化 設計書（第2弾）

日付: 2026-06-10
対象: `public/index.html` / `public/style.css` / `public/script.js`
前提: 第1弾リッチ化（`2026-06-10-top-page-richness-design.md`）の上に積む。ヒーローは変更しない。

## コンセプト

ヒーローのパーティクルネットワーク（ドット・接続線・ブランド3色 #ff6b6b / #4ecdc4 / #ffd93d）を
**サイト唯一の装飾言語**と定義し、全セクションへ同じ語彙で展開する。
「ヒーローだけ別世界」だった現状を「ページ全体がひとつの世界」に変える。
3デザイナー案（モチーフ統一／モーション職人／セクション造形）＋2審査員のワークフローで
「Particle Continuum」案が両審査員1位。静的密度（案3）と触感（案2）を一部移植して統合した。

## スコープ方式

- `index.html` の `<body>` に `class="home"` を付与（全ページで body クラスは未使用＝衝突なし）
- 新スタイルは**すべて** `.home` 配下にスコープ。style.css は全5ページ共有のため必須
- 装飾DOMはすべて `aria-hidden="true"`。既存の文章・コンテンツは不変

## 採用項目

1. **スクロールプログレスバー「シグナル・ライン」**（全体）
   3色グラデ＋先端イエローノードの3pxバー（fixed top、z-index:1001）。
   script.js の既存 rAF スクロールハンドラに transform:scaleX() 更新を相乗り（新規リスナーなし）。
   要素の null ガード必須（script.js は全ページ共有）。reduced-motion では display:none。

2. **セクション番号 01〜04**（各 section-header）
   Unbounded・ブランドグラデ塗りの実DOM `<span class="sec-index">`。完全静的。Contact 上は白系グラデ。

3. **About: 浮遊ジオメトリック粒子 ＋ 同心円リング・ドットパネル**
   - 粒子6個（塗りドット2・アウトラインリング2・接続線2）が apFloatA/B（transform のみ、10〜16s）で漂う
   - `::after` に静的背景: 右上に同心円リングSVG、左下にドットグリッドSVGパネル（CSS mask 不使用、SVG 内 pattern で自己完結）
   - 既存 `::before`（ブロブ）には触れない（アニメ中レイヤーへの地紋同居は審査で却下済み）

4. **セクション間「ネットワーク・スレッド」**（About末尾・News末尾）
   垂直点線が scaleY で伸び、3色ノードが時間差ポップ。既存リビール（.reveal/.is-visible）相乗りで JS 追加ゼロ。
   隠し初期状態は `.js-reveal` 配下にのみ書く（JS無効時は常時表示）。

5. **Services: 回路図地紋 ＋ 英字アウトラインマーキー帯**
   - 背景にドット3個＋接続線2本の回路図風SVGタイル（静的）
   - 『GAME / WEB / SNS / AI / MEO / FUN EXPERIENCES』の巨大中抜き文字が -2deg 傾きで流れる（48s、translateX -50% ループ、span 2連）
   - FUN EXPERIENCES のみブランドグラデ塗り（案2から移植）。stroke は 0.14（審査指摘で 0.08 から増強)
   - reduced-motion では静止（透かしとして成立）。`@supports not (-webkit-text-stroke)` フォールバックあり

6. **Services: コンステレーション・ライン＋信号パルス**（1021px以上限定）
   カード背後をアイコン高さで破線が貫き、コーラルの光点が左→右へ走る（translateX のみ）。
   top はカスタムプロパティ `--svc-net-top` で管理（ハードコード回避）。overflow:hidden でパルスのはみ出しをクリップ。
   1020px 以下は display:none（Swiper でカード位置が動的なため）。

7. **サービスカード: シャインスイープ**
   ホバーで白い光が斜めに一閃（`.magic-card-content::after`、`.magic-card::after` は既存CSSで封鎖済みのため）。
   モバイルは Swiper の slideChangeTransitionEnd でアクティブカードが1回光る（.shine-once、animationend で除去）。
   ※3Dチルト・磁気ボタンは審査で却下（既存 transition との競合・費用対効果）

8. **News: ドット地紋 ＋ ノード・タイムライン ＋ グラデ下線**
   - 周縁だけに見えるドット地紋（中央は CSS mask で抜き、可読性維持）
   - カード左に3色グラデ縦レール（リビールで scaleY）、カード毎に左バー色と同期したノード、ホバーでピング波紋
   - タイトルホバーでコーラル→ティールのグラデ下線が scaleX スイープ（origin 切替で「右へ抜けて左から入る」）
   - news.html には .news-home が無いため完全不干渉

9. **Contact: 星座タイル ＋ 光スイープ ＋ 浮遊光点 ＋ CTAパルス**
   - 既存 background スタックの先頭に星座SVGタイルを追加（.home スコープで再宣言、共有側不変）
   - `::before` で幅広の淡い光帯が 7s 周期で往復（translate3d のみ、案2から移植）
   - 白/イエローの光点4個が浮遊（モバイル2個）
   - ボタンに白リングのシグナル・パルス（scale+opacity）

10. **Footer: 3色ヘアライン ＋ 沈殿地紋 ＋ リンクノード ＋ 巨大FUNEX透かし**
    - 上端に3色ストライプの3pxライン、極薄白ドットの沈殿地紋
    - リンクホバーで3色循環のノードドットがポップ（幅は常時確保＝レイアウトシフトなし）
    - ページ唯一の巨大中抜き「FUNEX」がフッター到達時にカーテンリビールでせり上がる（footer に .reveal フック、
      visual-hide は無効化して観測フックとしてのみ使用）

## 制約の実装ルール

- アニメーションは transform / opacity のみ。background-position・width・filter のアニメ禁止
- 常時アニメ: マーキー1本＋浮遊粒子（PC6＋4個/モバイル3＋2個）＋パルス2種のみ。すべてコンポジタ完結
- `@media (prefers-reduced-motion: reduce)` で全アニメ停止（静止状態でも装飾として成立する設計）
- モバイル（768px以下）: 粒子削減・マーキー縮小減速・svc-net 非表示
- JS 追加は (a) プログレスバー更新2行（既存rAF内・nullガード）、(b) Swiper イベントでの shine-once 付与のみ

## 却下項目（再提案しないこと）

- 磁気ボタン／カード3Dチルト（既存 transition 競合・タッチで無価値・複雑度）
- フッターリンク矢印の width 遷移（layout アニメ）
- 斜めウェッジ→曲線ウェーブ置換（第1弾の承認済み造形の破棄、ヒーローの直線的幾何言語と不連続）
- 全セクションへの巨大透かし展開（同一トリックの乱用。フッター1箇所に限定）
- マーキー2本目／Aboutブロブ ::before への地紋同居（漂流バグ）／パララックスJS
