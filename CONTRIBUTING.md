# Contributing to TreeViewer

Thank you for taking the time to contribute!

## Ground rules

- Be respectful and constructive in all discussions.
- All contributions are accepted under the project's [Apache 2.0 license](./LICENSE).
- Keep the project's core philosophy in mind: **zero dependencies, no build step, pure vanilla JS**.

## How to report a bug

1. Search existing [Issues](../../issues) to avoid duplicates.
2. Open a new issue using the **Bug report** template.
3. Include: browser/OS, steps to reproduce, what you expected, what actually happened.

## How to suggest a feature

1. Search existing [Issues](../../issues) and [Discussions](../../discussions) first.
2. Open a new issue using the **Feature request** template.
3. Explain the problem you are solving, not just the solution.

## Development setup

There is no build step. Clone the repository and open `index.html` directly in your browser.

```bash
git clone https://github.com/YOUR_USERNAME/treeviewer.git
cd treeviewer
# Open index.html in your browser
```

For a live-reload workflow you can use any static server:

```bash
python3 -m http.server 8080
# or: npx serve .
```

## Submitting a pull request

1. Fork the repository and create a branch from `main`:
   ```bash
   git checkout -b feat/my-feature
   ```
2. Make your changes. Keep commits focused and atomic.
3. Test in at least two different browsers (e.g. Chrome and Firefox).
4. Open a pull request against `main`. Fill out the PR template.
5. A maintainer will review and may request changes.

## Code style

- **No dependencies** — do not introduce `npm` packages or CDN imports.
- **No build toolchain** — the output must remain a single HTML + CSS + JS trio that works opened directly from disk.
- Use `'use strict'` (already at the top of `treeviewer.js`).
- Prefer `textContent` over `innerHTML` when inserting user-provided data.
- Follow the existing section structure and comment style in `treeviewer.js`.

## Third-party icons

If you add new icons, use SVG paths from [Lucide](https://lucide.dev) and add the icon to `ICON_REGISTRY` in `treeviewer.js`. Lucide is already credited in [`THIRD_PARTY_NOTICES`](./THIRD_PARTY_NOTICES). No additional attribution is needed for individual icons from the same library.
