---
source: webgl_loader_svg
synced: d94661f706
---

# LoaderSvg

[`webgl_loader_svg`](https://threejs.org/examples/#webgl_loader_svg), converted 2026-10-14

## Deviations

- **Controls:** `file` (labeled options), `fills`, `strokes`, `fillWire` and `strokeWire`; an option change rebuilds the meshes from the loaded data, where the source reloads the file.

## Open

- `r187-followups`: add the two test files of #35005 to `file` once they are on threejs.org.

## Upstream

- `a100935e2e` (#35005) SVGLoader: Improve path parsing. Not ported: its two new test files (`closePathInitialPoint`, `closePathOpenSubpath`) reach threejs.org with r187 (`r187-followups`).

## History

- 2026-10-14: Converted. Checked in the editor (headless Chromium on the GPU): renders, scene graph names, Document tab controls with playback paused (file switches), the batch's 30 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
- 2026-10-21: Synced to `d94661f706`: one upstream change since r186 (#35005), not ported yet.
