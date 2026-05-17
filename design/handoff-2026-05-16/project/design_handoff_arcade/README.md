# Handoff — GameTrackDaily "Arcade" build

> **Read this first.** Everything else in this folder supports this README.

## What you're looking at

A high-fidelity HTML/React prototype of a redesign for **GameTrackDaily** — the public-facing games tracking site that lives in the `gametrackdaily/` repo. The prototype was built as a single-page React app loaded via `<script type="text/babel">` purely for fast iteration; it is **not** how the production site should be built.

The production site is a **static HTML + vanilla CSS + vanilla JS** GitHub Pages build (see `gametrackdaily/SCOPE.md`). Your job is to port the prototype's visual design, content structure, and interactions back into that static-HTML codebase, keeping the existing per-page `.html` file layout (`index.html`, `releases.html`, `events.html`, `news.html`, `reviews.html`) and the existing `app.js` / `styles.css` conventions.

The user explicitly asked for this prototype to **replace** the current site's design and the colour-by-platform system across the whole site. Treat the current `gametrackdaily/styles.css` and the current homepage shell as the *thing being replaced*, not as the visual baseline.

## Fidelity

**High-fidelity.** All colours, type scale, spacing, border weights, and animation timing in `source/arcade/styles.css` are final. Reproduce them as closely as possible in vanilla CSS — same hex values, same `var(--*)` token names, same selectors where it helps the diff.

## What's in this folder

```
design_handoff_arcade/
├── README.md          ← you are here
├── DESIGN.md          ← design system: tokens, type, colour, components
├── PAGES.md           ← page-by-page specification (Home, Releases, Events, News, Reviews)
├── INTERACTIONS.md    ← animations, hover states, behaviour, accessibility
└── source/
    ├── Game Hub - Arcade.html   ← the prototype host file (open this to view)
    └── arcade/
        ├── styles.css           ← final stylesheet — copy values from here
        ├── data.js              ← data shape + studio roster + sample feed items
        ├── components.jsx       ← shared UI parts (Nav, Marquee, PlatformPill, Countdown, …)
        ├── pages-home.jsx       ← Home composition
        ├── pages-releases.jsx   ← Releases page composition
        ├── pages-events.jsx     ← Events page composition
        ├── pages-news.jsx       ← News page composition
        ├── pages-reviews.jsx    ← Reviews page composition
        ├── app.jsx              ← router (replaced by per-page .html in production)
        └── assets/*.svg         ← 7 studio game posters (already exist in the repo)
```

To view the prototype, open `source/Game Hub - Arcade.html` in a browser (no build step needed). Navigate using the top nav or the URL hash (`#/home`, `#/releases`, etc.).

## The single most important thing

The user wants a **platform colour-coded system** across the whole site:

| Platform        | Token       | Hex       | Usage                                                          |
| --------------- | ----------- | --------- | -------------------------------------------------------------- |
| Windows PC      | `--pc`      | `#ffb43a` | amber — for any PC item, PC sections, PC filter chips          |
| Xbox            | `--xbox`    | `#6bd45b` | green — same                                                   |
| PlayStation     | `--ps`      | `#3aa7ff` | blue — same                                                    |
| Browser / web   | `--browser` | `#cda6e8` | violet — for the studio's own demos (which run in the browser) |
| Brand "ours"    | `--brand`   | `#ff3a3a` | hot red — reserved for OUR games, live indicators, CTAs        |

Every release row carries a left-edge stripe in the **primary** platform colour. Multi-platform items still get one stripe (use the first platform listed). Each platform chip is small, mono, uppercase, with a coloured dot prefix — see `.pf` styles in `styles.css`.

Inside PC, **launcher** sub-tags (Steam, GOG, Epic, Xbox app, Game Pass, PS Store, itch.io) appear as plain text tags — the user wanted this open for future expansion if launchers themselves get their own colours later.

## What this prototype is NOT

- It is not a React app that should be deployed. The `text/babel` runtime transpile is too slow for production.
- It is not the source of truth for content. Content lives in `gametrackdaily/data/*.json` — `source/arcade/data.js` is a stripped-down, prototype-only mirror with extra fields (`launcher`, `hype`, `genre`) that should be ported back to the JSON manifests.
- It is not finished copy. The News feed items are **example items** ("provisional feed" — marked `_example: true` in `data.js`). The brand voice is locked; the actual stories will come from the live pipeline. Reviews are placeholder too.
- It does not include every page in the existing repo. `game-development.html`, `news-development.html` / `news-gaming.html` / `news-reviews.html` / `news-previews.html` (the four rail sub-pages) and a per-game detail page were not designed. Apply the same system to them.

## Implementation order suggested

1. **Tokens first.** Drop the `:root` block from `source/arcade/styles.css` into the production stylesheet. This unlocks the colour system across all existing pages immediately.
2. **Shared chrome.** Implement the top marquee, sticky nav with brand mark, footer, and bottom marquee as shared partials/includes. Look at `source/arcade/components.jsx → Nav`, `Marquee`, `Footer`.
3. **Home page.** Replace `index.html`'s current body with the Home layout from `PAGES.md`. The live countdown is the only piece needing JS — see `INTERACTIONS.md`.
4. **Releases page.** This is the biggest. Implement filter buttons, list/grid toggle, month-grouped rows, platform-colour stripe per row. Pull data from `data/release-calendar.json` (already exists in the repo).
5. **Events page.** Lean directly on the events list already in `data/release-calendar.json`. The countdown component is reused from Home.
6. **News page.** Wire up to `data/games-news.json`. Until the live pipeline fills the `items: []` arrays, render the "provisional feed" disclosure exactly as shown in the prototype.
7. **Reviews page.** Wire up to `data/reviews-manifest.json` for the literacy section. Use sample reviews until the pipeline ships scored items.

## Brand & voice

The voice is quiet, precise, editorial — never hypey. Sentence-case for headlines, UPPERCASE mono for labels/tags, full stops at the end of headlines. No emoji. No exclamation marks. See `gametrackdaily/SCOPE.md` and the Elusion Works brand kit for the parent voice — GameTrackDaily inherits it.

The display font (Anton) makes the page feel arcade-loud, but the words themselves stay calm. This is the deliberate tension. Don't undermine it by writing "Unleash the ultimate…" copy.

## Assets

The 7 studio game posters in `source/arcade/assets/` are exact copies of `gametrackdaily/assets/*.svg` — already in the repo. No new asset work needed for the studio roster. You will need outlet logos eventually (IGN, Eurogamer, RPS, etc.) for the News/Reviews pages, but the prototype uses plain text outlet names and that is fine for v1.

## Questions for Kol before shipping

The user hasn't yet confirmed:
- **Launcher colours** — they hinted at colour-coding *by launcher* on PC (Steam, Epic, etc.). Currently PC is amber and launcher names are plain text. Confirm whether to split PC further.
- **CRT scanline overlay** — built but disabled by default. Add `.scanlines` to `<body>` to enable. Confirm whether to ship-on or ship-off, or expose as a user toggle.
- **News rails sub-pages** — keep the four `news-*.html` rail-specific pages, or collapse into a single `news.html` with tabs (as the prototype does)?
- **Game detail page** — not designed yet. Will need to follow the same system: roster card → detail view.

Hand these back to the user when you start.
