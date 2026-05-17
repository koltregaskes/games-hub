# Pages — GameTrackDaily Arcade

> Page-by-page specification. Cross-reference with `source/arcade/pages-*.jsx` for the exact composition. Data field names below match `source/arcade/data.js`; map them onto the real manifests in `gametrackdaily/data/*.json` when porting.

## Shared chrome (every page)

Top of every page, in order:

1. **Top marquee** (`Marquee` component) — auto-scrolling ticker, 11px mono, bone-on-black. Items rotate through: live launches, days-to-next-event, our slate updates, total counts. Pause on hover.
2. **Nav** (`Nav` component) — sticky 2px-bordered bar with brand mark on the left, 5 nav links centred, live time pill on the right. Current page inverted.
3. **Page body** — content per page, max-width 1480px, 24px gutter.
4. **Footer** — 2-column mono strip with brand line on the left, © notice on the right.
5. **Bottom marquee** — only on Home (`marquee--brand` variant, red background, bone text).

---

## 01 · Home

**Route:** `/` (or `#/home` in the prototype)
**Source:** `source/arcade/pages-home.jsx`

### Purpose
The editorial watch desk's front page. Show what's launching right now, this week's card, the two-week horizon, the studio's own slate, and the latest signal from the news rails.

### Layout

| Section            | Notes |
|--------------------|-------|
| **HERO**           | 2-column grid: countdown + main-event poster |
| **Live metric strip** | 4-column stat grid: tracked titles, this-week count, events queued, our slate size |
| **Round 01** | This week's fight card — full-width rows |
| **Round 02** | Two-week horizon — 2×2 VS cells |
| **Roster** | Studio's 7 games — 4-up grid then 3-up grid |
| **Wire** | Four news rails — 4 columns |

### Hero — live countdown

Left column:
- Eyebrow: `● Next drop · T-minus` (red dot)
- Massive countdown numerals: `DD d HH h MM m SS s` — the seconds tick in real time
- Display headline: title of the next dropping release (`.glitch` hover effect)
- `OURS` brand chip if applicable
- Platform chips + launcher list + genre eyebrow
- Two CTAs: brand-red "See the release schedule →" and ghost "Tonight's events"

Right column (the poster):
- A bordered card with the next drop's hero image
- `LIVE TRACK` tag pinned top-left
- `MAIN EVENT` mono label pinned bottom-left over the image
- Below the image: launch window eyebrow + display headline ("Tonight at 22:00 BST")

### Data needed
- `nextDrop()` — earliest future release after now
- `RELEASES` — full schedule
- `STUDIO` — studio roster (the 7 games)
- `NEWS` — items grouped by `feed` (dev / gaming / review / preview)

### Notable details
- **Glitch on display headlines.** Hovering a display headline triggers a 0.4s steps(2) animation that splits its text-shadow into platform colours. CSS only.
- **Live metric stat colours**: Tracked = bone, This week = brand red, Events = PC amber, Our slate = Xbox green. Demonstrates the colour system on the first scroll.
- **Round 02 cells** alternate side (`side === 'L'` vs `'R'`) — left-cells left-align text, right-cells right-align. The two cards within a 2×1 row read as opponents on a VS card.

---

## 02 · Releases

**Route:** `/releases`
**Source:** `source/arcade/pages-releases.jsx`
**Data source (production):** `gametrackdaily/data/release-calendar.json`

### Purpose
The full tracked release schedule. The page the user wants for "what is launching when on which platform". Must support fast filtering by platform.

### Layout

| Section          | Notes |
|------------------|-------|
| **Hero**         | Eyebrow + display headline + lede paragraph |
| **Filter row**   | All / PC / Xbox / PS5 / Ours buttons + list/grid view toggle |
| **Grouped slate**| One section per month with section heading and rows or cards |
| **Platform legend** | 4-column legend explaining each platform colour + the launcher families it includes |

### Filter behaviour

Five buttons:
- **All** — bone outline, all releases visible
- **PC** — amber outline, only releases including `pc` platform
- **Xbox** — green outline, only releases including `xbox`
- **PS5** — blue outline, only releases including `ps`
- **Ours** — red outline, only `ours: true` releases

When a filter is active, the button fills with its colour and text inverts to `--bg`. Filter is client-side and instant — no page reload.

### View toggle

- **List view** (default) — full-width rows, dense, sortable
- **Grid view** — 3-up cards, each with platform-coloured top stripe

### Row anatomy (list view)

Grid `44px | 84px | 1fr | 1fr | 200px | 60px`:

1. Platform-coloured numbered cell (e.g. green "01" if Xbox is primary)
2. Date block (DD / MON)
3. Title + genre eyebrow (display headline)
4. Launcher list (Steam · GOG · Epic …)
5. Platform chips
6. Right arrow in the platform colour

