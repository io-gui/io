---
source: webgl_animation_skinning_blending
synced: d94661f706
tags: [live]
---

# AnimationSkinningBlending

[`webgl_animation_skinning_blending`](https://threejs.org/examples/#webgl_animation_skinning_blending), converted 2026-10-10

## Deviations

- **Crossfades:** three target buttons (`idle`, `walk`, `run`) instead of the source's four from-to buttons, which adds idle to run (2.5 s) and back (5 s). A press is ignored while a crossfade runs or no action is at full weight; the source disables the buttons that do not apply (Open).
- **Controls:** `isActive` stands for the source's `deactivate all` and `activate all` buttons. The effective weights are read-only (the source's sliders also set them). Time scale is the mixer's `timeScale` in the Document tab.
- **Time:** a live document ([ADR-0009](../../../docs/adr/0009-live-documents-use-the-timeline-as-a-clock.md)): only time played forward advances the mixer, so wraps and scrubbing back neither rewind nor reset it. Pause and single step are the editor's transport; a step is one frame, not the source's 0.05 s.
- **`showModel`:** hides the meshes only; the source's `show skeleton` is the skeleton helpers overlay.

## Open

- `crossfade-state`: show which crossfade or base action applies; the source disables or dims its buttons.

## Upstream

- `7300402f96` (#34586) Examples: Only use SunLight in larger scenes. Ported: `DirectionalLight`, as the source has again (r186 had `SunLight`).

## Related

- [AnimationSkinningAdditiveBlending](AnimationSkinningAdditiveBlendingExample.md): the other live crossfade example, also open on `crossfade-state`.

## History

- 2026-10-10: Converted from the earlier `ThreeApplet` version to a `Document` (`289e7bf9`).
- 2026-10-11: Checked against r186 and HEAD. Fixed: the crossfade end in mixer time instead of a `setTimeout`; the camera aspect no longer read from `window`; `showModel` and `showSkeleton` (with a `SkeletonHelper`).
- 2026-10-11: Changed: a live document (ADR-0009), so only time played forward advances the mixer. `paused`, `makeSingleStep` and `stepSize` dropped for the editor's transport; the weight sliders became read-only effective weights; per-transition crossfade durations as in the source, plus idle and run.
- 2026-10-13: Changed: `showSkeleton` and the `SkeletonHelper` dropped for the skeleton helpers overlay; `showModel` hides the meshes only.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
- 2026-10-21: Synced to `d94661f706`: one upstream change since r186 (#34586), already ported.
