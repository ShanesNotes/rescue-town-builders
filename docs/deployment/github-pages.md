# GitHub Pages deployment

Static host target: GitHub Pages for `ShanesNotes/rescue-town-builders`.

The workflow is `.github/workflows/pages.yml`. It is manual-only (`workflow_dispatch`) so an agent does not publish an external production surface without explicit human action.

## Local verification

```sh
npm test
npm run typecheck
GITHUB_PAGES=true npm run build
npm run preview
```

## Human activation

1. Open the repository Actions tab.
2. Run **Build static prototype for GitHub Pages**.
3. If GitHub asks for Pages source, choose GitHub Actions.
4. The expected Pages base path is `/rescue-town-builders/`.

## Notes

- No backend is deployed.
- No child-facing external links are added to the game UI.
- The theme loop remains backlog-only until the four segments are spliced and source notes are recorded.
