---
source: webgpu_tsl_vfx_flames
synced: d94661f706
tags: [timeline-time, loop-jump]
---

# TslVfxFlames

[`webgpu_tsl_vfx_flames`](https://threejs.org/examples/#webgpu_tsl_vfx_flames), converted 2026-10-11

## Deviations

- **Time:** TSL `time` is `timeline.timeNode`, a 20 s loop: the noise scrolls repeat, and the 10 rad/s flicker jumps once.
- **Gradient:** the source's canvas gradient is a `DataTexture` built in JavaScript.
- **Depth:** the flames do not write depth; their transparent quads hid the grid.

## History

- 2026-10-11: Converted. Checked headlessly: renders through the page's shared renderer at a fixed time, compared with `examples/screenshots`.
- 2026-10-13: Fixed: half of each flame was clipped in the orthographic front and back views (a degenerate clip range from `clipPlanesFromBox`).
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
