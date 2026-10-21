---
source: webgpu_animation_retargeting
synced: d94661f706
tags: [timeline-time]
---

# AnimationRetargeting

[`webgpu_animation_retargeting`](https://threejs.org/examples/#webgpu_animation_retargeting), converted 2026-10-10

## Deviations

- **Time:** the light-speed background runs on `timeline.timeNode`.
- **Dropped:** the source's `show helpers` toggle; views with the skeleton helpers overlay draw both skeletons.

## Upstream

- `011d3c8d63` (#34843) TSL: Simplify function layouts. Ported: `lightSpeed` takes `time` and declares its layout inline.

## History

- 2026-10-10: Converted from the earlier `ThreeApplet` version to a `Document` (`289e7bf9`).
- 2026-10-11: Checked against r186 and HEAD: compiles and renders on r186 without WebGPU validation errors (headless). Fixed: `NeutralToneMapping`; `lightSpeed` in the HEAD layout form, which the r186 typings take.
- 2026-10-13: Changed: the skeletons come from the skeleton helpers overlay; the authored `SkeletonHelper`s and their toggle are gone.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
- 2026-10-21: Synced to `d94661f706`: one upstream change since r186 (#34843), already ported.
