# Robinhood Mobile App-Feel Guide

How to make Robinhood feel like a native app on phones — page by page, pixel by
pixel. Based on 2026 best practices (Apple HIG, Material 3, Baymard/NNG
research) and the Robinhood design system (`DESIGN_SYSTEM.md`).

---

## Part 1 — Foundations (apply once, globally)

### 1.1 Viewport & safe areas

- Add `viewport-fit=cover` so the app draws edge-to-edge behind the iPhone
  notch and home indicator (in `app/layout.tsx` via the `viewport` export:
  `{ width: "device-width", initialScale: 1, viewportFit: "cover" }`).
- Pad every fixed bottom element with `padding-bottom: env(safe-area-inset-bottom)`.
- `themeColor: #020617` (already set) tints the browser chrome dark navy.
- Use `min-h-dvh` (dynamic viewport height) instead of `min-h-screen` anywhere
  full height matters — `100vh` jumps when the Safari toolbar collapses.

### 1.2 Bottom tab bar (the core app-feel change)

Replace the current hamburger-only mobile nav with a fixed bottom tab bar:

| Spec | Value |
|---|---|
| Height | 64px + `env(safe-area-inset-bottom)` |
| Items | exactly 5: Home, Gold Rush, Vault, Academy, More |
| Item layout | icon 24×24px on top, 11px semibold label below, 2px gap |
| Touch target | each item ≥ 64×48px (flex-1 across the bar) |
| Background | `#020617/95` + `backdrop-blur` + top border `border-[#0ea5e9]/20` |
| Active state | icon + label in `#0ea5e9`, 3px brand-gradient bar across the top of the item, inactive = `#7dd3fc/60` |
| Feedback | instant color change on tap (`active:` styles) — NO animation delays |
| Z-index | below the video overlay (overlay is a portal at `z-[100]`; bar at `z-50`) |

The **More** tab opens a bottom sheet (slides up, drag-to-dismiss) containing:
Premium Tier (Accelerator, Recurring Streams, Social Payouts, Protector),
Your Links, Exclusive Offers, Support, Exit Platform. Sheet items are 52px
tall rows with 20px icons, 16px text, separated into the same groups as the
desktop sidebar.

Desktop keeps the existing left sidebar (`lg:` breakpoint and up). The bottom
bar renders only below `lg`. Remove the current top hamburger bar; replace it
with a slim 48px top bar showing only the logo tile (32px) + page title.

### 1.3 Content padding

- Every protected page gets `pb-24` on mobile (64px bar + breathing room) so
  the last card is never hidden behind the tab bar.
- Horizontal page padding on mobile: 16px (`px-4`), never less.
- Card internal padding on mobile: `p-4` to `p-5` (desktop keeps `p-6`/`p-8`).

### 1.4 Touch & typography rules

- All interactive elements ≥ 44×44px; primary CTAs 48–56px tall, full width.
- ≥ 8px spacing between adjacent tappable elements.
- Body text ≥ 15px on mobile; headings step down one size from desktop
  (`text-4xl lg:text-5xl` pattern already handles this).
- Inputs: 16px font minimum — iOS zooms into any input under 16px. Height ≥ 48px.
- No hover-dependent behavior: everything reachable by tap. Replace `hover:`
  reveals with always-visible or `active:` styles on mobile.

### 1.5 App-like extras

- Add a **web app manifest** (`app/manifest.ts`): name "Robinhood", display
  `standalone`, background/theme `#020617`, the new icon — lets users
  "Add to Home Screen" and launch full-screen with no browser chrome.
- `-webkit-tap-highlight-color: transparent` + custom `active:` states.
- `overscroll-behavior-y: none` on body to kill the rubber-band flash.
- Momentum scrolling for horizontal scrollers: `overflow-x-auto` +
  `snap-x snap-mandatory`, children `snap-start shrink-0`.

---

## Part 2 — Page-by-page specs

### 2.1 Dashboard (`/dashboard`)

- **Welcome**: "Home" eyebrow 12px; h1 clamps to 30px on ≤390px screens
  (`text-3xl sm:text-4xl`); lead paragraph 16px/1.6, full width.
- **Featured video card**: full-bleed style — card gets `-mx-0`, video keeps
  16:9; play button 64px (not 80) on mobile; caption 15px. CTA button full
  width, 56px tall.
- **How it works**: 3 step cards stack vertically (`grid-cols-1`), 16px gap.
  Each card: number circle 40px, title 18px, body 15px, CTA 48px full-width.
  Alternative for shorter pages: horizontal snap-scroll with 85%-width cards.
- **Quick Actions**: stack vertically, 12px gap; each card 100% width, icon
  40px, min-height 120px so all three match.
- **Support card**: stacks — icon+text row, then full-width 48px button.

### 2.2 Gold Rush (`/create`)

- **Hero**: h1 30–36px, subtitle 16px, center-aligned, 24px bottom margin.
- **Step 1 card**: fields stack with 16px gaps; every input 48–52px tall with
  16px font; textarea 96px; CTA "Find Viral Opportunities" 56px, sticky-feel
  at the card bottom.
