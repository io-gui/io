---
source: webgl_lights_spotlights
synced: d94661f706
tags: [stand-in-framing]
---

# LightsSpotlights

[`webgl_lights_spotlights`](https://threejs.org/examples/#webgl_lights_spotlights), converted 2026-10-17 (batch 3)

## Deviations

- **Time:** the source tweens to random targets with tween.js on the wall clock; here eight targets per light are drawn once and the tweens derive from document time, one per 5 s of a 40 s loop that starts from the last.

## History

- 2026-10-17: Converted (batch 3). Checked: renders against `examples/screenshots` (Perspective and Front views), every Document tab control changed headlessly, the batch's 39 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
