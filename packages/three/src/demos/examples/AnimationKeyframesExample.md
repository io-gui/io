---
source: webgl_animation_keyframes
synced: d94661f706
---

# AnimationKeyframes

[`webgl_animation_keyframes`](https://threejs.org/examples/#webgl_animation_keyframes), converted 2026-10-10

## Deviations

- **Environment:** a `SkyMesh`, the node version of the source's `Sky`, with a second one in a scene of its own that lights the model as a PMREM environment, made in `onRendererInitialized` ([Map](../ExamplesConversion.plan.md#map)).
- **Camera:** a `TrainCamera` riding the train is a scene camera to look through; the source has none.

## History

- 2026-10-10: Converted from the earlier `ThreeApplet` version to a `Document` (`289e7bf9`).
- 2026-10-11: Checked against r186 and HEAD: compiles and renders on r186 without WebGPU validation errors (headless).
- 2026-10-11: Changed: ported to the r186 look: the sky and its PMREM environment, `ACESFilmicToneMapping`, `DRACO_GLTF_CONFIG`, replacing a `RoomEnvironment` and the flat `0xbfe3dd` background.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011); the `TrainCamera` stays content. Checked: the Scene Camera view against `examples/screenshots`.
