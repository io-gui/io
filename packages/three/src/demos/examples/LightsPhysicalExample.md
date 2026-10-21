---
source: webgpu_lights_physical
synced: d94661f706
---

# LightsPhysical

[`webgpu_lights_physical`](https://threejs.org/examples/#webgpu_lights_physical), converted 2026-10-15

## Deviations

- **Exposure:** the source's exposure slider (0.68, raised to the fifth power) is the document's `toneMappingExposure`, 0.68⁵ ≈ 0.145.
- **`shadows`:** turns the bulb's shadow off; the source switches the renderer's shadow map, which the editor shares.

## History

- 2026-10-15: Converted. Checked in the editor (headless Chromium on the GPU): renders against `examples/screenshots`, scene graph names, Document tab controls changed with playback paused, the batch's 30 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
