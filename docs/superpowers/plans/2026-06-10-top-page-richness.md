# トップページ「ヒーロー以降」リッチ化 実装プラン

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** トップページ（public/index.html）のヒーロー以降に、スクロールリビール・背景リズム（グレー帯＋斜め区切り）・ニュースカード化・グラデーションCTA帯を追加し、シンプルすぎる印象を解消する。

**Architecture:** 静的HTML＋CSS＋vanilla JSのまま。CSSは `style.css` 末尾に専用ブロックを追記、JSは `script.js` の既存 `DOMContentLoaded` 内に IntersectionObserver を追加、HTMLはクラス付与のみ。新スタイルは `news-home` / `contact-cta` などトップページ専用クラスでスコープし、他ページ（news.html等は同じ `.news-item` クラスを使用）への影響を防ぐ。

**Tech Stack:** 静的HTML / CSS / vanilla JS（IntersectionObserver）。ビルド不要（Next.jsのpublic配信）。

**Spec:** `docs/superpowers/specs/2026-06-10-top-page-richness-design.md`

---

## 前提・注意事項

1. **テストフレームワークなし**: 静的ページのためユニットテストは存在しない。各タスクの検証は「devサーバー＋ブラウザでの目視確認」を明示的な手順・期待結果として行う（TDDの代替）。
2. **コミットの扱い（重要）**: `public/index.html` には本件と無関係の未コミット変更（本日のMEO対応等）が既に存在する。混在コミットを避けるため:
   - `style.css` / `script.js`（クリーンな状態）→ 検証後にこの2ファイルだけコミットしてよい
   - `index.html` → **コミットしない**。実装完了後にユーザーへコミット方針を確認する
3. **既存実装の再利用（変更不要なもの）**:
   - サービスカードのホバー演出（浮き上がり＋アクセント縁＋アイコン回転）は `services-carousel.css` に実装済み
   - ボタンのホバー演出（拡大＋影）は `.btn-primary:hover` に実装済み
4. `style.css` 1089行目付近にモバイル用の `.section` パディング縮小がある。今回追記する `.services` 用パディングはファイル末尾に書くため後勝ちになる（意図どおり）。

---

### Task 1: style.css に新スタイルを追記

**Files:**
- Modify: `public/style.css`（ファイル末尾に追記のみ。既存ルールは編集しない）

- [ ] **Step 1: ファイル末尾に以下のブロックを丸ごと追記**

