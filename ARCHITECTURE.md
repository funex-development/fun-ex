# FunEx Webサイト - アーキテクチャ・仕様書

**最終更新日**: 2025-12-25
**バージョン**: 1.0
**ステータス**: 本番稼働中

---

## 📋 目次

1. [プロジェクト概要](#プロジェクト概要)
2. [技術スタック](#技術スタック)
3. [ディレクトリ構造](#ディレクトリ構造)
4. [ページ構成](#ページ構成)
5. [UI/UXデザイン仕様](#uiuxデザイン仕様)
6. [JavaScript機能詳細](#javascript機能詳細)
7. [デプロイメント](#デプロイメント)
8. [今後の拡張予定](#今後の拡張予定)
9. [保守・運用](#保守運用)

---

## プロジェクト概要

### プロジェクト名
**FunEx コーポレートサイト**

### 目的
株式会社FunExの企業情報、事業内容、ニュース、お問い合わせを提供するコーポレートウェブサイト

### ターゲット
- 潜在顧客（企業、個人事業主）
- 求職者
- パートナー企業
- メディア関係者

### 主要サービス
1. ホームページ制作
2. YouTube運営代行
3. SNS構築/運用
4. 公式LINE構築/運用
5. 動画制作
6. ポスター/チラシ制作
7. 生成AI活用/導入支援
8. ゲーム/メタバース制作
9. オフラインイベント企画/運営

---

## 技術スタック

### フロントエンド

| 技術 | バージョン | 用途 |
|------|-----------|------|
| **HTML5** | - | マークアップ |
| **CSS3** | - | スタイリング |
| **JavaScript (ES6+)** | - | インタラクション |
| **Swiper.js** | v10 | カルーセル/スライダー |
| **Font Awesome** | v6.4.0 | アイコンセット |
| **Google Fonts** | - | フォント読み込み |

### バックエンド
**なし**（完全な静的サイト）

### ホスティング
- **Vercel** - 静的サイトホスティング、CDN、SSL

### 開発ツール
- **Git** - バージョン管理
- **GitHub** - リポジトリホスティング

### ビルドツール
**不要**（静的サイトのため）

---

## ディレクトリ構造

```
fun-ex/
├── index.html              # ホームページ
├── about.html              # 会社概要
├── services.html           # 事業内容
├── news.html               # ニュース一覧
├── contact.html            # お問い合わせ
│
├── style.css               # メインスタイル（1,096行）
├── mvv.css                 # ミッション・ビジョン・バリュー
├── subpage.css             # サブページ共通スタイル
├── services-carousel.css   # Swiperカルーセルスタイル
│
├── script.js               # メインJavaScript（98行）
├── hero-effect.js          # ヒーローCanvasアニメーション（143行）
│
├── assets/                 # 画像・メディアファイル
│   ├── logo.png
│   ├── icon-*.jpg
│   ├── *-portfolio.png
│   └── ...
│
├── vercel.json             # Vercel設定
├── sitemap.xml             # サイトマップ
├── .nojekyll               # GitHub Pages設定
├── SECURITY_DESIGN.md      # セキュリティ設計書
└── ARCHITECTURE.md         # 本ドキュメント
```

---

## ページ構成

### 1. ホームページ (`index.html`)

**URL**: `/` または `/index.html`

**セクション構成**:
1. **ヒーローセクション**
   - Canvasパーティクルアニメーション
   - メインキャッチコピー: "Creating Fun Experiences"
   - CTAボタン: "お問い合わせ"
   - スクロールインジケーター

2. **Aboutセクション** (`#about`)
   - 企業紹介テキスト
   - 画像ギャラリー
   - CTAボタン: "詳しく見る"

3. **Servicesセクション** (`#services`)
   - Swiperカルーセル（9つのサービスカード）
   - 自動スクロール機能
   - CTAボタン: "事業内容を見る"

4. **Newsセクション** (`#news`)
   - 最新ニュース3件表示
   - 日付表示、カテゴリタグ
   - CTAボタン: "ニュース一覧"

5. **Contactセクション** (`#contact`)
   - お問い合わせCTA
   - ボタン: "お問い合わせフォームへ"

6. **フッター**
   - 企業情報（ロゴ、住所、連絡先）
   - ナビゲーションリンク
   - サービスリンク
   - コピーライト

**特徴**:
- フルスクリーンヒーロー（100vh）
- スムーススクロール対応
- モバイルレスポンシブ

---

### 2. 会社概要 (`about.html`)

**URL**: `/about.html`

**セクション構成**:
1. **ページヘッダー**
   - タイトル: "私たちについて / About Us"

2. **ミッション・ビジョン・バリューセクション**
   - Mission: "楽しみを創造し、価値を届ける"
   - Vision: "世界中の人々に楽しみと価値を提供し続ける企業になる"
   - Values: 6つの価値観（革新性、顧客第一、品質、協働、誠実、成長）

3. **企業情報テーブル**
   | 項目 | 内容 |
   |------|------|
   | 会社名 | 株式会社FunEx |
   | 設立 | 2024年7月 |
   | 代表取締役 | 奥村 龍弥 |
   | 事業内容 | HP制作、SNS運用、動画制作、AI活用、ゲーム開発等 |
   | 所在地 | 〒464-0850 愛知県名古屋市千種区今池1丁目6−3 アクアタウン納屋橋3F |
   | 電話番号 | 090-9892-9938 |
   | メールアドレス | info@funex.jp |

**特徴**:
- シンプルで読みやすいレイアウト
- 企業情報を一覧表示

---

### 3. 事業内容 (`services.html`)

**URL**: `/services.html`

**セクション構成**:
1. **ページヘッダー**
   - タイトル: "事業内容 / Services"

2. **サービス詳細セクション**（9つ）

   #### 3-1. ホームページ制作 (`#service-hp`)
   - 説明: 企業サイト、ECサイト、ランディングページ
   - 画像: ポートフォリオ事例
   - 技術: HTML, CSS, JavaScript, React, WordPress等

   #### 3-2. YouTube運営代行 (`#service-youtube`)
   - 説明: 企画、撮影、編集、SEO対策、分析
   - 画像: YouTube運営事例

   #### 3-3. SNS構築/運用 (`#service-sns`)
   - 説明: Instagram, Twitter, TikTok等のアカウント運用
   - 画像: SNS運用事例

   #### 3-4. 公式LINE構築/運用 (`#service-line`)
   - 説明: LINE公式アカウントの設計、運用、自動応答設定
   - 画像: LINE公式画面

   #### 3-5. 動画制作 (`#service-movie`)
   - 説明: プロモーション動画、商品紹介動画、イベント動画
   - 画像: 動画制作事例（GIF）

   #### 3-6. ポスター/チラシ制作 (`#service-poster`)
   - 説明: イベントポスター、店舗チラシ、広告デザイン
   - 画像: チラシデザイン事例

   #### 3-7. 生成AI活用/導入支援 (`#service-ai`)
   - 説明: ChatGPT、画像生成AI、業務効率化AI導入
   - 画像: AI活用イメージ

   #### 3-8. ゲーム/メタバース制作 (`#service-game`)
   - 説明: Unity、Unreal Engine、VR/ARコンテンツ
   - 画像: ゲーム開発事例

   #### 3-9. オフラインイベント企画/運営 (`#service-event`)
   - 説明: 展示会、セミナー、ワークショップ
   - 画像: イベント事例

**特徴**:
- グリッドレイアウト（2列）
- 各サービスに画像付き説明
- アンカーリンクでセクション間移動

---

### 4. ニュース一覧 (`news.html`)

**URL**: `/news.html`

**セクション構成**:
1. **ページヘッダー**
   - タイトル: "最新情報 / News"

2. **ニュースリスト**（6件）
   - 2024-03-15: 新サービス開始のお知らせ
   - 2024-03-10: Webサイトをリニューアルしました
   - 2024-03-05: メディア掲載情報
   - 2024-03-01: イベント開催のご案内
   - 2024-02-28: 採用情報を更新しました
   - 2024-02-25: サービス拡充のお知らせ

**特徴**:
- 時系列表示（新しい順）
- カテゴリタグ（お知らせ、プレスリリース、イベント、採用）
- ホバーエフェクト

---

### 5. お問い合わせ (`contact.html`)

**URL**: `/contact.html`

**セクション構成**:
1. **ページヘッダー**
   - タイトル: "お問い合わせ / Contact"

2. **コンタクトカード**
   - 説明テキスト
   - CTAボタン: "お問い合わせはこちら"
   - リンク先: Google Forms（プレースホルダー）

**現状**:
- Google Formsへのリダイレクトのみ
- フォーム実装は未完了

**今後の予定**:
- 自社フォームの実装予定

---

## UI/UXデザイン仕様

### カラーパレット

```css
/* 背景色 */
--bg-dark: #ffffff;           /* 純白 */
--bg-darker: #f5f5f5;         /* ライトグレー */

/* テキスト色 */
--text-main: #000000;         /* 純黒 */
--text-muted: #4a4a4a;        /* ダークグレー */

/* アクセント色 */
--primary: #111111;           /* シリアスブラック */
--secondary: #333333;         /* ダークグレー */
--accent: #555555;            /* ミディアムグレー */

/* ボタングラデーション */
linear-gradient(135deg, #ff6b6b, #ff8e53)

/* ガラスエフェクト */
--glass-bg: rgba(255, 255, 255, 0.9);
--glass-border: rgba(0, 0, 0, 0.1);
```

### タイポグラフィ

**フォントファミリー**:
```css
font-family: 'Noto Sans JP', 'Outfit', sans-serif;
```

**フォントウェイト**:
- Regular: 400
- Medium: 500
- Bold: 700
- Black: 900

**フォントサイズ**:
- H1: 3rem (48px)
- H2: 2.5rem (40px)
- H3: 2rem (32px)
- Body: 1rem (16px)
- Small: 0.9rem (14.4px)

### レイアウト

**コンテナ**:
```css
max-width: 1200px;
margin: 0 auto;
padding: 0 20px;
```

**セクションパディング**:
```css
padding: 100px 0;
```

**ブレークポイント**:
- モバイル: `< 768px`
- タブレット/デスクトップ: `≥ 768px`

### ボタンスタイル

**プライマリボタン**:
```css
background: linear-gradient(135deg, #ff6b6b, #ff8e53);
color: #ffffff;
padding: 15px 40px;
border-radius: 50px;
box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
transition: transform 0.3s, box-shadow 0.3s;
```

**セカンダリボタン**:
```css
background: #ffffff;
color: #000000;
border: 2px solid #000000;
padding: 15px 40px;
border-radius: 50px;
```

**ホバーエフェクト**:
```css
transform: translateY(-2px);
box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
```

### ナビゲーションバー

**デスクトップ**:
- 高さ: 80px
- 背景: 半透明白（スクロール時: 白）
- ロゴ: 左寄せ
- メニュー: 右寄せ

**モバイル**:
- ハンバーガーメニュー
- サイドスライド（右から左）
- 全画面表示

### アニメーション

**ヒーローパーティクル**:
- 60個のパーティクル（デスクトップ）
- 20個のパーティクル（モバイル）
- 3色グラデーション（#ff6b6b, #4ecdc4, #ffd93d）
- 接続線（150px以内）
- マウス反発エフェクト（200px範囲）

**Swiperカルーセル**:
- オートプレイ: 3秒
- ループ: 有効
- スライド数: 1（モバイル）、3（デスクトップ）
- センター寄せ

**スムーススクロール**:
- オフセット: 80px
- イージング: smooth

---

## JavaScript機能詳細

### script.js（98行）

#### 1. モバイルメニュー トグル

**機能**:
- ハンバーガーメニューアイコンクリックでメニュー開閉
- ボディのスクロールをロック
- メニュー内リンククリックで自動閉鎖

**実装**:
```javascript
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
});
```

---

#### 2. ナビバー スクロール エフェクト

**機能**:
- スクロール距離50px以上で背景・影を変更
- ナビバーの視認性向上

**実装**:
```javascript
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});
```

---

#### 3. スムーススクロール

**機能**:
- アンカーリンククリックでスムーズスクロール
- ナビバーの高さ（80px）を考慮したオフセット

**実装**:
```javascript
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        const offset = 80;
        const targetPosition = target.offsetTop - offset;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    });
});
```

---

#### 4. Swiper 初期化

**機能**:
- サービスカルーセルの初期化
- レスポンシブ設定（モバイル1枚、デスクトップ3枚）

**実装**:
```javascript
const swiper = new Swiper('.swiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    centeredSlides: true,
    loop: true,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    breakpoints: {
        768: {
            slidesPerView: 3,
        }
    }
});
```

---

### hero-effect.js（143行）

#### 1. Canvas ベースのパーティクルアニメーション

**機能**:
- 動的なパーティクル生成・描画
- パーティクル間の接続線
- マウスインタラクション（反発エフェクト）
- レスポンシブ対応

**パーティクルクラス**:
```javascript
class Particle {
    constructor(canvas) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color = this.getRandomColor();
    }

    getRandomColor() {
        const colors = ['#ff6b6b', '#4ecdc4', '#ffd93d'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // 画面端で跳ね返り
        if (this.x > canvas.width || this.x < 0) {
            this.speedX *= -1;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.speedY *= -1;
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}
```

**マウスインタラクション**:
```javascript
canvas.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

// パーティクルの反発処理
const dx = mouse.x - particle.x;
const dy = mouse.y - particle.y;
const distance = Math.sqrt(dx * dx + dy * dy);

if (distance < 200) {
    particle.x -= dx / distance * 2;
    particle.y -= dy / distance * 2;
}
```

**レスポンシブ調整**:
```javascript
function resize() {
    canvas.width = heroSection.offsetWidth;
    canvas.height = heroSection.offsetHeight;

    const particleCount = window.innerWidth < 768 ? 20 : 60;
    particlesArray.length = 0;

    for (let i = 0; i < particleCount; i++) {
        particlesArray.push(new Particle(canvas));
    }
}

window.addEventListener('resize', debounce(resize, 200));
```

---

## デプロイメント

### ホスティング環境

**プラットフォーム**: Vercel
**URL**: `https://fun-ex.vercel.app`（推定）
**SSL**: 自動設定（Let's Encrypt）

### Vercel設定（vercel.json）

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

**セキュリティヘッダー**:
- `X-Content-Type-Options: nosniff` - MIMEスニッフィング防止
- `X-Frame-Options: DENY` - クリックジャッキング防止
- `X-XSS-Protection: 1; mode=block` - XSS保護

**キャッシング戦略**:
- アセット（images, CSS, JS）: 1年間キャッシュ（immutable）

### デプロイフロー

1. **開発環境**: ローカルでHTML/CSS/JS編集
2. **バージョン管理**: Gitにコミット
3. **リモートプッシュ**: GitHubにプッシュ
4. **自動デプロイ**: Vercelが自動検知してデプロイ
5. **プレビュー**: プルリクエストごとにプレビューURL生成
6. **本番反映**: mainブランチへのマージで本番環境更新

---

## 今後の拡張予定

### 1. お問い合わせフォームの実装（予定）

**現状**: Google Formsへのリダイレクト
**目標**: 自社フォームの実装

**実装案**:

#### オプションA: サーバーレス（推奨）
- **技術**: Vercel Serverless Functions + Resend/SendGrid
- **メリット**: サーバー管理不要、スケーラブル
- **実装**:
  ```javascript
  // api/contact.js
  export default async function handler(req, res) {
      if (req.method === 'POST') {
          const { name, email, message } = req.body;

          // メール送信処理
          await sendEmail({ name, email, message });

          return res.status(200).json({ success: true });
      }
  }
  ```

#### オプションB: バックエンドサーバー
- **技術**: Node.js + Express + Nodemailer
- **メリット**: フル機能、データベース連携可能
- **デメリット**: サーバー管理が必要

**必須機能**:
- [ ] フォームバリデーション（クライアント + サーバー）
- [ ] reCAPTCHA v3（スパム対策）
- [ ] メール送信（管理者宛て + 自動返信）
- [ ] エラーハンドリング
- [ ] ローディング状態表示
- [ ] 送信完了メッセージ

**セキュリティ対策**:
- CSRF対策（トークン）
- レート制限（1分間に5回まで）
- 入力値サニタイゼーション
- XSS対策

---

### 2. ニュース管理システム（検討中）

**現状**: HTMLに直接記載
**課題**: 更新のたびにHTMLを編集する必要がある

**実装案**:

#### オプションA: Headless CMS
- **推奨**: Contentful、Strapi、Sanity
- **メリット**: 管理画面、API自動生成
- **実装**:
  ```javascript
  // ニュース取得
  fetch('https://api.contentful.com/...')
      .then(res => res.json())
      .then(data => renderNews(data));
  ```

#### オプションB: JSON ファイル管理
- **技術**: `news.json` + fetch API
- **メリット**: シンプル、無料
- **デメリット**: 非技術者には編集が難しい

---

### 3. SEO強化（検討中）

**実装予定**:
- [ ] メタディスクリプション最適化
- [ ] Open Graph画像最適化
- [ ] 構造化データ追加（Article, FAQPage）
- [ ] サイトマップ自動生成
- [ ] robots.txt 最適化
- [ ] ページ速度改善（WebP、遅延読み込み）

---

### 4. アナリティクス（検討中）

**実装予定**:
- Google Analytics 4
- Google Tag Manager
- イベントトラッキング（ボタンクリック、フォーム送信）
- コンバージョン測定

---

### 5. その他の機能（検討中）

- [ ] 多言語対応（日本語/英語）
- [ ] ダークモード対応
- [ ] チャットボット（ChatGPT API連携）
- [ ] ブログ機能
- [ ] ポートフォリオギャラリー
- [ ] 採用ページ

---

## 保守・運用

### 定期メンテナンス

**月次**:
- [ ] ニュース更新
- [ ] ポートフォリオ追加
- [ ] 外部ライブラリのバージョンチェック

**四半期**:
- [ ] コンテンツレビュー
- [ ] SEOパフォーマンス分析
- [ ] アクセス解析レポート

**年次**:
- [ ] デザインリニューアル検討
- [ ] セキュリティ監査
- [ ] パフォーマンス最適化

### バックアップ

**GitHubリポジトリ**: 自動バックアップ
**Vercel**: デプロイ履歴保持

### モニタリング

**推奨ツール**:
- Vercel Analytics（デフォルト）
- Google Search Console
- Lighthouse（パフォーマンス測定）

---

## 変更履歴

| 日付 | バージョン | 変更内容 |
|------|-----------|---------|
| 2025-12-25 | 1.0 | 初版作成（プロジェクト調査完了） |

---

## 関連ドキュメント

- [SECURITY_DESIGN.md](./SECURITY_DESIGN.md) - セキュリティ設計書
- [README.md](./README.md) - プロジェクト概要（作成予定）

---

**承認者**: [承認者名]
**作成者**: Claude Code (AI Assistant)
