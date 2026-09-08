# Done-For-You Profit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a premium page at `/upgrades/dfy-profit` where pasting an affiliate link and picking a niche produces, in one run, 5 videos to comment on with AI comments, a publicly hosted authority article, and 3 Facebook posts promoting that article.

**Architecture:** A server page renders a client orchestrator that calls three sequential API route handlers (`videos`, `article`, `posts`), each with its own `maxDuration = 120` and its own retry. Shared generation logic lives in a new `lib/dfy-profit/` module. The article persists into the existing `pages` table and is served by the existing `/article/[slug]` route, which gains a branch for HTML articles alongside today's comment packs. No database migration.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Supabase (`@supabase/ssr`), Tailwind v4, lucide-react, RapidAPI `chatgpt-42` for AI, Vitest for unit tests.

**Spec:** [docs/superpowers/specs/2026-09-08-done-for-you-profit-design.md](../specs/2026-09-08-done-for-you-profit-design.md)

**Reference implementation:** the sibling app at `D:\Apps\blackboxcash`, feature `src/features/dfy-profit/`. Read it for the staged-orchestration pattern, but do not copy its styling — it uses a brass/cream palette, this app uses sapphire.

## Global Constraints

- User-facing name is exactly **Done-For-You Profit**. Never write "DFY Vault" or "Accelerator" in user-facing copy; `training-video-system/wifi-code/00-setup.md` line 36 retires those in favour of "Unlimited".
- Route is `/upgrades/dfy-profit`; registry key is `dfyProfit`.
- Do **not** modify `users.upgrade_level`, its CHECK constraint, the `UpgradeLevel` type, `UPGRADE_LEVEL_LABELS`, `app/actions/unlock-upgrade.ts`, or add any `/unlock/*` route. This feature is a premium page, not a purchasable tier.
- No new Supabase tables and no migrations. The `pages.niche_id NOT NULL` constraint is satisfied with the existing get-or-create pattern.
- No new environment variables. AI uses the existing `RAPIDAPI_KEY` and `RAPIDAPI_HOST` (default host `chatgpt-42.p.rapidapi.com`).
- Every AI call must have a non-AI fallback. The whole feature must produce a usable kit with `RAPIDAPI_KEY` unset.
- Styling follows `DESIGN_SYSTEM.md`: sapphire accent only (`--ds-sapphire-500` / `#2563EB`), flat cards, no hover lift, font weight 500–600, never `font-black`. Gold is reserved for the `EarningsBanner` Free Training CTA and must not appear here.
- Premium pages use `WelcomeOfferBanner`, never `EarningsBanner`. Get it by passing `offer="welcome"` to `GenerationProgress`.
- Every protected page is wrapped in `max-w-7xl mx-auto` and opens with `<PageHeader eyebrow title subtitle />`.
- Do not change affiliate/offer URLs, Vimeo IDs, or any existing product flow.
- Do not touch `app/(protected)/upgrades/instant-income/instant-income-content.tsx`. Facebook fallback copy is re-seeded into the new module instead.

## File Structure

**Create — `lib/dfy-profit/` (pure logic and generation):**

| File | Responsibility |
|---|---|
| `types.ts` | Shared result types for all three stages |
| `slug.ts` | Title-to-slug conversion with a random suffix |
| `weave-affiliate-links.ts` | Inject `a.affiliate-link` anchors and a footer CTA into article HTML |
| `ai.ts` | RapidAPI `gpt4o` calls, JSON extraction, retry and repair |
| `prompts.ts` | Article prompts plus `normalizeArticleContent`; Facebook post prompt |
| `article-fallback.ts` | Template authority article when AI is unavailable |
| `posts-fallback.ts` | Niche-keyed Facebook post templates |
| `scrape-offer-context.ts` | Read `<title>` and meta description from the affiliate URL |
| `generate-video-comments.ts` | Non-persisting AI comment generation for one video |

**Create — routes and UI:**

| File | Responsibility |
|---|---|
| `app/api/premium/dfy-profit/videos/route.ts` | Stage 1 |
| `app/api/premium/dfy-profit/article/route.ts` | Stage 2 |
| `app/api/premium/dfy-profit/posts/route.ts` | Stage 3 |
| `app/(protected)/upgrades/dfy-profit/page.tsx` | Server page, auth, metadata |
| `app/(protected)/upgrades/dfy-profit/DfyProfitClient.tsx` | Staged orchestration and inputs |
| `app/(protected)/upgrades/dfy-profit/DfyResultPanel.tsx` | Three result sections with copy and retry |

**Modify:**

| File | Change |
|---|---|
| `app/actions/generate-viral-comments.ts` | Delegate comment generation to the new shared module; persistence unchanged |
| `app/article/[slug]/page.tsx` | Look up by slug then id; branch between comment pack and HTML article |
| `lib/premium-features.ts` | Add the `dfyProfit` label and a `PREMIUM_FEATURES` entry |
| `app/(protected)/upgrades/page.tsx` | Add a 5th card; grid `xl:grid-cols-4` becomes `xl:grid-cols-5` |
| `package.json` | Add Vitest and a `test` script |

**Do not create** a `layout.tsx` for this route. `app/(protected)/upgrades/layout.tsx` already wraps all `/upgrades/*` in `TypographySurface surface="marketing"`.

---

### Task 1: Test infrastructure and slug generation

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `lib/dfy-profit/slug.ts`
- Test: `lib/dfy-profit/slug.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces: `buildArticleSlug(title: string, randomSuffix?: () => string): string`

- [ ] **Step 1: Install Vitest**

```bash
npm install -D vitest@^2
```

- [ ] **Step 2: Add the test script to `package.json`**

In the `"scripts"` block, add `"test": "vitest run"` and `"test:watch": "vitest"`, keeping the existing `build`, `dev`, `lint`, `start` entries.

- [ ] **Step 3: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config"
import path from "node:path"

export default defineConfig({
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts", "app/**/*.test.ts"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, ".") },
  },
})
```

- [ ] **Step 4: Write the failing test**

Create `lib/dfy-profit/slug.test.ts`:

```ts
import { describe, expect, it } from "vitest"
import { buildArticleSlug } from "./slug"

describe("buildArticleSlug", () => {
  const suffix = () => "ab12cd"

  it("lowercases and hyphenates a title", () => {
    expect(buildArticleSlug("The Ultimate Keto Guide", suffix)).toBe("the-ultimate-keto-guide-ab12cd")
  })

  it("strips punctuation and collapses separators", () => {
    expect(buildArticleSlug("Weight Loss: What *Actually* Works!!", suffix)).toBe(
      "weight-loss-what-actually-works-ab12cd",
    )
  })

  it("trims leading and trailing hyphens", () => {
    expect(buildArticleSlug("  --Hello--  ", suffix)).toBe("hello-ab12cd")
  })

  it("truncates a very long title to 60 characters before the suffix", () => {
    const slug = buildArticleSlug("a".repeat(200), suffix)
    expect(slug).toBe(`${"a".repeat(60)}-ab12cd`)
  })

  it("falls back to a default stem when the title has no usable characters", () => {
    expect(buildArticleSlug("!!!", suffix)).toBe("authority-article-ab12cd")
  })

  it("produces a different suffix on each call by default", () => {
    expect(buildArticleSlug("Same Title")).not.toBe(buildArticleSlug("Same Title"))
  })
})
```

- [ ] **Step 5: Run the test to verify it fails**

Run: `npm test -- lib/dfy-profit/slug.test.ts`
Expected: FAIL — cannot resolve `./slug`.

- [ ] **Step 6: Implement `lib/dfy-profit/slug.ts`**

```ts
const MAX_STEM_LENGTH = 60

function defaultSuffix(): string {
  return Math.random().toString(36).slice(2, 8)
}

/**
 * Build a URL slug for a generated article.
 * `pages.slug` is UNIQUE, so a random suffix keeps repeat runs of the same
 * title from colliding.
 */
export function buildArticleSlug(title: string, randomSuffix: () => string = defaultSuffix): string {
  const stem = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, MAX_STEM_LENGTH)
    .replace(/-+$/g, "")

  return `${stem || "authority-article"}-${randomSuffix()}`
}
```

- [ ] **Step 7: Run the test to verify it passes**

Run: `npm test -- lib/dfy-profit/slug.test.ts`
Expected: PASS, 6 tests.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json vitest.config.ts lib/dfy-profit/slug.ts lib/dfy-profit/slug.test.ts
git commit -m "feat(dfy-profit): add vitest and article slug generation"
```

---

### Task 2: Shared types and affiliate link weaving

**Files:**
- Create: `lib/dfy-profit/types.ts`
- Create: `lib/dfy-profit/weave-affiliate-links.ts`
- Test: `lib/dfy-profit/weave-affiliate-links.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `DfyVideoResult { videoId, title, channelTitle, thumbnailUrl, viewCount, videoUrl, comments: string[], usedFallbackComments: boolean }`
  - `DfyArticleResult { id: string | null, slug: string | null, url: string | null, title: string, excerpt: string, html: string, saveWarning?: string }`
  - `DfyFacebookPost { id: string, body: string }`
  - `GeneratedArticleContent { title: string, excerpt: string, html: string }`
  - `weaveAffiliateLinks(html: string, affiliateUrl: string, ctaLabel?: string): string`

- [ ] **Step 1: Create `lib/dfy-profit/types.ts`**

```ts
export interface DfyVideoResult {
  videoId: string
  title: string
  channelTitle: string
  thumbnailUrl: string
  viewCount: number
  videoUrl: string
  comments: string[]
  usedFallbackComments: boolean
}

export interface DfyArticleResult {
  id: string | null
  slug: string | null
  url: string | null
  title: string
  excerpt: string
  html: string
  saveWarning?: string
}

export interface DfyFacebookPost {
  id: string
  body: string
}

export interface GeneratedArticleContent {
  title: string
  excerpt: string
  html: string
}
```

- [ ] **Step 2: Write the failing test**

Create `lib/dfy-profit/weave-affiliate-links.test.ts`:

