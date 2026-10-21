---
source: webgl_lines_colors
synced: d94661f706
tags: [pointer-dropped]
---

# LinesColors

[`webgl_lines_colors`](https://threejs.org/examples/#webgl_lines_colors), converted 2026-10-17 (batch 3)

## Deviations

- **Camera:** the source's camera follows the pointer; the active camera rests where the pointer at the centre leaves it.

## History

- 2026-10-17: Converted (batch 3), with the pointer camera dropped. Checked: renders against `examples/screenshots` (Perspective and Front views), every Document tab control changed headlessly, the batch's 39 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011), resting where the pointer at the centre leaves it. Checked: the Scene Camera view against `examples/screenshots`.
