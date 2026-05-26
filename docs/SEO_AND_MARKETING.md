# SEO & Marketing Checklist

Everything you need to change for SEO, branding, social previews, and analytics before shipping a production site with this boilerplate. Sections follow the order you'd encounter them in a typical launch: identity → URLs → metadata → social → search → analytics → app shell → i18n → performance → ops.

Every item lists **Where** (file path + line) and an **Acceptance** check.

---

## 1. Brand identity

### Brand name
- **Where:** `src/utils/AppConfig.ts` → `AppConfig.name`.
- **Cascades to:** page `<title>` (via `generatePageMetadata`), Open Graph `siteName`, manifest `name` + `short_name`, JSON-LD `Organization.name`, dynamic OG image text (`src/app/[locale]/opengraph-image.tsx`).
- **Acceptance:** view-source of `/` shows your brand in `<title>` and in the JSON-LD block.

### Favicons & app icons
- **Where:** replace these files in `public/`:
  - `favicon.ico`
  - `favicon-16x16.png`
  - `favicon-32x32.png`
  - `apple-touch-icon.png` (180×180)
- Icon `<link>` tags live in `src/app/[locale]/layout.tsx` (`metadata.icons`).
- PWA icon list lives in `src/app/manifest.ts`.
- **Acceptance:** favicon shows in the browser tab; iOS "Add to Home Screen" uses your icon.

### Logo
- **Component:** `src/components/logo.tsx`.
- **JSON-LD logo URL:** `src/components/json-ld.tsx` → `data.logo` (currently `${baseUrl}/apple-touch-icon.png`). For best results, ship a square ≥112×112px PNG at `public/og-logo.png` and point `logo` there.
- **Acceptance:** Google Rich Results Test shows your logo on the Organization schema.

### Theme & brand colors
- **App theme color (browser chrome):** `src/app/[locale]/layout.tsx` → `viewport.themeColor` (light/dark variants).
- **PWA splash colors:** `src/app/manifest.ts` → `theme_color`, `background_color`.
- **Design tokens (Tailwind v4):** `src/styles/global.css` — oklch CSS variables under `:root` and `.dark`.
- **Acceptance:** all three sources agree; mobile browsers tint the address bar correctly.

---

## 2. Domain & canonical URLs

- **Production URL:** set `NEXT_PUBLIC_APP_URL=https://yourdomain.com` in your hosting env (Vercel/CF Pages/etc.).
- **How it cascades:** `getBaseUrl()` in `src/utils/Helpers.ts` returns this value (or `http://localhost:3000` as fallback). Used by `metadataBase` in `src/app/[locale]/layout.tsx`, `alternates.canonical` in `src/utils/Metadata.ts`, `sitemap.ts`, `robots.ts`, and `json-ld.tsx`.
- **Acceptance:** `curl -sL https://yourdomain.com/sitemap.xml` shows your domain on every entry; same for `/robots.txt` and `<link rel="canonical">` on every page.

---

## 3. Per-page metadata (titles, descriptions)

All user-visible meta lives in `src/locales/en.json` (and any other locale file in `src/locales/`). Each page has a namespace with `meta_title` and `meta_description`:

| Page | Namespace |
|---|---|
| `/` | `Index` |
| `/about` | `About` |
| `/contact` | `Contact` |
| `/sign-in` | `SignIn` |
| `/sign-up` | `SignUp` |
| `/dashboard` | `Dashboard` |
| `/dashboard/user-profile` | `UserProfile` |

Pages call `generatePageMetadata({ locale, namespace, path })` from `src/utils/Metadata.ts` — already wired in every page's `generateMetadata` export.

### Adding a new page
1. Add a namespace + `meta_title`/`meta_description` to `src/locales/en.json` (and other locales).
2. In the new `page.tsx`, export `generateMetadata` that calls `generatePageMetadata`.
3. Add the route to `src/app/sitemap.ts` → `routes` array.

**Acceptance:** view-source on every page shows a unique `<title>`, `<meta name="description">`, and `<link rel="canonical">`.

---

## 4. Open Graph & Twitter cards

### Dynamic OG image (default)
- **Where:** `src/app/[locale]/opengraph-image.tsx` — edit JSX text and styles.
- Next.js auto-serves it at `/<locale>/opengraph-image` and references it in the metadata.

### Static OG image (optional fallback)
- **Where:** `src/utils/Metadata.ts` currently references `/assets/images/nextjs-starter-banner.png` in `openGraph.images` and `twitter.images`. Replace the file at `public/assets/images/nextjs-starter-banner.png` (1200×630px PNG/JPG) **or** drop the references entirely and rely on the dynamic OG.

**Acceptance:** paste a production URL into <https://www.opengraph.xyz> — preview shows your brand image, title, and description.

---

## 5. Structured data (JSON-LD)

### Organization schema (auto-rendered on every page)
- **Where:** `src/components/json-ld.tsx`, rendered from `<head>` in `src/app/[locale]/layout.tsx`.
- **Required edits:**
  - `sameAs: []` → add your social URLs: Twitter/X, LinkedIn, Instagram, GitHub, YouTube.
  - `logo` → square brand logo URL.
