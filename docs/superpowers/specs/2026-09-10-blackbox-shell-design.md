# Wifi Code — Blackbox Shell + Visual System Design

**Date:** 2026-09-10  
**Status:** Approved (Approach 1; remaining sections per recommendation)

## Goal

Port Blackbox Cash’s **config-driven app shell** and **visual system** into Wifi Code. Keep Wifi Code’s **features, routes, affiliate URLs, Vimeo IDs, API contracts, and sapphire brand**. Do **not** clone Blackbox product features.

## Decisions

| Topic | Choice |
|-------|--------|
| Scope | Visual (A) + architecture (B); no feature cloning |
| Shell depth | Full Blackbox shell (`src/config`, layout Shell, BrandStyleProvider) |
| Surfaces | Entire member app: auth, onboarding, protected |
| Brand | Wifi Code sapphire / sky (not Blackbox gold/cream) |
| Approach | Port shell into `src/`; thin routes; Wifi Code features wired into config |

## Architecture

```
src/
  config/     # brand, features, navigation, offers, support, faq,
              # onboarding, dashboard, training, promos, webhooks
  components/layout/  # Shell, Sidebar, BottomNav, AuthLayout, Brand*
  lib/        # brand-vars, features helpers (plus re-exports as needed)
app/          # migrate to src/app/ when shell is stable (Phase 3)
components/   # existing feature UI; gradually adopt layout/* for chrome
lib/          # existing feature logic; thin re-exports → src/config where needed
```

- `features.config.ts` — Wifi Code feature IDs only (enabled set = current product).
- `navigation.config.ts` — sidebar + bottom nav from those IDs; **paths unchanged**.
- `brand.config.ts` — name, logo, sapphire colors → `BrandStyleProvider` / `getBrandCssVars()`.
- Protected chrome = Blackbox-style `Shell` (sidebar, mobile header, main, bottom nav).
- Feature **business logic** stays; pages get presentation/chrome updates only.

## Hard non-goals

- No Blackbox feature modules or premium APIs
- No affiliate URL / Vimeo ID / API path or contract changes
- No gold/cream Blackbox palette
- No fabricated social-proof dopamine unless Wifi Code already has an equivalent slot

## Components

| Unit | Responsibility |
|------|----------------|
| `src/config/*` | Single source of truth for brand, nav, offers, support, training copy |
| `BrandStyleProvider` | Inject brand CSS vars |
| `Shell` | Auth/public bypass; otherwise sidebar + main + bottom nav |
| `Sidebar` / `BottomNav` | Render from navigation + offers configs |
| `AuthLayout` | Auth page frame matching Blackbox structure on sapphire |
| Existing feature pages | Keep logic; restyle to DS classes (`PageHeader`, glass cards, etc.) |

## Data flow

1. Root layout → `AppProviders` → `BrandStyleProvider` → `Shell` → page.
2. Nav visibility: `isFeatureEnabled(id)` filters `navigation.config` items.
3. Exclusive offers / free training / withdraw URLs: **only** from `offers.config` / `support.config` (byte-identical to today’s Wifi Code URLs).
4. Premium list: `navigation.config` premium section mirrors current `PREMIUM_FEATURES` hrefs/labels.

## Error handling

- Missing feature flag → nav item hidden; route still reachable if bookmarked (no hard FeatureGuard unless already present).
- Config import failures → build-time (static modules).
- Auth/middleware unchanged in contract; only layout presentation may change.

## Testing

- `npx tsc --noEmit` after each phase.
- Smoke: login → onboarding → dashboard → Gold Rush → Vault → Links → Academy → each upgrade → support → mobile bottom nav / More sheet.
- Diff affiliate URLs and Vimeo IDs before/after each phase (must be identical).
- Visual check: sapphire canvas, ink active nav, exclusive offers block, auth pages.

## Phases

1. **Config + brand vars** — `src/config/*`, wire sidebar/bottom-nav/banners to configs  
2. **Shell chrome** — `AppProviders`, `Shell`, layout components; protected layout uses Shell  
3. **`src/app` move** — relocate `app/` under `src/`, update tsconfig/paths  
4. **Auth + onboarding** — AuthLayout + onboarding presentation parity  
5. **Feature page presentation** — restyle interiors to Blackbox structure (logic untouched)

## Success criteria

- Brand/nav/offers editable from `src/config` without hunting hardcoded arrays.
- UI reads as Blackbox structure on Wifi Code sapphire.
- All current Wifi Code routes and features still work.
- Zero affiliate URL / Vimeo / API contract drift.
