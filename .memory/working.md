# Working Memory - Io-Gui Development

> Persistent curated memory, caveman. Don't repeat io-gui.mdc, ADRs, CONTEXT.md or plans; point to them.

## Open Design Questions

- **core construction order:** reactions (ready, *Changed, mutated, io-mutation) run inside base ctor, before subclass fields/ctor body -> non-`declare` fields written by handlers silently wiped, guards in handlers (ThreeViewport), @Field workarounds. Plan + draft ADR (core 0005): `.cursor/plans/core_construction_order.plan.md` (@Register wrapper, `new.target` finish, queue while constructing). Not scheduled.
- **Timeline delta < 0** on wrap/scrub back: accepted for now. Fix = pass cause {playback, seek} to onAnimate (three_future_work `timeline-negative-delta`).
- **Menu root identity:** Menu defaults `id: 'root'`; child Option `id: ''` (filter "all", `value: ''` for string-input sync) can still collide w/ empty-id Option. Valid use case. Fix: distinct internal root id, or exclude root from duplicate-id check.

## Code Patterns That Worked

- **Io events:** source `this.dispatch('name', detail, true)` (bubbles); consumers `static get Listeners(): ListenerDefinitions` map event -> handler name. No addEventListener in `ready()`, no add/remove when deps change.
- **Panel owns floating UI via `src`** (IoColorPanelSingleton, IoNumberLadderSingleton): child derives expanded state from panel; collapse/disconnect clears `src` sync. No cross-element listeners.
- **Child node instead of parent props** for clean change typing: `@Property({type: Child, init: null})` + `childMutated()`; child prop changes skip parent `mutated()`. E.g. Document.timeline (time no longer emits 'settings').

## Code Patterns That Failed

- **NodeArray refill** via push inside `withInternalOperation`, or `length = 0` + push -> duplicate mutation listeners on kept items. Use `splice(0, length, ...items)` (= `applyNodeArrayAssignment`).
- **three `Float32BufferAttribute(array)` copies array** -> write later via `attribute.array`. `BufferAttribute`/`InstancedBufferAttribute` don't copy.

## Repo & Tooling

- **Build:** exports/types/main -> `dist/`; `sideEffects` narrowed (elements/nodes/configs, three +icons). TS `composite` + root `tsc -b` + project refs (no cross-pkg `paths`). Clean must delete `tsconfig.tsbuildinfo` or incremental skips emit. Vite aliases -> `src/` for dev/tests.
- **Skills:** package `files[]` ships `/CONTEXT.md` + `/skills/`; root `skills/` symlinks serve `npx skills add io-gui/io` (agentskills.io format; consumers can also discover in node_modules).
- **Demo apps:** root `index.html` embeds via `iframe({id, src})` + nav entry; app page uses its custom element directly (`<todo-app>`).
- Vitest browser hang ("no tests", ~10 min) = stale Chrome for Testing procs -> kill; `npx vitest run --project unit <path> --browser.headless`.
- Vitest doesn't typecheck -> `pnpm build` after typed test changes.
- Vite 8 Rolldown strips legal comments before terser -> `rollupOptions.output.comments: { legal: true }` + entry banner keeps licenses.

## Package Notes

### io-core

