---
source: webgpu_reflection_roughness
synced: d94661f706
tags: [timeline-time]
---

# ReflectionRoughness

[`webgpu_reflection_roughness`](https://threejs.org/examples/#webgpu_reflection_roughness), converted 2026-10-15 (batch 2)

## Deviations

- **Time:** the roughness noise scrolls on `timeline.timeNode`, a 10 s loop.
- **Camera:** the active camera stands where the source's slow auto-rotation starts.

## History

- 2026-10-15: Converted (batch 2), with the auto-rotating camera dropped. Checked: renders against `examples/screenshots` (Perspective and Front views), scene graph names, Document tab controls, the batch's 30 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011), standing where its auto-rotation starts. Checked: the Scene Camera view against `examples/screenshots`.
