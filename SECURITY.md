# Security Policy

## Supported versions

| Version | Supported |
|---------|-----------|
| latest (`main`) | Yes |

## Threat model

TreeViewer is a **client-side only** application. It:

- Makes **no network requests** of any kind.
- Stores data **only in `localStorage`** of the user's own browser.
- Reads files **only when the user explicitly selects them** via the OS file picker.
- Does **not execute user-supplied code**.

User-supplied text (node names) is inserted into the DOM exclusively via
`textContent`, never via `innerHTML`. SVG content set via `innerHTML` comes
exclusively from the hard-coded `ICON_REGISTRY` in `treeviewer.js` and is
never interpolated with user data.

## Reporting a vulnerability

If you discover a security vulnerability, **please do not open a public
GitHub issue**.

Instead, report it privately:

1. Go to the repository's **Security** tab on GitHub.
2. Click **"Report a vulnerability"** (GitHub private advisories).
3. Provide: description of the issue, steps to reproduce, potential impact,
   and (optionally) a suggested fix.

We aim to acknowledge reports within **72 hours** and to release a patch
within **14 days** for confirmed issues.

## Scope

In-scope:
- Cross-site scripting (XSS) via crafted JSON files loaded by a user
- Prototype pollution via crafted JSON
- Unexpected exfiltration of `localStorage` data

Out-of-scope:
- Social-engineering attacks requiring physical access to the user's machine
- Vulnerabilities in the browser itself
- Issues in third-party tools used to serve the static files