```css
/* ============================================================
   トップページ リッチ化（2026-06-10）
   設計書: docs/superpowers/specs/2026-06-10-top-page-richness-design.md
   - スクロールリビール（.reveal / .is-visible）
   - About 背景ブロブ
   - Services ライトグレー帯＋斜め区切り
   - News カード化（トップページ .news-home のみ）
   - Contact グラデーションCTA帯（.contact-cta）
   ============================================================ */

/* --- スクロールリビール ---
   JS有効時のみ <html> に .js-reveal が付く（script.js）。
   JS無効・reduced-motion環境では何も隠さない */
.js-reveal .reveal {
    opacity: 0;
    transform: translateY(24px);
}

.js-reveal .reveal.is-visible {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 0.7s ease, transform 0.7s ease;
}

/* --- About: ブランド3色の淡い光のブロブ --- */
.about {
    position: relative;
    overflow: hidden;
}

.about::before {
    content: '';
    position: absolute;
    inset: -120px;
    background:
        radial-gradient(circle at 82% 18%, rgba(78, 205, 196, 0.18), transparent 32%),
        radial-gradient(circle at 12% 85%, rgba(255, 107, 107, 0.14), transparent 30%),
        radial-gradient(circle at 70% 92%, rgba(255, 217, 61, 0.14), transparent 26%);
    pointer-events: none;
    animation: aboutBlobFloat 18s ease-in-out infinite alternate;
}

/* コンテンツをブロブより手前に（::beforeはpositioned要素のため必須） */
.about .container {
    position: relative;
}

@keyframes aboutBlobFloat {
    from { transform: translate3d(0, 0, 0); }
    to   { transform: translate3d(40px, -30px, 0); }
}

/* --- Services: ライトグレー帯＋斜めの区切り --- */
.services {
    position: relative;
    background: #f1f5f9;
    padding-top: 160px;
    padding-bottom: 160px;
}

/* 上端: 白い斜めウェッジ（左下がり） */
.services::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 70px;
    background: #ffffff;
    clip-path: polygon(0 0, 100% 0, 0 100%);
    pointer-events: none;
}

/* 下端: 白い斜めウェッジ（上端と逆向き） */
.services::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 70px;
    background: #ffffff;
    clip-path: polygon(0 0, 100% 100%, 0 100%);
    pointer-events: none;
}

/* --- News: トップページのみカード化（news.html には影響させない） --- */
.news-home .news-list {
    background: transparent;
    border: none;
    box-shadow: none;
    padding: 0;
}

.news-home .news-item {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-left: 4px solid #4ecdc4;
    border-radius: 14px;
    padding: 24px 28px;
    margin-bottom: 16px;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.04);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* カードごとに左バーの色を変える（ブランド系3色） */
.news-home .news-item:nth-child(2) { border-left-color: #ff6b6b; }
.news-home .news-item:nth-child(3) { border-left-color: #f5a623; }

.news-home .news-item:last-child {
    margin-bottom: 0;
}

/* 旧リスト用ホバー（translateX＋padding-left変化）を打ち消して浮き上がりに */
.news-home .news-item:hover {
    transform: translateY(-4px);
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.08);
    padding-left: 28px;
}

/* --- Contact: フルワイドのグラデーションCTA帯 --- */
.contact-cta {
    position: relative;
    overflow: hidden;
    /* 白文字のコントラスト（3:1以上）確保のため、ブランドグラデに薄い黒を重ねる */
    background:
        linear-gradient(rgba(17, 17, 17, 0.16), rgba(17, 17, 17, 0.16)),
        linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
}

/* 装飾の半透明サークル */
.contact-cta::before,
.contact-cta::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.12);
    pointer-events: none;
}

.contact-cta::before {
    width: 280px;
    height: 280px;
    top: -90px;
    left: -70px;
}

.contact-cta::after {
    width: 200px;
    height: 200px;
    bottom: -70px;
    right: -50px;
}

.contact-cta .container {
    position: relative;
}

.contact-cta .section-subtitle {
    background: rgba(255, 255, 255, 0.22);
    color: #ffffff;
}

.contact-cta .section-title {
    color: #ffffff;
}

/* index.html側のインラインstyleを外し、ここで同等指定＋白文字にする */
.contact-cta .section-desc {
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 2;
    margin-top: 20px;
    color: #ffffff;
}

/* CTA帯の上ではボタンを白反転（文字色はコントラスト4.5:1を満たす赤） */
.contact-cta .btn-primary {
    background: #ffffff;
    color: #d23f3a;
    box-shadow: 0 12px 26px rgba(0, 0, 0, 0.2);
}

.contact-cta .btn-primary:hover {
    box-shadow: 0 16px 32px rgba(0, 0, 0, 0.25);
}

/* --- アクセシビリティ: 動きを減らす設定への対応 --- */
@media (prefers-reduced-motion: reduce) {
    .js-reveal .reveal {
        opacity: 1;
        transform: none;
        transition: none;
    }

    .about::before {
        animation: none;
    }

    .news-home .news-item:hover {
        transform: none;
    }
}

/* --- モバイル調整 --- */
@media (max-width: 768px) {
    .services {
        padding-top: 110px;
        padding-bottom: 110px;
    }

    .services::before,
    .services::after {
        height: 36px;
    }

    .contact-cta .section-desc {
        font-size: 1.15rem;
    }

    .news-home .news-item {
        padding: 18px 20px;
    }

    .news-home .news-item:hover {
        padding-left: 20px;
    }
}
```

