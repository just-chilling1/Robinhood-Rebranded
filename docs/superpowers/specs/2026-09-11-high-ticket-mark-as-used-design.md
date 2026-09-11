# High-Ticket Payouts — Mark as Used

**Date:** 2026-09-11  
**Status:** Approved

## Summary

Add a per–offer-link “Mark as Used” toggle on Guaranteed High-Ticket Payouts so members can track which authority articles they have already published for each affiliate offer. State is account-wide (Supabase) and toggles on/off.

## Decisions

| Decision | Choice |
| --- | --- |
| Scope | Per offer link + article id |
| Persistence | Database (account-wide) |
| Interaction | Toggle (mark / unmark) |
| Storage | Table `high_ticket_article_usage` |
| Paste mode | Supported via `url_hash` when no Link Vault id |

## Data model

Table `public.high_ticket_article_usage`:

- `id` uuid PK
- `user_id` uuid NOT NULL → `users(id)` ON DELETE CASCADE
- `affiliate_link_id` uuid NULL → `affiliate_links(id)` ON DELETE CASCADE
- `url_hash` text NULL — SHA-256 (hex) of normalized affiliate URL for paste mode
- `article_id` integer NOT NULL — catalog article id
- `created_at` timestamptz NOT NULL DEFAULT now()

Constraints:

- Exactly one of `affiliate_link_id` or `url_hash` is set
- Unique `(user_id, affiliate_link_id, article_id)` where `affiliate_link_id` IS NOT NULL
- Unique `(user_id, url_hash, article_id)` where `url_hash` IS NOT NULL

RLS: authenticated users SELECT/INSERT/DELETE own rows only (`auth.uid() = user_id`).

## Server API

Server actions (same pattern as `affiliate-links.ts`):

- `listHighTicketArticleUsage(linkKey)` → `{ success, articleIds: number[] }`
- `toggleHighTicketArticleUsage({ articleId, affiliateLinkId? , affiliateUrl? })` → `{ success, used: boolean }`

`linkKey` resolves to either vault id or url hash from the active offer on the page.

## UI

- **Preview footer:** “Mark as Used” outline button; when used, “Used” (primary/teal). Click toggles.
- **Library cards:** small “Used” badge when the article is marked for the active offer.
- Optimistic UI; on failure, revert and show inline error.
- Disabled when no valid affiliate URL is selected.

## Out of scope

- Auto-mark on copy
- Filtering “hide used”
- Cross-feature usage tracking
