---
source: webgpu_ocean
synced: d94661f706
tags: [renderer-on-change, timeline-time, loop-jump]
---

# Ocean

[`webgpu_ocean`](https://threejs.org/examples/#webgpu_ocean), converted 2026-10-20 (batch 5)

## Deviations

- **Environment:** the sky's PMREM regenerates in `onBeforeDraw` when the sun moves, once per renderer ([GPU work per frame](../ExamplesConversion.plan.md#gpu-work-per-frame)).
- **Time:** the waves and the clouds move on the timeline (`overrideNode( time, timeline.timeNode )`), the source's on TSL's global `time`. The box bobs and turns with document time on a 20π s loop; its z turn, the waves and the clouds jump at the wrap.
- **Bloom:** the source's bloom is the document's (Rendering), as is its exposure.

## Upstream

- `98833ef5a4` (#34840) Examples - Clean Up 2. Not applicable: the info text.

## History

- 2026-10-20: Converted (batch 5), once `onBeforeDraw` served `renderer-on-change`, which had blocked it since 2026-10-15. Ran on the linked r187dev build `d94661f706`. Checked headlessly: matches the source rendered from the same sources on the same GPU; property edits and scrubbing, all batch 5 documents in one page without errors.