- **Step 2 tabs**: tab bar becomes 2 equal 48px buttons; labels shorten to
  "Hot Niche" / "Search" under 360px.
- **Video result cards**: thumbnail goes full-width 16:9 on top (not side-by-
  side); stats grid stays 3-across but tiles compress to `p-2`, numbers 16px,
  labels 10px; "Generate Comments" 52px full width; external-link button
  becomes a 52×52px square beside it.
- **Generated comments**: each comment row stacks text above a right-aligned
  40px copy button; text 15px/1.5.
- **EarningsBanner**: padding drops to `px-4 py-6`; headline `text-2xl`;
  CTA full width, 52px; close button 40×40px hit area.

### 2.3 My Vault (`/pages`)

- **Header row**: title and "Generate New Pack" stack vertically; button full
  width, 52px.
- **Pack cards**: "How to Use" list 14px; stat grid switches to 2×2
  (`grid-cols-2`), tiles 72px tall; action buttons stack full width, 48px
  each, 8px gap.
- **Inline comments**: expanded list keeps 15px text, copy buttons 40px;
  expansion animates height 200ms max.

### 2.4 Your Links (`/share`)

- **Header**: badge pill wraps; h1 30px; lead 16px.
- **Add form**: fields stack, inputs 48px/16px font; Save/Cancel buttons full
  width stacked.
- **Link rows**: link text truncates with ellipsis; copy button 44×44px; the
  external-link button 44×44px; whole row `p-4`.
- **Pro tips**: 2×2 grid becomes single column, 15px text.

### 2.5 Academy (`/training`)

- **Training cards**: video-left/info-right grid collapses to video-on-top
  (`grid-cols-1`), info `p-5`; step circle 48px; titles 22px; body 15px.
- **Premium cards**: same stacking; Premium pill stays left of the feature
  pill, both 12px font.
- Thumbnails already 16:9 — they become the full card top on mobile.

### 2.6 Accelerator (`/upgrades/dfy-vault`)

- **Hero**: 💎 h1 30–36px; sub 16px.
- **Training video card**: full-width top position (already), play button 72px.
- **Select Your Product**: 2-column field grid stacks; unlock CTA 56px.
- **Filters**: search input 48px; niche buttons become a horizontal
  snap-scroll row (44px tall pills, 8px gap) instead of wrapping.
- **Video grid**: `lg:grid-cols-2` already collapses to 1 col; inside each
  card the thumbnail+info row keeps 96px-wide thumb; 5 comments each get a
  36px copy button; "Open Video" 48px full width.

### 2.7 Recurring Streams (`/upgrades/instant-income`)

- **Hero**: icon circle 72px; h1 30px; subs 16px.
- **3-step card & FB groups guide**: all step boxes stack, 15px text, keep
  colored borders.
- **Get Your Posts**: niche buttons 2-per-row grid (48px tall); DigiStore box
  15px text with 48px button; link input 52px/16px; "Show Me My Posts" 56px.
- **Post cards**: `p-5`; badges 12px; post text 15px/1.6; copy button 52px
  full width.

### 2.8 Social Payouts (`/upgrades/automated-income`)

- **Hero**: same treatment as Recurring Streams.
- **Save My Link**: input 52px; button 56px full width.
- **Niche filter**: horizontal snap-scroll pill row, 44px tall.
- **Progress tracker**: number 24px; bar height 12px.
- **Source cards**: single column; category/difficulty pills 12px;
  description box text 14px with 40px copy button; "View Instructions" 48px.
- **Instructions dialog**: becomes a full-screen sheet on mobile
  (`h-dvh`, slides up); "Go To Site" and "Mark Complete" stack full width,
  52px each; step numbers 32px circles.

### 2.9 Video overlay (all training videos)

- Backdrop stays `bg-black/60`; panel takes `w-full h-dvh` on mobile with the
  video letterboxed 16:9 at top.
- Close button 44×44px, top-right, inside safe-area top inset.
- Ad bar below video: stacks — headline 16px, "Withdraw Now" CTA full width
  48px; animations kept (they're the attention driver).

### 2.10 Auth & unlock pages

- Auth forms centered, max-width 400px, inputs 52px/16px, submit 56px.
- Unlock pages: feature list 15px; price + CTA pinned in view; CTA 56px full
  width.

---

## Part 3 — Implementation order

1. Foundations: viewport export, manifest, dvh/overscroll/tap-highlight CSS,
   `pb-24` on the protected layout. (~half a day)
2. `BottomNav` component + More sheet; hide hamburger; slim top bar. (~1 day)
3. Dashboard + Gold Rush mobile passes (highest traffic). (~1 day)
4. Vault, Links, Academy passes. (~1 day)
5. Three premium pages + overlay/dialog sheets. (~1–2 days)
6. Device QA: iPhone SE (375px), iPhone Pro Max (430px), mid-range Android
   (412px); test one-handed reach, safe areas, input zoom, scroll performance.
