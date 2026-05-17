# Design system — GameTrackDaily Arcade

> All tokens and component specs in one place. Cross-reference with `source/arcade/styles.css` — that file is the source of truth and every value here is copied from it.

## Posture

The whole design commits to a **brutalist arcade** posture:

- Sharp 2px borders, no rounded corners
- Heavy mono labels in oversized letter-spacing
- One massive condensed display font (Anton) for headlines
- High-contrast: deep black background, bone-white text, **one hot accent** at a time, plus the three platform colours
- Big numerals for countdowns, dates, indices — always `tabular-nums`
- Animated marquee strips top + bottom, CRT scanlines as optional overlay
- A subtle hover "glitch" on display text (split-channel text-shadow flash)

Influences are arcade marquees, fight-card design, 80s/90s gaming print. It is deliberately loud in form so the editorial voice can stay quiet.

## Type

| Role                        | Family                      | Weight   | Notes                                                              |
| --------------------------- | --------------------------- | -------- | ------------------------------------------------------------------ |
| **Display** (headlines)     | `Anton`                     | 400      | Condensed sans-serif. Heavy by default. UPPERCASE. `line-height: 0.86`. `letter-spacing: 0.005em`. `text-wrap: balance`. |
| **Body**                    | `Space Grotesk`             | 400–700  | Geometric, modern. 14–16px body. `line-height: 1.55`.              |
| **Mono** (labels, numerals) | `JetBrains Mono`            | 400–800  | All tags, eyebrows, numerals, countdowns. `letter-spacing: 0.16–0.22em` for caps. `font-variant-numeric: tabular-nums` for numerals. |

All loaded from Google Fonts — see the `@import` at the top of `styles.css`. No self-hosted fonts in this design.

### Scale

| Token   | Use                                                     |
| ------- | ------------------------------------------------------- |
| 9–11px  | mono labels, eyebrows, platform chips, source attribution |
| 13–15px | body copy                                                |
| 22–36px | display in cards and rows                                |
| ~2.4rem — 4rem  | section heads (`clamp(2.2rem, 4.5vw, 3.4rem)`)            |
| ~3.4rem — 6.4rem | page hero (`clamp(3.4rem, 8vw, 6.4rem)`)                 |
| 180px   | countdown digits on the Home hero                        |

## Colour tokens

Copy this block verbatim into the production `styles.css`:

```css
:root {
  --bg: #08090c;
  --bg-2: #0e1014;
  --bg-3: #15181f;
  --ink: #f4efe7;                        /* bone — Elusion Works carry-over */
  --ink-2: rgba(244, 239, 231, 0.78);
  --ink-3: rgba(244, 239, 231, 0.5);
  --ink-4: rgba(244, 239, 231, 0.28);
  --line: rgba(244, 239, 231, 0.16);
  --line-strong: rgba(244, 239, 231, 0.4);

  --brand: #ff3a3a;                      /* hot accent — OURS / CTAs / LIVE */
  --brand-2: #ff7a4a;

  --pc: #ffb43a;                         /* Windows PC — amber */
  --xbox: #6bd45b;                       /* Xbox Series X|S — green */
  --ps: #3aa7ff;                         /* PlayStation 5 — blue */
  --browser: #cda6e8;                    /* Web demos — violet */

  --display: "Anton", "Arial Narrow", sans-serif;
  --mono: "JetBrains Mono", ui-monospace, monospace;
  --sans: "Space Grotesk", system-ui, sans-serif;

  --maxw: 1480px;
}
```

### Colour usage rules

- **Never combine more than one of {brand red, PC amber, Xbox green, PS blue} as a large fill on the same surface.** Use one as the section's identity colour; the others appear only as small chips.
- The **brand red** outranks platform colours when the row is "ours" — an ours-row gets a brand-red left stripe AND a brand-red background tint, regardless of what platform the demo runs on.
- **Background tints** for emphasis: `color-mix(in oklab, <colour> 14%, transparent)` for hover/live; `10%` for an ours-row resting state.
- Never use opacity-based dimming for non-active platforms — keep them at full saturation. Hierarchy is conveyed by stripe-width and chip size, not by fading.

### Platform chip recipe