```ts
import { describe, expect, it } from "vitest"
import { weaveAffiliateLinks } from "./weave-affiliate-links"

const URL = "https://example.com/offer?id=42"

describe("weaveAffiliateLinks", () => {
  it("appends a footer CTA carrying the affiliate class and url", () => {
    const out = weaveAffiliateLinks("<p>One</p>", URL)
    expect(out).toContain('class="affiliate-link"')
    expect(out).toContain(`href="${URL}"`)
    expect(out).toContain("Check Today's Price")
  })

  it("replaces [LINK] placeholders with a tracked anchor", () => {
    const out = weaveAffiliateLinks("<p>See it here: [LINK]</p>", URL)
    expect(out).not.toContain("[LINK]")
    expect(out.match(/class="affiliate-link"/g)).toHaveLength(2)
  })

  it("inserts an inline recommendation after the first h2 when there is no placeholder", () => {
    const out = weaveAffiliateLinks("<h2>Why</h2><p>Body</p>", URL)
    const afterHeading = out.slice(out.indexOf("</h2>"))
    expect(afterHeading).toContain('class="affiliate-link"')
  })

  it("escapes double quotes in the url so the attribute cannot break out", () => {
    const out = weaveAffiliateLinks("<p>x</p>", 'https://e.com/"onmouseover=alert(1)')
    expect(out).not.toContain('"onmouseover=alert(1)')
    expect(out).toContain("&quot;onmouseover=alert(1)")
  })

  it("returns the html unchanged apart from nothing added when the url is blank", () => {
    expect(weaveAffiliateLinks("<p>x</p>", "  ")).toBe("<p>x</p>")
  })

  it("does not double-weave html that already contains an affiliate anchor", () => {
    const once = weaveAffiliateLinks("<h2>Why</h2><p>Body</p>", URL)
    const twice = weaveAffiliateLinks(once, URL)
    expect(twice).toBe(once)
  })
})
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npm test -- lib/dfy-profit/weave-affiliate-links.test.ts`
Expected: FAIL — cannot resolve `./weave-affiliate-links`.

- [ ] **Step 4: Implement `lib/dfy-profit/weave-affiliate-links.ts`**

The `affiliate-link` class is required: `app/article/[slug]/article-content.tsx` line 39 binds click tracking to `a.affiliate-link` and posts to `/api/track-click`.

```ts
const CTA_LABEL = "Check Today's Price"

function escapeAttribute(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

function anchor(href: string, label: string): string {
  return `<a class="affiliate-link" href="${href}" target="_blank" rel="noopener sponsored">${label}</a>`
}

/**
 * Weave the user's affiliate link into generated article HTML.
 * Idempotent: html that already contains an affiliate anchor is returned as-is,
 * so re-running a stage cannot stack duplicate CTAs.
 */
export function weaveAffiliateLinks(html: string, affiliateUrl: string, ctaLabel: string = CTA_LABEL): string {
  const url = affiliateUrl.trim()
  if (!url) return html
  if (html.includes('class="affiliate-link"')) return html

  const href = escapeAttribute(url)
  let body = html

  if (body.includes("[LINK]")) {
    body = body.split("[LINK]").join(anchor(href, "see the details here"))
  } else {
    const headingEnd = body.indexOf("</h2>")
    const recommendation = `<p>Here is the exact resource referenced above: ${anchor(href, "see the details here")}.</p>`
    body =
      headingEnd === -1
        ? `${recommendation}${body}`
        : `${body.slice(0, headingEnd + 5)}${recommendation}${body.slice(headingEnd + 5)}`
  }

  const cta = `<p class="article-cta">${anchor(href, ctaLabel)}</p>`
  return `${body}${cta}`
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm test -- lib/dfy-profit/weave-affiliate-links.test.ts`
Expected: PASS, 6 tests.

- [ ] **Step 6: Commit**

```bash
git add lib/dfy-profit/types.ts lib/dfy-profit/weave-affiliate-links.ts lib/dfy-profit/weave-affiliate-links.test.ts
git commit -m "feat(dfy-profit): add shared types and affiliate link weaving"
```

---

### Task 3: AI client with JSON extraction

**Files:**
- Create: `lib/dfy-profit/ai.ts`
- Test: `lib/dfy-profit/ai.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `isAiConfigured(): boolean`
  - `extractJsonFromText(text: string): unknown`
  - `generateText(prompt: string, options?: AiCallOptions): Promise<string>`
  - `generateStructuredJson<T>(args: { prompt: string; validate: (raw: unknown) => T | null; options?: AiCallOptions }): Promise<T>`
  - `AiCallOptions { maxRetries?: number; timeoutMs?: number }`

The request shape must match what already works in this app (`app/actions/generate-viral-comments.ts` lines 61–76): `POST https://${RAPIDAPI_HOST}/gpt4o` with headers `x-rapidapi-key` / `x-rapidapi-host` and body `{ messages, web_access: false }`. Do not adopt blackbox's `/chatgpt` endpoint with `system_prompt`; it is unverified here.

- [ ] **Step 1: Write the failing test**

Create `lib/dfy-profit/ai.test.ts`:

```ts
import { describe, expect, it } from "vitest"
import { extractJsonFromText } from "./ai"

describe("extractJsonFromText", () => {
  it("parses a bare object", () => {
    expect(extractJsonFromText('{"a":1}')).toEqual({ a: 1 })
  })

  it("parses a fenced json block", () => {
    expect(extractJsonFromText('```json\n{"a":2}\n```')).toEqual({ a: 2 })
  })

  it("parses an object embedded in prose", () => {
    expect(extractJsonFromText('Sure! Here you go: {"a":3} Hope that helps.')).toEqual({ a: 3 })
  })

  it("parses a bare array", () => {
    expect(extractJsonFromText("[1,2,3]")).toEqual([1, 2, 3])
  })

  it("returns null for unparseable text", () => {
    expect(extractJsonFromText("no json here")).toBeNull()
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- lib/dfy-profit/ai.test.ts`
Expected: FAIL — cannot resolve `./ai`.

- [ ] **Step 3: Implement `lib/dfy-profit/ai.ts`**

```ts
const DEFAULT_TIMEOUT_MS = 42_000

export interface AiCallOptions {
  maxRetries?: number
  timeoutMs?: number
}

interface ChatResponse {
  result?: string
  message?: string | { content?: string }
  response?: string
  choices?: { message?: { content?: string } }[]
}

function rapidApiKey(): string {
  return process.env.RAPIDAPI_KEY?.trim() || ""
}

function rapidApiHost(): string {
  return process.env.RAPIDAPI_HOST?.trim() || "chatgpt-42.p.rapidapi.com"
}

export function isAiConfigured(): boolean {
  return rapidApiKey().length > 0
}

export function extractJsonFromText(text: string): unknown {
  const trimmed = text.trim()

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const candidates: string[] = []
  if (fenced?.[1]) candidates.push(fenced[1].trim())

  const objStart = trimmed.indexOf("{")
  const objEnd = trimmed.lastIndexOf("}")
  if (objStart !== -1 && objEnd > objStart) candidates.push(trimmed.slice(objStart, objEnd + 1))

  const arrStart = trimmed.indexOf("[")
  const arrEnd = trimmed.lastIndexOf("]")
  if (arrStart !== -1 && arrEnd > arrStart) candidates.push(trimmed.slice(arrStart, arrEnd + 1))

  for (const candidate of candidates) {
    try {
      return JSON.parse(candidate)
    } catch {
      /* try the next candidate */
    }
  }

  return null
}

function readResponseText(data: ChatResponse): string {
  const message = typeof data.message === "string" ? data.message : data.message?.content
  const text = data.result || message || data.response || data.choices?.[0]?.message?.content || ""
  return typeof text === "string" ? text : ""
}

export async function generateText(prompt: string, options: AiCallOptions = {}): Promise<string> {
  const key = rapidApiKey()
  if (!key) throw new Error("RAPIDAPI_KEY is not configured")

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? DEFAULT_TIMEOUT_MS)

  try {
    const response = await fetch(`https://${rapidApiHost()}/gpt4o`, {
      method: "POST",
      headers: {
        "x-rapidapi-key": key,
        "x-rapidapi-host": rapidApiHost(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages: [{ role: "user", content: prompt }], web_access: false }),
      signal: controller.signal,
    })

    if (!response.ok) {
      const detail = await response.text().catch(() => "")
      throw new Error(`AI request failed: ${response.status}${detail ? ` - ${detail.slice(0, 200)}` : ""}`)
    }

    const text = readResponseText((await response.json()) as ChatResponse)
    if (!text) throw new Error("Empty AI response")
    return text
  } finally {
    clearTimeout(timeout)
  }
}

/**
 * Ask for JSON and keep asking until `validate` accepts the shape.
 * Retries exist because this endpoint regularly wraps JSON in prose or
 * truncates long articles.
 */
