# Alethiometer

Browser rebuild of the old Alethiometer app, with the original archive kept in the repo for reference.

## Project Layout

- `src/` - React app, stores, services, domain logic, and UI
- `public/` - icons, symbol images, and dial spritesheet assets
- `scripts/` - asset maintenance scripts
- `archive/` - original Flash/AIR materials and references

## Stack

- Vite
- React
- TypeScript
- SVG dial interaction and motion

## Development

```bash
npm install
npm run dev
```

## Scripts

```bash
npm run build
npm test
npm run assets:spritesheet
```

`npm run assets:spritesheet` rebuilds `public/assets/graphics-spritesheet.webp` from the `2048x2048` master PNG.

## Publishing

The repo includes a GitHub Pages workflow in `.github/workflows/deploy-pages.yml`.

Pages notes:

- Vite automatically uses the repository name as `base` when building on GitHub Actions.
- Public asset paths are base-aware, so the app can be served from `/<repo>/`.
- The web app is static and does not require a server runtime.

## Notes

- Meanings, settings, and saved readings live in browser `localStorage`.
- The original dial art, symbol images, and archive materials are reused from the old project.
- The current dial spritesheet uses a `2048x2048` master PNG plus an optimized WebP runtime asset.
