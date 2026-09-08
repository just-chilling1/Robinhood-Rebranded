# Wifi Code — Phase 1 Product Setup

Repo: `d:\Apps\robinhood` (git `main` tracking `rebranded/main`, pulled ff-only, clean except untracked `fix-log.txt` / `supabase/.temp/`).
Framework: Next.js 16 App Router. Auth: Supabase. Built-in bypass: `BYPASS_AUTH=true` or `NEXT_PUBLIC_DEV_BYPASS_AUTH=true` via `lib/auth/dev-bypass.ts` (middleware only — page-level `getUser()` still redirects; live audit used a temp skip).
Funnel HTML: not in this repo. Money claims taken from in-app banners + Academy copy.

---

## 1.1 Product Fact Sheet

| Field | Value |
|---|---|
| Product name + one-line promise | **Wifi Code** — "Your comment helper." Page subtitle on Gold Rush: "Find viral videos, generate money-making comments, explode your traffic." |
| Price paid | Not in repo. Do not invent a checkout price in scripts. |
| Dream customer | A beginner who wants affiliate commissions without writing, filming, or building funnels — they will comment on YouTube Shorts. |
| Point A | Watching money-online videos for years, never posting, no writing skill, unsure where traffic comes from. |
| Point B | A simple daily loop: find a viral Short, paste a comment with their affiliate link, get clicks while they live their Tuesday. Banners promise scaling to one thousand — even five thousand dollars a day. |
| The vehicle | Affiliate marketing via YouTube Shorts comments (plus Facebook groups + traffic-source submissions for upgrades). |
| The mechanism | Wifi Code finds high-view Shorts and writes ready-to-post comments with the member's affiliate link already inside. |
| Unfair advantage | Removes the two beginner killers: "what do I say" and "which video do I comment on." |
| Core loop | Save a money link (optional) → Gold Rush: offer + link → find Shorts → generate comments → copy → paste on YouTube → clicks → commission. Vault stores packs. Upgrades add ready comments, Facebook posts, and 100+ traffic sources. |
| First win / activation | Generate one comment pack in Gold Rush and copy one comment. Visible result: "Your generated comments" on the card. |
| Proof inventory | No named testimonials in repo. Automated Profits subtitle claims "Our members have generated over 2.8 million visitors using these sources." Use founder-system story; do not invent named users. |
| Guarantee terms | Terms of Service: 30-day money-back guarantee on **upgrade purchases**. Refunds 5–7 business days via support. Core-product guarantee not separately stated — Video 1 mentions the money-back guarantee as promised, once, late. |
| Effort truth | Member still copies, pastes, and posts by hand on their own accounts. First week is quiet. Dashboard tip: consistency beats one-off spikes. Instant Income on-screen: post 3–5 groups/day. Gold Rush: comments on Shorts with 10k+ views (dashboard tip). |

---

## 1.2 Branding map (old / internal → current user-facing)

| Old / internal / banned | Current user-facing |
|---|---|
| robinhood, RH, rhmemberarea, commentai, p55account, p55 | Wifi Code |
| Neural, AI Content Scout, Neural Comment Generator, Charge HQ | never say these |
| Getting Started video | Watch This First |
| Accelerator / DFY Vault / dfy-vault | Unlimited |
| Recurring Stream / Recurring Streams / Social Payouts | Instant Income / Automated Profits (see premium map) |
| Sales Offer Generator, Offers Library, Links Library, X-Power Promotions, BatteryProfits, BlackBox Cash | other products — banned |
| Your pages (legacy redirect copy in unused `page-generator.tsx`) | My Vault / Your Comment Vault |
| Protector (old other-product panel "Wealth Protector") | Cyber Protection |
| Sidebar "Your links" vs page "Link Vault" | Navigate via **Your links**; on-page title is **Link Vault** (eyebrow: Money Link Storage) |
| Mobile tab "Vault" / "Home" | Desktop sidebar: My Vault / Dashboard (Home) |
| Premium section label | Sidebar: **Premium Tier** · Dashboard right rail: **Premium Upgrades** |