- **Optional fields** (add as your use case requires; types come from `schema-dts`):
  - `address` (`PostalAddress`)
  - `contactPoint` (`ContactPoint[]`)
  - `founder` (`Person[]`)
  - `foundingDate` (ISO 8601 date string)
  - `email`, `telephone`, `taxID`

### Per-page schemas (manual)
Extend `json-ld.tsx` with `ProductJsonLd`, `BreadcrumbJsonLd`, `ArticleJsonLd` components and render from the relevant `page.tsx`. Use `schema-dts` for type safety:

```ts
import type { Product, WithContext } from 'schema-dts';
const data: WithContext<Product> = { '@context': 'https://schema.org', '@type': 'Product', ... };
```

**Acceptance:** every page passes <https://search.google.com/test/rich-results>.

---

## 6. Search engine verification

Not configured by default. Add to `metadata` in `src/app/[locale]/layout.tsx`:

```ts
export const metadata: Metadata = {
  // ...existing config
  verification: {
    google: 'YOUR_GOOGLE_SEARCH_CONSOLE_TOKEN',
    yandex: 'YOUR_YANDEX_TOKEN',
    other: { 'msvalidate.01': 'YOUR_BING_TOKEN' },
  },
};
```

**Acceptance:** properties verified in Google Search Console, Bing Webmaster Tools, and Yandex Webmaster.

---

## 7. Robots & sitemap

### robots.txt
- **Where:** `src/app/robots.ts`. Default disallows `/dashboard`. Add other private routes as you ship them (e.g., `/admin`, `/api/internal`).

### sitemap.xml
- **Where:** `src/app/sitemap.ts` → `routes` array.
- For **static** marketing routes, add the path string.
- For **dynamic** content (blog posts, products), fetch slugs inside the `sitemap()` function and concatenate.
- Multi-locale alternates are auto-generated from `routing.locales`.

**Acceptance:** `/sitemap.xml` lists every public page in every locale; `/robots.txt` blocks every private route.

---

## 8. Analytics & observability

### Google Analytics 4
- **Env:** `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX`.
- Auto-wired by `src/components/GoogleAnalytics.tsx` (renders nothing if unset).
- Web Vitals are auto-forwarded via `src/components/web-vitals.tsx`.

### Sensitive-route blocklist
- **Where:** `src/libs/Analytics.ts` → `SENSITIVE_PATH_RE`. Currently matches `/dashboard` and `/user-profile`.
- All event tracking goes through `trackEvent(name, params)` from this file — events on matching paths are silently dropped, so they never reach ad networks.
- Extend the regex with your private routes (e.g., `/admin`, `/account/billing`).

### Sentry
- **Env:** `NEXT_PUBLIC_SENTRY_DSN` (or set `NEXT_PUBLIC_SENTRY_DISABLED=1` to turn off).
- **CI for source maps:** `SENTRY_ORGANIZATION`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN`.
- Configured in `src/instrumentation.ts`, `src/instrumentation-client.ts`, and `next.config.ts` (`withSentryConfig`).

### Better Stack logs (optional)
- **Env:** `NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN`, `NEXT_PUBLIC_BETTER_STACK_INGESTING_HOST`.
- Wired through `src/libs/Logger.ts` (LogTape).

**Acceptance:** GA realtime shows a hit on first visit; no GA hit when navigating to `/dashboard`. Sentry receives a test error. Better Stack receives a log line.

---

## 9. PWA manifest

`src/app/manifest.ts`:
- `description` is boilerplate text — replace.
- `theme_color` / `background_color` — match brand.
- `icons` — ensure files exist in `public/`.
- Optional: add `screenshots`, `shortcuts`, `categories` for richer Install UI.

**Acceptance:** Chrome DevTools → Application → Manifest shows your branding with no warnings.

---

## 10. i18n & locales

- **Locales array:** `src/utils/AppConfig.ts` → `i18n.locales`.
- **Default locale:** `src/utils/AppConfig.ts` → `i18n.defaultLocale`.
- **URL prefix strategy:** `src/utils/AppConfig.ts` → `localePrefix` (`as-needed` = default locale URLs have no prefix).
- **Clerk localizations:** when adding a new locale, also register a Clerk localization in `src/utils/AppConfig.ts` (`ClerkLocalizations.supportedLocales`).
- **Translation files:** `src/locales/<code>.json` per locale.
- **Crowdin sync** (optional): configure `crowdin.yml` and add `CROWDIN_PROJECT_ID` + `CROWDIN_PERSONAL_TOKEN` to GitHub Actions secrets.
- **CI check:** `pnpm run check:i18n` flags missing translations.

**Acceptance:** every shipped locale loads without missing keys in dev console; URLs prefix correctly per `localePrefix` setting.

---

## 11. Image CDN & performance

### Allowed image hostnames
- **Where:** `next.config.ts` → `images.remotePatterns`. Add your CDN host (e.g., S3, Cloudinary, ImageKit, your own).
- Currently includes `storage.efferd.com` as an example — replace.

### Preconnect to your CDN
- **Where:** `src/app/[locale]/layout.tsx` `<head>` block — `<link rel="preconnect" href="https://storage.efferd.com" crossOrigin="" />`.
- Replace with your CDN host. Keep `crossOrigin=""` for CORS-mode image fetches.

### Image format & cache TTL
- Already configured in `next.config.ts`:
  - `formats: ['image/avif', 'image/webp']` — AVIF served when supported.
  - `minimumCacheTTL: 60 * 60 * 24 * 30` — 30 days.

### LCP hero pattern
Above-the-fold hero images should use the priority pattern. Template lives in `src/components/hero.tsx`:

```tsx
<Image
  priority
  fetchPriority="high"
  sizes="(min-width: 1280px) 1280px, 100vw"
  src="..."
  width={1280}
  height={720}
  alt="..."
