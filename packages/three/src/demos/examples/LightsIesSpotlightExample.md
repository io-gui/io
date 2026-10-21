---
source: webgpu_lights_ies_spotlight
synced: d94661f706
tags: [stand-in-framing]
---

# LightsIesSpotlight

[`webgpu_lights_ies_spotlight`](https://threejs.org/examples/#webgpu_lights_ies_spotlight), converted 2026-10-15

## Deviations

- **Lights:** each joins the scene once its IES profile has loaded.

## History

- 2026-10-15: Converted. Checked in the editor (headless Chromium on the GPU): renders against `examples/screenshots`, scene graph names, Document tab controls changed with playback paused, the batch's 30 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
