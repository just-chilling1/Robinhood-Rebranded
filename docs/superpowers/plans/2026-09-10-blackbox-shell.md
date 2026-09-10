# Blackbox Shell Port — Implementation Plan

> **For agentic workers:** Execute task-by-task. Prefer inline execution for this migration. Do not change affiliate URLs, Vimeo IDs, or API contracts.

**Goal:** Port Blackbox’s config-driven shell and visual system into Wifi Code while keeping Wifi Code features and sapphire branding.

**Architecture:** `src/config` + `src/components/layout` Shell; Wifi Code feature IDs only; gradual `src/app` move.

**Tech Stack:** Next.js App Router, React, Tailwind, existing Wifi Code DS tokens in `app/globals.css`.

## Global Constraints

- Product name: Wifi Code; palette: sapphire/sky from current `DESIGN_SYSTEM.md`.
- Affiliate URLs must remain byte-identical (Q-LAPS, CashTap, Convertri free training, withdraw JVZoo).
- Vimeo IDs and `app/api/**` contracts unchanged.
- No Blackbox feature modules.
- `tsconfig` paths: `"@/*": ["./src/*", "./*"]`.

---

### Task 1: Config layer + brand vars

**Files:**
- Create: `src/config/brand.config.ts`, `features.config.ts`, `navigation.config.ts`, `offers.config.ts`, `support.config.ts`, `onboarding-content.ts`, `faq.config.ts`, `dashboard.config.ts`, `training.config.ts`, `promos.config.ts`, `webhooks.config.ts`
- Create: `src/lib/brand-vars.ts`, `src/lib/features.ts`
- Modify: `tsconfig.json` paths; `lib/brand.ts` re-export from config

- [ ] Create Wifi Code configs (URLs copied from current components)
- [ ] Add `getBrandCssVars` + `isFeatureEnabled`
- [ ] Update tsconfig paths
- [ ] Point `lib/brand.ts` at `brand.config`
- [ ] Verify: `npx tsc --noEmit` (no new errors from config imports)

### Task 2: Wire nav + offers to config

**Files:**
- Modify: `components/app-sidebar.tsx`, `components/bottom-nav.tsx`
- Modify: `components/welcome-offer-banner.tsx`, `components/earnings-banner.tsx`, `components/video-overlay.tsx`, `components/bonus-training-card.tsx` to import URLs from config
- Modify: `lib/support.ts` to re-export from `support.config`

- [ ] Replace hardcoded `menuItems` / `tabs` / `exclusiveOffers` with config getters
- [ ] Keep UI structure identical this task
- [ ] Grep URLs before/after — identical

### Task 3: Shell chrome

**Files:**
- Create: `src/components/layout/BrandStyleProvider.tsx`, `BrandLogo.tsx` (or wrap existing), `Shell.tsx`, `AppProviders.tsx`
- Modify: `app/layout.tsx`, `app/(protected)/layout.tsx`

- [ ] Port Shell pattern (auth bypass for `/auth/*`, `/onboarding`)
- [ ] Wrap root with BrandStyleProvider + Shell for protected routes (or AppProviders globally with bypass)
- [ ] Preserve SpecialistWelcomePopupHost

### Task 4: Auth + onboarding presentation

**Files:**
- Create/adapt: `src/components/layout/AuthLayout.tsx`
- Modify: auth layout + onboarding pages to use config + AuthLayout

### Task 5: Move `app/` → `src/app/`

**Files:** physical move + path updates; verify build

### Task 6: Feature page presentation pass

Restyle protected feature pages to Blackbox structure (PageHeader, sections) without touching fetch/API logic.

---

## Verification (every task)

```bash
npx tsc --noEmit
# URL freeze:
rg -n "jvz4.com/c/3547097/442443|jvz1.com/c/3547097/443257|jvz1.com/c/3547097/442055|perpetualincome365.convertri.com" --glob '!node_modules/**' --glob '!.next/**'
```