Scripts use ONLY the current column.

---

## 1.3 UI inventory (exact labels)

### Sidebar (desktop, top → bottom)

**Header:** Wifi Code / Your comment helper

**Main Functions**
- Dashboard — Home (`/dashboard`)
- Gold Rush — Make comments (`/create`)
- My Vault — Your saved comments (`/pages`)
- Your links — Saved affiliate links (`/share`)
- Academy — Training videos (`/training`)

**Premium Tier**
- Unlimited
- Instant Income
- Automated Profits
- Cyber Protection

**Exclusive Offers**
- Create your Q-LAPS2000 account → Create Now → `https://jvz4.com/c/3547097/442443/`
- Watch this Free training → Watch Now → Convertri free training URL
- Create your Cashapp Account → CashTap AI → `https://jvz1.com/c/3547097/443257/`

**Footer:** Support · Exit Platform

Mobile bottom tabs: Home, Gold Rush, Vault, Academy, plus More sheet with Exclusive Offers.

### Dashboard / Home (main column, rendered top → bottom)

1. Eyebrow **Home**. Title **Welcome to Wifi Code** (+ first name if profile). Subtitle: "Watch the three videos below in order — then jump into Gold Rush and start earning. The Academy is there whenever you want a deeper walkthrough."
2. **Start Here** + video 1 **Watch This First** ("Click to Play Video")
3. **BonusTrainingCard** (gold free-training card)
4. Video 2 **How The Money Flows**
5. **BonusTrainingCard** again
6. Video 3 **Your 5-Minute Tour**
7. Button **Get Started Now with Gold Rush**
8. Button **Know More from the Academy**
9. Banner **Need Help?** / **24/7 Priority Support** / **Contact Support**

**Right rail (xl, right side — not left):**
- **Contact Support** form (Your email, Your message, **Send message**). Copy: usually reply within about 2 hours; allow 24–48 hours busy periods.
- Tips widget (rotating). First tip: "Post comments on videos with 10k+ views for better reach." Footer: "Individual results vary."
- **Premium Upgrades** — "Unlock the tools that drive the biggest results." Cards: Unlimited, Instant Income, Automated Profits, Cyber Protection.

**Video overlay ad** (under any playing training video): Account Verified · Congratulations! You're eligible to withdraw $416.34 · **Withdraw Now** → JVZoo (different offer — do not treat as the Video 01 CTA).

### Gold Rush (`/create`)

