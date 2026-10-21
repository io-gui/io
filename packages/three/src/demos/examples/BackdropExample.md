---
source: webgpu_backdrop
synced: d94661f706
tags: [loop-jump, timeline-time, camera-in-scene]
---

# Backdrop

[`webgpu_backdrop`](https://threejs.org/examples/#webgpu_backdrop), converted 2026-10-10

## Deviations

- **Time:** the spheres circle by `delta` times the mixer's `timeScale` (Document tab), so they jump at the loop wrap. The source stops them while you orbit (its controls' `start` and `end`); here they keep turning. The hue and saturation spheres and the posterize mix run on `timeline.timeNode`.

## Open

- `inspector-refresh`: the Document tab follows the mixer through a debug-only `dispatchMutation` in `onAnimate`, which bundles strip.

## History

- 2026-10-10: Converted from the earlier `ThreeApplet` version to a `Document` (`289e7bf9`).
- 2026-10-11: Checked against r186 and HEAD: compiles and renders on r186 without WebGPU validation errors (headless). Fixed: the timeline is the clip's length, with `mixer.setTime` keeping the two aligned.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011), in the scene with the spot light on it as in the source; the light had stood at (1, 2, 3). Checked: the Scene Camera view against `examples/screenshots`.
