---
source: webgpu_cubemap_adjustments
synced: d94661f706
---

# CubemapAdjustments

[`webgpu_cubemap_adjustments`](https://threejs.org/examples/#webgpu_cubemap_adjustments), converted 2026-10-15

## Deviations

- **Shader values:** the source's reference nodes point at the document's own properties instead of a settings object, so the Document tab drives them without change handlers.

## Upstream

- #34996 (merged 2026-10-14): `NodeMaterialObserver` refreshes objects under a custom `scene.environmentNode`. Without it the adjustments do not reach forward views (`shared-refresh`), the source's own page included. In the linked build; ships in r187.

## History

- 2026-10-15: Converted. Checked in the editor (headless Chromium on the GPU): renders against `examples/screenshots`, scene graph names, Document tab controls changed with playback paused, the batch's 30 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
