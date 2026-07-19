# Robinhood Design System

The single source of truth for how Robinhood looks and feels. Derived from the
existing dashboard aesthetic: dark navy, glassmorphism cards, cyan→pink brand
gradient, gold for money/CTAs.

---

## 1. Colors

### Core palette

| Token | Hex | Usage |
|---|---|---|
| `--background` | `#020617` | App shell, sidebar |
| App canvas | `#0A0E12` + `.app-bg` gradient | Main content background |
| `--card` | `#0f172a` | Card base (under glass) |
| `--primary` / electric blue | `#0ea5e9` | Primary actions, active states, links |
| `--secondary` / hot pink | `#ec4899` | Secondary gradient stop, energy accents |
| `--accent` / cyan | `#06b6d4` | Support accent, info |
| Sky light | `#7dd3fc` | Secondary text (`--text-soft`) |
| Body blue | `#a5c9e8` | Long-form body text (`--text-body`) |
| White | `#ffffff` / `#f8fafc` | Headings, primary text |

### Money & feature accents

| Token | Hex | Usage |
|---|---|---|
| `--brand-gold` | `#fbbf24` | Money, premium tier, yellow CTAs |
| `--brand-orange` | `#f97316` | Gold gradient stop, hot CTAs |
| `--brand-violet` | `#a855f7` | Recurring Streams feature accent, play buttons |
| `--brand-emerald` | `#10b981` | Social Payouts feature accent, success |
| `--brand-red` | `#ef4444` | Warnings, urgency badges, destructive |

**Rule:** every page uses the core palette. Each premium feature may add ONE
feature accent on top (violet = Recurring Streams, emerald = Social Payouts,
gold = Accelerator/premium). Never introduce new hues (no slate-only gray
cards, no indigo, no teal-on-teal).

## 2. Gradients

| Name | Definition | Usage |
|---|---|---|
| Brand | `from-[#0ea5e9] to-[#ec4899]` | Hero CTAs, logo tile, active nav |
| Action | `from-[#0ea5e9] to-[#06b6d4]` | Standard primary buttons |
| Money | `from-[#fbbf24] to-[#f97316]` | Yellow ad/unlock CTAs, premium badges |
| Hot | `from-[#ec4899] to-[#f97316]` | High-energy CTAs (Generate New Pack) |
| Play | `from-[#a855f7] to-[#d946ef]` | Video play buttons |
| Canvas | `.app-bg` radial trio (cyan/violet/pink at ≤9% opacity) | Page background |

Hover state = reverse the gradient stops (`hover:from-X hover:to-Y` swapped).

## 3. Typography

Font: **Plus Jakarta Sans** (loaded via `next/font` in `app/layout.tsx`,
exposed as `--font-sans`). Base `html` size: 14px.

| Class | Size | Usage |
|---|---|---|
| `.ds-hero-title` | 4xl → 6xl, font-black | Feature hero headers (one per page max) |
| `.ds-page-title` | 4xl → 5xl, font-black | Page h1 |
| `.ds-section-title` | 3xl, font-black | Section h2 |
| `.ds-card-title` | 2xl, font-black | Card h3 |
| `.ds-lead` | lg → xl, `#a5c9e8` | Intro/lead paragraphs |
| `.ds-support` | base, `#7dd3fc`, semibold | Supporting/secondary text |

Weights: 900 (black) for headings/CTAs, 700–800 for labels, 400–600 for body.
Tracking: `tracking-tight` on all headings (baked into the classes).

## 4. Surfaces

| Class | Usage |
|---|---|
| `.glass` | Light glass card — nested panels, list rows |
| `.glass-strong` | Main cards & sections |
| Border emphasis | `border-2 border-[#0ea5e9]/30` default; feature accent at `/25–/40`; hover raises opacity (e.g. `hover:border-[#ec4899]/50`) |
| Radius | `rounded-xl` (inputs, buttons, nested), `rounded-2xl` (cards, sections) |

**Never** use raw `bg-gray-800/from-gray-900` panels — always glass utilities.

## 5. Glows

`glow-blue`, `glow-pink`, `glow-cyan`, `glow-purple`/`glow-violet`,
`glow-jade`, `glow-gold`, `glow-magenta` — all defined in `globals.css`.
Use at most one glow per card, tied to the feature accent.

## 6. Spacing & layout

| Token | Value |
|---|---|
| Page container | `max-w-7xl mx-auto` (all protected pages) |
| Page vertical rhythm | `space-y-8` |
| Card padding | `p-6` (standard), `p-8` (feature/hero cards) |
| Section gap in card | `space-y-4`/`space-y-6` |
| Grid gap | `gap-4` (dense), `gap-6` (cards) |
| Button heights | `h-12` (sm), `h-14` (standard), `h-16` (hero CTA) |
| Touch targets | ≥ 44px (h-11 minimum) |

Narrow reading pages (legal, articles) use `max-w-4xl`.

## 7. Animations

| Class / keyframe | Usage |
|---|---|
| `popIn` (0.55s) | Card/banner entrances |
| `fadeIn` | Subtle reveals |
| `banner-*` (blob, sheen, cta-pulse, border-glow) | EarningsBanner only |
| `ad-*` (emerald-pulse, sheen, cta-glow) | Video-overlay ad only |
| Hover transitions | `transition-all duration-200` (buttons), `duration-300` (cards) |
| Hover scale | `hover:scale-[1.02–1.04]` CTAs only, `hover:scale-110` round play buttons |

Rules: animations decorate, never block. No infinite animation on core
content, only on promos (banner/ad). Respect one sheen per surface.

## 8. Component recipes

- **Primary button:** Action gradient + `text-white font-black rounded-xl h-14` + shadow `shadow-[#0ea5e9]/25`, hover reverses gradient and raises shadow.
- **Money CTA:** Money gradient + `text-[#1a1305]` (near-black on gold) + `shadow-[#fbbf24]/40`.
- **Badge/pill:** `rounded-full px-3 py-1 text-sm font-bold` + accent `/20` bg + accent text.
- **Stat tile:** `.glass rounded-xl p-3 border-2` + accent border `/30`, icon + big number + small label.
- **Play button:** round `h-20 w-20+`, Play gradient, `border-4 border-white/20`, `hover:scale-110`.
- **Info hint:** use `InfoHint` component next to any jargon label.
