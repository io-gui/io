# Current Focus

Three.js UI configs refreshed:
- Plan current; narrow-class invariant documented.
- Completed-module gaps added; config paths mirror three.js.
- `ThreeEditorConfigs` standalone demo + root **Three Configs** entry.
- Verified: three tests 202/202, typecheck, eslint, browser smoke.

three.js example conversion, 2026-10-15 (Claude Code; Cursor on configs in same checkout, no worktrees):
- DONE, uncommitted: batch 1 (30 webgpu_*) + batch 2 (30: reflectors, Refraction, Lensflares, Occlusion, MeshBatch, GaussianSplat, ParticlesSoft, Water, Tornado, Retroreflection, Skinning{Instancing,Points}, InstanceSprites, Sandbox, ModifierCurve, LinesFat x2, KTX2 x3, ShadowmapArray, 6 webgl_*). Files untracked in src/demos/examples + DOCUMENTS (IoEditorExample.ts) + plan (Audit 2026-10-15 batch 2, rules). Verified headless GPU own vite :3017 (stopped): renders vs screenshots, controls, 30 in one page, 0 errors. tsc noEmit + eslint clean.
- Next candidates: 41 unblocked TODO rows left, mostly webgl_*/misc_* (geometry text/shapes/nurbs/terrain, buffergeometry points, instancing, modifiers, loaders md2/bvh/ldraw/pdb/ttf/3dm, Lod, Helpers, Watch, LightsHemisphere/Spotlights).

three views 2026-10-16 (Claude Code), uncommitted: Document.bloom (Bloom) + View.bloom override (null=document) via BloomStage in RenderTargetPipeline; View.msaa (compositor setSamples; PostProcessingPipeline {msaa:false} for TRAA; present material cache key per samples); clippingHelpers overlay (outline, fill when selected); demo host View tab (focused viewport), Scene Camera follows doc bloom, others off. Tornado/Retroreflection declare source bloom; ClippingIntersection drops PlaneHelpers; Occlusion reverted to source. Tests 205/205, tsc, eslint, headless OK. Occlusion upstream kit https://claude.ai/artifact/R4gDW6w2E2bwT9LwE2A11K (user files; regression r183 #32546).

three.js shared-refresh follow-up: issue kits https://claude.ai/artifact/VcLnhjZSTRQ4jQPZH39eiz (user files). io links ../three.js dev (#34996 in).
