# GameTrackDaily — Strategic Scope Brief

**Status:** v1 DRAFT, awaiting Kol's review and amendment
**Last updated:** 2026-05-16
**Author:** Claude (website manager)
**Purpose:** Capture the strategic context for `games-hub` so future design + content briefs (especially Claude Design handoffs) start from a shared understanding.

This is **not** a design brief and not an implementation plan. It is the "what is this site, why does it exist, what does it need from outside" layer.

---

## Product identity

**Repo:** `games-hub` (on disk at `W:\Websites\sites\games-hub`)
**Public brand:** GameTrackDaily
**Studio context:** E-lusion Studios — Kol's umbrella for game prototypes
**Domain:** TBD (no CNAME committed; per Kol's policy domains are decided after the site proves itself)
**Stack:** Static HTML + vanilla CSS/JS (per existing structure: `app.js`, per-page `.html` files, `assets/`, `data/`)
**Deploy:** GitHub Pages from the public repo

**One-sentence pitch:** GameTrackDaily is an editorial watch desk where Kol's own game prototypes share space with curated industry signals — releases, news rails, reviews, previews, events — so the studio's work is read in dialogue with the wider games landscape.

---

## What lives here

The hub already has the structural skeleton in place:

- `games.html` — the full lineup of Kol's own game prototypes
- `game-development.html` — public-safe craft / reference content
- `news.html` — landing page for four news rails
- `news-development.html`, `news-gaming.html`, `news-reviews.html`, `news-previews.html` — the four rails
- `reviews.html` — review/previews coverage navigation
- `calendar.html` — release schedule
- `events.html` — conferences, showcases, awards, watch links
- `index.html` — homepage built around launch radar, live signals, featured candidates

The private operational counterpart (manager console, leak-check, internal launch controls) lives **outside this repo**, NOT in `sites/`.

---

## Why this site exists

Three converging needs:

1. **Studio portfolio.** Kol has ≥ 7 game prototype repos under E-lusion Studios:
   - `turbo-vector` — top-down arcade racer
   - `neon-district` — cyberpunk isometric shooter
   - `starfall-protocol` — sci-fi third-person action
   - `redline-horizon` — retro road-racer
   - `civicrise` — modern city-builder
   - `mandate-2029` — political strategy
   - `swarmbreaker` — arcade defence shooter
   Plus the archived `isometric-city`. The studio needs a single public face that links to playable demos, repos, and release pages.

2. **Editorial watch desk.** Kol cares about games as a category — release calendars, what's launching when, what the press is saying. GameTrackDaily aggregates that signal alongside Kol's own work, so visitors arrive for the news and discover the studio.

3. **Sustainable cadence.** Most indie portfolios are static and die. The news rails + calendar + events give the site continuous reasons to come back, even when the studio isn't shipping.

---

## Differentiator (vs the obvious competitors)

| Site type | What they do | What GameTrackDaily does differently |
|---|---|---|
| Indie portfolio (itch.io profile, personal page) | Static list of games | Editorial layer around the games — news rails, calendar, events |
| Games news aggregator (IGN, Eurogamer, RPS) | Industry coverage | First-person curation by an indie developer, not staff writers |
| Studio site (Hello Games, Supergiant) | Just the studio's own games | Studio + curated outside coverage, in the same view |
| Release calendar (RawG, IsThereAnyDeal) | Comprehensive listings | Opinionated subset — what Kol's actually tracking |

The combination of **studio portfolio + curated industry watch desk + indie-dev perspective** is the gap.

---

## Content sources Claude Design needs to know about

To design pages that actually have content to display, these are the inputs:

### Kol's own games

The 7+ game prototype repos under `github.com/koltregaskes`. Each repo has its own README, demo URL, screenshots. The lineup page (`games.html`) should pull from a manifest — likely `data/games.json` or similar — that lists each game's title, status (concept / prototype / playable / shipped), demo URL, repo URL, hero image, short description.

**Action item for Codex (separate from this brief):** confirm whether such a manifest already exists in `data/` and ensure each game entry has the fields a designer would expect.

### News rails

Four rails:
- **Game Dev News** — production / tooling / engine news (Unity, Unreal, Godot, AI in game dev, etc.)
- **Gaming News** — industry, business, releases, controversies
- **Games Reviews** — curated coverage from the wider games press
- **Games Previews** — early-look / hands-on coverage

Sources unspecified in the existing repo. Likely candidates: RSS feeds from gaming publications, GitHub releases for engine tools, X/Reddit signals. **TBD with Kol.**

### Release calendar

External release dates, sourced manually or from a service like RawG / IGDB. Kol's own releases live here too.

### Events

Conferences (GDC, Develop:Brighton, Gamescom, etc.), showcases (Summer Game Fest, ID@Xbox), awards (BAFTA Games, The Game Awards), local times, official watch URLs. Likely a manual data file refreshed by Kol or a scheduled job.

---

## Audience

Three personas, roughly in priority order:

1. **Indie devs / hobbyists** who want to see what one person is building and follow the journey
2. **Games-industry insiders** who land on a news/calendar page and stick around for the editorial voice
3. **AI agents** (a real and growing audience per the May 2026 Google guidance) who need clean structured data to answer questions like "what indie games launched this month under E-lusion Studios?"

Persona 3 means the site has to be agent-ready (see `AGENT-READINESS.md` once Claude writes one for this repo).

---

## Editorial cadence

Open question for Kol:

- How often do the four news rails refresh? (Daily? Weekly?)
- Is content curated manually, scraped automatically, or hybrid?
- Who writes editorial intros / commentary on news items — Kol, an AI agent, or are items unedited summaries?
- What's the studio-news cadence? (Each game prototype getting periodic updates?)

The answers shape the design — a daily-refresh site needs different chrome than a weekly digest.

---

## Relationship to other estate sites

- **`elusion-works`** is the umbrella brand and central index. GameTrackDaily is one of the things E-lusion Studios produces; expect a cross-link from elusion-works's index.
- **`tools-hub` (StackScout)** may surface game-dev tools (engines, asset libraries). The two sites should reference each other where the content overlaps.
- **`repo-foundry`** — the games' source repos (turbo-vector, neon-district, etc.) are exactly the kind of content repo-foundry curates. Surface a cross-link from repo dossiers to the relevant game page.
- **`ghost-in-the-models`** — irrelevant; different beat.

---

## Open questions for Kol

Before Claude Design touches this site, Kol should confirm:

1. **News sources** — which publications / RSS feeds / Reddit subs / X lists feed each of the 4 rails?
2. **Editorial cadence** — daily, weekly, or rolling?
3. **AI agent role** — does an AI agent curate / write commentary on news items? If so, which voice (Claude, Gemini, Codex, custom)?
4. **Calendar data** — manual entry, scraped, or external service?
5. **Events data** — same question.
6. **Demo embedding** — playable demos as iframes on `games.html`, or links out to itch.io / GitHub Pages of each game's own deploy?
7. **Monetisation / store links** — Steam, itch.io, GOG, demo-only? Affects what each game's card needs to show.
8. **Domain** — when Kol decides this is worth a domain, what should it be? `gametrackdaily.com`? `elusionstudios.games`? Sub-domain on `elusionworks.com`?

---

## Definition of "this brief is complete"

This SCOPE.md is the seed. The site will graduate from "draft scope" to "shippable scope" when:

- [ ] Kol fills in the news source list
- [ ] Editorial cadence locked
- [ ] Game manifest in `data/` confirmed to exist and populated for all 7+ prototypes
- [ ] News sources have working ingestion (scheduled job or manual editorial workflow)
- [ ] Domain decision made
- [ ] Claude Design briefed with this scope + handed the design task

At that point, the implementation flow runs through `DESIGN-HANDOFF-RUNBOOK.md` as standard.