export async function generateStructuredJson<T>(args: {
  prompt: string
  validate: (raw: unknown) => T | null
  options?: AiCallOptions
}): Promise<T> {
  const maxRetries = args.options?.maxRetries ?? 3
  let lastError: Error | null = null

  for (let attempt = 0; attempt < maxRetries; attempt += 1) {
    try {
      const raw = await generateText(
        attempt === 0
          ? args.prompt
          : `${args.prompt}\n\nIMPORTANT: your previous reply was rejected. Reply with valid JSON only, no prose, no markdown fences.`,
        args.options,
      )
      const validated = args.validate(extractJsonFromText(raw))
      if (validated) return validated
      lastError = new Error("AI response failed validation")
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
    }
  }

  throw lastError ?? new Error("AI generation failed")
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- lib/dfy-profit/ai.test.ts`
Expected: PASS, 5 tests.

- [ ] **Step 5: Commit**

```bash
git add lib/dfy-profit/ai.ts lib/dfy-profit/ai.test.ts
git commit -m "feat(dfy-profit): add ai client with structured json retries"
```

---

### Task 4: Article prompts, normalization, and fallback

**Files:**
- Create: `lib/dfy-profit/prompts.ts`
- Create: `lib/dfy-profit/article-fallback.ts`
- Test: `lib/dfy-profit/prompts.test.ts`

**Interfaces:**
- Consumes: `GeneratedArticleContent` from `lib/dfy-profit/types.ts`
- Produces:
  - `buildArticlePrompt(input: ArticlePromptInput): string`
  - `normalizeArticleContent(raw: unknown, fallbackTitle: string): GeneratedArticleContent | null`
  - `buildFacebookPostsPrompt(input: { productName: string; niche: string; promoLink: string; postCount: number }): string`
  - `ArticlePromptInput { productName: string; productContext: string; niche: string }`
  - `buildFallbackArticle(input: ArticlePromptInput): GeneratedArticleContent`

`normalizeArticleContent` enforces the authority-tier bar from the spec: at least 900 words of text and an FAQ section. Blackbox uses `minWords: 1000` with `requireFaq: true` in `generate-content.ts` lines 50–58; 900 is used here because this endpoint truncates more aggressively and a rejected article costs a full retry.

- [ ] **Step 1: Write the failing test**

Create `lib/dfy-profit/prompts.test.ts`:

```ts
import { describe, expect, it } from "vitest"
import { buildArticlePrompt, buildFacebookPostsPrompt, normalizeArticleContent } from "./prompts"

const longBody = `<p>${"word ".repeat(950)}</p><h2>FAQ</h2><p>Q and A</p>`

describe("buildArticlePrompt", () => {
  it("includes the product, niche, and a json-only instruction", () => {
    const prompt = buildArticlePrompt({ productName: "KetoMax", productContext: "a keto plan", niche: "Weight Loss" })
    expect(prompt).toContain("KetoMax")
    expect(prompt).toContain("Weight Loss")
    expect(prompt).toContain("[LINK]")
    expect(prompt.toLowerCase()).toContain("json")
  })
})

describe("normalizeArticleContent", () => {
  it("accepts a long article with an faq", () => {
    const result = normalizeArticleContent({ title: "T", excerpt: "E", html: longBody }, "Fallback")
    expect(result?.title).toBe("T")
    expect(result?.html).toContain("FAQ")
  })

  it("rejects a short article", () => {
    expect(normalizeArticleContent({ title: "T", excerpt: "E", html: "<p>too short</p>" }, "Fallback")).toBeNull()
  })

  it("rejects an article with no faq section", () => {
    const noFaq = `<p>${"word ".repeat(950)}</p>`
    expect(normalizeArticleContent({ title: "T", excerpt: "E", html: noFaq }, "Fallback")).toBeNull()
  })

  it("rejects non-object input", () => {
    expect(normalizeArticleContent(null, "Fallback")).toBeNull()
    expect(normalizeArticleContent("nope", "Fallback")).toBeNull()
  })

  it("substitutes the fallback title when the title is missing", () => {
    const result = normalizeArticleContent({ excerpt: "E", html: longBody }, "Fallback")
    expect(result?.title).toBe("Fallback")
  })

  it("derives an excerpt from the body when it is missing", () => {
    const result = normalizeArticleContent({ title: "T", html: longBody }, "Fallback")
    expect(result?.excerpt.length).toBeGreaterThan(0)
    expect(result?.excerpt).not.toContain("<p>")
  })
})

describe("buildFacebookPostsPrompt", () => {
  it("asks for the requested post count and includes the promo link", () => {
    const prompt = buildFacebookPostsPrompt({
      productName: "KetoMax",
      niche: "Weight Loss",
      promoLink: "https://site.test/article/x",
      postCount: 3,
    })
    expect(prompt).toContain("3")
    expect(prompt).toContain("https://site.test/article/x")
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- lib/dfy-profit/prompts.test.ts`
Expected: FAIL — cannot resolve `./prompts`.

- [ ] **Step 3: Implement `lib/dfy-profit/prompts.ts`**

```ts
import type { GeneratedArticleContent } from "./types"

export interface ArticlePromptInput {
  productName: string
  productContext: string
  niche: string
}

const MIN_ARTICLE_WORDS = 900

export function buildArticlePrompt(input: ArticlePromptInput): string {
  return `You are an experienced affiliate content writer. Write one long authority article.

TOPIC: the best approach to ${input.niche}
PRODUCT YOU RECOMMEND: ${input.productName}
PRODUCT CONTEXT: ${input.productContext || input.niche}

REQUIREMENTS:
- At least 1200 words of real, specific, useful content
- Plain HTML body only: <p>, <h2>, <h3>, <ul>, <li>, <strong>. No <html>, <head>, or <body> tags
- Open with the reader's problem, not a greeting
- At least four <h2> sections
- Include one <h2>FAQ</h2> section with at least three question and answer pairs
- Mention ${input.productName} naturally two or three times, never as hype
- Put the exact token [LINK] on its own once in the body where a reader would want the resource
- Plain English, beginner friendly, honest about effort required
- No fabricated statistics and no income guarantees

Reply with JSON only, no markdown fences, in exactly this shape:
{"title": "...", "excerpt": "one or two sentence summary", "html": "<p>...</p>"}`
}

export function buildFacebookPostsPrompt(input: {
  productName: string
  niche: string
  promoLink: string
  postCount: number
}): string {
  return `Write ${input.postCount} different Facebook posts promoting a helpful article.

NICHE: ${input.niche}
PRODUCT: ${input.productName}
LINK TO SHARE: ${input.promoLink}

REQUIREMENTS:
- Each post 50 to 90 words
- Written like a real person sharing something that helped them, not an ad
- Each post uses a different angle: a personal result, a warning about a common mistake, a curiosity hook
- Each post ends with the link exactly as given: ${input.promoLink}
- No hashtags, no emoji, no income guarantees

Reply with JSON only, no markdown fences, in exactly this shape:
{"posts": ["first post text", "second post text"]}`
}

function stripHtml(html: string): string {
  return html
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length
}

/**
 * Validate an AI article payload. Returns null when it fails the authority bar,
 * which signals `generateStructuredJson` to retry.
 */
export function normalizeArticleContent(raw: unknown, fallbackTitle: string): GeneratedArticleContent | null {
  if (!raw || typeof raw !== "object") return null

  const candidate = raw as Partial<GeneratedArticleContent>
  const html = typeof candidate.html === "string" ? candidate.html.trim() : ""
  if (!html) return null

  const plain = stripHtml(html)
  if (countWords(plain) < MIN_ARTICLE_WORDS) return null
  if (!/faq|frequently asked/i.test(html)) return null

  const title = typeof candidate.title === "string" && candidate.title.trim() ? candidate.title.trim() : fallbackTitle
  const excerpt =
    typeof candidate.excerpt === "string" && candidate.excerpt.trim()
      ? candidate.excerpt.trim()
      : `${plain.slice(0, 180).trim()}...`

  return { title, excerpt, html }
}
```

- [ ] **Step 4: Implement `lib/dfy-profit/article-fallback.ts`**

This runs when `RAPIDAPI_KEY` is missing or every AI retry fails, so it must pass `normalizeArticleContent` on its own: over 900 words and an FAQ.

```ts
import type { GeneratedArticleContent } from "./types"
import type { ArticlePromptInput } from "./prompts"

function paragraph(text: string): string {
  return `<p>${text}</p>`
}

/**
 * Template authority article. Deliberately generic but genuinely readable, so a
 * kit generated without AI is still usable.
 */
export function buildFallbackArticle(input: ArticlePromptInput): GeneratedArticleContent {
  const { productName, niche } = input
  const context = input.productContext || niche
  const title = `What Actually Works in ${niche}: An Honest Guide`

  const sections = [
    `<h2>The real problem with ${niche}</h2>`,
    paragraph(
      `Most people who look into ${niche} do not fail because they are lazy. They fail because the first advice they find is written to sell something rather than to explain anything. You end up with a pile of tips that contradict each other, no way to tell which one applies to you, and no sense of what order to do things in. That is the actual problem, and it is worth naming before we go further.`,
    ),
    paragraph(
      `The approach below is deliberately boring. It assumes you have limited time, limited budget, and no appetite for guessing. Every step is something you can start this week without buying anything, and the places where a paid tool genuinely saves time are called out honestly rather than hidden.`,
    ),
    `<h2>Start by narrowing what you are actually trying to change</h2>`,
    paragraph(
      `Vague goals produce vague effort. "Get better at ${niche}" cannot be measured, so it cannot be improved. Write down the single outcome you want and the date you want it by. Then write the smallest weekly action that moves you toward it. One specific action done for six weeks beats five actions abandoned in the second week, every single time.`,
    ),
    paragraph(
      `This step feels too simple to matter, which is exactly why most people skip it. Do not skip it. Everything that follows depends on knowing what you are aiming at, because otherwise you have no way to judge whether any given tactic is working or just keeping you busy.`,
    ),
    `<h2>Build the habit before you optimise the method</h2>`,
    paragraph(
      `There is a strong temptation to research the perfect method before starting. Resist it. The people who get results in ${niche} are almost never the ones with the best plan. They are the ones who kept going long enough for an average plan to compound. Consistency is not a motivational slogan here, it is the mechanism that makes everything else work.`,
    ),
    paragraph(
      `Pick a schedule you can keep on a bad week, not a good one. If it only works when you are motivated, it is not a schedule, it is a mood. Once the habit is stable for a month, then start refining the method. Optimising something you are not doing yet is procrastination wearing a lab coat.`,
    ),
    `<h2>Track a small number of honest numbers</h2>`,
    paragraph(
      `You need feedback, but not a dashboard. Two or three numbers, checked weekly, will tell you almost everything a complicated tracking system would. Write them in the same place every week and look at the direction of travel rather than any single reading. Week-to-week noise means nothing; a flat line across six weeks means your method needs to change.`,
    ),
    paragraph(
      `Be honest when you record them, especially when the number is disappointing. A tracker you edit to feel better about yourself is worse than no tracker at all, because it removes the only signal you had. Disappointing data is not failure, it is the information you needed in order to adjust.`,
    ),
    `<h2>Where a paid resource genuinely helps</h2>`,
    paragraph(
      `Nothing above requires spending money, and you should not spend any until the habit is in place. What a good paid resource buys you is sequencing: someone who has already made the mistakes tells you what order to do things in, which saves months of trial and error. That is a real benefit, and it is the only benefit worth paying for.`,
    ),
    paragraph(
      `${productName} is built around ${context}. It is worth a look once you have done the groundwork above, because at that point you will be able to judge whether its approach fits your situation. Before then, no resource can help you, because the missing ingredient is not information. [LINK]`,
    ),
    `<h2>FAQ</h2>`,
    paragraph(`<strong>How long before I see results?</strong> Expect six to eight weeks of consistent effort before the numbers move in a way you can trust. Anything faster is usually noise, and anyone promising faster is selling rather than explaining. Individual results vary.`),
    paragraph(`<strong>Do I need to buy anything to start?</strong> No. Every step in this guide can be done for free. Paid resources save time and reduce guesswork once you are already moving, but they cannot replace the habit itself.`),
    paragraph(`<strong>What if I miss a week?</strong> Restart the same week without adding penalty work. Missing a week is normal and costs you very little. Abandoning the whole plan because you missed a week is what actually costs you the result.`),
    paragraph(`<strong>Is ${productName} suitable for complete beginners?</strong> It is aimed at people who have decided what they want and want the sequence laid out rather than assembled from scratch. If you have not done the goal-setting step yet, do that first.`),
  ]

  return {
    title,
    excerpt: `An honest, step-by-step look at what actually works in ${niche}, and where ${productName} fits in.`,
    html: sections.join(""),
  }
}
```

- [ ] **Step 5: Add a fallback guard test**

Append to `lib/dfy-profit/prompts.test.ts`:

```ts
import { buildFallbackArticle } from "./article-fallback"

describe("buildFallbackArticle", () => {
  it("passes its own normalization bar so a no-ai run still yields an article", () => {
    const article = buildFallbackArticle({ productName: "KetoMax", productContext: "a keto plan", niche: "Weight Loss" })
    expect(normalizeArticleContent(article, "Fallback")).not.toBeNull()
  })

  it("includes a [LINK] token for weaving", () => {
    const article = buildFallbackArticle({ productName: "KetoMax", productContext: "", niche: "Weight Loss" })
    expect(article.html).toContain("[LINK]")
  })
})
```

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npm test -- lib/dfy-profit/prompts.test.ts`
Expected: PASS, 11 tests. If the fallback guard fails on word count, lengthen the fallback paragraphs until it passes — do not lower `MIN_ARTICLE_WORDS`.

- [ ] **Step 7: Commit**

```bash
git add lib/dfy-profit/prompts.ts lib/dfy-profit/article-fallback.ts lib/dfy-profit/prompts.test.ts
git commit -m "feat(dfy-profit): add article prompts, normalization, and template fallback"
```

---

### Task 5: Offer context scraping

**Files:**
- Create: `lib/dfy-profit/scrape-offer-context.ts`
- Test: `lib/dfy-profit/scrape-offer-context.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `deriveNameFromUrl(url: string): string`
  - `parseOfferContext(html: string): { title: string; description: string }`
  - `scrapeOfferContext(url: string, timeoutMs?: number): Promise<{ productName: string; productContext: string }>`

- [ ] **Step 1: Write the failing test**

Create `lib/dfy-profit/scrape-offer-context.test.ts`:

```ts
import { describe, expect, it } from "vitest"
import { deriveNameFromUrl, parseOfferContext } from "./scrape-offer-context"

describe("deriveNameFromUrl", () => {
  it("title-cases the host without the tld or www", () => {
    expect(deriveNameFromUrl("https://www.ketomax.com/offer")).toBe("Ketomax")
  })

  it("splits hyphenated hosts into words", () => {
    expect(deriveNameFromUrl("https://keto-max-plan.net")).toBe("Keto Max Plan")
  })

  it("falls back to a generic name for an unparseable url", () => {
    expect(deriveNameFromUrl("not a url")).toBe("This Offer")
  })
})

describe("parseOfferContext", () => {
  it("reads the title tag and meta description", () => {
    const html = '<html><head><title>KetoMax - Burn Fat</title><meta name="description" content="A 30 day plan."></head></html>'
    expect(parseOfferContext(html)).toEqual({ title: "KetoMax - Burn Fat", description: "A 30 day plan." })
  })

  it("reads og:description when there is no meta description", () => {
    const html = '<meta property="og:description" content="OG copy here.">'
    expect(parseOfferContext(html).description).toBe("OG copy here.")
  })

  it("decodes html entities in the title", () => {
    expect(parseOfferContext("<title>Keto &amp; Fasting</title>").title).toBe("Keto & Fasting")
  })

  it("returns empty strings when nothing is present", () => {
    expect(parseOfferContext("<p>nothing</p>")).toEqual({ title: "", description: "" })
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- lib/dfy-profit/scrape-offer-context.test.ts`
Expected: FAIL — cannot resolve `./scrape-offer-context`.

- [ ] **Step 3: Implement `lib/dfy-profit/scrape-offer-context.ts`**

```ts
const DEFAULT_TIMEOUT_MS = 8_000

function decodeEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .trim()
}

export function deriveNameFromUrl(url: string): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "")
    const stem = host.split(".")[0]
    if (!stem) return "This Offer"
    return stem
      .split(/[-_]/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ")
  } catch {
    return "This Offer"
  }
}

export function parseOfferContext(html: string): { title: string; description: string } {
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? ""
  const description =
    html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)?.[1] ??
    html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']*)["']/i)?.[1] ??
    ""

  return { title: decodeEntities(title), description: decodeEntities(description) }
}

/**
 * Best-effort read of the affiliate destination for a product name and blurb.
 * Never throws: affiliate URLs frequently cloak, redirect, or block bots, and a
 * failed scrape must not fail the run.
 */
export async function scrapeOfferContext(
  url: string,
  timeoutMs: number = DEFAULT_TIMEOUT_MS,
): Promise<{ productName: string; productContext: string }> {
  const fallbackName = deriveNameFromUrl(url)
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: { "user-agent": "Mozilla/5.0 (compatible; WifiCodeBot/1.0)" },
    })
    if (!response.ok) return { productName: fallbackName, productContext: "" }

    const { title, description } = parseOfferContext((await response.text()).slice(0, 200_000))
    return {
      productName: title ? title.split(/[|\-–—]/)[0].trim() || fallbackName : fallbackName,
      productContext: description || title,
    }
  } catch {
    return { productName: fallbackName, productContext: "" }
  } finally {
    clearTimeout(timeout)
  }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- lib/dfy-profit/scrape-offer-context.test.ts`
Expected: PASS, 7 tests.

- [ ] **Step 5: Commit**

```bash
git add lib/dfy-profit/scrape-offer-context.ts lib/dfy-profit/scrape-offer-context.test.ts
git commit -m "feat(dfy-profit): add affiliate offer context scraping"
```

---

### Task 6: Extract non-persisting video comment generation

**Files:**
- Create: `lib/dfy-profit/generate-video-comments.ts`
- Modify: `app/actions/generate-viral-comments.ts` (replace lines 18–138, the two private generator functions)

**Interfaces:**
- Consumes: `isAiConfigured`, `generateText` from `lib/dfy-profit/ai.ts`
- Produces:
  - `VideoCommentInput { videoTitle: string; productName: string; productDescription: string; affiliateLink: string }`
  - `generateVideoComments(input: VideoCommentInput): Promise<{ comments: string[]; usedFallback: boolean }>`
  - `buildTemplateComments(input: VideoCommentInput): string[]`

This task changes existing behaviour, so it is separate and must be verified on its own. The goal is one implementation of comment generation shared by Gold Rush and Done-For-You Profit. `generateViralCommentsAction`'s own contract — auth handling, pack shape, `pages` insert, return value — must not change.

- [ ] **Step 1: Create `lib/dfy-profit/generate-video-comments.ts`**

Move the prompt verbatim from the current `app/actions/generate-viral-comments.ts` lines 27–56, and the templates verbatim from lines 132–138.

```ts
import { generateText, isAiConfigured } from "./ai"

export interface VideoCommentInput {
  videoTitle: string
  productName: string
  productDescription: string
  affiliateLink: string
}

export function buildTemplateComments(input: VideoCommentInput): string[] {
  return [
    `I was stuck in the same situation for months. Then I found a method that finally worked - ${input.productDescription}. Completely turned things around for me. Here if anyone wants to check it out: ${input.affiliateLink}`,
    `Struggled with this for way too long before I discovered a system that actually delivers results. ${input.productDescription}. Game changer honestly: ${input.affiliateLink}`,
    `My experience was similar until I came across something that changed everything. ${input.productDescription}. Made a huge difference: ${input.affiliateLink}`,
  ]
}

function buildPrompt(input: VideoCommentInput): string {
  return `You're writing a YouTube comment. Be natural and conversational like a real person.

CONTEXT (don't mention these directly):
- Video is about: ${input.videoTitle}
- You promote: ${input.productDescription}
- Your link: ${input.affiliateLink}

Write 3 different comments (40-60 words each) that:
1. Share a personal experience or reaction related to the video's topic
2. Naturally mention how you achieved results with your product/method
3. Include your link as a helpful resource

BE NATURAL:
- Write like you're texting a friend
- Share a short story or personal win
- Don't repeat the video title word-for-word
- Don't say "this video" or "great content"
- Sound authentic, not promotional

Now write 3 unique comments. Each should feel different. Mix up the storytelling. Just output the 3 comments, one per line, no numbers or formatting.`
}

function parseComments(raw: string): string[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length >= 30 && !/^\d+[.):\-]/.test(line))
    .slice(0, 3)
}