- [ ] **Step 2: CSSの構文チェック**

ブレースの対応が取れていることを確認:
Run: `node -e "const c=require('fs').readFileSync('public/style.css','utf8'); const o=(c.match(/{/g)||[]).length, x=(c.match(/}/g)||[]).length; console.log(o===x?'OK':'NG: {='+o+' }='+x)"`
Expected: `OK`

- [ ] **Step 3: コミット（style.cssのみ・クリーンなファイルのため安全）**

※ Task 2 完了後にまとめてコミットするため、ここではコミットしない。

---

### Task 2: script.js にスクロールリビール処理を追加

**Files:**
- Modify: `public/script.js`（既存 `DOMContentLoaded` リスナー内の末尾、閉じ `});` の直前に追記）

- [ ] **Step 1: `script.js` の145行目の閉じ `});` の直前（リサイズデバウンス処理の後）に以下を追記**

```javascript
    // スクロールリビール — .reveal 要素が画面に入ったらふわっと表示
    // JS無効環境では .js-reveal が付かないため、コンテンツは常に表示される
    const revealEls = document.querySelectorAll('.reveal');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (revealEls.length > 0 && 'IntersectionObserver' in window && !prefersReducedMotion) {
        document.documentElement.classList.add('js-reveal');

        // 同じセクション内の要素に 0.12s ずつの時間差をつける
        const delayCounters = new Map();
        revealEls.forEach(el => {
            const group = el.closest('.section') || document.body;
            const index = delayCounters.get(group) || 0;
            el.style.transitionDelay = `${index * 0.12}s`;
            delayCounters.set(group, index + 1);
        });

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                el.classList.add('is-visible');
                // リビール完了後はディレイを消す（カード等のホバー反応が遅れるのを防ぐ）
                el.addEventListener('transitionend', () => {
                    el.style.transitionDelay = '';
                }, { once: true });
                revealObserver.unobserve(el);
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        revealEls.forEach(el => revealObserver.observe(el));
    }
```

- [ ] **Step 2: JSの構文チェック**

Run: `node --check public/script.js`
Expected: エラーなし（終了コード0）

- [ ] **Step 3: コミット（クリーンな2ファイルのみ）**

```bash
git add public/style.css public/script.js
git commit -m "feat: トップページ用のスクロールリビール・セクション装飾スタイルを追加

スクロールリビール（IntersectionObserver）、Aboutの背景ブロブ、
Servicesのライトグレー帯＋斜め区切り、ニュースカード化（.news-home）、
お問い合わせのグラデーションCTA帯（.contact-cta）を追加。
JS無効・prefers-reduced-motion環境ではアニメーションを無効化。

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

※ `public/index.html` は本件と無関係の未コミット変更が混在しているため、絶対に `git add` しないこと。

---

### Task 3: index.html にクラスを付与

**Files:**
- Modify: `public/index.html`（クラス付与＋お問い合わせのインラインstyle 1箇所の置き換えのみ。文章・リンクは不変）

**注意:** `section-header center` と `center-btn-container` は複数箇所にあるため、編集時は必ず周辺行（subtitle等）を含めて一意に特定すること。

- [ ] **Step 1: About セクション（156〜175行目付近）**

`<span class="section-subtitle">About Us</span>` を含む `section-header` とボタンコンテナに `reveal` を付与:
- `<div class="section-header center">` → `<div class="section-header center reveal">`
- `<div class="center-btn-container" style="text-align: center; margin-top: 40px;">`（直後が「会社概要はこちら」のもの） → `class="center-btn-container reveal"`（style属性は維持）

- [ ] **Step 2: Services セクション（178〜311行目付近）**

- `<span class="section-subtitle">Our Business</span>` を含む `<div class="section-header center">` → `<div class="section-header center reveal">`
- `<div class="services-swiper swiper">` → `<div class="services-swiper swiper reveal">`
- 「詳しい事業内容はこちら」の `center-btn-container` → `class="center-btn-container reveal"`（style属性は維持）

- [ ] **Step 3: News セクション（314〜374行目付近）**

- `<section id="news" class="section news">` → `<section id="news" class="section news news-home">`
- `<span class="section-subtitle">Latest Information</span>` を含む `section-header` → `reveal` 付与
- 3つの `<article class="news-item">` → すべて `<article class="news-item reveal">`
- 「過去のニュースはこちら」の `center-btn-container` → `reveal` 付与

- [ ] **Step 4: Contact セクション（377〜392行目付近）**

- `<section id="contact" class="section contact">` → `<section id="contact" class="section contact contact-cta">`
- `<span class="section-subtitle">Contact Us</span>` を含む `section-header` → `reveal` 付与
- お問い合わせの `section-desc` のインラインstyleを削除（CSS側で同等指定済みのため）:

変更前:
```html
<p class="section-desc" style="font-size: 1.5rem; font-weight: 700; color: var(--text-main); line-height: 2; margin-top: 20px;">
    Z世代・α世代への伝え方や、体験づくりに悩んでいませんか。<br>
    まずはお気軽にご相談ください。
