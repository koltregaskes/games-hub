# Interactions — GameTrackDaily Arcade

> Every animation, transition, hover, and dynamic state. Pull exact CSS from `source/arcade/styles.css` — values here are summaries.

## Motion philosophy

The page is loud in form (heavy mono, big borders, bright accents) but the **motion is restrained**. Three types of motion are allowed:

1. **Ambient loops** — marquee scrolls, the brand-red live dot pulses. Slow and continuous; ignored after a second.
2. **Hover affordances** — cards lift, buttons offset, display text glitches. Fast (150–220ms), single-shot, clearly reversible.
3. **Entry animations** — sections fade-rise on page navigation. One pass per visit, then settled.

No bounces, springs, parallax tilts, or theatrical reveals. Anything more than what's listed here is over the budget for an info-led site.

## Ambient

### Marquee scroll

```css
@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
.marquee__track { animation: marquee 70s linear infinite; }
.marquee:hover .marquee__track { animation-play-state: paused; }
```

- **70 seconds** for one full loop is deliberately slow — the marquee reads as ticker, not animation.
- The items array must be **duplicated** in markup so the `-50%` translate ends exactly where the loop began.
- Hover anywhere on the strip pauses it (no JS — just `:hover` selector).

### Live dot pulse

```css
.tag.live::before, .nav__live::before { content: "●"; animation: pulse 1.4s ease-in-out infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.25; } }
```

The pulse is opacity-only, never scale. The dot stays the same size — only its intensity breathes.

### Countdown tick

Implemented in `Countdown` component:

```jsx
const [now, setNow] = useState(Date.now());
useEffect(() => {
  const t = setInterval(() => setNow(Date.now()), 1000);
  return () => clearInterval(t);
}, []);
```

- Ticks every 1000ms. `tabular-nums` on the digit font prevents layout shift.
- When the target is reached, the component re-renders as a brand-red `LIVE NOW` label — no transition, just a swap.
- For production, with the home hero plus multiple events visible, run **one** page-level interval and have all `Countdown` instances subscribe via context. Saves cycles.

## Hover affordances

### Card lift

```css
.card { transition: transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease; }
.card:hover { transform: translateY(-3px); border-color: var(--brand); box-shadow: 8px 8px 0 0 var(--brand); }
```

3px translateY paired with a sharp **non-blurred** 8/8 offset shadow in brand red. Border colour shifts from bone to brand red. This is the single most distinctive interaction in the system — it's what makes a card feel like a "plate" being lifted.

### Button lift

```css
.btn:hover { transform: translate(-2px, -2px); box-shadow: 4px 4px 0 0 var(--ink); }
.btn .arrow { transition: transform 0.18s ease; }
.btn:hover .arrow { transform: translateX(3px); }
```

Button lift is **diagonal** (-2, -2) — a different motion than the card lift (straight up). The arrow inside slides right 3px on hover.

### Row hover

Rows (release rows, news rows, event rows) get a subtle bg tint on hover, applied imperatively:

```jsx
onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(244,239,231,0.04)"; }}
onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
```

When porting to vanilla CSS, prefer a pure `:hover` selector instead — and skip the inline-style approach.

Rows with `release.ours` keep their brand-red tint on hover (the hover would otherwise overwrite it).

### Display text glitch

```css
.glitch { position: relative; display: inline-block; }
.glitch:hover { animation: glitch-anim 0.4s steps(2) 1; }
@keyframes glitch-anim {
  0% { text-shadow: 2px 0 var(--brand), -2px 0 var(--ps); }
  25% { text-shadow: -2px 0 var(--brand), 2px 0 var(--xbox); }
  50% { text-shadow: 2px 1px var(--ps), -2px -1px var(--pc); }
  75% { text-shadow: -1px 1px var(--brand), 1px -1px var(--xbox); }
  100% { text-shadow: none; }
}
```

A short single-shot animation. The text-shadow flashes through all four accent colours over 400ms in 2 steps, then resets to none. Applied to every display headline in card/row contexts. Skip it on the page hero — the hero is too big and the flash gets distracting.

### Focus-visible

Every interactive element needs `:focus-visible` styling. Use:

```css
:focus-visible { outline: 2px solid rgba(255,255,255,0.9); outline-offset: 4px; }
```

Test by tabbing through the page — keyboard users must be able to see the active control at all times.

## Entry / navigation

### Page rise

```css
@keyframes rise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.rise { animation: rise 0.5s ease both; }
```

The page `<main>` gets `.rise`. On every route change, the whole page fades up 10px. Fast enough to feel snappy (500ms), slow enough to register as a transition.

### Stagger

For grids:

```css
.rise-stagger > * { animation: rise 0.5s ease both; }
.rise-stagger > *:nth-child(1) { animation-delay: 0.04s; }
.rise-stagger > *:nth-child(2) { animation-delay: 0.08s; }
/* ... up to 8 */
```

Children of `.rise-stagger` each get a 40ms additional delay. Capped at 8 — beyond that, the stagger feels precious. Use sparingly: roster grid, news rails grid, Summer Game Fest week.

### View Transitions API

```css
@view-transition { navigation: auto; }
::view-transition-old(root), ::view-transition-new(root) { animation-duration: 0.32s; }
```

The prototype wraps every `setRoute` call in `document.startViewTransition` for browsers that support it. For a vanilla-HTML static site this won't apply across `.html` pages (browser doesn't transition across full navigations even with the API). Don't try to polyfill it — the standard browser fade is fine.

