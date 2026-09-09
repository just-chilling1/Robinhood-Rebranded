# Design System

Blackbox structural patterns (cards, pills, nav states, premium panels) on this app’s **sapphire / sky** palette. Tokens live in `app/globals.css`. Do not invent decorative pink/purple hexes or import another app’s affiliate links.

---

## 1. Color

| Token | Value | Use |
|---|---|---|
| `--ds-canvas` / `--background` | `#d9e4f2` | App canvas |
| `--ds-surface` / `--card` | `#ffffff` | Raised surfaces |
| `--surface-nested` / `--muted` | `#e8f0fa` | Nested wells |
| `--surface-hover` | `#dbeafe` | Ghost / subtle hover fill |
| `--ds-sapphire-500` / `--primary` | `#2563eb` | CTAs, accents |
| `--primary-hover` / `--ds-sapphire-700` | `#1d4ed8` | Hover fill, readable accent text, focus |
| `--ds-sapphire-200` | `#dbeafe` | Soft wells / chips |
| `--ds-ink` | `#0f172a` | Primary text |
| `--ds-ink-3` | `#334155` | Secondary / muted |
| `--ds-line` / `--ds-line-strong` | `#94a8c2` / `#64748b` | Borders |
| `--ds-grad-sapphire` | `#60a5fa → #2563eb` | Primary buttons |
| `--ds-grad-sapphire-hover` | `#3b82f6 → #1d4ed8` | Primary button hover |
| `--ds-grad-ink` | navy→ink gradient | Active nav / ink buttons |
| Semantic | emerald / red / amber | Status + offer banners only |

**Contrast**
- Dark slate text on tinted sky canvas / white cards.
- Filled sapphire CTAs use **white** labels.
- Borders use `--ds-line` / `--ds-line-sapphire`.

**Hover contract** (160ms ease, 1px lift, no brightness-only tricks)
- Primary: `--ds-grad-sapphire-hover` + stronger sapphire shadow.
- Outline / secondary: `--primary-light` fill, `--primary` border, `--ds-sapphire-700` text.
- Ghost: `--surface-hover` fill + ink text.
- Ink: `--ds-grad-ink-hover` + 1px lift.
- Respect `prefers-reduced-motion`: keep color changes, drop translate.

## 2. Typography

Plus Jakarta Sans (UI + headings).

| Class | Use |
|---|---|
| `.page-eyebrow` | Above every h1 |
| `.ds-h1` | Page title — one per page via `PageHeader` |
| `.ds-h2` / `.ds-h3` | Section / card |
| `.ds-subtitle` | Page subtitle |

## 3. Components (Blackbox-shaped)

| Class | Use |
|---|---|
| `.btn-primary` / Button default | Pill sapphire gradient CTA |
| `.btn-secondary` / Button outline | Pill outlined |
| `.btn-ink` / Button `ink` | Dark gradient CTA |
| `.glass-card` / `.page-section-card` | Surface + line + card shadow |
| `.sidebar-nav-item.is-active` | Ink gradient active nav |
| `.premium-nav-section` | Soft sapphire premium panel |
| `.exclusive-offers-nav-*` | Green exclusive offers block |
| `.input-base` / Input | 48px field, sapphire focus ring |

## 4. Layout

- Outer container: **`max-w-7xl mx-auto`** on every protected page.
- Dashboard: `xl:grid-cols-4` with main `col-span-3` + activity rail.
- Every page starts with `<PageHeader eyebrow title subtitle actions />`.

## 5. Media

- Thumbnails: WebP in `public/thumbnails/`, mapped in `lib/video-thumbnails.ts`.
- Always use `.thumb-scrim` under play buttons.
- Playback only in `VideoOverlay`.

## 6. Navigation

- Desktop sidebar: `--sidebar-w` 280px ↔ 76px collapsed (`html[data-sidebar]`, `localStorage` key `rh_sidebar_collapsed`).
- Mobile: slim top bar + 5-tab `BottomNav` + More sheet. `pb-24` clearance.

## 7. Offer banners (do not mix)

| Placement | Component | Link |
|---|---|---|
| Main tools (Gold Rush / Vault / Links) | `EarningsBanner` | Convertri Free Training (unchanged) |
| Premium CTAs (Accelerator / Recurring / Social) | `WelcomeOfferBanner` | Q-LAPS JVZoo (unchanged) |
| Under videos | VideoOverlay withdraw bar | Withdraw JVZoo (unchanged) |

## 8. Do not change

- Any affiliate/offer URLs belonging to this app
- Vimeo IDs / API route logic
- Cross-app link swaps
- Brand color direction (sapphire/sky — not Blackbox cream/brass)
