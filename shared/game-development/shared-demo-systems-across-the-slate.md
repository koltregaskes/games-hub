# Shared Demo Systems Across The Slate

## What good looks like

- Managers can compare games using the same demo language.
- Each game team knows which systems are shared studio expectations and which systems are title-specific.
- A game can be missing content without being missing its operating discipline.

## Minimum studio-standard version

Every serious demo candidate should have these shared systems in some form:

- title and menu flow
- onboarding path
- deterministic review route or review-equivalent pack
- readable HUD and controls
- one complete slice with closure
- stable save or profile behavior
- evidence capture discipline
- session handoff and update discipline

## Common mistakes

- Treating each game as so unique that no shared standards exist.
- Rebuilding the same launch, settings, onboarding, and review systems from scratch every time.
- Hiding weak execution discipline behind genre complexity.

## Shared systems

### 1. Entry flow

- title screen
- mode selection if needed
- clear call to start
- quick first-run clarity

### 2. Review route

- deterministic review URL or review-equivalent pack
- no destructive save behavior
- evidence capture path

### 3. Onboarding and readability

- readable controls
- immediate orientation
- no dead first impression

### 4. Core loop slice

- one real playable run
- not just an atmosphere preview

### 5. Closure state

- debrief
- score
- result
- checkpoint
- mission complete or failed

### 6. Audio support

- menu mood
- gameplay cues
- danger or reward feedback

### 7. Settings and stability

- basic options
- restart path
- no demo-corrupting profile behavior

### 8. Manager discipline

- evidence pack
- known issues
- next improvement
- shared session update file

## Why this matters

Shared systems do not make the games generic.

They make the demos easier to judge honestly, easier to maintain, and easier to improve across the whole slate.

## References and tools

- Steamworks Documentation: https://partner.steamgames.com/doc/home
- Godot Documentation: https://docs.godotengine.org/en/stable/
- Unreal Engine Documentation: https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-5-documentation

## Agent prompt

```text
Act as a studio production lead. For this game, identify which shared demo systems are already in place, which are weak, and which are missing. Focus on entry flow, review route, onboarding, core loop, closure, audio, settings, and manager discipline. Return the smallest practical upgrade plan for reaching demo-ready discipline.
```

## Review metadata

- Last reviewed: 2026-04-11
- Review owner: Games manager
- Next review trigger: when the studio changes its shared demo discipline
- Related research run: games-browser-reviewability
