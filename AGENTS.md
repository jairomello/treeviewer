# AGENTS.md — TreeViewer

## Communication style

- **Language:** always respond in Brazilian Portuguese (`pt-BR`). Keep technical
  terms, library/framework/tool names, and well-established conventions in
  English (e.g. `localStorage`, `treeviewer_v1`, `ICON_REGISTRY`, `innerHTML`,
  `textContent`, `commit`, `PR`, `commit message`). Code, identifiers, file
  paths, commands, and log output stay in English as written.
- **Default verbosity:** short and direct. Prefer one-line answers, tight
  bullets, and minimal preamble. Do not summarize what you did unless asked.
- **Detailed answers only when the user asks** for an in-depth analysis, an
  opinion, or to learn something — the user will always trigger this with a
  question. Out of that mode, stay terse.

## What this is

A zero-dependency, single-page visual brainstorming tool. The entire app is three
files at the repo root: `index.html`, `treeviewer.css`, `treeviewer.js`. No build
step, no bundler, no package manager, no server required. The app must keep
working when opened directly as `file://` in a browser.

## Run / dev

- Quick check: open `index.html` directly in a modern browser.
- Local server (for cross-device access or live reload):
  `python3 -m http.server 8080` or `npx serve .`
- No linter, typechecker, test runner, or CI workflows are configured. None are
  expected — do not introduce them. The only "checks" are manual: open the page
  and exercise the feature. PRs in this repo are expected to be cross-browser
  tested by the author (Chrome + Firefox at minimum).

## Architecture

- `index.html` (lang `pt-BR`) — single page, all UI markup, references
  `treeviewer.css` and `treeviewer.js`. UI labels and tooltips are in
  **Brazilian Portuguese (pt-BR)** — keep new strings in pt-BR.
- `treeviewer.css` — all styles. Organized by section banners
  (`/* ── Section ── */`). Follow the same banner style for new sections.
- `treeviewer.js` — single IIFE-less module in strict mode (`'use strict';` at
  top). Organized by banner comments. Key landmarks:
  - `ICON_REGISTRY` (lines ~11–239) — inline Lucide/Feather SVG strings with
    PT/EN keyword arrays. Single source of truth for icons.
  - `STORAGE_KEY = 'treeviewer_v1'` — `localStorage` key; bump only on a
    breaking schema change.
  - `state` object (~line 268) — single in-memory tree model.
  - Tree helpers: `findNode`, `findParentList`, `flattenVisible`, `countAll`.
  - Render path: full rebuild (`renderCanvas`) vs surgical
    `renderSingleNode` (used to avoid flicker during inline edits).
  - Notes modal: custom `markdownToHtml` / `htmlToMarkdown` (no deps).
  - ASCII export: `navigator.clipboard.writeText` with a `file://` fallback.

## Hard constraints

- **No new runtime dependencies.** No `npm` packages, no CDN imports, no
  `<script src="https://...">`. This is the project's core philosophy (see
  `CONTRIBUTING.md`).
- **Security: user-supplied data must go through `textContent`, never
  `innerHTML`.** The only `innerHTML` writes that are allowed are SVG content
  sourced from the hard-coded `ICON_REGISTRY`, hardcoded icon swaps
  (e.g. theme toggle), and the notes modal's own rendered HTML (which is itself
  produced by the internal `markdownToHtml`). Imported JSON is sanitized node by
  node before reaching the DOM — preserve that invariant.
- **Files-OK-from-`file://`.** Any new browser API used must work under
  `file://` (some APIs like `navigator.clipboard` are gated — use the existing
  fallback pattern, do not assume `https://` or `localhost`).

## Spec-driven workflow (OpenSpec)

This repo uses OpenSpec for proposing and tracking changes. Use the skills:

- `openspec-explore` — think through a problem before changing code.
- `openspec-propose` — author a proposal + specs + tasks.
- `openspec-apply-change` — implement tasks from an existing change.
- `openspec-archive-change` — archive a completed change.

The state lives in `openspec/` (`config.yaml`, `specs/`, `changes/`). Run the
OpenSpec skills before starting non-trivial work and update the relevant
artifacts as you go.

## Conventions and gotchas

- **Adding icons:** copy SVG path data from
  [Lucide](https://lucide.dev), append a `{ name, kw: [...], svg: '...' }` entry
  to `ICON_REGISTRY` with both PT and EN keywords. If a new icon comes from a
  library that is not Lucide or Feather, also update `THIRD_PARTY_NOTICES`.
- **PR branch naming:** fork + branch from `main` as `feat/<short-name>` (see
  `CONTRIBUTING.md`).
- **PR template checklist** (`.github/PULL_REQUEST_TEMPLATE.md`) is the
  contract — every box must hold: no new deps, works under `file://`, no
  `innerHTML` for user data, `THIRD_PARTY_NOTICES` updated if icons were added,
  `README.md` updated if behavior changed.
- **Local assistant metadata** (`BEAT.md` / `beat.md`) is gitignored — do not
  commit it.
- **`.opencode/`** holds opencode plugin assets (skills, commands,
  `package.json`, `node_modules`). The whole `node_modules`, `package.json`,
  `package-lock.json`, `bun.lock`, and `.gitignore` inside `.opencode/` are
  themselves gitignored — do not try to "fix" that.
- **CSS class prefix is `tv-`** (e.g. `tv-node`, `tv-canvas`, `tv-header`).
  Use the prefix for any new class.
- **No TODOs left in the source** — the project ships clean; do not introduce
  placeholder code or commented-out blocks.