If `release.ours` is true:
- Row background tinted brand red at 10% alpha
- Title gets a brand-red ★

### Data needed

Each release entry shape:
```ts
{
  id: string,
  title: string,
  date: "YYYY-MM-DD",
  platforms: ["pc" | "xbox" | "ps" | "browser", ...],   // first one drives the stripe colour
  launcher: ["Steam", "Game Pass", "PS Store", "itch.io", ...],
  hype: "high" | "med" | "low" | "ours",
  ours?: boolean,
  genre: string,
  _example?: boolean,   // currently true for non-studio items pending live data
}
```

Map this onto the existing `release-calendar.json` shape — note that the production manifest currently does not have `launcher` or `hype` fields. Add them, or fall back gracefully.

### Notable details
- Months without releases under the active filter are hidden entirely.
- The view-toggle remembers state per-mount (useState). No persistence needed for v1.
- "HIGH SIGNAL" tag appended after the genre eyebrow for `hype === 'high'` entries — orients the user without an explicit hype number.

---

## 03 · Events

**Route:** `/events`
**Source:** `source/arcade/pages-events.jsx`
**Data source (production):** events array inside `gametrackdaily/data/release-calendar.json`

### Purpose
Conferences, showcases, awards — watch links, countdowns, local times. Built around the Summer Game Fest week which is the densest part of the calendar.

### Layout

| Section | Notes |
|---|---|
| **Hero**           | Eyebrow + 3-line stacked display headline |
| **Next event bar** | A wide card: brand-red date block on the left, title + countdown + platform chips in the middle, brand "Watch event" button on the right |
| **Summer Game Fest** | A 3×2 grid of event cards covering Jun 03–08, plus rows for any overflow |
| **July** | A row stack of events |
| **Gamescom** | A 2-column card grid |
| **Awards** | A row stack |

### Event card anatomy

Each card:
- Top stripe in the primary platform's colour
- Date corner: large day numeral + month label
- Kind tag (SHOWCASE / CONFERENCE / AWARDS) — or `LIVE` pulse if currently airing
- Display title with glitch hover
- Where label + body note
- Platform chips bottom-left, ghost "Watch →" button bottom-right

### Event row anatomy

Grid `12px | 100px | 1fr | 1fr | 220px | 110px`:

1. Platform-coloured edge stripe
2. Date column (centered day + month)
3. Title + where eyebrow
4. Compact countdown (`T-DDd HHh MMm`)
5. Platform chips
6. Ghost "Watch →" button

### Data needed

Each event:
```ts
{
  id: string,
  title: string,
  date: "YYYY-MM-DD",
  startAtUTC: "YYYY-MM-DDTHH:mm:ssZ",  // optional — falls back to T18:00:00Z
  endDate?: "YYYY-MM-DD",
  kind: "conference" | "showcase" | "awards",
  platforms: ["pc" | "xbox" | "ps", ...],
  where: string,                       // "Online" | "Koelnmesse · Cologne" | etc
  note: string,                        // 1-sentence detail
  watch: string,                       // URL to the official event/stream page
}
```

### Notable details
- "LIVE" state: when `Date.now()` is within 30 minutes of `startAtUTC`, the card gets brand-red tinted background and a `LIVE` pulse tag.
- Countdown ticks every second on every visible event — see `Countdown` component. For performance on a static page, consider rendering countdowns only for the next 6 events and using `setInterval` once at the page level.
- All times shown in **BST**. The notes field carries the original PT time and the BST conversion ("4:00 pm PT → midnight BST"). Keep this convention.

---

## 04 · News

**Route:** `/news`
**Source:** `source/arcade/pages-news.jsx`
**Data source (production):** `gametrackdaily/data/games-news.json`

### Purpose
Curated news wire across 4 rails: Game Dev · Gaming · Reviews · Previews. Each rail has its own identity colour. Filtered to PC, Xbox, PlayStation only.

### Layout

| Section | Notes |
|---|---|
| **Hero** | Eyebrow + headline + lede |
| **Tabs** | All rails / Dev / Gaming / Reviews / Previews — each tab in its rail colour |
| **Provisional disclosure** | Dashed-border strip ("◇ PROVISIONAL — items shown are examples in the brand voice") — required while the live pipeline is empty |
| **Rail block × N** | Header (colour swatch + title + lede) → rows of news items → source attribution + archive link |

### Rail identity colours

| Rail     | Colour token | Used for                                                |
| -------- | ------------ | ------------------------------------------------------- |
| Dev      | `--pc`       | amber — engine/tooling/craft                            |
| Gaming   | `--brand`    | red — platforms/industry/studios                        |
| Reviews  | `--xbox`     | green — final scored verdicts                           |
| Previews | `--ps`       | blue — unscored first looks                             |