## CRT scanlines

Built-in but disabled by default. Toggled by adding `class="scanlines"` to `<body>`.

```css
.scanlines::after {
  content: "";
  position: fixed; inset: 0;
  pointer-events: none; z-index: 999;
  background: repeating-linear-gradient(180deg, transparent 0 2px, rgba(244,239,231,0.05) 2px 3px);
  mix-blend-mode: screen;
}
```

Recommended approach: expose this as a setting in a tiny user-pref toggle (localStorage-backed) so individual readers can opt in. Default off — the scanlines are charming but tiring over long reading sessions.

## Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
  .marquee__track { animation: none; }
}
```

Effects:
- Marquees freeze (the duplicated track stays statically visible — items remain readable).
- Live dot pulse stops.
- Hover lifts, glitches, and rise animations all collapse to instant.
- Countdowns still update every second (those are state-driven, not animation-driven) — but without any flip transition.

Test with `Settings > Accessibility > Reduce motion` on macOS or `chrome://settings/accessibility` on Chrome.

## Behaviour

### Routing

The prototype uses **hash routing** (`#/home`, `#/releases`, …) because everything lives in one HTML file. In production, **drop the hash routing** entirely — each page is its own `.html` file (`index.html`, `releases.html`, `events.html`, `news.html`, `reviews.html`) and the nav links go to those URLs directly.

The current page indicator (`aria-current="page"` + inverted styling) must be set server-side or by reading `document.location.pathname` on each page load. See the existing pattern in `gametrackdaily/app.js → buildNav`.

### Releases filter

Five buttons. Click toggles the active filter (single-select, not multi). The active button:
- Fills with its colour, text inverts to `--bg`.
- Shows a `●` prefix in the label.

The grouped month sections re-render based on the filter; months with zero items under the active filter are hidden entirely.

For vanilla JS implementation: this is straightforward DOM filtering — `document.querySelectorAll('[data-platforms]')` + show/hide based on filter state. Keep it client-side and instant.

### Releases view toggle

Two buttons (List / Grid) in a 2px-bordered segmented control. Toggles between row layout and 3-up card layout for the same data. Persistence not required for v1; treat as session-only.

### News rail tabs

5 buttons: All / Dev / Gaming / Reviews / Previews. When "All" is active, all four rail blocks render. When a single rail is active, only its block renders.

In production, consider making each rail its own `.html` page (`news-development.html` already exists in the repo). The tab UI on `news.html` then either:
- Acts as a sub-navigation that loads each rail-page on click (best for SEO + URL stability), or
- Filters in-place (the prototype's behaviour).

Discuss with Kol — both have tradeoffs.

### Provisional disclosure

Until **all four** news rails have at least one item, render the dashed-border "PROVISIONAL — items shown are examples" strip below the tabs. As soon as the live pipeline starts populating, drop the disclosure.

This is on-brand: the Elusion Works voice explicitly allows hedging ("Company in formation"). Keep it.

### Watch links

All `Watch event →` links on the Events page point to the **official event/showcase page** from `release-calendar.json → events[].watch`. If `watch` is missing, fall back to `officialUrl`. Both open in a new tab (`target="_blank" rel="noreferrer"`). Never embed third-party streams — only link.

### Time zones

All times shown to the user are **BST** (Europe/London). The data layer stores `startAtUTC` and the page formats it. Show the original PT time in the event note for context. Do not show users PT-only times anywhere.

### Score normalisation

A score from an outlet may be `/10`, `/100`, or unscored.

```js
const out = score > 10 ? Math.round(score / 10) : score;
```

The score stamp always displays `/10`. Outlets that don't score (e.g. RPS) — leave `score` undefined and skip the stamp.

### Hover state on platform-coloured stripes

The left-edge platform stripe on release rows is **always full saturation**. Don't dim it on un-hovered rows; the stripe is the row's identity, not a state. Hierarchy comes from the row's title weight and `ours` tinting, not from stripe brightness.

## Performance notes

- The Babel-in-browser transpile in the prototype is too slow for production. When porting, write plain JS or use a build step.
- The marquees, live pulse, and countdowns all run perpetually. On a low-power device this adds up. Pause animations when the page is `document.hidden` — listen for `visibilitychange` and toggle `animation-play-state`. Big quality-of-battery-life win for one event listener.
- The noise SVG background is rendered once and tiled by the browser. Don't animate or rebuild it. The `feTurbulence` filter is expensive; you do not want it re-painting.
- Hover lifts use `transform` (GPU-accelerated) — keep it that way. Do not animate `top`, `left`, `box-shadow` blur radius, etc. — those force CPU repaints.

## Accessibility checklist for handoff QA

- [ ] Every interactive element reachable by Tab in source order.
- [ ] `:focus-visible` outline visible on every focusable element on a dark background.
- [ ] Nav active state announces as `aria-current="page"` for screen readers.
- [ ] All buttons have text labels (no icon-only buttons in this design).
- [ ] Platform chips have text labels next to colour dots (verified: "XBOX", "PC", "PS5").
- [ ] Score stamps include "/10" as text inside the stamp.
- [ ] Live indicators include both colour and animation (pulse) and text ("LIVE").
- [ ] Marquee text is readable when the animation pauses on hover.
- [ ] `prefers-reduced-motion` collapses every animation. Countdown still updates.
- [ ] Body copy uses `--ink-2` (78% opacity bone) for contrast ≥ 11:1 on `--bg`.
- [ ] Brand red is never used as the only colour to convey state — always paired with text or animation.
