---
name: three.js Example Conversion
overview: Port three.js examples to Document subclasses in packages/three/src/demos/examples, opened by demos/IoEditorExample.ts (index.html Demos > Three). Conversion rules, an audit of the converted examples against their sources, the candidate list for the rest of src_examples with its blockers, and open follow-ups.
todos:
  - id: audit-2026-10-11
    content: "Audit all converted examples against src_examples; fix deviations (tone mapping, helpers, wall-clock crossfade, DOM reads, upstream syncs)"
    status: completed
  - id: r186-update
    content: "Re-audit against r186 (three 0.186.1): r186 typings, CameraArray shadow bias, PostProcessing -> RenderPipeline"
    status: completed
  - id: keyframes-sky
    content: "AnimationKeyframes: port to the r186 look (SkyMesh sky that also lights the model as a PMREM environment, ACESFilmic, DRACO_GLTF_CONFIG)"
    status: completed
  - id: interactive-timeline
    content: "Timeline policy for interaction-driven examples: live documents use the timeline as a clock and ignore time going back (ADR-0009)"
    status: completed
  - id: skinning-transport
    content: "AnimationSkinningBlending: dropped paused / makeSingleStep / stepSize in favor of the timeline transport"
    status: completed
  - id: crossfade-state
    content: "Skinning blending examples: show which crossfade or base action applies (upstream disables or dims buttons)"
    status: pending
  - id: inspector-refresh
    content: "Replace debug-only dispatchMutation in onAnimate (inspector stops following in bundled builds)"
    status: pending
  - id: camera-helper-view
    content: "CameraExample: the helper of the camera a view looks through draws in that view. Resolved by the helper overlays (three_future_work.plan.md scene-helpers, 2026-10-13)"
    status: completed
  - id: framing-scenery
    content: "Whole-scene framing (first show, frame all) includes skies and large floors; examples frame their model instead. Skip unselectable scenery in the framework?"
    status: pending
  - id: candidates-2026-10-11
    content: "Sort all src_examples into candidates (Candidates table: status + blockers) and non-candidates"
    status: completed
  - id: blocker-document-pipeline
    content: "Unblock: a document brings its own post-processing graph and scene inputs (MRT). See Blockers"
    status: pending
  - id: blocker-per-frame-gpu
    content: "Unblock: once-per-frame renderer hook for compute / CubeCamera / render targets; scrub and wrap policy for GPU simulations"
    status: pending
  - id: blocker-renderer-on-change
    content: "Unblock: queue GPU work from a property handler (rebake probes, regenerate sky environment)"
    status: pending
  - id: blocker-view-camera
    content: "Unblock: content bound to the drawing camera (CSM, pass() in a material, camera layers)"
    status: pending
  - id: blocker-renderer-option
    content: "Unblock: stencil on the shared renderer; renderer.lighting, VSM, shadowMap.transmitted per document?"
    status: pending
  - id: blocker-transmission-views
    content: "Unblock: transmission materials log 'Destroyed texture ... used in a submit' while several views redraw (framebuffer copy per view target). See Blockers"
    status: pending
  - id: framing-motion
    content: "First-show framing uses the bounds at rest; content that moves beyond them (AnimationKeys) leaves the frame"
    status: pending
  - id: low-hanging-2026-10-11
    content: "Convert the unblocked candidates that need nothing from the editor (Candidates table, Audit rows)"
    status: in_progress
  - id: batch-2026-10-13
    content: "Convert 25 more unblocked candidates: morphs, materials, procedural/TSL, nine loaders, FogHeight, InstanceMesh, InstancePath, TslRagingSea (Audit: Converted 2026-10-13)"
    status: completed
  - id: dolly-far
    content: "Zooming in pulled the perspective far plane in with the distance (ViewNavigation.dolly scaled far), cutting off skies beyond the framed box. Far now moves with the eye. Fixed 2026-10-13"
    status: completed
  - id: shared-uniforms
    content: "Per-object uniforms in scene nodes (fogNode, environmentNode) stay stale in forward views (three #34162 SHARED refresh). Timeline.timeNode moved to renderGroup. Upstream fix three.js #34996 merged 2026-10-14 (in the dev build `ca10fb69aa`; io links `../three.js`); recheck FogHeight in forward views (see Blockers: shared-refresh)"
    status: completed
  - id: batch-webgl-2026-10-14
    content: "Convert 30 webgl_* loader and material candidates: Collada x2, FBX x2, 3MF x2, PCD, XYZ, VRML, GCode, SVG, glTF AVIF / instancing / variants, MDD, five texture loaders, ten materials (Audit: Converted 2026-10-14). Worktree branch examples-webgl"
    status: completed
  - id: batch-webgpu-2026-10-15
    content: "Convert 30 webgpu_* candidates: nine lights / shadows / probes, eleven materials and textures, six TSL and particles, Clipping, GeometryLoft, LoaderGltf, LoaderGltfSheen (Audit: Converted 2026-10-15). Sun controls that re-bake the environment tagged renderer-on-change"
    status: completed
  - id: views-bloom-msaa-2026-10-16
    content: "Bloom as Document.bloom with a View.bloom override (Tornado, Retroreflection get their source bloom), View.msaa (alphaToCoverage works in MSAA views), clippingHelpers overlay (ClippingIntersection drops its PlaneHelpers). three_future_work.plan.md: document-bloom, view-msaa, clipping-helpers"
    status: completed
  - id: occlusion-upstream
    content: "File the occlusion issue: isOccluded() returns another camera's result since r183 (#32546 keys render contexts without camera). Kit https://claude.ai/artifact/R4gDW6w2E2bwT9LwE2A11K. Occlusion reverted to the source's behavior meanwhile"
    status: pending
  - id: batch-2026-10-15-b
    content: "Convert 30 more: the verify-per-view rows (Mirror, Reflection x3, Refraction, Lensflares, Occlusion, MeshBatch, GaussianSplat, ParticlesSoft), the dropped-post rows (Water, TslVfxTornado, MaterialsRetroreflection, SkinningInstancing), KTX2 x3, LinesFat x2, SkinningPoints, InstanceSprites, Sandbox, ModifierCurve, ShadowmapArray and six webgl_* rows (Audit: Converted 2026-10-15, batch 2)"
    status: completed
isProject: false
---

# three.js Example Conversion

Each converted example is a `Document` subclass in `packages/three/src/demos/examples/<Name>Example.ts`: scene built in the constructor, animation in `onAnimate`, GPU setup in `onRendererInitialized`, GUI as reactive properties with registered editor groups. `src/demos/IoEditorExample.ts` loads it by dynamic import into one shared editor (views, scene graph, inspector, timeline). Background: `io-gui.mdc` (io-three: Document, Editor, View), [ADR-0002](../../packages/three/docs/adr/0002-app-view-frame-layers.md), the three SKILL.

The earlier `ThreeApplet` + `IoThreeExample` element pattern was replaced on 2026-10-10 (commit `289e7bf9`); the old version of this plan is in git history before `0e72af13`.

## Sources

- `packages/three/src_examples` is a tracked symlink to `../../../three.js/examples`, a local three.js **dev checkout** that runs ahead of the release (2026-10-11: 275 commits past r186). The package builds against the installed `three` **0.186.1** / `@types/three` **0.186.0**.
- Convert from the r186 version. The checkout has no r183–r186 tags; the r186 release commit is `148ef33ecb` (`git -C ../three.js fetch --tags` would add `r186`):
  - `git -C ../three.js show 148ef33ecb:examples/<file>.html` (r186 version)
  - `git -C ../three.js log --oneline 148ef33ecb..HEAD -- examples/<file>.html` (later changes)
- Port changes made after r186 only when 0.186 has the APIs. Upstream also reverts: the skinning sources used `SunLight` at r186 and went back to `DirectionalLight` after it, as ours do.
- After upgrading `three`, restart `pnpm dev`. Vite checks the lockfile only at startup and serves the old pre-bundled three until then.
- `webgl_*` and `misc_*` sources convert too: classic materials run on `WebGPURenderer` through the node library. See the WebGPU notes below for the cases that do not.

### What fits

A source fits when it has one scene that any view can show. These do not fit:

- Renderer-level options (`logarithmicDepthBuffer`, `reversedDepthBuffer`, MSAA samples) are fixed per renderer ([ADR-0001](../../packages/three/docs/adr/0001-webgpu-only-one-renderer-canvas-target-per-viewport.md)). `CameraLogarithmicDepthBufferExample`, which compares renderers with and without `logarithmicDepthBuffer`, was removed (`bcadcea1`).
- A custom render loop (scissor split screens, several passes per frame, `renderer.setRenderTarget` chains) belongs in a pipeline (ADR-0006), not in a document.
- Runtime multi-view rendering (`ArrayCamera` grids, as in WebXR stereo or quilt displays) has no authoring workflow, and a view looking through a scene camera draws one camera ([ADR-0005](../../packages/three/docs/adr/0005-navigation-is-view-state-camera-built-per-draw.md)). `CameraArrayExample` was removed (2026-10-13). A view-owned `ArrayCamera` that scaled the grid onto the camera frame was built and reverted: it added a second camera (`contentCamera`) to the pipeline context that every pipeline and overlay had to choose between, for one example. The two cameras are the same object in every other document, so wrong choices would go unnoticed, and three's TRAA and velocity use only the main camera, so the cells smeared in TRAA views. Revisit only if a real document needs an ArrayCamera preview; a contained version would lay out the cells inside the forward pipeline.
- Pointer or keyboard interaction (raycast drags, key handlers) belongs to tools and operators. A document only gets property controls.

## Target shape

```ts
import { Mesh, NeutralToneMapping, WebGPURenderer } from 'three/webgpu'
import { uniform } from 'three/tsl'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

/** Seconds in which the animation repeats: the timeline length, so looping is seamless. */
const PERIOD = 20

/** What the scene shows, where its controls are. Plays when opened. */
@Register
export class XxxExample extends Document {
  private amountUniform = uniform(0.5)
  public mesh: Mesh

  @Property({type: Number, value: 0.5})
  declare amount: number

  constructor(args?: DocumentProps) {
    super({toneMapping: NeutralToneMapping, timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})
    // scene content: named objects added to this.scene
  }

  amountChanged() {
    this.amountUniform.value = this.amount
  }

  override onRendererInitialized(renderer: WebGPURenderer) {
    super.onRendererInitialized(renderer)
    // compute passes, PMREM environments
  }

  override onAnimate(delta: number, time: number) {
    this.mesh.rotation.y = time / PERIOD * Math.PI * 2
  }
}

registerEditorConfig(XxxExample, [
  ['amount', ioNumberSlider({min: 0, max: 1, step: 0.01})],
])

registerEditorGroups(XxxExample, {
  Main: ['amount'],
})
```

Register it in `DOCUMENTS` in `IoEditorExample.ts`:

```ts
XxxExample: () => import('./examples/XxxExample.js').then(module => new module.XxxExample()),
```

Naming: drop the `webgl_` / `webgpu_` / `misc_` prefix and PascalCase the rest (`webgpu_backdrop_area.html` -> `BackdropAreaExample.ts`, class `BackdropAreaExample`).

## Conversion rules

### Drop (the host provides it)

- HTML, CSS, info text, WebGPU availability checks, `Stats`.
- Renderer creation and setup: `antialias`, pixel ratio, size, `setAnimationLoop`, `await renderer.init()`, `renderer.shadowMap.enabled` (the shared renderer has shadows on, `RenderScheduler.ts`).
- Resize handlers and anything that reads `window` or the DOM (a document opens in any editor). Views own camera aspect.
- `OrbitControls` and other camera controls: views navigate and frame the scene.
- The source's main camera. Keep it as a **named scene camera** only when its framing is part of the example; camera views can look through it.
- `Timer` / `Clock`: the timeline is the clock.
- `AxesHelper` / grids: the grid overlay.

### Map

