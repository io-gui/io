---
source: webgl_geometry_convex
synced: d94661f706
tags: [camera-in-scene]
---

# GeometryConvex

[`webgl_geometry_convex`](https://threejs.org/examples/#webgl_geometry_convex), converted 2026-10-10

## Deviations

- **Points:** a `Sprite` draws the hull's points at the source's size; WebGPU draws `Points` 1 px wide ([WebGPU notes](../ExamplesConversion.plan.md#webgpu-notes)).
- **Time:** the group turns once per 20 s loop of document time; the source adds 0.005 rad per frame.

## History

- 2026-10-10: Converted from the earlier `ThreeApplet` version to a `Document` (`289e7bf9`).
- 2026-10-11: Checked against r186 and HEAD: compiles and renders on r186 without WebGPU validation errors (headless). Fixed: the point color typed as `color(c).rgb × texture.rgb` for the r186 typings. The light stood fixed.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011), in the scene with the light on it again. Checked: the Scene Camera view against `examples/screenshots`.
