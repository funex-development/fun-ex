# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

**FunEx Corporate Website** - A hybrid Next.js 15 website for 株式会社ファンエクス (FunEx Inc.) that combines modern React Server Components with legacy static HTML pages.

**Key Technologies:**
- Next.js 15 (App Router)
- React 19
- TypeScript 5.7
- Tailwind CSS 3.4
- Resend (email delivery)
- Cloudflare Turnstile (anti-bot)

---

## Development Commands

### Essential Commands
```bash
# Development server (default port: 3000)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint check
npm run lint
```

### Environment Variables
Create `.env.local` for local development:
```
RESEND_API_KEY=your_resend_api_key
CF_SECRET_KEY=your_cloudflare_turnstile_secret
NEXT_PUBLIC_CF_SITE_KEY=your_cloudflare_turnstile_site_key
WEBHOOK_URL=your_discord_webhook_url
```

**Important:** Never commit `.env.local` or `.env` files. They are already in `.gitignore`.

---

## Architecture Overview

### Hybrid Architecture
This project uses a **hybrid approach** with two distinct systems:

1. **Next.js App Router** (`/app` directory)
   - `/contact` - Modern contact form with TypeScript/React
   - API route: `/api/contact/route.ts`
   - Server-side rendering, type-safe

2. **Static HTML Pages** (`/public` directory)
   - `index.html` - Homepage
   - `about.html` - Company info
   - `services.html` - Service listings
   - `news.html` - News articles
   - `privacy.html` - Privacy policy
   - Served directly as static files by Next.js

**Why this architecture?**
- Static HTML pages for SEO and performance (no JS required for content)
- Next.js for dynamic features (contact form, API routes)
- Allows gradual migration from static site to full Next.js app

### File Organization

```
fun-ex/
├── app/                           # Next.js App Router
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Homepage redirect
│   ├── contact/page.tsx           # Contact form page
│   └── api/contact/route.ts       # Contact API endpoint
│
├── public/                        # Static assets + HTML pages
│   ├── *.html                     # Static HTML pages (served as-is)
│   ├── style.css                  # Main stylesheet (21KB)
│   ├── services-carousel.css     # Swiper carousel styles
│   ├── mvv.css                    # Mission/Vision/Values styles
│   ├── subpage.css                # Subpage common styles
│   ├── script.js                  # Main JavaScript (mobile menu, scroll effects, Swiper)
│   ├── hero-effect.js             # Canvas particle animation
│   └── assets/                    # Images, icons, media files
│
├── ARCHITECTURE.md                # Comprehensive architecture documentation
├── SECURITY_DESIGN.md             # Security requirements and guidelines
└── vercel.json                    # Deployment configuration
```

---

## Key Design Patterns

### 1. Static HTML Pages
The main content pages (index, about, services, news) are plain HTML files in `/public` directory. They:
- Load Font Awesome 6 for icons
- Use Swiper.js for carousels
- Include vanilla JavaScript for interactions
- Have no build step (served directly)

**When editing static HTML:**
- Icons use Font Awesome classes: `<i class="fas fa-gamepad"></i>`
- Service cards use Swiper carousel with autoplay (3 seconds)
- All styling is in separate CSS files (no inline styles except for specific overrides)

### 2. CSS Architecture
Multiple CSS files with specific purposes:
- `style.css` - Main styles, navbar, footer, typography
- `services-carousel.css` - Service card carousel (Swiper) with specific icon positioning
- `mvv.css` - Mission/Vision/Values section styles
- `subpage.css` - Common styles for about/services/news pages

**CSS Conflicts:**
- If styles aren't applying, check for competing rules in multiple CSS files
- Use `!important` sparingly, only when absolutely necessary to override library defaults
- Service cards had issues with background/text visibility - check both `style.css` and `services-carousel.css`

### 3. Icon Positioning (Font Awesome)
Service icons require pixel-perfect adjustments because Font Awesome SVG paths are not naturally centered:

