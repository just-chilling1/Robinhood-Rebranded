# Gold Rush Calm Layout Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Calm, single-column Gold Rush step-1 form with UI-sans title and compact how-it-works strip.

**Architecture:** Edit `app/(protected)/create/page.tsx` only. Override `PageHeader` title styling via className / custom title node; collapse layout to one column; move guidance under CTA.

**Tech Stack:** Next.js client page, existing Card/Button/Input, Lucide icons, `cn` utility.

---

### Task 1: Header typography + calmer copy

**Files:** `app/(protected)/create/page.tsx`

- Pass a sans title (not relying on `ds-h1` Playfair) via PageHeader `className` and/or wrapping title
- Soften subtitle

### Task 2: Single-column form + strip

**Files:** `app/(protected)/create/page.tsx`

- Remove aside cards and grid
- Center form in `max-w-2xl`/`max-w-3xl`
- Quiet card chrome
- Add 3-step strip under CTA

### Task 3: Visual check

- Load `/create` and confirm step 1 is single-column, sans title, side cards gone; step 2 untouched