A chip is a tiny mono label with a coloured dot:

```html
<span class="pf pf--xbox boxed">
  <span class="pf-dot"></span>
  XBOX
</span>
```

```css
.pf { display: inline-flex; align-items: center; font-family: var(--mono); font-weight: 700; font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; }
.pf > .pf-dot { width: 10px; height: 10px; margin-right: 6px; border-radius: 1px; }
.pf--xbox { color: var(--xbox); }
.pf--xbox .pf-dot { background: var(--xbox); }
.pf.boxed { padding: 3px 8px; border: 1.5px solid currentColor; background: color-mix(in oklab, currentColor 8%, transparent); }
.pf.boxed .pf-dot { width: 6px; height: 6px; }
```

Same recipe for `.pf--pc`, `.pf--ps`, `.pf--browser`.

## Borders, radii, shadows

- **Border weight:** `2px solid var(--ink)` for major dividers, page chrome, card outlines.
- **Dashed border** `1.5px dashed var(--line-strong)` for "provisional" / disclosure boxes.
- **Border radius:** `0`. Never round. The only exception: the platform-dot itself uses `border-radius: 1px` for a fractional softening.
- **Shadow on hover:** sharp offset shadow, not blurred. `box-shadow: 8px 8px 0 0 var(--brand);` paired with `transform: translateY(-3px)`. This is the "pressed plate" lift; it's the only shadow language in the whole system.

## Components

### Marquee

Top and bottom strips with auto-scrolling text. Used as a system-wide chrome element. Items pause on hover. CSS-only animation.

```css
.marquee { display: flex; align-items: center; padding: 9px 0; border-bottom: 2px solid var(--ink); overflow: hidden; white-space: nowrap; font-family: var(--mono); font-weight: 700; font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; }
.marquee--brand { background: var(--brand); color: #0a0a0c; border-color: #0a0a0c; }
.marquee__track { display: inline-flex; animation: marquee 70s linear infinite; }
.marquee__track > span { padding: 0 22px; }
.marquee__track .dot { color: var(--brand); padding: 0 12px; }
.marquee:hover .marquee__track { animation-play-state: paused; }
@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
```

Important: the items array must be **duplicated** in the DOM so that translating by `-50%` produces a seamless loop. See `components.jsx → Marquee`.

### Nav

Sticky top bar (`position: sticky; top: 0;`). Three columns: brand mark · nav links · live time pill (brand-red).

- Brand mark: `GAME/TRACK/DAILY` with slashes in `var(--brand)`. `font-family: var(--mono); font-weight: 800;`
- Each nav link is mono, uppercase, with vertical 2px dividers.
- The current page is inverted: `background: var(--ink); color: var(--bg);` — no underline, no chip.
- The live-time pill uses `background: var(--brand); color: #0a0a0c;` and has a pulsing dot prefix.

### Buttons

Two flavours: brand (filled red) and ghost (transparent with bone border).

```css
.btn { display: inline-flex; align-items: center; gap: 10px; padding: 12px 18px; border: 2px solid var(--ink); font-family: var(--mono); font-weight: 800; font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; }
.btn:hover { transform: translate(-2px, -2px); box-shadow: 4px 4px 0 0 var(--ink); }
.btn--brand { background: var(--brand); color: #0a0a0c; border-color: var(--brand); }
```

The hover lift is uniform — every button moves up-left 2px and drops a sharp 4px offset shadow underneath. This is the same gesture as cards.

### Tag / pill

Mono caps with optional fill variants. See `.tag`, `.tag.solid`, `.tag.brand`, `.tag.brand-ghost`, `.tag.live` in `styles.css`.

- `.live` has a pulsing red dot prefix using a `pulse` keyframe (1.4s ease-in-out infinite, opacity 1 → 0.25 → 1).

### Card

Border-2px box on `var(--bg-2)`. On hover: lift 3px + brand-red border + 8/8 brand shadow.