| Source | Document |
|---|---|
| `renderer.toneMapping`, `renderer.toneMappingExposure` | `super({toneMapping, toneMappingExposure})`. Easy to miss: views present with the document's tone mapping, and exposure does nothing under `NoToneMapping`. |
| `scene.background`, `backgroundNode`, `fog`, `environment` | the same on `this.scene` |
| `init()` | constructor body after `super()` |
| module globals | public fields (internal state) or `@Property` (user-facing controls) |
| `renderer.compute(...)`, `new PMREMGenerator(renderer)` | `onRendererInitialized(renderer)`: runs once per renderer before its first draw of the document |
| `animate()` with `Date.now()` or elapsed time | `onAnimate(delta, time)` deriving state from `time` |
| `mixer.update(timer.getDelta())` | `mixer.update(delta)` in `onAnimate` |
| TSL `time`, `oscSine()` (implicit `time`) | `this.timeline.timeNode`, for example `oscSine(this.timeline.timeNode)` |
| `uniform()` read by a scene node (`fogNode`, `environmentNode`) | `uniform().setGroup(renderGroup)`. A per-object uniform reaches the GPU only on a full refresh of its object; objects whose materials have no node properties get shared refreshes only, so the change never shows in forward views (TRAA views refresh fully for velocity). `timeline.timeNode` is shared already (see `shared-refresh` under Blockers) |
| Light attached to the camera (`camera.add(light)`) | a light placed in the scene |
| Relative asset path `models/gltf/X.glb` | `https://threejs.org/examples/models/gltf/X.glb` |
| `dracoLoader.setDecoderPath(DRACO_GLTF_CONFIG)` | the same: the decoder resolves next to three's `DRACOLoader.js` (Vite rewrites the URL when pre-bundling; the bundle keeps three external) |
| `Sky` + `pmremGenerator.fromScene(sky)` | an unselectable `SkyMesh` in the scene, plus a second one in a `Scene` of its own for `fromScene` in `onRendererInitialized` (AnimationKeyframes). `SkyMesh` drifts its clouds on TSL's global `time`, so set `cloudSpeed` to 0 unless they should move. A 10000-unit sky dominates whole-scene bounds: frame the model with `frame-object` |
| Several viewports or scissor halves | scene cameras, seen through camera view tabs |
| `ColorManagement.workingColorSpace = SRGBColorSpace` (global) | convert the content's colors to the working space instead: `material.colorNode = colorSpaceToWorking( colorNode, SRGBColorSpace )` (GaussianSplat) |
| `scenePass.add( bloom( scenePass, strength, radius, threshold ) )` (bloom of the scene color) | `super({bloom: new Bloom({enabled: true, strength, radius, threshold})})`: the document's bloom, drawn by views that follow it (`View.bloom`; in the demo host the Scene Camera view). Bloom of an emissive MRT output has no equivalent yet (`bloom-emissive`, Water) |
| `KTX2Loader.detectSupport( renderer )` | in `onRendererInitialized`, loading from there; `dispose()` the loader once loaded (three warns about several active KTX2 loaders) |
| Keyboard switches (`O` / `P` keys) | properties |

GUI (`lil-gui`, `Inspector.createParameters`) becomes properties and groups:

| GUI control | Document |
|---|---|
| slider or checkbox on a uniform | `@Property` + `xChanged()` writing `uniform.value` |
| slider on an object field (`gui.add(box.scale, 'x')`) | expose the object as a public field with a config (`boxScale` + `threeVector3`) |
| dropdown | `String` `@Property` + `ioOptionSelect(new Menu({options}))` config + `xChanged()` |
| button | arrow-function field (`run = () => {...}`), shown as a button (`ioButton` config for a label) |
| visibility checkbox (`show model`, `show helpers`) | `Boolean` `@Property` setting `.visible` |
| `.listen()` display of values that change per frame | expose the object; see the `inspector-refresh` todo |

### Time

- Time drives animation (`io-gui.mdc`). Derive state from `time` with a period equal to (or dividing) `timeline.duration`, so loops are seamless (`SPIN_PERIOD` in Geometries, GeometryConvex; `ORBIT_PERIOD` in Camera).
- Integrators (animation mixers) advance by `delta`. For a single clip, set `timeline.duration = clip.duration` and `mixer.setTime(timeline.currentTime)` when the clip arrives.
- No wall-clock timing in a document: no `setTimeout`, `Date.now()`, `performance.now()` or `Timer`. Schedule in timeline or mixer time; mixer fades already run on `mixer.time`.
- Animated examples pass `new Timeline({autoplay: true})`; static ones keep the default (paused).
- `delta` is negative when the timeline wraps or is scrubbed back (accepted, see `timeline-negative-delta` in [three_future_work.plan.md](./three_future_work.plan.md)).
- Live documents ([ADR-0009](../../packages/three/docs/adr/0009-live-documents-use-the-timeline-as-a-clock.md)): game-like content whose state builds up from interaction (the skinning blending demos) uses the timeline only as a clock. It integrates only positive `delta` (`if (delta > 0) mixer.update(delta)`), so wraps and scrubbing back neither rewind nor reset it. Pause and frame step come from the editor's transport; no per-document pause or step properties.

### Async content