</p>
```

変更後:
```html
<p class="section-desc">
    Z世代・α世代への伝え方や、体験づくりに悩んでいませんか。<br>
    まずはお気軽にご相談ください。
</p>
```

- 「まずは相談する」の `center-btn-container` → `reveal` 付与

- [ ] **Step 5: 変更内容の確認（クラス付与だけであること）**

Run: `git diff public/index.html -- | grep "^[+-]" | grep -v "^[+-][+-]" | head -60`
で本日のMEO等の既存差分に加え、今回の差分が「class属性の変更＋contact descのstyle削除」だけであることを目視確認。

※ このファイルはコミットしない（前提・注意事項2を参照）。

---

### Task 4: ブラウザ検証

**Files:** なし（検証のみ）

- [ ] **Step 1: devサーバー起動**

Run: `npm run dev`（port 3000 が使用中なら 3001 になる）
Expected: `✓ Ready` 表示

- [ ] **Step 2: 通常表示の確認（Chrome、デスクトップ幅）**

`http://localhost:3000/` を開き、上から下までスクロールして確認:
- About: 見出し→本文→ボタンが時間差でふわっと出現。背景に淡い3色のブロブがゆっくり漂う
- Services: ライトグレー帯になっており、上下の境界が斜め。白いサービスカードが帯に映える
- News: 3件が左アクセントバー付きカード（ティール/コーラル/アンバー）。ホバーで浮き上がる
- Contact: コーラル系グラデーションのフルワイド帯。白文字＋白ボタン（赤文字）
- 文章・リンク・カルーセル挙動が変更前と同一であること

- [ ] **Step 3: アクセシビリティ確認**

- DevTools → Rendering → `prefers-reduced-motion: reduce` をエミュレート → リロード後、全コンテンツが最初から表示され、ブロブが動かないこと
- DevTools → Settings → Debugger → Disable JavaScript → リロード後、全コンテンツが普通に見えること（隠れた要素ゼロ）

- [ ] **Step 4: モバイル幅確認（375px）**

- 斜め区切りが薄く（36px）なり、カルーセル（Swiper）が正常動作すること
- ニュースカード・CTA帯が崩れないこと

- [ ] **Step 5: プロダクションビルド確認**

Run: `npm run build`
Expected: ビルド成功（静的ファイル変更のみのため失敗しないはずだが念のため）

---

## 完了後

1. ユーザーに実画面の確認を依頼
2. `index.html` のコミット方針を確認（既存のMEO等の未コミット変更と分けるか、まとめるか）
3. CLAUDE.md の対応履歴に1エントリ追記（ユーザー確認後）
