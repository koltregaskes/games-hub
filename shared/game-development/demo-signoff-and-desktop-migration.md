# Demo Signoff and Desktop Migration

## What good looks like

- The team uses different labels for "browser review works", "the demo is worth showing", and "it is time to move to desktop."
- A manager can explain the current state of the project in one sentence without overselling it.
- The browser slice is treated as proof, not automatically as the forever platform.
- Migration only happens when the browser has already done its job and is now the bottleneck.

## Minimum studio-standard version

- The project has a stable review route or review-equivalent build entry.
- The project has a clear "demo go" or "not yet" call.
- The project has a written desktop migration trigger, even if that trigger has not been hit yet.
- The project distinguishes between "playable", "reviewable", and "commercially ready."

## Common mistakes

- Calling a game "finished" because the browser review route works.
- Jumping to desktop too early because the team is bored with the prototype.
- Staying in the browser too long after the production engine has clearly become the better home.
- Using one vague status word to mean five different things.

## Practical checklist

- Mark the build as one of: Browser Review Green, Conditional, or Not Yet.
- Mark the demo itself as Go, Conditional, or No-Go.
- Write the exact migration trigger in plain English.
- Confirm whether the browser build is still producing useful design proof.
- If the game is desktop-only, say that clearly instead of forcing it into web rules.

## The three labels

### Browser Review Green

Use this when:

- the review URL is stable
- the evidence pack exists
- the launch recipe is clear
- the known caveats are documented

This does **not** mean the game is commercially finished. It only means the manager can reliably review the current slice.

### Demo Go

Use this when:

- the Phase 1 slice is meaningfully playable
- a first-time reviewer can understand the loop
- the build has enough UI, feedback, and flow to communicate the concept honestly

This is the label to use when deciding whether the current demo is worth showing around.

### Desktop Migration Triggered

Use this when:

- the browser slice has already proved the core loop
- the final production engine or packaging path is clearly different
- staying in the browser would now create throwaway work or block the real product path

Migration is a business and production decision, not a badge of honor.

## Studio defaults for the current slate

- `Mandate 2029`: stay on the web longer
- `Civicrise`: stay browser-first until district systems and onboarding are convincingly locked, then move to Godot
- `Neon District`: keep using the browser as the proof slice until the district mission flow is strong enough to preserve on the desktop path
- `Starfall Protocol`: use the browser to prove mission shape, then move deeper into the Unreal production path
- `Turbo Vector`: stay web-first longer while the championship, garage, and upgrade loops mature
- `Redline Horizon`: stay web-first for the road-trip slice until the renderer becomes the limiting factor rather than the design
- `Swarmbreaker`: already on the right desktop-only track

## References and tools

- Steamworks Documentation: https://partner.steamgames.com/doc/home
- Godot Documentation: https://docs.godotengine.org/en/stable/
- Unreal Engine Documentation: https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-5-documentation

## Agent prompt

```text
Act as a studio production director. Evaluate this game using three separate labels: Browser Review Green, Demo Go, and Desktop Migration Triggered. Explain the current state honestly, define the smallest remaining gap, and say exactly when the team should stay in the browser versus move to the desktop production path.
```

## Review metadata

- Last reviewed: 2026-04-09
- Review owner: Games manager
- Next review trigger: when demo signoff rules or engine migration defaults change
- Related research run: games-browser-reviewability
