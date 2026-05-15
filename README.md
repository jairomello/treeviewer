# TreeViewer

TreeViewer is a lightweight, zero-dependency visual brainstorming tool for building and navigating hierarchical tree structures directly in the browser. It runs as a single HTML, CSS, and JavaScript app with no build step, no package manager, and no server.

## Features

- **Hierarchical tree editing** — add, rename, remove, move, indent, and unindent nodes
- **Drag and drop** — reorder nodes inside a tree and reorder root cards across the canvas
- **Per-node icon picker** with ~200 inline Lucide/Feather icons and keyword search (PT/EN)
- **Per-node notes** — edit markdown in visual and raw modes
- **Multiple trees** on a single canvas
- **Card minimize / maximize** for each root tree
- **Dark / light theme** toggle
- **Zoom** from 50% to 200%
- **ASCII art export** — copy any tree as a `tree`-style text block
- **Save to JSON** — export the entire project to a portable `.json` file
- **Open from JSON** — load a previously saved project on any machine
- **New project** — clear the canvas with confirmation
- **Keyboard-first** navigation (see shortcuts below)
- **Auto-save** to `localStorage` — your work survives page reloads
- **Zero dependencies** — single HTML + CSS + JS, no npm, no bundler

## Quick start

Open `index.html` in any modern browser. No installation and no build step are required.

```bash
git clone https://github.com/jairomello/treeviewer.git
cd treeviewer
# Open index.html in your browser
```

To serve it over a local network so other devices can access it:

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

Projects are saved as plain JSON files. Imported files are sanitized node by node before entering application state.

```json
{
  "roots": [
    {
      "id": "n1_ab1c2",
      "name": "My project",
      "iconName": "FolderOpen",
      "expanded": true,
      "minimized": false,
      "notes": "",
      "children": [
        {
          "id": "n2_xy9z0",
          "name": "Idea A",
          "iconName": "Lightbulb",
          "expanded": true,
          "notes": "## Next step",
          "children": []
        }
      ]
    }
  ]
}
```

## Browser compatibility

Recent evergreen browsers such as Chrome, Firefox, Safari, and Edge. TreeViewer uses standard Web APIs including `localStorage`, `FileReader`, `URL.createObjectURL`, `navigator.clipboard`, and `contenteditable`. Clipboard copy includes a fallback path for `file://` usage when needed.

## Project notes

- The current UI labels are in Brazilian Portuguese (`pt-BR`)
- The application is fully static and can be opened from the filesystem or served by any basic web server

## Third-party attributions

This project embeds icons from **Lucide** and its ancestor project **Feather Icons**. Full license text is available in [`THIRD_PARTY_NOTICES`](./THIRD_PARTY_NOTICES).

## License

Copyright 2026 TreeViewer contributors

Licensed under the **Apache License, Version 2.0**. You may obtain a copy of the license at:

> https://www.apache.org/licenses/LICENSE-2.0

See the [LICENSE](./LICENSE) file for the full text.