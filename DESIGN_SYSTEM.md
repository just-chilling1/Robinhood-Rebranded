# Robinhood Design System

Single source of truth for the Robinhood member area. Tokens live in `app/globals.css`. Keep cyan/pink brand colors — do not import another app's palette or affiliate links.

---

## 1. Color

| Token | Value | Use |
|---|---|---|
| `--background` | `#020617` | App canvas |
| `--electric-blue` / `--primary` | `#0ea5e9` | Primary accent, active nav |
| `--hot-pink` / `--secondary` | `#ec4899` | Gradient partner |
| `--cyan` | `#06b6d4` | Soft accent / support CTAs |
| `--sky-light` / `--text-soft` | `#7dd3fc` | Secondary text |
| `--text-body` | `#a5c9e8` | Long-form body |
| `--brand-gold` | `#fbbf24` | Premium tier, warnings |
| Semantic | emerald / red / amber | Status only |

**Rules**
- One accent family (cyan ↔ pink). Do not invent new decorative hexes.
- Filled/gradient CTAs use **white** text (exception: amber Free Training / Welcome offer CTAs keep dark text on light gold fills).
- `EarningsBanner`, `WelcomeOfferBanner`, and the VideoOverlay withdraw bar keep their own ad creatives.

## 2. Typography

Plus Jakarta Sans.

| Class | Use |
|---|---|
| `.page-eyebrow` | Above every h1 |
| `.ds-h1` | Page title — one per page via `PageHeader` |
| `.ds-h2` / `.ds-h3` | Section / card |
| `.ds-subtitle` | Page subtitle |

## 3. Layout

- Outer container: **`max-w-7xl mx-auto`** on every protected page.
- Dashboard: `xl:grid-cols-4` with main `col-span-3` + activity rail.
- Every page starts with `<PageHeader eyebrow title subtitle actions />`.

## 4. Media

- Thumbnails: WebP in `public/thumbnails/`, mapped in `lib/video-thumbnails.ts`.
- Always use `.thumb-scrim` under play buttons.
- Playback only in `VideoOverlay` (flex column so withdraw ad is fully visible).

## 5. Navigation

- Desktop sidebar: `--sidebar-w` 280px ↔ 76px collapsed (`html[data-sidebar]`, `localStorage` key `rh_sidebar_collapsed`). Brand name: `whitespace-nowrap`.
- Mobile: slim top bar + 5-tab `BottomNav` + More sheet. `pb-24` clearance.

## 6. Offer banners (do not mix)

| Placement | Component | Link |
|---|---|---|
| Main tools (Gold Rush / Vault / Links) | `EarningsBanner` | Convertri Free Training (unchanged) |
| Premium CTAs (Accelerator / Recurring / Social) | `WelcomeOfferBanner` | Q-LAPS JVZoo (unchanged) |
| Under videos | VideoOverlay withdraw bar | Withdraw JVZoo (unchanged) |

## 7. Do not change

- Any affiliate/offer URLs belonging to this app
- Vimeo IDs / API route logic
- Cross-app link swaps (never copy links from ProfitLoop or others)
