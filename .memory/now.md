# Current Focus

Three.js UI configs refreshed:
- Plan current; narrow-class invariant documented.
- Completed-module gaps added; config paths mirror three.js.
- `ThreeEditorConfigs` standalone demo + root **Three Configs** entry.
- Verified: three tests 202/202, typecheck, eslint, browser smoke.

three.js example conversion, 2026-10-17 (Claude Code; no worktrees, Cursor on configs in same checkout):
- Batches 1+2 committed (29d1bda0). Batch 3 DONE, uncommitted: 39 webgl_*/misc_* rows (all remaining unblocked) -> 39 untracked files in src/demos/examples + DOCUMENTS (195 docs) + plan (Audit batch 3, WebGPU notes, todos batch-2026-10-17 / upstream-batch3 / occlusion-recheck). ModifierSubdivision + LoaderGltfAnimationPointer -> `dependency`. 0 unblocked TODO rows left.
- Verified headless :3017 (stopped): renders vs screenshots, controls3.mjs, 39 in one page 0 errors; tsc, eslint, tests 205/205.
- Next = features. Upstream #35066 (occlusion per camera) merged in dev -> recheck Occlusion.

three views 2026-10-16 (Claude Code), committed: Document.bloom (Bloom) + View.bloom override (null=document) via BloomStage in RenderTargetPipeline; View.msaa (compositor setSamples; PostProcessingPipeline {msaa:false} for TRAA; present material cache key per samples); clippingHelpers overlay (outline, fill when selected); demo host View tab (focused viewport), Scene Camera follows doc bloom, others off. Tornado/Retroreflection declare source bloom; ClippingIntersection drops PlaneHelpers; Occlusion reverted to source. Tests 205/205, tsc, eslint, headless OK. Occlusion upstream kit https://claude.ai/artifact/R4gDW6w2E2bwT9LwE2A11K (user files; regression r183 #32546).

three.js shared-refresh follow-up: issue kits https://claude.ai/artifact/VcLnhjZSTRQ4jQPZH39eiz (user files). io links ../three.js dev (#34996 in).

three compressed textures investigation, 2026-10-18 (Claude Code): DONE, findings + diffs in session scratch dds/ (A regression r180, B CompressedCubeTexture, C uncompressed, D DDS loader cubes; see working.md). Open: user to choose issue kit(s) / ../three.js branch / fix LoaderTextureDdsExample cube comment (says 1x1 sizing; real first failure = needsMipmaps crash, loader cubes are 2D).
