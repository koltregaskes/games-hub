# Agent Readiness - GameTrackDaily

Status: v1 policy for the Arcade redesign.
Updated: 2026-05-17.

## Purpose

GameTrackDaily is a public games watch desk for tracked releases, official events, curated coverage, review literacy, and the E-lusion Studios game slate.

The site must be easy for AI agents and search systems to interpret without inventing freshness, publication status, or operational claims.

## Required Structured Data

- Home: `Organization`, `WebSite`, and an `ItemList` of E-lusion Studios games as `VideoGame` entries.
- Releases: `CollectionPage` plus runtime `ItemList` for visible release rows.
- Events: `CollectionPage`; event rows must preserve official source/watch links in visible content.
- News: `CollectionPage` plus runtime `NewsArticle`/coverage `ItemList` where items exist.
- Reviews: `CollectionPage` plus runtime `Review`/coverage `ItemList` where items exist.

## Truthfulness Rules

- Do not call release, news, review, or event data live/current/fresh unless the public manifest or pipeline proves it.
- If sample rows from the design handoff are shown, they must be visibly labelled `PROVISIONAL` or `example`.
- Official event/watch links must point to official event pages where available.
- Keep E-lusion Studios owned game rows visually distinct from external tracked releases.
- Keep private manager-console data out of this repo and out of public HTML.

## Semantic HTML Rules

- Use `<a>` for navigation and external destinations.
- Use `<button>` for filters, toggles, and local UI state changes.
- Avoid clickable `<div>` or `<span>`.
- Every interactive control must have a visible text label and cursor affordance.
- Every focusable control must have a visible `:focus-visible` outline.

## Forms

There are no public forms in v1. If forms are added later, every input/select/textarea needs a visible `<label for="...">` or a clear `aria-label`.

## Accessibility Rules

- Platform chips must include text, not only colour.
- Score stamps must include `/10` as text.
- Live indicators must include text and not rely only on colour.
- Marquees pause on hover and respect reduced motion.
- Decorative motion must collapse under `prefers-reduced-motion`.
- Mobile layouts at 320px and 390px must have no horizontal scroll.

## Metadata Rules

Every public HTML page must include:

- unique title
- meta description
- canonical URL
- Open Graph title, description, type and URL
- Twitter card
- theme colour
- favicon

`robots.txt` should allow AI crawlers per the estate policy. `sitemap.xml` should list the canonical public pages and avoid private/local routes.
