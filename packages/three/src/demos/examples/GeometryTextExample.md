---
source: webgl_geometry_text
synced: d94661f706
tags: [pointer-dropped]
---

# GeometryText

[`webgl_geometry_text`](https://threejs.org/examples/#webgl_geometry_text), converted 2026-10-17 (batch 3)

## Deviations

- **Controls:** the text is typed in `text` instead of key presses; `fontName` and `fontWeight` are dropdowns for the source's font and weight buttons.
- **Fonts:** cached per document instead of with the global `Cache.enabled`.
- **Pointer:** the drag that turned the text is dropped.

## History

- 2026-10-17: Converted (batch 3). Checked: renders against `examples/screenshots` (Perspective and Front views), every Document tab control changed headlessly, the batch's 39 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
