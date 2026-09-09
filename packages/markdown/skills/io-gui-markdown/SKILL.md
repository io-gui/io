---
name: io-gui-markdown
description: >-
  Render markdown with IoMarkdown (fetch, highlight, sanitize, data-heading anchors).
  Use when working with @io-gui/markdown or doc content wired to navigation anchors.
---

# @io-gui/markdown

## Defaults

- Import from `@io-gui/markdown`.
- Set `src` to a markdown URL; `sanitize` defaults **true**.
- Optional `strip` = regex patterns removed before display.

## Gotchas

- Headings get **`data-heading`** for navigation Anchor sync — preserve ids if you strip content.
- Highlight theme follows **`ThemeSingleton.themeID`**.
- `marked` / `dompurify` are runtime deps (not inlined away).
- Failed fetch can leave loading spinner — handle errors if you need a visible failure state.
- `src=""` clears content without a loading flash.

## Read next

- Glossary: [CONTEXT.md](../../CONTEXT.md)
- API: [README.md](../../README.md)
