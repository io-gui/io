---
source: webgpu_instance_mesh
synced: d94661f706
tags: [loop-jump, timeline-time]
---

# InstanceMesh

[`webgpu_instance_mesh`](https://threejs.org/examples/#webgpu_instance_mesh), converted 2026-10-13

## Deviations

- **Time:** an 8π s loop; the 10 s color mix runs on `timeline.timeNode` and jumps at the wrap.
- **Controls:** `instanceCount` for the source's `count`; its `?amount` query is dropped (10 per side).

## History

- 2026-10-13: Converted. Checked in the editor (headless Chromium on the GPU): renders, scene graph names, Document tab controls with playback paused, no console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
