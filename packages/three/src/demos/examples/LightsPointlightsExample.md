---
source: webgpu_lights_pointlights
synced: d94661f706
tags: [timeline-time]
---

# LightsPointlights

[`webgpu_lights_pointlights`](https://threejs.org/examples/#webgpu_lights_pointlights), converted 2026-10-11

## Deviations

- **Time:** the shards pulse on `timeline.timeNode` in a 16π s loop.

## History

- 2026-10-11: Converted. Checked headlessly: renders through the page's shared renderer at a fixed time, compared with `examples/screenshots`.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
