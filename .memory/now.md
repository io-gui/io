# Current Focus

Three.js UI configs refreshed:
- Plan current; narrow-class invariant documented.
- Completed-module gaps added; config paths mirror three.js.
- `ThreeEditorConfigs` standalone demo + root **Three Configs** entry.
- Verified: three tests 202/202, typecheck, eslint, browser smoke.

three.js example conversion, batch 5 committed (14a4e1cd, 231 examples). Left TODO: document-pipeline 29, renderer-option 8, view-camera 3, dependency 5.

three example sidecars DONE 2026-10-21 (Claude Code), UNCOMMITTED: 231 sidecars `packages/three/src/demos/examples/<Name>Example.md`; plan git mv (staged rename only) -> `packages/three/src/demos/ExamplesConversion.plan.md` (78KB, index + rules); glossary `demos/CONTEXT.md`; tool `packages/three/scripts/examples.mjs` (check 0 errors). Repointed CLAUDE.md, root CONTEXT.md, upstream plan, working.md. Advise user: commit the staged rename alone first (keeps --follow history), then the rest. Migration plan kept (never committed). New todos: upstream-port (LoaderGltf Math.tan #34585), scene-camera-helpers, cull-follows-camera.

three views 2026-10-16 (Claude Code), committed: Document.bloom (Bloom) + View.bloom override (null=document) via BloomStage in RenderTargetPipeline; View.msaa (compositor setSamples; PostProcessingPipeline {msaa:false} for TRAA; present material cache key per samples); clippingHelpers overlay (outline, fill when selected); demo host View tab (focused viewport), Scene Camera follows doc bloom, others off. Tornado/Retroreflection declare source bloom; ClippingIntersection drops PlaneHelpers; Occlusion reverted to source. Tests 205/205, tsc, eslint, headless OK. Occlusion upstream kit https://claude.ai/artifact/R4gDW6w2E2bwT9LwE2A11K (user files; regression r183 #32546).

three.js shared-refresh follow-up: issue kits https://claude.ai/artifact/VcLnhjZSTRQ4jQPZH39eiz (user files). io links ../three.js dev (#34996 in).

three compressed textures: #35081-#35083 merged (r187). #35084 (loadAsync -> CompressedCubeTexture, load() warns @deprecated r187, no DataTexture) = ../three.js fixes/compressed-texture-loader-cube 9f3029f17f, pushed (commit message still says "data textures"); in review. LoaderTextureDds keeps its #35084 workaround until it lands.

three upstream fixes plan, 2026-10-18 (Claude Code): NEW `.cursor/plans/three_upstream_fixes.plan.md`: compressed PRs tracked + plans (cause w/ line refs, repro, fix, PR title, checks) for mesh-count, dynamic-usage (once per frame via info.frame; webgpu_instance_mesh relies on implicit dynamic upload -> can't drop clause), instanced-mesh-instance-count, minmax-blend-factors; triage: cube-envmap-loading, fragment-node-mrt. Conversion plan: `## Upstream workarounds` table (example, workaround, upstream id/PR, source code to restore), Audit rows tagged, todo remove-workarounds. Code: `Workaround (upstream: <id>)` comments at all 15 sites (grep). Not filed yet: the 4 planned fixes. tsc + eslint clean.

three framing, 2026-10-19 (Cursor), UNCOMMITTED: cameraFrame overlay always on (View.getFrameAspect(w,h,doc): source aspect or viewport -> overscan margin). ADR-0012 frame target (see working.md). 120 examples codemod (/tmp scripts), Instancing/GeometryText/LoaderTtf `framed` hacks removed, fog examples stand-ins. Tests 211, tsc, lint (only user's CameraExample.ts:31 trailing space). Browser :3000 OK (Readyplayer perspective tab opened after load frames models; PointsSprites inside cube). Follow-up: ~20 examples set target in onRendererInitialized only (works; could move to ctor).

