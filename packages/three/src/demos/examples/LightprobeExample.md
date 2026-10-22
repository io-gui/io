---
source: webgpu_lightprobe
synced: d94661f706
---

# Lightprobe

[`webgpu_lightprobe`](https://threejs.org/examples/#webgpu_lightprobe), converted 2026-10-15

## Deviations

- **Helper:** the probe helpers overlay draws the probe's lighting on a small sphere in the editor's views, at the light icons' screen size rather than the source's one unit; the Camera view draws no helpers, so it lacks the source's sphere at (-10, 0, 0).

## Open

- `shared-refresh`: forward views keep the probe's first `intensity`; TRAA views follow.

## Upstream

- `shared-refresh`: a `LightProbe`'s `sh` and `intensity` are an object-group uniform that unchanged objects never upload again, a regression in r186. In the issue kits of 2026-10-15 (https://claude.ai/artifact/VcLnhjZSTRQ4jQPZH39eiz); an upstream fix is expected.

## Related

- [LightprobeCubecamera](LightprobeCubecameraExample.md): a probe from a cube camera, whose helper stays content as the source's subject.

## History

- 2026-10-15: Converted with the workaround. Checked in the editor (headless Chromium on the GPU): renders against `examples/screenshots`, scene graph names, Document tab controls changed with playback paused, the batch's 30 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
- 2026-10-21: Changed: the probe helpers overlay draws the probe; the content helper, drawn in every view until now, is dropped. Workaround removed: `triage-fragment-node-mrt`, with the helper. Checked headlessly on the linked r187dev build `d94661f706`: the probe in the Front (TRAA) and Perspective views, none in the Camera view, without console errors.
