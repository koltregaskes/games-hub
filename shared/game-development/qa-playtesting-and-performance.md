# QA, Playtesting, and Performance

## What good looks like

- The build can be reviewed the same way twice.
- Evidence replaces vague confidence.
- Performance problems are tracked before they become launch blockers.
- Playtesting finds misunderstandings, not just crashes.

## Minimum studio-standard version

- One stable review entry point.
- One short verification checklist.
- One evidence pack.
- One written note on known issues.

## Common mistakes

- Calling a build stable because it worked once.
- Testing only on the dev machine.
- Letting review routes drift every time the build changes.
- Ignoring browser constraints until the demo becomes painful.

## Practical checklist

- Verify the title route.
- Verify the fast-entry review route.
- Capture desktop evidence.
- Capture mobile evidence if supported.
- Record known issues, caveats, and next improvement.

## References and tools

- Steamworks Testing Docs: https://partner.steamgames.com/doc/store/testing
- Godot Docs: https://docs.godotengine.org/en/stable/

## Agent prompt

```text
Act as a game QA lead. Build a practical verification plan for this game covering title flow, review route, evidence capture, performance checks, known issues, and the minimum pass criteria for the next manager signoff.
```

## Review metadata

- Last reviewed: 2026-04-09
- Review owner: Games manager
- Next review trigger: when verification rules or performance targets shift
- Related research run: games-browser-reviewability
