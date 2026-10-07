---
status: accepted
---

# The content scene holds only content; views draw through pipelines and overlays

`ThreeDocument.scene` holds only authored objects. Anything a view adds lives outside it: view cameras, grids, axes, light and camera icons, selection outlines, component points and edges, gizmos and marquees. Each view draws through a `ViewPipeline` chosen by shading mode and view kind (`solid`, `material`, a deferred or post-processed pipeline, `uv`), and then through `Overlay` providers that draw from small per-view overlay scenes.

This keeps export, `frameObject` bounds, object picking and other views clean. The obvious path of adding helpers to the scene leaks them into all of those.

Pipelines are created per view because render targets and post-processing graphs are sized per view. Shader and pipeline caches stay shared in the one renderer. Tone mapping, exposure and background are pipeline inputs taken from document settings, with optional per-view overrides. This replaces saving and restoring `renderer.toneMapping` around each draw.

## Consequences

- Per-view visibility (isolate, hide helpers) uses `Layers` on the view's draw camera and never touches content objects.
- Solid, wireframe and matcap shading are pipeline concerns. Content materials are never swapped.
- The `uv` pipeline does not render the content scene at all. It draws UV-space meshes built from the edit set's `uv` attribute.
- Overlays that depth-test against content need the pipeline to expose its depth texture.