```css
/* Icon container uses flexbox centering */
.magic-card .service-icon {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
}

/* Individual icons need manual adjustments */
.magic-card .service-icon .fa-gamepad {
    transform: translate(-4px, 0px) !important;
}
```

**When adjusting icons:**
1. Edit `public/services-carousel.css`
2. Test in browser with DevTools
3. Adjust translate values pixel by pixel
4. All icons currently use `translate(-4px, 0px)` for consistency

### 4. Contact Form (Next.js)
The contact form (`/contact`) is a modern Next.js page with:
- Server-side form validation
- Cloudflare Turnstile anti-bot protection
- Discord webhook notification
- Resend email confirmation
- Full TypeScript type safety

**Form Flow:**
1. User submits form → `/api/contact/route.ts`
2. Validate required fields
3. Verify Turnstile token with Cloudflare API
4. Send Discord notification via webhook (embedded format)
5. Send confirmation email via Resend
6. Return success/error response

**Security:**
- All personal info processed server-side only
- No sensitive data in client-side JavaScript
- CSRF protection via Next.js
- Input sanitization and validation

---

## JavaScript Functionality

### script.js
Core interactions for static HTML pages:
- **Mobile menu toggle** - Hamburger menu with scroll lock
- **Navbar scroll effects** - Hide on scroll down, show on scroll up (when scrollY > 100px)
- **Smooth scrolling** - Anchor links with 80px offset for navbar
- **Swiper initialization** - Carousel with autoplay (3s delay), loop enabled, responsive (1 slide on mobile, 3 on desktop)

