# Distribution

## What good looks like

- The team knows which builds are private, public, demo, or paid-release candidates.
- Packaging expectations are matched to the chosen channel.
- Public web builds, desktop review packs, and store submissions each have different rules.
- Distribution decisions follow the current production reality.

## Minimum studio-standard version

- One distribution plan for the current phase.
- One rule for what stays private.
- One rule for what can be shared publicly.
- One packaging checklist per active channel.

## Common mistakes

- Treating every build as if it should go public.
- Shipping browser prototypes publicly after they have stopped being the right proof surface.
- Forgetting that stores need packaging, compliance, and support planning.
- Mixing review builds, internal builds, and launch builds together.

## Practical checklist

- Choose current channels: private, public web, desktop demo, or store.
- Decide what evidence or packaging each channel needs.
- State what should never be uploaded from the working repo.
- Re-check distribution posture at every major milestone.
- Separate demo signoff from commercial-release signoff.

## References and tools

- Steamworks Documentation: https://partner.steamgames.com/doc/home
- itch.io Creator Docs: https://itch.io/docs/creators/getting-started
- GOG Submit Your Game: https://www.gog.com/submit-your-game

## Agent prompt

```text
Act as a release operations producer. Based on this game and its current stage, recommend the right distribution channels, what to ship publicly now, what to keep private, the packaging expectations per channel, and the release risks that should be solved before a paid launch.
```

## Review metadata

- Last reviewed: 2026-04-09
- Review owner: Games manager
- Next review trigger: when store policy or packaging requirements change
- Related research run: knowledge-distribution-release-ops