```css
.card { background: var(--bg-2); border: 2px solid var(--ink); transition: transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease; }
.card:hover { transform: translateY(-3px); border-color: var(--brand); box-shadow: 8px 8px 0 0 var(--brand); }
.card--ours { border-color: var(--brand); }
.card--ours::before { content: "OURS"; position: absolute; top: -2px; right: -2px; background: var(--brand); color: #0a0a0c; padding: 4px 8px; font-family: var(--mono); font-weight: 800; font-size: 10px; letter-spacing: 0.2em; border: 2px solid var(--ink); }
```

### Date block

Bordered DD/MON block used on release and event rows.

```html
<div class="date-block">
  <span class="bignum" style="font-size: 32px;">19</span>
  <span class="month-label">MAY</span>
</div>
```

The month label uses the platform colour of the row's primary platform.

### Score stamp

Tilted circular-feel stamp with a score / 10. Sized 50–120px. Used on Reviews page.

```css
.score-stamp { width: 60px; height: 60px; display: grid; place-items: center; border: 2px solid var(--brand); background: var(--bg); transform: rotate(-4deg); }
```

### Big numeral

Used for countdowns, indices, status counts. Always:

```css
.bignum { font-family: var(--mono); font-weight: 800; font-variant-numeric: tabular-nums; letter-spacing: -0.045em; line-height: 0.85; }
```

The tabular numeral is non-negotiable for countdowns — without it, the seconds digit makes the layout jitter every tick.

## Grid

- Max content width: `1480px` (`--maxw`), centered, with `padding: 0 24px`.
- Section heading rows: a `border-bottom: 2px solid var(--ink)` with the number badge, the title, and meta-chips on the right.
- Heavy use of `.cols-2`, `.cols-3`, `.cols-4` utility grids — these explicitly add `2px solid var(--ink)` borders between cells, no gap. The visual rhythm comes from cell dividers, not whitespace.
- For dense row stacks: `.row-grid` with `2px` top borders between siblings.

## Background system

The page background is a fixed layer with three components:

1. Radial glow from top-left in `--brand` red at low alpha.
2. Radial glow from bottom-right in `--ps` blue at lower alpha.
3. Centre vignette darkening edges (0% to 70% black).

Plus a noise texture overlay (`feTurbulence` SVG filter as a data URL, `opacity: 0.07`, `mix-blend-mode: screen`) for film grain.

When `<body>` has class `scanlines`, a fixed top-layer adds a repeating 2px transparent / 3px subtle bone overlay across the whole viewport with `mix-blend-mode: screen` and `z-index: 999`.

## Iconography

**Zero icon system.** No icon font, no SVG library, no Lucide. The visual vocabulary is:

- Platform-colour dots (the `.pf-dot` 6–10px squares)
- ASCII arrows `→` in the brand or platform colour
- Stars `★` next to "ours" items
- Mono dots `●` for live indicators (with pulse animation)

That's it. If you absolutely must add an icon for a new feature, use Lucide on CDN with `stroke-width: 1.5` and `currentColor` only — but discuss with Kol first.

## Imagery

- Studio game posters live in `assets/*.svg` — abstract monochrome-ish geometric posters, ~16:9 aspect. Already exist in the repo.
- For external game cover art (tracked releases from other studios), the design currently shows none. When implementing, plan for `<img>` tags that fail gracefully (use the platform colour as a solid fallback fill behind a 2-line title — `Crimson Skylines` on an amber field, etc.).
- All images get a bottom-fade overlay (`linear-gradient(180deg, transparent 50%, rgba(8,9,12,0.5))`) and a saturate-1.05 / contrast-1.05 / brightness-1.04 filter to keep them visually consistent with the warm bone-on-charcoal palette.

## Accessibility

- All hover states have parallel `:focus-visible` styles (2px outline in `rgba(255,255,255,0.9)`, 4px offset).
- `prefers-reduced-motion` disables marquee scroll, glitch hovers, page-transition rise animations, countdown ticking visuals (countdown still updates, just without the digit flip).
- Colour is never the only signal — every platform chip carries text ("XBOX", "PC", "PS5") next to its dot. Score stamps include the "/10" suffix as text. Live indicators have both a colour and an animation.
- Contrast: bone on charcoal is ~14:1. Brand red on charcoal is ~5.5:1 — fine for large text and big UI elements, but **don't use brand red for body copy**. Use `--ink-2` instead.
