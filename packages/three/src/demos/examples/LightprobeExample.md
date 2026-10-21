---
source: webgpu_lightprobe
synced: d94661f706
---

# Lightprobe

[`webgpu_lightprobe`](https://threejs.org/examples/#webgpu_lightprobe), converted 2026-10-15

## Deviations

- **Helper:** the light probe helper, the probe's lighting on a small sphere, is content; the light helpers overlay draws no probes.

## Workarounds

- `triage-fragment-node-mrt`: `useBasicMaterial()` gives the probe helper a `MeshBasicNodeMaterial` whose `colorNode` is the same irradiance; the helper's `fragmentNode` writes only the first color output, which the TRAA views' MRT pass rejects. **Restore:** the helper's own material.

## Open

- `shared-refresh`: forward views keep the probe's first `intensity`; TRAA views follow.

## Upstream

- `shared-refresh`: a `LightProbe`'s `sh` and `intensity` are an object-group uniform that unchanged objects never upload again, a regression in r186. In the issue kits of 2026-10-15 (https://claude.ai/artifact/VcLnhjZSTRQ4jQPZH39eiz); an upstream fix is expected.

## History

- 2026-10-15: Converted with the workaround. Checked in the editor (headless Chromium on the GPU): renders against `examples/screenshots`, scene graph names, Document tab controls changed with playback paused, the batch's 30 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
