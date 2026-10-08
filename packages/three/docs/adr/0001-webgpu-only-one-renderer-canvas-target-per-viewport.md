---
status: accepted
---

# WebGPU only: one renderer, one CanvasTarget per viewport

`@io-gui/three` targets WebGPU only. There is one shared `WebGPURenderer` per GPU device, owned by the `RenderScheduler` (ADR-0003). Each `IoThreeViewport` owns its own `CanvasTarget`, and the scheduler binds it with `renderer.setCanvasTarget()` before drawing that view. This is the WebGPU model: one device and many configured canvas contexts, so any number of viewports can sit anywhere in the DOM.

We dropped the WebGL fallback. It has a single canvas, so multiple viewports would need a different presentation strategy: scissoring a page-sized canvas, or copying each frame into 2D canvases. Supporting both paths would split every pipeline and overlay decision in two.

## Considered Options

- **Keep the WebGL fallback with a scissored, page-sized canvas** (three.js "multiple elements" approach). Rejected: z-order and clipping break under overlays, floating panels and scrolled containers, and every pipeline would need two code paths.
- **One renderer per viewport.** Rejected: GPU resources (geometry buffers, textures, compiled pipelines) would be duplicated per viewport, because WebGPU resources belong to one device.

## Consequences

- Browsers without WebGPU get an explicit error, not a degraded viewport.
- Renderer-level options (`logarithmicDepthBuffer`, `reversedDepthBuffer`, MSAA samples) are fixed at construction, so a viewport may still be given its own `renderer`. The scheduler initializes and drives every renderer it sees. Such viewports do not share GPU resources with the default renderer, and an applet's `onRendererInitialized` setup (PMREM, compute) runs against whichever renderer draws it first.
- `attachSurface()`'s WebGL branch and `isWebGPUBackend()` checks go away.
- Many small previews (material balls, thumbnails) should not each get a `CanvasTarget`. They render into a shared offscreen target and are cached as images.
