# Games Hub by E-lusion Studios

Public-facing studio hub for the current E-lusion Studios game lineup.

This repo is set up as a static GitHub Pages site. It intentionally does not include the private local-launch controls from the desktop hub. Instead, it acts as the public layer where game pages, screenshots, demos, and store links can grow over time.

## Local preview

```powershell
python -m http.server 8790
```

Then open `http://127.0.0.1:8790`.

## Deployment

The repo includes a GitHub Pages workflow in `.github/workflows/deploy.yml`.

Once GitHub Pages is enabled for the repository, pushes to `main` will publish the site automatically.
