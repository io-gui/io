---
source: webgpu_generator_city
synced: d94661f706
tags: [per-frame-gpu, renderer-on-change, timeline-time]
---

# GeneratorCity

[`webgpu_generator_city`](https://threejs.org/examples/#webgpu_generator_city), converted 2026-10-20 (batch 5)

## Deviations

- **Probes and environment:** `seed` and `timeOfDay` regenerate the sky environment and restart the probe bake in `onBeforeDraw`, per renderer; the bake does one row of probes per draw against the city's box proxy, after the environment ([GPU work per frame](../ExamplesConversion.plan.md#gpu-work-per-frame)).
- **Probes:** the probe helpers overlay draws them in the editor's views, so the source's helper and `showProbes` are dropped; the Camera view draws no helpers.
- **Bloom:** the source's bloom is the document's (Rendering), without its quarter resolution; so is its exposure.
- **Time:** the clouds drift on the timeline (`overrideNode( time, timeline.timeNode )`).
- **Camera:** the first-person controls are dropped; the active camera keeps the source's start pose.

## History

- 2026-10-20: Converted (batch 5), once `onBeforeDraw` served `renderer-on-change`, which had blocked it since 2026-10-15. Ran on the linked r187dev build `d94661f706`. Checked headlessly: matches the source rendered from the same sources on the same GPU; property edits and scrubbing, all batch 5 documents in one page without errors.
- 2026-10-21: Changed: the probe helpers overlay draws the probes, three's `LightProbeGridHelper` with its own material (the overlay pass has no MRT); the authored helper and `showProbes` are dropped. Workaround removed: `triage-fragment-node-mrt`, with the helper. Checked headlessly on the linked r187dev build `d94661f706`: the probes in the Front (TRAA) and Perspective views, none in the Camera view, without console errors.