Note these are **rail colours**, not platform colours, even though they reuse the same tokens. Inside a Reviews-rail row, an individual review item may still carry its own platform chips (e.g. an Xbox-only review). That's fine — readers learn to read the rail header colour separately from the in-row platform chips.

### News row anatomy

Grid `12px | 110px | 1fr | 220px | auto`:

1. Rail-coloured edge stripe
2. Age label ("2h", "1d") + tag eyebrow ("engine", "platform", "review")
3. Display headline + source + score (if review)
4. Platform chips (if known)
5. Right arrow in the rail colour

### Data needed

Each news item:
```ts
{
  feed: "dev" | "gaming" | "review" | "preview",
  t: string,                             // title
  src: string,                           // outlet name
  h: string,                             // human-friendly age, e.g. "2h", "1d"
  tag: string,                           // sub-category
  platforms?: ["pc" | "xbox" | "ps", ...],
  score?: number,                        // /10 (or /100 — normalise)
  _example?: boolean,
}
```

The production manifest currently has `items: []` for every rail. Render the disclosure until items land.

### Notable details
- Source attribution is always shown (`source · age`). Never strip it.
- The score normalisation handles both `/10` and `/100` outlet conventions: `score > 10 ? Math.round(score / 10) : score`.
- The provisional disclosure stays until **all four** rails have items. After that, drop it.

---

## 05 · Reviews

**Route:** `/reviews`
**Source:** `source/arcade/pages-reviews.jsx`
**Data sources (production):**
- `gametrackdaily/data/games-news.json` (review + preview items)
- `gametrackdaily/data/reviews-manifest.json` (review-literacy section)

### Purpose
Curated outlet reviews and previews **plus** a "how we read scores" literacy section. The user explicitly does not want house reviews — this page is about reading the wider press critically, not writing verdicts.

### Layout

| Section | Notes |
|---|---|
| **Hero** | Eyebrow + headline + lede |
| **Featured verdict** | 2-column hero card: poster art with score stamp + verdict pull-quote on the right |
| **More reviews** | 3-up grid of review cards with mini score stamps |
| **Previews & first-looks** | Row stack of preview rows |
| **How we read scores** | 2-up + 3-up literacy cards |

### Featured verdict card

Big 2-column card (1.1fr / 1fr):
- Left: image fills the panel, top-left brand-red `FEATURED VERDICT` tag, bottom-right rotated 120px score stamp
- Right: outlet/age eyebrow, big glitch headline (~3rem), brand-red 3px-left-bordered pull-quote, platform chips, brand button "Read at [outlet] →"

### Review card (grid)

3-up cells:
- Top stripe in the Reviews rail colour (`--xbox` green)
- Source + age eyebrow top-left, 50px score stamp top-right
- Display headline
- Platform chips bottom-left, "Read →" eyebrow bottom-right

### Preview row

Same shape as a news row but with rail colour `--ps` blue, and a static `PREVIEW · UNSCORED` eyebrow instead of an age.

### Literacy cards

Read directly from `reviews-manifest.json` → `sections[]`. Each card has:
- Big brand-red numeral (01, 02, …)
- Display title (e.g. "How To Write A Game Review")
- Body summary
- Brand-red eyebrow: "Read the guide →"

### Data needed

Reviews & previews: the `feed === 'review'` and `feed === 'preview'` items from `games-news.json`.

Literacy: the existing `sections` array from `reviews-manifest.json`. The prototype includes a 5-section starter mirror in `data.js` → `REVIEW_LITERACY`.

### Notable details
- Score stamp uses `transform: rotate(-4deg)` to feel hand-stamped. Always tilted slightly. Featured stamp is rotated harder (-6deg) and larger (120px).
- The pull-quote on the featured verdict is **synthetic** in the prototype — when implementing for real, decide whether to extract a real quote from the source article or omit the quote entirely.

---

## Not designed yet

These pages exist in the repo but weren't part of this design pass. Apply the same system when implementing them:

- `game-development.html` — public-safe craft reference. Suggest: literacy-card grid in the same style as the Reviews-page literacy section.
- `news-development.html`, `news-gaming.html`, `news-reviews.html`, `news-previews.html` — single-rail full pages. Suggest: reuse the rail-block layout from News with the matching colour identity, plus a fuller history beneath.
- A per-game detail page (drilling in from a roster card or release row). Suggest: page hero with full poster art + brand-red metadata bar + system-driven content blocks (releases for this game, news for this game, reviews for this game).

Discuss with Kol before designing these.