- **Binding sync** = graph write + BindingWave: `pushBindingValue` settles outbound closure; `ChangeQueue.dispatch` holds one wave across property pass -> parallel networks batch-settle before spoke flush. Wave closes before source `mutated()`. Suites: Binding.test.ts, Binding.network.test.ts.
- **Handlers run in base ctor** (applyProperties -> ready -> dispatchQueue) before subclass field initializers. State they touch: `@Field` or `declare private x` + lazy getter. Actions passed in first render: `on*` methods (auto-bound), not arrow fields.
- **VDOM:** reconciles by position + tag only (`key` stored as `_vdomKey`, unused, TODO) -> mid-list insert re-props later siblings. Non-reactive props assigned directly (`@Field` takes props). Object-valued `@Property` starts mutation observer (plain object -> window listener) -> keep per-row object refs in Fields. `children` always `Array<VDOMChild> | undefined`; strings normalized at factory only; `text()` -> `#text`; reconcile on `childNodes`.
- Tests: generic `vConstructor` doesn't type subclass props -> `type XProps = ReactiveElementProps & {...}; const x = (props: XProps) => X.vConstructor(props)`.
- ProtoChain init: no runtime imports ReactiveObject -> Property (TDZ/circular).
- `IoSyntheticEvent.path` mutated during bubble -> copy if kept.
- **IoGl derived uniforms:** extra `uniform float` in Frag; `setShaderProgram()` + `setUniform()` before `super.onRender()`; 2D text via `this.ctx` after. Positions in JS (double), shade in device px (`gl_FragCoord`) when f32 drifts (long timelines).
- **Serialization** (principle: io-gui.mdc): `toJSON()` instance -> wire; `applyJSON(json)` wire -> EXISTING instance (Storage path, bindings kept); static `fromJSON` = factory only. Generic ReactiveObject pair walks reactive props: objects w/ toJSON/applyJSON delegate; primitives copied, applied batched via `setProperties`; plain objects + non-reactive props skipped (debug warns on object prop w/o applyJSON). `NodeArray.applyJSON` updates existing indices only (no grow/shrink) -> parent builds items (custom applyJSON/ctor: Split/Panel/Tab, TodoListModel; Option custom toJSON). Color wire = 32-bit ARGB hex (24-bit legacy -> opaque). Storage load: `applyJSON` on existing node, never `new Ctor(parsed)` (Theme/layout singletons rely on it); catch must not leave raw JSON string on model. toJSON must include strings/booleans (TodoMVC crash).

### io-layout

- **Hoist `_parents` cleanup:** core runs `detachNodeParents` on NodeArray removal + `disconnectPropertyValue`; spread-hoist still needs explicit `detachNodeParents(soleChild)` in `consolidateChildAt`. Never empty NodeArray during hoist while IoSplit bound -> crashes `calculateCollapsedDrawers`.

### io-menus

