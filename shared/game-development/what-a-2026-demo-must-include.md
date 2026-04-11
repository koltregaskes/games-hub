# What A 2026 Demo Must Include

## What good looks like

- A first-time player can launch it, understand it, and finish one meaningful loop without a developer standing nearby.
- The demo shows a clear player fantasy rather than a pile of disconnected features.
- The game has enough audio, UI, pacing, and structure to feel intentional, not merely functional.
- A reviewer can describe what the game is, why it is interesting, and what the next step would be after ten to twenty minutes.

## Minimum studio-standard version

- Clean title and menu flow
- Fast first-run onboarding
- One complete playable slice from start to finish
- Stable review route or review-equivalent capture path
- Readable HUD and inputs
- Basic settings and restart path
- A win, fail, or debrief state that proves closure
- No major immersion-killing rough edge in audio, controls, or readability

## Common mistakes

- Calling a prototype a demo because the code runs.
- Building a beautiful first thirty seconds with no satisfying close.
- Hiding the fun behind friction, menus, or confused onboarding.
- Overscoping the demo until nothing feels finished.
- Treating the review route as the same thing as the player-facing demo.

## Practical checklist

- Can a new player get into the loop in under two minutes?
- Is there one strong reason to keep playing after the first encounter or decision?
- Does the demo communicate its identity in screenshots and motion, not just in a README?
- Is there at least one memorable beat that feels authored rather than accidental?
- Does the build end in a way that makes the next step obvious?
- Can the team record a stable evidence pack without improvising?

## The minimum slices that matter

### Entry

- title
- mode or save selection if needed
- readable controls or onboarding

### Core loop

- one honest representation of the real game
- not a fake cinematic layer with no underlying payoff

### Closure

- finish
- debrief
- result
- checkpoint comparison
- score readout

The player should leave feeling they experienced a shaped slice, not an interrupted test.

## What a proper 2026 demo is trying to prove

A proper 2026 demo should prove:

- the fantasy
- the loop
- the feel
- the readability
- the team's production judgment

It does **not** need to prove:

- the full game scope
- final content volume
- every system the game might one day have
- commercial launch readiness

## References and tools

- Steamworks Documentation: https://partner.steamgames.com/doc/home
- Game Developer: https://www.gamedeveloper.com/
- GDC: https://gdconf.com/

## Agent prompt

```text
Act as a game director and demo producer. Evaluate this build against a serious 2026 demo bar. Judge title flow, onboarding, core loop, closure, readability, audio support, and overall public-facing clarity. Return: what already works, what is missing, the smallest set of fixes needed, and whether this is a real demo, a promising prototype, or still only a proof slice.
```

## Review metadata

- Last reviewed: 2026-04-11
- Review owner: Games manager
- Next review trigger: when the studio changes its shortlist or demo-go criteria
- Related research run: games-browser-reviewability
