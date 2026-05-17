# GameTrackDaily Arcade Design

Status: implemented from the Claude Design handoff parked at `design/handoff-2026-05-16/project/design_handoff_arcade/`.

## Direction

GameTrackDaily uses a brutalist arcade watch-desk system:

- deep black background with bone text
- sharp 2px borders and zero-radius cards
- Anton display type, Space Grotesk body type, JetBrains Mono labels
- slow marquee strips as system chrome
- restrained motion: marquee, live dot pulse, card lift, button lift, short display-text glitch
- platform colour coding across every major row

## Core Tokens

```css
--bg: #08090c;
--bg-2: #0e1014;
--bg-3: #15181f;
--ink: #f4efe7;
--brand: #ff3a3a;
--pc: #ffb43a;
--xbox: #6bd45b;
--ps: #3aa7ff;
--browser: #cda6e8;
```

## Platform System

- Windows PC uses amber.
- Xbox uses green.
- PlayStation 5 uses blue.
- Browser/web demos use violet.
- E-lusion Studios owned items use brand red.
- Launcher names such as Steam, GOG, Epic, Game Pass and PS Store are plain text tags in v1.

## Public Data Truthfulness

The arcade design can render provisional examples from the design handoff, but any row that is not backed by the public manifests must remain visibly labelled as provisional or example content. Do not call release, news, or review rows live/current unless a live pipeline proves that state.

## Motion Rules

- No backdrop-filter on sticky elements.
- Marquees pause on hover and when the document is hidden.
- `prefers-reduced-motion` disables decorative motion.
- Countdown numerals use tabular mono figures to avoid layout jitter.

## Current V1 Scope

- `index.html`
- `releases.html`
- `events.html`
- `news.html`
- `reviews.html`
- compatibility/chrome passes for `games.html`, `calendar.html`, `game-development.html`, and the four news rail pages

Not in v1:

- per-game detail pages
- real news ingestion
- launcher-specific colour palettes
- scanlines on by default
