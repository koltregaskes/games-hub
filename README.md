# GameTrackDaily

Public-facing games site for the current lineup, plus public-safe `Game Development`, curated `Review Coverage`, `Games News`, and `Release Calendar` surfaces.

This repo is set up as a static GitHub Pages site. It intentionally does not include the private local-launch controls from the desktop hub. Instead, it acts as the public layer where game pages, screenshots, demos, store links, shared craft guidance, aggregated news, and curated games data can grow over time.

`Games News` is split into four public rails:
- `Game Dev News`
- `Gaming News`
- `Games Reviews`
- `Games Previews`

Those `Reviews` and `Previews` rails are curated coverage from the wider games press. They are not intended to become a personal house-review publication.

The public shell now uses focused pages instead of cramming everything into one surface:
- `games.html` for the full lineup
- `game-development.html` for public-safe craft/reference
- `news.html` as the news landing page
- `news-development.html`, `news-gaming.html`, `news-reviews.html`, and `news-previews.html` for the four feed rails
- `reviews.html` for review/previews coverage navigation
- `calendar.html` for releases only
- `events.html` for conferences, showcases, awards, local times, and official watch links

`Release Calendar` now stays focused on Windows PC, Xbox, and PlayStation release tracking, while `Events` handles conferences, showcases, and awards with local-time drill-downs and official watch destinations.

That news layer is filtered to `Windows PC`, `Xbox`, and `PlayStation`. Xbox and PlayStation coverage should use specific model or service tags such as `Xbox Series X`, `Xbox Series S`, `PlayStation 5`, `Xbox Game Pass`, or `PlayStation Plus` where the source supports that detail.

## Public vs Private

- This repo is public-facing only.
- The private studio console stays in the separate local-only `local-hub/` workspace and is ignored here.
- Do not commit machine-local evidence, review captures, launch scripts, or internal planning notes.
- Keep this repo safe for GitHub Pages and public browsing.
- Treat `shared/game-development/`, `shared/game-reviews/`, and `data/` as public-safe shared content the private console may also consume.

## Local preview

```powershell
python -m http.server 8790
```

Then open `http://127.0.0.1:8790`.

## Deployment

The repo includes a GitHub Pages workflow in `.github/workflows/deploy.yml`.

Once GitHub Pages is enabled for the repository, pushes to `main` will publish the site automatically.

## Contributor Notes

- Keep visible naming aligned with `GameTrackDaily`.
- Treat this as a public showcase and reference surface, not an operations dashboard.
- If a change only helps local management, it belongs in the private console, not this repo.
