# Engines

## What good looks like

- The engine choice supports the current milestone instead of dominating it.
- Migration triggers are written down before a rewrite panic starts.
- The team knows what the browser slice is proving and what it is not proving.
- Tooling complexity grows only when it buys real progress.

## Minimum studio-standard version

- One primary stack choice.
- One fallback path.
- One migration trigger.
- One biggest technical risk.

## Common mistakes

- Rebuilding the game in a heavier engine before the current loop is proven.
- Picking an engine because it feels impressive rather than appropriate.
- Assuming browser work is wasted when it is actually proving the hardest design questions.
- Refusing to migrate even after the browser has become the bottleneck.

## Practical checklist

- Define the target shipping platform.
- Define the current proof platform.
- Write the exact trigger for moving to desktop or a heavier engine.
- Note what systems would be reused and what would be rebuilt.
- Re-evaluate after each major demo gate.

## References and tools

- Godot Docs: https://docs.godotengine.org/en/stable/
- Unity Manual: https://docs.unity3d.com/Manual/index.html
- Unreal Engine Documentation: https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-5-documentation

## Agent prompt

```text
Act as a technical game director. Compare the best engine or stack options for this game, including browser, Godot, Unity, and Unreal where relevant. Recommend one default path, one fallback path, the migration trigger, and the biggest technical risk for each option.
```

## Review metadata

- Last reviewed: 2026-04-09
- Review owner: Games manager
- Next review trigger: when major engine releases or platform constraints change the tradeoffs
- Related research run: knowledge-engines-platform-choice
