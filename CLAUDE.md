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
