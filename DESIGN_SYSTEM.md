# Design System

Blackbox structural patterns (cards, pills, nav states, premium panels) on this app’s **slate / teal** palette. Tokens live in `app/globals.css`. Do not invent decorative pink/purple hexes or import another app’s affiliate links.

---

## 1. Color

| Token | Value | Use |
|---|---|---|
| `--ds-canvas` / `--background` | `#F8FAFC` | App canvas |
| `--ds-surface` / `--card` | `#FFFFFF` | Raised surfaces |
| `--ds-surface-sub` / sidebar | `#FFFFFF` | Sidebar / soft wells |
| `--surface-hover` | `#F1F5F9` | Ghost / subtle hover |
| `--ds-sapphire-500` | `#0D9488` | Teal CTAs, accents (class names still say sapphire) |
| `--ds-sapphire-700` / primary readable | `#0F766E` | Accent text, focus |
| `--ds-sapphire-900` | `#134E4A` | Text on teal CTAs |
| `--ds-ink` | `#040316` | Primary text |
| `--ds-ink-3` / `--ds-ink-4` | `#334155` / `#475569` | Secondary / muted |
| `--ds-line` / `--ds-line-strong` | `rgba(4,3,22,0.08/0.14)` | Borders |
| `--ds-grad-sapphire` | `#14B8A6 → #0D9488` | Primary buttons |
| `--ds-grad-ink` | navy gradient | Active nav / ink buttons |
| Semantic | `#047857` / `#A32D2D` / `#B45309` | Status + offer banners |

**Contrast**
- Dark ink on slate canvas / white cards.
- Filled teal CTAs use **white** labels.
- Borders use soft ink lines.

**Hover contract** (160ms ease)
- Primary: `--ds-grad-sapphire-hover` + teal shadow.
- Outline / secondary: `--primary-light` fill, teal border/text.
- Ghost: `--surface-hover` fill + ink text.
- Ink: `--ds-grad-ink-hover`.
- Respect `prefers-reduced-motion`: keep color changes, drop translate.

## 2. Typography

Blackbox stack: **Inter** (UI) + **Fraunces** (headings). Metrics match Blackbox.

| Class | Spec |
|---|---|
| Body | Inter 16px / 400 / line-height 1.6 |
| `.page-eyebrow` | 13px / 400 / tracking 0.12em / sapphire-700 (not uppercase) |
| `.ds-h1` | Fraunces 34px / 400 / 1.2 / -0.012em |
| `.ds-h2` | Fraunces 24px / 400 / 1.25 |
| `.ds-h3` / `.ds-h4` | Fraunces 19px / 400 / 1.3 |
| `.ds-subtitle` | 15px / 1.6 / max 60ch |

`PageHeader`: `mb-4 sm:mb-5`, inner `gap-2`, actions top-aligned on `md`.

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
- Brand color direction (slate/teal — not cream/gold)