/**
 * Generate viral comments for one video. Never throws and never persists:
 * callers decide whether to save. Falls back to templates so a card is never empty.
 */
export async function generateVideoComments(
  input: VideoCommentInput,
): Promise<{ comments: string[]; usedFallback: boolean }> {
  if (!isAiConfigured()) {
    return { comments: buildTemplateComments(input), usedFallback: true }
  }

  try {
    const comments = parseComments(await generateText(buildPrompt(input)))
    if (comments.length === 0) throw new Error("No valid comments parsed from response")
    return { comments, usedFallback: false }
  } catch (error) {
    console.error("[rh] AI comment generation failed, using template fallback:", error)
    return { comments: buildTemplateComments(input), usedFallback: true }
  }
}
```

- [ ] **Step 2: Refactor `app/actions/generate-viral-comments.ts`**

Delete the private `generateViralCommentsWithAI` and `generateTemplateViralComments` functions (lines 18–138) and add the import. Keep everything from `export default async function generateViralCommentsAction` onward untouched except the one call site.

```ts
import { generateVideoComments } from "@/lib/dfy-profit/generate-video-comments"
```

Replace line 155:

```ts
const comments = await generateViralCommentsWithAI(input)
```

with:

```ts
const { comments } = await generateVideoComments(input)
```

`GenerateViralCommentsInput` is structurally compatible with `VideoCommentInput` — it carries the same four fields plus `videoId`, `channelTitle`, and `nicheId`, which the shared function ignores.

- [ ] **Step 3: Verify the types and build**

Run: `npx tsc --noEmit`
Expected: no errors. If it reports an unused import or a missing symbol, the old functions were only partially removed.

Run: `npm run lint`
Expected: no new errors.

- [ ] **Step 4: Manually verify Gold Rush still works**

Run `npm run dev`, open `/create`, generate comments for one video, and confirm three comments appear and a new pack shows up at `/pages`. This proves the refactor did not break the existing flow.

- [ ] **Step 5: Commit**

```bash
git add lib/dfy-profit/generate-video-comments.ts app/actions/generate-viral-comments.ts
git commit -m "refactor: share video comment generation between gold rush and dfy-profit"
```

---

### Task 7: Stage 1 route — videos

**Files:**
- Create: `app/api/premium/dfy-profit/videos/route.ts`

**Interfaces:**
- Consumes: `scrapeOfferContext`, `generateVideoComments`, `DfyVideoResult`, plus the existing `fetchVideoOpportunities` from `app/actions/fetch-video-opportunities.ts` (`(input: { productName: string; productDescription: string; keyword?: string; mode: "trending" | "niche" }) => Promise<VideoOpportunity[]>`) and `isValidAffiliateUrl` from `lib/affiliate-url.ts`
- Produces: `POST /api/premium/dfy-profit/videos` accepting `{ affiliateUrl, niche, offerName? }` and returning `{ productName, productContext, niche, videos: DfyVideoResult[] }`

- [ ] **Step 1: Implement the route**

```ts
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { isValidAffiliateUrl } from "@/lib/affiliate-url"
import { fetchVideoOpportunities } from "@/app/actions/fetch-video-opportunities"
import { scrapeOfferContext } from "@/lib/dfy-profit/scrape-offer-context"
import { generateVideoComments } from "@/lib/dfy-profit/generate-video-comments"
import type { DfyVideoResult } from "@/lib/dfy-profit/types"

export const dynamic = "force-dynamic"
export const maxDuration = 120

