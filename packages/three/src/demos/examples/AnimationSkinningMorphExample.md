---
source: webgl_animation_skinning_morph
synced: d94661f706
tags: [live]
---

# AnimationSkinningMorph

[`webgl_animation_skinning_morph`](https://threejs.org/examples/#webgl_animation_skinning_morph), converted 2026-10-17 (batch 3)

## Deviations

- **Time:** a live document ([ADR-0009](../../../docs/adr/0009-live-documents-use-the-timeline-as-a-clock.md)): the state, emotes and their fades advance only with time played forward, so wraps and scrubbing back neither rewind nor reset them.

## History

- 2026-10-17: Converted (batch 3). Checked: renders against `examples/screenshots` (Perspective and Front views), every Document tab control changed headlessly, the batch's 39 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
