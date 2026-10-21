---
source: webgl_animation_skinning_additive_blending
synced: d94661f706
tags: [live]
---

# AnimationSkinningAdditiveBlending

[`webgl_animation_skinning_additive_blending`](https://threejs.org/examples/#webgl_animation_skinning_additive_blending), converted 2026-10-10

## Deviations

- **Controls:** the base actions are `none`, `idle`, `walk` and `run` buttons; the additive poses' weights are in the action inspector (`additiveActions`); time scale is the mixer's `timeScale` in the Document tab.
- **Time:** a live document ([ADR-0009](../../../docs/adr/0009-live-documents-use-the-timeline-as-a-clock.md)): only time played forward advances the mixer, so wraps and scrubbing back neither rewind nor reset it.

## Open

- `crossfade-state`: show which base action applies; the source dims the buttons that do not.
- `inspector-refresh`: the Document tab follows the weights through a debug-only `dispatchMutation` in `onAnimate`, which bundles strip.

## Upstream

- `7300402f96` (#34586) Examples: Only use SunLight in larger scenes. Ported: `DirectionalLight` with its shadow camera.

## Related

- [AnimationSkinningBlending](AnimationSkinningBlendingExample.md): the other live crossfade example, also open on `crossfade-state`.

## History

- 2026-10-10: Converted from the earlier `ThreeApplet` version to a `Document` (`289e7bf9`).
- 2026-10-11: Checked against r186 and HEAD: compiles and renders on r186 without WebGPU validation errors (headless).
- 2026-10-11: Changed: a live document (ADR-0009), so time going back is ignored.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
- 2026-10-21: Synced to `d94661f706`: one upstream change since r186 (#34586), already ported.
