# TreeViewer

A visual brainstorming tool for building and navigating tree structures — entirely in the browser, with no build step, no dependencies, and no server required.

![TreeViewer screenshot](https://raw.githubusercontent.com/placeholder/treeviewer/main/docs/screenshot.png)

## Features

- **Hierarchical tree editing** — add, rename, remove, move, indent and unindent nodes
- **Drag and drop** reordering across the canvas
- **Per-node icon picker** with ~200 inline Lucide icons and keyword search (PT/EN)
- **Multiple trees** on a single canvas
- **Dark / light theme** toggle
- **Zoom** from 50 % to 200 %
- **ASCII art export** — copy any tree as a `tree`-style text block
- **Save to JSON** — export the entire project to a portable `.json` file
- **Open from JSON** — load a previously saved project on any machine
- **New project** — clear the canvas with a single click
- **Keyboard-first** navigation (see shortcuts below)
- **Auto-save** to `localStorage` — your work survives page reloads
- **Zero dependencies** — single HTML + CSS + JS, no npm, no bundler

## Quick start

Just open `index.html` in any modern browser. No installation, no build step.

```bash
git clone https://github.com/YOUR_USERNAME/treeviewer.git
cd treeviewer
# Open index.html in your browser — that's it.
```

To serve it over a local network (so other devices can access it):

```bash
python3 -m http.server 8080
# Then open http://localhost:8080 in your browser
```

## Keyboard shortcuts

| Key | Action |
|---|---|
| `Insert` | Add child to selected node (or new root tree if nothing is selected) |
| `F2` | Rename selected node |
| `Delete` | Remove selected node (with confirmation if it has children) |
| `↑` / `↓` | Navigate between visible nodes |
| `Alt` + `↑` / `↓` | Move node up / down among siblings |
| `Alt` + `←` | Promote — make the node a sibling of its parent |
| `Alt` + `→` | Demote — make the node a child of the node above it |
| `→` | Expand node / move to first child |
| `←` | Collapse node / move to parent |
| `Enter` | Confirm inline name edit |
| `Escape` | Cancel inline name edit |

## File format

Projects are saved as plain JSON files. The schema is intentionally minimal and human-readable:

```json
{
  "roots": [
    {
      "id": "n1_ab1c2",
      "name": "My project",
      "iconName": "FolderOpen",
      "expanded": true,
      "children": [
        {
          "id": "n2_xy9z0",
          "name": "Idea A",
          "iconName": "Lightbulb",
          "expanded": true,
          "children": []
        }
      ]
    }
  ]
}
```

## Browser compatibility

Any evergreen browser (Chrome 80+, Firefox 75+, Safari 14+, Edge 80+). Uses standard Web APIs: `localStorage`, `FileReader`, `URL.createObjectURL`, `navigator.clipboard`.

## Third-party attributions

This project embeds icons from **Lucide** and its ancestor project **Feather Icons**. Full license text is in [`THIRD_PARTY_NOTICES`](./THIRD_PARTY_NOTICES).

## License

Copyright 2025 — TreeViewer contributors

Licensed under the **Apache License, Version 2.0** (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at:

> https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the [LICENSE](./LICENSE) file for the full text.