- Content added outside a transaction (loaded models) needs `this.notify({kind: 'structure'})`, or views and the scene graph miss it. A texture loaded in the background needs `this.notify({kind: 'material'})` in its load callback, because views draw only on changes.
- Framing hint after loading: `this.dispatch('frame-object', {object, overscan?}, true)`. Needed when the scene holds nothing but lights or scenery at first show: first-show framing then fits that, and the camera can open inside the content that arrives (Lightprobe, MaterialsMatcap, MaterialxNoise). It bubbles through the editor to the viewports showing the document. `object` can be an array. Skinned bounds read the bones' world matrices, which nothing has drawn yet for a fresh `SkeletonUtils.clone`: call `updateMatrixWorld(true)` on what you frame first (AnimationMultiple). The same goes for framing objects below a loaded file's own transforms: framing updates only each framed object's matrix, not its ancestors' (LoaderVrml framed ten times too far). An `overscan` below 1 frames closer, for content larger than its fog range (InstancingMorph).
- Content built in the constructor whose scenery dwarfs it (a large ground, an enclosing curtain): dispatch `frame-object` from `onRendererInitialized`, which runs at the document's first draw, when the views showing it hear the event (Clipping, GeometryLoft). Frame an extent inside enclosing scenery: GeometryLoft frames its pedestals, so the perspective view opens inside the curtain.
- Framing reads current morph influences. Content that morphs beyond its rest shape frames a detached stand-in instead, for example a `Mesh` whose geometry is just the two corners of the geometry's morph-inclusive `boundingBox` (LoaderMdd).
- A loader that returns before its textures arrive (`VRMLLoader`, `FBXLoader`, `ThreeMFLoader`, `ColladaLoader`) gets a `LoadingManager` whose `onLoad` calls `notify({kind: 'material'})`. A static document draws nothing until something changes, so the textures would stay black (LoaderVrml `meshWithTexture`). `GLTFLoader` resolves after its textures.
- A dropdown that reloads content (an `asset` or `file` property) counts its loads and drops a result that is no longer the latest (LoaderFbx, Loader3mf, LoaderVrml, LoaderGcode, LoaderSvg, LoaderPcd). Dispose the previous model's geometries and materials as the source does.
- Scenery the source keeps far away (VRML `Background` spheres, 10000 units, `depthTest: false`) lies beyond the views' far plane, which framing sets from the content's bounds (`FRAME_OVERFIT`). LoaderVrml redraws those spheres around each drawing camera in `onBeforeRender`. They also need explicit render orders: WebGPU sorted the ground sphere under the sky sphere.
- Instances placed on the GPU (`positionNode`, identity instance matrices) have the bounds of one instance: set the `InstancedMesh`'s `boundingBox` and `boundingSphere` to the content's extent, for framing and culling (TslGalaxy, InstancePath).
- Framing reads vertex positions (`expandByObject( object, true )`) except for `InstancedMesh` and `BatchedMesh`, which use their `boundingBox`. Content drawn on the GPU from one small geometry that is not an `InstancedMesh` (`Mesh.count` instances, `GaussianSplat`) frames a detached stand-in whose two vertices are the content's world corners (Reflection, GaussianSplat).
- Whole-scene framing can put the views beyond the fog: an `overscan` below 1 frames from inside the content (InstanceSprites' 2000-unit cube in `FogExp2( 0.001 )`).
- Content derived from other objects' transforms (curve handles) rebuilds on the document's `commit` event, which tool edits dispatch with their transaction even while paused, and checks for uncommitted (Inspector) edits in `onAnimate` (ModifierCurve).
- Fields used by `onAnimate` before the load finishes: a placeholder (`new AnimationMixer(new Group())`) or optional chaining (`this.mixer?.update(delta)`). Change handlers guard content that may not be loaded yet (`if (this.model)`).

### Scene graph and picking

- Name what the scene graph should show: the scene graph and inspector label rows by `name`, or by `<ClassName>` when there is none. Name lights by role (`Key`, `Ambient`).
- Do not rename loaded nodes that animation tracks address by name: the clip's tracks stop binding (`PropertyBinding: No target node found`). The horse's morph track targets `mesh_0`.
- `Object3D.copy` copies `name`: name an object again after copying generated content into it (`lightProbe.copy( LightProbeGenerator.fromCubeTexture( ... ) )`).
- `userData.selectable = false` on floors, backdrops and other scenery. It applies to descendants too.
- Do not author camera, light or skeleton helpers (`CameraHelper`, `PointLightHelper`, `RectAreaLightHelper`, `SkeletonHelper`, ...): the helper overlays draw them in every view for any document (`cameraHelpers` and `lightHelpers` on, `skeletonHelpers` off by default; `scene-helpers` in [three_future_work.plan.md](./three_future_work.plan.md), ADR-0006). Drop the source's helpers and its `show helpers` / `show skeleton` toggles. A `SkeletonHelper` built only to collect bones (retargeting) stays, out of the scene. A model toggle hides the meshes, not the model root, so its skeleton still shows. Clipping planes of `ClippingGroup`s come from the `clippingHelpers` overlay: drop the source's `PlaneHelper`s and their toggle (ClippingIntersection). Helpers that are the subject (normal, tangent and box helpers) are content: a `Helpers` group, unselectable, toggled by `showHelpers`, added after the objects they follow.

### Properties and groups

- `registerEditorConfig` / `registerEditorGroups` go right after the class (`io-gui.mdc`, Editor Configs). `Main` lists the curated controls. `Hidden` lists public fields that are internal. The document's own groups (tone mapping, exposure, timeline, plus an `Advanced` catch-all) aggregate with the subclass's groups.
- The Document tab shows about ten characters of a property name: keep names short and distinct within that (MaterialsEnvmaps `rotateX` instead of `backgroundRotationX`; TslRagingSea keeps the source's `largeSpeed`, `smallFrequency`). A nested `ioObject` takes `labelWidth` (MorphtargetsFace blend shapes).
- Colors and vectors edited in place: a `@Property({type: Color, init: null})` (or `Vector2`) with an `xMutated()` that copies it into the material or uniform and calls `notify`. Plain public fields do not observe in-place edits, so a paused view would not redraw.
- Controls that depend on the loaded content (one per clip, one per morph target) cannot be dropdowns: editor configs are per class, and their menus are copied per object. Use a record property shown with `ioObject`. A record of functions shows a button per entry, for example clips (LoaderFbx `clips`). A record of accessors over the content shows a slider per entry, for example morph influences (LoaderFbx `morphs`, MorphtargetsFace `expressions`). Replace the record on each load.
- Many shader values: `reference( name, type, object )` nodes to the document's own properties need no change handlers, as in the sources that refer to a settings object (CubemapAdjustments). A group of settings repeated per layer is a small `ReactiveObject` subclass as a property, shown with `ioObject({expanded: true})`; its nodes refer to its properties, and the document's `xMutated()` notifies (TslHalftone `shade`, `highlight`).
- A dropdown of names fetched at runtime: editor configs copy their menus when the Document tab first shows, so fetch the names with a top-level `await` in the example's module, before the class registers its config (LoaderGltf `asset`, the Khronos sample index). A failed fetch falls back to one entry.
- Private fields show in the `Advanced` catch-all: list internal state (loaders, load counters, pending promises) in `Hidden`.
- Change handlers do not run for default values. They do run inside the base constructor for values passed in `args`, before subclass fields exist. Call `xChanged()` at the end of the constructor to apply the default, and keep the state that handlers touch in `declare`d or lazily created fields if args must work.

### WebGPU notes

- WebGPU points are 1 px. Use a `Sprite` with `PointsNodeMaterial({positionNode: instancedBufferAttribute(attribute)})` and `sprite.count` (GeometryConvex). A `Sprite`'s bounds, picking and frustum culling are one quad at its origin. When the points are the content (loaded clouds), keep the `Points`, which still draw 1 px points and are what picking and framing see. Add a child `InstancedMesh(new PlaneGeometry(1, 1), pointsMaterial, count)` named `Sprites` that draws the sized points: unselectable, with the cloud's `boundingBox` and `boundingSphere` (LoaderPcd, LoaderXyz). Sizes follow WebGL: `sizeAttenuation` scales by half the view's height over depth.
- `PMREMGenerator` output in WebGPU is a cube texture, not WebGL's 2D CubeUV atlas: it cannot be a plane's `map` (the envmaps examples' `debug` plane, dropped). Generate PMREMs in `onRendererInitialized` once the source images have loaded. `fromEquirectangular`, `fromCubemap` and `fromScene` are synchronous there.
- `NoBlending` with `premultipliedAlpha` draws a texture's raw color where WebGL draws it premultiplied (black). Seen in MaterialsBlending's alpha flare row.
- Canvas textures built from a DOM canvas: draw on an `OffscreenCanvas` (`CanvasTexture<OffscreenCanvas>`), or cut images with `createImageBitmap(image, sx, sy, sw, sh)` (MaterialsBlending, PanoramaCube).
- Vertex attribute strides must be multiples of 4 bytes, so 3 × `Float16` is invalid; use `Float32Array` (GeometryColors).
- A material with `fragmentNode` writes only the first color output: the TRAA views' MRT pass (color and velocity) makes WebGPU reject its pipeline. `LightProbeHelperGPU` is one: Lightprobe and LightprobeCubecamera give the helper a `MeshBasicNodeMaterial` whose `colorNode` is the same irradiance. `outputNode` is fine (it is merged with the MRT).
- A standard material's `envMap` that is a `CubeTexture` still loading binds a 2D placeholder as a cube in the PMREM path and fails WebGPU validation until it loads (upstream; the source races the same way). Add the mesh once the cube map has loaded (MaterialsDisplacementmap).
- Addons built on `ShaderMaterial` (`Sky`, `Water`, `Reflector`) need their node versions (`SkyMesh`, `WaterMesh`, TSL `reflector()`).
- WebGPU allows 8 vertex buffers per pipeline. An `InstancedMesh` adds its instance matrix, and TRAA views a second one for velocity: geometry with four instanced attributes (Reflection's tree) stays `Mesh.count` instances.
- A compute pass inside a material (`positionNode = Fn( ... )().compute( count )`, SkinningPoints) builds its pipeline when it first runs. Inside a TRAA view's pass, skinning then sees the velocity output and refers to `positionPrevious`, which compute shaders lack. Run it once with `renderer.compute` outside the views' draws (from `onRendererInitialized` or the load callback, keeping the renderer): the pipeline is cached.
- Occlusion query results arrive after the draw that ran the query, and three keeps them per render context, which it shares between draws into targets of the same format and outputs whatever the camera (since r183, #32546; upstream kit under `occlusion-upstream`). Views drawn alike overwrite each other's results, so `renderer.isOccluded` can return another view's result (Occlusion keeps the source's behavior and documents it).
- `alphaToCoverage` needs a multisampled target: it works in views with `View.msaa` (not TRAA views, whose pipeline ignores MSAA), and does nothing elsewhere (Clipping, ClippingIntersection).
- Imports are named, from `three/webgpu` and `three/tsl`, with addons from `three/addons/...`. Bare `three` is aliased to `three/webgpu` (`vite.config.ts`).
- `@types/three` 0.186 is stricter than the JS sources:
  - `UniformNode<'float', number>` (node type and value type), `Node<'vec3'>` for typed nodes. Untyped `Node` has no math methods.
  - `Fn` infers its arguments from the annotated parameter: `Fn(([a, b]: [Node<'vec2'>, Node<'float'>]) => ..., {a: 'vec2', b: 'float', return: 'vec3'})`, with the layout as the second argument (the old `Fn<[Node, Node]>(...).setLayout(...)` no longer types).
  - Arguments are not converted implicitly: pass `normalWorldGeometry.xy` to a `vec2` input, and `color(c).rgb` to multiply with a `vec3`.
  - `bool(true)` instead of `true` in `assign()`.

## Workflow

1. Read the source at r186 and at HEAD (see Sources). List the scene content, animation, async loads, GUI, cameras and helpers, and the renderer settings (tone mapping, shadows).
2. Write `src/demos/examples/<Name>Example.ts` following the rules above.
3. Add it to `DOCUMENTS` in `IoEditorExample.ts`.
4. Run `pnpm lint:check` and `tsc -b`, then check in `pnpm dev` (Demos > Three > Load Example): it renders and matches the source's look (tone mapping, background, lighting); scene graph names; Document tab controls; play, pause, scrub and loop; switching to another document and back.
5. Add a row to the audit table.

Headless Chromium with `--enable-unsafe-webgpu --enable-features=Vulkan,WebGPU --use-angle=metal` draws on the GPU, and `page.locator('three-viewport#Perspective').screenshot()` captures a view of the running editor (open a document by setting `documentName` on `io-editor-example`, pause with `editor.isPlaying = false`, change properties on `editor.document`). Without those flags it has a SwiftShader adapter and viewport screenshots come out blank. To check that a document compiles and draws, use the page's own three: import the `three.webgpu` URL listed in `performance.getEntriesByType('resource')` (a fresh `import('three/webgpu')` loads a second instance, and TSL then fails with "No stack defined"). Draw with the page's shared renderer (`threeViewport.renderer`) into a half-float `RenderTarget` (the headless canvas texture is invalid) inside `device.pushErrorScope('validation')`, apply the document's tone mapping with a `renderOutput` quad into an `rgba8` target, read the pixels back and save a PNG to compare with `examples/screenshots/<source>.jpg`. Pause and set the time first so the frame is reproducible. A second `WebGPURenderer` gives false results: lights' shadow nodes and the equirect-to-cube cache are shared across renderers (destroyed shadow maps, black equirect backgrounds). The hidden Scene Camera tab never switches document, so clone the document's scene camera instead of asking that view. New addon imports make Vite re-optimize and reload the page once. Backdrop materials report a format mismatch in an `rgba8` target; that comes from the harness, not the document.

## Audit (2026-10-11, r186)

Sources compared at r186 and HEAD. "Fixed" is what this audit changed. All 15 compile and render on r186 without WebGPU validation errors (headless compile check). Later conversions are listed below them with their deviations.

| Example | Source | Intentional deviations | Fixed / open |
|---|---|---|---|
| AnimationGroups | `misc_animation_groups` | duration = clip (3 s) | OK |
| AnimationKeyframes | `webgl_animation_keyframes` | `TrainCamera` riding the train for a camera view; frames the model on load; clouds held still (the source never advances its sky's `time`) | Fixed: ported to the r186 look (`SkyMesh` sky + PMREM environment from it, `ACESFilmicToneMapping`, `DRACO_GLTF_CONFIG`), replacing RoomEnvironment and the flat `0xbfe3dd` background |
| AnimationRetargeting | `webgpu_animation_retargeting` | named scene camera; `lightSpeed` takes time as input | Fixed: `NeutralToneMapping`, `lightSpeed` layout in the HEAD form (r186 typings); skeletons from the skeleton helpers overlay (2026-10-13) |
| AnimationRetargetingReadyplayer | `webgpu_animation_retargeting_readyplayer` | frames the models | Fixed: `NeutralToneMapping` |
| AnimationSkinningAdditiveBlending | `webgl_animation_skinning_additive_blending` | `none / idle / walk / run` buttons; weights in the action inspector; time scale in the mixer inspector; `DirectionalLight` as at HEAD (r186 had `SunLight`); live document (ADR-0009) | Fixed: time going back ignored. Open: `crossfade-state` |
| AnimationSkinningBlending | `webgl_animation_skinning_blending` | three target buttons instead of four from→to buttons, so idle ↔ run is added (5 s / 2.5 s); effective weights read-only (the source's sliders also set weights); time scale in the mixer inspector; pause and single step are the timeline transport (a step is one frame, not 0.05 s); `DirectionalLight` as at HEAD; live document (ADR-0009) | Fixed: crossfade end in mixer time instead of `setTimeout`, camera aspect no longer read from `window`, `showModel` (hides the meshes; the skeleton is the skeleton helpers overlay, 2026-10-13), per-transition durations (run → walk 5 s), time going back ignored. Open: `crossfade-state` |
| BackdropArea | `webgpu_backdrop_area` | box scale as a linkable `Vector3`; named scene camera | Fixed: `NeutralToneMapping` (exposure 0.9 had no effect), floor 5 × 5, camera near/far 0.25/25, default preset `checker` |
| Backdrop | `webgpu_backdrop` | spot light at (1, 2, 3) instead of on the camera; portals turn by `delta × mixer.timeScale`; the portals keep turning while you orbit | Fixed: duration = clip, `mixer.setTime`. The portals still jump at the loop wrap (integrated) |
| Camera | `webgpu_camera` | both cameras update every frame (no `O` / `P` switch); camera projections in the Document tab | Fixed: frustums from the camera helpers overlay, which skips the camera a view looks through (2026-10-13) |
| ComputeTexture | `webgpu_compute_texture` | none | OK (the plane is unnamed) |
| Geometries | `webgl_geometries` | point light fixed above instead of on the orbiting camera; 20 s spin; `wireframe` toggle (io addition) | OK |
| GeometryColors | `webgl_geometry_colors` | `Float32` colors; mouse-follow camera dropped; shadows and wireframes unselectable | OK |
| GeometryConvex | `webgl_geometry_convex` | `Sprite` points; light fixed; no `AxesHelper` | OK (point color typed as `color(c).rgb × texture.rgb` for r186) |
| VolumePerlin | `webgpu_volume_perlin` | none | Fixed: `refine` bisection, named mesh |
| **Converted 2026-10-11** | | | Checked headlessly: renders through the page's shared renderer at a fixed time, compared with `examples/screenshots` |
| AnimationKeys | `misc_animation_keys` | duration = clip (3 s); source camera kept as `Camera` (the box travels 30 units, out of the at-rest framing); `AxesHelper` dropped | Open: `framing-motion` |
| GeometryCube | `webgl_geometry_cube` | spin from time, 20 s (source 0.005 / 0.01 rad per frame) | OK |
| Sprites | `webgpu_sprites` | 8π s loop (group turns 0.5 / 0.75 / 1 rad/s); per-sprite spin rounded to whole turns per loop; sprites resized when the texture arrives | OK |
| InstanceUniform | `webgpu_instance_uniform` | `color` on a `Mesh` subclass, editable in the Inspector; spin from time (20 s); `GridHelper` dropped; `emissiveNode` typed through a cast (@types 0.186 declares it only on lit materials) | OK |
| MaterialsToon | `webgpu_materials_toon` | toon outline post dropped (cosmetic, `document-pipeline`); spheres and labels grouped; labels added when the font arrives | OK |
| Clearcoat | `webgpu_clearcoat` | 8π s loop; spheres turn once per loop (0.25 rad/s, source 0.3); materials built at once, environment set on load | OK |
| LightsPhong | `webgpu_lights_phong` | 40π s loop (light frequencies are multiples of 0.05 rad/s); no background (source: black clear) | OK |
| LightsRectarealight | `webgpu_lights_rectarealight` | 4π s loop; light panels from the light helpers overlay (2026-10-13); source camera kept as `Camera` | Open: `framing-scenery` (2000-unit floor) |
| Shadowmap | `webgpu_shadowmap` | 40π s loop (knot 0.25 / 0.5 / 1, light group 0.7 rad/s); source camera kept as `Camera` | Open: `framing-scenery` (600-unit ground; with the 50–100 fog the perspective view opens on fog color) |
| Skinning | `webgpu_skinning` | point light at the source camera's position instead of on the camera; frames the model | OK |
| LoaderGltfIridescence | `webgpu_loader_gltf_iridescence` | camera auto-rotation dropped; frames the model | Open: `transmission-views` |
| LoaderGltfAnisotropy | `webgpu_loader_gltf_anisotropy` | frames the model | OK |
| LoaderGltfDispersion | `webgpu_loader_gltf_dispersion` | frames the model | Open: `transmission-views` |
| LoaderGltfTransmission | `webgpu_loader_gltf_transmission` | duration = clip; camera auto-rotation dropped; frames the model | Open: `transmission-views` |
| PmremCubemap | `webgpu_pmrem_cubemap` | spheres grouped, framed on load | OK |
| PmremEquirectangular | `webgpu_pmrem_equirectangular` | spheres grouped, framed on load | OK |
| CubemapMix | `webgpu_cubemap_mix` | TSL `time` -> `timeline.timeNode`; 10 s loop (one cross-fade cycle) | OK |
| MorphtargetsHorse | `webgl_morphtargets_horse` | 1 s timeline (the clip's `setDuration( 1 )`); orbiting camera dropped | OK |
| TslVfxFlames | `webgpu_tsl_vfx_flames` | TSL `time` -> `timeline.timeNode`; 20 s loop (noise scrolls repeat, the 10 rad/s flicker jumps once); canvas gradient -> `DataTexture` built in JS; flames do not write depth (their transparent quads hid the grid) | Fixed 2026-10-13: half of each flame clipped in ortho front/back views (degenerate clip range, `clipPlanesFromBox`) |
| LightsPointlights | `webgpu_lights_pointlights` | 16π s loop; TSL `time` -> `timeline.timeNode`; frames the head on load | OK |
| Buffergeometry | `webgl_buffergeometry` | 8π s spin loop; attribute arrays kept (the source frees them on upload; framing and picking read them) | OK |
| BuffergeometryIndexed | `webgl_buffergeometry_indexed` | 8π s spin loop; `wireframe` property | OK |
| BuffergeometryLines | `webgl_buffergeometry_lines` | 8π s loop; morph influence `abs(sin(0.5 t))` from time | OK |
| BuffergeometryLinesIndexed | `webgl_buffergeometry_lines_indexed` | 4π s turn; pivot is a `Group` named `Pivot` | OK |
| LinesDashed | `webgl_lines_dashed` | 8π s turn | OK |
| GeometryExtrudeShapes | `webgl_geometry_extrude_shapes` | point light at the source camera's position; `TrackballControls` dropped | OK |
| GeometryTeapot | `webgl_geometry_teapot` | GUI -> `tessellation` / `lid` / `body` / `bottom` / `fitLid` / `nonBlinn` / `shading` properties; geometry swapped on the same mesh instead of a new mesh | OK |
| **Converted 2026-10-13** | | | Checked in the editor (headless Chromium on the GPU against `pnpm dev`): renders, scene graph names, Document tab controls with playback paused, no console errors |
| Morphtargets | `webgpu_morphtargets` | `spherify` / `twist` properties; point light at the source camera's position | OK |
| MorphtargetsFace | `webgpu_morphtargets_face` | KTX2 + RoomEnvironment PMREM in `onRendererInitialized` (loads once); 52 blend shape sliders as `expressions` (accessors over the head's influences, 120 px labels); duration = clip | Open: `inspector-refresh` (the sliders follow the clip through a debug-only `dispatchMutation`) |
| InstancingMorph | `webgpu_instancing_morph` | `SunLight` registered with `renderer.library.addLight` in `onRendererInitialized` (r186 API; the dev build warns it is deprecated for `SunLight.registerNode`); 63 s loop (42 gallops, one camera loop); source camera kept as `Camera`; framed at overscan 0.5 (the 10000-unit herd lies mostly in fog) | Open: `framing-scenery` (million-unit ground) |
| AnimationMultiple | `webgl_animation_multiple` | `DirectionalLight` as at HEAD (r186 had `SunLight`); 7 s loop (ten run cycles; idle and walk jump at the wrap); shared skeleton bones keep the glTF transform in a `Skeleton` group instead of the meshes, so the skeleton overlay draws them at size | OK |
| Materials | `webgpu_materials` | 17 teapots named after their materials; 20 s spin; orbiting camera and grid dropped; casts for @types 0.186 (wgslFn includes, Loop result) | OK |
| MaterialsBasic | `webgpu_materials_basic` | spheres move with time (20π s loop); mouse camera dropped; `color` / `mapping` / `refractionRatio` / `transparent` / `opacity` properties | OK |
| MaterialsLightmap | `webgpu_materials_lightmap` | `lightMapIntensity` property; frames the model (the sky dome spans 8000 units) | Fixed: zooming in cut off the sky (`dolly-far`) |
| MaterialsEnvmaps | `webgpu_materials_envmaps` | background turns with time (one turn per 100 s loop) while `rotateX` / `rotateY` / `rotateZ` is on, and snaps back when off (the source accumulates) | OK |
| MaterialsSss | `webgpu_materials_sss` | bunny turns with time (10π s loop); thickness uniforms as properties | OK |
| ProceduralTexture | `webgpu_procedural_texture` | ortho camera dropped; `uvScale` / `blurAmount` / `autoUpdate` properties | OK |
| Textures2dArray | `webgpu_textures_2d-array` | TSL `time` -> `timeline.timeNode`; 2 s loop (one layer sweep) | OK |
| TslGalaxy | `webgpu_tsl_galaxy` | TSL `time` -> `timeline.timeNode`; 60 s loop (each particle turns at its own rate: the swirl jumps at the wrap); explicit galaxy bounds on the `InstancedMesh` | OK |
| LoaderObj | `webgl_loader_obj` | camera light at the source camera's position; MTL textures reported through a `LoadingManager` | OK |
| LoaderStl | `webgl_loader_stl` | files loaded together; models grouped and framed (40-unit floor); orbiting camera dropped | OK |
| LoaderPly | `webgl_loader_ply` | as LoaderStl | OK |
| Loader3ds | `webgl_loader_3ds` | `TrackballControls` dropped; textures through a `LoadingManager` | OK |
| LoaderDraco | `webgl_loader_draco` | orbiting camera dropped; frames the bunny (8-unit floor) | OK |
| LoaderKmz | `webgl_loader_kmz` | grid dropped | OK |
| LoaderAmf | `webgl_loader_amf` | Z-up rook turned upright (-90° about x) for the Y-up views; camera light at the converted position | OK |
| LoaderUsdz | `webgl_loader_usdz` | frames the model | OK |
| LoaderVox | `webgl_loader_vox` | none | OK |
| FogHeight | `webgpu_fog_height` | source camera kept as `Camera` (the fog depends on distance) | Fog controls did not reach forward views (`shared-refresh`; the source had the same bug). `renderGroup` workaround removed 2026-10-14 to stay with the source; three #34996 merged 2026-10-14, recheck on dev |
| InstanceMesh | `webgpu_instance_mesh` | `instanceCount` property; 8π s loop (the 10 s color mix jumps at the wrap); `?amount` query dropped (10) | OK |
| InstancePath | `webgpu_instance_path` | `InstancedMesh` (identity matrices) with the heart's bounds instead of `Mesh.count`; 20 s loop (8 pulses; the bobbing jumps at the wrap) | OK |
| TslRagingSea | `webgpu_tsl_raging_sea` | TSL `time` -> `timeline.timeNode`; 20 s loop; source GUI names (`largeSpeed`, `smallIterations`, ...) in Main / Emissive / Waves groups | OK |
| **Converted 2026-10-14** | | | Checked in the editor (headless Chromium on the GPU, branch `examples-webgl`): renders, scene graph names, Document tab controls with playback paused (asset and file switches, clip buttons, morph and material sliders, variants, envMap switches), all 30 opened in one page with no console errors |
| LoaderCollada | `webgl_loader_collada` | elf turns with time (4π s loop, the source's 0.5 rad/s); textures through a `LoadingManager` | OK |
| LoaderColladaSkinning | `webgl_loader_collada_skinning` | duration = clip; grid dropped; frames the model | OK |
| LoaderFbx | `webgl_loader_fbx` | `DirectionalLight` with the HEAD shadow box (r186 had `SunLight`); `asset` dropdown; the clip dropdown becomes `clips` buttons and the morph folders a flat `morphs` record (a mesh-name prefix only when names repeat); duration = playing clip; grid dropped; frames each file | OK |
| LoaderFbxNurbs | `webgl_loader_fbx_nurbs` | grid dropped; no background (source: black clear) | OK |
| Loader3mf | `webgl_loader_3mf` | Z-up files turned upright (-90° about x) instead of the camera's up axis, light with them; `asset` dropdown | OK |
| Loader3mfMaterials | `webgl_loader_3mf_materials` | `DirectionalLight` as at HEAD (r186 had `SunLight`); frames the truck (1000-unit floor) | OK |
| LoaderPcd | `webgl_loader_pcd` | sized points from a child `InstancedMesh` (WebGPU notes); `file` / `size` / `color` properties keep their values across files (the source's GUI resets with each file); no background | OK |
| LoaderXyz | `webgl_loader_xyz` | sized points as LoaderPcd; tumble from time, 20π s loop (two and five turns) | OK |
| LoaderVrml | `webgl_loader_vrml` | `asset` dropdown; background spheres drawn around each view's camera, in loader order, unselectable and left out of framing (Async content) | Fixed: framing ignored the file's transforms; textured files stayed black (no redraw on texture load) |
| LoaderGcode | `webgl_loader_gcode` | `asset` dropdown; no background | OK |
| LoaderSvg | `webgl_loader_svg` | `file` (labeled options) / `fills` / `strokes` / `fillWire` / `strokeWire` properties; meshes rebuilt from the loaded data on option changes (the source reloads); grid dropped | OK |
| LoaderGltfAvif | `webgl_loader_gltf_avif` | none | OK |
| LoaderGltfInstancing | `webgl_loader_gltf_instancing` | environment and model load together | OK |
| LoaderGltfVariants | `webgl_loader_gltf_variants` | the variant names are listed before the model loads (`midnight` / `beach` / `street`); environment and model load together | OK |
| LoaderMdd | `webgl_loader_mdd` | duration = clip; frames the morph targets' extent through a stand-in (Async content) | OK |
| LoaderTextureExr | `webgl_loader_texture_exr` | exposure is the document's; ortho camera dropped | OK |
| LoaderTextureHdr | `webgl_loader_texture_hdr` | as LoaderTextureExr | OK |
| LoaderTextureTga | `webgl_loader_texture_tga` | none | OK |
| LoaderTextureTiff | `webgl_loader_texture_tiff` | planes added at once, textured on load; no background | OK |
| LoaderTextureUltrahdr | `webgl_loader_texture_ultrahdr` | knot turns once per 20 s loop while `autoRotate` is on and holds its angle when off; exposure is the document's | OK |
| MaterialsBumpmap | `webgl_materials_bumpmap` | `bumpMap` (the source's `enableBumpMap`) / `bumpScale` properties | OK |
| MaterialsCubemap | `webgl_materials_cubemap` | heads named after their materials | OK |
| MaterialsCubemapRefraction | `webgl_materials_cubemap_refraction` | mouse-driven camera dropped; statues grouped and framed | OK |
| MaterialsEnvmapsExr | `webgl_materials_envmaps_exr` | PMREMs in `onRendererInitialized`; `debug` plane dropped (WebGPU notes); knot turns once per 20 s loop; exposure is the document's | OK |
| MaterialsEnvmapsHdr | `webgl_materials_envmaps_hdr` | as MaterialsEnvmapsExr | OK |
| MaterialsNormalmap | `webgl_materials_normalmap` | `normalMap` / `normalScale` properties; bleach bypass, color correction and FXAA post dropped (`document-pipeline`) | OK |
| MaterialsNormalmapObjectSpace | `webgl_materials_normalmap_object_space` | point light at the source camera's position; meshes grouped as `Nefertiti` | OK |
| MaterialsTextureRotation | `webgl_materials_texture_rotation` | anisotropy set in `onRendererInitialized` | Upstream still untracked (`shared-refresh`: texture transforms; issue kit 2026-10-15). In the editor the controls reach forward views when several draw: three keys render objects by object, material, target format and scene (not camera), so same-format view targets share render objects and each target switch forces a full refresh. One forward view alone stays stale; TRAA views update |
| MaterialsBlending | `webgl_materials_blending` | background scroll from time (12.5 s loop); `OffscreenCanvas` background and labels | Open: `NoBlending` draws the alpha flare unpremultiplied (WebGPU notes) |
| PanoramaCube | `webgl_panorama_cube` | source camera kept as `Camera` (the panorama shows from inside the box); faces cut with `createImageBitmap`; box unselectable | OK |
| **Converted 2026-10-15** | | | Checked in the editor (headless Chromium on the GPU, own dev server): renders against `examples/screenshots`, scene graph names, Document tab controls changed with playback paused, all 30 opened in one page with no console errors |
| LightsCustom | `webgpu_lights_custom` | 20π s loop; the source turns the scene, here a `Pivot` group with the lights and points; 500k 1 px points as in the source | OK |
| LightsIesSpotlight | `webgpu_lights_ies_spotlight` | 4 s loop; lights join the scene once their IES profiles load; `helper` toggle dropped (light helpers overlay); frames the lights' square through a stand-in (200-unit floor) | OK |
| LightsPhysical | `webgpu_lights_physical` | 4π s loop; exposure is the document's (the source's 0.68, raised to the fifth power); `shadows` turns the bulb's shadow off instead of the renderer's shadow map; `bulbPower` / `irradiance` dropdowns | OK |
| LightsProjector | `webgpu_lights_projector` | 6π s loop (the caustics jump at the wrap); `video` projection dropped; `shadows` as LightsPhysical; frames Lucy (200-unit floor) | OK |
| LightsSelective | `webgpu_lights_selective` | 40π s loop; the center teapot's `roughness` / `metalness` | OK |
| LightsSpotlight | `webgpu_lights_spotlight` | 6π s loop; `map` dropdown; `helpers` toggle dropped; frames Lucy | OK |
| ShadowmapPointlight | `webgpu_shadowmap_pointlight` | 20π s loop; alpha map drawn on an `OffscreenCanvas`; room unselectable | OK |
| Lightprobe | `webgpu_lightprobe` | `probe` / `directional` / `envMap` intensities; the probe helper is content, with a basic material (WebGPU notes: `fragmentNode`); frames the sphere | Open: the probe's `intensity` stays stale in a lone forward view (`shared-refresh`, issue kit 3; upstream fix expected) |
| LightprobeCubecamera | `webgpu_lightprobe_cubecamera` | cube camera renders once in `onRendererInitialized`, after the background loads; helper as in Lightprobe; frames the helper | OK |
| MaterialsAlphahash | `webgpu_materials_alphahash` | SSAA post dropped (`document-pipeline`; the TRAA views converge the hash noise); `?amount` query dropped (3) | OK |
| MaterialsArrays | `webgpu_materials_arrays` | table unselectable | OK |
| MaterialsCubemapMipmaps | `webgpu_materials_cubemap_mipmaps` | spheres added and framed once the nine levels load | OK |
| MaterialsDisplacementmap | `webgpu_materials_displacementmap` | ortho camera dropped; camera light (pink) at the source camera's position; 10π/3 s loop (source 0.01 rad per frame); head added once its cube map loads too (WebGPU notes); short names `aoIntensity`, `envIntensity`, `displacement` | OK |
| MaterialsMatcap | `webgpu_materials_matcap` | drag-and-drop matcaps dropped; exposure is the document's | OK |
| MaterialxNoise | `webgpu_materialx_noise` | TSL `time` -> `timeline.timeNode`; 8π s loop (the noise jumps at the wrap); spheres turn once per loop (source 0.005 rad per frame); MaterialX helpers typed loosely for @types 0.186 | OK |
| ParallaxUv | `webgpu_parallax_uv` | auto-rotating camera dropped; `blurriness` / `parallaxScale` / `uvScale` | OK |
| CubemapAdjustments | `webgpu_cubemap_adjustments` | the source's reference nodes point at the document's own properties | OK (forward views need #34996, in the linked dev build) |
| Tonemapping | `webgpu_tonemapping` | tone mapping type and exposure are the document's; background `blurriness` / `intensity` | OK |
| Equirectangular | `webgpu_equirectangular` | auto-rotating camera dropped; nothing to select | OK |
| PmremScene | `webgpu_pmrem_scene` | PMREM of the scene in `onRendererInitialized` once the background loads; the center sphere joins then; `forceWebGL` dropped | OK |
| TslAngularSlicing | `webgpu_tsl_angular_slicing` | `DirectionalLight` as at HEAD (r186 had `SunLight`); source camera kept as `Camera` (the cut faces it; default framing looks at the far side); DRACO decoder path set | OK |
| TslEarth | `webgpu_tsl_earth` | 80π s loop (one turn at the source's 0.025 rad/s); `dayColor` / `twilightColor` (source `atmosphere…Color`) | OK |
| TslHalftone | `webgpu_tsl_halftone` | 2π s loop (the highlight's direction); each layer is a `Halftone` object (`shade`, `highlight`, nested editors) read through reference nodes | OK |
| TslWood | `webgpu_tsl_wood` | blocks built at once (the source yields to the page per block); custom wood parameters as a `custom` accessor record (140 px labels); frames the blocks when the labels load (40-unit floor) | OK |
| VolumeCloud | `webgpu_volume_cloud` | 15π s loop; the 10-unit sky sphere becomes a background node sampling the same gradient by direction (`OffscreenCanvas`), so the sky does not dominate framing; the cloud does not write depth (its transparent box hid the grid) | OK |
| Particles | `webgpu_particles` | TSL `time` -> `timeline.timeNode`; 20 s loop (each life jumps at the wrap); `InstancedMesh`es with the plumes' bounds instead of `Mesh.count`; grid helper dropped | OK |
| Clipping | `webgpu_clipping` | `DirectionalLight` as at HEAD; 20π s loop; frames the knot from `onRendererInitialized` (9-unit ground); `alphaToCoverage` smooths the cuts in MSAA views; planes from the `clippingHelpers` overlay | OK |
| GeometryLoft | `webgpu_geometry_loft` | `DirectionalLight` as at HEAD; 100π/3 s loop (source 0.001 rad per frame); frames the pedestals from `onRendererInitialized`, so the perspective view starts inside the curtain | Open: the axis views look at the curtain (radius 55) from outside |
| LoaderGltf | `webgpu_loader_gltf` | `asset` dropdown of the Khronos sample index, fetched with a top-level `await` (Properties and groups); `compileAsync` dropped (needs the renderer); clips follow timeline time (`setTime`), duration = longest clip; static (the default model has no clips; animated ones play with the transport) | OK |
| LoaderGltfSheen | `webgpu_loader_gltf_sheen` | frames the chair | OK |
| **Converted 2026-10-15, batch 2** | | | Checked as the first batch: renders against `examples/screenshots` (Perspective and Front views), scene graph names, Document tab controls (ModifierCurve: a handle moved by a committed transaction), all 30 opened in one page with no console errors |
| Mirror | `webgpu_mirror` | 20π s loop (the half sphere at 0.1 rad/s, source 0.002 rad per frame); room unselectable; each view draws its own reflections | OK |
| Reflection | `webgpu_reflection` | tween.js effectors derived from time (57 s loop; the boxes' bob jumps at the wrap); blur and vignette post dropped; auto-rotating camera dropped; the boxes stay `Mesh.count` instances (WebGPU notes: vertex buffers) and frame through a stand-in (Async content) | OK |
| ReflectionBlurred | `webgpu_reflection_blurred` | TSL `time` -> `timeline.timeNode`; duration = clip (the rings' hue jumps at the wrap); `roughness` / `radius` / `resolutionScale`; frames Michelle | OK |
| ReflectionRoughness | `webgpu_reflection_roughness` | 10 s loop (the noise scroll); auto-rotating camera dropped; frames the box | OK |
| Refraction | `webgpu_refraction` | 2π s loop; room unselectable; the pane refracts each view's own frame | OK |
| Lensflares | `webgpu_lensflares` | 3000 boxes as one `InstancedMesh`; `FlyControls` dropped; source camera kept as `Camera` (whole-scene framing sees the 16000-unit field from outside, dim); flares drawn per view | OK |
| Occlusion | `webgpu_occlusion` | none (the node reads the previous draw's result, as in the source) | Open: views drawn alike share occlusion results, so the plane can flicker or show another view's result (WebGPU notes; `occlusion-upstream`). A redraw-until-settled workaround was tried and reverted (2026-10-16) |
| MeshBatch | `webgpu_mesh_batch` | spins derived from time about each instance's per-frame rotation axis, rates rounded to whole turns per 20π s loop; `webgpu` toggle and auto-rotating camera dropped; `count` rebuilds the mesh | OK |
| GaussianSplat | `webgpu_gaussian_splat` | global sRGB working color space -> `colorSpaceToWorking` on the splat color (Map; the splats blend in linear, close to the source except in soft edges). Switching `ColorManagement.workingColorSpace` per document was considered and rejected (2026-10-16): it is global (other documents, editors and overlays), read when colors are created and shaders built, and needs a rebuild of every material on each switch; exact parity would need a splat layer pass blended in sRGB and converted once (`document-pipeline`); `source` dropdown with a load counter; hit marker and license text dropped; frames a stand-in (Async content); sorts per drawing camera | OK |
| ParticlesSoft | `webgpu_particles_soft` | `mode` -> `soft`; `InstancedMesh` instead of `Sprite.count`; 20 s (each life jumps at the wrap); frames Lucy (100-unit ground) | Open: orthographic views fade with the perspective depth formula |
| Water | `webgpu_water` | flow from document time (`WaterNode.updateBeforeType` NONE; the node advances by wall-clock delta per render); 5 s loop; bloom (of the emissive output, `bloom-emissive`) and FXAA dropped; source camera kept as `Camera`; ground unselectable | Upstream: `WaterNode.setup` adds a reflector target to the water per build, one per view pipeline (six unnamed rows) |
| TslVfxTornado | `webgpu_tsl_vfx_tornado` | 20 s loop (the noise; the turbulence jumps at the wrap); the source's bloom is `document.bloom` (2026-10-16; its controls are the Document tab's Bloom) | OK |
| MaterialsRetroreflection | `webgpu_materials_retroreflection` | the flashlight rides the kept source camera `Camera` and its mirror light stays below it (the source moves both with the orbiting camera); the source's bloom is `document.bloom` (2026-10-16); night environment PMREM in `onRendererInitialized`; frames the cones (40-unit floor) | OK |
| SkinningInstancing | `webgpu_skinning_instancing` | blur post dropped; camera light at the source camera's position, camera kept as `Camera`; `instanceColor = null` as at HEAD; duration = clip (the color oscillation jumps at the wrap); frames one instance (1000-unit ground) | OK |
| SkinningPoints | `webgpu_skinning_points` | `InstancedMesh` of quads with the model's bounds instead of `Sprite.count`; compute passes built outside the views' draws (WebGPU notes); source camera kept as `Camera` (the model lies on the ground) | OK |
| InstanceSprites | `webgpu_instance_sprites` | pointer camera dropped; hue from time (20 s loop; the spin jumps at the wrap); `InstancedMesh` with the cube's bounds; frames with `overscan` 0.4 (whole-scene framing is beyond the fog) | OK |
| Sandbox | `webgpu_sandbox` | 10 s loop (box turns at 2π/10 and 4π/10 rad/s, source 0.6 and 1.2); the KTX2 plane joins after `detectSupport` in `onRendererInitialized` | OK |
| ModifierCurve | `webgpu_modifier_curve` | `TransformControls` dropped: the handles move with the translate tool (curve rebuilt on `commit`) or the Inspector (picked up while playing); offset from time (50/3 s loop) | OK |
| LinesFat | `webgpu_lines_fat` | inset view dropped (views of any size show the pixel widths); source camera kept as `Camera`; `worldUnits` resets the width as the source does | OK |
| LinesFatWireframe | `webgpu_lines_fat_wireframe` | as LinesFat | OK |
| Textures2dArrayCompressed | `webgpu_textures_2d-array_compressed` | layer from time (5 s loop, ten sweeps); KTX2 loads in `onRendererInitialized` | OK |
| LoaderTextureKtx2 | `webgpu_loader_texture_ktx2` | scissor grid of scenes -> one plane per file, a row per section; labels dropped; all 16 files load on the Apple GPU | OK |
| LoaderGltfCompressed | `webgpu_loader_gltf_compressed` | camera light at the source camera's position; loads in `onRendererInitialized` | OK |
| ShadowmapArray | `webgpu_shadowmap_array` | `BasicShadowMap` -> the shared renderer's PCF; tile helper dropped; 40π s loop; frames the shapes (1500-unit ground) | Upstream: `TileShadowNode` adds its tile lights next to the light (eight unnamed rows under `SunGroup`) |
| GeometryTextShapes | `webgl_geometry_text_shapes` | frames the text | OK |
| GeometryTextStroke | `webgl_geometry_text_stroke` | frames the three messages | OK |
| ModifierSimplifier | `webgl_modifier_simplifier` | light at the source camera's position; a counter drops stale simplifications | OK |
| ModifierEdgesplit | `webgl_modifier_edgesplit` | disposes replaced split geometries | OK |
| ClippingIntersection | `webgl_clipping_intersection` | per-material clipping planes -> a `ClippingGroup`; `PlaneHelper`s and `showHelpers` dropped for the `clippingHelpers` overlay (2026-10-16); `alphaToCoverage` smooths the cut in MSAA views | OK |
| MaterialsModified | `webgl_materials_modified` | `onBeforeCompile` twist -> TSL `positionNode` and `normalNode` on `MeshNormalNodeMaterial`; 2π s loop | OK |

Removed: CameraLogarithmicDepthBuffer (renderer-level option, see What fits); CameraArray (runtime multi-view, see What fits; 2026-10-13).

## Candidates (2026-10-11)

Every `src_examples` source sorted against What fits (611 files at HEAD, 608 at r186). Selection rules:

- An example with both a `webgl_*` and a `webgpu_*` version converts from the `webgpu_*` one. Renamed twins count too: `webgl_gpgpu_birds` -> `webgpu_compute_birds`, `gpgpu_water` -> `compute_water`, `materials_physical_clearcoat` -> `clearcoat`, `materials_physical_transmission` -> `materials_transmission`, `materials_subsurface_scattering` -> `materials_sss`, `shaders_ocean` -> `ocean`, `shaders_sky` -> `sky`, `materials_cubemap_dynamic` -> `cubemap_dynamic`, `texture2darray(_compressed)` -> `textures_2d-array(_compressed)`, `materials_texture_partialupdate` -> `textures_partialupdate`, `materials_texture_anisotropy` -> `textures_anisotropy`, `rendertarget_texture2darray` -> `rendertarget_2d-array_3d`, `panorama_equirectangular` -> `equirectangular`, `video_panorama_equirectangular` -> `video_panorama`, `postprocessing_unreal_bloom(_selective)` -> `postprocessing_bloom(_selective)`, `postprocessing_sao / ssao / gtao` -> `postprocessing_ao`, `postprocessing_taa` -> `postprocessing_traa`.
- `webgl_*` / `misc_*` only: kept when the scene stands on its own once the host-provided parts are dropped. GLSL (`ShaderMaterial`, `onBeforeCompile`) is rewritten in TSL only when the shader is small and not the subject.
- **The conversion does not change `@io-gui/three`** (or the demo host beyond its `DOCUMENTS` entry). An example that needs a framework feature or fix stays TODO with its tag in **Blocked by** (see Blockers below) until that work is done. Bloom of the scene color is the document's `bloom` (Map). Other cosmetic post-processing (vignette, blur, FXAA, emissive bloom) is dropped and noted, so the scene converts now; the full look waits for `document-pipeline`.
- "Verify per view" marks content that updates itself for the drawing camera (`onBeforeRender`, LOD, reflectors, splat sorting, occlusion queries): it should work through any view, but check it with two views open before calling the example done.

| Example | Source | Status | Blocked by | Notes |
|---|---|---|---|---|
| **Completed** | | | | |
| AnimationGroups | `misc_animation_groups` | completed | — | see Audit |
| AnimationKeyframes | `webgl_animation_keyframes` | completed | — | see Audit |
| AnimationRetargeting | `webgpu_animation_retargeting` | completed | — | see Audit |
| AnimationRetargetingReadyplayer | `webgpu_animation_retargeting_readyplayer` | completed | — | see Audit |
| AnimationSkinningAdditiveBlending | `webgl_animation_skinning_additive_blending` | completed | — | see Audit; open: `crossfade-state` |
| AnimationSkinningBlending | `webgl_animation_skinning_blending` | completed | — | see Audit; live document (ADR-0009); open: `crossfade-state` |
| Backdrop | `webgpu_backdrop` | completed | — | see Audit |
| BackdropArea | `webgpu_backdrop_area` | completed | — | see Audit |
| Camera | `webgpu_camera` | completed | — | see Audit |
| ComputeTexture | `webgpu_compute_texture` | completed | — | see Audit |
| Geometries | `webgl_geometries` | completed | — | see Audit |
| GeometryColors | `webgl_geometry_colors` | completed | — | see Audit |
| GeometryConvex | `webgl_geometry_convex` | completed | — | see Audit |
| VolumePerlin | `webgpu_volume_perlin` | completed | — | see Audit |
| **Animation and morphs** | | | | |
| AnimationKeys | `misc_animation_keys` | completed | — | see Audit; source camera kept as scene camera (`framing-motion`) |
| AnimationMultiple | `webgl_animation_multiple` | completed | — | see Audit |
| AnimationSkinningMorph | `webgl_animation_skinning_morph` | TODO | — | robot states / emotes / expressions; emote buttons make it a live document (ADR-0009), like skinning blending |
| Skinning | `webgpu_skinning` | completed | — | see Audit |
| SkinningInstancing | `webgpu_skinning_instancing` | completed | — | see Audit |
| SkinningPoints | `webgpu_skinning_points` | completed | — | see Audit |
| SkinningInstancingIndividual | `webgpu_skinning_instancing_individual` | TODO | `per-frame-gpu` | `renderer.compute(computeSkinning)` each frame |
| InstancingMorph | `webgpu_instancing_morph` | completed | — | see Audit |
| Morphtargets | `webgpu_morphtargets` | completed | — | see Audit |
| MorphtargetsFace | `webgpu_morphtargets_face` | completed | — | see Audit |
| MorphtargetsHorse | `webgl_morphtargets_horse` | completed | — | see Audit |
| MorphtargetsSphere | `webgl_morphtargets_sphere` | TODO | — | points on the morphing vertices: WebGPU points are 1 px, and `Sprite` points from an instanced attribute do not follow morph targets |
| LoaderBvh | `webgl_loader_bvh` | TODO | — | the skeleton is the content: drawn by the skeleton helpers overlay (bones without a skinned mesh draw too; on in the demo host). Bones have no geometry, so framing falls back to a 0.2 box at the origin: keep the source camera, or wait for a framing box (`framing-motion`) |
| LoaderMd2 | `webgl_loader_md2` | TODO | — | `MD2Character`: skin, weapon and animation as dropdowns |
| LoaderMdd | `webgl_loader_mdd` | completed | — | see Audit |
| LoaderGltfAnimationPointer | `webgl_loader_gltf_animation_pointer` | TODO | — | `KHR_animation_pointer` |
| Watch | `webgl_watch` | TODO | — | hands follow the wall clock with tweens: derive them from timeline time; TAA and bloom dropped |
| **Geometry and objects** | | | | |
| Buffergeometry | `webgl_buffergeometry` | completed | — | see Audit |
| BuffergeometryIndexed | `webgl_buffergeometry_indexed` | completed | — | see Audit |
| BuffergeometryDrawrange | `webgl_buffergeometry_drawrange` | TODO | — | integrated particle motion (advance by `delta`); 1 px points -> `Sprite` |
| BuffergeometryInstancingInterleaved | `webgl_buffergeometry_instancing_interleaved` | TODO | — | |
| BuffergeometryLines | `webgl_buffergeometry_lines` | completed | — | see Audit |
| BuffergeometryLinesIndexed | `webgl_buffergeometry_lines_indexed` | completed | — | see Audit |
| BuffergeometryPoints | `webgl_buffergeometry_points` | TODO | — | 1 px points -> `Sprite` |
| BuffergeometryPointsInterleaved | `webgl_buffergeometry_points_interleaved` | TODO | — | 1 px points -> `Sprite` |
| GeometryColorsLookuptable | `webgl_geometry_colors_lookuptable` | TODO | — | the legend is a second ortho scene drawn over the view: drop it, or a sprite in the scene |
| GeometryCube | `webgl_geometry_cube` | completed | — | see Audit |
| GeometryExtrudeShapes | `webgl_geometry_extrude_shapes` | completed | — | see Audit |
| GeometryExtrudeSplines | `webgl_geometry_extrude_splines` | TODO | — | spline camera as a named scene camera (like `TrainCamera`) |
| GeometryLoft | `webgpu_geometry_loft` | completed | — | see Audit; axis views see the curtain from outside |
| GeometryMinecraft | `webgl_geometry_minecraft` | TODO | — | `FirstPersonControls` dropped |
| GeometryNurbs | `webgl_geometry_nurbs` | TODO | — | pointer rotation dropped |
| GeometryShapes | `webgl_geometry_shapes` | TODO | — | pointer rotation dropped |
| GeometryTeapot | `webgl_geometry_teapot` | completed | — | see Audit |
| GeometryTerrain | `webgl_geometry_terrain` | TODO | — | `FirstPersonControls` dropped |
| GeometryText | `webgl_geometry_text` | TODO | — | typing -> a `text` property |
| GeometryTextShapes | `webgl_geometry_text_shapes` | completed | — | see Audit |
| GeometryTextStroke | `webgl_geometry_text_stroke` | completed | — | see Audit |
| GeometryCsg | `webgl_geometry_csg` | TODO | `dependency` | `three-bvh-csg` |
| GeneratorBuilding | `webgpu_generator_building` | TODO | `renderer-on-change` | `timeOfDay` re-bakes the sky environment (`fromScene`); the generator controls rebuild geometry only |
| GeneratorCity | `webgpu_generator_city` | TODO | `renderer-on-change`, `per-frame-gpu` | bloom dropped; the probe grid bakes over several frames, and `seed` / `timeOfDay` restart the bake and re-bake the sky environment |
| InstanceMesh | `webgpu_instance_mesh` | completed | — | see Audit |
| InstancePath | `webgpu_instance_path` | completed | — | see Audit |
| InstanceSprites | `webgpu_instance_sprites` | completed | — | see Audit |
| InstanceUniform | `webgpu_instance_uniform` | completed | — | see Audit |
| InstancePoints | `webgpu_instance_points` | TODO | `per-frame-gpu` | `renderer.compute(computeSize)` each frame; inset view -> scene camera |
| InstancingDynamic | `webgl_instancing_dynamic` | TODO | — | |
| InstancingPerformance | `webgl_instancing_performance` | TODO | — | method (instanced / merged / naive) as a dropdown |
| InstancingScatter | `webgl_instancing_scatter` | TODO | — | `MeshSurfaceSampler`; resample button |
| MeshBatch | `webgpu_mesh_batch` | completed | — | see Audit |
| Lod | `webgl_lod` | TODO | — | verify per view (`LOD.autoUpdate` uses the drawing camera) |
| Marchingcubes | `webgl_marchingcubes` | TODO | — | `ToonShader` material options dropped or ported to TSL |
| ModifierCurve | `webgpu_modifier_curve` | completed | — | see Audit |
| ModifierEdgesplit | `webgl_modifier_edgesplit` | completed | — | see Audit |
| ModifierSimplifier | `webgl_modifier_simplifier` | completed | — | see Audit |
| ModifierSubdivision | `webgl_modifier_subdivision` | TODO | — | |
| MathOrientationTransform | `webgl_math_orientation_transform` | TODO | — | `setTimeout` target picks -> timeline schedule |
| Helpers | `webgl_helpers` | TODO | — | normal / tangent / box helpers are the subject: content in a `Helpers` group (Scene graph and picking); the light helpers come from the overlay |
| LinesColors | `webgl_lines_colors` | TODO | — | pointer-driven camera dropped |
| LinesDashed | `webgl_lines_dashed` | completed | — | see Audit |
| LinesFat | `webgpu_lines_fat` | completed | — | see Audit |
| LinesFatWireframe | `webgpu_lines_fat_wireframe` | completed | — | see Audit |
| Sprites | `webgpu_sprites` | completed | — | see Audit |
| PointsBillboards | `webgl_points_billboards` | TODO | — | 1 px points -> `Sprite` |
| PointsSprites | `webgl_points_sprites` | TODO | — | 1 px points -> `Sprite` |
| PointsWaves | `webgl_points_waves` | TODO | — | `ShaderMaterial` -> TSL sprite material |
| PointsDynamic | `webgl_points_dynamic` | TODO | `document-pipeline` | the post chain is part of the subject |
| GaussianSplat | `webgpu_gaussian_splat` | completed | — | see Audit |
| **Clipping** | | | | |
| Clipping | `webgpu_clipping` | completed | — | see Audit |
| ClippingAdvanced | `webgl_clipping_advanced` | TODO | — | `ClippingGroup` |
| ClippingIntersection | `webgl_clipping_intersection` | completed | — | see Audit |
| ClippingStencil | `webgpu_clipping_stencil` | TODO | `renderer-option` | needs `stencil: true` |
| **Materials and textures** | | | | |
| Materials | `webgpu_materials` | completed | — | see Audit |
| MaterialsAlphahash | `webgpu_materials_alphahash` | completed | — | see Audit |
| MaterialsArrays | `webgpu_materials_arrays` | completed | — | see Audit |
| MaterialsBasic | `webgpu_materials_basic` | completed | — | see Audit |
| MaterialsCubemapMipmaps | `webgpu_materials_cubemap_mipmaps` | completed | — | see Audit |
| MaterialsDisplacementmap | `webgpu_materials_displacementmap` | completed | — | see Audit |
| MaterialsEnvmaps | `webgpu_materials_envmaps` | completed | — | see Audit |
| MaterialsEnvmapsGroundprojected | `webgpu_materials_envmaps_groundprojected` | TODO | `transmission-views` | `GroundedSkybox` dominates bounds (`framing-scenery`); glass is `transmission: 1` |
| MaterialsEnvmapsBpcem | `webgpu_materials_envmaps_bpcem` | TODO | `per-frame-gpu` | `CubeCamera.update` each frame |
| MaterialsLightmap | `webgpu_materials_lightmap` | completed | — | see Audit |
| MaterialsMatcap | `webgpu_materials_matcap` | completed | — | see Audit |
| MaterialsRetroreflection | `webgpu_materials_retroreflection` | completed | — | see Audit |
| MaterialsSss | `webgpu_materials_sss` | completed | — | see Audit |
| MaterialsToon | `webgpu_materials_toon` | completed | — | see Audit; toon outline post dropped |
| MaterialsTransmission | `webgpu_materials_transmission` | TODO | `transmission-views` |  |
| MaterialxNoise | `webgpu_materialx_noise` | completed | — | see Audit |
| LoaderMaterialx | `webgpu_loader_materialx` | TODO | `transmission-views` | the transmission test files |
| Clearcoat | `webgpu_clearcoat` | completed | — | see Audit |
| CubemapAdjustments | `webgpu_cubemap_adjustments` | completed | — | see Audit |
| CubemapMix | `webgpu_cubemap_mix` | completed | — | see Audit |
| CubemapDynamic | `webgpu_cubemap_dynamic` | TODO | `per-frame-gpu` | `CubeCamera.update` each frame |
| ParallaxUv | `webgpu_parallax_uv` | completed | — | see Audit |
| ProceduralTexture | `webgpu_procedural_texture` | completed | — | see Audit |
| MaterialsBlending | `webgl_materials_blending` | completed | — | see Audit |
| MaterialsBlendingCustom | `webgl_materials_blending_custom` | TODO | — | |
| MaterialsBumpmap | `webgl_materials_bumpmap` | completed | — | see Audit |
| MaterialsCar | `webgl_materials_car` | TODO | `transmission-views` | wheel spin and grid scroll from time; body / detail / glass colors; glass is `transmission: 1` |
| MaterialsCubemap | `webgl_materials_cubemap` | completed | — | see Audit |
| MaterialsCubemapRefraction | `webgl_materials_cubemap_refraction` | completed | — | see Audit |
| MaterialsEnvmapsExr | `webgl_materials_envmaps_exr` | completed | — | see Audit |
| MaterialsEnvmapsFasthdr | `webgl_materials_envmaps_fasthdr` | TODO | `transmission-views` | `transmission: 1` material |
| MaterialsEnvmapsHdr | `webgl_materials_envmaps_hdr` | completed | — | see Audit |
| MaterialsModified | `webgl_materials_modified` | completed | — | see Audit |
| MaterialsNormalmap | `webgl_materials_normalmap` | completed | — | see Audit |
| MaterialsNormalmapObjectSpace | `webgl_materials_normalmap_object_space` | completed | — | see Audit |
| MaterialsPhysicalTransmissionAlpha | `webgl_materials_physical_transmission_alpha` | TODO | `transmission-views` |  |
| MaterialsTextureRotation | `webgl_materials_texture_rotation` | completed | — | see Audit |
| Equirectangular | `webgpu_equirectangular` | completed | — | see Audit |
| PanoramaCube | `webgl_panorama_cube` | completed | — | see Audit |
| Textures2dArray | `webgpu_textures_2d-array` | completed | — | see Audit |
| Textures2dArrayCompressed | `webgpu_textures_2d-array_compressed` | completed | — | see Audit |
| TexturesPartialupdate | `webgpu_textures_partialupdate` | TODO | `per-frame-gpu` | `copyTextureToTexture` on a timer |
| LoaderTextureKtx2 | `webgpu_loader_texture_ktx2` | completed | — | see Audit |
| LoaderTextureDds | `webgl_loader_texture_dds` | TODO | — | BC formats: desktop GPUs only |
| LoaderTextureExr | `webgl_loader_texture_exr` | completed | — | see Audit |
| LoaderTextureHdr | `webgl_loader_texture_hdr` | completed | — | see Audit |
| LoaderTextureTga | `webgl_loader_texture_tga` | completed | — | see Audit |
| LoaderTextureTiff | `webgl_loader_texture_tiff` | completed | — | see Audit |
| LoaderTextureUltrahdr | `webgl_loader_texture_ultrahdr` | completed | — | see Audit |
| Tonemapping | `webgpu_tonemapping` | completed | — | see Audit |
| VolumeCloud | `webgpu_volume_cloud` | completed | — | see Audit |
| MaterialsNodeProxy | `webgpu_materials_node_proxy` | TODO | `three-upgrade` | not in r186 |
| **TSL and procedural** | | | | |
| TslAngularSlicing | `webgpu_tsl_angular_slicing` | completed | — | see Audit |
| TslEarth | `webgpu_tsl_earth` | completed | — | see Audit |
| TslGalaxy | `webgpu_tsl_galaxy` | completed | — | see Audit |
| TslHalftone | `webgpu_tsl_halftone` | completed | — | see Audit |
| TslProceduralTerrain | `webgpu_tsl_procedural_terrain` | TODO | `transmission-views` | pointer drag dropped; the water is `transmission: 1` |
| TslRagingSea | `webgpu_tsl_raging_sea` | completed | — | see Audit |
| TslVfxFlames | `webgpu_tsl_vfx_flames` | completed | — | see Audit |
| TslVfxTornado | `webgpu_tsl_vfx_tornado` | completed | — | see Audit |
| TslWood | `webgpu_tsl_wood` | completed | — | see Audit |
| TslVfxLinkedparticles | `webgpu_tsl_vfx_linkedparticles` | TODO | `per-frame-gpu`, `document-pipeline` | |
| TslComputeAttractorsParticles | `webgpu_tsl_compute_attractors_particles` | TODO | `per-frame-gpu` | attractor `TransformControls` dropped |
| TslOcclusionDither | `webgpu_tsl_occlusion_dither` | TODO | `three-upgrade` | not in r186 |
| **Compute simulations** | | | | |
| ComputeBirds | `webgpu_compute_birds` | TODO | `per-frame-gpu` | pointer predator dropped |
| ComputeCloth | `webgpu_compute_cloth` | TODO | `per-frame-gpu` | |
| ComputeParticles | `webgpu_compute_particles` | TODO | `per-frame-gpu` | pointer hit dropped |
| ComputeParticlesFluid | `webgpu_compute_particles_fluid` | TODO | `per-frame-gpu` | pointer force dropped |
| ComputeParticlesRain | `webgpu_compute_particles_rain` | TODO | `per-frame-gpu` | also renders a collision depth target each frame |
| ComputeParticlesSnow | `webgpu_compute_particles_snow` | TODO | `per-frame-gpu`, `document-pipeline` | collision target as in Rain |
| ComputePoints | `webgpu_compute_points` | TODO | `per-frame-gpu` | pointer dropped |
| ComputeTexture3d | `webgpu_compute_texture_3d` | TODO | `per-frame-gpu` | |
| ComputeWater | `webgpu_compute_water` | TODO | `per-frame-gpu` | pointer ripples dropped (ducks and waves remain) |
| VolumeFire | `webgpu_volume_fire` | TODO | `per-frame-gpu`, `document-pipeline` | |
| **Lights, shadows, environment** | | | | |
| CustomFog | `webgpu_custom_fog` | TODO | `renderer-on-change` | sun `elevation` / `azimuth` re-bake the sky environment (`fromScene`) |
| FogHeight | `webgpu_fog_height` | completed | — | see Audit |
| CustomFogBackground | `webgpu_custom_fog_background` | TODO | `document-pipeline` | fog composed in post |
| CustomFogScattering | `webgpu_custom_fog_scattering` | TODO | `document-pipeline` | |
| Lensflares | `webgpu_lensflares` | completed | — | see Audit |
| Lightprobe | `webgpu_lightprobe` | completed | — | see Audit; open: `shared-refresh` (probe `intensity`) |
| LightprobeCubecamera | `webgpu_lightprobe_cubecamera` | completed | — | see Audit |
| Lightprobes | `webgpu_lightprobes` | TODO | `renderer-on-change` | bake in `onRendererInitialized`; the resolution control rebakes |
| LightprobesComplex | `webgpu_lightprobes_complex` | TODO | `renderer-on-change` | as Lightprobes |
| LightprobesSponza | `webgpu_lightprobes_sponza` | TODO | `renderer-on-change` | as Lightprobes |
| LightsCustom | `webgpu_lights_custom` | completed | — | see Audit |
| LightsIesSpotlight | `webgpu_lights_ies_spotlight` | completed | — | see Audit |
| LightsPhong | `webgpu_lights_phong` | completed | — | see Audit |
| LightsPhysical | `webgpu_lights_physical` | completed | — | see Audit |
| LightsPointlights | `webgpu_lights_pointlights` | completed | — | see Audit |
| LightsProjector | `webgpu_lights_projector` | completed | — | see Audit |
| LightsRectarealight | `webgpu_lights_rectarealight` | completed | — | see Audit; source camera kept as scene camera (`framing-scenery`) |
| LightsSelective | `webgpu_lights_selective` | completed | — | see Audit |
| LightsSpotlight | `webgpu_lights_spotlight` | completed | — | see Audit |
| LightsSunlight | `webgpu_lights_sunlight` | TODO | `renderer-on-change` | `azimuth` / `elevation` re-bake the sky environment (`fromScene`). The cascades refit per camera per frame (`ShadowNode` keys updates by camera), so they work per view |
| LightsHemisphere | `webgl_lights_hemisphere` | TODO | — | sky dome `ShaderMaterial` -> TSL gradient |
| LightsSpotlights | `webgl_lights_spotlights` | TODO | — | tween.js (wall clock) -> derive from time |
| LightsDynamic | `webgpu_lights_dynamic` | TODO | `renderer-option` | `renderer.lighting = new DynamicLighting()` |
| LightsClustered | `webgpu_lights_clustered` | TODO | `renderer-option` | `renderer.lighting` (clustered); FXAA dropped |
| Shadowmap | `webgpu_shadowmap` | completed | — | see Audit; source camera kept as scene camera (`framing-scenery`) |
| ShadowmapArray | `webgpu_shadowmap_array` | completed | — | see Audit |
| ShadowmapPointlight | `webgpu_shadowmap_pointlight` | completed | — | see Audit |
| ShadowmapPerformance | `webgl_shadowmap_performance` | TODO | — | |
| ShadowmapOpacity | `webgpu_shadowmap_opacity` | TODO | `renderer-option` | `shadowMap.transmitted` |
| ShadowmapVsm | `webgpu_shadowmap_vsm` | TODO | `renderer-option` | `shadowMap.type = VSMShadowMap` |
| ShadowmapCsm | `webgpu_shadowmap_csm` | TODO | `view-camera` | `CSMShadowNode` splits one camera's frustum |
| ShadowmapProgressive | `webgpu_shadowmap_progressive` | TODO | `per-frame-gpu` | `ProgressiveLightMap.update(camera)` each frame; `TransformControls` dropped |
| ShadowContact | `webgpu_shadow_contact` | TODO | `per-frame-gpu` | renders a depth target from below each frame |
| Shadowmesh | `webgl_shadowmesh` | TODO | `renderer-option` | `ShadowMesh` writes stencil |
| Caustics | `webgpu_caustics` | TODO | `renderer-option` | `shadowMap.transmitted` |
| Occlusion | `webgpu_occlusion` | completed | — | see Audit |
| Sky | `webgpu_sky` | TODO | `renderer-on-change` | sky controls regenerate the environment (`CubeCamera`); the AnimationKeyframes `SkyMesh` pattern covers the first bake |
| Ocean | `webgpu_ocean` | TODO | `renderer-on-change` | sky `elevation` / `azimuth` re-bake the environment (`fromScene`); bloom dropped; sky / water dominate bounds (`framing-scenery`) |
| Water | `webgpu_water` | completed | — | see Audit |
| BackdropWater | `webgpu_backdrop_water` | TODO | `document-pipeline` | the underwater mask is post |
| Mirror | `webgpu_mirror` | completed | — | see Audit |
| Reflection | `webgpu_reflection` | completed | — | see Audit |
| ReflectionBlurred | `webgpu_reflection_blurred` | completed | — | see Audit |
| ReflectionRoughness | `webgpu_reflection_roughness` | completed | — | see Audit |
| Refraction | `webgpu_refraction` | completed | — | see Audit |
| Portal | `webgpu_portal` | TODO | `view-camera` | the portal material is `pass(scenePortal, camera)` with the main camera |
| PmremCubemap | `webgpu_pmrem_cubemap` | completed | — | see Audit |
| PmremEquirectangular | `webgpu_pmrem_equirectangular` | completed | — | see Audit |
| PmremScene | `webgpu_pmrem_scene` | completed | — | see Audit |
| Particles | `webgpu_particles` | completed | — | see Audit |
| ParticlesSoft | `webgpu_particles_soft` | completed | — | see Audit |
| Layers | `webgpu_layers` | TODO | `view-camera` | toggles the camera's layers |
| Sandbox | `webgpu_sandbox` | completed | — | see Audit |
| **Post-processing with scene-dependent effects** | | | | |
| PostprocessingAo | `webgpu_postprocessing_ao` | TODO | `document-pipeline` | |
| PostprocessingBloom | `webgpu_postprocessing_bloom` | TODO | `document-pipeline` | |
| PostprocessingBloomEmissive | `webgpu_postprocessing_bloom_emissive` | TODO | `document-pipeline` | needs an emissive MRT output |
| PostprocessingBloomSelective | `webgpu_postprocessing_bloom_selective` | TODO | `document-pipeline` | per-object bloom flag via MRT; click toggling dropped |
| PostprocessingDof | `webgpu_postprocessing_dof` | TODO | `document-pipeline` | |
| PostprocessingDofBasic | `webgpu_postprocessing_dof_basic` | TODO | `document-pipeline` | click-to-focus dropped |
| PostprocessingFog | `webgpu_postprocessing_fog` | TODO | `document-pipeline` | |
| PostprocessingGodrays | `webgpu_postprocessing_godrays` | TODO | `document-pipeline` | needs the light from the scene |
| PostprocessingLensflare | `webgpu_postprocessing_lensflare` | TODO | `document-pipeline` | |
| PostprocessingOutline | `webgpu_postprocessing_outline` | TODO | `document-pipeline` | overlaps the selection outline overlay |
| PostprocessingSsgi | `webgpu_postprocessing_ssgi` | TODO | `document-pipeline` | |
| PostprocessingSsgiBallpool | `webgpu_postprocessing_ssgi_ballpool` | TODO | `document-pipeline` | pointer pushing dropped |
| PostprocessingSsr | `webgpu_postprocessing_ssr` | TODO | `document-pipeline` | |
| PostprocessingSsrDenoise | `webgpu_postprocessing_ssr_denoise` | TODO | `document-pipeline` | |
| PostprocessingSss | `webgpu_postprocessing_sss` | TODO | `document-pipeline` | |
| Oit | `webgpu_oit` | TODO | `document-pipeline` | |
| VolumeLighting | `webgpu_volume_lighting` | TODO | `document-pipeline` | |
| VolumeLightingRectarea | `webgpu_volume_lighting_rectarea` | TODO | `document-pipeline` | |
| VolumeLightingTraa | `webgpu_volume_lighting_traa` | TODO | `document-pipeline` | |
| VolumeCaustics | `webgpu_volume_caustics` | TODO | `document-pipeline`, `renderer-option` | `shadowMap.transmitted` |
| Vxgi | `webgpu_vxgi` | TODO | `document-pipeline` | |
| VxgiSponza | `webgpu_vxgi_sponza` | TODO | `document-pipeline` | |
| **Loaders** | | | | |
| LoaderGltf | `webgpu_loader_gltf` | completed | — | see Audit |
| LoaderGltfAnisotropy | `webgpu_loader_gltf_anisotropy` | completed | — | see Audit |
| LoaderGltfCompressed | `webgpu_loader_gltf_compressed` | completed | — | see Audit |
| LoaderGltfDispersion | `webgpu_loader_gltf_dispersion` | in progress | `transmission-views` | converted, see Audit; WebGPU errors while playing |
| LoaderGltfIridescence | `webgpu_loader_gltf_iridescence` | in progress | `transmission-views` | converted, see Audit; WebGPU errors while playing |
| LoaderGltfSheen | `webgpu_loader_gltf_sheen` | completed | — | see Audit |
| LoaderGltfTransmission | `webgpu_loader_gltf_transmission` | in progress | `transmission-views` | converted, see Audit; WebGPU errors while playing |
| LoaderGltfDiffuseRoughness | `webgpu_loader_gltf_diffuse_roughness` | TODO | `three-upgrade` | not in r186 |
| LoaderGltfAvif | `webgl_loader_gltf_avif` | completed | — | see Audit |
| LoaderGltfInstancing | `webgl_loader_gltf_instancing` | completed | — | see Audit |
| LoaderGltfVariants | `webgl_loader_gltf_variants` | completed | — | see Audit |
| Loader3dm | `webgl_loader_3dm` | TODO | — | rhino3dm wasm from the CDN |
| Loader3ds | `webgl_loader_3ds` | completed | — | see Audit |
| Loader3mf | `webgl_loader_3mf` | completed | — | see Audit |
| Loader3mfMaterials | `webgl_loader_3mf_materials` | completed | — | see Audit |
| LoaderAmf | `webgl_loader_amf` | completed | — | see Audit |
| LoaderCollada | `webgl_loader_collada` | completed | — | see Audit |
| LoaderColladaKinematics | `webgl_loader_collada_kinematics` | TODO | — | tween + `setTimeout` -> joint values from time |
| LoaderColladaSkinning | `webgl_loader_collada_skinning` | completed | — | see Audit |
| LoaderDraco | `webgl_loader_draco` | completed | — | see Audit |
| LoaderFbx | `webgl_loader_fbx` | completed | — | see Audit |
| LoaderFbxNurbs | `webgl_loader_fbx_nurbs` | completed | — | see Audit |
| LoaderGcode | `webgl_loader_gcode` | completed | — | see Audit |
| LoaderKmz | `webgl_loader_kmz` | completed | — | see Audit |
| LoaderLdraw | `webgl_loader_ldraw` | TODO | — | model dropdown |
| LoaderNrrd | `webgl_loader_nrrd` | TODO | — | `VolumeSlice` canvas textures |
| LoaderObj | `webgl_loader_obj` | completed | — | see Audit |
| LoaderPcd | `webgl_loader_pcd` | completed | — | see Audit |
| LoaderPdb | `webgl_loader_pdb` | TODO | — | `CSS2DRenderer` atom labels dropped |
| LoaderPly | `webgl_loader_ply` | completed | — | see Audit |
| LoaderStl | `webgl_loader_stl` | completed | — | see Audit |
| LoaderSvg | `webgl_loader_svg` | completed | — | see Audit |
| LoaderTtf | `webgl_loader_ttf` | TODO | — | typing -> a `text` property |
| LoaderUsdz | `webgl_loader_usdz` | completed | — | see Audit |
| LoaderVox | `webgl_loader_vox` | completed | — | see Audit |
| LoaderVrml | `webgl_loader_vrml` | completed | — | see Audit |
| LoaderXyz | `webgl_loader_xyz` | completed | — | see Audit |
| LoaderIfc | `webgl_loader_ifc` | TODO | `dependency` | `web-ifc` |

Not candidates:

- **Out of scope** (as asked): `webxr_*`, `webgpu_xr_*`, `css2d_*`, `css3d_*`, `svg_*`, plus `physics_*` (external engines stepping in wall-clock time), `webaudio_*`, `games_fps`, `index`.
- **WebGL twins** of the webgpu examples above (81 by name, plus the renamed ones under the selection rules).
- **Renderer-level or renderer tests**: `camera_logarithmicdepthbuffer`, `reversed_depth_buffer`, `centroid_sampling`, `multisampled_renderbuffers`, `hdr`, `compile_async`, `furnace_test`, `pmrem_test`, `test_memory`, `webgl_test_memory2`, `webgl_test_wide_gamut`, `performance`, `performance_renderbundle`, `multiple_canvas`, `display_stereo`, `webgl_effects_*`, `webgl_worker_offscreencanvas`, `webgl_buffergeometry_glbufferattribute`, `webgl_clipculldistance`, `webgl_ubo`, `webgl_ubo_arrays`, `webgl_read_float_buffer`, `webgpu_renderer_pathtracer` (post-r186).
- **Custom render loops, render targets, split screens**: `depth_texture`, `rtt`, `multiple_elements`, `webgl_multiple_elements_text`, `multiple_rendertargets(_readback)`, `webgl_multiple_scenes_comparison`, `webgl_multiple_views`, `rendertarget_2d-array_3d`, `webgl_framebuffer_texture`, `mrt`, `mrt_mask`, `deferred`, `webgl_simple_gi`, `texturegather`, `texturegrad`, `materials_texture_manualmipmap`, `textures_anisotropy`, `webgl_materials_texture_filters`, `webgl_shadowmap_viewer`, `storage_buffer`, `struct_drawindirect`, `compute_reduce`, `compute_sort_bitonic`, `compute_rasterizer(_ibl)`, `compute_texture_pingpong`, `shadertoy`, `tsl_interoperability`.
- **Screen-space filters**: these are view pipelines (`pipelineTypes.register` in the host), not documents: `postprocessing`, `postprocessing_3dlut`, `_afterimage`, `_anamorphic`, `_ca`, `_difference`, `_direct`, `_fxaa`, `_masking`, `_motion_blur`, `_pixel`, `_radial_blur`, `_retro`, `_smaa`, `_sobel`, `_ssaa`, `_transition`, `_traa`, `upscaling_fsr1`, `upscaling_taau`; webgl only: `postprocessing_advanced`, `_backgrounds`, `_glitch`, `_procedural`, `_rgb_halftone`, `_dof2`.
- **Interaction is the subject** (tools and operators): `misc_boxselection`, `misc_controls_*`, `misc_raycaster_helper`, `webgl_animation_skinning_ik`, `webgl_animation_walk`, `webgl_decals`, `webgl_geometry_spline_editor`, `webgl_geometry_terrain_raycast`, `webgl_interactive_*`, `webgl_instancing_raycast`, `lines_fat_raycasting`, `webgl_math_obb`, `webgl_modifier_curve_instanced`, `webgl_raycaster_*`, `sculpt`, `webgl_materials_texture_canvas`, `webgl_loader_md2_control`, `compute_geometry`, `webgl_buffergeometry_selective_draw`, `webgl_batch_lod_bvh`.
- **DOM, media, editors**: `materials_texture_html`, `materials_video`, `webgl_materials_video_webcam`, `webgl_morphtargets_webcam`, `video_frame`, `video_panorama`, `webgl_video_kinect`, `compute_audio`, `webgl_loader_texture_lottie`, `webgl_loader_imagebitmap`, `misc_uv_tests`, `tsl_editor`, `tsl_transpiler`, `tsl_graph`.
- **GLSL is the subject** (TSL counterparts exist among the webgpu examples): `webgl_buffergeometry_attributes_integer`, `_attributes_none`, `_custom_attributes_particles`, `_instancing`, `_instancing_billboards`, `_rawshader`, `webgl_custom_attributes*`, `webgl_materials_channels`, `webgl_materials_cubemap_render_to_mipmaps`, `webgl_materials_wireframe`, `webgl_modifier_tessellation`, `webgl_random_uv`, `webgl_shader`, `webgl_shader_lava`, `webgl_texture2darray_layerupdate`, `webgl_texture3d`, `webgl_texture3d_partialupdate`, `webgl_volume_instancing`, `webgl_gpgpu_birds_gltf`, `webgl_gpgpu_protoplanet`, `webgl_shadowmap_pcss` (patches `ShaderChunk`).
- **Exporters** (`misc_exporter_*`): export buttons over a sample scene; export is editor I/O, not document content.
- **Camera-driven streaming** (external libraries): `webgl_loader_3dtiles`, `webgl_loader_gltf_progressive_lod`.
- **Duplicates**: `webgl_tsl_clearcoat`, `webgl_tsl_shadowmap`, `webgl_tsl_skinning`, `webgl_tsl_instancing` (TSL on `WebGLRenderer` through `WebGLNodesHandler`; same content as `clearcoat`, `shadowmap`, `skinning`, `instancing_performance`), `webgl_buffergeometry_uint` (as `buffergeometry`), `webgl_loader_texture_ktx` and `_pvrtc` (legacy formats; `loader_texture_ktx2` covers them).

### Blockers

Features or fixes outside the examples. Each one unblocks the rows tagged with it; until then those stay TODO.

- **`document-pipeline`**: a document cannot bring a post-processing graph. Pipelines are registered by the host (`pipelineTypes.register` in `IoEditorExample.ts`) and picked per `View.pipeline` (ADR-0006). Needed: a document-declared builder (`PostProcessingBuilder`) that views use, plus scene inputs it can read (MRT outputs such as emissive or a per-object bloom flag, the scene's lights). Also unblocks the full look of rows that drop cosmetic post. Bloom of the scene color is covered since 2026-10-16 by `Document.bloom` with a per-view override (`document-bloom` in the future-work plan); emissive bloom is not (`bloom-emissive`).
- **`per-frame-gpu`**: GPU work every tick (`renderer.compute`, `CubeCamera.update`, a render into a target). `onAnimate` gets no renderer, and `onRendererInitialized` runs once. Needed: a once-per-frame hook with the renderer, not per view draw. The simulations themselves are live documents (ADR-0009): they integrate only forward `delta` and ignore scrubbing back and wraps.
- **`renderer-on-change`**: GPU work in a property handler (rebake light probes, regenerate a sky environment). Lighter form of `per-frame-gpu`: a way to queue a task for the renderers that draw the document.
- **`view-camera`**: content bound to the camera that draws it: `CSMShadowNode` (one camera's frustum), `pass(scene, camera)` inside a material (Portal), camera layers (Layers). Views build their camera per draw (ADR-0005), so the document has no camera to bind. Needed: a per-view hook, or nodes that read the drawing camera.
- **`renderer-option`**: the shared renderer (`RenderScheduler.ts`: `{antialias: false, alpha: true}`) has no stencil buffer (three defaults `stencil` to `false`), and `renderer.lighting`, `shadowMap.type = VSMShadowMap` and `shadowMap.transmitted` are renderer-wide (ADR-0001). Needed: enable stencil on the shared renderer, or a renderer a document can ask for.
- **`three-upgrade`**: the source exists only after r186 (HEAD).
- **`dependency`**: needs an npm package the workspace does not have (`three-bvh-csg`, `web-ifc`).
- **`shared-refresh`** (three, since #34162 in r186; worked around): `NodeMaterialObserver.needsRefresh` gives an unchanged object whose material has no node properties a SHARED refresh, which uploads only shared uniform groups (`renderGroup`, `frameGroup`). A default `uniform()` is in `objectGroup`: read by a scene node (`fogNode`, `environmentNode`), its new value never reaches such objects until they or their material change. TRAA views write velocity and refresh fully, so only forward views go stale (FogHeight fog controls; CubemapMix reflections froze at their first time). Workaround: `setGroup(renderGroup)` (Map table; `Timeline.timeNode` since 2026-10-13). Standalone repro on the dev build: a plane with `MeshBasicNodeMaterial({color})` under `fogNode = fog(color, density)` keeps its first pixels after `density.value` changes, and updates with `renderGroup`. Upstream's own `webgpu_fog_height` and `webgpu_cubemap_adjustments` are stale too (checked headlessly 2026-10-14; bisected to #34162). Upstream fix three.js #34996 (merged 2026-10-14, Mugen87 cleanup `c5e5061ed0`, in the dev build `ca10fb69aa`): `NodeMaterialObserver.containsNode()` treats a custom `scene.fogNode` / `scene.environmentNode` like material node properties. FogHeight dropped its workaround on 2026-10-14; recheck it on dev (io links `../three.js`). Once a release has it, the `Timeline.timeNode` workaround can go too. Second gap, same cause (2026-10-14): built-in state the observer does not track, so changes never reach unchanged objects: texture `offset`/`repeat`/`rotation`/`center`/`matrix` (MaterialsTextureRotation), `refractionRatio`, `clearcoatRoughnessMap`, `thicknessMap`, in-place `iridescenceThicknessRange` edits. PR #35002 (closed 2026-10-14): Mugen87 asked for step-by-step fixes and issues first, and merged the three missing properties himself as #35022 (2026-10-15). Still broken on dev `ec2b7458ea`: texture transforms and `iridescenceThicknessRange`, plus three found by a property sweep: `LightProbe` `sh`/`intensity` (object-group uniform, regression in r186), `Sprite.center` and standard `envMap` (both bound to the first object or material that built the shader, older than r186). Issue kits https://claude.ai/artifact/VcLnhjZSTRQ4jQPZH39eiz (2026-10-15).
- **`transmission-views`**: transmission materials (`MeshPhysicalMaterial.transmission`, glTF `KHR_materials_transmission`) sample module-level viewport mip textures that three copies from each render target. In the editor, with several views drawing per frame, WebGPU reports `Destroyed texture [RGBA16Float, the forward view's target size] used in a submit` on every redraw (seen headless; static documents only while playing). One render target alone is clean. Check three after r186 first (#34582 skips mipmaps for a copy without a mip chain, #34826 fixes a color buffer cache check); otherwise the fix is in the render scheduler or pipelines.

## Open questions

- **`interactive-timeline`** (decided 2026-10-11, ADR-0009): live documents treat the timeline as a clock and ignore time going back. Considered: recording button presses on the timeline and replaying them, which is exact under scrubbing but makes the demo authored content. Follow-up: pass the cause of a time change to `onAnimate` (`timeline-negative-delta` in the future-work plan).
- **`inspector-refresh`**: Camera, Backdrop and the skinning examples call `dispatchMutation(...)` in `onAnimate` inside `debug:` blocks so the inspector follows per-frame values. Bundles strip debug blocks, so bundled builds stop refreshing. Alternative: the host refreshes the Document tab on `time` changes.
- **`framing-motion`**: First-show framing uses the scene's bounds at rest. AnimationKeys' box travels 30 units from a 5-unit start, so the perspective view loses it; the conversion keeps the source camera as a scene camera. Option: a document-declared framing box, or `frame-object` with several objects / a box.
- **`framing-scenery`**: First-show framing and frame-all use the whole scene's bounds, so a sky dome or a large floor dwarfs the subject. Documents work around it with `frame-object` on their model (Keyframes, the skinning and retargeting examples), or from `onRendererInitialized` for content built in the constructor (Clipping, GeometryLoft). Axis views still see enclosing scenery from outside (GeometryLoft's curtain). Option: framing skips `userData.selectable === false` scenery.
