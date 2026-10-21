---
source: webgpu_sky
synced: d94661f706
tags: [per-frame-gpu, timeline-time, loop-jump]
---

# Sky

[`webgpu_sky`](https://threejs.org/examples/#webgpu_sky), converted 2026-10-20 (batch 5)

## Deviations

- **Capture:** the `CubeCamera` captures the sky around the sphere in `onBeforeDraw`, before every draw, so sky edits show in the reflection too ([GPU work per frame](../ExamplesConversion.plan.md#gpu-work-per-frame)).
- **Time:** the clouds drift on the timeline (`overrideNode( time, timeline.timeNode )`), the source's on TSL's global `time`; the 60 s loop jumps at the wrap.
- **Controls:** the source's `exposure` is the document's (Rendering).

## Upstream

- `98833ef5a4` (#34840) Examples - Clean Up 2. Not applicable: the info text.

## History

- 2026-10-20: Converted (batch 5), once `onBeforeDraw` served `renderer-on-change`. Ran on the linked r187dev build `d94661f706`. Checked headlessly: the active view against `examples/screenshots`, property edits and scrubbing, all batch 5 documents in one page without errors.