### hero-effect.js
Canvas-based particle animation for hero section:
- 60 particles on desktop, 20 on mobile
- Particle connections within 150px
- Mouse repulsion effect (200px radius)
- Three-color gradient (#ff6b6b, #4ecdc4, #ffd93d)
- Responsive resize with debouncing

---

## Styling Guidelines

### Color Palette
```css
/* Primary background: Pure white */
--bg-dark: #ffffff;

/* Text colors */
--text-main: #000000;     /* Pure black */
--text-muted: #4a4a4a;    /* Dark gray */

/* Accent colors */
--primary: #111111;       /* Serious black */
--accent: #0066cc;        /* Blue for service icons */

/* Button gradient */
linear-gradient(135deg, #ff6b6b, #ff8e53);
```

### Typography
- **Font Stack:** `'Noto Sans JP', 'Outfit', sans-serif`
- **Weights:** Regular (400), Medium (500), Bold (700), Black (900)
- **Base Size:** 16px (1rem)

### Responsive Breakpoints
- Mobile: `< 768px`
- Desktop: `≥ 768px`

### Service Cards
- Fixed height: 400px (with min-height and max-height to prevent content overflow)
- Card background: `#1e293b` (dark slate)
- Border: `2px solid #334155`
- Icon background: `#0066cc` (blue)
- Icon size: 80x80px with 40px Font Awesome icon inside
- Text: `#ffffff` (white) for visibility against dark background

---

## Common Tasks

### Updating News Articles
Edit `public/news.html` and add new `<article class="news-item">` at the top:
```html
<article class="news-item">
    <time datetime="2025-XX-XX">2025.XX.XX</time>
    <div class="news-info">
        <h3 class="news-title">
            <a href="..." target="_blank" rel="noopener noreferrer">
                タイトル
            </a>
        </h3>
        <p class="news-desc">説明文 (optional)</p>
    </div>
</article>
```

### Adding a New Service
1. Edit `public/index.html` - Add service card in Swiper carousel
   - カードは1回のみ記述（Swiperの`loop: true`が自動で複製するため）
   - `.magic-card` に `card-game` / `card-event` / `card-web` / `card-sns` / `card-ai` 等のクラスを付与（アクセント色はこれで決まる）
2. Edit `public/services.html` - Add detailed service section with ID
3. Update footer in ALL HTML pages to include new service link
4. Add service icon to `public/assets/` if using image instead of Font Awesome

### Adjusting Icon Positions
Edit `public/services-carousel.css`:
```css
.magic-card .service-icon .fa-icon-name {
    transform: translate(Xpx, Ypx) !important;
}
```
- Test in browser DevTools
- Adjust X (horizontal) and Y (vertical) pixel values
- Current standard: `translate(-4px, 0px)` for all icons

### Modifying Contact Form
- Frontend UI: `app/contact/page.tsx`
- Backend logic: `app/api/contact/route.ts`
- TypeScript interfaces: Update in `route.ts` if changing form fields
- Test all three integrations: Turnstile, Discord webhook, Resend email

---

## Deployment

**Platform:** Vercel (auto-deploy from Git)

**Security Headers:** Configured in `vercel.json`
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block

**Caching Strategy:**
- Assets (`/assets/*`): 1 year (immutable)
- HTML/API: No cache (dynamic)

**Environment Variables:**
Set in Vercel dashboard (never commit to Git):
- `RESEND_API_KEY`
- `CF_SECRET_KEY`
- `NEXT_PUBLIC_CF_SITE_KEY`
- `WEBHOOK_URL`

**Deployment Flow:**
1. Push to `main` branch → Production deploy
2. Pull requests → Preview deploy with unique URL
3. Vercel automatically runs `npm run build` and `npm start`

---

## Important Notes

### Japanese Language
This is a Japanese website (株式会社ファンエクス). When making changes:
- Preserve Japanese text encoding (UTF-8)
- Keep Japanese text formatting (line breaks, spacing)
- Test Japanese font rendering (Noto Sans JP)
- Use Japanese for commit messages

### CSS Override Strategy
When styles don't apply:
1. Check if multiple CSS files have competing rules
2. Use browser DevTools to identify which rule is winning
3. Add `!important` only when necessary to override library defaults (Swiper, Font Awesome)
4. Document why `!important` was needed in comments

### Static HTML Limitations
The static HTML pages cannot:
- Use environment variables (client-side)
- Access server-side APIs directly (use Next.js routes instead)
- Have dynamic content without JavaScript

For dynamic features, create new Next.js pages in `/app` directory.

### Build Workflow
Always test builds before committing major changes:
```bash
npm run build
```
Fix any TypeScript errors or build issues before deployment.

### Security Requirements
**Critical:** Read `SECURITY_DESIGN.md` before working on:
- Contact form
- User input handling
- API endpoints
- Database operations (future)

**Never:**
- Expose API keys in client-side code
- Store sensitive data in LocalStorage/SessionStorage
- Display personal information without authentication
- Skip input validation on server-side
- Hardcode credentials in source code
- Commit `.env` files to Git

**Security Checklist:**
- [ ] Environment variables for all secrets
- [ ] Server-side validation for all inputs
- [ ] CSRF protection (Turnstile token)
- [ ] XSS prevention (use `textContent` over `innerHTML`)
- [ ] SQL injection prevention (use ORMs/prepared statements)
- [ ] Error messages don't expose sensitive info
- [ ] HTTPS enforced
- [ ] Security headers configured

---

## Git Workflow

**Branch Naming:**
- `feature/*` - New features
- `docs/*` - Documentation updates
- `hotfix/*` - Urgent production fixes
- `test/*` - Testing workflows

**Commit Messages:**
Use Japanese with Claude Code footer:
```
[Subject line in Japanese]

[Body in Japanese]

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

---

## 対応履歴

### 2026-06-10 — トップページのヒーロー以降リッチ化（スクロール演出＋セクション装飾）
- **背景**: ヒーローだけがリッチで以降が「見出し＋テキスト＋ボタン」のみでシンプルすぎるとの判断。案A（モーション強化）＋案C（セクションの見た目刷新）の組み合わせで実装。設計書 `docs/superpowers/specs/2026-06-10-top-page-richness-design.md`／実装プラン `docs/superpowers/plans/2026-06-10-top-page-richness.md`。
- **style.css（末尾に追記）**: ①スクロールリビール（`.js-reveal .reveal` → `.is-visible`）②Aboutにブランド3色の淡いradial-gradientブロブ（transformのみの18sアニメ）③Servicesをライトグレー帯＋上下に白い斜めウェッジ（clip-path）④Newsカード化（**`.news-home` でトップ専用にスコープ** — `.news-item` はnews.htmlと共有クラスのため必須）⑤Contact用グラデCTA帯（`.contact-cta`、ブランドグラデに黒16%を重ねて白文字のコントラスト3:1確保、ボタン文字 #d23f3a は4.5:1）。装飾サークルは疑似要素でなく背景レイヤーで描画。
- **script.js**: DOMContentLoaded末尾にIntersectionObserverのリビール処理。同一セクション内は0.12s刻みのstagger、表示後にtransitionDelayを除去（ホバー遅延防止）、`prefers-reduced-motion`時はJS側でスキップ＋CSS側にも無効化ルール（二重ガード）。JS無効時は `.js-reveal` が付かないため何も隠れない。
- **index.html**: クラス付与のみ（`reveal`×12・`news-home`・`contact-cta`）＋Contactの section-desc のインラインstyleをCSSへ移設。文章・リンク・構成・カルーセルは不変。
- **既存実装の知見**: サービスカードは現在**白ベース＋アクセント色**でホバー演出も実装済み（本ファイルStyling Guidelinesの「ダークカード #1e293b」記述は古い）。ボタンのホバー演出も既存。
- **技術知見（重要・再発防止）**: この環境のChromeは **CDPスクリーンショット（Page.captureScreenshot）がタブごとに数枚で劣化してハングする**（30sタイムアウト）。ページ側は無実（JS即応・新しいタブなら同じ画面が即撮れる）。CSS要素の二分探索で「原因特定」しても劣化途中のまだら成功を追いかけているだけの可能性が高い。**検証スクショは新しいタブで最初の1〜2枚に絞る**こと。過去の「feGaussianBlurでフリーズ」も同根の疑いあり。
- **検証**: localhost:3002 で全セクション目視・リビール12要素動作・コンソールエラーなし・`npm run build` 成功。モバイル幅のみ実機未確認（resize_windowが環境的に不可。CSSパースは検証済み）。
- **コミット状況**: 設計書・プラン・style.css・script.js はコミット済み（ブランチ `fix/seo-canonical-index-html`）。**index.html は未コミット**（同日のMEO対応等の未コミット変更と同居しているため、コミット方針はユーザー判断待ち）。
- **未デプロイ**: Git push → Vercel 反映が必要。
- 関連: `public/index.html`, `public/style.css`, `public/script.js`

### 2026-06-10 — トップページ（index.html）事業内容カルーセルのサービス再構成
- **導入文**: 事業内容セクションの section-desc を「私たちの事業はすべて、中小企業の価値を」→「**私たちの事業は、中小企業の価値を最大化し**」に変更。`α世代` はギリシャ文字のまま維持（サイト全体20+箇所の表記統一のため。ユーザー指定の半角 `a世代` はキーボード代替と判断し採用せず）。
- **カルーセル（5枚構成に）**: 「オフラインイベント」カードを削除、「生成AI活用サポート」→「**生成AI伴走支援**」に改名、「**MEO対策**」カードを新設。
- **MEO対策カード**: コピー「Googleマップで見つけてもらえるお店へ。来店・お問い合わせ・売上の増加につながる集客をサポートします。」。アクセント色 `.magic-card.card-meo { --accent: #2e7d32 }`（ディープグリーン、他カードと非重複）、地図ピン型インラインSVG（`icon-meo`／ふわっと上下＋きらめき、`prefers-reduced-motion` 対応）を `services-carousel.css` に追加。
- **構造化データ**: JSON-LD 提供サービスからオフライン削除・生成AI伴走支援に改名・MEO対策追加。`knowsAbout` に「MEO対策」「ローカルSEO」を追加。
- **スコープ判断**: 本作業は「トップの注目5サービス」レイヤー（index.html カルーセル＋各ページフッター）のみ。`services.html`／`llms.txt`／`about.html` の「事業内容」表（=8項目カタログ）は別レイヤーとして非更新（services.html 側の整理は同日の別エントリ参照）。
- **フッターMEOリンク**: 当初 `/contact` で実装したが、同日の「services.html に MEO対策セクション追加」作業で全ページ `services.html#service-meo` に統一済み。
- **未整合（将来用メモ）**: トップのカード/フッター表記は「生成AI伴走支援」、services.html 詳細セクションは「生成AI活用/導入」で名称が分かれている。
- **未デプロイ**: Git push → Vercel 反映が必要。
- 関連: `public/index.html`, `public/services-carousel.css`

### 2026-06-10 — 会社設立日（2024年3月）を全公開面から削除
- **会社概要テーブルの「設立」行を削除**（`about.html`）。
- **構造化データ JSON-LD の `foundingDate` を削除**（`about.html` / `index.html` 両方）。
- **`about.html` の meta description・og:description から「設立2024年3月、」を削除**、`<title>` の「設立」キーワード（代表・設立・所在地 → 代表・所在地）も削除。
- **`llms.txt` の「設立」行を削除**。
- **理由**: 設立年（社歴の浅さ）を露出させない方針。表示だけ消すと検索結果/SNS/AI検索に残るため、表示・メタ・構造化データ・llms.txt を一括で揃えた。
- **残置**: `privacy.html` の「制定日: 2024年3月1日」はプライバシーポリシー制定日（会社設立日とは別物・偶然同日）のため触っていない。`ARCHITECTURE.md`（社内ドキュメント、設立=2024年7月の古い不整合あり）も公開面でないため未修正。
- **未デプロイ**: Git push → Vercel 反映が必要。
- 関連: `public/about.html`, `public/index.html`, `public/llms.txt`

### 2026-06-10 — 事業内容ページ（services.html）の文言・料金・サービス整理
- **2サービスを削除**: 「ポスター/チラシ制作」「オフラインイベント企画/運営」をタブ・詳細セクション・meta記述から削除。波及する不整合も解消 → `about.html` の事業内容リスト、`llms.txt` のサービス一覧（8→6領域・番号振り直し）、`app/contact/page.tsx` フッターの `#service-event` リンク（リンク切れ回避）、`subpage.css` の `#service-poster` 専用スタイル（dead CSS）を削除。
- **HP制作**: 管理費 月額4,980円→**5,000円**、制作費/管理費に**（税抜）明記**（消費者向け総額表示の誤解防止）、説明文「ドメイン取得から管理まで〜」→「**サーバー管理から保守、運用まで全てお任せいただけます。**」、「HP制作例：ポートフォリオサイト」リンクを削除。
- **生成AI活用**: 説明文を「**お客様自身で**生成AIを使いこなせるようになる伴走支援を提供します。」に変更（システム開発の記載を削除・3行構成）。
- **MEO対策**: キャッチコピー「『近くで探す』お客様に、**いちばんに**見つかる」→「見つかる」（"いちばんに" は1位を断定する誇大表現になりうるため削除）。
- **残置**: 削除2サービスの画像アセット（`flyer-bousai` / `flyer-hp` / `offline-event`）はグローバルルール「ファイル削除禁止」に従い残置（参照は無くなった）。
- **未デプロイ**: Git push → Vercel 反映が必要。
- 関連: `public/services.html`, `public/about.html`, `public/llms.txt`, `app/contact/page.tsx`, `public/subpage.css`

### 2026-06-10 — 生成AIセクションのSVGビジュアル刷新（service-ai.svg）
- **public/assets/service-ai.svg を全面リライト**。3回の方向転換を経て最終形は「漆黒×アイスブルー単色系のニューラルネットワーク＋パス化したAIモノグラム」。①プレミアムミニマル→ユーザー評「しょぼい」、②ネオン多色の派手路線→「子どもっぽい」、③単色ハイエンド路線→採用。今後の調整も「大人かっこいい・単色系・明度差で奥行き」の路線を基準にする。
- **技術知見（再発防止）**:
  - このSVGは `<img>` で読み込まれるため Webフォント不可・SMIL/内部CSSは可 → ロゴ文字は `<text>` ではなくパスで描く
  - 大判 `feGaussianBlur`（stdDeviation 55 をアニメ層に適用）で Chrome レンダラーがフリーズ（CDPスクショのタイムアウトで発覚）→ 発光表現は放射グラデーション図形で代替し、ぼかしフィルタは小領域・静的色（キャッシュ可能）に限定する
  - 中心から放射するエッジは中央のAIモノグラムを貫通して可読性を壊す → 第1シェルは八角形リング配線にする
- **構成**: ノード28個を3層シェル配置（内側ほど明るく＝被写界深度）、信号パルス5個・発火エッジ5本・波紋は低頻度。`prefers-reduced-motion` では `.ai-motion` クラスの要素を display:none（SMILはCSSで停止できないため要素ごと隠す方式）。
- **public/services.html**: 生成AIセクションの `alt` を新デザインの説明に更新。
- **検証**: localhost:3001 で単体表示＋実ページを Chrome MCP スクショで確認。旧デザインは `../_meo_eval/ai.svg` に保全、`<img>` 読み込み検証用 `../_meo_eval/ai_v2_host.html` を新規作成。
- **未デプロイ**: Git push → Vercel 反映が必要。
- 関連: `public/assets/service-ai.svg`, `public/services.html`, `../_meo_eval/ai_v2_host.html`

### 2026-06-10 — 事業内容ページに「MEO対策」セクション追加
- **背景**: フッターに「MEO対策」リンクは既にあったが `/contact` を指すのみで、事業内容ページに専用セクションが無かった。事業内容ページへ正式に追加した。
- **public/services.html**: サービスタブに「MEO対策」を追加し、末尾に専用セクション `#service-meo` を新設。コピーは既存サービスと同じ「課題→解決」トーン（「近くで探す」客向けの地図検索上位＝Googleビジネスプロフィール最適化・口コミ返信運用・写真/投稿改善）。※見出しは投入後にユーザー側で「『近くで探す』お客様に見つかる」へ短縮調整あり。
- **public/assets/service-meo.svg（新規・約37KB）**: 姉妹作 `service-ai.svg` と同系のダーク×ネオンHUDのアニメSVG。夜の地図グリッド＋発光する主役ピン＋No.1バッジ＋検索リーチの同心円波＋順位リスト（1位ハイライト/地図表示スコア94%）＋★4.8＋検索バー「地域名×業種」。SMILアニメ・`prefers-reduced-motion`対応・`viewBox 0 0 1600 900`・`preserveAspectRatio xMidYMid slice`。Googleロゴ等の商標は不使用の汎用デザイン。
- **public/subpage.css**: `.service-meo-visual`（夜の地図トーン背景＋ティール/グリーンのグロー枠）を `.service-ai-visual` に倣って追加。PC/モバイル両レイアウトは `.service-item` 既存ルールを継承。
- **フッター統一**: 全ページ（services/about/news/privacy/index）のフッター「MEO対策」リンクを `/contact` → `services.html#service-meo` に変更。フッター内の他サービス（ゲーム/SNS/AI）が各セクションへ飛ぶ挙動に揃えた。
- **既知の未修整（今回は触れず）**: 全ページのフッター「Web制作」が `services.html#service-web` を指すが該当IDは存在しない（実体は `#service-hp`）。
- **検証**: ローカル dev（3000使用中のため port 3001）で実ページを表示し、タブ追加・セクション表示・SVGのコンテナ内16:9スライス表示・レイアウトを目視確認。SVGはXML整形式・id一意・url参照整合・SMIL正当性を機械検証済み。
- **後片付け**: 生成過程でサブエージェントが作った検証用スクラッチ（`_meo_eval/`、ルート直下の重複 `service-meo.svg`、一時スクリプト）を削除済み。`fun-ex/` 配下のサイト本体には影響なし。
- **未デプロイ**: Git push → Vercel 反映が必要。
- 関連: `public/services.html`, `public/assets/service-meo.svg`, `public/subpage.css`, 各 `public/*.html` フッター

### 2026-06-09 — `/index.html` 重複インデックスの根本解消（SEO正規化）
- **背景**: Google に `https://www.funex.co.jp/index.html` がインデックスされていた（正規 `/` ではなく）。原因は `app/page.tsx` が `/` を `/index.html` へ 307 リダイレクトしており、サイト自身が「正規ページは /index.html」と宣言していたこと。加えて www/非www のHTTP正規化が無く重複URLが最大4種存在していた。
- **next.config.ts**: リダイレクト方向を逆転。`/index.html → /` を 308、www→非www を 308 で正規化。`/` は `beforeFiles` rewrite で静的ホーム `public/index.html` を **200** 配信（URLは `/` のまま）。
  - **重要（壊さないこと）**: `redirects` と `beforeFiles` rewrite は別フェーズで評価されるためループしない。`/` を再び `/index.html` へ **redirect** する実装に戻すと 307 問題が再発する。www正規化の destination は `$1` 後方参照が展開されないため `:path+` 名前付きパラメータを使用している。
- **app/page.tsx**: 元凶の `redirect('/index.html')` を除去。rewrite が万一外れた時のフェイルセーフとして `notFound()`（空200の白紙インデックス防止）。
- **app/contact/layout.tsx（新規）**: `/contact` がルート layout の `canonical:'/'` を継承しホームを正規URLと誤宣言していたため、`canonical:'/contact'` を付与。
- **内部リンク**: 全静的HTML+contactページのロゴ/TOPリンク 27箇所を `/index.html`→`/` に統一。`public/llms.txt` のトップURLも `/` に。
- **sitemap**: `public/sitemap.xml` の lastmod 更新。ルート直下 `sitemap.xml`（Next.jsでは非配信の残骸）を public版に同期し旧 `/index.html` を削除。JSON-LD の `url` を canonical と統一（末尾スラッシュ）。
- **検証**: プロダクションビルド+ローカル起動で全リダイレクト/配信を実測済み（`/`=200, `/index.html`=308→/ 1ホップ, www系=308で非wwwへ, ループ無し）。
- **デプロイ後の必須作業**: Search Console で `/` の再インデックス申請・サイトマップ再送信。Vercel CDN に旧307がキャッシュ済のため反映確認（必要なら Build Cache オフで再デプロイ）。

### 2026-04-20
- `public/index.html` のcanonical URLを `https://funex.co.jp/index.html` → `https://funex.co.jp/` に修正
- `public/sitemap.xml` から `/index.html` の `<url>` ブロックを削除（残り6URL: `/`, `/about.html`, `/services.html`, `/news.html`, `/contact`, `/privacy.html`）
- 未デプロイ（Git commit & push → Vercel反映が必要）

---

## Documentation References

- **ARCHITECTURE.md** - Full technical architecture, design specs, future roadmap (810 lines)
- **SECURITY_DESIGN.md** - Security requirements, XSS/CSRF/SQL injection prevention, coding guidelines
- **vercel.json** - Deployment and security headers configuration

For detailed information about:
- Design patterns and UI/UX specifications → ARCHITECTURE.md
- Security best practices and code review checklist → SECURITY_DESIGN.md
- Particle animation details → ARCHITECTURE.md (JavaScript section)
- SEO and performance optimization → ARCHITECTURE.md (Future Features section)