const VIDEO_COUNT = 5
const NO_STORE = { "Cache-Control": "no-store" } as const

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_STORE })
  }

  const body = await request.json().catch(() => ({}))
  const affiliateUrl = typeof body.affiliateUrl === "string" ? body.affiliateUrl.trim() : ""
  const niche = typeof body.niche === "string" ? body.niche.trim() : ""
  const offerName = typeof body.offerName === "string" ? body.offerName.trim() : ""

  if (!isValidAffiliateUrl(affiliateUrl)) {
    return NextResponse.json({ error: "Enter a valid affiliate URL starting with https://" }, { status: 400, headers: NO_STORE })
  }
  if (!niche) {
    return NextResponse.json({ error: "Pick a niche first." }, { status: 400, headers: NO_STORE })
  }

  // A saved link already carries a trustworthy product name, so skip the scrape.
  const scraped = offerName
    ? { productName: offerName, productContext: "" }
    : await scrapeOfferContext(affiliateUrl)

  const productName = scraped.productName
  const productContext = scraped.productContext || `${productName} for ${niche}`

  let opportunities
  try {
    opportunities = await fetchVideoOpportunities({
      productName,
      productDescription: productContext,
      keyword: niche,
      mode: "niche",
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Video search failed"
    return NextResponse.json({ error: message }, { status: 502, headers: NO_STORE })
  }

  const selected = opportunities.slice(0, VIDEO_COUNT)
  if (selected.length === 0) {
    return NextResponse.json(
      { error: "No videos found for that niche. Try a different niche." },
      { status: 502, headers: NO_STORE },
    )
  }

  // Parallel, not sequential: five sequential AI calls would approach maxDuration.
  const settled = await Promise.allSettled(
    selected.map((video) =>
      generateVideoComments({
        videoTitle: video.title,
        productName,
        productDescription: productContext,
        affiliateLink: affiliateUrl,
      }),
    ),
  )

  const videos: DfyVideoResult[] = selected.map((video, index) => {
    const result = settled[index]
    const generated =
      result.status === "fulfilled" ? result.value : { comments: [] as string[], usedFallback: true }

    return {
      videoId: video.videoId,
      title: video.title,
      channelTitle: video.channelTitle,
      thumbnailUrl: video.thumbnailUrl,
      viewCount: video.viewCount,
      videoUrl: `https://youtube.com/watch?v=${video.videoId}`,
      comments: generated.comments,
      usedFallbackComments: generated.usedFallback,
    }
  })

  return NextResponse.json({ productName, productContext, niche, videos }, { headers: NO_STORE })
}
```

- [ ] **Step 2: Verify types**

Run: `npx tsc --noEmit`
Expected: no errors. If the `fetchVideoOpportunities` import path fails, confirm the export at `app/actions/fetch-video-opportunities.ts` line 519.

- [ ] **Step 3: Manually exercise the route**

With `npm run dev` running and a logged-in browser session, run this in the browser devtools console (a `curl` call would be rejected for lacking the session cookie):

```js
await (await fetch("/api/premium/dfy-profit/videos", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ affiliateUrl: "https://example.com/offer", niche: "Weight Loss" }),
})).json()
```

Expected: `videos` has exactly 5 entries, each with 3 comments containing the affiliate URL, and a non-empty `productName`.

- [ ] **Step 4: Commit**

```bash
git add app/api/premium/dfy-profit/videos/route.ts
git commit -m "feat(dfy-profit): add stage 1 videos route"
```

---

### Task 8: Stage 2 route — hosted authority article

**Files:**
- Create: `app/api/premium/dfy-profit/article/route.ts`

**Interfaces:**
- Consumes: `buildArticlePrompt`, `normalizeArticleContent`, `buildFallbackArticle`, `generateStructuredJson`, `isAiConfigured`, `weaveAffiliateLinks`, `buildArticleSlug`, `DfyArticleResult`
- Produces: `POST /api/premium/dfy-profit/article` accepting `{ affiliateUrl, productName, productContext, niche }` and returning `DfyArticleResult`

- [ ] **Step 1: Implement the route**

The `pages.niche_id NOT NULL` constraint is satisfied with the same get-or-create lookup already used in `app/actions/generate-viral-comments.ts` lines 184–193, which is why no migration is needed.

```ts
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { isValidAffiliateUrl } from "@/lib/affiliate-url"
import { generateStructuredJson, isAiConfigured } from "@/lib/dfy-profit/ai"
import { buildArticlePrompt, normalizeArticleContent } from "@/lib/dfy-profit/prompts"
import { buildFallbackArticle } from "@/lib/dfy-profit/article-fallback"
import { weaveAffiliateLinks } from "@/lib/dfy-profit/weave-affiliate-links"
import { buildArticleSlug } from "@/lib/dfy-profit/slug"
import type { GeneratedArticleContent } from "@/lib/dfy-profit/types"

export const dynamic = "force-dynamic"
export const maxDuration = 120

const NO_STORE = { "Cache-Control": "no-store" } as const

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_STORE })
  }

  const body = await request.json().catch(() => ({}))
  const affiliateUrl = typeof body.affiliateUrl === "string" ? body.affiliateUrl.trim() : ""
  const productName = typeof body.productName === "string" ? body.productName.trim() : ""
  const productContext = typeof body.productContext === "string" ? body.productContext.trim() : ""
  const niche = typeof body.niche === "string" ? body.niche.trim() : ""

  if (!isValidAffiliateUrl(affiliateUrl) || !productName || !niche) {
    return NextResponse.json(
      { error: "affiliateUrl, productName, and niche are required" },
      { status: 400, headers: NO_STORE },
    )
  }

  const promptInput = { productName, productContext, niche }
  let content: GeneratedArticleContent

  if (!isAiConfigured()) {
    content = buildFallbackArticle(promptInput)
  } else {
    try {
      content = await generateStructuredJson<GeneratedArticleContent>({
        prompt: buildArticlePrompt(promptInput),
        validate: (raw) => normalizeArticleContent(raw, `The Honest Guide to ${niche}`),
        options: { maxRetries: 3, timeoutMs: 45_000 },
      })
    } catch (error) {
      console.error("[rh] dfy-profit article AI failed, using template fallback:", error)
      content = buildFallbackArticle(promptInput)
    }
  }

  const html = weaveAffiliateLinks(content.html, affiliateUrl)

  // Satisfies pages.niche_id NOT NULL without a migration.
  const { data: niche_row } = await supabase.from("niches").select("id").limit(1).single()

  // pages.slug is UNIQUE, so retry once with a fresh suffix on a collision.
  let page: { id: string; slug: string | null } | null = null
  let insertError: { code?: string; message?: string } | null = null

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const result = await supabase
      .from("pages")
      .insert({
        user_id: user.id,
        niche_id: niche_row?.id ?? null,
        offer_id: null,
        offer_name: productName,
        title: content.title,
        content: html,
        affiliate_link: affiliateUrl,
        slug: buildArticleSlug(content.title),
        status: "active",
        views: 0,
        clicks: 0,
      })
      .select("id, slug")
      .single()

    if (!result.error && result.data) {
      page = result.data
      insertError = null
      break
    }

    insertError = result.error
    // 23505 is Postgres unique_violation; anything else will not be fixed by a retry.
    if (result.error?.code !== "23505") break
  }

  if (insertError || !page) {
    // Still return the copy so the kit UI is not empty. Mirrors blackbox's
    // article/route.ts lines 66-80.
    console.error("[rh] dfy-profit article save failed:", insertError)
    return NextResponse.json(
      {
        id: null,
        slug: null,
        url: null,
        title: content.title,
        excerpt: content.excerpt,
        html,
        saveWarning: "Article generated but not saved, so there is no shareable link. Copy the text below.",
      },
      { headers: NO_STORE },
    )
  }

  const origin = new URL(request.url).origin

  return NextResponse.json(
    {
      id: page.id,
      slug: page.slug,
      url: `${origin}/article/${page.slug ?? page.id}`,
      title: content.title,
      excerpt: content.excerpt,
      html,
    },
    { headers: NO_STORE },
  )
}
```

- [ ] **Step 2: Verify types**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Manually exercise the route**

In the devtools console of a logged-in session:

```js
await (await fetch("/api/premium/dfy-profit/article", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    affiliateUrl: "https://example.com/offer",
    productName: "KetoMax",
    productContext: "a 30 day keto plan",
    niche: "Weight Loss",
  }),
})).json()
```

Expected: a `url` ending in a slug, and `html` containing `class="affiliate-link"`. Confirm the row exists in the `pages` table with `status = 'active'` and a populated `slug`.

Run the exact same call a second time. Expected: a second row with a different slug, proving the collision retry and random suffix work.

- [ ] **Step 4: Commit**

```bash
git add app/api/premium/dfy-profit/article/route.ts
git commit -m "feat(dfy-profit): add stage 2 hosted authority article route"
```

---

### Task 9: Serve HTML articles from `/article/[slug]`

**Files:**
- Create: `lib/dfy-profit/article-payload.ts`
- Test: `lib/dfy-profit/article-payload.test.ts`
- Modify: `app/article/[slug]/page.tsx`

**Interfaces:**
- Consumes: nothing
- Produces: `parseArticlePayload(content: string | null): { kind: "pack"; pack: CommentPackPayload } | { kind: "html" } | { kind: "empty" }`, and `CommentPackPayload` matching the `CommentPack` type currently declared inline at `app/article/[slug]/page.tsx` lines 11–20

The discriminator is extracted into a pure module so it can be tested without rendering a server component. Today the route calls `notFound()` whenever the content is not a comment pack (lines 44–46), so this task converts a dead end into the HTML article branch. Every existing comment pack must keep rendering exactly as before.

- [ ] **Step 1: Write the failing test**

Create `lib/dfy-profit/article-payload.test.ts`:

```ts
import { describe, expect, it } from "vitest"
import { parseArticlePayload } from "./article-payload"

const pack = JSON.stringify({ version: 1, videoId: "abc", videoTitle: "T", comments: ["one", "two"] })

