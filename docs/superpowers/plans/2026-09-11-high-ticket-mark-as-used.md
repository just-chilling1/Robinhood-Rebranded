# High-Ticket Mark as Used Implementation Plan

> **For agentic workers:** Implement task-by-task. Steps use checkbox syntax.

**Goal:** Persist per-offer “Mark as Used” toggles for High-Ticket authority articles and surface them in the live preview and library cards.

**Architecture:** New Supabase table + server actions; client loads usage for the active link and toggles via optimistic UI.

**Tech Stack:** Next.js server actions, Supabase RLS, existing High-Ticket client page.

## Global Constraints

- Per offer link (vault id or paste url hash)
- Toggle mark/unmark
- Account-wide DB persistence
- No auto-mark on copy

---

### Task 1: Migration + SQL script

**Files:**
- Create: `supabase/migrations/20260911140000_high_ticket_article_usage.sql`
- Create: `scripts/011_create_high_ticket_article_usage.sql` (same SQL for manual apply)

- [ ] Create table + indexes + RLS + grants matching the design spec
- [ ] Verify SQL is idempotent (`IF NOT EXISTS` / drop-policy-if-exists pattern like affiliate_links)

### Task 2: Server actions

**Files:**
- Create: `app/actions/high-ticket-article-usage.ts`
- Create: `lib/high-ticket-payouts/url-hash.ts` (+ unit test)

- [ ] `hashAffiliateUrl(url: string): string` — normalize trim + lowercase host path, sha256 hex
- [ ] `listHighTicketArticleUsage` / `toggleHighTicketArticleUsage`
- [ ] Unit test for hash stability

### Task 3: UI wiring

**Files:**
- Modify: `app/(protected)/upgrades/high-ticket-payouts/high-ticket-payouts-content.tsx`
- Modify: `app/(protected)/upgrades/high-ticket-payouts/page.tsx` if initial load needed

- [ ] Load used ids when active affiliate url / selected link changes
- [ ] Preview “Mark as Used” / “Used” toggle button
- [ ] Card “Used” badge
- [ ] Optimistic toggle with error revert

### Task 4: Verify

- [ ] Manual: mark/unmark in preview, badge on card, switch offer shows different set
- [ ] Unit tests for url-hash pass
