---
source: webgpu_reflection_blurred
synced: d94661f706
tags: [timeline-time, loop-jump]
---

# ReflectionBlurred

[`webgpu_reflection_blurred`](https://threejs.org/examples/#webgpu_reflection_blurred), converted 2026-10-15 (batch 2)

## Deviations

- **Time:** TSL `time` is `timeline.timeNode` and the timeline takes the clip's length, so the light rings and the background hue jump at the wrap.
- **Camera:** the active camera stands where the source's auto-rotation starts.

## History

- 2026-10-15: Converted (batch 2), with the auto-rotating camera dropped. Checked: renders against `examples/screenshots` (Perspective and Front views), scene graph names, Document tab controls, the batch's 30 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011), standing where its auto-rotation starts. Checked: the Scene Camera view against `examples/screenshots`.