describe("parseArticlePayload", () => {
  it("recognises a comment pack", () => {
    const result = parseArticlePayload(pack)
    expect(result.kind).toBe("pack")
    if (result.kind === "pack") expect(result.pack.comments).toHaveLength(2)
  })

  it("treats html as an article", () => {
    expect(parseArticlePayload("<p>Hello</p>").kind).toBe("html")
  })

  it("treats json without a comments array as html", () => {
    expect(parseArticlePayload('{"version":1,"videoId":"abc"}').kind).toBe("html")
  })

  it("reports empty content", () => {
    expect(parseArticlePayload("").kind).toBe("empty")
    expect(parseArticlePayload(null).kind).toBe("empty")
    expect(parseArticlePayload("   ").kind).toBe("empty")
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- lib/dfy-profit/article-payload.test.ts`
Expected: FAIL — cannot resolve `./article-payload`.

- [ ] **Step 3: Implement `lib/dfy-profit/article-payload.ts`**

```ts
export interface CommentPackPayload {
  version: number
  videoId: string
  videoUrl?: string
  videoTitle: string
  channelTitle?: string
  createdAt?: string
  comments: string[]
  tips?: string[]
}

export type ArticlePayload =
  | { kind: "pack"; pack: CommentPackPayload }
  | { kind: "html" }
  | { kind: "empty" }

/**
 * Decide how to render a `pages.content` value.
 * Comment packs are JSON with a `comments` array; Done-For-You Profit
 * articles are raw HTML.
 */
export function parseArticlePayload(content: string | null): ArticlePayload {
  const trimmed = content?.trim() ?? ""
  if (!trimmed) return { kind: "empty" }

  try {
    const parsed = JSON.parse(trimmed) as Partial<CommentPackPayload> | null
    if (parsed && typeof parsed === "object" && Array.isArray(parsed.comments)) {
      return {
        kind: "pack",
        pack: {
          version: Number(parsed.version || 1),
          videoId: String(parsed.videoId || ""),
          videoUrl: parsed.videoUrl,
          videoTitle: String(parsed.videoTitle || ""),
          channelTitle: parsed.channelTitle,
          createdAt: parsed.createdAt,
          comments: parsed.comments,
          tips: parsed.tips,
        },
      }
    }
  } catch {
    /* not json, so it is html */
  }

  return { kind: "html" }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- lib/dfy-profit/article-payload.test.ts`
Expected: PASS, 4 tests.

- [ ] **Step 5: Rewrite `app/article/[slug]/page.tsx`**

Two changes beyond the branch: the select list gains `views, created_at` because `ArticleContent` reads them (its props are declared at `app/article/[slug]/article-content.tsx` lines 6–17), and lookup tries `slug` before `id` so existing UUID links keep working.

```tsx
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { CommentPackViewer } from "./CommentPackViewer"
import ArticleContent from "./article-content"
import { parseArticlePayload } from "@/lib/dfy-profit/article-payload"

interface PageProps {
  params: Promise<{ slug: string }>
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const SELECT = "id, title, content, affiliate_link, status, views, created_at"

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  let { data: page } = await supabase
    .from("pages")
    .select(SELECT)
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle()

  // Packs created before slugs were populated are linked by uuid.
  if (!page && UUID_RE.test(slug)) {
    const byId = await supabase.from("pages").select(SELECT).eq("id", slug).eq("status", "active").maybeSingle()
    page = byId.data
  }

  if (!page) {
    notFound()
  }

  const payload = parseArticlePayload(page.content)

  if (payload.kind === "pack") {
    return (
      <CommentPackViewer
        pageId={page.id}
        pack={{
          ...payload.pack,
          videoUrl: payload.pack.videoUrl || page.affiliate_link || "",
          videoTitle: payload.pack.videoTitle || page.title || "Comment Pack",
        }}
      />
    )
  }

  if (payload.kind === "html") {
    return (
      <ArticleContent
        page={{
          id: page.id,
          title: page.title,
          content: page.content,
          affiliate_link: page.affiliate_link,
          views: page.views ?? 0,
          created_at: page.created_at,
        }}
      />
    )
  }

  notFound()
}
```

- [ ] **Step 6: Verify types and build**

Run: `npx tsc --noEmit && npm run build`
Expected: both succeed. If `ArticleContent`'s prop type complains, compare against its interface at `app/article/[slug]/article-content.tsx` lines 6–17 — `niches` and `offers` are optional and intentionally omitted.

- [ ] **Step 7: Manually verify both branches and the regression**

1. Open the `/article/{slug}` URL returned by Task 8. The HTML article renders, and clicking an affiliate link fires `/api/track-click` (check the Network tab).
2. Open an existing comment pack from `/pages` by its UUID URL. It still renders in `CommentPackViewer` — this is the critical regression check.
3. Open `/article/does-not-exist`. It 404s.

- [ ] **Step 8: Commit**

```bash
git add lib/dfy-profit/article-payload.ts lib/dfy-profit/article-payload.test.ts app/article/[slug]/page.tsx
git commit -m "feat(dfy-profit): serve html articles by slug alongside comment packs"
```

---

### Task 10: Stage 3 route — Facebook posts

**Files:**
- Create: `lib/dfy-profit/posts-fallback.ts`
- Test: `lib/dfy-profit/posts-fallback.test.ts`
- Create: `app/api/premium/dfy-profit/posts/route.ts`

**Interfaces:**
- Consumes: `buildFacebookPostsPrompt`, `generateStructuredJson`, `isAiConfigured`, `DfyFacebookPost`
- Produces:
  - `buildFallbackPosts(niche: string, promoLink: string, count: number): string[]`
  - `POST /api/premium/dfy-profit/posts` accepting `{ affiliateUrl, articleUrl?, productName, niche }` and returning `{ posts: DfyFacebookPost[], promoLink: string, usedFallbackLink: boolean }`

The fallback copy is re-seeded here rather than imported from `app/(protected)/upgrades/instant-income/instant-income-content.tsx`, because that file is a `"use client"` component holding `facebookPosts[]` as a local array and cannot be consumed by a route handler. Instant Income stays untouched.

- [ ] **Step 1: Write the failing test**

Create `lib/dfy-profit/posts-fallback.test.ts`:

```ts
import { describe, expect, it } from "vitest"
import { buildFallbackPosts } from "./posts-fallback"

const LINK = "https://site.test/article/keto-guide-ab12cd"

describe("buildFallbackPosts", () => {
  it("returns the requested number of posts", () => {
    expect(buildFallbackPosts("Weight Loss", LINK, 3)).toHaveLength(3)
  })

  it("substitutes the promo link into every post", () => {
    for (const post of buildFallbackPosts("Weight Loss", LINK, 3)) {
      expect(post).toContain(LINK)
      expect(post).not.toContain("[LINK]")
    }
  })

  it("returns distinct posts", () => {
    const posts = buildFallbackPosts("Weight Loss", LINK, 3)
    expect(new Set(posts).size).toBe(3)
  })

  it("falls back to generic copy for an unknown niche", () => {
    const posts = buildFallbackPosts("Underwater Basket Weaving", LINK, 3)
    expect(posts).toHaveLength(3)
    expect(posts[0]).toContain(LINK)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- lib/dfy-profit/posts-fallback.test.ts`
Expected: FAIL — cannot resolve `./posts-fallback`.

- [ ] **Step 3: Implement `lib/dfy-profit/posts-fallback.ts`**

```ts
const GENERIC_POSTS = [
  "I spent a long time trying to figure this out on my own and got nowhere. What finally helped was having the steps laid out in order instead of guessing. Wrote up what actually worked, including the parts nobody mentions: [LINK]",
  "The mistake I made for months was jumping between methods every couple of weeks. Sticking with one approach long enough to see results changed everything. Full breakdown here if it helps anyone else: [LINK]",
  "Someone asked me how I finally got this working, so I put the whole thing in writing rather than explaining it ten more times. Honest version, including what did not work: [LINK]",
]

const NICHE_POSTS: Record<string, string[]> = {
  "weight loss": [
    "I was stuck at the same weight for the better part of a year. What broke the plateau was not a new diet, it was fixing the two things I kept getting wrong. Wrote it all down here: [LINK]",
    "Nobody tells you that the first three weeks feel like nothing is happening. That is exactly when most people quit. Here is what the timeline actually looks like and how to get through it: [LINK]",
    "Every plan I tried failed for the same reason, and it took me embarrassingly long to spot it. If you have started and stopped more than once, this will probably sound familiar: [LINK]",
  ],
  "make money online": [
    "I wasted a lot of time on this before anything clicked. The turning point was picking one approach and giving it eight weeks instead of two. Wrote up the whole process, mistakes included: [LINK]",
    "Most of what I read about this was written to sell something rather than explain anything. Here is the version I wish I had found first, with no income promises: [LINK]",
    "The part that finally worked was boring and repetitive, which is probably why nobody posts about it. Full walkthrough here: [LINK]",
  ],
  "health & fitness": [
    "I kept starting over every few weeks and wondering why nothing stuck. Turned out my schedule only worked on good weeks. Here is what I changed: [LINK]",
    "The advice that helped most was the least exciting: do less, more often. Wrote up how that actually looks week to week: [LINK]",
    "Six weeks in, the numbers finally started moving. Here is what the first six weeks actually felt like, honestly: [LINK]",
  ],
}

/**
 * Deterministic Facebook post copy for when AI generation is unavailable.
 * Seeded from the Instant Income copy, kept local so route handlers do not
 * import a client component.
 */
export function buildFallbackPosts(niche: string, promoLink: string, count: number): string[] {
  const pool = NICHE_POSTS[niche.trim().toLowerCase()] ?? GENERIC_POSTS
  const selected: string[] = []

  for (let index = 0; index < count; index += 1) {
    const template = pool[index % pool.length]
    selected.push(template.split("[LINK]").join(promoLink))
  }

  return selected
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- lib/dfy-profit/posts-fallback.test.ts`
Expected: PASS, 4 tests. The distinctness test requires each pool to hold at least 3 entries.

- [ ] **Step 5: Implement `app/api/premium/dfy-profit/posts/route.ts`**

```ts
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { generateStructuredJson, isAiConfigured } from "@/lib/dfy-profit/ai"
import { buildFacebookPostsPrompt } from "@/lib/dfy-profit/prompts"
import { buildFallbackPosts } from "@/lib/dfy-profit/posts-fallback"
import type { DfyFacebookPost } from "@/lib/dfy-profit/types"

export const dynamic = "force-dynamic"
export const maxDuration = 120

const POST_COUNT = 3
const NO_STORE = { "Cache-Control": "no-store" } as const

function validatePosts(raw: unknown): string[] | null {
  const posts = (raw as { posts?: unknown })?.posts
  if (!Array.isArray(posts)) return null

  const usable = posts.filter((post): post is string => typeof post === "string" && post.trim().length >= 40)
  return usable.length >= POST_COUNT ? usable.slice(0, POST_COUNT) : null
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_STORE })
  }

  const body = await request.json().catch(() => ({}))
  const affiliateUrl = typeof body.affiliateUrl === "string" ? body.affiliateUrl.trim() : ""
  const articleUrl = typeof body.articleUrl === "string" ? body.articleUrl.trim() : ""
  const productName = typeof body.productName === "string" ? body.productName.trim() : ""
  const niche = typeof body.niche === "string" ? body.niche.trim() : ""

  if (!productName || !niche || (!articleUrl && !affiliateUrl)) {
    return NextResponse.json(
      { error: "productName, niche, and one of articleUrl or affiliateUrl are required" },
      { status: 400, headers: NO_STORE },
    )
  }

  // Prefer the hosted article so clicks are tracked; fall back to the raw
  // affiliate link only when stage 2 produced no hosted url.
  const promoLink = articleUrl || affiliateUrl
  const usedFallbackLink = !articleUrl

  let bodies: string[]

  if (!isAiConfigured()) {
    bodies = buildFallbackPosts(niche, promoLink, POST_COUNT)
  } else {
    try {
      bodies = await generateStructuredJson<string[]>({
        prompt: buildFacebookPostsPrompt({ productName, niche, promoLink, postCount: POST_COUNT }),
        validate: validatePosts,
        options: { maxRetries: 2, timeoutMs: 40_000 },
      })
    } catch (error) {
      console.error("[rh] dfy-profit posts AI failed, using template fallback:", error)
      bodies = buildFallbackPosts(niche, promoLink, POST_COUNT)
    }
  }

  const posts: DfyFacebookPost[] = bodies.map((post, index) => ({
    id: `dfy-post-${index + 1}`,
    body: post.includes(promoLink) ? post : `${post}\n\n${promoLink}`,
  }))

  return NextResponse.json({ posts, promoLink, usedFallbackLink }, { headers: NO_STORE })
}
```

- [ ] **Step 6: Verify and exercise**

Run: `npx tsc --noEmit`
Expected: no errors.

In the devtools console of a logged-in session:

```js
await (await fetch("/api/premium/dfy-profit/posts", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    affiliateUrl: "https://example.com/offer",
    articleUrl: "https://site.test/article/x",
    productName: "KetoMax",
    niche: "Weight Loss",
  }),
})).json()
```

Expected: exactly 3 posts, each containing `https://site.test/article/x`, and `usedFallbackLink: false`.

- [ ] **Step 7: Commit**

```bash
git add lib/dfy-profit/posts-fallback.ts lib/dfy-profit/posts-fallback.test.ts app/api/premium/dfy-profit/posts/route.ts
git commit -m "feat(dfy-profit): add stage 3 facebook posts route"
```

---

### Task 11: Page, orchestration client, and result panel

**Files:**
- Create: `app/(protected)/upgrades/dfy-profit/page.tsx`
- Create: `app/(protected)/upgrades/dfy-profit/DfyProfitClient.tsx`
- Create: `app/(protected)/upgrades/dfy-profit/DfyResultPanel.tsx`

**Interfaces:**
- Consumes: the three routes from Tasks 7, 8, 10; `DfyVideoResult`, `DfyArticleResult`, `DfyFacebookPost`; existing `PageHeader`, `GenerationProgress`, `SavedLinksPicker`, `isValidAffiliateUrl`, `getUserAffiliateLinks`
- Produces: the `/upgrades/dfy-profit` route

Do not create a `layout.tsx` here: `app/(protected)/upgrades/layout.tsx` already applies `TypographySurface surface="marketing"`.

`GenerationProgress` in this app takes `{ label?, offer? }` and has no `active` prop — the parent conditionally renders it. This differs from blackbox's version, which takes `active`. Check `components/generation-progress.tsx` lines 16–22 before use.

- [ ] **Step 1: Create the server page**

```tsx
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getUserAffiliateLinks } from "@/app/actions/affiliate-links"
import { PREMIUM_FEATURE_LABELS } from "@/lib/premium-features"
import DfyProfitClient from "./DfyProfitClient"

export const metadata: Metadata = {
  title: `${PREMIUM_FEATURE_LABELS.dfyProfit} | Your complete promo kit`,
  description: "Paste your affiliate link, pick a niche, and get videos, an authority article, and Facebook posts in one run.",
}

export default async function DfyProfitPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const links = await getUserAffiliateLinks().catch(() => [])

  return <DfyProfitClient savedLinks={links} />
}
```

Confirm the export name and return type of `getUserAffiliateLinks` in `app/actions/affiliate-links.ts` before wiring it, and match the `links` prop type that `SavedLinksPicker` expects (`components/saved-links-picker.tsx` lines 7–15). If the action's name differs, use the one `app/(protected)/create/page.tsx` already uses to populate its picker.

- [ ] **Step 2: Create `DfyProfitClient.tsx`**

Stage 1 aborts the run on failure because stages 2 and 3 depend on its product context. Stages 2 and 3 fail soft into section errors, mirroring `DfyProfitPage.handleGenerate` in blackbox.

```tsx
"use client"

import { useState } from "react"
import { Loader2, Sparkles } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { GenerationProgress } from "@/components/generation-progress"
import { SavedLinksPicker } from "@/components/saved-links-picker"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { isValidAffiliateUrl } from "@/lib/affiliate-url"
import type { DfyArticleResult, DfyFacebookPost, DfyVideoResult } from "@/lib/dfy-profit/types"
import { DfyResultPanel } from "./DfyResultPanel"

const NICHES = [
  "Weight Loss",
  "Make Money Online",
  "Health & Fitness",
  "Beauty & Skincare",
  "Relationships",
  "Tech & Gadgets",
  "Pets",
  "Home & Garden",
]

type Stage = "idle" | "videos" | "article" | "posts" | "done"

const STAGE_LABELS: Record<Exclude<Stage, "idle" | "done">, string> = {
  videos: "Finding your videos...",
  article: "Writing your authority article...",
  posts: "Generating Facebook posts...",
}

export default function DfyProfitClient({ savedLinks }: { savedLinks: Parameters<typeof SavedLinksPicker>[0]["links"] }) {
  const [affiliateUrl, setAffiliateUrl] = useState("")
  const [offerName, setOfferName] = useState("")
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null)
  const [niche, setNiche] = useState("")
  const [stage, setStage] = useState<Stage>("idle")
  const [error, setError] = useState("")

  const [videos, setVideos] = useState<DfyVideoResult[]>([])
  const [article, setArticle] = useState<DfyArticleResult | null>(null)
  const [posts, setPosts] = useState<DfyFacebookPost[]>([])
  const [articleError, setArticleError] = useState("")
  const [postsError, setPostsError] = useState("")
  const [usedFallbackLink, setUsedFallbackLink] = useState(false)
  const [context, setContext] = useState({ productName: "", productContext: "", niche: "" })

  const generating = stage === "videos" || stage === "article" || stage === "posts"

  const runArticle = async (ctx: { productName: string; productContext: string; niche: string }) => {
    const response = await fetch("/api/premium/dfy-profit/article", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ affiliateUrl, ...ctx }),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || "Article generation failed")
    return data as DfyArticleResult
  }

  const runPosts = async (ctx: { productName: string; niche: string }, articleUrl: string | null) => {
    const response = await fetch("/api/premium/dfy-profit/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ affiliateUrl, articleUrl: articleUrl ?? undefined, ...ctx }),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || "Facebook post generation failed")
    return data as { posts: DfyFacebookPost[]; usedFallbackLink: boolean }
  }

  const handleGenerate = async () => {
    if (!isValidAffiliateUrl(affiliateUrl)) {
      setError("Enter a valid affiliate URL starting with https://")
      return
    }
    if (!niche) {
      setError("Pick a niche first.")
      return
    }

    setError("")
    setArticleError("")
    setPostsError("")
    setVideos([])
    setArticle(null)
    setPosts([])
    setStage("videos")

    let ctx = { productName: "", productContext: "", niche }

    try {
      const response = await fetch("/api/premium/dfy-profit/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ affiliateUrl, niche, offerName: offerName || undefined }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Video search failed")

      setVideos(data.videos)
      ctx = { productName: data.productName, productContext: data.productContext, niche: data.niche }
      setContext(ctx)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Video search failed")
      setStage("idle")
      return
    }

    setStage("article")
    let articleUrl: string | null = null
    try {
      const result = await runArticle(ctx)
      setArticle(result)
      articleUrl = result.url
    } catch (e) {
      setArticleError(e instanceof Error ? e.message : "Article generation failed")
    }

    setStage("posts")
    try {
      const result = await runPosts({ productName: ctx.productName, niche: ctx.niche }, articleUrl)
      setPosts(result.posts)
      setUsedFallbackLink(result.usedFallbackLink)
    } catch (e) {
      setPostsError(e instanceof Error ? e.message : "Facebook post generation failed")
    }

    setStage("done")
  }

  const handleRetryArticle = async () => {
    setArticleError("")
    setStage("article")
    try {
      setArticle(await runArticle(context))
    } catch (e) {
      setArticleError(e instanceof Error ? e.message : "Article generation failed")
    } finally {
      setStage("done")
    }
  }

  const handleRetryPosts = async () => {
    setPostsError("")
    setStage("posts")
    try {
      const result = await runPosts({ productName: context.productName, niche: context.niche }, article?.url ?? null)
      setPosts(result.posts)
      setUsedFallbackLink(result.usedFallbackLink)
    } catch (e) {
      setPostsError(e instanceof Error ? e.message : "Facebook post generation failed")
    } finally {
      setStage("done")
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        eyebrow="Premium"
        title="Done-For-You Profit"
        subtitle="Paste your affiliate link, pick a niche, and get 5 videos to comment on, an authority article, and 3 Facebook posts in one run."
      />

      <Card className="glass-card border-border">
        <CardContent className="space-y-6 p-6">
          <div className="space-y-2">
            <label htmlFor="dfy-profit-link" className="text-sm font-medium text-foreground">
              1. Your affiliate link
            </label>
            <Input
              id="dfy-profit-link"
              value={affiliateUrl}
              onChange={(event) => setAffiliateUrl(event.target.value)}
              placeholder="https://..."
              disabled={generating}
            />
            {savedLinks.length > 0 && (
              <SavedLinksPicker
                links={savedLinks}
                selectedId={selectedLinkId}
                onSelect={(link) => {
                  setSelectedLinkId(link.id)
                  setAffiliateUrl(link.affiliate_url)
                  setOfferName(link.offer_name)
                }}
              />
            )}
          </div>

          <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-foreground">2. Pick a niche</legend>
            <div className="flex flex-wrap gap-2">
              {NICHES.map((option) => (
                <button
                  key={option}
                  type="button"
                  disabled={generating}
                  onClick={() => setNiche(option)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${
                    niche === option
                      ? "border-[#2563EB] bg-[#EEF4FF] text-[#1d4ed8]"
                      : "border-border bg-card text-muted-foreground hover:border-[#2563EB]"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </fieldset>

          {error && <p className="text-sm font-medium text-destructive">{error}</p>}

          <Button onClick={handleGenerate} disabled={generating} className="h-12 w-full text-base font-semibold sm:w-auto">
            {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            {generating ? "Generating..." : videos.length > 0 ? "Generate another kit" : "Generate my kit"}
          </Button>
        </CardContent>
      </Card>

      {generating && <GenerationProgress label={STAGE_LABELS[stage as Exclude<Stage, "idle" | "done">]} offer="welcome" />}

      <DfyResultPanel
        videos={videos}
        article={article}
        posts={posts}
        articleError={articleError}
        postsError={postsError}
        usedFallbackLink={usedFallbackLink}
        isGeneratingArticle={stage === "article"}
        isGeneratingPosts={stage === "posts"}
        onRetryArticle={handleRetryArticle}
        onRetryPosts={handleRetryPosts}
      />
    </div>
  )
}
```

- [ ] **Step 3: Create `DfyResultPanel.tsx`**

Three sections — videos with their comments, the article, the Facebook posts — each with copy buttons and a scoped error plus retry. Model the structure on blackbox's `DfyResultPanel` (`D:\Apps\blackboxcash\src\features\dfy-profit\components\DfyResultPanel.tsx`) but use this app's `Card`, `Button`, and sapphire tokens rather than its brass classes.

```tsx
"use client"

import { useState } from "react"
import { Check, Copy, ExternalLink, FileText, Loader2, Megaphone, RefreshCw, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { DfyArticleResult, DfyFacebookPost, DfyVideoResult } from "@/lib/dfy-profit/types"

interface DfyResultPanelProps {
  videos: DfyVideoResult[]
  article: DfyArticleResult | null
  posts: DfyFacebookPost[]
  articleError: string
  postsError: string
  usedFallbackLink: boolean
  isGeneratingArticle: boolean
  isGeneratingPosts: boolean
  onRetryArticle: () => void
  onRetryPosts: () => void
}

function htmlToText(html: string): string {
  return html
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

export function DfyResultPanel(props: DfyResultPanelProps) {
  const { videos, article, posts, articleError, postsError, usedFallbackLink } = props
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      /* clipboard unavailable */
    }
  }

  if (videos.length === 0 && !article && posts.length === 0 && !articleError && !postsError) {
    return null
  }

  return (
    <section className="space-y-6">
      <h2 className="ds-h2">Your Done-For-You kit</h2>

      {videos.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Youtube className="h-5 w-5 text-[#1d4ed8]" />
            <h3 className="ds-h3">Videos to comment on</h3>
            <span className="text-sm text-muted-foreground">{videos.length} ready</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {videos.map((video) => (
              <Card key={video.videoId} className="glass-card border-border">
                <CardContent className="space-y-3 p-5">
                  <p className="font-medium leading-snug text-foreground">{video.title}</p>
                  <p className="text-sm text-muted-foreground">{video.channelTitle}</p>
                  <a
                    href={video.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1d4ed8]"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Open video
                  </a>
                  <div className="space-y-2 border-t border-border pt-3">
                    {video.comments.map((comment, index) => {
                      const id = `${video.videoId}-${index}`
                      return (
                        <div key={id} className="rounded-xl bg-muted/40 p-3">
                          <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">{comment}</p>
                          <Button variant="outline" size="sm" className="mt-2" onClick={() => copy(id, comment)}>
                            {copiedId === id ? <Check className="mr-1.5 h-3.5 w-3.5" /> : <Copy className="mr-1.5 h-3.5 w-3.5" />}
                            {copiedId === id ? "Copied" : "Copy comment"}
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Card className="glass-card border-border">
        <CardContent className="space-y-4 p-5">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#1d4ed8]" />
            <h3 className="ds-h3">Authority article</h3>
          </div>

          {props.isGeneratingArticle ? (
            <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Writing your authority article...
            </p>
          ) : articleError ? (
            <div className="space-y-3">
              <p className="text-sm text-destructive">{articleError}</p>
              <Button variant="outline" onClick={props.onRetryArticle}>
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                Retry article
              </Button>
            </div>
          ) : article ? (
            <div className="space-y-3">
              <p className="font-medium text-foreground">{article.title}</p>
              <p className="text-sm text-muted-foreground">{article.excerpt}</p>
              {article.saveWarning && <p className="text-sm text-destructive">{article.saveWarning}</p>}
              <div className="flex flex-wrap gap-2">
                {article.url && (
                  <Button asChild>
                    <a href={article.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                      Open live article
                    </a>
                  </Button>
                )}
                {article.url && (
                  <Button variant="outline" onClick={() => copy("article-url", article.url!)}>
                    {copiedId === "article-url" ? <Check className="mr-1.5 h-3.5 w-3.5" /> : <Copy className="mr-1.5 h-3.5 w-3.5" />}
                    {copiedId === "article-url" ? "Copied" : "Copy link"}
                  </Button>
                )}
                <Button variant="outline" onClick={() => copy("article-text", htmlToText(article.html))}>
                  {copiedId === "article-text" ? <Check className="mr-1.5 h-3.5 w-3.5" /> : <Copy className="mr-1.5 h-3.5 w-3.5" />}
                  {copiedId === "article-text" ? "Copied" : "Copy text"}
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Your authority article will appear here.</p>
          )}
        </CardContent>
      </Card>

      <Card className="glass-card border-border">
        <CardContent className="space-y-4 p-5">
          <div className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-[#1d4ed8]" />
            <h3 className="ds-h3">Facebook posts</h3>
          </div>

          {usedFallbackLink && posts.length > 0 && (
            <p className="text-sm text-muted-foreground">
              These posts use your affiliate link directly, because the article was not saved.
            </p>
          )}

          {props.isGeneratingPosts ? (
            <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating Facebook posts...
            </p>
          ) : postsError ? (
            <div className="space-y-3">
              <p className="text-sm text-destructive">{postsError}</p>
              <Button variant="outline" onClick={props.onRetryPosts}>
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                Retry Facebook posts
              </Button>
            </div>
          ) : posts.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-3">
              {posts.map((post, index) => (
                <div key={post.id} className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-[#1d4ed8]">Post {index + 1}</p>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">{post.body}</p>
                  <Button variant="outline" size="sm" className="mt-auto" onClick={() => copy(post.id, post.body)}>
                    {copiedId === post.id ? <Check className="mr-1.5 h-3.5 w-3.5" /> : <Copy className="mr-1.5 h-3.5 w-3.5" />}
                    {copiedId === post.id ? "Copied" : "Copy post"}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Your Facebook posts will appear here.</p>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
```

- [ ] **Step 4: Verify types and build**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: all succeed. If `SavedLinksPicker`'s prop type does not match, read `components/saved-links-picker.tsx` lines 7–15 and adjust the `savedLinks` prop type to the real `AffiliateLink` type rather than the `Parameters<>` shortcut.

- [ ] **Step 5: Manual end-to-end check**

Visit `/upgrades/dfy-profit`, paste a real affiliate URL, pick "Weight Loss", and generate. Confirm: 5 video cards each with copyable comments, an article with a working live link, 3 Facebook posts containing that article URL, sapphire styling only, and the Q-LAPS `WelcomeOfferBanner` visible during generation.

- [ ] **Step 6: Commit**

```bash
git add "app/(protected)/upgrades/dfy-profit"
git commit -m "feat(dfy-profit): add page, staged orchestration client, and result panel"
```

---

### Task 12: Register in navigation and the upgrades catalog

**Files:**
- Modify: `lib/premium-features.ts:4-8` and `:40-65`
- Modify: `app/(protected)/upgrades/page.tsx:10-74` and `:107`

**Interfaces:**
- Consumes: nothing
- Produces: `PREMIUM_FEATURE_LABELS.dfyProfit`, and a 5th `PREMIUM_FEATURES` entry

Adding to `PREMIUM_FEATURES` automatically flows into `components/app-sidebar.tsx`, `components/bottom-nav.tsx`, and `components/premium-upgrades-widget.tsx`, all of which map over it. `app/(protected)/upgrades/page.tsx` keeps a separate hardcoded array, so it must be edited by hand.

Do not touch `UpgradeLevel`, `UPGRADE_LEVEL_LABELS`, or `getUpgradeLevelLabel`.

- [ ] **Step 1: Add the label**

In `lib/premium-features.ts`, extend `PREMIUM_FEATURE_LABELS`:

```ts
export const PREMIUM_FEATURE_LABELS = {
  dfyVault: "Unlimited",
  instantIncome: "Instant Income",
  automatedIncome: "Automated Profits",
  protector: "Cyber Protection",
  dfyProfit: "Done-For-You Profit",
} as const
```

- [ ] **Step 2: Add the navigation entry**

Add `Package` to the existing lucide import and append to `PREMIUM_FEATURES`:

```ts
  {
    href: "/upgrades/dfy-profit",
    label: PREMIUM_FEATURE_LABELS.dfyProfit,
    description: "One link, one niche, a complete promo kit in one run.",
    icon: Package,
  },
```

- [ ] **Step 3: Add the catalog card**

In `app/(protected)/upgrades/page.tsx`, add `Package` to the lucide import and append to the `upgrades` array:

```ts
  {
    id: "dfy_profit",
    name: PREMIUM_FEATURE_LABELS.dfyProfit,
    tagline: "Your complete promo kit",
    icon: Package,
    color: "cyan",
    features: [
      "5 Videos Ready To Comment On",
      "AI Comments For Every Video",
      "Hosted Authority Article",
      "3 Ready-To-Post Facebook Posts",
      "One Link, One Niche, One Click",
    ],
    href: "/upgrades/dfy-profit",
  },
```

`isCurrentPlan` will always be false for this card, since `dfy_profit` is not an `upgrade_level` value. That matches how the `protector` card already behaves and is intentional.

- [ ] **Step 4: Widen the grid**

At line 107, change:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
```

to:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-8">
```

- [ ] **Step 5: Verify and check every surface**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: all succeed.

Then run `npm run dev` and confirm the new entry appears in all four places: the desktop sidebar "Premium Tier" list, the mobile More sheet, the dashboard "Premium Upgrades" right rail, and the `/upgrades` grid as a 5th card that fits without overflow at desktop width. Check the mobile view at 390px wide for the `pb-24` bottom-nav clearance required by `DESIGN_SYSTEM.md`.

- [ ] **Step 6: Run the full test suite and commit**

```bash
npm test
git add lib/premium-features.ts "app/(protected)/upgrades/page.tsx"
git commit -m "feat(dfy-profit): register done-for-you profit in navigation and catalog"
```

---

## Final verification

- [ ] `npm test` passes — all suites from Tasks 1, 2, 3, 4, 5, 9, 10
- [ ] `npx tsc --noEmit`, `npm run lint`, and `npm run build` all clean
- [ ] Full run with `RAPIDAPI_KEY` set produces 5 videos with AI comments, a hosted article, and 3 posts linking to it
- [ ] Full run with `RAPIDAPI_KEY` unset still produces a complete, usable kit from fallbacks
- [ ] An existing comment pack at `/article/{uuid}` still renders — the key regression
- [ ] Gold Rush at `/create` still generates comments and saves a pack, after the Task 6 refactor
- [ ] Article affiliate links fire `/api/track-click`
- [ ] No gold styling on the new page; no `EarningsBanner`
- [ ] `users.upgrade_level` and its CHECK constraint are unchanged; no migration was added