- **Empty-id selection:** `getSelectedIDImmediate`, `optionsMutated` must not treat `''` as falsy. `updatePaths` sets `selectedID` directly (path `''` can't round-trip via `pathChanged`). `findOptionById`/`findOptionByValue` search descendants before self -> empty-id child beats empty-id root.

### io-icons (rest: io-icons.mdc)

- IoBoolean label -> icon iff registered (any ns), else text. `io:slider` (single) vs `io:sliders` (tune).

### io-three

- Design doc (Claude Docs): https://claude.ai/code/artifact/cb23d4fe-d4ad-406c-9d62-919db30887dd (WebGL fallback mention superseded by ADR-0001).
- **Arch = ADR 0001-0009** + io-gui.mdc Document/Editor/View. Future work (undo/commands/collab per ADR-0008, BVH picker, blobs, scene helpers): `three_future_work.plan.md`, start only when asked. No back-compat since 2026-10-07 (ThreeApplet, ToolBase, viewport applet/tool props gone; external GlobeTool must port to ToolDefinition).
- **Timeline:** `Editor.tick` -> `timeline.advance(frame.delta)`. `frameRate` = stepping/snap/dividers only, no playback effect (user: fps matters only for video export, revisit then). UI: ThreeTimeline + ThreeTimelineRange (IoGl).
- RenderScheduler rAF must run after core FrameScheduler rAF in same frame (import order).
- ThreeViewport default renderer: `getDefaultRenderer()` merged into ctor args before `super()` (`@Property({value})` default snapshots at class def). Custom `renderer` prop wins.
- Import maps (index.html, dev.html) need bare `"three"` (addons import `'three'`); Vite aliases `^three$` -> `three/webgpu`.
- **Render path:** pipeline -> own half-float RT (linear) -> ViewCompositor presents RT + overlays in ONE `renderer.render(overlayScene)` to canvas; present quad writes pipeline depth via `material.depthNode`. Tone mapping at present only (view ?? pipeline ?? document). PostProcessing pipeline: `outputColorTransform = false`. Shared frameBufferTarget tone-maps per canvas render call -> one call per canvas.
- Overlay hook = `prepare` (GizmoLayer = Behavior + Overlay; `update` clashes). Router `startModal` marks presses non-click.
- **IdPass (components):** RGBA32F RT (slot, prim+1, view depth); readback rows padded to 256 B (stride = ceil(w*16/256)*256/4 floats), row 0 = top. Points/edges CPU-projected + 3x3 depth test. Overlay wires/points depth bias: `material.depthNode` = viewZToPerspectiveDepth(viewZ*(1-eps)) (positionView in fragment). WebGPU points = 1px -> `Sprite` + PointsNodeMaterial(positionNode = instancedBufferAttribute) w/ `sprite.count`. Disposing geometry frees GPU buffers of ALL its attributes -> never share attribute w/ geometry you dispose (clone).
- **Change listeners:** non-view UI following a document (ThreeScenegraph) = `renderScheduler.addListener({document, onDocumentChanges})`; scheduler drains listener docs too. Never drain docs elsewhere. Async adds outside transactions must `notify({kind: 'structure'})` or tree misses them.
- **ThreeScenegraph:** flat IoField rows (positional VDOM), expanded by default, `disclosure` = collapsed uuids (host binds Storage), cap 1000. Reveal on active change; rename via `object.rename` operator. Not io-menus (menus select ancestors; branch rows toggle). Object icons: prototype-chain registry `icons/objectIcons.ts`.
- CSS grid: `minmax(max-content, auto)` = widest row, >= container (scrolls); `minmax(100%, max-content)` never exceeds container. IoField captures pointer on press -> click target = row; pick sub-target on pointerdown. Ending edit that removes an IoString: `stopImmediatePropagation` in own prop listeners (run before IoString's focus ones).
- Inspector: `selection.active` = uuid; property editors want object (`selection.activeObject`). IoLayout keeps first-rendered elements (selector cache ignores later `value` props) -> bind reactive host property. Add-tab menu: `element.group` nests entries under one option.
- **Framing AABB:** always `Box3.setFromObject(obj, true)` (default unions morph-target extremes via `computeBoundingBox()` -> absolute morphs inflate to origin). Both cams `lookAt(center)`, near/far from AABB corner depths, `orbitControls.update()`.
- **Examples:** rules/audit/candidates/blockers in `three.js_example_conversion.plan.md`. `src_examples` -> ../three.js/examples (dev, ahead of release) -> convert from r186 (`git -C ../three.js show 148ef33ecb:examples/X.html`; no r183+ tags locally). Easy misses: renderer.toneMapping -> `super({toneMapping})`; wall-clock timers; whole-scene framing dominated by sky/floor. Authored helpers temporary until scene-helpers overlay.
- **Headless WebGPU:** playwright + `--enable-unsafe-webgpu --enable-features=Vulkan,WebGPU --use-angle=metal` = real GPU (Metal), `locator.screenshot()` captures WebGPU canvases; no flags -> SwiftShader/device lost (plan Workflow's "screenshots blank" predates flags). Rest in plan Workflow: page's own three, page's SHARED renderer -> HalfFloat RT + `renderOutput` quad -> rgba8 -> PNG vs `../three.js/examples/screenshots/*.jpg`; never 2nd WebGPURenderer (shared ShadowNode/CubeMapNode caches); pause + set time; clone doc camera (hidden Scene Camera tab stale).
- **three WebGPU (r185):** don't share one StorageBufferAttribute as atomic (compute) + readonly (fragment) -> writes invisible. MeshBasicNodeMaterial MultiplyBlending may draw opaque -> opacityNode + NormalBlending for DataTexture overlays.
- **After three upgrade:** restart `pnpm dev` (Vite checks lockfile only at startup; stale pre-bundle). Isolated check: scratch .mjs config importing repo vite.config.ts + mergeConfig({cacheDir, server.port}) w/ `--configLoader native`.

#### Multi-view (one WebGPURenderer, CanvasTarget per view) + upstream

- **2026-10-13:** #34968 + #34977 MERGED (dev 65c4864bb3). Feature request #34982 "Multi-canvas rendering needs deeper test coverage" posted.
- **Status 2026-10-12** (upstream login arodic): #34968 NodeMaterialObserver FULL refresh on output-target switch — open, Mugen87 review applied + pushed (../three.js fixes/NodeMaterialObserver), kit https://claude.ai/artifact/WDqXKTCqExWoXkikztxV8J. #34977 ReflectorNode `bounces:false` per camera — open (fixes/ReflectorNode), kit https://claude.ai/artifact/AJFRcPLzo32zi1Ttgtip8t. examples/multiple-canvas (committed 7ce1d4999f): official e2e dev 6.6% fail, all fixes 0%; merge after #34968, #34977 + camera fix. io `three: link:../../../three.js` serves whatever ../three.js has checked out (dev = neither fix) -> drop `link:` once a release has both. Discussion issue (case for multi-view E2E coverage, no fixes) drafted 2026-10-13, not posted: kit https://claude.ai/artifact/TWT98UonwKD289ptWA7b3j. three.js has no GH Discussions -> Feature request form (blank issues off). gh CLI token stale (401) -> post via web.
- **Shared render objects:** same-format targets share render objects -> per-view resources need FULL refresh on target switch (#34968). Materials w/ any `*Node` prop always FULL (`hasNode`). Bleed only between consecutive SAME-size targets (size change -> FULL, #34612).
- **Reflector:** default `bounces:true` = RENDER update -> per view OK. `bounces:false` = FRAME -> only first view per frame updates, others show its reflection (webgpu_reflection_roughness/blurred). Fix #34977: ReflectorBaseNode `updateReference(state)` -> `getVirtualCamera(state.camera)` (key per reflector+camera; no guard: NodeManager sets builder.camera). Per-camera RTs kept until dispose.
- **Camera type baked at build** (ViewportDepthNode setup, positionViewDirection, NodeMaterial log depth, Points/Sprite sizeAttenuation); no camera in render object / RenderContexts / nodeBuilderCache keys -> persp + ortho views share first camera's shader (ortho depth effects wrong). Fix 2026-10-13 branch ../three.js fixes/camera-type (UNCOMMITTED, user commits via kit): TSL `cameraIsPerspective` = `cameraProjectionMatrix.element( 2 ).element( 3 ).equal( - 1.0 )` (= WebGL isPerspectiveMatrix, Line2NodeMaterial precedent) + select() in all 5 places. Cache-key alternative rejected: shared render objects -> dispose/recreate per camera-type switch. Verified: shared views pixel-exact vs single-camera refs; single-camera byte-identical to dev; multiple_canvas draft e2e dev 2.3% fail -> fix pass. Draft PR #34985. PR kit https://claude.ai/artifact/GnGpvH6JSL4buM7fxpnpbC; points/sprites fiddle kit (follow-up comment) https://claude.ai/artifact/Kih8AaBeM9ciQPoFPCKBzS. Size semantics differ by camera type by design (points sizeAttenuation: persp world / ortho px; sprites !sizeAttenuation: persp screen / ortho world) -> demo needs separate scene scales per row.
- **Regression check** = three examples/webgpu_multiple_canvas (shared scene, sizes + ortho, reflector, transmission, viewportLinearDepth foam). e2e renders ONE frame (deterministic RAF), 800x500, CI `npm run build` + lavapipe. Local official e2e: `git archive` subset (package.json utils test/e2e examples/main.css examples/jsm) + src variant + node_modules symlink + `npx rollup -c utils/build/rollup.config.js` + `node test/e2e/puppeteer.js [--make] <name>` (puppeteer chrome, real GPU). Headless src variants: playwright route `/build/three.webgpu.js` -> src/Three.WebGPU.js, `/build/three.tsl.js` -> src/Three.TSL.js, other `/build/*` -> src/*.
- **History:** #32642 depth bleed (fixed #32664) / #32689 sizes (user #32690) / #32690 regression, all canvases same output (user #33209/#33210 -> sunag #33228) / #34612 resize FULL / #34636 FramebufferTexture own source (#34635) / #34826 canvas MSAA buffer cache.