/>
```

Next.js emits `<link rel="preload" as="image" fetchpriority="high">` automatically when `priority` is set. Use it on at most one image per route.

**Acceptance:** Lighthouse mobile run — LCP < 2.5s on simulated Slow 4G; DevTools Network shows your hero served as `image/avif` from `/_next/image`.

---

## 12. Email & contact form

- **Recipient:** `.env` → `FORMSUBMIT_EMAIL=you@brand.com`. Validated as an email in `src/libs/Env.ts`.
- **Endpoint:** `src/app/api/contact/route.ts`.
- **Form schema:** `src/validations/contact-form.ts` (Zod).

**Acceptance:** submitting the form delivers to your inbox.

---

## 13. Security headers & bot protection

### Headers
- **Where:** `next.config.ts` → `headers()`. Already configured:
  - HSTS preload
  - `X-Frame-Options: SAMEORIGIN`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- Tighten `Permissions-Policy` for any feature you actually use (e.g., add `payment=(self)` if accepting payments).
- Consider adding a `Content-Security-Policy` (not shipped — site-specific).

### Arcjet (rate-limit + WAF + bot detection)
- **Env:** `ARCJET_KEY` (starts with `ajkey_`). Optional — features no-op if unset.
- **Central client:** `src/libs/Arcjet.ts` (Shield WAF, characteristic = IP).
- **Bot detection rules:** `src/proxy.ts` — allows search engines / preview generators / uptime monitors. Edit the `allow` list.

**Acceptance:** Arcjet dashboard receives traffic; `securityheaders.com` grade ≥ A.

---

## 14. Env vars reference

Every env var is validated in `src/libs/Env.ts` via T3-env. Never read `process.env` directly in app code.

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | Prod | Canonical base URL |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | Clerk client |
| `CLERK_SECRET_KEY` | Yes | Clerk server |
| `FORMSUBMIT_EMAIL` | Yes | Contact form recipient |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Optional | Google Analytics 4 ID |
| `NEXT_PUBLIC_SENTRY_DSN` | Optional | Sentry browser DSN |
| `NEXT_PUBLIC_SENTRY_DISABLED` | Optional | `1` to turn off Sentry |
| `SENTRY_ORGANIZATION` | CI | Source-map upload |
| `SENTRY_PROJECT` | CI | Source-map upload |
| `SENTRY_AUTH_TOKEN` | CI | Source-map upload |
| `ARCJET_KEY` | Optional | Bot/WAF protection |
| `NEXT_PUBLIC_LOGGING_LEVEL` | Optional | LogTape level (default `info`) |
| `NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN` | Optional | Better Stack ingest |
| `NEXT_PUBLIC_BETTER_STACK_INGESTING_HOST` | Optional | Better Stack host |

---

## Pre-launch checklist

Copy this into your release PR description and tick each box:

```
SEO / Branding
[ ] AppConfig.name updated
[ ] Favicons replaced in public/
[ ] Logo replaced and json-ld.tsx logo URL points at it
[ ] NEXT_PUBLIC_APP_URL set in production env
[ ] OG image (dynamic or static) shows brand
[ ] json-ld.tsx sameAs[] filled with social URLs
[ ] verification tokens added to root layout metadata
[ ] robots.ts disallow list reviewed
[ ] sitemap.ts routes match shipped pages
[ ] Per-page meta_title/meta_description in src/locales/en.json
[ ] manifest.ts description/colors/icons match brand
[ ] Permissions-Policy in next.config.ts reviewed

Analytics / Privacy
[ ] NEXT_PUBLIC_GA_MEASUREMENT_ID set
[ ] SENSITIVE_PATH_RE in Analytics.ts covers private routes
[ ] Sentry DSN + source maps configured in CI

i18n
[ ] locales list final; default locale set
[ ] Every shipped locale has a complete JSON in src/locales/
[ ] Clerk localization registered for every locale

Performance
[ ] Image CDN host added to next.config.ts remotePatterns
[ ] Preconnect link in [locale]/layout.tsx points at the CDN
[ ] Above-the-fold hero uses <Image priority />
[ ] Lighthouse mobile LCP < 2.5s

Ops
[ ] FORMSUBMIT_EMAIL set
[ ] ARCJET_KEY set (or accept default bot exposure)
[ ] Arcjet allow-list in src/proxy.ts reviewed
```
