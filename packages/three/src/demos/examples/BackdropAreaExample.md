---
source: webgpu_backdrop_area
synced: d94661f706
tags: [timeline-time]
---

# BackdropArea

[`webgpu_backdrop_area`](https://threejs.org/examples/#webgpu_backdrop_area), converted 2026-10-10

## Deviations

- **Controls:** the box scale is one linkable `Vector3` (`boxScale`) for the source's `x` and `y` sliders.
- **Time:** the background's hue runs on `timeline.timeNode`.

## History

- 2026-10-10: Converted from the earlier `ThreeApplet` version to a `Document` (`289e7bf9`).
- 2026-10-11: Checked against r186 and HEAD: compiles and renders on r186 without WebGPU validation errors (headless). Fixed: `NeutralToneMapping` (exposure 0.9 had no effect), the floor 5 × 5, camera near and far 0.25 and 25, the default preset `checker`.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