- Eyebrow **Gold Rush**. Title **Gold Rush Generator**.
- Steps: **1 Your Offer** · **2 Find Videos** · **3 Get Comments**
- Card **Add your affiliate link** / "What are you promoting today?" Badge `{n}/3 ready`
- Fields: **Product/Offer Name** · **What does your product do?** · **Your Affiliate Link**
- Hint: DigiStore24 or ClickBank
- If saved links exist: **Use a saved link** · **Manage in Link Vault** · **Or paste a new link below**
- Helper (right of form, BETWEEN header and — wait: on xl it's a 5-col grid: form col-span-3 LEFT, aside col-span-2 RIGHT). Aside **How it works**: Drop in your offer / We find viral Shorts / Copy comments that sell. Then **What you walk away with**.
- CTA **Find Viral Opportunities** (disabled until 3 fields valid)
- Step 2 tabs: **Hot in Your Niche** · **Search by Niche**
- Buttons: **Find Viral Videos for My Product** / **Search Viral Videos** / **Change Product**
- Loading: **AI finding videos for your niche...** + GenerationProgress ("This usually takes a few seconds." / **While you wait** + EarningsBanner)
- Results: `{n} videos to comment on` · "AI-matched to your product · sorted by views"
- Per card: SHORT · Views · Viral Score /100 · Est. Clicks · **Generate Comments** (becomes Generating...) · Open Video
- Loading comments: **AI writing your money-making comments...** + EarningsBanner under progress
- After: **Your generated comments** · **Open Video** · **Copy** / **Copied**
- Empty: **No videos found** · **Try Again** · **Back to Step 1**

### My Vault (`/pages`)

- Eyebrow **My Vault**. Title **Your Comment Vault**. CTA **Generate New Pack**
- Empty: **Your Vault is Empty** · Generate / Copy / Paste steps · **Start Making Packs Now**
- Filled: **How to use a pack** — View comments / Open the Short / Paste & post
- Pack stats: Comments · Opens · Copies · Created
- Buttons: **View Comments** / **Hide Comments** · **Open Video** · trash · **Copy** / **Copy All** / **Copied!**
- Delete dialog: **Delete this pack?** · **Keep It** · **Delete**
- Compact EarningsBanner every 2nd pack (static list, NOT a generation wait)

### Your links / Link Vault (`/share`)

- Eyebrow **Money Link Storage**. Title **Link Vault**
- CTA **Add New Affiliate Link**
- Empty: **No affiliate links yet** · **Add your first link**
- Form: Niche / category · Offer name · Your affiliate link · Notes · **Save link** / **Save changes** · Cancel
- Headings: **Add your money link** / **Edit your money link**
- Card buttons: **Copy** / **Copied** · **Open** · **Edit** · **Delete**
- **Link Vault Pro Tips**: Organize by niche · Test multiple offers · Track your clicks · Aim higher ticket ("Offers $100+ usually mean more serious commissions.")
- Compact EarningsBanner every 2nd card — NOT a wait state

### Academy (`/training`)

- Eyebrow **Academy**. Title **Training**
- **Platform Tutorials**: Gold Rush Training · My Vault Training
- **Quick reference** 3 steps: Gold Rush / My Vault / Your links
- **Premium Feature Tutorials**: Unlimited Training · Instant Income Training · Automated Profits Training · Cyber Protection Training
- **Launch checklist** · **Pro tips**
- CTA: **Ready to make your first comment pack?** · **Get Started Now with Gold Rush** · **Get help**

### Unlimited (`/upgrades/dfy-vault`)

- Title **Unlimited**. Training video at top.
- **How it works** + **What you wait away with** BEFORE the form (two-column, then form below).
- Form **Select Your Product** `{n}/2 ready` · **Product Name** · **Affiliate Link** · **Unlock Unlimited Library**
- 4s wait: **Unlocking your Unlimited library...** + WelcomeOfferBanner (Q-LAPS, not Convertri)
- After: **Promoting** · **Change Product** · Search videos... · **All Niches** · **5 ready comments** · Copy · **Open Video**
- Live search wait: **AI finding fresh viral videos...** + WelcomeOfferBanner

### Instant Income (`/upgrades/instant-income`)

- Title **Instant Income: Facebook Posts**
- Training video, then **How to Use This (3 Simple Steps)**: Pick Your Niche · Enter Your Link · Copy & Post ("Post 3-5 times per day")
- **How to Find & Post in Facebook Groups** — on-screen numbers: join 10-15 groups with 5,000+ members; post 3-5 different groups per day; best times 7-9 AM, 12-1 PM, 7-9 PM; reply within 1 hour
- **Get Your Posts Now** · **Step 1: Choose Your Niche** (All Niches, Weight Loss, Make Money Online, Health & Fitness, Beauty & Skincare, Relationships, Tech & Gadgets, Pets, Home & Garden)
- **Where to Get Your Affiliate Link** · DigiStore24 · **Create Free DigiStore24 Account →**
- **Step 2: Enter Your Affiliate Link** — generate button **disabled** until URL entered
- Dynamic CTA: **Show Me My {N} Posts!** / **Generating Your Posts...**
- Wait ~4.5s: **Personalizing {N} posts with your affiliate link...** + WelcomeOfferBanner
- Ready: **Your {N} Posts Are Ready!** · button **Copy This Post** (not "Copy Post") / **Copied! Now Paste in Facebook**

### Automated Profits (`/upgrades/automated-income`)

- Title **Automated Profits — Hands-Free Traffic**. Subtitle includes **100+ Free Traffic Sources** and **2.8 million visitors**
- **How This Works (Super Simple!)**: Pick Your Niche · Submit Your Link · Get Automatic Traffic
- Pro Tip: 2-3 hours; most members submit to 50+ sources in their first week
- **Enter Your Page URL:** · **Save My Link →** / **Saving Your Link...** / **Link Saved ✓ — Update It Anytime**
- Wait: **Inserting your link into 100+ submission descriptions...** + WelcomeOfferBanner
- Niches: All, Weight Loss, Make Money Online, Health & Fitness, Tech & Gadgets, Beauty & Skincare, Relationships, Pets, Home & Garden
- Niche switch wait: **Finding the best {niche} traffic sources for you...**
- **Your Progress:** `{done} of {total} sources completed`
- Card: **View Instructions** · dialog **Go To Site** · **Mark Complete** / **Completed** · **Step-By-Step Instructions:** · **Use This Description When Submitting:**

### Cyber Protection (`/upgrades/protector`)

- Eyebrow **Security**. Title **Cyber Protection**. Badge **All Systems Secure**
- Training video, then 4 stats: **Protection** (Strong/Good) · **Account Status** · **Security** Bank-level · **Availability** Always On
- **Security Checks** (6): Account Verified · Secure Connection · Session Protected · Data Encryption · Platform Status · API Connectivity — tags Verified / Pending
- Right: **Account Info** (Name, Email, Premium Tier, Membership, Auth, Member since, Last login, Account ID) · **Recent Activity**
- No generation wait. ZERO free-training ads.

### Support (`/support`)

- **Support portal** · **Open Support Portal**
- **Email support** · **Send Email** · Robinhood@neoai.freshdesk.com

---

## 1.4 Free-training / offer surfaces (do not mix destinations)

| Surface | Verbatim copy | CTA | Destination | Where |
|---|---|---|---|---|
| A. BonusTrainingCard | Badge **Free Training**. Headline **Wake up to an extra $1,000–$5,000**. Sub: deposited without a 9-to-5. Benefits: No experience needed · Step-by-step · 24/7 automation. **100% Free — No credit card required** | **Yes! Show Me How To Earn $1,000–$5,000 A Day** | Convertri everwebinar (`FREE_TRAINING_URL`) | Dashboard BETWEEN videos (after video 1, after video 2) |
| B. EarningsBanner | Badge **Free Training**. **Wake Up With An Extra $1,000–$5,000 In Your Bank Account Tomorrow**. Scale without extra work. Scarcity: **Warning: This will be taken down soon** | **Watch The Free Training >>** | Same Convertri URL | Gold Rush waits + after generate; compact in Vault/Links lists |
| C. Sidebar Exclusive Offers | **Watch this Free training** | **Watch Now** | Same Convertri URL | Left sidebar (always) |
| D. Contact Support success | free training · $1,000–$5,000 · taken down soon | **Watch The Free Training >>** | Same Convertri URL | Right-rail form after send |
| E. WelcomeOfferBanner | Badge **You've Been Selected**. **Limited Free Training — Learn How To Make $1,000–$5,000 Per Day**. Fully automated · 20 minutes per day. Scarcity: **Warning: Only a few free spots remaining** | **Claim My Free Spot >>** | Q-LAPS JVZoo `https://jvz4.com/c/3547097/442443/` | Premium waits (Unlimited / Instant Income / Automated Profits) — NOT the Convertri webinar |
| F. Video overlay | Account Verified · withdraw $416.34 | **Withdraw Now** | Different JVZoo | Under playing videos — not Video 01 CTA |

**Spoken pitches**
- Convertri (A–D): scale this system to one thousand — even five thousand dollars a day. Button language must match the surface you're pointing at.
- Q-LAPS (E): "You've Been Selected" gold banner · **Claim My Free Spot**. Do not say "Watch The Free Training" on premium wait screens.

**Video 01 CTA placement (real):** After Watch This First, the gold **BonusTrainingCard** is directly below the video. Also valid: sidebar Exclusive Offers → Watch this Free training. Prefer the card under the video because it is on the Home layout they are staring at. Never invent a banner *inside* the video player except the Withdraw overlay (which is a different offer).

---

## 1.5 Loading states → mention map

| Video | Wait / CTA used | Banner |
|---|---|---|
| 01 Buyer's Remorse | Dashboard BonusTrainingCard under video 1 | A — Yes! Show Me How To Earn $1,000–$5,000 A Day |
| 02 Disconnect | Gold Rush comment-generation wait (story/walkthrough beat) | B — Watch The Free Training >> under progress, below "While you wait" |
| 03 Quick Overview | none (01 already used Home CTA) | ZERO |
| Gold Rush mindset | none | ZERO |
| Gold Rush how-to | Find videos OR Generate Comments wait | B |
| My Vault mindset + how-to | no generation wait | ZERO (grep "free training") |
| Link Vault mindset + how-to | no generation wait | ZERO |
| Unlimited mindset | none | ZERO |
| Unlimited how-to | Unlock Unlimited Library (~4s) | E — Claim My Free Spot >> |
| Instant Income mindset | none | ZERO |
| Instant Income how-to | Show Me My N Posts wait | E |
| Automated Profits mindset | none | ZERO |
| Automated Profits how-to | Save My Link wait | E |
| Cyber Protection mindset + how-to | none | ZERO |

---

## 1.6 Video roster (includes mindset video per feature)

Owner request: **a mindset video for each feature**, watched immediately before that feature's how-to.

Mindset videos: academy voice, ≥900 words, NO click-by-click walkthrough, NO ads, belief/identity/effort for THAT feature only. Opener: `[excited] Hey — before we click a single button in [Tool]...` Sign-off: `I'll see you in the next one!` (except none is final).

How-to videos: full academy series rules. Gold Rush how-to = first in-depth training opener. Cyber Protection how-to = final (`And that was all for the training .. I'll see you inside`). Premium how-tos numbered: first Unlimited, second Instant Income, third Automated Profits, fourth/final Cyber Protection.

| # | File | Track | Feature | Length |
|---|---|---|---|---|
| 1 | `01-buyers-remorse.md` | Dashboard | — | 10+ min ≥1600 |
| 2 | `02-disconnect.md` | Dashboard | — | 10+ min ≥1600 |
| 3 | `03-quick-overview.md` | Dashboard | whole app shallow | 3–5 min ~450–750 |
| 4 | `04-gold-rush-mindset.md` | Academy | Gold Rush mindset | ≥900 |
| 5 | `05-gold-rush.md` | Academy | Gold Rush how-to (first) | ≥900 |
| 6 | `06-my-vault-mindset.md` | Academy | My Vault mindset | ≥900 |
| 7 | `07-my-vault.md` | Academy | My Vault how-to | ≥900 |
| 8 | `08-link-vault-mindset.md` | Academy | Link Vault / Your links mindset | ≥900 |
| 9 | `09-link-vault.md` | Academy | Link Vault how-to | ≥900 |
| 10 | `10-unlimited-mindset.md` | Academy | Unlimited mindset | ≥900 |
| 11 | `11-unlimited.md` | Academy | Unlimited how-to (1st premium) | ≥900 |
| 12 | `12-instant-income-mindset.md` | Academy | Instant Income mindset | ≥900 |
| 13 | `13-instant-income.md` | Academy | Instant Income how-to (2nd premium) | ≥900 |
| 14 | `14-automated-profits-mindset.md` | Academy | Automated Profits mindset | ≥900 |
| 15 | `15-automated-profits.md` | Academy | Automated Profits how-to (3rd premium) | ≥900 |
| 16 | `16-cyber-protection-mindset.md` | Academy | Cyber Protection mindset | ≥900 |
| 17 | `17-cyber-protection.md` | Academy | Cyber Protection how-to (final) | ≥900 |

---

## Jargon Ledger (Disconnect Beat 5 — top 8)

| Term | ≤15-word definition | Everyday analogy | Why you care |
|---|---|---|---|
| Affiliate link | Your personal tracking URL. A purchase through it pays you. | A store coupon with your name on it | Without it in the comment, you did the work for free |
| Commission | The cut the vendor pays you for a sale you referred | The tip you get for sending a friend to a shop | This is the actual money |
| Niche | The topic aisle you comment in (keto, crypto, pets) | The store aisle you stand in | Wrong aisle = comments that feel random |
| YouTube Short | A vertical video people swipe on YouTube | A 30-second clip on a phone | That's where the traffic already is |
| Comment pack | A set of ready comments Wifi Code wrote for one Short | A handful of sticky notes, each a different opener | You copy one, you post, you don't brainstorm |
| Viral Score | 0–100 guess of how likely the Short keeps getting views | A "this restaurant is busy" rating | Higher score = more eyes that might see you |
| Gold Rush | The page that finds Shorts and writes the comments | The kitchen that plates the meal | Core engine of Wifi Code |
| DigiStore24 | A free marketplace of products you can promote | A mall of vendors handing you tracking links | Fastest way to get a real affiliate URL |

Also useful later (glossary only, not all in Jargon School): ClickBank, My Vault, Link Vault, Est. Clicks, Opens vs Copies.

---

## Money Map

1. A vendor sells a product on DigiStore24 / ClickBank / similar.
2. You get an **affiliate link**. When someone buys through it, the network pays you a **commission**.
3. Strangers are already watching **YouTube Shorts** in that **niche**.
4. Weakest link (what beginners fail): picking the right Short + writing a comment that sounds human and includes the link.
5. Wifi Code's job: Gold Rush finds the Shorts and writes the **comment pack** with your link inside.
6. You copy, paste, post on your own YouTube account (the honest work).
7. A viewer clicks your link → buys → commission lands.

Doubt that needs the most airtime: "comments on random videos actually make money?"

Master analogy: you're not building a store. You're putting a handwritten note on a crowded bulletin board that already has a line out the door — the board is YouTube Shorts; the note is your comment; the coupon on the note is your affiliate link.

---

## First Win

Tonight: open Gold Rush, fill Product/Offer Name + what it does + affiliate link, hit Find Viral Opportunities, generate comments on one Short, hit Copy on one comment. That's the activation event.

---

## On-screen numbers (scripts must not contradict)

- Dashboard tip: comment on videos with **10k+ views**
- Instant Income: **3–5** posts/groups per day; join **10–15** groups with **5,000+** members; times **7–9 AM / 12–1 PM / 7–9 PM**; reply within **1 hour**
- Unlimited: **5** ready comments per video; library count is dynamic (`{n} pre-loaded viral videos + 5 comments each`)
- Automated Profits: **100+** sources; **2.8 million** visitors claim; **2–3 hours** batch; **50+** sources first week; **5–15 minutes** per site
- Link Vault tip: offers **$100+**
- Support: **2 hours**, allow **24 to 48 hours** on busy days (academy support-close verbatim)
- GenerationProgress: "This usually takes a few seconds."
- Banner dollars: **$1,000–$5,000** a day

---

## Mindset video beat sheet (every mindset file)

1. Hook — the belief that kills this feature
2. Why this page exists (one short breath — not Disconnect's full loop)
3. Wrong mindset vs right mindset (3 shifts)
4. How winners show up (habits/identity, not clicks)
5. One emotional-stakes line tying the tool to their life
6. Hand-off: next video is the click-by-click · `I'll see you in the next one!`

No UI walkthrough. No free-training. Named example allowed as a thought experiment, not a second money-loop.
