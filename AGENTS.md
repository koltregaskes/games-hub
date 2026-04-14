# Games Hub Agent Guide

## Purpose

`games-hub` is the public-facing showcase repo for the current game slate.

It is not the private studio console.

## What Belongs Here

- public-safe copy
- showcase layout and styling
- screenshots, demos, repo links, and release links
- GitHub Pages-safe assets and metadata

## What Must Stay Out

- private launch controls
- local-only hub data
- machine-local evidence paths
- internal planning notes
- anything that only makes sense inside the manager console

## Working Rules

- Keep visible naming aligned with `Games Hub`.
- Preserve the public/private split.
- Prefer small, reviewable changes.
- Update public docs when you change public-facing behavior.

## Safety Checks

- Confirm `.gitignore` still excludes `local-hub/` and local scratch files.
- Do not add secrets or `.env` files.
- Treat this repo as safe for GitHub Pages and public browsing.
