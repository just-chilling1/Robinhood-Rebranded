# Gold Rush Generator — Calm Layout Design

Date: 2026-09-10  
Status: Approved (user chose approach B + recommended guidance strip)

## Goal

Make `/create` (Gold Rush Generator) feel calm and simple, and fix the title typography so it matches the app’s modern UI sans vibe instead of Playfair serif.

## Scope

- Step 1 (product / affiliate form) only
- Step 2 (videos) unchanged

## Design

### Typography

- Page title: UI sans (`font-[family-name:var(--font-ui)]` or equivalent), semibold/bold — not `ds-h1` / Playfair
- Soften subtitle copy (remove “explode”)
- Keep eyebrow “Gold Rush”

### Layout

- Remove `xl:grid-cols-5` two-column layout
- Single centered column (`max-w-2xl` or `max-w-3xl`)
- Drop right-rail cards (“How it works”, “What you walk away with”)
- Quieter form card: lighter border, smaller header icon, quieter readiness chip

### Guidance

- Compact 3-step strip under the primary CTA (icon + one line each)

## Out of scope

- Global font-system changes (`--font-brand` / `ds-h1` elsewhere)
- Step 2 video search UI
- New features / copy beyond calm tone

## Self-review

- No placeholders
- No contradictions with approved approach 2
- Scope limited to one page + step 1
